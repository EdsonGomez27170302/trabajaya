package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *AuthHandler) Logout(c *gin.Context) {
	h.destroySession(c)
	c.JSON(http.StatusOK, gin.H{"message": "sesión cerrada"})
}
