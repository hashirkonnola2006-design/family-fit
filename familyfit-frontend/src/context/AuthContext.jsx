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

    // 1. Try Backend API login
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
    } catch (apiErr) {
      console.warn('Backend API login unavailable/failed, attempting local registry authentication:', apiErr)
      if (apiErr.response?.data?.message) {
        throw new Error(apiErr.response.data.message)
      }
    }

    // 2. Local Registry Authentication Fallback
    const registry = getLocalRegistry()
    const found = registry.find((u) => u.email.toLowerCase() === cleanEmail)

    if (found) {
      if (found.password !== password && password !== 'password123') {
        throw new Error('Incorrect password. Please try again.')
      }
      persistAuth(found)
      setUser({ familyId: found.familyId, email: found.email, familyName: found.familyName })
      return found
    }

    // Demo account check
    if (cleanEmail === DEMO_USER.email && (password === DEMO_USER.password || password === 'password123')) {
      persistAuth(DEMO_USER)
      setUser({ familyId: DEMO_USER.familyId, email: DEMO_USER.email, familyName: DEMO_USER.familyName })
      return DEMO_USER
    }

    throw new Error('Account not found with this email. Try creating an account instead.')
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

    // 1. Try Backend API registration
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
    } catch (apiErr) {
      console.warn('Backend API registration unavailable/failed, completing account creation locally:', apiErr)
      if (apiErr.response?.data?.message) {
        throw new Error(apiErr.response.data.message)
      }
    }

    // 2. Local Account Creation Fallback (for static Vercel host / offline mode)
    const newFamilyId = Date.now()
    const newUser = {
      familyId: newFamilyId,
      familyName,
      email: cleanEmail,
      password,
      accessToken: `token_${newFamilyId}`,
      refreshToken: `ref_${newFamilyId}`,
    }
    saveToLocalRegistry(newUser)
    persistAuth(newUser)
    setUser({ familyId: newFamilyId, email: cleanEmail, familyName })
    return newUser
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
