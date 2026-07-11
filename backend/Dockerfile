FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /api ./cmd/api

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

COPY --from=builder /api .
COPY --from=builder /app/internal/database /app/internal/database
COPY --from=builder /app/internal/config /app/internal/config
COPY --from=builder /app/internal/handlers /app/internal/handlers
COPY --from=builder /app/internal/middleware /app/internal/middleware
COPY --from=builder /app/internal/models /app/internal/models
COPY --from=builder /app/internal/router /app/internal/router
COPY --from=builder /app/internal/services /app/internal/services
COPY --from=builder /app/internal/utils /app/internal/utils

RUN mkdir -p /app/uploads

ENV PORT=3004
ENV GIN_MODE=release
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=trabajaya
ENV DB_SSLMODE=disable
ENV FRONTEND_URL=http://localhost:3005
ENV CORS_ORIGIN=http://localhost:3005

EXPOSE 3004

CMD ["./api"]
