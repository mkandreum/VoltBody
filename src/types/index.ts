// Tipos para la aplicación

export interface Macro {
  p: number // proteína
  c: number // carbohidratos
  f: number // grasas
}

export interface MealAlternative {
  foods: string
  calories: number
  macros: Macro
  prep: string
}

export interface Meal {
  time: string
  calories: number
  foods: string
  macros: Macro
  prep: string
  alternatives?: MealAlternative[]
}

export interface Exercise {
  name: string
  sets: number
  reps: string
}

export interface WorkoutDay {
  type: string
  duration: string
  exercises: Exercise[]
  core?: string
}

export interface HistoricalWorkout {
  date: string
  weight: number
  rpe?: number | null
}

export interface BodyMetric {
  date: string
  weight?: number | null
  waist?: number | null
  chest?: number | null
  arm?: number | null
  photo?: string | null
}

export interface UserSettings {
  theme: string
  language: string
}

export interface AppState {
  currentDay: string
  currentTab: string
  historySelectedDay: string
  theme: string
  workoutInputs: Record<string, { weight: string; rpe: string }>
  historicalData: Record<string, HistoricalWorkout[]> & { bodyMetrics: BodyMetric[] }
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface APIError {
  error: string
  message: string
}
