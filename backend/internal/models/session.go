package models

import "time"

// Session is a server-side login session. The client only ever holds an
// opaque random token (in an httpOnly cookie); TokenHash is its SHA-256
// digest so a leaked database row can't be replayed as a cookie value.
type Session struct {
	ID        uint      `gorm:"primaryKey" json:"-"`
	TokenHash string    `gorm:"uniqueIndex;not null" json:"-"`
	UserID    uint      `gorm:"not null;index" json:"-"`
	Role      string    `gorm:"not null" json:"-"`
	ExpiresAt time.Time `gorm:"not null;index" json:"-"`
	CreatedAt time.Time `json:"-"`
}
