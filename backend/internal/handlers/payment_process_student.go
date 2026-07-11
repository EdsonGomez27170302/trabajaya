package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/mercadopago/sdk-go/pkg/payment"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *PaymentHandler) ProcessStudentPayment(c *gin.Context) {
	if !h.requireMercadoPago(c) {
		return
	}

	userID := currentUserID(c)
	profile, err := getStudentProfileByUserID(h.DB, userID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Perfil de estudiante no encontrado")
		return
	}
	if profile.IsFeatured {
		utils.Error(c, http.StatusBadRequest, "Tu perfil ya está destacado")
		return
	}

	var req processPaymentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "Datos de pago incompletos")
		return
	}

	cfg, err := h.mpConfig()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Error de configuración de pago")
		return
	}

	pmt, err := payment.NewClient(cfg).Create(c.Request.Context(), payment.Request{
		TransactionAmount: h.Cfg.MercadoPagoPremiumPrice,
		Token:             req.Token,
		Description:       fmt.Sprintf("Destacar perfil: %s %s", profile.FirstName, profile.LastName),
		Installments:      req.Installments,
		PaymentMethodID:   req.PaymentMethodID,
		IssuerID:          req.issuerID(),
		ExternalReference: fmt.Sprintf("student:%d", userID),
		Payer:             &payment.PayerRequest{Email: req.Email, Identification: req.identification()},
	})
	if err != nil {
		log.Printf("mercadopago: error procesando pago estudiante %d: %v", userID, err)
		utils.Error(c, http.StatusBadGateway, "Error al procesar el pago")
		return
	}

	if pmt.Status == "approved" {
		if err := h.DB.Model(&models.StudentProfile{}).
			Where("user_id = ?", userID).
			Update("is_featured", true).Error; err != nil {
			utils.Error(c, http.StatusInternalServerError, "Pago aprobado pero no se pudo activar el perfil")
			return
		}
	}

	c.JSON(http.StatusOK, paymentResultJSON(pmt, pmt.Status == "approved"))
}
