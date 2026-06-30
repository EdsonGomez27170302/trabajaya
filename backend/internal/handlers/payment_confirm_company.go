package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *PaymentHandler) ConfirmPayment(c *gin.Context) {
	if !h.requireMercadoPago(c) {
		return
	}

	userID := currentUserID(c)

	pmt, ok := h.fetchApprovedPayment(c)
	if !ok {
		return
	}
	if pmt.Status != "approved" {
		c.JSON(http.StatusOK, gin.H{"status": pmt.Status, "upgraded": false})
		return
	}

	parts := strings.SplitN(pmt.ExternalReference, ":", 2)
	if len(parts) != 2 {
		utils.Error(c, http.StatusBadRequest, "Referencia de pago inválida")
		return
	}

	refUserID, err := strconv.ParseUint(parts[0], 10, 64)
	if err != nil || uint(refUserID) != userID {
		utils.Error(c, http.StatusForbidden, "El pago no corresponde a tu cuenta")
		return
	}

	jobID, err := strconv.ParseUint(parts[1], 10, 64)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "ID de oferta inválido")
		return
	}

	cp, err := getCompanyProfileByUserID(h.DB, userID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Perfil de empresa no encontrado")
		return
	}

	result := h.DB.Model(&models.Job{}).
		Where("id = ? AND company_id = ?", uint(jobID), cp.ID).
		Update("is_featured", true)
	if result.Error != nil {
		utils.Error(c, http.StatusInternalServerError, "No se pudo destacar la oferta")
		return
	}
	if result.RowsAffected == 0 {
		utils.Error(c, http.StatusForbidden, "La oferta no corresponde a tu empresa")
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "approved", "upgraded": true, "job_id": jobID})
}
