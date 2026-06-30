package handlers

type JobHandler struct {
	*Handler
}

func NewJobHandler(h *Handler) *JobHandler {
	return &JobHandler{Handler: h}
}

func defaultStatus(status string) string {
	switch status {
	case "active", "paused", "closed":
		return status
	default:
		return "active"
	}
}
