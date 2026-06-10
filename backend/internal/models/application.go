package models

import "time"

type Application struct {
	ID          uint            `gorm:"primaryKey" json:"id"`
	JobID       uint            `gorm:"not null;uniqueIndex:idx_job_student" json:"job_id"`
	Job         *Job            `gorm:"foreignKey:JobID" json:"job,omitempty"`
	StudentID   uint            `gorm:"not null;uniqueIndex:idx_job_student" json:"student_id"`
	Student     *StudentProfile `gorm:"foreignKey:StudentID" json:"student,omitempty"`
	CoverLetter string          `gorm:"type:text" json:"cover_letter"`
	Status      string          `gorm:"default:pending;index" json:"status"` // pending | viewed | accepted | rejected
	CreatedAt   time.Time       `json:"created_at"`
}
