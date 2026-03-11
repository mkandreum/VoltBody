import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import {
  AuthScreen,
  DaySelector,
  DietSection,
  WorkoutSection,
  HistorySection,
  GoalsSection,
  TipsSection,
  Header,
  Navigation,
  Toast,
  Modal,
} from '@/components'
import { useAppState, useToast, useModal } from '@/hooks'
import { EXERCISE_CATALOG, EXERCISE_GUIDES, THEMES } from '@/constants'
import { Exercise, HistoricalWorkout, WorkoutCatalogSelection } from '@/types'
import { appStateAPI, authAPI, clearAuthToken, communityAPI, setAuthToken } from '@/api/client'

const STORAGE_KEY = 'fitnessLiquidData'
const CLOUD_EMAIL_KEY = 'voltbody_cloud_email'
const CLOUD_PASSWORD_KEY = 'voltbody_cloud_password'
const AUTH_USER_KEY = 'voltbody_auth_user'

const groupByDay: Record<string, (keyof WorkoutCatalogSelection)[]> = {
  lunes: ['pecho', 'triceps'],
  martes: ['espalda', 'biceps'],
  miercoles: ['pierna', 'gluteo'],
  jueves: ['core'],
  viernes: ['hombro', 'core'],
  sabado: ['pierna', 'gluteo', 'core'],
  domingo: ['core'],
}

type AuthUser = { id: string; email: string; name: string }

