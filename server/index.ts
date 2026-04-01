import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = Number(process.env.PORT || 3000)
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 30)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '../uploads')
const frontendDistDir = path.join(__dirname, '../../dist')

type AuthenticatedRequest = express.Request & { userId: string; token: string }

type ProfilePayload = {
  fitnessGoal?: string
  activityLevel?: string
  dailySteps?: number
  trainingPlace?: string
  trainTime?: string
  trainDays?: string[]
  priorities?: string[]
  foodPathologies?: string
  injuryPathologies?: string
  specialClass?: string
  targetKg?: number
  targetMonths?: number
  goal?: string
  goalDirection?: string
  goalTargetKg?: number
  goalTimelineMonths?: number
  motivationPhrase?: string
  motivationPhoto?: string
  profilePhoto?: string
}

type AppStatePayload = {
  profile?: ProfilePayload
  settings?: { theme?: string; language?: string }
  metrics?: Array<{ date?: string; weight?: number; waist?: number; chest?: number; arm?: number; photo?: string }>
  workoutsByDay?: Record<string, Array<{ date?: string; weight?: number; rpe?: number | null; exercise?: string }>>
  communityMessages?: Array<{ author?: string; text?: string; createdAt?: string }>
}

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

const createToken = () => crypto.randomBytes(32).toString('hex')

const sanitizeUser = (user: { id: string; email: string; name: string }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
})

const parseCsv = (value: string): string[] =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

const toCsv = (value?: string[]): string => (Array.isArray(value) ? value.filter(Boolean).join(',') : '')

const getProfileResponse = (profile: {
  fitnessGoal: string
  activityLevel: string
  dailySteps: number
  trainingPlace: string
  trainTime: string
  trainDaysCsv: string
  prioritiesCsv: string
  foodPathologies: string
  injuryPathologies: string
  specialClass: string
  targetKg: number
  targetMonths: number
  goal: string | null
  goalDirection: string
  goalTargetKg: number | null
  goalTimelineMonths: number | null
  motivationPhrase: string | null
  motivationPhoto: string | null
  profilePhoto: string | null
} | null) => ({
  fitnessGoal: profile?.fitnessGoal || 'recomposicion',
  activityLevel: profile?.activityLevel || 'moderado',
  dailySteps: profile?.dailySteps ?? 7000,
  trainingPlace: profile?.trainingPlace || 'gym',
  trainTime: profile?.trainTime || '19:00',
  trainDays: profile ? parseCsv(profile.trainDaysCsv) : ['lunes', 'martes', 'miercoles', 'viernes', 'sabado'],
  priorities: profile ? parseCsv(profile.prioritiesCsv) : ['pierna', 'espalda'],
  foodPathologies: profile?.foodPathologies || '',
  injuryPathologies: profile?.injuryPathologies || '',
  specialClass: profile?.specialClass || 'zumba_instructor_jean',
  targetKg: profile?.targetKg ?? 4,
  targetMonths: profile?.targetMonths ?? 4,
  goal: profile?.goal || null,
  goalDirection: profile?.goalDirection || 'mantener',
  goalTargetKg: profile?.goalTargetKg || null,
  goalTimelineMonths: profile?.goalTimelineMonths || null,
  motivationPhrase: profile?.motivationPhrase || '',
  motivationPhoto: profile?.motivationPhoto || '',
  profilePhoto: profile?.profilePhoto || '',
})

