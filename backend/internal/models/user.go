package models

import "time"

type User struct {
	ID                          uint       `gorm:"primaryKey" json:"id"`
	Username                    string     `gorm:"uniqueIndex;not null" json:"username"`
	Email                       string     `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash                string     `gorm:"not null" json:"-"`
	Role                        string     `gorm:"not null;index" json:"role"` // student | company | admin
	IsVerified                  bool       `gorm:"default:false" json:"is_verified"`
	IsActive                    bool       `gorm:"default:true" json:"is_active"`
	VerificationToken           string     `gorm:"index" json:"-"`
	VerificationTokenExpiresAt  *time.Time `json:"-"`
	CreatedAt                   time.Time  `json:"created_at"`
	UpdatedAt                   time.Time  `json:"-"`
}
