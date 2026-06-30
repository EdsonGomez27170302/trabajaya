package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

func (h *AuthHandler) RegisterStudent(c *gin.Context) {
	var req registerStudentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	domainSuffix := "@" + h.Cfg.InstitutionalEmailDomain
	if !strings.HasSuffix(strings.ToLower(req.InstitutionalEmail), strings.ToLower(domainSuffix)) {
		utils.Error(c, http.StatusBadRequest, "el correo institucional debe terminar en "+domainSuffix)
		return
	}

	user, token, ok := buildUserForRegistration(c, req.Username, req.Email, req.Password, "student")
	if !ok {
		return
	}

	profile := models.StudentProfile{
		FirstName:          req.FirstName,
		LastName:           req.LastName,
		InstitutionalEmail: req.InstitutionalEmail,
		Faculty:            req.Faculty,
		Career:             req.Career,
		Semester:           req.Semester,
		Phone:              req.Phone,
		Zone:               req.Zone,
		Availability:       models.JSONStringArrayMap{},
		IsAvailable:        true,
	}

	if !runRegistrationTransaction(c, h.DB, user, func() { profile.UserID = user.ID }) {
		return
	}

	emailErr := h.Email.SendVerificationEmail(user.Email, profile.FirstName, token)
	respondRegistered(c, user, profile, emailErr)
}
