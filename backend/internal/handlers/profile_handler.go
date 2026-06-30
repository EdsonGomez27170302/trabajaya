package handlers

import "trabajaya-backend/internal/models"

type ProfileHandler struct {
	*Handler
}

func NewProfileHandler(h *Handler) *ProfileHandler {
	return &ProfileHandler{Handler: h}
}

type studentProfileRequest struct {
	FirstName    string                    `json:"first_name"`
	LastName     string                    `json:"last_name"`
	Faculty      string                    `json:"faculty"`
	Career       string                    `json:"career"`
	Semester     int                       `json:"semester"`
	Phone        string                    `json:"phone"`
	Bio          string                    `json:"bio"`
	CVUrl        string                    `json:"cv_url"`
	Availability models.JSONStringArrayMap `json:"availability"`
	Zone         string                    `json:"zone"`
	ProfilePhoto string                    `json:"profile_photo"`
	IsAvailable  *bool                     `json:"is_available"`
}

type companyProfileRequest struct {
	CompanyName string `json:"company_name"`
	RUC         string `json:"ruc"`
	Sector      string `json:"sector"`
	Description string `json:"description"`
	Address     string `json:"address"`
	Zone        string `json:"zone"`
	Phone       string `json:"phone"`
	Website     string `json:"website"`
	LogoURL     string `json:"logo_url"`
}
