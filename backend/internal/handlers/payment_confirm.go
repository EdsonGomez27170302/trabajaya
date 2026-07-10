package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/mercadopago/sdk-go/pkg/payment"

	"trabajaya-backend/internal/utils"
)

func (h *PaymentHandler) fetchApprovedPayment(c *gin.Context) (pmt *payment.Response, ok bool) {
	paymentID, err := strconv.Atoi(c.Query("payment_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "payment_id requerido")
		return nil, false
	}

	cfg, err := h.mpConfig()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Error de configuración de pago")
		return nil, false
	}

	pmt, err = payment.NewClient(cfg).Get(c.Request.Context(), paymentID)
	if err != nil {
		log.Printf("mercadopago: error verificando pago %d: %v", paymentID, err)
		utils.Error(c, http.StatusBadGateway, "No se pudo verificar el pago")
		return nil, false
	}

	return pmt, true
}