const toProfileData = (patch: ProfilePayload) => {
  const update: Record<string, string | number> = {}

  if (patch.fitnessGoal !== undefined) update.fitnessGoal = patch.fitnessGoal
  if (patch.activityLevel !== undefined) update.activityLevel = patch.activityLevel
  if (patch.dailySteps !== undefined) update.dailySteps = Number(patch.dailySteps) || 0
  if (patch.trainingPlace !== undefined) update.trainingPlace = patch.trainingPlace
  if (patch.trainTime !== undefined) update.trainTime = patch.trainTime
  if (patch.trainDays !== undefined) update.trainDaysCsv = toCsv(patch.trainDays)
  if (patch.priorities !== undefined) update.prioritiesCsv = toCsv(patch.priorities)
  if (patch.foodPathologies !== undefined) update.foodPathologies = patch.foodPathologies
  if (patch.injuryPathologies !== undefined) update.injuryPathologies = patch.injuryPathologies
  if (patch.specialClass !== undefined) update.specialClass = patch.specialClass
  if (patch.targetKg !== undefined) update.targetKg = Number(patch.targetKg) || 0
  if (patch.targetMonths !== undefined) update.targetMonths = Math.max(Number(patch.targetMonths) || 1, 1)
  if (patch.goal !== undefined) update.goal = patch.goal
  if (patch.goalDirection !== undefined) update.goalDirection = patch.goalDirection
  if (patch.goalTargetKg !== undefined) update.goalTargetKg = Number(patch.goalTargetKg) || 0
  if (patch.goalTimelineMonths !== undefined) update.goalTimelineMonths = Math.max(Number(patch.goalTimelineMonths) || 1, 1)
  if (patch.motivationPhrase !== undefined) update.motivationPhrase = patch.motivationPhrase
  if (patch.motivationPhoto !== undefined) update.motivationPhoto = patch.motivationPhoto
  if (patch.profilePhoto !== undefined) update.profilePhoto = patch.profilePhoto

  return update
}

const authFromRequest = (req: express.Request): string | null => {
  const header = req.headers.authorization
  if (!header) return null
  const [, token] = header.split(' ')
  return token || null
}

const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = authFromRequest(req)
  if (!token) {
    res.status(401).json({ error: 'No autorizado', message: 'Falta token' })
    return
  }

  const session = await prisma.session.findUnique({ where: { token } })
  if (!session || session.expiresAt.getTime() < Date.now()) {
    if (session) {
      await prisma.session.delete({ where: { token } })
    }
    res.status(401).json({ error: 'No autorizado', message: 'Token invalido o expirado' })
    return
  }

  ;(req as AuthenticatedRequest).userId = session.userId
  ;(req as AuthenticatedRequest).token = token
  next()
}

const getWorkoutsByDay = async (userId: string) => {
  const rows = await prisma.workoutEntry.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  })

  return rows.reduce<Record<string, Array<{ date: string; weight: number; rpe: number | null; exercise: string }>>>(
    (acc, row) => {
      if (!acc[row.day]) acc[row.day] = []
      acc[row.day].push({
        date: row.date.toISOString(),
        weight: row.weight,
        rpe: row.rpe,
        exercise: row.exercise,
      })
      return acc
    },
    {}
  )
}

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use('/uploads', express.static(uploadsDir))

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'VoltBody API running' })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'VoltBody API running' })
})

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string }

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Datos invalidos', message: 'email, password y name son obligatorios' })
    return
  }

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (exists) {
    res.status(409).json({ error: 'Usuario existente', message: 'Ese email ya esta registrado' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  const token = createToken()

  const user = await prisma.$transaction(async tx => {
    const created = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        passwordHash,
      },
    })

    await tx.userSettings.create({
      data: {
        userId: created.id,
        theme: 'theme-aquamarine',
        language: 'es',
      },
    })

    await tx.userProfile.create({ data: { userId: created.id } })

    await tx.session.create({
      data: {
        token,
        userId: created.id,
        expiresAt,
      },
    })

    return created
  })

  res.status(201).json({ token, user: sanitizeUser(user) })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Datos invalidos', message: 'email y password son obligatorios' })
    return
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) {
    res.status(401).json({ error: 'Credenciales invalidas', message: 'Revisa email y password' })
    return
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ error: 'Credenciales invalidas', message: 'Revisa email y password' })
    return
  }

  const token = createToken()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })

  res.json({ token, user: sanitizeUser(user) })
})

app.post('/api/auth/refresh', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  await prisma.session.delete({ where: { token: typedReq.token } })

  const nextToken = createToken()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      token: nextToken,
      userId: typedReq.userId,
      expiresAt,
    },
  })

  res.json({ token: nextToken })
})

