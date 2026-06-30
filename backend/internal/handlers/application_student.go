package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *ApplicationHandler) Apply(c *gin.Context) {
	student, err := getStudentProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de estudiante no encontrado")
		return
	}

	var job models.Job
	if err := h.DB.Where("id = ? AND status = ?", c.Param("id"), "active").First(&job).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "oferta no encontrada")
		return
	}

	var req applyRequest
	_ = c.ShouldBindJSON(&req)

	application := models.Application{
		JobID:       job.ID,
		StudentID:   student.ID,
		CoverLetter: req.CoverLetter,
		Status:      "pending",
	}

	if err := h.DB.Create(&application).Error; err != nil {
		if isUniqueViolation(err) {
			utils.Error(c, http.StatusConflict, "ya postulaste a esta oferta")
			return
		}
		utils.Error(c, http.StatusInternalServerError, "no se pudo registrar la postulación")
		return
	}

	c.JSON(http.StatusCreated, application)
}

func (h *ApplicationHandler) MyApplications(c *gin.Context) {
	student, err := getStudentProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de estudiante no encontrado")
		return
	}

	var applications []models.Application
	if err := h.DB.Where("student_id = ?", student.ID).
		Preload("Job").Preload("Job.Company").
		Order("created_at DESC").
		Find(&applications).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener las postulaciones")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": applications})
}
