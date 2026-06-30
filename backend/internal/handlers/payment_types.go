package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/mercadopago/sdk-go/pkg/payment"

	"trabajaya-backend/internal/utils"
)

type createPreferenceRequest struct {
	JobID uint `json:"job_id" binding:"required"`
}

// paymentResultJSON builds the standard JSON body returned by the
// payment-processing endpoints after creating a payment via the SDK.
func paymentResultJSON(pmt *payment.Response, upgraded bool) gin.H {
	return gin.H{
		"status":        pmt.Status,
		"status_detail": pmt.StatusDetail,
		"payment_id":    pmt.ID,
		"upgraded":      upgraded,
	}
}

// requireMercadoPago writes the standard "not configured" error response and
// returns false when the MercadoPago integration has no access token set.
func (h *PaymentHandler) requireMercadoPago(c *gin.Context) bool {
	if h.Cfg.MercadoPagoAccessToken == "" {
		utils.Error(c, http.StatusServiceUnavailable, "Pasarela de pago no configurada")
		return false
	}
	return true
}

type processPaymentReq struct {
	Token           string `json:"token" binding:"required"`
	PaymentMethodID string `json:"payment_method_id" binding:"required"`
	Installments    int    `json:"installments" binding:"required"`
	IssuerID        int64  `json:"issuer_id"`
	Email           string `json:"email" binding:"required"`
}

func (req processPaymentReq) issuerID() string {
	if req.IssuerID == 0 {
		return ""
	}
	return strconv.FormatInt(req.IssuerID, 10)
}
