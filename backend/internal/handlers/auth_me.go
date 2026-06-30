package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/middleware"
	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *AuthHandler) Me(c *gin.Context) {
	userID, _ := c.Get(middleware.ContextUserIDKey)

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "usuario no encontrado")
		return
	}

	profile, err := h.loadProfile(user)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo cargar el perfil")
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user, "profile": profile})
}

func (h *AuthHandler) loadProfile(user models.User) (interface{}, error) {
	switch user.Role {
	case "student":
		var profile models.StudentProfile
		if err := h.DB.Where("user_id = ?", user.ID).First(&profile).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, nil
			}
			return nil, err
		}
		return profile, nil
	case "company":
		var profile models.CompanyProfile
		if err := h.DB.Where("user_id = ?", user.ID).First(&profile).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, nil
			}
			return nil, err
		}
		return profile, nil
	default:
		return nil, nil
	}
}
