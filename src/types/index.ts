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

export type ActivityLevel = 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo'
export type TrainingPlace = 'casa' | 'gym' | 'calle'
export type FitnessGoal = 'perder_grasa' | 'ganar_musculo' | 'recomposicion'

export interface UserProfile {
  fitnessGoal: FitnessGoal
  activityLevel: ActivityLevel
  dailySteps: number
  trainingPlace: TrainingPlace
  trainTime: string
  trainDays: string[]
  priorities: string[]
  foodPathologies: string
  injuryPathologies: string
  specialClass: string
  targetKg: number
  targetMonths: number
}

export interface SpecialDish {
  name: string
  calories: number
  proteins: number
  carbs: number
  fats: number
  prep: string
}

export interface WorkoutCatalogSelection {
  pecho: string[]
  espalda: string[]
  hombro: string[]
  pierna: string[]
  biceps: string[]
  triceps: string[]
  gluteo: string[]
  core: string[]
}

export interface CommunityMessage {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface AppState {
  currentDay: string
  currentTab: string
  historySelectedDay: string
  theme: string
  workoutInputs: Record<string, { weight: string; rpe: string }>
  historicalData: {
    bodyMetrics: BodyMetric[]
    byDay: Record<string, HistoricalWorkout[]>
  }
  profile: UserProfile
  specialDish: SpecialDish | null
  selectedExercises: WorkoutCatalogSelection
  motivationPhoto: string
  motivationPhrase: string
  communityMessages: CommunityMessage[]
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
