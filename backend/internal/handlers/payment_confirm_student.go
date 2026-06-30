package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *PaymentHandler) ConfirmStudentPayment(c *gin.Context) {
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
	if len(parts) != 2 || parts[0] != "student" {
		utils.Error(c, http.StatusBadRequest, "Referencia de pago inválida")
		return
	}
	refUserID, err := strconv.ParseUint(parts[1], 10, 64)
	if err != nil || uint(refUserID) != userID {
		utils.Error(c, http.StatusForbidden, "El pago no corresponde a tu cuenta")
		return
	}

	if err := h.DB.Model(&models.StudentProfile{}).
		Where("user_id = ?", userID).
		Update("is_featured", true).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "No se pudo destacar el perfil")
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "approved", "upgraded": true})
}
