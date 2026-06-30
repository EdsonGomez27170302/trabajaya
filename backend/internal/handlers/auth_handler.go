package handlers

type AuthHandler struct {
	*Handler
}

func NewAuthHandler(h *Handler) *AuthHandler {
	return &AuthHandler{Handler: h}
}
