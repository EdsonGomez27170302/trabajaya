package config

import (
	"log"

	"github.com/joho/godotenv"
)

func Load() *Config {
	_ = godotenv.Load()

	dbPassword := getEnv("DB_PASSWORD", "")
	if dbPassword == "" {
		log.Fatal("DB_PASSWORD no está definido en el entorno (obligatorio, sin valor por defecto)")
	}
	ginMode := getEnv("GIN_MODE", "release")

	return &Config{
		Port:        getEnv("PORT", "3002"),
		DBHost:      getEnv("DB_HOST", "localhost"),
		DBPort:      getEnv("DB_PORT", "5432"),
		DBUser:      getEnv("DB_USER", "postgres"),
		DBPassword:  dbPassword,
		DBName:      getEnv("DB_NAME", "trabajaya"),
		DBSSLMode:   getEnv("DB_SSLMODE", "disable"),
		AutoMigrate: getEnvBool("AUTO_MIGRATE", true),

		SessionCookieName:   getEnv("SESSION_COOKIE_NAME", "trabajaya_session"),
		SessionCookieSecure: getEnvBool("SESSION_COOKIE_SECURE", ginMode == "release"),
		SessionExpiresHours: getEnvInt("SESSION_EXPIRES_HOURS", 72),

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

		GinMode: ginMode,
	}
}
