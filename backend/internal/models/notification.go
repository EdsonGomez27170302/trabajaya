package models

import "time"

type Notification struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	Title     string    `json:"title"`
	Message   string    `gorm:"type:text" json:"message"`
	Type      string    `json:"type"`
	IsRead    bool      `gorm:"default:false" json:"is_read"`
	Link      string    `json:"link"`
	CreatedAt time.Time `json:"created_at"`
}
