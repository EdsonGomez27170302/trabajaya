package handlers

import "trabajaya-backend/internal/models"

type jobRequest struct {
	Title          string                    `json:"title" binding:"required"`
	Description    string                    `json:"description"`
	Requirements   string                    `json:"requirements"`
	Category       string                    `json:"category"`
	Modality       string                    `json:"modality"`
	Zone           string                    `json:"zone"`
	Salary         float64                   `json:"salary"`
	SalaryType     string                    `json:"salary_type"`
	HoursPerWeek   int                       `json:"hours_per_week"`
	Schedule       models.JSONStringArrayMap `json:"schedule"`
	Vacancies      int                       `json:"vacancies"`
	Status         string                    `json:"status"`
	IsFeatured     bool                      `json:"is_featured"`
	ExpiresAt      *string                   `json:"expires_at"`
	ContactPhone   string                    `json:"contact_phone"`
	ContactEmail   string                    `json:"contact_email"`
	ContactAddress string                    `json:"contact_address"`
}
