package router

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/middleware"
)

func registerAuthRoutes(api *gin.RouterGroup, db *gorm.DB, cfg *config.Config, hs *handlerSet) {
	auth := api.Group("/auth")
	{
		auth.POST("/register/student", hs.authHandler.RegisterStudent)
		auth.POST("/register/company", hs.authHandler.RegisterCompany)
		auth.POST("/login", hs.authHandler.Login)
		auth.POST("/logout", hs.authHandler.Logout)
		auth.GET("/verify-email", hs.authHandler.VerifyEmail)
		auth.GET("/me", middleware.AuthRequired(db, cfg.SessionCookieName), hs.authHandler.Me)
	}
}
