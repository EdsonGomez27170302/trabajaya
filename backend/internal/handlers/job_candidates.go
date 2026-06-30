package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

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
