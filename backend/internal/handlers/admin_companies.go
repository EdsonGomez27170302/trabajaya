package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *AdminHandler) VerifyCompany(c *gin.Context) {
	var profile models.CompanyProfile
	if err := h.DB.First(&profile, c.Param("id")).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "empresa no encontrada")
		return
	}

	profile.IsVerified = true
	if err := h.DB.Save(&profile).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo verificar la empresa")
		return
	}

	c.JSON(http.StatusOK, profile)
}
