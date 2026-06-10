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

1. Copia `.env.example` a `.env` y ajusta los valores (ya viene un `.env` de
   desarrollo listo para usar con el `docker-compose.yml` de la raíz del repo).
2. Variables de email: si dejas `SMTP_USER`/`SMTP_PASSWORD` vacíos, el backend
   no envía correos reales y en su lugar imprime el link de verificación en
   consola. Para correo real con Gmail:
   - `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`
   - `SMTP_USER` = tu correo de Gmail
   - `SMTP_PASSWORD` = una "contraseña de aplicación" generada en
     https://myaccount.google.com/apppasswords (no tu contraseña normal)

## Levantar todo con Docker (recomendado, sin `psql` local)

Desde la raíz del repo:

```bash
docker compose up -d postgres adminer
```

Esto levanta PostgreSQL (puerto 5432) y Adminer (http://localhost:8081,
sistema "PostgreSQL", servidor `postgres`, usuario/clave/BD según `backend/.env`).

1. Abre Adminer, conéctate y pega el contenido de `db/schema.sql` en
   "Consulta SQL" y ejecútalo.
2. Pega luego el contenido de `db/seed.sql` y ejecútalo (incluye 6 empresas,
   8 estudiantes, 1 admin, 20 ofertas, postulaciones y notificaciones de
   ejemplo - credenciales al inicio del archivo).
3. Descarga las imágenes de prueba (logos de empresas y fotos de estudiantes):

   ```bash
   cd backend
   go run ./cmd/seed-images
   ```

4. Levanta el backend:

   ```bash
   docker compose up -d backend
   # o, en local sin Docker:
   cd backend && go run ./cmd/api
   ```

La API queda disponible en `http://localhost:3001/api` y los archivos
estáticos (logos/fotos) en `http://localhost:3001/uploads/...`.

## Desarrollo local (sin Docker)

```bash
cd backend
go mod tidy
go run ./cmd/api
```

Necesitas una instancia de PostgreSQL accesible con las credenciales de
`.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). Con
`AUTO_MIGRATE=true` (default), GORM crea/actualiza las tablas automáticamente
al iniciar.

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

Empresa (`/api/company`, JWT rol `company`):
- `GET/PUT /profile`
- `GET/POST /jobs`, `PUT/DELETE /jobs/:id`
- `GET /jobs/:id/candidates`
- `PUT /applications/:id` (cambia estado y notifica al estudiante)

Notificaciones (`/api/notifications`, JWT cualquier rol):
- `GET ""`, `PUT /:id/read`, `PUT /read-all`

Admin (`/api/admin`, JWT rol `admin`):
- `GET /users?role=`
- `PUT /users/:id/toggle-active`
- `PUT /companies/:id/verify`
- `GET /jobs?status=&include_deleted=true`
- `PUT /jobs/:id/moderate`
- `DELETE /jobs/:id`

## Probar rápidamente

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/stats
curl http://localhost:3001/api/jobs
curl http://localhost:3001/api/jobs/featured

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@trabajaya.pe","password":"Demo1234!"}'
```
