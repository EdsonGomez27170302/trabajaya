package handlers

import (
	"gorm.io/gorm"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/services"
)

type Handler struct {
	DB    *gorm.DB
	Cfg   *config.Config
	Email *services.EmailService
}

func NewHandler(db *gorm.DB, cfg *config.Config, email *services.EmailService) *Handler {
	return &Handler{DB: db, Cfg: cfg, Email: email}
}
