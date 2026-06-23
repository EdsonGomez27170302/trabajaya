package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/database"
	"trabajaya-backend/internal/router"
)

func main() {
	cfg := config.Load()
	gin.SetMode(cfg.GinMode)

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	r := router.New(db, cfg)
	r.Static("/uploads", cfg.UploadsDir)

	log.Printf("starting server on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
