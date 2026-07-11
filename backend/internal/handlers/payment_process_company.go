package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/mercadopago/sdk-go/pkg/payment"

	"trabajaya-backend/internal/utils"
)

func (h *PaymentHandler) ProcessCompanyPayment(c *gin.Context) {
	if !h.requireMercadoPago(c) {
		return
	}

	userID := currentUserID(c)

	var body struct {
		processPaymentReq
		JobID uint `json:"job_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Error(c, http.StatusBadRequest, "Datos de pago incompletos")
		return
	}

	cp, err := getCompanyProfileByUserID(h.DB, userID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Perfil de empresa no encontrado")
		return
	}

	job, ok := h.loadUnfeaturedCompanyJob(c, cp.ID, body.JobID)
	if !ok {
		return
	}

	cfg, err := h.mpConfig()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Error de configuración de pago")
		return
	}
	pmt, err := payment.NewClient(cfg).Create(c.Request.Context(), payment.Request{
		TransactionAmount: h.Cfg.MercadoPagoPremiumPrice,
		Token:             body.Token,
		Description:       fmt.Sprintf("Destacar oferta: %s", job.Title),
		Installments:      body.Installments,
		PaymentMethodID:   body.PaymentMethodID,
		IssuerID:          body.issuerID(),
		ExternalReference: fmt.Sprintf("%d:%d", userID, body.JobID),
		Payer:             &payment.PayerRequest{Email: body.Email, Identification: body.identification()},
	})
	if err != nil {
		log.Printf("mercadopago: error procesando pago empresa %d job %d: %v", userID, body.JobID, err)
		utils.Error(c, http.StatusBadGateway, "Error al procesar el pago")
		return
	}

	if pmt.Status == "approved" {
		if !h.markCompanyJobFeatured(c, cp.ID, body.JobID) {
			return
		}
	}

	c.JSON(http.StatusOK, paymentResultJSON(pmt, pmt.Status == "approved"))
}
