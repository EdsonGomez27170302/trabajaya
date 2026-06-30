package handlers

import (
	mpconfig "github.com/mercadopago/sdk-go/pkg/config"
)

type PaymentHandler struct {
	*Handler
}

func NewPaymentHandler(h *Handler) *PaymentHandler {
	return &PaymentHandler{h}
}

func (h *PaymentHandler) mpConfig() (*mpconfig.Config, error) {
	return mpconfig.New(h.Cfg.MercadoPagoAccessToken)
}