app.get('/api/settings', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const settings = await prisma.userSettings.findUnique({ where: { userId: typedReq.userId } })
  res.json({
    theme: settings?.theme || 'theme-aquamarine',
    language: settings?.language || 'es',
  })
})

app.put('/api/settings', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const body = req.body as { theme?: string; language?: string }

  const settings = await prisma.userSettings.upsert({
    where: { userId: typedReq.userId },
    update: {
      theme: body.theme,
      language: body.language,
    },
    create: {
      userId: typedReq.userId,
      theme: body.theme || 'theme-aquamarine',
      language: body.language || 'es',
    },
  })

  res.json({ theme: settings.theme, language: settings.language })
})

app.get('/api/profile', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const profile = await prisma.userProfile.findUnique({ where: { userId: typedReq.userId } })
  res.json(getProfileResponse(profile))
})

app.put('/api/profile', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const patch = req.body as ProfilePayload

  const profileData = toProfileData(patch)
  const profile = await prisma.userProfile.upsert({
    where: { userId: typedReq.userId },
    update: profileData,
    create: {
      userId: typedReq.userId,
      ...profileData,
    },
  })

  res.json(getProfileResponse(profile))
})

app.get('/api/metrics', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const metrics = await prisma.bodyMetric.findMany({
    where: { userId: typedReq.userId },
    orderBy: { date: 'asc' },
  })

  res.json(
    metrics.map(item => ({
      date: item.date.toISOString(),
      weight: item.weight,
      waist: item.waist,
      chest: item.chest,
      arm: item.arm,
      photo: item.photo,
    }))
  )
})

app.post('/api/metrics', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const metric = req.body as { date?: string; weight?: number; waist?: number; chest?: number; arm?: number; photo?: string }

  const created = await prisma.bodyMetric.create({
    data: {
      userId: typedReq.userId,
      date: metric.date ? new Date(metric.date) : new Date(),
      weight: metric.weight,
      waist: metric.waist,
      chest: metric.chest,
      arm: metric.arm,
      photo: metric.photo,
    },
  })

  res.status(201).json({
    date: created.date.toISOString(),
    weight: created.weight,
    waist: created.waist,
    chest: created.chest,
    arm: created.arm,
    photo: created.photo,
  })
})

app.post('/api/metrics/photo', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
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

app.get('/api/workouts/:day', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const day = req.params.day

  const entries = await prisma.workoutEntry.findMany({
    where: { userId: typedReq.userId, day },
    orderBy: { date: 'asc' },
  })

  res.json(
    entries.map(item => ({
      date: item.date.toISOString(),
      weight: item.weight,
      rpe: item.rpe,
      exercise: item.exercise,
    }))
  )
})

app.post('/api/workouts/:day/:exercise', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const day = req.params.day
  const exercise = req.params.exercise
  const { weight, rpe } = req.body as { weight?: number; rpe?: number }

  if (!weight || Number(weight) <= 0) {
    res.status(400).json({ error: 'Datos invalidos', message: 'weight debe ser mayor a 0' })
    return
  }

  const created = await prisma.workoutEntry.create({
    data: {
      userId: typedReq.userId,
      day,
      exercise,
      date: new Date(),
      weight: Number(weight),
      rpe: typeof rpe === 'number' ? Number(rpe) : null,
    },
  })

  res.status(201).json({
    date: created.date.toISOString(),
    weight: created.weight,
    rpe: created.rpe,
    exercise: created.exercise,
  })
})

app.get('/api/community/messages', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const messages = await prisma.communityMessage.findMany({
    where: { userId: typedReq.userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  res.json(messages)
})

app.post('/api/community/messages', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const { author, text } = req.body as { author?: string; text?: string }

  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Datos invalidos', message: 'text es obligatorio' })
    return
  }

  const created = await prisma.communityMessage.create({
    data: {
      userId: typedReq.userId,
      author: (author || 'Usuario').trim(),
      text: text.trim(),
      createdAt: new Date(),
    },
  })

  res.status(201).json(created)
})

app.delete('/api/community/messages', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  await prisma.communityMessage.deleteMany({ where: { userId: typedReq.userId } })
  res.status(204).send()
})

