// Hook personalizado para gestión de estado global

import { useState, useEffect, useCallback } from 'react'
import { AppState, BodyMetric, HistoricalWorkout } from '@/types'
import { DAY_ORDER, THEMES } from '@/constants'
import { DIET_DATA } from '@/constants/dietData'

const getTodaySpanish = (): string => {
  const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  return days[new Date().getDay()]
}

const STORAGE_KEY = 'fitnessLiquidData'
const THEME_KEY = 'fitnessTheme'
const LAST_TAB_KEY = 'fitnessLiquidLastTab'
const LAST_DAY_KEY = 'fitnessLiquidLastDay'

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    currentDay: getTodaySpanish(),
    currentTab: 'diet',
    historySelectedDay: getTodaySpanish(),
    theme: 'theme-blue',
    workoutInputs: {},
    historicalData: { bodyMetrics: [] },
  })

  const [isLoaded, setIsLoaded] = useState(false)
  // Counter to trigger re-renders when meals are checked/unchecked
  const [mealCheckVersion, setMealCheckVersion] = useState(0)

  // Cargar datos al inicializar
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      const savedTheme = localStorage.getItem(THEME_KEY) || 'theme-blue'
      const savedTab = localStorage.getItem(LAST_TAB_KEY) || 'diet'
      const savedDay = localStorage.getItem(LAST_DAY_KEY) || getTodaySpanish()

      const parsedData = savedData ? JSON.parse(savedData) : {}

      setState(prev => ({
        ...prev,
        theme: savedTheme,
        currentTab: savedTab,
        currentDay: savedDay,
        historySelectedDay: getTodaySpanish(),
        historicalData: parsedData.historicalData || { bodyMetrics: [] },
      }))

      // Aplicar tema
      document.body.className = savedTheme
    } catch (error) {
      console.error('Error loading saved data:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Guardar tema
  const setTheme = useCallback((theme: string) => {
    setState(prev => ({ ...prev, theme }))
    localStorage.setItem(THEME_KEY, theme)
    document.body.className = theme
  }, [])

  // Cambiar tab
  const switchTab = useCallback((tab: string) => {
    setState(prev => ({ ...prev, currentTab: tab }))
    localStorage.setItem(LAST_TAB_KEY, tab)
    window.scrollTo(0, 0)
  }, [])

  // Cambiar día
  const switchDay = useCallback((day: string) => {
    setState(prev => ({ ...prev, currentDay: day }))
    localStorage.setItem(LAST_DAY_KEY, day)
  }, [])

  // Cambiar día en historial
  const setHistorySelectedDay = useCallback((day: string) => {
    setState(prev => ({ ...prev, historySelectedDay: day }))
  }, [])

  // Actualizar input de entreno
  const updateWorkoutInput = useCallback((key: string, field: 'weight' | 'rpe', value: string) => {
    setState(prev => ({
      ...prev,
      workoutInputs: {
        ...prev.workoutInputs,
        [key]: { ...prev.workoutInputs[key], [field]: value },
      },
    }))
  }, [])

  // Guardar datos históricos
  const saveHistoricalData = useCallback((data: Record<string, any>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ historicalData: data }))
      setState(prev => ({ ...prev, historicalData: data as AppState['historicalData'] }))
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }, [])

  // Añadir medida corporal
  const addBodyMetric = useCallback((metric: BodyMetric) => {
    setState(prev => {
      const newData = { ...prev.historicalData }
      const metrics = Array.isArray(newData.bodyMetrics) ? newData.bodyMetrics : []
      metrics.push(metric)
      metrics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      newData.bodyMetrics = metrics
      saveHistoricalData(newData)
      return { ...prev, historicalData: newData }
    })
  }, [saveHistoricalData])

  // Completar comida
  const toggleMealCheck = useCallback((mealId: string, checked: boolean) => {
    if (checked) {
      localStorage.setItem(mealId, 'true')
    } else {
      localStorage.removeItem(mealId)
    }
    setMealCheckVersion(v => v + 1)
  }, [])

  // Verificar si comida está completada
  const isMealChecked = useCallback((mealId: string) => {
    return localStorage.getItem(mealId) === 'true'
  }, [])

  // Limpiar todos los datos
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
    setState({
      currentDay: getTodaySpanish(),
      currentTab: 'diet',
      historySelectedDay: getTodaySpanish(),
      theme: 'theme-blue',
      workoutInputs: {},
      historicalData: { bodyMetrics: [] },
    })
    document.body.className = 'theme-blue'
  }, [])

  // Calcular progreso diario basado en comidas completadas
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    addBodyMetric,
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
  const [content, setContent] = useState<string>('')

  const showModal = useCallback((html: string) => {
    setContent(html)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => setContent(''), 300)
  }, [])

  return { isOpen, content, showModal, closeModal }
}
