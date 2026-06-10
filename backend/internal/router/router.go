package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/handlers"
	"trabajaya-backend/internal/middleware"
	"trabajaya-backend/internal/services"
)

func New(db *gorm.DB, cfg *config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORS(cfg.CORSOrigin))

	emailService := services.NewEmailService(cfg)
	h := handlers.NewHandler(db, cfg, emailService)

	authHandler := handlers.NewAuthHandler(h)
	jobHandler := handlers.NewJobHandler(h)
	applicationHandler := handlers.NewApplicationHandler(h)
	profileHandler := handlers.NewProfileHandler(h)
	notificationHandler := handlers.NewNotificationHandler(h)
	adminHandler := handlers.NewAdminHandler(h)
	statsHandler := handlers.NewStatsHandler(h)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
		api.GET("/stats", statsHandler.GetStats)

		// Public job board
		api.GET("/jobs", jobHandler.ListJobs)
		api.GET("/jobs/featured", jobHandler.FeaturedJobs)
		api.GET("/jobs/:id", jobHandler.GetJob)

		// Auth
		auth := api.Group("/auth")
		{
			auth.POST("/register/student", authHandler.RegisterStudent)
			auth.POST("/register/company", authHandler.RegisterCompany)
			auth.POST("/login", authHandler.Login)
			auth.GET("/verify-email", authHandler.VerifyEmail)
			auth.GET("/me", middleware.AuthRequired(cfg.JWTSecret), authHandler.Me)
		}

		// Student
		student := api.Group("/student")
		student.Use(middleware.AuthRequired(cfg.JWTSecret), middleware.RequireRole("student"))
		{
			student.GET("/profile", profileHandler.GetStudentProfile)
			student.PUT("/profile", profileHandler.UpdateStudentProfile)
			student.GET("/applications", applicationHandler.MyApplications)
			student.POST("/jobs/:id/apply", applicationHandler.Apply)
			student.DELETE("/applications/:id", applicationHandler.WithdrawApplication)
		}

		// Company
		company := api.Group("/company")
		company.Use(middleware.AuthRequired(cfg.JWTSecret), middleware.RequireRole("company"))
		{
			company.GET("/profile", profileHandler.GetCompanyProfile)
			company.PUT("/profile", profileHandler.UpdateCompanyProfile)
			company.GET("/jobs", jobHandler.MyJobs)
			company.POST("/jobs", jobHandler.CreateJob)
			company.PUT("/jobs/:id", jobHandler.UpdateJob)
			company.DELETE("/jobs/:id", jobHandler.DeleteJob)
			company.GET("/jobs/:id/candidates", jobHandler.JobCandidates)
			company.PUT("/applications/:id", applicationHandler.UpdateApplicationStatus)
		}

		// Notifications (any authenticated role)
		notifications := api.Group("/notifications")
		notifications.Use(middleware.AuthRequired(cfg.JWTSecret))
		{
			notifications.GET("", notificationHandler.ListNotifications)
			notifications.PUT("/:id/read", notificationHandler.MarkAsRead)
			notifications.PUT("/read-all", notificationHandler.MarkAllAsRead)
		}

		// Admin
		admin := api.Group("/admin")
		admin.Use(middleware.AuthRequired(cfg.JWTSecret), middleware.RequireRole("admin"))
		{
			admin.GET("/users", adminHandler.ListUsers)
			admin.PUT("/users/:id/toggle-active", adminHandler.ToggleUserActive)
			admin.PUT("/companies/:id/verify", adminHandler.VerifyCompany)
			admin.GET("/jobs", adminHandler.ListAllJobs)
			admin.PUT("/jobs/:id/moderate", adminHandler.ModerateJob)
			admin.DELETE("/jobs/:id", adminHandler.DeleteJob)
		}
	}

	return r
}
