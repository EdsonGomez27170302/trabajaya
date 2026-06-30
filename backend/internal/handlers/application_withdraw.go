package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *ApplicationHandler) WithdrawApplication(c *gin.Context) {
	student, err := getStudentProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de estudiante no encontrado")
		return
	}

	result := h.DB.Where("id = ? AND student_id = ?", c.Param("id"), student.ID).Delete(&models.Application{})
	if result.Error != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo retirar la postulación")
		return
	}
	if result.RowsAffected == 0 {
		utils.Error(c, http.StatusNotFound, "postulación no encontrada")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "postulación retirada"})
}
