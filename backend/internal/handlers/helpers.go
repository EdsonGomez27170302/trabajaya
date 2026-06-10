package handlers

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/middleware"
	"trabajaya-backend/internal/models"
)

func currentUserID(c *gin.Context) uint {
	userID, _ := c.Get(middleware.ContextUserIDKey)
	id, _ := userID.(uint)
	return id
}

func getCompanyProfileByUserID(db *gorm.DB, userID uint) (*models.CompanyProfile, error) {
	var profile models.CompanyProfile
	if err := db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		return nil, err
	}
	return &profile, nil
}

func getStudentProfileByUserID(db *gorm.DB, userID uint) (*models.StudentProfile, error) {
	var profile models.StudentProfile
	if err := db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		return nil, err
	}
	return &profile, nil
}

func parsePagination(c *gin.Context) (page, limit, offset int) {
	page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ = strconv.Atoi(c.DefaultQuery("limit", "20"))
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset = (page - 1) * limit
	return
}

func parseLimit(s string) (int, error) {
	return strconv.Atoi(s)
}

func parseTime(s string) (time.Time, error) {
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t, nil
	}
	return time.Parse("2006-01-02", s)
}
