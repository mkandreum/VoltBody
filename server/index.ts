import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 3000)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '../uploads')
const dataDir = path.join(__dirname, '../data')
const dataFile = path.join(dataDir, 'store.json')
const frontendDistDir = path.join(__dirname, '../../dist')

interface CommunityMessage {
  id: string
  author: string
  text: string
  createdAt: string
}

interface WorkoutEntry {
  date: string
  weight: number
  rpe: number | null
  exercise: string
}

interface BodyMetric {
  date: string
  weight?: number
  waist?: number
  chest?: number
  arm?: number
  photo?: string
}

interface UserData {
  id: string
  email: string
  name: string
  password: string
  settings: Record<string, unknown>
  profile: Record<string, unknown>
  metrics: BodyMetric[]
  workoutsByDay: Record<string, WorkoutEntry[]>
  communityMessages: CommunityMessage[]
}

interface Store {
  users: Record<string, UserData>
  sessions: Record<string, string>
}

const ensureDirs = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(dataFile)) {
    const initial: Store = { users: {}, sessions: {} }
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2), 'utf8')
  }
}

const readStore = (): Store => {
  ensureDirs()
  const raw = fs.readFileSync(dataFile, 'utf8')
  return JSON.parse(raw) as Store
}

const writeStore = (store: Store) => {
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2), 'utf8')
}

const createToken = () => crypto.randomBytes(32).toString('hex')
const createUserId = () => crypto.randomUUID()

const sanitizeUser = (user: UserData) => ({
  id: user.id,
  email: user.email,
  name: user.name,
})

const authFromRequest = (req: express.Request): string | null => {
  const header = req.headers.authorization
  if (!header) return null
  const [, token] = header.split(' ')
  return token || null
}

const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = authFromRequest(req)
  if (!token) {
    res.status(401).json({ error: 'No autorizado', message: 'Falta token' })
    return
  }

  const store = readStore()
  const userId = store.sessions[token]
  if (!userId || !store.users[userId]) {
    res.status(401).json({ error: 'No autorizado', message: 'Token invalido o expirado' })
    return
  }

  ;(req as express.Request & { userId: string; token: string }).userId = userId
  ;(req as express.Request & { userId: string; token: string }).token = token
  next()
}

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use('/uploads', express.static(uploadsDir))

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'VoltBody API running' })
})

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string }

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Datos invalidos', message: 'email, password y name son obligatorios' })
    return
  }

  const store = readStore()
  const exists = Object.values(store.users).some(user => user.email.toLowerCase() === email.toLowerCase())
  if (exists) {
    res.status(409).json({ error: 'Usuario existente', message: 'Ese email ya esta registrado' })
    return
  }

  const userId = createUserId()
  store.users[userId] = {
    id: userId,
    email,
    name,
    password,
    settings: { theme: 'theme-aquamarine', language: 'es' },
    profile: {},
    metrics: [],
    workoutsByDay: {},
    communityMessages: [],
  }

  const token = createToken()
  store.sessions[token] = userId
  writeStore(store)

  res.status(201).json({ token, user: sanitizeUser(store.users[userId]) })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    res.status(400).json({ error: 'Datos invalidos', message: 'email y password son obligatorios' })
    return
  }

  const store = readStore()
  const user = Object.values(store.users).find(
    item => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  )

  if (!user) {
    res.status(401).json({ error: 'Credenciales invalidas', message: 'Revisa email y password' })
    return
  }

  const token = createToken()
  store.sessions[token] = user.id
  writeStore(store)

  res.json({ token, user: sanitizeUser(user) })
})

app.post('/api/auth/refresh', requireAuth, (req, res) => {
  const store = readStore()
  const typedReq = req as express.Request & { userId: string; token: string }
  delete store.sessions[typedReq.token]

  const nextToken = createToken()
  store.sessions[nextToken] = typedReq.userId
  writeStore(store)

  res.json({ token: nextToken })
})

app.get('/api/settings', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  res.json(store.users[typedReq.userId].settings)
})

app.put('/api/settings', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  const current = store.users[typedReq.userId].settings
  store.users[typedReq.userId].settings = { ...current, ...(req.body as Record<string, unknown>) }
  writeStore(store)
  res.json(store.users[typedReq.userId].settings)
})

app.get('/api/profile', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  res.json(store.users[typedReq.userId].profile)
})

