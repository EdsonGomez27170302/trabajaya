package models

type CompanyProfile struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	UserID      uint   `gorm:"uniqueIndex;not null" json:"user_id"`
	CompanyName string `json:"company_name"`
	RUC         string `json:"ruc"`
	Sector      string `json:"sector"`
	Description string `gorm:"type:text" json:"description"`
	Address     string `json:"address"`
	Zone        string `json:"zone"`
	Phone       string `json:"phone"`
	Website     string `json:"website"`
	LogoURL     string `json:"logo_url"`
	IsVerified  bool   `gorm:"default:false" json:"is_verified"`
	Plan        string `gorm:"default:free" json:"plan"`
}
