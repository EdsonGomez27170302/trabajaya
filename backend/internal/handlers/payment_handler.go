package handlers

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

const mpAPI = "https://api.mercadopago.com"

type PaymentHandler struct {
	*Handler
}

func NewPaymentHandler(h *Handler) *PaymentHandler {
	return &PaymentHandler{h}
}

type mpItem struct {
	ID         string  `json:"id"`
	Title      string  `json:"title"`
	Quantity   int     `json:"quantity"`
	UnitPrice  float64 `json:"unit_price"`
	CurrencyID string  `json:"currency_id"`
}

type mpBackURLs struct {
	Success string `json:"success"`
	Failure string `json:"failure"`
	Pending string `json:"pending"`
}

type mpPreferenceReq struct {
	Items             []mpItem   `json:"items"`
	BackURLs          mpBackURLs `json:"back_urls"`
	AutoReturn        string     `json:"auto_return"`
	ExternalReference string     `json:"external_reference"`
}

type mpPreferenceResp struct {
	ID        string `json:"id"`
	InitPoint string `json:"init_point"`
}

type mpPaymentResp struct {
	ID                int64  `json:"id"`
	Status            string `json:"status"`
	ExternalReference string `json:"external_reference"`
}

type createPreferenceRequest struct {
	JobID uint `json:"job_id" binding:"required"`
}

func (h *PaymentHandler) CreatePreference(c *gin.Context) {
	if h.Cfg.MercadoPagoAccessToken == "" {
		utils.Error(c, http.StatusServiceUnavailable, "Pasarela de pago no configurada")
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

	var job models.Job
	if err := h.DB.Where("id = ? AND company_id = ?", req.JobID, cp.ID).First(&job).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "Oferta no encontrada")
		return
	}

	if job.IsFeatured {
		utils.Error(c, http.StatusBadRequest, "Esta oferta ya está destacada")
		return
	}

	externalRef := fmt.Sprintf("%d:%d", userID, req.JobID)

	body := mpPreferenceReq{
		Items: []mpItem{{
			ID:         fmt.Sprintf("destacar-oferta-%d", req.JobID),
			Title:      fmt.Sprintf("Destacar oferta: %s", job.Title),
			Quantity:   1,
			UnitPrice:  h.Cfg.MercadoPagoPremiumPrice,
			CurrencyID: "PEN",
		}},
		BackURLs: mpBackURLs{
			Success: h.Cfg.FrontendURL + "/empresa/pago/exito",
			Failure: h.Cfg.FrontendURL + "/empresa/pago/error",
			Pending: h.Cfg.FrontendURL + "/empresa/pago/error",
		},
		AutoReturn:        "approved",
		ExternalReference: externalRef,
	}

	pref, err := h.mpPost("/checkout/preferences", body)
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

