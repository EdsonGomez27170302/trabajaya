# TrabajaYa Ayacucho — Frontend

Bolsa laboral digital que conecta empresas de Ayacucho con estudiantes de la UNSCH. Construido con
Next.js (App Router), TypeScript y Tailwind CSS.

## Requisitos

- [Bun](https://bun.sh) — único gestor de paquetes y runtime usado en este proyecto.

## Empezar

```bash
bun install
bun dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copia `.env.local` (ver `lib/config.ts`) y define:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Estructura

- `src/app` — rutas (App Router)
- `src/features` — lógica de negocio por dominio (auth, estudiante, empresa, admin, public)
- `src/components` — componentes compartidos transversales
- `src/lib` — utilidades (cliente HTTP, configuración, helpers)
- `src/types` — tipos compartidos
