import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { clearFamilyCache } from '../lib/familyCache'
import client from '../api/client'
import { AuthUI } from '../components/ui/auth-ui'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'

  const [loading, setLoading] = useState(false)
  const [wakingUp, setWakingUp] = useState(false)
  const [error, setError] = useState('')
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  // Warm up backend
  useEffect(() => {
    client.get('/healthz').catch(() => {})
  }, [])

  const handleSubmit = async ({
    mode,
    email,
    password,
    name,
    rememberMe,
  }) => {
    setError('')
    setLoading(true)
    setWakingUp(false)

    const wakeTimer = setTimeout(() => {
      setWakingUp(true)
    }, 2500)

    try {
      if (mode === 'login') {
        await login(email, password)
        navigate('/dashboard')
      } else {
        const familyName = name || 'Healthy Family'
        await register(familyName, email, password)
        clearFamilyCache()
        navigate('/onboarding')
      }
    } catch (err) {
      console.error('Authentication failure:', err)
      const userMessage =
        err.message ||
        err.response?.data?.message ||
        'Authentication failed: could not reach the server.'
      setError(userMessage)
    } finally {
      clearTimeout(wakeTimer)
      setLoading(false)
      setWakingUp(false)
    }
  }

  const handleForgotPassword = () => {
    alert('A password reset link will be sent to your registered email address.')
  }

  return (
    <div className="relative">
      {wakingUp && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#3F5A3A] text-white text-xs font-semibold shadow-lg animate-bounce flex items-center gap-2">
          <span>🌿 Waking up server instance (this may take up to 20 seconds)...</span>
        </div>
      )}
      <AuthUI
        initialMode={initialMode}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onForgotPassword={handleForgotPassword}
        backToHomeHref="/"
      />
    </div>
  )
}
