package services

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"

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

func (s *EmailService) sendMail(to, subject, body string) error {
	addr := fmt.Sprintf("%s:%s", s.cfg.SMTPHost, s.cfg.SMTPPort)

	msg := fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=\"utf-8\"\r\n\r\n%s",
		s.cfg.SMTPFrom, to, subject, body,
	)

	auth := smtp.PlainAuth("", s.cfg.SMTPUser, s.cfg.SMTPPassword, s.cfg.SMTPHost)

	conn, err := smtp.Dial(addr)
	if err != nil {
		return fmt.Errorf("smtp dial: %w", err)
	}
	defer conn.Close()

	if err := conn.Hello("localhost"); err != nil {
		return fmt.Errorf("smtp hello: %w", err)
	}

	if ok, _ := conn.Extension("STARTTLS"); ok {
		tlsConfig := &tls.Config{ServerName: s.cfg.SMTPHost}
		if err := conn.StartTLS(tlsConfig); err != nil {
			return fmt.Errorf("smtp starttls: %w", err)
		}
	}

	if err := conn.Auth(auth); err != nil {
		return fmt.Errorf("smtp auth: %w", err)
	}

	if err := conn.Mail(s.cfg.SMTPFrom); err != nil {
		return fmt.Errorf("smtp mail from: %w", err)
	}
	if err := conn.Rcpt(to); err != nil {
		return fmt.Errorf("smtp rcpt to: %w", err)
	}

	w, err := conn.Data()
	if err != nil {
		return fmt.Errorf("smtp data: %w", err)
	}
	if _, err := w.Write([]byte(msg)); err != nil {
		return fmt.Errorf("smtp write: %w", err)
	}
	if err := w.Close(); err != nil {
		return fmt.Errorf("smtp close: %w", err)
	}

	return conn.Quit()
}
