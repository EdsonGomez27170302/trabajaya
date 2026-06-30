package router

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/middleware"
)

func registerNotificationRoutes(api *gin.RouterGroup, db *gorm.DB, cfg *config.Config, hs *handlerSet) {
	notifications := api.Group("/notifications")
	notifications.Use(middleware.AuthRequired(db, cfg.SessionCookieName))
	{
		notifications.GET("", hs.notificationHandler.ListNotifications)
		notifications.PUT("/:id/read", hs.notificationHandler.MarkAsRead)
		notifications.PUT("/read-all", hs.notificationHandler.MarkAllAsRead)
	}
}
