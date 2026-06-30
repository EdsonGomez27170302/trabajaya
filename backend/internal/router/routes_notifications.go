package router

import (
	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/middleware"
)

func registerNotificationRoutes(api *gin.RouterGroup, cfg *config.Config, hs *handlerSet) {
	notifications := api.Group("/notifications")
	notifications.Use(middleware.AuthRequired(cfg.JWTSecret))
	{
		notifications.GET("", hs.notificationHandler.ListNotifications)
		notifications.PUT("/:id/read", hs.notificationHandler.MarkAsRead)
		notifications.PUT("/read-all", hs.notificationHandler.MarkAllAsRead)
	}
}
