package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	var user models.User
	err := h.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error
	if err != nil {
		var profile models.StudentProfile
		if err2 := h.DB.Where("institutional_email = ?", req.Username).First(&profile).Error; err2 == nil {
			err = h.DB.First(&user, profile.UserID).Error
		}
	}
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "credenciales inválidas")
		return
	}

	if !utils.CheckPassword(req.Password, user.PasswordHash) {
		utils.Error(c, http.StatusUnauthorized, "credenciales inválidas")
		return
	}

	if !user.IsActive {
		utils.Error(c, http.StatusForbidden, "la cuenta está desactivada")
		return
	}

	profile, err := h.loadProfile(user)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo cargar el perfil")
		return
	}

	if err := h.createSession(c, user.ID, user.Role); err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo iniciar sesión")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"profile": profile,
	})
}
