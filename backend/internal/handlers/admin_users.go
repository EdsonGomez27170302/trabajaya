package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *AdminHandler) ListUsers(c *gin.Context) {
	query := h.DB.Model(&models.User{})
	if role := c.Query("role"); role != "" {
		query = query.Where("role = ?", role)
	}

	var users []models.User
	if err := query.Order("created_at DESC").Find(&users).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener los usuarios")
		return
	}

	response := make([]adminUserResponse, 0, len(users))
	for _, user := range users {
		entry := adminUserResponse{User: user}
		switch user.Role {
		case "student":
			var profile models.StudentProfile
			if err := h.DB.Where("user_id = ?", user.ID).First(&profile).Error; err == nil {
				entry.StudentProfile = &profile
			}
		case "company":
			var profile models.CompanyProfile
			if err := h.DB.Where("user_id = ?", user.ID).First(&profile).Error; err == nil {
				entry.CompanyProfile = &profile
			}
		}
		response = append(response, entry)
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

func (h *AdminHandler) ToggleUserActive(c *gin.Context) {
	var user models.User
	if err := h.DB.First(&user, c.Param("id")).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "usuario no encontrado")
		return
	}

	user.IsActive = !user.IsActive
	if err := h.DB.Save(&user).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar el usuario")
		return
	}

	c.JSON(http.StatusOK, user)
}
