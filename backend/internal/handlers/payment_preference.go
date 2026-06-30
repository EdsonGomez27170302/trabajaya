package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/mercadopago/sdk-go/pkg/preference"

	"trabajaya-backend/internal/utils"
)

func (h *PaymentHandler) CreatePreference(c *gin.Context) {
	if !h.requireMercadoPago(c) {
		return
	}

	userID := currentUserID(c)

	var req createPreferenceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "job_id requerido")
		return
	}

	cp, err := getCompanyProfileByUserID(h.DB, userID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Perfil de empresa no encontrado")
		return
	}

	job, ok := h.loadUnfeaturedCompanyJob(c, cp.ID, req.JobID)
	if !ok {
		return
	}

	cfg, err := h.mpConfig()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Error de configuración de pago")
		return
	}

	pref, err := preference.NewClient(cfg).Create(c.Request.Context(), preference.Request{
		Items: []preference.ItemRequest{{
			ID:         fmt.Sprintf("destacar-oferta-%d", req.JobID),
			Title:      fmt.Sprintf("Destacar oferta: %s", job.Title),
			Quantity:   1,
			UnitPrice:  h.Cfg.MercadoPagoPremiumPrice,
			CurrencyID: "PEN",
		}},
		BackURLs: &preference.BackURLsRequest{
			Success: h.Cfg.FrontendURL + "/empresa/pago/exito",
			Failure: h.Cfg.FrontendURL + "/empresa/pago/error",
			Pending: h.Cfg.FrontendURL + "/empresa/pago/error",
		},
		ExternalReference: fmt.Sprintf("%d:%d", userID, req.JobID),
	})
	if err != nil {
		log.Printf("mercadopago: error creando preferencia para job %d: %v", req.JobID, err)
		utils.Error(c, http.StatusBadGateway, "Error al crear la preferencia de pago")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"init_point":    pref.InitPoint,
		"preference_id": pref.ID,
	})
}
