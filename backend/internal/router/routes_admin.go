package router

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/middleware"
)

func registerAdminRoutes(api *gin.RouterGroup, db *gorm.DB, cfg *config.Config, hs *handlerSet) {
	admin := api.Group("/admin")
	admin.Use(middleware.AuthRequired(db, cfg.SessionCookieName), middleware.RequireRole("admin"))
	{
		admin.GET("/users", hs.adminHandler.ListUsers)
		admin.PUT("/users/:id/toggle-active", hs.adminHandler.ToggleUserActive)
		admin.PUT("/companies/:id/verify", hs.adminHandler.VerifyCompany)
		admin.GET("/jobs", hs.adminHandler.ListAllJobs)
		admin.PUT("/jobs/:id/moderate", hs.adminHandler.ModerateJob)
		admin.DELETE("/jobs/:id", hs.adminHandler.DeleteJob)
	}
}
