package main

import (
	"log"

	"gorm.io/gorm"

	"trabajaya-backend/internal/models"
)

// seedStudent creates the user + student profile for one seed entry, skipping
// it if a user with the same username already exists.
func seedStudent(db *gorm.DB, s studentSeed, passwordHash string) {
	var count int64
	db.Model(&models.User{}).Where("username = ?", s.username).Count(&count)
	if count > 0 {
		log.Printf("skip (existe): %s", s.username)
		return
	}

	user := models.User{
		Username:     s.username,
		Email:        s.email,
		PasswordHash: passwordHash,
		Role:         "student",
		IsVerified:   true,
		IsActive:     true,
	}
	if err := db.Create(&user).Error; err != nil {
		log.Printf("error creando usuario %s: %v", s.username, err)
		return
	}

	profile := models.StudentProfile{
		UserID:             user.ID,
		FirstName:          s.firstName,
		LastName:           s.lastName,
		InstitutionalEmail: s.instEmail,
		Faculty:            s.faculty,
		Career:             s.career,
		Semester:           s.semester,
		Phone:              s.phone,
		Bio:                s.bio,
		Zone:               s.zone,
		ProfilePhoto:       s.photo,
		IsAvailable:        true,
	}
	if err := db.Create(&profile).Error; err != nil {
		log.Printf("error creando perfil %s: %v", s.username, err)
		return
	}

	log.Printf("creado: %s %s (%s)", s.firstName, s.lastName, s.instEmail)
}
