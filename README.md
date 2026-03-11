# VoltBody

App fitness mobile-first con login real, plan de dieta y entreno personalizable, seguimiento de progreso y sincronizacion cloud basica.

## Funcionalidades actuales

- Login y registro real en la app.
- Sesion persistente de usuario.
- Temas: Aguamarina-Negro, Verde-Negro y Ocaso-Negro.
- Perfil configurable: objetivo, actividad, pasos, lugar de entreno, hora, dias, prioridades y patologias.
- Dieta diaria con resumen, almuerzo automatico y plato especial personalizado.
- Entreno configurable con catalogo amplio de ejercicios por grupo muscular.
- Clase especial semanal configurable.
- Historial de progreso por dia.
- Motivacion con frase y foto.
- Comunidad simple tipo muro.
- Sincronizacion cloud manual y carga automatica al arrancar si existe sesion.
- Backend Express que sirve API y frontend compilado en una sola app.

## Stack

### Frontend
- React 18
- Vite
- TypeScript
- Axios

### Backend
- Express
- TypeScript
- Persistencia JSON local en `server/data/store.json`
- Archivos de imagen en `uploads/`

## Instalacion

```bash
npm install
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

## Build local

```bash
npm run build:all
```

## Docker

Archivos incluidos:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

Levantar local con Docker Compose:

```bash
docker compose up --build
```

La app quedara disponible en:

- `http://localhost:3000`

Persistencia incluida por volumen para:

- `server/data`
- `uploads`

## Coolify

Configuracion recomendada en Coolify:

1. Tipo de despliegue: `Dockerfile`
2. Puerto expuesto: `3000`
3. Variable opcional: `PORT=3000`
4. Volumen persistente para `/app/server/data`
5. Volumen persistente para `/app/uploads`

No necesitas separar frontend y backend en servicios distintos porque Express sirve tambien el build de Vite.

## Variables de entorno

Ver `.env.example`.

- `VITE_API_URL=` vacio para mismo origen
- `NODE_ENV=production`
- `PORT=3000`

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

## Notas

- La persistencia actual del backend es local JSON. Para multiusuario serio a mayor escala, el siguiente salto natural es PostgreSQL/Prisma.
- La autenticacion actual es funcional, pero ligera. Si quieres endurecer seguridad, el siguiente paso es hash de password y expiracion real de sesiones.

## Ultima actualizacion

Marzo 2026
