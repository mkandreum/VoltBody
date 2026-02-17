import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Servir carpeta de uploads como archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'VoltBody API running' })
})

// Rutas (se implementarán en Fase 3)
// app.use('/api/auth', authRoutes)
// app.use('/api/workouts', workoutRoutes)
// app.use('/api/metrics', metricsRoutes)
// app.use('/api/settings', settingsRoutes)

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo salió mal', message: err.message })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' })
})

app.listen(PORT, () => {
  console.log(`✅ VoltBody API escuchando en puerto ${PORT}`)
  console.log(`🔗 http://localhost:${PORT}`)
})
