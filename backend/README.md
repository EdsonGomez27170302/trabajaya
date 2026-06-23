# TrabajaYa Ayacucho - Backend

API REST en Go (Gin + GORM + PostgreSQL) para la plataforma TrabajaYa Ayacucho.

## Stack

- Go 1.22+ (probado con Go 1.25)
- [Gin](https://github.com/gin-gonic/gin) (HTTP)
- [GORM](https://gorm.io/) + `gorm.io/driver/postgres`
- PostgreSQL 15+
- JWT Bearer (`golang-jwt/jwt/v5`) + bcrypt
- Email vía `net/smtp` (Gmail SMTP, STARTTLS puerto 587) con fallback a log en consola
- Configuración con `.env` (`godotenv`)

## Configuración

Edita el `.env` de la raíz de `backend/` con tus valores. `JWT_SECRET` y
`DB_PASSWORD` son obligatorios: el servidor no arranca si faltan.

Variables de email: si dejas `SMTP_USER`/`SMTP_PASSWORD` vacíos, el backend
no envía correos reales y en su lugar imprime el link de verificación en
consola. Para correo real con Gmail:
- `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`
- `SMTP_USER` = tu correo de Gmail
- `SMTP_PASSWORD` = una "contraseña de aplicación" generada en
  https://myaccount.google.com/apppasswords (no tu contraseña normal)

Mercado Pago: completa `MERCADOPAGO_ACCESS_TOKEN` (credencial de producción
de tu cuenta) y `MERCADOPAGO_WEBHOOK_SECRET` (clave secreta del webhook,
configurable en el panel de Mercado Pago) para activar la pasarela de pago.

## Desarrollo local

Requiere una instancia de PostgreSQL local (pgAdmin) accesible con las
credenciales de `.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
`DB_NAME`). Aplica `db/schema.sql` y `db/seed.sql` con `psql` o pgAdmin antes
de levantar el servidor.

```bash
cd backend
go mod tidy
go run ./cmd/api
```

Descarga las imágenes de prueba (logos de empresas y fotos de estudiantes):

```bash
go run ./cmd/seed-images
```

La API queda disponible en `http://localhost:3001/api` (o el `PORT` que
definas) y los archivos estáticos (logos/fotos) en
`http://localhost:3001/uploads/...`.

## Endpoints principales

Públicos:
- `GET /health`, `GET /api/health`
- `GET /api/stats`
- `GET /api/jobs` (filtros: `zone`, `category`, `modality`, `search`, `page`, `limit`)
- `GET /api/jobs/featured?limit=3`
- `GET /api/jobs/:id`

Auth:
- `POST /api/auth/register/student`
- `POST /api/auth/register/company`
- `POST /api/auth/login`
- `GET /api/auth/verify-email?token=...`
- `GET /api/auth/me` (requiere `Authorization: Bearer <token>`)

Estudiante (`/api/student`, JWT rol `student`):
- `GET/PUT /profile`
- `GET /applications`
- `POST /jobs/:id/apply`
- `DELETE /applications/:id`
- `POST /payment/create-preference`, `GET /payment/confirm`

Empresa (`/api/company`, JWT rol `company`):
- `GET/PUT /profile`
- `GET/POST /jobs`, `PUT/DELETE /jobs/:id`
- `GET /jobs/:id/candidates`
- `PUT /applications/:id` (cambia estado y notifica al estudiante)
- `POST /payment/create-preference`, `GET /payment/confirm`

Notificaciones (`/api/notifications`, JWT cualquier rol):
- `GET ""`, `PUT /:id/read`, `PUT /read-all`

Admin (`/api/admin`, JWT rol `admin`):
- `GET /users?role=`
- `PUT /users/:id/toggle-active`
- `PUT /companies/:id/verify`
- `GET /jobs?status=&include_deleted=true`
- `PUT /jobs/:id/moderate`
- `DELETE /jobs/:id`

Pagos (Mercado Pago):
- `POST /api/payments/webhook` (notificaciones server-to-server de Mercado Pago)

## Probar rápidamente

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/stats
curl http://localhost:3001/api/jobs

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@trabajaya.pe","password":"Demo1234!"}'
```
