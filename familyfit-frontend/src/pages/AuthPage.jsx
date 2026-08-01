import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [mode, setMode]       = useState('login')   // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ familyName: '', email: '', password: '' })
  const { login, register }   = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.familyName, form.email, form.password)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

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
              background: '#fde8e8', color: 'var(--color-error)',
              padding: '10px 14px', borderRadius: 10, fontSize: 13,
              marginBottom: 16, fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary w-full"
            style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12 }}
            disabled={loading}
          >
            {loading
              ? <span style={{ opacity: 0.7 }}>Loading…</span>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
          Demo credentials:&nbsp;
          <button
            style={{ color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
            onClick={() => setForm({ familyName: '', email: 'healthyfamily@example.com', password: 'password123' })}
          >
            Use demo account
          </button>
        </div>
      </div>
    </div>
  )
}
