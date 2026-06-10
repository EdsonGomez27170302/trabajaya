package services

import (
	"gorm.io/gorm"

	"trabajaya-backend/internal/models"
)

func CreateNotification(db *gorm.DB, userID uint, title, message, notifType, link string) error {
	notification := models.Notification{
		UserID:  userID,
		Title:   title,
		Message: message,
		Type:    notifType,
		Link:    link,
	}
	return db.Create(&notification).Error
}
