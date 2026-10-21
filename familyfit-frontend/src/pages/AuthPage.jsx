import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { clearFamilyCache } from '../lib/familyCache'
import { AuthUI } from '../components/ui/auth-ui'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  // Warm up backend on mount via public unauthenticated healthz endpoint
  useEffect(() => {
    const rawUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
    if (rawUrl) {
      fetch(`${rawUrl}/healthz`, { method: 'GET', mode: 'cors', credentials: 'omit' }).catch(() => {})
    }
  }, [])

  const handleSignIn = async ({ email, password, rememberMe }) => {
    setError('')
    setLoading(true)

    try {
      await login(email, password, rememberMe)
      navigate('/dashboard')
    } catch (err) {
      console.error('Authentication failure:', err)
      const userMessage =
        err.message ||
        err.response?.data?.message ||
        'Authentication failed: could not reach the server.'
      setError(userMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpSubmit = async ({ email, password, name, rememberMe = true }) => {
    setError('')
    setLoading(true)

    try {
      const familyName = name || 'FamilyFit'
      await register(familyName, email, password, rememberMe)
      clearFamilyCache()
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration failure:', err)
      const userMessage =
        err.message ||
        err.response?.data?.message ||
        'Registration failed: could not reach the server.'
      setError(userMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    alert('A password reset link will be sent to your registered email address.')
  }

  const handleUseDemo = async () => {
    await handleSignIn({
      email: 'healthyfamily@example.com',
      password: 'password123',
      rememberMe: true,
    })
  }

  return (
    <div className="relative">

      <AuthUI
        initialMode={mode}
        loading={loading}
        error={error}
        onSubmit={({ mode: submitMode, email, password, name, rememberMe }) =>
          submitMode === 'signup'
            ? handleSignUpSubmit({ email, password, name })
            : handleSignIn({ email, password, rememberMe })
        }
        onUseDemo={handleUseDemo}
        onGoogleSignIn={() => alert('Google sign in is coming soon.')}
        onForgotPassword={handleForgotPassword}
        backToHomeHref="/"
      />
    </div>
  )
}
