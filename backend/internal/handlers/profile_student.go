package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *ProfileHandler) GetStudentProfile(c *gin.Context) {
	profile, err := getStudentProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil no encontrado")
		return
	}
	c.JSON(http.StatusOK, profile)
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
