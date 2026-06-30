package services

import (
	"fmt"
	"log"

	"trabajaya-backend/internal/config"
)

type EmailService struct {
	cfg *config.Config
}

func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{cfg: cfg}
}

func (s *EmailService) SendVerificationEmail(toEmail, toName, token string) error {
	link := fmt.Sprintf("%s/auth/verify-email?token=%s", s.cfg.FrontendURL, token)

	if s.cfg.SMTPHost == "" {
		log.Printf("[email] SMTP not configured. Verification link for %s <%s>: %s", toName, toEmail, link)
		return nil
	}

	subject := "Verifica tu cuenta en TrabajaYa Ayacucho"
	body := fmt.Sprintf(
		"Hola %s,\r\n\r\nGracias por registrarte en TrabajaYa Ayacucho. "+
			"Para activar tu cuenta, haz clic en el siguiente enlace:\r\n\r\n%s\r\n\r\n"+
			"Si no creaste esta cuenta, puedes ignorar este mensaje.\r\n\r\nEquipo TrabajaYa Ayacucho",
		toName, link,
	)

	return s.sendMail(toEmail, subject, body)
}
