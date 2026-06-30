package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/services"
	"trabajaya-backend/internal/utils"
)

func (h *ApplicationHandler) UpdateApplicationStatus(c *gin.Context) {
	company, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de empresa no encontrado")
		return
	}

	var req updateApplicationStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	var application models.Application
	if err := h.DB.Preload("Job").Preload("Student").First(&application, c.Param("id")).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "postulación no encontrada")
		return
	}

	if application.Job == nil || application.Job.CompanyID != company.ID {
		utils.Error(c, http.StatusForbidden, "no tienes acceso a esta postulación")
		return
	}

	application.Status = req.Status
	if err := h.DB.Save(&application).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar la postulación")
		return
	}

	if application.Student != nil {
		var studentUser models.User
		if err := h.DB.Where("id = (SELECT user_id FROM student_profiles WHERE id = ?)", application.StudentID).
			First(&studentUser).Error; err == nil {
			title, message := applicationStatusNotification(req.Status, application.Job.Title)
			_ = services.CreateNotification(h.DB, studentUser.ID, title, message, "application_update", "/estudiante/postulaciones")
		}
	}

	c.JSON(http.StatusOK, application)
}

func applicationStatusNotification(status, jobTitle string) (string, string) {
	switch status {
	case "viewed":
		return "Tu postulación fue revisada", fmt.Sprintf("La empresa revisó tu postulación a \"%s\".", jobTitle)
	case "accepted":
		return "¡Postulación aceptada!", fmt.Sprintf("Tu postulación a \"%s\" fue aceptada.", jobTitle)
	case "rejected":
		return "Postulación no seleccionada", fmt.Sprintf("Tu postulación a \"%s\" no fue seleccionada en esta ocasión.", jobTitle)
	default:
		return "Actualización de postulación", fmt.Sprintf("Tu postulación a \"%s\" cambió de estado.", jobTitle)
	}
}
