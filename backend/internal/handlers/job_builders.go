package handlers

import "trabajaya-backend/internal/models"

func jobFromRequest(req jobRequest, companyID uint, isPremium bool) models.Job {
	j := models.Job{
		CompanyID:      companyID,
		Title:          req.Title,
		Description:    req.Description,
		Requirements:   req.Requirements,
		Category:       req.Category,
		Modality:       req.Modality,
		Zone:           req.Zone,
		Salary:         req.Salary,
		SalaryType:     req.SalaryType,
		HoursPerWeek:   req.HoursPerWeek,
		Schedule:       req.Schedule,
		Vacancies:      req.Vacancies,
		Status:         defaultStatus(req.Status),
		IsFeatured:     req.IsFeatured && isPremium,
		ContactPhone:   req.ContactPhone,
		ContactEmail:   req.ContactEmail,
		ContactAddress: req.ContactAddress,
	}
	if req.ExpiresAt != nil {
		if t, err := parseTime(*req.ExpiresAt); err == nil {
			j.ExpiresAt = &t
		}
	}
	return j
}

func applyJobRequest(job *models.Job, req jobRequest, isPremium bool) {
	job.Title = req.Title
	job.Description = req.Description
	job.Requirements = req.Requirements
	job.Category = req.Category
	job.Modality = req.Modality
	job.Zone = req.Zone
	job.Salary = req.Salary
	job.SalaryType = req.SalaryType
	job.HoursPerWeek = req.HoursPerWeek
	job.Schedule = req.Schedule
	job.Vacancies = req.Vacancies
	job.Status = defaultStatus(req.Status)
	job.IsFeatured = req.IsFeatured && isPremium
	job.ContactPhone = req.ContactPhone
	job.ContactEmail = req.ContactEmail
	job.ContactAddress = req.ContactAddress
	if req.ExpiresAt != nil {
		if t, err := parseTime(*req.ExpiresAt); err == nil {
			job.ExpiresAt = &t
		}
	}
}
