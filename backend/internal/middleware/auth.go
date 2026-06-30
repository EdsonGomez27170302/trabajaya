package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

const (
	ContextUserIDKey = "user_id"
	ContextRoleKey   = "role"
)

// AuthRequired validates the opaque session cookie against the sessions
// table. The cookie itself never reveals anything: only its SHA-256 hash is
// looked up, so a leaked database backup can't be replayed as a session.
func AuthRequired(db *gorm.DB, cookieName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		raw, err := c.Cookie(cookieName)
		if err != nil || raw == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing session"})
			return
		}

		var session models.Session
		err = db.Where("token_hash = ? AND expires_at > ?", utils.HashSessionToken(raw), time.Now()).
			First(&session).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired session"})
			return
		}

		c.Set(ContextUserIDKey, session.UserID)
		c.Set(ContextRoleKey, session.Role)
		c.Next()
	}
}