app.get('/api/app-state', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest

  const [settings, profile, metrics, workoutsByDay, communityMessages] = await Promise.all([
    prisma.userSettings.findUnique({ where: { userId: typedReq.userId } }),
    prisma.userProfile.findUnique({ where: { userId: typedReq.userId } }),
    prisma.bodyMetric.findMany({ where: { userId: typedReq.userId }, orderBy: { date: 'asc' } }),
    getWorkoutsByDay(typedReq.userId),
    prisma.communityMessage.findMany({ where: { userId: typedReq.userId }, orderBy: { createdAt: 'desc' }, take: 100 }),
  ])

  res.json({
    profile: getProfileResponse(profile),
    settings: {
      theme: settings?.theme || 'theme-aquamarine',
      language: settings?.language || 'es',
    },
    metrics: metrics.map(item => ({
      date: item.date.toISOString(),
      weight: item.weight,
      waist: item.waist,
      chest: item.chest,
      arm: item.arm,
      photo: item.photo,
    })),
    workoutsByDay,
    communityMessages,
  })
})

app.put('/api/app-state', requireAuth, async (req, res) => {
  const typedReq = req as AuthenticatedRequest
  const payload = req.body as AppStatePayload

  await prisma.$transaction(async tx => {
    if (payload.settings) {
      await tx.userSettings.upsert({
        where: { userId: typedReq.userId },
        update: {
          theme: payload.settings.theme,
          language: payload.settings.language,
        },
        create: {
          userId: typedReq.userId,
          theme: payload.settings.theme || 'theme-aquamarine',
          language: payload.settings.language || 'es',
        },
      })
    }

    if (payload.profile) {
      const profileData = toProfileData(payload.profile)
      await tx.userProfile.upsert({
        where: { userId: typedReq.userId },
        update: profileData,
        create: {
          userId: typedReq.userId,
          ...profileData,
        },
      })
    }

    if (payload.metrics) {
      await tx.bodyMetric.deleteMany({ where: { userId: typedReq.userId } })
      if (payload.metrics.length > 0) {
        await tx.bodyMetric.createMany({
          data: payload.metrics.map(metric => ({
            userId: typedReq.userId,
            date: metric.date ? new Date(metric.date) : new Date(),
            weight: metric.weight,
            waist: metric.waist,
            chest: metric.chest,
            arm: metric.arm,
            photo: metric.photo,
          })),
        })
      }
    }

    if (payload.workoutsByDay) {
      await tx.workoutEntry.deleteMany({ where: { userId: typedReq.userId } })
      const flatWorkouts = Object.entries(payload.workoutsByDay).flatMap(([day, entries]) =>
        (entries || []).map(entry => ({
          userId: typedReq.userId,
          day,
          exercise: entry.exercise || 'general',
          date: entry.date ? new Date(entry.date) : new Date(),
          weight: Number(entry.weight) || 0,
          rpe: typeof entry.rpe === 'number' ? entry.rpe : null,
        }))
      )

      if (flatWorkouts.length > 0) {
        await tx.workoutEntry.createMany({
          data: flatWorkouts.filter(item => item.weight > 0),
        })
      }
    }

    if (payload.communityMessages) {
      await tx.communityMessage.deleteMany({ where: { userId: typedReq.userId } })
      if (payload.communityMessages.length > 0) {
        await tx.communityMessage.createMany({
          data: payload.communityMessages
            .filter(message => Boolean(message.text?.trim()))
            .slice(0, 100)
            .map(message => ({
              userId: typedReq.userId,
              author: (message.author || 'Usuario').trim(),
              text: (message.text || '').trim(),
              createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
            })),
        })
      }
    }
  })

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

const bootstrap = async () => {
  ensureUploadsDir()
  await prisma.$executeRaw`SELECT 1`

  app.listen(PORT, () => {
    console.log(`VoltBody API escuchando en puerto ${PORT}`)
    console.log(`http://localhost:${PORT}`)
  })
}

bootstrap().catch(error => {
  console.error('Error iniciando servidor:', error)
  process.exit(1)
})
