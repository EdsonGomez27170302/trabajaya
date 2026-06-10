package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
	"trabajaya-backend/internal/utils"
)

type NotificationHandler struct {
	*Handler
}

func NewNotificationHandler(h *Handler) *NotificationHandler {
	return &NotificationHandler{Handler: h}
}

// ListNotifications returns the authenticated user's notifications.
func (h *NotificationHandler) ListNotifications(c *gin.Context) {
	var notifications []models.Notification
	if err := h.DB.Where("user_id = ?", currentUserID(c)).
		Order("created_at DESC").
		Find(&notifications).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron obtener las notificaciones")
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": notifications})
}

// MarkAsRead marks a single notification as read.
func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	result := h.DB.Model(&models.Notification{}).
		Where("id = ? AND user_id = ?", c.Param("id"), currentUserID(c)).
		Update("is_read", true)
	if result.Error != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudo actualizar la notificación")
		return
	}
	if result.RowsAffected == 0 {
		utils.Error(c, http.StatusNotFound, "notificación no encontrada")
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "notificación marcada como leída"})
}

// MarkAllAsRead marks all of the authenticated user's notifications as read.
func (h *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	if err := h.DB.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", currentUserID(c), false).
		Update("is_read", true).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "no se pudieron actualizar las notificaciones")
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "notificaciones marcadas como leídas"})
}
