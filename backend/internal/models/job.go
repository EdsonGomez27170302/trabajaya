package models

import (
	"time"

	"gorm.io/gorm"
)

type Job struct {
	ID             uint               `gorm:"primaryKey" json:"id"`
	CompanyID      uint               `gorm:"not null;index" json:"company_id"`
	Company        *CompanyProfile    `gorm:"foreignKey:CompanyID" json:"company,omitempty"`
	Title          string             `json:"title"`
	Description    string             `gorm:"type:text" json:"description"`
	Requirements   string             `gorm:"type:text" json:"requirements"`
	Category       string             `gorm:"index" json:"category"`
	Modality       string             `json:"modality"`
	Zone           string             `gorm:"index" json:"zone"`
	Salary         float64            `json:"salary"`
	SalaryType     string             `json:"salary_type"`
	HoursPerWeek   int                `json:"hours_per_week"`
	Schedule       JSONStringArrayMap `gorm:"type:jsonb" json:"schedule"`
	Vacancies      int                `json:"vacancies"`
	Status         string             `gorm:"default:active;index" json:"status"`
	ContactPhone   string             `json:"contact_phone"`
	ContactEmail   string             `json:"contact_email"`
	ContactAddress string             `json:"contact_address"`
	IsFeatured     bool               `gorm:"default:false" json:"is_featured"`
	ViewsCount     int                `gorm:"default:0" json:"views_count"`
	ExpiresAt      *time.Time         `json:"expires_at"`
	CreatedAt      time.Time          `json:"created_at"`
	UpdatedAt      time.Time          `json:"-"`
	DeletedAt      gorm.DeletedAt     `gorm:"index" json:"-"`
}
