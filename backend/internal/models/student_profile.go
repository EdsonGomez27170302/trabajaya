package models

type StudentProfile struct {
	ID                 uint               `gorm:"primaryKey" json:"id"`
	UserID             uint               `gorm:"uniqueIndex;not null" json:"user_id"`
	FirstName          string             `json:"first_name"`
	LastName           string             `json:"last_name"`
	InstitutionalEmail string             `gorm:"uniqueIndex" json:"institutional_email"`
	Faculty            string             `json:"faculty"`
	Career             string             `json:"career"`
	Semester           int                `json:"semester"`
	Phone              string             `json:"phone"`
	Bio                string             `gorm:"type:text" json:"bio"`
	CVUrl              string             `json:"cv_url"`
	Availability       JSONStringArrayMap `gorm:"type:jsonb" json:"availability"`
	Zone               string             `json:"zone"`
	ProfilePhoto       string             `json:"profile_photo"`
	IsAvailable        bool               `gorm:"default:true" json:"is_available"`
	IsFeatured         bool               `gorm:"default:false" json:"is_featured"`
}