func (h *PaymentHandler) ConfirmPayment(c *gin.Context) {
	if h.Cfg.MercadoPagoAccessToken == "" {
		utils.Error(c, http.StatusServiceUnavailable, "Pasarela de pago no configurada")
		return
	}

	userID := currentUserID(c)
	paymentID := c.Query("payment_id")
	if paymentID == "" {
		utils.Error(c, http.StatusBadRequest, "payment_id requerido")
		return
	}

	payment, err := h.mpGetPayment(paymentID)
	if err != nil {
		log.Printf("mercadopago: error verificando pago %s: %v", paymentID, err)
		utils.Error(c, http.StatusBadGateway, "No se pudo verificar el pago")
		return
	}

	if payment.Status != "approved" {
		c.JSON(http.StatusOK, gin.H{"status": payment.Status, "upgraded": false})
		return
	}

	parts := strings.SplitN(payment.ExternalReference, ":", 2)
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

func (h *PaymentHandler) CreateStudentPreference(c *gin.Context) {
	if h.Cfg.MercadoPagoAccessToken == "" {
		utils.Error(c, http.StatusServiceUnavailable, "Pasarela de pago no configurada")
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

	externalRef := fmt.Sprintf("student:%d", userID)

	body := mpPreferenceReq{
		Items: []mpItem{{
			ID:         fmt.Sprintf("destacar-perfil-%d", profile.ID),
			Title:      fmt.Sprintf("Destacar perfil: %s %s", profile.FirstName, profile.LastName),
			Quantity:   1,
			UnitPrice:  h.Cfg.MercadoPagoPremiumPrice,
			CurrencyID: "PEN",
		}},
		BackURLs: mpBackURLs{
			Success: h.Cfg.FrontendURL + "/estudiante/pago/exito",
			Failure: h.Cfg.FrontendURL + "/estudiante/pago/error",
			Pending: h.Cfg.FrontendURL + "/estudiante/pago/error",
		},
		AutoReturn:        "approved",
		ExternalReference: externalRef,
	}

	pref, err := h.mpPost("/checkout/preferences", body)
	if err != nil {
		log.Printf("mercadopago: error creando preferencia para estudiante %d: %v", userID, err)
		utils.Error(c, http.StatusBadGateway, "Error al crear la preferencia de pago")
		return
	}

	c.JSON(http.StatusOK, gin.H{"init_point": pref.InitPoint, "preference_id": pref.ID})
}

func (h *PaymentHandler) ConfirmStudentPayment(c *gin.Context) {
	if h.Cfg.MercadoPagoAccessToken == "" {
		utils.Error(c, http.StatusServiceUnavailable, "Pasarela de pago no configurada")
		return
	}

	userID := currentUserID(c)
	paymentID := c.Query("payment_id")
	if paymentID == "" {
		utils.Error(c, http.StatusBadRequest, "payment_id requerido")
		return
	}

	payment, err := h.mpGetPayment(paymentID)
	if err != nil {
		log.Printf("mercadopago: error verificando pago %s: %v", paymentID, err)
		utils.Error(c, http.StatusBadGateway, "No se pudo verificar el pago")
		return
	}

	if payment.Status != "approved" {
		c.JSON(http.StatusOK, gin.H{"status": payment.Status, "upgraded": false})
		return
	}

	parts := strings.SplitN(payment.ExternalReference, ":", 2)
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

	payment, err := h.mpGetPayment(body.Data.ID)
	if err != nil || payment.Status != "approved" || payment.ExternalReference == "" {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	parts := strings.SplitN(payment.ExternalReference, ":", 2)
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

func (h *PaymentHandler) verifyWebhookSignature(c *gin.Context) bool {
	if h.Cfg.MercadoPagoWebhookSecret == "" {
		return true
	}

	sigHeader := c.GetHeader("x-signature")
	requestID := c.GetHeader("x-request-id")
	dataID := c.Query("data.id")
	if sigHeader == "" || requestID == "" || dataID == "" {
		return false
	}
	dataID = strings.ToLower(dataID)

	var ts, v1 string
	for _, part := range strings.Split(sigHeader, ",") {
		kv := strings.SplitN(strings.TrimSpace(part), "=", 2)
		if len(kv) != 2 {
			continue
		}
		switch kv[0] {
		case "ts":
			ts = kv[1]
		case "v1":
			v1 = kv[1]
		}
	}
	if ts == "" || v1 == "" {
		return false
	}

	manifest := fmt.Sprintf("id:%s;request-id:%s;ts:%s;", dataID, requestID, ts)
	mac := hmac.New(sha256.New, []byte(h.Cfg.MercadoPagoWebhookSecret))
	mac.Write([]byte(manifest))
	expected := hex.EncodeToString(mac.Sum(nil))

	return hmac.Equal([]byte(expected), []byte(v1))
}

func (h *PaymentHandler) mpPost(path string, payload any) (*mpPreferenceResp, error) {
	b, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest(http.MethodPost, mpAPI+path, bytes.NewBuffer(b))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+h.Cfg.MercadoPagoAccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := (&http.Client{}).Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	rb, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("MP %d: %s", resp.StatusCode, strings.TrimSpace(string(rb)))
	}
	var result mpPreferenceResp
	return &result, json.Unmarshal(rb, &result)
}

func (h *PaymentHandler) mpGetPayment(paymentID string) (*mpPaymentResp, error) {
	req, err := http.NewRequest(http.MethodGet, mpAPI+"/v1/payments/"+paymentID, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+h.Cfg.MercadoPagoAccessToken)

	resp, err := (&http.Client{}).Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	rb, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("MP %d: %s", resp.StatusCode, strings.TrimSpace(string(rb)))
	}
	var result mpPaymentResp
	return &result, json.Unmarshal(rb, &result)
}
