package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

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
