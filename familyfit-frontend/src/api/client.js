import axios from 'axios'

// Use VITE_API_URL environment variable for backend base URL, defaulting to empty string in local dev for proxy fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || ''
console.log('API_BASE_URL is:', API_BASE_URL)

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Request interceptor: attach JWT access token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle HTML rewrites & 401 refresh
client.interceptors.response.use(
  (response) => {
    // If Vercel returned index.html for API route rewrite
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html')) {
      return Promise.reject(new Error('API Endpoint unavailable (HTML fallback response)'))
    }
    return response
  },
  async (error) => {
    const original = error.config
    const status = error.response?.status
    if ((status === 401 || status === 403) && original && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          // Use client (not raw axios) so the correct baseURL is always applied
          const { data } = await client.post('/auth/refresh', { refreshToken })
          if (data?.accessToken) {
            localStorage.setItem('accessToken', data.accessToken)
            original.headers.Authorization = `Bearer ${data.accessToken}`
            return client(original)
          }
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      } else {
        localStorage.removeItem('accessToken')
      }
    }
    return Promise.reject(error)
  }
)

export default client
