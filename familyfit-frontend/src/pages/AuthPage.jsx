import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { clearFamilyCache } from '../lib/familyCache'
import client from '../api/client'

export default function AuthPage() {
  const [mode, setMode] = useState('login')   // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [wakingUp, setWakingUp] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ familyName: '', email: '', password: '' })
  const { login, register } = useAuth()
  const navigate = useNavigate()

  // Ping backend /healthz silently on mount so server starts spinning up before user submits
  useEffect(() => {
    client.get('/healthz').catch(() => {
      // Ignore background wake-up errors silently
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setWakingUp(false)

    // Set a timer to update loading text if the request takes longer than 2.5s (server waking up)
    const wakeTimer = setTimeout(() => {
      setWakingUp(true)
    }, 2500)

    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        navigate('/')
      } else {
        await register(form.familyName, form.email, form.password)
        // clearFamilyCache() is already called inside AuthContext.register,
        // but call it here too as a belt-and-suspenders guard before navigation.
        clearFamilyCache()
        navigate('/onboarding')
      }
    } catch (err) {
      console.error('Authentication failure:', err)
      const userMessage = err.message || err.response?.data?.message || 'Authentication failed: could not reach the server. Please try again in a moment.'
      setError(userMessage)
    } finally {
      clearTimeout(wakeTimer)
      setLoading(false)
      setWakingUp(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleUseDemo = () => {
    setMode('login')
    setError('')
    setForm({ familyName: '', email: 'healthyfamily@example.com', password: 'password123' })
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <div className="auth-logo">
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌿</div>
          <h1>Family Fit</h1>
          <p>Nutrition & wellness for the whole family</p>
        </div>

        {/* Mode toggle */}
        <div className="toggle-tabs" style={{ marginBottom: 24 }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              className={`toggle-tab ${mode === m ? 'active' : ''}`}
              onClick={() => { setMode(m); setError('') }}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-family-name">Family Name</label>
              <input
                id="auth-family-name"
                className="input"
                type="text"
                placeholder="e.g. The Smith Family"
                value={form.familyName}
                onChange={set('familyName')}
                required
                minLength={2}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              className="input"
              type="email"
              placeholder="hello@familyfit.com"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="input"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca',
              padding: '12px 14px', borderRadius: 12, fontSize: 13,
              marginBottom: 16, fontWeight: 700, lineHeight: 1.4,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary w-full"
            style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12, cursor: 'pointer' }}
            disabled={loading}
          >
            {loading
              ? <span style={{ opacity: 0.9 }}>{wakingUp ? 'Waking up server (may take up to 30s)...' : 'Processing…'}</span>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
          Demo credentials:&nbsp;
          <button
            type="button"
            style={{ color: '#2e5b12', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
            onClick={handleUseDemo}
          >
            Use demo account
          </button>
        </div>
      </div>
    </div>
  )
}
