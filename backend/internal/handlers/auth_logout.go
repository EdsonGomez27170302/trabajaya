package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Logout deletes the current session (if any) and clears the cookie. It
// always succeeds: an already-expired or missing session is not an error.
func (h *AuthHandler) Logout(c *gin.Context) {
	h.destroySession(c)
	c.JSON(http.StatusOK, gin.H{"message": "sesión cerrada"})
}
