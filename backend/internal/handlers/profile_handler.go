package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

type ProfileHandler struct {
	*Handler
}

func NewProfileHandler(h *Handler) *ProfileHandler {
	return &ProfileHandler{Handler: h}
}

func (h *ProfileHandler) GetStudentProfile(c *gin.Context) {
	profile, err := getStudentProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil no encontrado")
		return
	}
	c.JSON(http.StatusOK, profile)
}

type studentProfileRequest struct {
	FirstName    string                    `json:"first_name"`
	LastName     string                    `json:"last_name"`
	Faculty      string                    `json:"faculty"`
	Career       string                    `json:"career"`
	Semester     int                       `json:"semester"`
	Phone        string                    `json:"phone"`
	Bio          string                    `json:"bio"`
	CVUrl        string                    `json:"cv_url"`
	Availability models.JSONStringArrayMap `json:"availability"`
	Zone         string                    `json:"zone"`
	ProfilePhoto string                    `json:"profile_photo"`
	IsAvailable  *bool                     `json:"is_available"`
}

func (h *ProfileHandler) UpdateStudentProfile(c *gin.Context) {
	profile, err := getStudentProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil no encontrado")
		return
	}

	var req studentProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	profile.FirstName = req.FirstName
	profile.LastName = req.LastName
	profile.Faculty = req.Faculty
	profile.Career = req.Career
	profile.Semester = req.Semester
	profile.Phone = req.Phone
	profile.Bio = req.Bio
	profile.CVUrl = req.CVUrl
	if req.Availability != nil {
		profile.Availability = req.Availability
	}
	profile.Zone = req.Zone
	profile.ProfilePhoto = req.ProfilePhoto
	if req.IsAvailable != nil {
		profile.IsAvailable = *req.IsAvailable
	}

	if err := h.DB.Save(profile).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar el perfil")
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (h *ProfileHandler) ListAvailableStudents(c *gin.Context) {
	var profiles []models.StudentProfile
	if err := h.DB.Where("is_available = ?", true).
		Order("is_featured DESC, id DESC").
		Find(&profiles).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo obtener el directorio")
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": profiles})
}

func (h *ProfileHandler) GetCompanyProfile(c *gin.Context) {
	profile, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil no encontrado")
		return
	}
	c.JSON(http.StatusOK, profile)
}

type companyProfileRequest struct {
	CompanyName string `json:"company_name"`
	RUC         string `json:"ruc"`
	Sector      string `json:"sector"`
	Description string `json:"description"`
	Address     string `json:"address"`
	Zone        string `json:"zone"`
	Phone       string `json:"phone"`
	Website     string `json:"website"`
	LogoURL     string `json:"logo_url"`
}

func (h *ProfileHandler) UpdateCompanyProfile(c *gin.Context) {
	profile, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil no encontrado")
		return
	}

	var req companyProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	profile.CompanyName = req.CompanyName
	profile.RUC = req.RUC
	profile.Sector = req.Sector
	profile.Description = req.Description
	profile.Address = req.Address
	profile.Zone = req.Zone
	profile.Phone = req.Phone
	profile.Website = req.Website
	profile.LogoURL = req.LogoURL

	if err := h.DB.Save(profile).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar el perfil")
		return
	}

	c.JSON(http.StatusOK, profile)
}
