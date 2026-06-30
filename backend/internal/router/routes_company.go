package router

import (
	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/middleware"
)

func registerCompanyRoutes(api *gin.RouterGroup, cfg *config.Config, hs *handlerSet) {
	company := api.Group("/company")
	company.Use(middleware.AuthRequired(cfg.JWTSecret), middleware.RequireRole("company"))
	{
		company.GET("/profile", hs.profileHandler.GetCompanyProfile)
		company.PUT("/profile", hs.profileHandler.UpdateCompanyProfile)
		company.GET("/jobs", hs.jobHandler.MyJobs)
		company.POST("/jobs", hs.jobHandler.CreateJob)
		company.PUT("/jobs/:id", hs.jobHandler.UpdateJob)
		company.DELETE("/jobs/:id", hs.jobHandler.DeleteJob)
		company.GET("/jobs/:id/candidates", hs.jobHandler.JobCandidates)
		company.PUT("/applications/:id", hs.applicationHandler.UpdateApplicationStatus)
		company.POST("/payment/process", hs.paymentHandler.ProcessCompanyPayment)
	}
}
