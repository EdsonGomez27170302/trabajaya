package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

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
