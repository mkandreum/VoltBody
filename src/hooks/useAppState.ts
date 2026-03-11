import { ReactNode, useState, useEffect, useCallback } from 'react'
import {
  AppState,
  BodyMetric,
  CommunityMessage,
  HistoricalWorkout,
  UserProfile,
  WorkoutCatalogSelection,
  SpecialDish,
} from '@/types'
import { DIET_DATA } from '@/constants/dietData'

const getTodaySpanish = (): string => {
  const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  return days[new Date().getDay()]
}

const STORAGE_KEY = 'fitnessLiquidData'
const THEME_KEY = 'fitnessTheme'
const LAST_TAB_KEY = 'fitnessLiquidLastTab'
const LAST_DAY_KEY = 'fitnessLiquidLastDay'

const defaultProfile: UserProfile = {
  fitnessGoal: 'recomposicion',
  activityLevel: 'moderado',
  dailySteps: 7000,
  trainingPlace: 'gym',
  trainTime: '19:00',
  trainDays: ['lunes', 'martes', 'miercoles', 'viernes', 'sabado'],
  priorities: ['pierna', 'espalda'],
  foodPathologies: '',
  injuryPathologies: '',
  specialClass: 'zumba_instructor_jean',
  targetKg: 4,
  targetMonths: 4,
}

const defaultSelection: WorkoutCatalogSelection = {
  pecho: [],
  espalda: [],
  hombro: [],
  pierna: [],
  biceps: [],
  triceps: [],
  gluteo: [],
  core: [],
}

const defaultState: AppState = {
  currentDay: getTodaySpanish(),
  currentTab: 'diet',
  historySelectedDay: getTodaySpanish(),
  theme: 'theme-aquamarine',
  workoutInputs: {},
  historicalData: { bodyMetrics: [], byDay: {} },
  profile: defaultProfile,
  specialDish: null,
  selectedExercises: defaultSelection,
  motivationPhoto: '',
  motivationPhrase: 'Disciplina hoy, orgullo manana.',
  communityMessages: [],
}

const mergeState = (stored: Partial<AppState>): AppState => ({
  ...defaultState,
  ...stored,
  historicalData: {
    ...defaultState.historicalData,
    ...(stored.historicalData || {}),
    bodyMetrics: stored.historicalData?.bodyMetrics || [],
    byDay: stored.historicalData?.byDay || {},
  },
  profile: {
    ...defaultProfile,
    ...(stored.profile || {}),
    trainDays: stored.profile?.trainDays || defaultProfile.trainDays,
    priorities: stored.profile?.priorities || defaultProfile.priorities,
  },
  selectedExercises: {
    ...defaultSelection,
    ...(stored.selectedExercises || {}),
  },
  specialDish: stored.specialDish || null,
  motivationPhoto: stored.motivationPhoto || '',
  motivationPhrase: stored.motivationPhrase || defaultState.motivationPhrase,
  communityMessages: stored.communityMessages || [],
})

