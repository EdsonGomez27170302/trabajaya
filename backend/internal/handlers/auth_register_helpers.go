package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

// buildUserForRegistration creates a models.User with a hashed password and a
// fresh 48h verification token, writing the HTTP error on failure.
func buildUserForRegistration(c *gin.Context, username, email, password, role string) (*models.User, string, bool) {
	passwordHash, err := utils.HashPassword(password)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo procesar la contraseña")
		return nil, "", false
	}

	verificationToken, err := utils.GenerateRandomToken()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo generar el token de verificación")
		return nil, "", false
	}
	expiresAt := time.Now().Add(48 * time.Hour)

	user := &models.User{
		Username:                   username,
		Email:                      email,
		PasswordHash:               passwordHash,
		Role:                       role,
		VerificationToken:          verificationToken,
		VerificationTokenExpiresAt: &expiresAt,
	}
	return user, verificationToken, true
}

// runRegistrationTransaction inserts the user and profile in a single DB
// transaction. It writes the HTTP error on failure and returns false.
func runRegistrationTransaction(c *gin.Context, db *gorm.DB, user *models.User, setProfileUserID func()) bool {
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}
		setProfileUserID()
		return nil
	})
	if err != nil {
		if isUniqueViolation(err) {
			utils.Error(c, http.StatusConflict, "el usuario o correo ya está registrado")
			return false
		}
		utils.Error(c, http.StatusInternalServerError, "no se pudo crear la cuenta")
		return false
	}
	return true
}
