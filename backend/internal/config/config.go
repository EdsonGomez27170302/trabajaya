package config

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
