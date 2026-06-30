package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

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
