package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
)

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
