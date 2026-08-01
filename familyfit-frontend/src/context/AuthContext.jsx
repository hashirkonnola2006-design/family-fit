import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount, auto demo login fallback
  useEffect(() => {
    async function initAuth() {
      const token    = localStorage.getItem('accessToken')
      const familyId = localStorage.getItem('familyId')
      const email    = localStorage.getItem('email')
      const familyName = localStorage.getItem('familyName')

      if (token && familyId && familyId !== 'undefined') {
        setUser({ familyId: Number(familyId), email, familyName })
        setLoading(false)
      } else {
        // Auto-login with demo account so home page works directly for user
        try {
          const { data } = await apiLogin({ email: 'healthyfamily@example.com', password: 'password123' })
          persistAuth(data)
          setUser({ familyId: data.familyId, email: data.email, familyName: data.familyName })
        } catch {
          setUser({ familyId: 1, email: 'healthyfamily@example.com', familyName: 'Healthy Family' })
        } finally {
          setLoading(false)
        }
      }
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password })
    persistAuth(data)
    setUser({ familyId: data.familyId, email: data.email, familyName: data.familyName })
    return data
  }

  const register = async (familyName, email, password) => {
    const { data } = await apiRegister({ familyName, email, password })
    persistAuth(data)
    setUser({ familyId: data.familyId, email: data.email, familyName: data.familyName })
    return data
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  const persistAuth = (data) => {
    localStorage.setItem('accessToken',  data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('familyId',     data.familyId)
    localStorage.setItem('email',        data.email)
    localStorage.setItem('familyName',   data.familyName)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
