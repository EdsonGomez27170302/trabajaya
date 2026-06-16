package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

type JobHandler struct {
	*Handler
}

func NewJobHandler(h *Handler) *JobHandler {
	return &JobHandler{Handler: h}
}

// ListJobs returns paginated, active jobs for the public job board.
func (h *JobHandler) ListJobs(c *gin.Context) {
	page, limit, offset := parsePagination(c)

	query := h.DB.Model(&models.Job{}).Where("status = ?", "active")

	if zone := c.Query("zone"); zone != "" {
		query = query.Where("zone = ?", zone)
	}
	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}
	if modality := c.Query("modality"); modality != "" {
		query = query.Where("modality = ?", modality)
	}
	if search := c.Query("search"); search != "" {
		like := "%" + search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", like, like)
	}

	var total int64
	query.Count(&total)

	var jobs []models.Job
	if err := query.Preload("Company").
		Order("is_featured DESC, created_at DESC").
		Limit(limit).Offset(offset).
		Find(&jobs).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener las ofertas")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  jobs,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// FeaturedJobs returns active, featured jobs for the public landing page.
func (h *JobHandler) FeaturedJobs(c *gin.Context) {
	limit := 3
	if l := c.Query("limit"); l != "" {
		if parsed, err := parseLimit(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	var jobs []models.Job
	if err := h.DB.Where("status = ? AND is_featured = ?", "active", true).
		Preload("Company").
		Order("created_at DESC").
		Limit(limit).
		Find(&jobs).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener las ofertas destacadas")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": jobs})
}

// GetJob returns a single job and increments its view counter.
func (h *JobHandler) GetJob(c *gin.Context) {
	id := c.Param("id")

	var job models.Job
	if err := h.DB.Preload("Company").First(&job, id).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "oferta no encontrada")
		return
	}

	h.DB.Model(&job).UpdateColumn("views_count", job.ViewsCount+1)
	job.ViewsCount++

	c.JSON(http.StatusOK, job)
}

type jobRequest struct {
	Title          string                    `json:"title" binding:"required"`
	Description    string                    `json:"description"`
	Requirements   string                    `json:"requirements"`
	Category       string                    `json:"category"`
	Modality       string                    `json:"modality"`
	Zone           string                    `json:"zone"`
	Salary         float64                   `json:"salary"`
	SalaryType     string                    `json:"salary_type"`
	HoursPerWeek   int                       `json:"hours_per_week"`
	Schedule       models.JSONStringArrayMap `json:"schedule"`
	Vacancies      int                       `json:"vacancies"`
	Status         string                    `json:"status"`
	IsFeatured     bool                      `json:"is_featured"`
	ExpiresAt      *string                   `json:"expires_at"`
	ContactPhone   string                    `json:"contact_phone"`
	ContactEmail   string                    `json:"contact_email"`
	ContactAddress string                    `json:"contact_address"`
}

// MyJobs returns all jobs (any status) belonging to the authenticated company.
func (h *JobHandler) MyJobs(c *gin.Context) {
	company, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de empresa no encontrado")
		return
	}

	var jobs []models.Job
	if err := h.DB.Where("company_id = ?", company.ID).
		Order("created_at DESC").
		Find(&jobs).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener las ofertas")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": jobs})
}

// CreateJob creates a new job posting for the authenticated company.
func (h *JobHandler) CreateJob(c *gin.Context) {
	company, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de empresa no encontrado")
		return
	}

	var req jobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	job := models.Job{
		CompanyID:      company.ID,
		Title:          req.Title,
		Description:    req.Description,
		Requirements:   req.Requirements,
		Category:       req.Category,
		Modality:       req.Modality,
		Zone:           req.Zone,
		Salary:         req.Salary,
		SalaryType:     req.SalaryType,
		HoursPerWeek:   req.HoursPerWeek,
		Schedule:       req.Schedule,
		Vacancies:      req.Vacancies,
		Status:         defaultStatus(req.Status),
		IsFeatured:     req.IsFeatured && company.Plan == "premium",
		ContactPhone:   req.ContactPhone,
		ContactEmail:   req.ContactEmail,
		ContactAddress: req.ContactAddress,
	}

	if req.ExpiresAt != nil {
		if t, err := parseTime(*req.ExpiresAt); err == nil {
			job.ExpiresAt = &t
		}
	}

	if err := h.DB.Create(&job).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo crear la oferta")
		return
	}

	c.JSON(http.StatusCreated, job)
}

// UpdateJob updates a job posting owned by the authenticated company.
func (h *JobHandler) UpdateJob(c *gin.Context) {
	company, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de empresa no encontrado")
		return
	}

	var job models.Job
	if err := h.DB.Where("id = ? AND company_id = ?", c.Param("id"), company.ID).First(&job).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "oferta no encontrada")
		return
	}

	var req jobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	job.Title = req.Title
	job.Description = req.Description
	job.Requirements = req.Requirements
	job.Category = req.Category
	job.Modality = req.Modality
	job.Zone = req.Zone
	job.Salary = req.Salary
	job.SalaryType = req.SalaryType
	job.HoursPerWeek = req.HoursPerWeek
	job.Schedule = req.Schedule
	job.Vacancies = req.Vacancies
	job.Status = defaultStatus(req.Status)
	job.IsFeatured = req.IsFeatured && company.Plan == "premium"
	job.ContactPhone = req.ContactPhone
	job.ContactEmail = req.ContactEmail
	job.ContactAddress = req.ContactAddress

	if req.ExpiresAt != nil {
		if t, err := parseTime(*req.ExpiresAt); err == nil {
			job.ExpiresAt = &t
		}
	}

	if err := h.DB.Save(&job).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar la oferta")
		return
	}

	c.JSON(http.StatusOK, job)
}

// DeleteJob soft-deletes a job posting owned by the authenticated company.
func (h *JobHandler) DeleteJob(c *gin.Context) {
	company, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de empresa no encontrado")
		return
	}

	result := h.DB.Where("id = ? AND company_id = ?", c.Param("id"), company.ID).Delete(&models.Job{})
	if result.Error != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo eliminar la oferta")
		return
	}
	if result.RowsAffected == 0 {
		utils.Error(c, http.StatusNotFound, "oferta no encontrada")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "oferta eliminada"})
}

// JobCandidates returns the applications submitted to a job owned by the
// authenticated company, including the applicant's student profile.
func (h *JobHandler) JobCandidates(c *gin.Context) {
	company, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de empresa no encontrado")
		return
	}

	var job models.Job
	if err := h.DB.Where("id = ? AND company_id = ?", c.Param("id"), company.ID).First(&job).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "oferta no encontrada")
		return
	}

	var applications []models.Application
	if err := h.DB.Where("job_id = ?", job.ID).
		Preload("Student").
		Order("created_at DESC").
		Find(&applications).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener los candidatos")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": applications})
}

func defaultStatus(status string) string {
	switch status {
	case "active", "paused", "closed":
		return status
	default:
		return "active"
	}
}
