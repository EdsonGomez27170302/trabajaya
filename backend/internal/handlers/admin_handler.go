package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

type AdminHandler struct {
	*Handler
}

func NewAdminHandler(h *Handler) *AdminHandler {
	return &AdminHandler{Handler: h}
}

type adminUserResponse struct {
	models.User
	StudentProfile *models.StudentProfile `json:"student_profile,omitempty"`
	CompanyProfile *models.CompanyProfile `json:"company_profile,omitempty"`
}

// ListUsers returns users with an optional role filter, including a summary
// of their profile.
func (h *AdminHandler) ListUsers(c *gin.Context) {
	query := h.DB.Model(&models.User{})
	if role := c.Query("role"); role != "" {
		query = query.Where("role = ?", role)
	}

	var users []models.User
	if err := query.Order("created_at DESC").Find(&users).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener los usuarios")
		return
	}

	response := make([]adminUserResponse, 0, len(users))
	for _, user := range users {
		entry := adminUserResponse{User: user}
		switch user.Role {
		case "student":
			var profile models.StudentProfile
			if err := h.DB.Where("user_id = ?", user.ID).First(&profile).Error; err == nil {
				entry.StudentProfile = &profile
			}
		case "company":
			var profile models.CompanyProfile
			if err := h.DB.Where("user_id = ?", user.ID).First(&profile).Error; err == nil {
				entry.CompanyProfile = &profile
			}
		}
		response = append(response, entry)
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// ToggleUserActive flips a user's is_active flag (enable/disable account).
func (h *AdminHandler) ToggleUserActive(c *gin.Context) {
	var user models.User
	if err := h.DB.First(&user, c.Param("id")).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "usuario no encontrado")
		return
	}

	user.IsActive = !user.IsActive
	if err := h.DB.Save(&user).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar el usuario")
		return
	}

	c.JSON(http.StatusOK, user)
}

// VerifyCompany marks a company profile as verified by the admin team.
func (h *AdminHandler) VerifyCompany(c *gin.Context) {
	var profile models.CompanyProfile
	if err := h.DB.First(&profile, c.Param("id")).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "empresa no encontrada")
		return
	}

	profile.IsVerified = true
	if err := h.DB.Save(&profile).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo verificar la empresa")
		return
	}

	c.JSON(http.StatusOK, profile)
}

// ListAllJobs returns every job for moderation, optionally filtered by status
// and including soft-deleted jobs.
func (h *AdminHandler) ListAllJobs(c *gin.Context) {
	query := h.DB.Model(&models.Job{}).Preload("Company")

	if c.Query("include_deleted") == "true" {
		query = query.Unscoped()
	}
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	var jobs []models.Job
	if err := query.Order("created_at DESC").Find(&jobs).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener las ofertas")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": jobs})
}

type moderateJobRequest struct {
	Status string `json:"status" binding:"required,oneof=active paused closed"`
}

// ModerateJob lets an admin change a job's status (e.g. close it).
func (h *AdminHandler) ModerateJob(c *gin.Context) {
	var req moderateJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	var job models.Job
	if err := h.DB.First(&job, c.Param("id")).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "oferta no encontrada")
		return
	}

	job.Status = req.Status
	if err := h.DB.Save(&job).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar la oferta")
		return
	}

	c.JSON(http.StatusOK, job)
}

// DeleteJob soft-deletes any job (admin moderation).
func (h *AdminHandler) DeleteJob(c *gin.Context) {
	result := h.DB.Delete(&models.Job{}, c.Param("id"))
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
