package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/mercadopago/sdk-go/pkg/payment"

	"trabajaya-backend/internal/models"
)

func (h *PaymentHandler) Webhook(c *gin.Context) {
	if !h.verifyWebhookSignature(c) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "firma inválida"})
		return
	}

	var body struct {
		Type string `json:"type"`
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Type != "payment" || h.Cfg.MercadoPagoAccessToken == "" {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}
	paymentID, idErr := strconv.Atoi(body.Data.ID)
	if idErr != nil {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	cfg, err := h.mpConfig()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	pmt, err := payment.NewClient(cfg).Get(c.Request.Context(), paymentID)
	if err != nil || pmt.Status != "approved" || pmt.ExternalReference == "" {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	parts := strings.SplitN(pmt.ExternalReference, ":", 2)
	if len(parts) == 2 {
		if parts[0] == "student" {
			if studentUserID, err := strconv.ParseUint(parts[1], 10, 64); err == nil {
				_ = h.DB.Model(&models.StudentProfile{}).Where("user_id = ?", uint(studentUserID)).Update("is_featured", true)
			}
		} else if jobID, err := strconv.ParseUint(parts[1], 10, 64); err == nil {
			_ = h.DB.Model(&models.Job{}).Where("id = ?", uint(jobID)).Update("is_featured", true)
		}
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}
