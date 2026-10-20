import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { clearFamilyCache } from '../lib/familyCache'
import client from '../api/client'
import { AuthUI } from '../components/ui/auth-ui'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'

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

  // Warm up backend on mount
  useEffect(() => {
    const rawUrl = import.meta.env.VITE_API_URL || ''
    if (rawUrl) {
      fetch(`${rawUrl}/healthz`, { mode: 'no-cors' }).catch(() => {})
    }
  }, [])

  const handleSignIn = async ({ email, password, rememberMe }) => {
    setError('')
    setLoading(true)
    setWakingUp(false)

    const wakeTimer = setTimeout(() => {
      setWakingUp(true)
    }, 2500)

    try {
      await login(email, password)
      navigate('/dashboard')
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

  const handleSignUpSubmit = async ({ email, password, name }) => {
    setError('')
    setLoading(true)
    setWakingUp(false)

    const wakeTimer = setTimeout(() => {
      setWakingUp(true)
    }, 2500)

    try {
      const familyName = name || 'FamilyFit'
      await register(familyName, email, password)
      clearFamilyCache()
      navigate('/onboarding')
    } catch (err) {
      console.error('Registration failure:', err)
      const userMessage =
        err.message ||
        err.response?.data?.message ||
        'Registration failed: could not reach the server.'
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

  const handleUseDemo = async () => {
    await handleSignIn({
      email: 'healthyfamily@example.com',
      password: 'password123',
      rememberMe: true,
    })
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {wakingUp && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[410px] pointer-events-auto"
            role="status"
            aria-live="polite"
          >
            <div className="bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl p-3.5 shadow-[0_12px_32px_-4px_rgba(26,46,34,0.14),0_4px_12px_rgba(0,0,0,0.06)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F0F5F1] text-[#1F5D3A] flex items-center justify-center shrink-0 mt-0.5">
                <Loader2 size={16} className="animate-spin text-[#1F5D3A]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-[#1F2937] tracking-tight">
                    Connecting to server
                  </h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EAF3EC] text-[#1F5D3A]">
                    Starting up
                  </span>
                </div>
                <p className="text-[12px] text-[#6B7280] mt-0.5 leading-snug">
                  Waking up cloud service. This typically takes up to 20 seconds on cold start.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setWakingUp(false)}
                className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded-lg hover:bg-[#F3F4F6] transition-colors shrink-0 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
