package handlers

type ApplicationHandler struct {
	*Handler
}

func NewApplicationHandler(h *Handler) *ApplicationHandler {
	return &ApplicationHandler{Handler: h}
}

type applyRequest struct {
	CoverLetter string `json:"cover_letter"`
}

type updateApplicationStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=pending viewed accepted rejected"`
}
