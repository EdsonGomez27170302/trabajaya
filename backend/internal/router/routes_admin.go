package router

import (
	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/middleware"
)

func registerAdminRoutes(api *gin.RouterGroup, cfg *config.Config, hs *handlerSet) {
	admin := api.Group("/admin")
	admin.Use(middleware.AuthRequired(cfg.JWTSecret), middleware.RequireRole("admin"))
	{
		admin.GET("/users", hs.adminHandler.ListUsers)
		admin.PUT("/users/:id/toggle-active", hs.adminHandler.ToggleUserActive)
		admin.PUT("/companies/:id/verify", hs.adminHandler.VerifyCompany)
		admin.GET("/jobs", hs.adminHandler.ListAllJobs)
		admin.PUT("/jobs/:id/moderate", hs.adminHandler.ModerateJob)
		admin.DELETE("/jobs/:id", hs.adminHandler.DeleteJob)
	}
}
