package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/utils"
)

func (h *ProfileHandler) GetCompanyProfile(c *gin.Context) {
	profile, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil no encontrado")
		return
	}
	c.JSON(http.StatusOK, profile)
}

func (h *ProfileHandler) UpdateCompanyProfile(c *gin.Context) {
	profile, err := getCompanyProfileByUserID(h.DB, currentUserID(c))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "perfil no encontrado")
		return
	}

	var req companyProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	profile.CompanyName = req.CompanyName
	profile.RUC = req.RUC
	profile.Sector = req.Sector
	profile.Description = req.Description
	profile.Address = req.Address
	profile.Zone = req.Zone
	profile.Phone = req.Phone
	profile.Website = req.Website
	profile.LogoURL = req.LogoURL

	if err := h.DB.Save(profile).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar el perfil")
		return
	}

	c.JSON(http.StatusOK, profile)
}
