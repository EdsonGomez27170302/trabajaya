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
	hs := newHandlerSet(h)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
		api.GET("/stats", hs.statsHandler.GetStats)

		api.GET("/jobs", hs.jobHandler.ListJobs)
		api.GET("/jobs/featured", hs.jobHandler.FeaturedJobs)
		api.GET("/jobs/:id", hs.jobHandler.GetJob)

		api.GET("/students", hs.profileHandler.ListAvailableStudents)

		registerAuthRoutes(api, cfg, hs)
		registerStudentRoutes(api, cfg, hs)
		registerCompanyRoutes(api, cfg, hs)

		api.POST("/payments/webhook", hs.paymentHandler.Webhook)

		registerNotificationRoutes(api, cfg, hs)
		registerAdminRoutes(api, cfg, hs)
	}

	return r
}
