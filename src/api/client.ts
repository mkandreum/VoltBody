// Cliente HTTP para la API

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Agregar token a headers si existe
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Manejar errores de autenticación
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    apiClient.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  refresh: () => apiClient.post('/auth/refresh'),
}

export const workoutAPI = {
  getProgress: (day: string) =>
    apiClient.get(`/workouts/${day}`),
  saveProgress: (day: string, exercise: string, weight: number, rpe?: number) =>
    apiClient.post(`/workouts/${day}/${exercise}`, { weight, rpe }),
}

export const metricsAPI = {
  getAll: () => apiClient.get('/metrics'),
  save: (metric: any) => apiClient.post('/metrics', metric),
  uploadPhoto: (formData: FormData) =>
    apiClient.post('/metrics/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const settingsAPI = {
  get: () => apiClient.get('/settings'),
  update: (settings: any) => apiClient.put('/settings', settings),
}

export default apiClient