export const useAppState = () => {
  const [state, setState] = useState<AppState>(defaultState)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mealCheckVersion, setMealCheckVersion] = useState(0)

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      const savedTheme = localStorage.getItem(THEME_KEY) || defaultState.theme
      const savedTab = localStorage.getItem(LAST_TAB_KEY) || 'diet'
      const savedDay = localStorage.getItem(LAST_DAY_KEY) || getTodaySpanish()

      const parsedData = savedData ? (JSON.parse(savedData) as Partial<AppState>) : {}
      const hydrated = mergeState(parsedData)

      setState({
        ...hydrated,
        theme: savedTheme,
        currentTab: savedTab,
        currentDay: savedDay,
        historySelectedDay: hydrated.historySelectedDay || getTodaySpanish(),
      })

      document.body.className = savedTheme
    } catch (error) {
      console.error('Error loading saved data:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const persistState = useCallback((next: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const setTheme = useCallback((theme: string) => {
    setState(prev => {
      const next = { ...prev, theme }
      persistState(next)
      return next
    })
    localStorage.setItem(THEME_KEY, theme)
    document.body.className = theme
  }, [persistState])

  const switchTab = useCallback((tab: string) => {
    setState(prev => ({ ...prev, currentTab: tab }))
    localStorage.setItem(LAST_TAB_KEY, tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const switchDay = useCallback((day: string) => {
    setState(prev => ({ ...prev, currentDay: day }))
    localStorage.setItem(LAST_DAY_KEY, day)
  }, [])

  const setHistorySelectedDay = useCallback((day: string) => {
    setState(prev => ({ ...prev, historySelectedDay: day }))
  }, [])

  const updateWorkoutInput = useCallback((key: string, field: 'weight' | 'rpe', value: string) => {
    setState(prev => {
      const next = {
        ...prev,
        workoutInputs: {
          ...prev.workoutInputs,
          [key]: { ...prev.workoutInputs[key], [field]: value },
        },
      }
      persistState(next)
      return next
    })
  }, [persistState])

  const saveHistoricalData = useCallback((data: AppState['historicalData']) => {
    setState(prev => {
      const next = { ...prev, historicalData: data as AppState['historicalData'] }
      persistState(next)
      return next
    })
  }, [persistState])

  const addBodyMetric = useCallback((metric: BodyMetric) => {
    setState(prev => {
      const newData = { ...prev.historicalData }
      const metrics = Array.isArray(newData.bodyMetrics) ? [...newData.bodyMetrics] : []
      metrics.push(metric)
      metrics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      newData.bodyMetrics = metrics
      const next = { ...prev, historicalData: newData }
      persistState(next)
      return next
    })
  }, [persistState])

  const addWorkoutHistory = useCallback((day: string, entries: HistoricalWorkout[]) => {
    if (entries.length === 0) return
    setState(prev => {
      const dayHistory = Array.isArray(prev.historicalData.byDay[day]) ? [...prev.historicalData.byDay[day]] : []
      const merged = [...dayHistory, ...entries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      const nextData = {
        ...prev.historicalData,
        byDay: {
          ...prev.historicalData.byDay,
          [day]: merged,
        },
      }
      const next = { ...prev, historicalData: nextData }
      persistState(next)
      return next
    })
  }, [persistState])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState(prev => {
      const next = { ...prev, profile: { ...prev.profile, ...patch } }
      persistState(next)
      return next
    })
  }, [persistState])

  const updateSelectedExercises = useCallback((selection: WorkoutCatalogSelection) => {
    setState(prev => {
      const next = { ...prev, selectedExercises: selection }
      persistState(next)
      return next
    })
  }, [persistState])

  const setSpecialDish = useCallback((dish: SpecialDish | null) => {
    setState(prev => {
      const next = { ...prev, specialDish: dish }
      persistState(next)
      return next
    })
  }, [persistState])

  const setMotivation = useCallback((phrase: string, photo: string) => {
    setState(prev => {
      const next = { ...prev, motivationPhrase: phrase, motivationPhoto: photo }
      persistState(next)
      return next
    })
  }, [persistState])

  const addCommunityMessage = useCallback((author: string, text: string) => {
    const message: CommunityMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      author: author.trim() || 'Usuario',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }

    if (!message.text) return

    setState(prev => {
      const next = {
        ...prev,
        communityMessages: [message, ...prev.communityMessages].slice(0, 100),
      }
      persistState(next)
      return next
    })
  }, [persistState])

  const clearCommunityMessages = useCallback(() => {
    setState(prev => {
      const next = { ...prev, communityMessages: [] }
      persistState(next)
      return next
    })
  }, [persistState])

  const toggleMealCheck = useCallback((mealId: string, checked: boolean) => {
    if (checked) {
      localStorage.setItem(mealId, 'true')
    } else {
      localStorage.removeItem(mealId)
    }
    setMealCheckVersion(v => v + 1)
  }, [])

  const isMealChecked = useCallback((mealId: string) => {
    return localStorage.getItem(mealId) === 'true'
  }, [])

  const deleteAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(THEME_KEY)
    localStorage.removeItem(LAST_TAB_KEY)
    localStorage.removeItem(LAST_DAY_KEY)
    Object.keys(localStorage).forEach(key => {
      if (key.includes('-meal-')) {
        localStorage.removeItem(key)
      }
    })
    setState(defaultState)
    document.body.className = defaultState.theme
  }, [])

  const getDailyProgress = useCallback((day: string): number => {
    const dayMeals = DIET_DATA[day] || []
    if (dayMeals.length === 0) return 0
    let checked = 0
    for (let i = 0; i < dayMeals.length; i++) {
      if (localStorage.getItem(`${day}-meal-${i}`) === 'true') {
        checked++
      }
    }
    return Math.round((checked / dayMeals.length) * 100)
  }, [mealCheckVersion])

  return {
    ...state,
    isLoaded,
    setTheme,
    switchTab,
    switchDay,
    setHistorySelectedDay,
    updateWorkoutInput,
    saveHistoricalData,
    addWorkoutHistory,
    addBodyMetric,
    updateProfile,
    updateSelectedExercises,
    setSpecialDish,
    setMotivation,
    addCommunityMessage,
    clearCommunityMessages,
    toggleMealCheck,
    isMealChecked,
    deleteAllData,
    getDailyProgress,
  }
}

export const useToast = () => {
  const [toast, setToast] = useState<string>('')

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }, [])

  return { toast, showToast }
}

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)

  const showModal = useCallback((node: ReactNode) => {
    setContent(node)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => setContent(null), 300)
  }, [])

  return { isOpen, content, showModal, closeModal }
}
