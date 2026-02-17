# VoltBody - Fitness App

Plan de Hipertrofia Personalizado con seguimiento de progreso, dieta y entrenamientos.

## Fases de Desarrollo

### ✅ Fase 1: Scaffold Base (EN PROGRESO)
- Crear proyecto Vite + React + TypeScript
- Migrar todo el CSS sin cambios visuales
- Portar HTML a componente React App
- Estructura de carpetas y configuración

**Estado:** Creando estructura base...

### 📋 Fase 2: Portar Lógica UI a React
- Convertir JavaScript vanillla a hooks de React
- Componentes: Diet, Workout, History, Goals, Tips
- Sistema de tabs y day selector
- Integración de Chart.js en React

### 🔧 Fase 3: Backend + Prisma + JWT Auth
- API REST con Express
- Esquema Prisma (Users, Workouts, BodyMetrics, MealChecks, etc.)
- Autenticación JWT (registro + login)
- CRUD endpoints

### 📸 Fase 4: Archivos y Fotos
- Upload de fotos a disco (/uploads)
- Almacenar URL en BD
- Servir archivos estáticos desde backend

### 🐳 Fase 5: Docker + Coolify Deploy
- Dockerfile multi-stage (frontend + backend)
- docker-compose con PostgreSQL
- Ejecutar migrations al startup
- Variables de entorno y volúmenes

## Stack Tecnológico

### Frontend
- React 18
- Vite
- TypeScript
- Chart.js (gráficas)
- Axios (HTTP client)

### Backend
- Express.js
- Prisma (ORM)
- TypeScript
- JWT (autenticación)
- Multer (uploads)
- PostgreSQL

### DevOps
- Docker
- Docker Compose
- Coolify (deployment)

## Setup Local

### Requisitos
- Node.js >= 18
- PostgreSQL >= 13

### Instalación

1. Instalar dependencias:
```bash
npm install
npm install --save-dev tsx
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales de BD
```

3. Crear BD y ejecutar migrations:
```bash
npm run db:push
npm run db:migrate
```

4. Generar cliente Prisma:
```bash
npm run db:generate
```

### Desarrollo

En dos terminales:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Accede a http://localhost:5173

**Terminal 2 - Backend:**
```bash
npm run server:dev
```
El backend estará en http://localhost:3000

## Estructura de Carpetas

```
VoltBody/
├── public/                 # Assets estáticos
├── src/
│   ├── components/        # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Utilidades
│   ├── api/               # Cliente de API
│   ├── constants/         # Datos constantes
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css          # Estilos globales
├── server/
│   ├── routes/            # Rutas Express
│   ├── middleware/        # Middleware
│   ├── controllers/       # Lógica de negocio
│   ├── prisma/            # Schema y migrations
│   ├── uploads/           # Archivos subidos
│   └── index.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

## Base de Datos

### Modelos Principales (Prisma)
- **User**: Información de usuario + autenticación
- **HistoricalWorkout**: Historial de entrenamientos
- **BodyMetrics**: Medidas corporales
- **ProgressPhoto**: Fotos de progreso
- **MealCheck**: Comidas marcadas como completadas
- **UserSettings**: Tema, preferencias

## API Endpoints (Fase 3)

### Auth
- `POST /auth/register` - Crear usuario
- `POST /auth/login` - Login con JWT
- `POST /auth/refresh` - Refrescar token

### Workouts
- `GET /workouts/:day` - Obtener entrenamientos del día
- `POST /workouts/:day/:exercise` - Guardar progreso ejercicio

### Body Metrics
- `GET /metrics` - Historial de medidas
- `POST /metrics` - Guardar nueva medida
- `POST /metrics/photo` - Subir foto

### Settings
- `GET /settings` - Obtener preferencias
- `PUT /settings` - Actualizar preferencias

## Decisiones de Diseño

✅ **PostgreSQL**: BD robusta y escalable  
✅ **Prisma**: Type-safe ORM, fácil de mantener  
✅ **JWT**: Stateless, ideal para APIs  
✅ **Fotos en disco**: Performance vs Base64  
✅ **Docker Compose**: Deploy sencillo en Coolify  
✅ **React + TypeScript**: Type-safety y escalabilidad  

## Próximos Pasos

1. Instalar dependencias: `npm install`
2. Continuar con **Fase 2**: Componentes React
3. Implementar hooks para estado global
4. Crear componentes por sección (Diet, Workout, etc.)

---

**Mantenedor**: VoltBody Team  
**Última actualización**: Feb 2025
