package models

import "time"

type Session struct {
	ID        uint      `gorm:"primaryKey" json:"-"`
	TokenHash string    `gorm:"uniqueIndex;not null" json:"-"`
	UserID    uint      `gorm:"not null;index" json:"-"`
	Role      string    `gorm:"not null" json:"-"`
	ExpiresAt time.Time `gorm:"not null;index" json:"-"`
	CreatedAt time.Time `json:"-"`
}
