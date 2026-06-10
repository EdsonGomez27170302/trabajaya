package handlers

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/middleware"
	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

type AuthHandler struct {
	*Handler
}

func NewAuthHandler(h *Handler) *AuthHandler {
	return &AuthHandler{Handler: h}
}

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

	passwordHash, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo procesar la contraseña")
		return
	}

	verificationToken, err := utils.GenerateRandomToken()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo generar el token de verificación")
		return
	}
	expiresAt := time.Now().Add(48 * time.Hour)

	user := models.User{
		Username:                   req.Username,
		Email:                      req.Email,
		PasswordHash:               passwordHash,
		Role:                       "student",
		VerificationToken:          verificationToken,
		VerificationTokenExpiresAt: &expiresAt,
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

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&user).Error; err != nil {
			return err
		}
		profile.UserID = user.ID
		return tx.Create(&profile).Error
	})
	if err != nil {
		if isUniqueViolation(err) {
			utils.Error(c, http.StatusConflict, "el usuario, correo o correo institucional ya está registrado")
			return
		}
		utils.Error(c, http.StatusInternalServerError, "no se pudo crear la cuenta")
		return
	}

	if err := h.Email.SendVerificationEmail(user.Email, profile.FirstName, verificationToken); err != nil {
		// Account creation already succeeded; surface the email failure but don't roll back.
		c.JSON(http.StatusCreated, gin.H{
			"user":    user,
			"profile": profile,
			"warning": "cuenta creada, pero no se pudo enviar el correo de verificación",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user": user, "profile": profile})
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

func (h *AuthHandler) RegisterCompany(c *gin.Context) {
	var req registerCompanyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	passwordHash, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo procesar la contraseña")
		return
	}

	verificationToken, err := utils.GenerateRandomToken()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo generar el token de verificación")
		return
	}
	expiresAt := time.Now().Add(48 * time.Hour)

	user := models.User{
		Username:                   req.Username,
		Email:                      req.Email,
		PasswordHash:               passwordHash,
		Role:                       "company",
		VerificationToken:          verificationToken,
		VerificationTokenExpiresAt: &expiresAt,
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

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&user).Error; err != nil {
			return err
		}
		profile.UserID = user.ID
		return tx.Create(&profile).Error
	})
	if err != nil {
		if isUniqueViolation(err) {
			utils.Error(c, http.StatusConflict, "el usuario o correo ya está registrado")
			return
		}
		utils.Error(c, http.StatusInternalServerError, "no se pudo crear la cuenta")
		return
	}

	if err := h.Email.SendVerificationEmail(user.Email, profile.CompanyName, verificationToken); err != nil {
		c.JSON(http.StatusCreated, gin.H{
			"user":    user,
			"profile": profile,
			"warning": "cuenta creada, pero no se pudo enviar el correo de verificación",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user": user, "profile": profile})
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	var user models.User
	err := h.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error
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

	token, err := utils.GenerateToken(h.Cfg.JWTSecret, h.Cfg.JWTExpiresHours, user.ID, user.Role)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo generar el token")
		return
	}

	profile, err := h.loadProfile(user)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo cargar el perfil")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":   token,
		"user":    user,
		"profile": profile,
	})
}

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

func isUniqueViolation(err error) bool {
	return strings.Contains(err.Error(), "duplicate key") || strings.Contains(err.Error(), "unique constraint")
}
