package database

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

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
			&models.Session{},
		); err != nil {
			return nil, err
		}
	}

	if os.Getenv("AUTO_RUN_SQL") == "true" {
		log.Println("running SQL migrations...")
		if err := runSQLMigrations(db); err != nil {
			return nil, fmt.Errorf("failed to run SQL migrations: %w", err)
		}
	}

	return db, nil
}

func runSQLMigrations(db *gorm.DB) error {
	migrationFile := os.Getenv("SQL_MIGRATION_FILE")
	if migrationFile == "" {
		execPath, _ := os.Executable()
		dir := filepath.Dir(execPath)
		migrationFile = filepath.Join(dir, "db", "migrations.sql")
	}

	content, err := os.ReadFile(migrationFile)
	if err != nil {
		log.Printf("SQL migration file not found at %s (skipping)", migrationFile)
		return nil
	}

	if err := db.Exec(string(content)).Error; err != nil {
		return fmt.Errorf("failed to execute migration: %w", err)
	}

	log.Println("SQL migrations completed successfully")
	return nil
}