app.put('/api/profile', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  const current = store.users[typedReq.userId].profile
  store.users[typedReq.userId].profile = { ...current, ...(req.body as Record<string, unknown>) }
  writeStore(store)
  res.json(store.users[typedReq.userId].profile)
})

app.get('/api/metrics', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  res.json(store.users[typedReq.userId].metrics)
})

app.post('/api/metrics', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()

  const metric = req.body as BodyMetric
  const normalized: BodyMetric = {
    ...metric,
    date: metric.date || new Date().toISOString(),
  }

  store.users[typedReq.userId].metrics.push(normalized)
  store.users[typedReq.userId].metrics.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())
  writeStore(store)

  res.status(201).json(normalized)
})

app.post('/api/metrics/photo', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const { photoBase64 } = req.body as { photoBase64?: string }

  if (!photoBase64) {
    res.status(400).json({ error: 'Datos invalidos', message: 'Debes enviar photoBase64' })
    return
  }

  const safeBase64 = photoBase64.includes(',') ? photoBase64.split(',')[1] : photoBase64
  const fileName = `${typedReq.userId}-${Date.now()}.png`
  const filePath = path.join(uploadsDir, fileName)
  fs.writeFileSync(filePath, safeBase64, 'base64')

  const url = `/uploads/${fileName}`
  res.status(201).json({ url })
})

app.get('/api/workouts/:day', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  const day = req.params.day
  res.json(store.users[typedReq.userId].workoutsByDay[day] || [])
})

app.post('/api/workouts/:day/:exercise', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()

  const day = req.params.day
  const exercise = req.params.exercise
  const { weight, rpe } = req.body as { weight?: number; rpe?: number }

  if (!weight || Number(weight) <= 0) {
    res.status(400).json({ error: 'Datos invalidos', message: 'weight debe ser mayor a 0' })
    return
  }

  const entry: WorkoutEntry = {
    date: new Date().toISOString(),
    weight: Number(weight),
    rpe: typeof rpe === 'number' ? Number(rpe) : null,
    exercise,
  }

  if (!store.users[typedReq.userId].workoutsByDay[day]) {
    store.users[typedReq.userId].workoutsByDay[day] = []
  }

  store.users[typedReq.userId].workoutsByDay[day].push(entry)
  writeStore(store)

  res.status(201).json(entry)
})

app.get('/api/community/messages', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  res.json(store.users[typedReq.userId].communityMessages)
})

app.post('/api/community/messages', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  const { author, text } = req.body as { author?: string; text?: string }

  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Datos invalidos', message: 'text es obligatorio' })
    return
  }

  const message: CommunityMessage = {
    id: crypto.randomUUID(),
    author: (author || 'Usuario').trim(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  }

  store.users[typedReq.userId].communityMessages.unshift(message)
  store.users[typedReq.userId].communityMessages = store.users[typedReq.userId].communityMessages.slice(0, 100)
  writeStore(store)

  res.status(201).json(message)
})

app.delete('/api/community/messages', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  store.users[typedReq.userId].communityMessages = []
  writeStore(store)
  res.status(204).send()
})

app.get('/api/app-state', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  const user = store.users[typedReq.userId]

  res.json({
    profile: user.profile,
    settings: user.settings,
    metrics: user.metrics,
    workoutsByDay: user.workoutsByDay,
    communityMessages: user.communityMessages,
  })
})

app.put('/api/app-state', requireAuth, (req, res) => {
  const typedReq = req as express.Request & { userId: string }
  const store = readStore()
  const user = store.users[typedReq.userId]
  const payload = req.body as Partial<UserData>

  user.profile = payload.profile || user.profile
  user.settings = payload.settings || user.settings
  user.metrics = payload.metrics || user.metrics
  user.workoutsByDay = payload.workoutsByDay || user.workoutsByDay
  user.communityMessages = payload.communityMessages || user.communityMessages

  writeStore(store)
  res.json({ ok: true })
})

if (fs.existsSync(frontendDistDir)) {
  app.use(express.static(frontendDistDir))

  app.get(/^(?!\/api|\/health|\/uploads).*/, (_req, res) => {
    res.sendFile(path.join(frontendDistDir, 'index.html'))
  })
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo salio mal', message: err.message })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' })
})

app.listen(PORT, () => {
  ensureDirs()
  console.log(`VoltBody API escuchando en puerto ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
