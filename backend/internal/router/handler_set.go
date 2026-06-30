package router

import "trabajaya-backend/internal/handlers"

// handlerSet bundles every handler instance used to wire up routes, so route
// registration functions don't need a long parameter list each.
type handlerSet struct {
	authHandler         *handlers.AuthHandler
	jobHandler          *handlers.JobHandler
	applicationHandler  *handlers.ApplicationHandler
	profileHandler      *handlers.ProfileHandler
	notificationHandler *handlers.NotificationHandler
	adminHandler        *handlers.AdminHandler
	statsHandler        *handlers.StatsHandler
	paymentHandler      *handlers.PaymentHandler
}

func newHandlerSet(h *handlers.Handler) *handlerSet {
	return &handlerSet{
		authHandler:         handlers.NewAuthHandler(h),
		jobHandler:          handlers.NewJobHandler(h),
		applicationHandler:  handlers.NewApplicationHandler(h),
		profileHandler:      handlers.NewProfileHandler(h),
		notificationHandler: handlers.NewNotificationHandler(h),
		adminHandler:        handlers.NewAdminHandler(h),
		statsHandler:        handlers.NewStatsHandler(h),
		paymentHandler:      handlers.NewPaymentHandler(h),
	}
}
