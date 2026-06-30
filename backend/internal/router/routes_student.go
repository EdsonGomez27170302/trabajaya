package router

import (
	"github.com/gin-gonic/gin"

	"trabajaya-backend/internal/config"
	"trabajaya-backend/internal/middleware"
)

func registerStudentRoutes(api *gin.RouterGroup, cfg *config.Config, hs *handlerSet) {
	student := api.Group("/student")
	student.Use(middleware.AuthRequired(cfg.JWTSecret), middleware.RequireRole("student"))
	{
		student.GET("/profile", hs.profileHandler.GetStudentProfile)
		student.PUT("/profile", hs.profileHandler.UpdateStudentProfile)
		student.GET("/applications", hs.applicationHandler.MyApplications)
		student.POST("/jobs/:id/apply", hs.applicationHandler.Apply)
		student.DELETE("/applications/:id", hs.applicationHandler.WithdrawApplication)
		student.POST("/payment/process", hs.paymentHandler.ProcessStudentPayment)
	}
}
