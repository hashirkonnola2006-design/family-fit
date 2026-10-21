import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth'
import { clearFamilyCache } from '../lib/familyCache'
import { clearAllStoredAuth } from '../api/client'

const AuthContext = createContext(null)

const DEMO_USER = {
  familyId: 3,
  familyName: 'Healthy Family',
  email: 'healthyfamily@example.com',
  password: 'password123',
}

function getStoredUser() {
  try {
    const familyId   = localStorage.getItem('familyId') || sessionStorage.getItem('familyId')
    const email      = localStorage.getItem('email') || sessionStorage.getItem('email')
    const familyName = localStorage.getItem('familyName') || sessionStorage.getItem('familyName')
    const token      = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

    if (familyId && familyId !== 'undefined' && familyId !== 'null') {
      return {
        familyId: Number(familyId) || 1,
        email: email || 'healthyfamily@example.com',
        familyName: familyName || 'My Family',
      }
    }
    if (token && token !== 'undefined' && token !== 'null') {
      return {
        familyId: 1,
        email: email || 'healthyfamily@example.com',
        familyName: familyName || 'My Family',
      }
    }
  } catch (e) {
    console.error('Failed to get stored user session:', e)
  }
  return null
}

function persistAuth(data, rememberMe = true) {
  if (!data) return
  // Clear any existing keys from both storages before writing
  clearAllStoredAuth()

  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem('accessToken',  data.accessToken || 'demo-token-123')
  storage.setItem('refreshToken', data.refreshToken || 'demo-refresh-123')
  storage.setItem('familyId',     String(data.familyId || 1))
  storage.setItem('email',        data.email || 'healthyfamily@example.com')
  storage.setItem('familyName',   data.familyName || 'Healthy Family')
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(getStoredUser)
  const [loading, setLoading] = useState(false)

  // Listen to custom auth events and storage changes
  useEffect(() => {
    const handleAuthExpired = () => {
      clearAllStoredAuth()
      setUser(null)
    }

    const handleStorageChange = (e) => {
      if (e.key === 'familyId' || e.key === 'accessToken') {
        setUser(getStoredUser())
      }
    }

    window.addEventListener('familyfit:auth-expired', handleAuthExpired)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('familyfit:auth-expired', handleAuthExpired)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = async (emailInput, passwordInput, rememberMe = true) => {
    const cleanEmail = (emailInput || '').trim().toLowerCase()
    const password = (passwordInput || '').trim()

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please enter a valid email address.')
    }
    if (!password) {
      throw new Error('Please enter your password.')
    }

    clearFamilyCache()

    // 1. Authenticate with backend API
    try {
      const res = await apiLogin({ email: cleanEmail, password })
      if (res?.data && res.data.familyId) {
        const data = res.data
        persistAuth(data, rememberMe)
        setUser({ familyId: data.familyId, email: cleanEmail, familyName: data.familyName || 'My Family' })
        return data
      }
      throw new Error('Invalid email or password.')
    } catch (apiErr) {
      console.error('Backend API login error:', apiErr)

      const status = apiErr.response?.status
      const serverMsg = apiErr.response?.data?.message || apiErr.message || ''

      // If credentials rejected (401, 400, or bad credentials message)
      if (
        status === 401 ||
        status === 400 ||
        serverMsg.toLowerCase().includes('bad credentials') ||
        serverMsg.toLowerCase().includes('invalid')
      ) {
        throw new Error('Invalid email or password.')
      }

      // Offline / network failure fallback specifically for demo user
      const isDemo =
        (cleanEmail === DEMO_USER.email || cleanEmail === 'demo@familyfit.com') &&
        (password === DEMO_USER.password || password === 'password123')

      if (isDemo) {
        console.warn('Backend unreachable; using offline demo session fallback.')
        const fallbackDemo = {
          ...DEMO_USER,
          accessToken: 'demo-token-123',
          refreshToken: 'demo-refresh-123',
        }
        persistAuth(fallbackDemo, rememberMe)
        setUser({ familyId: fallbackDemo.familyId, email: fallbackDemo.email, familyName: fallbackDemo.familyName })
        return fallbackDemo
      }

      throw new Error('Could not connect to the server. Please check your connection or wait a moment while the server wakes up.')
    }
  }

  const register = async (familyNameInput, emailInput, passwordInput, rememberMe = true) => {
    const familyName = (familyNameInput || '').trim()
    const cleanEmail = (emailInput || '').trim().toLowerCase()
    const password   = (passwordInput || '').trim()

    if (!familyName || familyName.length < 2) {
      throw new Error('Family Name must be at least 2 characters.')
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please enter a valid email address.')
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }

    clearFamilyCache()

    try {
      const res = await apiRegister({ familyName, email: cleanEmail, password })
      if (res?.data && res.data.familyId) {
        const data = res.data
        persistAuth(data, rememberMe)
        setUser({ familyId: data.familyId, email: cleanEmail, familyName: data.familyName || familyName })
        return data
      }
      throw new Error('Registration failed. Please try again.')
    } catch (apiErr) {
      console.error('Backend API registration error:', apiErr)

      const status = apiErr.response?.status
      const fieldErrors = apiErr.response?.data?.fieldErrors
      const fieldErrorMsg = fieldErrors && typeof fieldErrors === 'object'
        ? Object.values(fieldErrors).join('. ')
        : ''
      const serverMsg = fieldErrorMsg || apiErr.response?.data?.message || apiErr.message || ''

      if (status === 400 && serverMsg.toLowerCase().includes('already registered')) {
        throw new Error('This email is already registered. Please sign in instead.')
      }
      if (serverMsg && !serverMsg.toLowerCase().includes('timeout') && !serverMsg.toLowerCase().includes('network')) {
        throw new Error(serverMsg)
      }
      throw new Error('Could not connect to the server. Please wait a moment while the server wakes up and try again.')
    }
  }

  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken')
    if (refreshToken && !refreshToken.startsWith('demo-')) {
      apiLogout(refreshToken).catch(() => {})
    }

    clearAllStoredAuth()
    clearFamilyCache()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
