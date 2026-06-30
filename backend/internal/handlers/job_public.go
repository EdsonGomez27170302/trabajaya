package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *JobHandler) ListJobs(c *gin.Context) {
	page, limit, offset := parsePagination(c)

	query := h.DB.Model(&models.Job{}).Where("status = ?", "active")

	if zone := c.Query("zone"); zone != "" {
		query = query.Where("zone = ?", zone)
	}
	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}
	if modality := c.Query("modality"); modality != "" {
		query = query.Where("modality = ?", modality)
	}
	if search := c.Query("search"); search != "" {
		like := "%" + search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", like, like)
	}

	var total int64
	query.Count(&total)

	var jobs []models.Job
	if err := query.Preload("Company").
		Order("is_featured DESC, created_at DESC").
		Limit(limit).Offset(offset).
		Find(&jobs).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener las ofertas")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  jobs,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}
