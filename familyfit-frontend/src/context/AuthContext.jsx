import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'
import { clearFamilyCache } from '../lib/familyCache'

const AuthContext = createContext(null)

const DEMO_USER = {
  familyId: 1,
  familyName: 'Healthy Family',
  email: 'healthyfamily@example.com',
  password: 'password123',
  accessToken: 'demo-token-123',
  refreshToken: 'demo-refresh-123',
}

function getLocalRegistry() {
  try {
    const raw = localStorage.getItem('familyfit_user_registry')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Failed to parse local user registry:', e)
  }
  // Return empty array for fresh browsers — do NOT inject DEMO_USER here,
  // as familyId:1 may point to a real database family with seeded members.
  return []
}

function saveToLocalRegistry(userObj) {
  try {
    const registry = getLocalRegistry()
    const idx = registry.findIndex((u) => u.email.toLowerCase() === userObj.email.toLowerCase())
    if (idx >= 0) {
      registry[idx] = { ...registry[idx], ...userObj }
    } else {
      registry.push(userObj)
    }
    localStorage.setItem('familyfit_user_registry', JSON.stringify(registry))
  } catch (e) {
    console.error('Failed to save to user registry:', e)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount — no auto demo login
  useEffect(() => {
    async function initAuth() {
      const token      = localStorage.getItem('accessToken')
      const familyId   = localStorage.getItem('familyId')
      const email      = localStorage.getItem('email')
      const familyName = localStorage.getItem('familyName')

      if (token && familyId && familyId !== 'undefined' && familyId !== 'null') {
        // Valid persisted session — restore it (FamilyContext will fetch fresh data)
        setUser({ familyId: Number(familyId), email, familyName: familyName || 'My Family' })
      }
      // If no valid token: stay as null — PrivateRoute will redirect to /auth
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (emailInput, passwordInput) => {
    const cleanEmail = (emailInput || '').trim().toLowerCase()
    const password = (passwordInput || '').trim()

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please enter a valid email address.')
    }
    if (!password) {
      throw new Error('Please enter your password.')
    }

    // Clear any stale family data from a previous account BEFORE setting the new user.
    // This prevents a flash of old members/recipes while the new API fetch is in-flight.
    clearFamilyCache()

    // 1. Try Backend API login with retry logic (up to 2 retries, 3s delay)
    let lastError = null
    const maxRetries = 2
    const delayMs = 3000

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
      try {
        const res = await apiLogin({ email: cleanEmail, password })
        if (res?.data && res.data.familyId) {
          const data = res.data
          saveToLocalRegistry({
            familyId: data.familyId,
            email: cleanEmail,
            familyName: data.familyName || 'My Family',
            password,
            accessToken: data.accessToken || `token_${Date.now()}`,
            refreshToken: data.refreshToken || `ref_${Date.now()}`,
          })
          persistAuth(data)
          setUser({ familyId: data.familyId, email: cleanEmail, familyName: data.familyName || 'My Family' })
          return data
        }
        throw new Error('Invalid login credentials')
      } catch (apiErr) {
        console.error(`Backend API login attempt ${attempt + 1} failed:`, apiErr)
        lastError = apiErr
        // If it's an explicit response from backend (e.g., 400 Bad credentials, 401 Unauthorized), do not retry server errors
        const responseData = apiErr.response?.data
        const serverMsg = responseData?.message || (typeof responseData === 'string' ? responseData : null)
        if (serverMsg && serverMsg !== 'Bad credentials' && !serverMsg.toLowerCase().includes('timeout') && !serverMsg.toLowerCase().includes('network error')) {
          throw new Error(serverMsg)
        }
        if (apiErr.response?.status === 400 || apiErr.response?.status === 401) {
          if (serverMsg === 'Bad credentials') {
            throw new Error('Invalid email or password.')
          }
          throw new Error(serverMsg || 'Invalid email or password.')
        }
      }
    }

    // Demo account fallback check
    if (cleanEmail === DEMO_USER.email && (password === DEMO_USER.password || password === 'password123')) {
      persistAuth(DEMO_USER)
      setUser({ familyId: DEMO_USER.familyId, email: DEMO_USER.email, familyName: DEMO_USER.familyName })
      return DEMO_USER
    }

    // If network/server connection completely failed after retries
    const lastServerMsg = lastError?.response?.data?.message
    if (lastServerMsg) {
      throw new Error(lastServerMsg)
    }
    throw new Error('Login failed: could not reach the server. Please try again in a moment (the server may be waking up).')
  }

  const register = async (familyNameInput, emailInput, passwordInput) => {
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

    // Check duplicate email in local registry
    const registry = getLocalRegistry()
    const existing = registry.find((u) => u.email.toLowerCase() === cleanEmail)
    if (existing) {
      throw new Error('This email is already registered. Try signing in instead.')
    }

    // Clear stale family data before registering a fresh account
    clearFamilyCache()

    // Try Backend API registration
    try {
      const res = await apiRegister({ familyName, email: cleanEmail, password })
      if (res?.data && res.data.familyId) {
        const data = res.data
        const newUser = {
          familyId: data.familyId,
          familyName: data.familyName || familyName,
          email: cleanEmail,
          password,
          accessToken: data.accessToken || `token_${Date.now()}`,
          refreshToken: data.refreshToken || `ref_${Date.now()}`,
        }
        saveToLocalRegistry(newUser)
        persistAuth(newUser)
        setUser({ familyId: newUser.familyId, email: cleanEmail, familyName: newUser.familyName })
        return newUser
      }
      throw new Error('Registration failed. Please try again.')
    } catch (apiErr) {
      console.error('Backend API registration failed:', apiErr)
      const serverMessage = apiErr.response?.data?.message || apiErr.message
      if (serverMessage && !serverMessage.includes('timeout') && !serverMessage.includes('Network Error')) {
        throw new Error(serverMessage)
      }
      throw new Error('Signup failed: could not reach the server. Please try again in a moment (the server may be waking up).')
    }
  }

  const logout = () => {
    // 1. Clear auth tokens
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('familyId')
    localStorage.removeItem('email')
    localStorage.removeItem('familyName')

    // 2. Clear ALL family-scoped cached data so the next account starts clean
    clearFamilyCache()

    setUser(null)
  }

  const persistAuth = (data) => {
    if (!data) return
    localStorage.setItem('accessToken',  data.accessToken || 'demo-token')
    localStorage.setItem('refreshToken', data.refreshToken || 'demo-refresh')
    localStorage.setItem('familyId',     String(data.familyId || 1))
    localStorage.setItem('email',        data.email || '')
    localStorage.setItem('familyName',   data.familyName || 'My Family')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
