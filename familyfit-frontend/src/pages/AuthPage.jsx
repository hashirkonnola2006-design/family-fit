import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { clearFamilyCache } from '../lib/familyCache'
import client from '../api/client'

// ── ICONS ──
const LeafBrandIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill="#2E7D32" />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#81C784" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#EBF5E1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
)

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.47-.61.71-1.15 1.87-.99 2.99 1.1.08 2.23-.54 2.88-1.36z"/>
  </svg>
)

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
)

export default function AuthPage() {
  const [mode, setMode] = useState('login')   // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [wakingUp, setWakingUp] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [form, setForm] = useState({ familyName: '', email: '', password: '' })
  const { login, register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    client.get('/healthz').catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setWakingUp(false)

    const wakeTimer = setTimeout(() => {
      setWakingUp(true)
    }, 2500)

    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        navigate('/')
      } else {
        await register(form.familyName, form.email, form.password)
        clearFamilyCache()
        navigate('/onboarding')
      }
    } catch (err) {
      console.error('Authentication failure:', err)
      const userMessage = err.message || err.response?.data?.message || 'Authentication failed: could not reach the server.'
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
    <div className="auth-redesign-root">
      {/* ── MAIN SPLIT CARD ── */}
      <div className="auth-split-card animate-scale-in">
        {/* ── LEFT PANEL: BRANDING & FAMILY PHOTO ── */}
        <div className="auth-left-panel">
          <div className="auth-brand">
            <LeafBrandIcon />
            <span className="brand-name">
              Family <span className="brand-accent">Fit</span>
            </span>
          </div>
          <p className="brand-tagline">Nutrition & wellness for the whole family</p>

          <div className="family-photo-wrapper">
            <img
              src="/happy_family_eating.png"
              alt="Happy family enjoying healthy meal together"
              className="family-photo"
            />
          </div>

          {/* 3 Pillar Pills */}
          <div className="auth-pillars">
            <div className="pillar-item">
              <div className="pillar-icon">🌿</div>
              <span className="pillar-title">Healthy</span>
              <span className="pillar-sub">Choices</span>
            </div>
            <div className="pillar-divider" />
            <div className="pillar-item">
              <div className="pillar-icon">👨‍👩‍👧‍👦</div>
              <span className="pillar-title">Stronger</span>
              <span className="pillar-sub">Together</span>
            </div>
            <div className="pillar-divider" />
            <div className="pillar-item">
              <div className="pillar-icon">💚</div>
              <span className="pillar-title">Better</span>
              <span className="pillar-sub">Every Day</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: AUTHENTICATION FORM ── */}
        <div className="auth-right-panel">
          <h2 className="auth-welcome-title">
            {mode === 'login' ? 'Welcome back!' : 'Create Account'}
          </h2>
          <p className="auth-welcome-sub">
            {mode === 'login'
              ? 'Sign in to continue your wellness journey'
              : 'Join Family Fit to personalize nutrition for your loved ones'}
          </p>

          {/* Toggle Switch */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              className={`mode-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError('') }}
            >
              <span style={{ fontSize: 15 }}>👤</span> Sign In
            </button>
            <button
              type="button"
              className={`mode-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError('') }}
            >
              <span style={{ fontSize: 15 }}>⊕</span> Create Account
            </button>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="social-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons-row">
            <button type="button" className="social-btn" onClick={handleUseDemo}>
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button type="button" className="social-btn" onClick={handleUseDemo}>
              <AppleIcon />
              <span>Apple</span>
            </button>
            <button type="button" className="social-btn active-brand" onClick={handleUseDemo}>
              <LeafBrandIcon />
              <span>Family Fit</span>
            </button>
          </div>

          <div className="social-divider" style={{ marginTop: 20 }}>
            <span>or sign in with email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            {mode === 'register' && (
              <div className="custom-input-group">
                <label htmlFor="reg-family-name">Family Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">🏡</span>
                  <input
                    id="reg-family-name"
                    type="text"
                    placeholder="e.g. The Smith Family"
                    value={form.familyName}
                    onChange={set('familyName')}
                    required
                    minLength={2}
                  />
                </div>
              </div>
            )}

            <div className="custom-input-group">
              <label htmlFor="auth-email-field">Email Address</label>
              <div className="input-with-icon">
                <span className="input-icon"><MailIcon /></span>
                <input
                  id="auth-email-field"
                  type="email"
                  placeholder="hello@familyfit.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            <div className="custom-input-group">
              <label htmlFor="auth-password-field">Password</label>
              <div className="input-with-icon">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="auth-password-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {mode === 'login' && (
              <div className="form-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="custom-checkbox" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-pass-btn"
                  onClick={() => alert('Password reset link sent to your email.')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="auth-error-banner">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="auth-main-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>{wakingUp ? 'Waking up server (up to 30s)...' : 'Processing…'}</span>
              ) : (
                <>
                  <span style={{ fontSize: 16 }}>🍃</span>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Link */}
          <div className="demo-link-footer">
            Demo credentials:&nbsp;
            <button type="button" onClick={handleUseDemo}>
              Use demo account
            </button>
          </div>
        </div>
      </div>

      {/* ── EMBEDDED STYLES FOR AUTH REDESIGN ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-redesign-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          box-sizing: border-box;
          position: relative;
          background-color: #fafcf7;
          background-image: url("/exact_watercolor_leaves_bg.png");
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }

        /* Split Card */
        .auth-split-card {
          width: 100%;
          max-width: 1000px;
          background: #ffffff;
          border-radius: 32px;
          box-shadow: 0 24px 70px rgba(46, 125, 50, 0.12), 0 8px 24px rgba(0,0,0,0.03);
          display: grid;
          grid-template-columns: 430px 1fr;
          overflow: hidden;
          position: relative;
          z-index: 10;
          border: 1px solid #eaf0e2;
        }

        @media (max-width: 900px) {
          .auth-split-card {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .auth-left-panel {
            display: none !important;
          }
        }

        /* Left Panel */
        .auth-left-panel {
          background: linear-gradient(180deg, #F3F8EC 0%, #E7F2DA 100%);
          padding: 44px 36px 36px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          border-right: 1px solid #e0ebd3;
          position: relative;
          box-sizing: border-box;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .brand-name {
          font-size: 32px;
          font-weight: 800;
          color: #1E4D18;
          letter-spacing: -0.6px;
        }

        .brand-accent {
          color: #2E7D32;
        }

        .brand-tagline {
          font-size: 14px;
          color: #556B2F;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .family-photo-wrapper {
          width: 100%;
          flex: 1;
          max-height: 310px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(46, 125, 50, 0.14);
          margin-bottom: 18px;
          background: #ffffff;
          display: flex;
        }

        .family-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .auth-pillars {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          background: #ffffff;
          padding: 16px 12px;
          border-radius: 20px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
          border: 1px solid #e4eed8;
          margin-top: auto;
        }

        .pillar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pillar-icon {
          font-size: 22px;
          margin-bottom: 3px;
        }

        .pillar-title {
          font-size: 13px;
          font-weight: 700;
          color: #1E4D18;
        }

        .pillar-sub {
          font-size: 11px;
          color: #64748B;
          font-weight: 500;
        }

        .pillar-divider {
          width: 1px;
          height: 32px;
          background: #e0ebd3;
        }

        /* Right Panel */
        .auth-right-panel {
          padding: 48px 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 520px) {
          .auth-right-panel {
            padding: 32px 24px;
          }
        }

        .auth-welcome-title {
          font-size: 30px;
          font-weight: 800;
          color: #1E293B;
          margin: 0 0 8px 0;
          letter-spacing: -0.4px;
        }

        .auth-welcome-sub {
          font-size: 14px;
          color: #64748B;
          margin: 0 0 24px 0;
        }

        /* Mode Tabs */
        .auth-mode-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: #f1f5f9;
          padding: 5px;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .mode-tab-btn {
          border: none;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          color: #64748B;
          background: transparent;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .mode-tab-btn.active {
          background: linear-gradient(135deg, #2E7D32 0%, #256628 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(46, 125, 50, 0.28);
        }

        /* Social Row */
        .social-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #94A3B8;
          font-size: 12px;
          font-weight: 600;
          margin: 14px 0 18px 0;
        }

        .social-divider::before,
        .social-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
        }

        .social-divider span {
          padding: 0 14px;
        }

        .social-buttons-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .social-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .social-btn.active-brand {
          border-color: #bbf7d0;
          background: #f0fdf4;
          color: #166534;
        }

        /* Inputs */
        .custom-input-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 16px;
        }

        .custom-input-group label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .input-with-icon input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
          background: #ffffff;
          color: #1e293b;
        }

        .input-with-icon input:focus {
          border-color: #2E7D32;
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.14);
        }

        .eye-toggle-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        /* Form Options Row */
        .form-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 13px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #475569;
          font-weight: 600;
          user-select: none;
        }

        .checkbox-label input {
          accent-color: #2E7D32;
          width: 17px;
          height: 17px;
          cursor: pointer;
        }

        .forgot-pass-btn {
          background: none;
          border: none;
          color: #2E7D32;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .forgot-pass-btn:hover {
          text-decoration: underline;
        }

        .auth-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
        }

        /* Main Submit Button */
        .auth-main-submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #2E7D32 0%, #215924 100%);
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(46, 125, 50, 0.32);
          transition: all 0.15s ease;
        }

        .auth-main-submit-btn:hover {
          background: linear-gradient(135deg, #256628 0%, #1a471c 100%);
          box-shadow: 0 8px 22px rgba(46, 125, 50, 0.38);
        }

        .auth-main-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .demo-link-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 13px;
          color: #64748B;
        }

        .demo-link-footer button {
          background: none;
          border: none;
          color: #2E7D32;
          font-weight: 700;
          cursor: pointer;
        }

        .demo-link-footer button:hover {
          text-decoration: underline;
        }
      `}} />
    </div>
  )
}
