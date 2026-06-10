package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/models"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, err
	}

	if cfg.AutoMigrate {
		log.Println("running auto migrations...")
		if err := db.AutoMigrate(
			&models.User{},
			&models.StudentProfile{},
			&models.CompanyProfile{},
			&models.Job{},
			&models.Application{},
			&models.Notification{},
		); err != nil {
			return nil, err
		}
	}

	return db, nil
}
