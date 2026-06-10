package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/models"
)

type StatsHandler struct {
	*Handler
}

func NewStatsHandler(h *Handler) *StatsHandler {
	return &StatsHandler{Handler: h}
}

// GetStats returns aggregate platform numbers used by the public landing page.
func (h *StatsHandler) GetStats(c *gin.Context) {
	var activeJobs int64
	h.DB.Model(&models.Job{}).Where("status = ?", "active").Count(&activeJobs)

	var verifiedStudents int64
	h.DB.Model(&models.User{}).
		Joins("JOIN student_profiles ON student_profiles.user_id = users.id").
		Where("users.role = ? AND users.is_verified = ?", "student", true).
		Count(&verifiedStudents)

	var registeredCompanies int64
	h.DB.Model(&models.CompanyProfile{}).Count(&registeredCompanies)

	c.JSON(http.StatusOK, gin.H{
		"active_jobs":          activeJobs,
		"verified_students":    verifiedStudents,
		"registered_companies": registeredCompanies,
	})
}
