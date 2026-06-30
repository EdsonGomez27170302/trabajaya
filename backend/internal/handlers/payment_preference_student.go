package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/mercadopago/sdk-go/pkg/preference"

	"trabajaya-backend/internal/utils"
)

func (h *PaymentHandler) CreateStudentPreference(c *gin.Context) {
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

	cfg, err := h.mpConfig()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Error de configuración de pago")
		return
	}

	pref, err := preference.NewClient(cfg).Create(c.Request.Context(), preference.Request{
		Items: []preference.ItemRequest{{
			ID:         fmt.Sprintf("destacar-perfil-%d", profile.ID),
			Title:      fmt.Sprintf("Destacar perfil: %s %s", profile.FirstName, profile.LastName),
			Quantity:   1,
			UnitPrice:  h.Cfg.MercadoPagoPremiumPrice,
			CurrencyID: "PEN",
		}},
		BackURLs: &preference.BackURLsRequest{
			Success: h.Cfg.FrontendURL + "/estudiante/pago/exito",
			Failure: h.Cfg.FrontendURL + "/estudiante/pago/error",
			Pending: h.Cfg.FrontendURL + "/estudiante/pago/error",
		},
		ExternalReference: fmt.Sprintf("student:%d", userID),
	})
	if err != nil {
		log.Printf("mercadopago: error creando preferencia para estudiante %d: %v", userID, err)
		utils.Error(c, http.StatusBadGateway, "Error al crear la preferencia de pago")
		return
	}

	c.JSON(http.StatusOK, gin.H{"init_point": pref.InitPoint, "preference_id": pref.ID})
}
