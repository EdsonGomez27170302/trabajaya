package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *JobHandler) CreateJob(c *gin.Context) {
	company, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil de empresa no encontrado")
		return
	}

	var req jobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	job := jobFromRequest(req, company.ID, company.Plan == "premium")

	if err := h.DB.Create(&job).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo crear la oferta")
		return
	}

	c.JSON(http.StatusCreated, job)
}

func (h *JobHandler) UpdateJob(c *gin.Context) {
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

	var req jobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	applyJobRequest(&job, req, company.Plan == "premium")

	if err := h.DB.Save(&job).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar la oferta")
		return
	}

	c.JSON(http.StatusOK, job)
}
