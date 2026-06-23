package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	DBSSLMode   string
	AutoMigrate bool

	JWTSecret       string
	JWTExpiresHours int

	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	SMTPFrom     string

	FrontendURL              string
	CORSOrigin               string
	InstitutionalEmailDomain string
	UploadsDir               string

	MercadoPagoAccessToken   string
	MercadoPagoWebhookSecret string
	MercadoPagoPremiumPrice  float64

	GinMode string
}

func Load() *Config {
	_ = godotenv.Load()

	jwtSecret := getEnv("JWT_SECRET", "")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET no está definido en el entorno (obligatorio, sin valor por defecto)")
	}
	dbPassword := getEnv("DB_PASSWORD", "")
	if dbPassword == "" {
		log.Fatal("DB_PASSWORD no está definido en el entorno (obligatorio, sin valor por defecto)")
	}

	return &Config{
		Port:        getEnv("PORT", "3002"),
		DBHost:      getEnv("DB_HOST", "localhost"),
		DBPort:      getEnv("DB_PORT", "5432"),
		DBUser:      getEnv("DB_USER", "postgres"),
		DBPassword:  dbPassword,
		DBName:      getEnv("DB_NAME", "trabajaya"),
		DBSSLMode:   getEnv("DB_SSLMODE", "disable"),
		AutoMigrate: getEnvBool("AUTO_MIGRATE", true),

		JWTSecret:       jwtSecret,
		JWTExpiresHours: getEnvInt("JWT_EXPIRES_HOURS", 72),

		SMTPHost:     getEnv("SMTP_HOST", ""),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", "no-reply@trabajaya.pe"),

		FrontendURL:              getEnv("FRONTEND_URL", "http://localhost:3000"),
		CORSOrigin:               getEnv("CORS_ORIGIN", "http://localhost:3000"),
		InstitutionalEmailDomain: getEnv("INSTITUTIONAL_EMAIL_DOMAIN", "unsch.edu.pe"),
		UploadsDir:               getEnv("UPLOADS_DIR", "./uploads"),

		MercadoPagoAccessToken:   getEnv("MERCADOPAGO_ACCESS_TOKEN", ""),
		MercadoPagoWebhookSecret: getEnv("MERCADOPAGO_WEBHOOK_SECRET", ""),
		MercadoPagoPremiumPrice:  getEnvFloat("MERCADOPAGO_PREMIUM_PRICE", 29.90),

		GinMode: getEnv("GIN_MODE", "release"),
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}

func getEnvFloat(key string, fallback float64) float64 {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		if f, err := strconv.ParseFloat(v, 64); err == nil {
			return f
		}
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
	}
	return fallback
}
