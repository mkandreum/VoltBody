# VoltBody

Aplicacion fitness (frontend React + backend Express) con autenticacion real y persistencia relacional en PostgreSQL mediante Prisma.

## Estado actual

- Backend migrado a `Prisma + PostgreSQL`.
- Persistencia en tablas SQL relacionales (sin `store.json` como fuente de verdad).
- Login/registro/sesion con tabla `Session`.
- Perfil, settings, metricas, entrenos y comunidad almacenados en tablas dedicadas.
- UI renovada con nuevo sistema visual para cards, modales, navegacion y formularios.

## Stack

### Frontend
- React 18
- Vite
- TypeScript
- Axios

### Backend
- Express
- Prisma ORM
- PostgreSQL 16

## Instalacion local

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
```

## Desarrollo

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run server:dev
```

## Docker Compose

```bash
docker compose up --build
```

Servicios:
- App: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Nota sobre logs de PostgreSQL

El mensaje:

`PostgreSQL Database directory appears to contain a database; Skipping initialization`

es normal cuando ya existe un volumen de datos con una base inicializada. No es un error.

## Problema `UserProfile.goalDirection` (resuelto)

Se agrego una migracion SQL en `prisma/migrations/20260401_relational_core/migration.sql` que:
- crea tablas base si no existen,
- y agrega columnas faltantes (incluyendo `goalDirection`) con `ADD COLUMN IF NOT EXISTS`.

Con esto, el login deja de fallar por columnas ausentes al consultar `UserProfile`.

## Variables de entorno

Ver `.env.example`.

Variables importantes:
- `DATABASE_URL`
- `PORT`
- `SESSION_DAYS`
- `VITE_API_URL`

## Scripts utiles

- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:deploy`
- `npm run server:dev`
- `npm run build:all`

## Endpoints principales

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Estado y perfil
- `GET /api/settings`
- `PUT /api/settings`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/app-state`
- `PUT /api/app-state`

### Progreso
- `GET /api/metrics`
- `POST /api/metrics`
- `POST /api/metrics/photo`
- `GET /api/workouts/:day`
- `POST /api/workouts/:day/:exercise`

### Comunidad
- `GET /api/community/messages`
- `POST /api/community/messages`
- `DELETE /api/community/messages`

## Ultima actualizacion

Abril 2026
