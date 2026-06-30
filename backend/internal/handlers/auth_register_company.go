package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *AuthHandler) RegisterCompany(c *gin.Context) {
	var req registerCompanyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	user, token, ok := buildUserForRegistration(c, req.Username, req.Email, req.Password, "company")
	if !ok {
		return
	}

	profile := models.CompanyProfile{
		CompanyName: req.CompanyName,
		RUC:         req.RUC,
		Sector:      req.Sector,
		Description: req.Description,
		Address:     req.Address,
		Zone:        req.Zone,
		Phone:       req.Phone,
		Website:     req.Website,
		Plan:        "free",
		IsVerified:  false,
	}

	if !runRegistrationTransaction(c, h.DB, user, func() { profile.UserID = user.ID }) {
		return
	}

	emailErr := h.Email.SendVerificationEmail(user.Email, profile.CompanyName, token)
	respondRegistered(c, user, profile, emailErr)
}
