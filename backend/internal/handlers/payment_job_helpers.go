package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

// loadUnfeaturedCompanyJob fetches a job owned by the given company profile
// and verifies it is not already featured, writing the HTTP error response
// itself when it cannot proceed.
func (h *PaymentHandler) loadUnfeaturedCompanyJob(c *gin.Context, companyID, jobID uint) (*models.Job, bool) {
	var job models.Job
	if err := h.DB.Where("id = ? AND company_id = ?", jobID, companyID).First(&job).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "Oferta no encontrada")
		return nil, false
	}
	if job.IsFeatured {
		utils.Error(c, http.StatusBadRequest, "Esta oferta ya está destacada")
		return nil, false
	}
	return &job, true
}

// markCompanyJobFeatured sets is_featured=true on the given job, writing the
// HTTP error response itself when the update fails or affects no rows.
func (h *PaymentHandler) markCompanyJobFeatured(c *gin.Context, companyID, jobID uint) bool {
	result := h.DB.Model(&models.Job{}).
		Where("id = ? AND company_id = ?", jobID, companyID).
		Update("is_featured", true)
	if result.Error != nil || result.RowsAffected == 0 {
		utils.Error(c, http.StatusInternalServerError, "Pago aprobado pero no se pudo destacar la oferta")
		return false
	}
	return true
}
