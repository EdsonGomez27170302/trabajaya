package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

// createSession issues a new opaque session token for userID/role, stores
// its hash, and sets it as an httpOnly cookie on the response.
func (h *Handler) createSession(c *gin.Context, userID uint, role string) error {
	raw, err := utils.GenerateRandomToken()
	if err != nil {
		return err
	}

	ttl := time.Duration(h.Cfg.SessionExpiresHours) * time.Hour
	session := models.Session{
		TokenHash: utils.HashSessionToken(raw),
		UserID:    userID,
		Role:      role,
		ExpiresAt: time.Now().Add(ttl),
	}
	if err := h.DB.Create(&session).Error; err != nil {
		return err
	}

	h.setSessionCookie(c, raw, int(ttl.Seconds()))
	return nil
}

// destroySession deletes the session matching the request's cookie (if any)
// and clears the cookie. It never errors on a missing/invalid cookie.
func (h *Handler) destroySession(c *gin.Context) {
	if raw, err := c.Cookie(h.Cfg.SessionCookieName); err == nil && raw != "" {
		h.DB.Where("token_hash = ?", utils.HashSessionToken(raw)).Delete(&models.Session{})
	}
	h.setSessionCookie(c, "", -1)
}

func (h *Handler) setSessionCookie(c *gin.Context, value string, maxAgeSeconds int) {
	sameSite := http.SameSiteLaxMode
	if h.Cfg.SessionCookieSecure {
		sameSite = http.SameSiteNoneMode
	}
	c.SetSameSite(sameSite)
	c.SetCookie(h.Cfg.SessionCookieName, value, maxAgeSeconds, "/", "", h.Cfg.SessionCookieSecure, true)
}
