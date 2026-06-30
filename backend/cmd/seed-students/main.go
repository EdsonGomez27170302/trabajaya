package main

import (
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func hash(pw string) string {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	return string(b)
}

func main() {
	dsn := "host=localhost user=postgres password=1234 dbname=trabajaya port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("no se pudo conectar a la base de datos: %v", err)
	}

	pw := hash("Estudiante123!")

	for _, s := range students {
		seedStudent(db, s, pw)
	}

	log.Println("seed completado")
}
