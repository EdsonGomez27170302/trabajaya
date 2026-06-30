package handlers

import "trabajaya-backend/internal/models"

type AdminHandler struct {
	*Handler
}

func NewAdminHandler(h *Handler) *AdminHandler {
	return &AdminHandler{Handler: h}
}

type adminUserResponse struct {
	models.User
	StudentProfile *models.StudentProfile `json:"student_profile,omitempty"`
	CompanyProfile *models.CompanyProfile `json:"company_profile,omitempty"`
}

type moderateJobRequest struct {
	Status string `json:"status" binding:"required,oneof=active paused closed"`
}
