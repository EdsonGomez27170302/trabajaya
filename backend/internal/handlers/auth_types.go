package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type registerStudentRequest struct {
	Username           string `json:"username" binding:"required"`
	Email              string `json:"email" binding:"required,email"`
	Password           string `json:"password" binding:"required,min=8"`
	FirstName          string `json:"first_name" binding:"required"`
	LastName           string `json:"last_name" binding:"required"`
	InstitutionalEmail string `json:"institutional_email" binding:"required,email"`
	Faculty            string `json:"faculty"`
	Career             string `json:"career"`
	Semester           int    `json:"semester"`
	Phone              string `json:"phone"`
	Zone               string `json:"zone"`
}

type registerCompanyRequest struct {
	Username    string `json:"username" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=8"`
	CompanyName string `json:"company_name" binding:"required"`
	RUC         string `json:"ruc"`
	Sector      string `json:"sector"`
	Description string `json:"description"`
	Address     string `json:"address"`
	Zone        string `json:"zone"`
	Phone       string `json:"phone"`
	Website     string `json:"website"`
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func isUniqueViolation(err error) bool {
	return strings.Contains(err.Error(), "duplicate key") || strings.Contains(err.Error(), "unique constraint")
}

func respondRegistered(c *gin.Context, user, profile interface{}, emailErr error) {
	if emailErr != nil {
		c.JSON(http.StatusCreated, gin.H{
			"user":    user,
			"profile": profile,
			"warning": "cuenta creada, pero no se pudo enviar el correo de verificación",
		})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"user": user, "profile": profile})
}
