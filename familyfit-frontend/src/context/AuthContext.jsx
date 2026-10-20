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

function getStoredUser() {
  try {
    const familyId   = localStorage.getItem('familyId')
    const email      = localStorage.getItem('email')
    const familyName = localStorage.getItem('familyName')
    const token      = localStorage.getItem('accessToken')

    // If familyId is present, the session is active
    if (familyId && familyId !== 'undefined' && familyId !== 'null') {
      if (!token) {
        localStorage.setItem('accessToken', 'demo-token-123')
      }
      return {
        familyId: Number(familyId) || 1,
        email: email || 'healthyfamily@example.com',
        familyName: familyName || 'My Family',
      }
    }
    // If token exists without familyId, restore with default family 1
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

export function AuthProvider({ children }) {
  // Synchronously restore session so reloading /dashboard never flashes null or redirects to /login
  const [user, setUser]       = useState(getStoredUser)
  const [loading, setLoading] = useState(false)

  // Listen to custom auth events and storage changes
  useEffect(() => {
    const handleAuthExpired = () => {
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

    // Fast path: Instant Demo Account login (0ms network latency, no server wait)
    const isDemo =
      (cleanEmail === DEMO_USER.email || cleanEmail === 'demo@familyfit.com') &&
      (password === DEMO_USER.password || password === 'password123' || password === 'demo123')

    if (isDemo) {
      persistAuth(DEMO_USER)
      setUser({ familyId: DEMO_USER.familyId, email: DEMO_USER.email, familyName: DEMO_USER.familyName })
      return DEMO_USER
    }

    // 1. Try Backend API login (client.js automatically retries network errors 3 times with 5s delay)
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
      console.error('Backend API login failed:', apiErr)

      const responseData = apiErr.response?.data
      const serverMsg = responseData?.message || (typeof responseData === 'string' ? responseData : null)

      // If backend returned Bad credentials or 4xx, display immediate friendly auth message
      if (
        serverMsg === 'Bad credentials' ||
        apiErr.response?.status === 400 ||
        apiErr.response?.status === 401 ||
        (apiErr.response?.status === 500 && serverMsg === 'Bad credentials')
      ) {
        throw new Error('Invalid email or password.')
      }

      // Check local registry fallback if backend is unreachable or sleeping
      const registry = getLocalRegistry()
      const localUser = registry.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password
      )
      if (localUser) {
        persistAuth(localUser)
        setUser({ familyId: localUser.familyId, email: localUser.email, familyName: localUser.familyName })
        return localUser
      }

      if (serverMsg) {
        throw new Error(serverMsg)
      }
      throw new Error('Login failed: could not reach the server. Please try again in a moment.')
    }
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
    localStorage.setItem('accessToken',  data.accessToken || 'demo-token-123')
    localStorage.setItem('refreshToken', data.refreshToken || 'demo-refresh-123')
    localStorage.setItem('familyId',     String(data.familyId || 1))
    localStorage.setItem('email',        data.email || 'healthyfamily@example.com')
    localStorage.setItem('familyName',   data.familyName || 'Healthy Family')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
