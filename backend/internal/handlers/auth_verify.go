package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		utils.Error(c, http.StatusBadRequest, "token requerido")
		return
	}

	var user models.User
	err := h.DB.Where("verification_token = ?", token).First(&user).Error
	if err != nil {
		utils.Error(c, http.StatusNotFound, "token inválido")
		return
	}

	if user.VerificationTokenExpiresAt != nil && user.VerificationTokenExpiresAt.Before(time.Now()) {
		utils.Error(c, http.StatusBadRequest, "el token ha expirado")
		return
	}

	user.IsVerified = true
	user.VerificationToken = ""
	user.VerificationTokenExpiresAt = nil
	if err := h.DB.Save(&user).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo verificar la cuenta")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "cuenta verificada correctamente"})
}