function App() {
  const [mounted, setMounted] = useState(false)
  const [cloudHydrationChecked, setCloudHydrationChecked] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  })

  const state = useAppState()
  const { toast, showToast } = useToast()
  const { isOpen, content, showModal, closeModal } = useModal()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    document.body.className = state.theme
  }, [state.theme])

  const customDayExercises = useMemo(() => {
    const groups = groupByDay[state.currentDay] || []
    const selected = groups.flatMap(group => state.selectedExercises[group] || [])
    const fallback = groups.flatMap(group => EXERCISE_CATALOG[group] || []).slice(0, 8)
    const source = selected.length > 0 ? selected : fallback

    return source.slice(0, 12).map(name => ({
      name,
      sets: 3,
      reps: state.profile.fitnessGoal === 'perder_grasa' ? '12-15' : '8-12',
    })) as Exercise[]
  }, [state.currentDay, state.selectedExercises, state.profile.fitnessGoal])

  const getSerializableState = () => ({
    currentDay: state.currentDay,
    currentTab: state.currentTab,
    historySelectedDay: state.historySelectedDay,
    theme: state.theme,
    workoutInputs: state.workoutInputs,
    historicalData: state.historicalData,
    profile: state.profile,
    specialDish: state.specialDish,
    selectedExercises: state.selectedExercises,
    motivationPhoto: state.motivationPhoto,
    motivationPhrase: state.motivationPhrase,
    communityMessages: state.communityMessages,
  })

  const buildMergedCloudState = (cloud: any) => ({
    currentDay: state.currentDay,
    currentTab: state.currentTab,
    historySelectedDay: state.historySelectedDay,
    theme: (cloud.settings?.theme as string) || state.theme,
    workoutInputs: state.workoutInputs,
    historicalData: {
      bodyMetrics: cloud.metrics || state.historicalData.bodyMetrics,
      byDay: cloud.workoutsByDay || state.historicalData.byDay,
    },
    profile: cloud.profile || state.profile,
    specialDish: state.specialDish,
    selectedExercises: state.selectedExercises,
    motivationPhoto: state.motivationPhoto,
    motivationPhrase: state.motivationPhrase,
    communityMessages: cloud.communityMessages || state.communityMessages,
  })

  const ensureCloudSession = async () => {
    const token = localStorage.getItem('auth_token')
    if (token && currentUser) return

    const cachedEmail = localStorage.getItem(CLOUD_EMAIL_KEY)
    const cachedPassword = localStorage.getItem(CLOUD_PASSWORD_KEY)
    if (!cachedEmail || !cachedPassword) {
      throw new Error('No hay sesion cloud guardada')
    }

    const response = await authAPI.login(cachedEmail, cachedPassword)
    const nextToken = response.data?.token
    const nextUser = response.data?.user as AuthUser | undefined

    if (!nextToken || !nextUser) {
      throw new Error('No se pudo restaurar la sesion')
    }

    setAuthToken(nextToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
    setCurrentUser(nextUser)
  }

  useEffect(() => {
    if (!mounted || !state.isLoaded || cloudHydrationChecked || !currentUser) return

    let cancelled = false

    const hydrateFromCloud = async () => {
      try {
        await ensureCloudSession()
        const response = await appStateAPI.get()
        if (cancelled) return

        const merged = buildMergedCloudState(response.data || {})
        const current = getSerializableState()

        if (JSON.stringify(current) !== JSON.stringify(merged)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          window.location.reload()
          return
        }
      } catch {
        // Si falla la nube, se mantiene el estado local.
      } finally {
        if (!cancelled) {
          setCloudHydrationChecked(true)
        }
      }
    }

    void hydrateFromCloud()

    return () => {
      cancelled = true
    }
  }, [cloudHydrationChecked, currentUser, mounted, state.isLoaded])

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true)
    try {
      const response = await authAPI.login(email, password)
      const token = response.data?.token
      const user = response.data?.user as AuthUser | undefined
      if (!token || !user) {
        throw new Error('Login incompleto')
      }

      setAuthToken(token)
      localStorage.setItem(CLOUD_EMAIL_KEY, email)
      localStorage.setItem(CLOUD_PASSWORD_KEY, password)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      setCurrentUser(user)
      setCloudHydrationChecked(false)
      showToast('Sesion iniciada ✅')
    } catch {
      showToast('No se pudo iniciar sesion.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true)
    try {
      const response = await authAPI.register(email, password, name)
      const token = response.data?.token
      const user = response.data?.user as AuthUser | undefined
      if (!token || !user) {
        throw new Error('Registro incompleto')
      }

      setAuthToken(token)
      localStorage.setItem(CLOUD_EMAIL_KEY, email)
      localStorage.setItem(CLOUD_PASSWORD_KEY, password)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      setCurrentUser(user)
      setCloudHydrationChecked(false)
      showToast('Cuenta creada ✅')
    } catch {
      showToast('No se pudo crear la cuenta.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem(CLOUD_EMAIL_KEY)
    localStorage.removeItem(CLOUD_PASSWORD_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setCurrentUser(null)
    closeModal()
    showToast('Sesion cerrada')
  }

  if (!mounted || !state.isLoaded) return null

  if (!currentUser) {
    return <AuthScreen loading={authLoading} onLogin={handleLogin} onRegister={handleRegister} />
  }

  const handleSaveProgress = () => {
    const dayPrefix = `${state.currentDay}_`
    const now = new Date().toISOString()
    const entries: HistoricalWorkout[] = (Object.entries(state.workoutInputs) as Array<
      [string, { weight: string; rpe: string }]
    >)
      .filter(([key, values]) => key.startsWith(dayPrefix) && Number(values.weight) > 0)
      .map(([, values]) => ({
        date: now,
        weight: Number(values.weight),
        rpe: values.rpe ? Number(values.rpe) : null,
      }))

    if (entries.length === 0) {
      showToast('No hay pesos para guardar en este dia.')
      return
    }

    state.addWorkoutHistory(state.currentDay, entries)
    showToast(`Progreso guardado: ${entries.length} registros ✅`)
  }

  const handleShowExerciseGuide = (exerciseName: string) => {
    const gifUrl = EXERCISE_GUIDES[exerciseName] || ''
    showModal(
      <div>
        <h3>{exerciseName} - Guia Tecnica</h3>
        {gifUrl ? (
          <img src={gifUrl} style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }} alt={exerciseName} />
        ) : (
          <p style={{ textAlign: 'center' }}>
            No hay GIF cargado para este ejercicio. Puedes usar la descripcion tecnica del entrenador.
          </p>
        )}
      </div>
    )
  }

  const handleImportData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
        showToast('Datos importados. Recargando app...')
        setTimeout(() => window.location.reload(), 700)
      } catch {
        showToast('El archivo JSON no es valido.')
      }
    }
    reader.readAsText(file)
  }

  const handleExportData = () => {
    const data = getSerializableState()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'voltbody-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCloudPush = async () => {
    try {
      await ensureCloudSession()
      await appStateAPI.put({
        profile: state.profile,
        settings: { theme: state.theme, language: 'es' },
        metrics: state.historicalData.bodyMetrics,
        workoutsByDay: state.historicalData.byDay,
        communityMessages: state.communityMessages,
      })
      showToast('Datos subidos a la nube ✅')
    } catch {
      showToast('No se pudo subir a nube. Revisa backend/API.')
    }
  }

  const handleCloudPull = async () => {
    try {
      await ensureCloudSession()
      const response = await appStateAPI.get()
      const cloud = response.data || {}
      const merged = buildMergedCloudState(cloud)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      showToast('Datos descargados de nube. Recargando...')
      setTimeout(() => window.location.reload(), 700)
    } catch {
      showToast('No se pudo descargar de nube. Revisa backend/API.')
    }
  }

  const handleAddCommunityMessage = async (author: string, text: string) => {
    state.addCommunityMessage(author, text)
    try {
      await ensureCloudSession()
      await communityAPI.postMessage(author, text)
    } catch {
      // Experiencia offline-first.
    }
  }

  const handleClearCommunityMessages = async () => {
    state.clearCommunityMessages()
    try {
      await ensureCloudSession()
      await communityAPI.clearMessages()
    } catch {
      // Experiencia offline-first.
    }
  }

  const handleShowSettings = () => {
    showModal(
      <div>
        <h3>Ajustes</h3>
        <div className="user-pill">
          <strong>{currentUser.name}</strong>
          <span>{currentUser.email}</span>
        </div>

        <div className="theme-buttons-grid" style={{ marginBottom: 14, marginTop: 14 }}>
          {Object.entries(THEMES).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`theme-btn ${state.theme === value ? 'active' : ''}`}
              onClick={() => state.setTheme(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <button type="button" className="tool-btn btn-shine" onClick={() => document.getElementById('restore-input')?.click()}>
          Importar datos
        </button>
        <button type="button" className="tool-btn btn-shine" onClick={handleExportData}>
          Exportar datos
        </button>
        <button type="button" className="tool-btn btn-shine" onClick={handleCloudPush}>
          Subir a nube
        </button>
        <button type="button" className="tool-btn btn-shine" onClick={handleCloudPull}>
          Descargar de nube
        </button>
        <button type="button" className="tool-btn delete-btn btn-shine" onClick={() => { state.deleteAllData(); closeModal() }}>
          Borrar todo
        </button>
        <button type="button" className="tool-btn delete-btn btn-shine" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>
    )
  }

  const handleLightning = () => {
    const overlay = document.getElementById('lightning-overlay')
    if (overlay) {
      overlay.style.opacity = '1'
      overlay.style.pointerEvents = 'auto'
      setTimeout(() => {
        overlay.style.opacity = '0'
        overlay.style.pointerEvents = 'none'
      }, 300)
    }
    showToast('Poder activado ⚡')
  }

  const renderSection = () => {
    switch (state.currentTab) {
      case 'diet':
        return (
          <DietSection
            currentDay={state.currentDay}
            specialDish={state.specialDish}
            onMealCheck={(mealId: string, checked: boolean) => state.toggleMealCheck(mealId, checked)}
            isMealChecked={(mealId: string) => state.isMealChecked(mealId)}
          />
        )
      case 'workout':
        return (
          <WorkoutSection
            currentDay={state.currentDay}
            workoutInputs={state.workoutInputs}
            customExercises={customDayExercises}
            specialClass={state.profile.specialClass}
            onInputChange={(key: string, field: 'weight' | 'rpe', value: string) =>
              state.updateWorkoutInput(key, field, value)
            }
            onSaveProgress={handleSaveProgress}
            onShowExerciseGuide={handleShowExerciseGuide}
          />
        )
      case 'history':
        return (
          <HistorySection
            historySelectedDay={state.historySelectedDay}
            onDayChange={(day: string) => state.setHistorySelectedDay(day)}
            historicalData={state.historicalData}
          />
        )
      case 'goals':
        return (
          <GoalsSection
            profile={state.profile}
            selectedExercises={state.selectedExercises}
            specialDish={state.specialDish}
            onProfileChange={state.updateProfile}
            onSelectionChange={state.updateSelectedExercises}
            onSpecialDishChange={state.setSpecialDish}
          />
        )
      case 'tips':
        return (
          <TipsSection
            profile={state.profile}
            motivationPhrase={state.motivationPhrase}
            motivationPhoto={state.motivationPhoto}
            communityMessages={state.communityMessages}
            selectedExercises={state.selectedExercises}
            onSetMotivation={state.setMotivation}
            onAddCommunityMessage={handleAddCommunityMessage}
            onClearCommunityMessages={handleClearCommunityMessages}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="liquid-container">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
      </div>
      <div id="lightning-overlay"></div>

      <div className="container">
        <Header
          onSettingsClick={handleShowSettings}
          onLightningClick={handleLightning}
          dailyProgress={state.getDailyProgress(state.currentDay)}
        />

        <div className="main-day-selector-wrapper">
          <DaySelector
            currentDay={state.currentDay}
            enabledDays={state.profile.trainDays}
            onDayChange={(day: string) => state.switchDay(day)}
          />
        </div>

        <main>
          <section className="content-section active">{renderSection()}</section>
        </main>
      </div>

      <Navigation currentTab={state.currentTab} onTabChange={(tab: string) => state.switchTab(tab)} />

      <Toast message={toast} />
      <Modal isOpen={isOpen} content={content} onClose={closeModal} />

      <input
        type="file"
        id="restore-input"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportData}
      />
    </div>
  )
}

export default App
