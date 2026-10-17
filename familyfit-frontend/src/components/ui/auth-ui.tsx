import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Leaf, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Users, 
  Heart, 
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Typewriter } from './typewriter-text'

export interface AuthUIProps {
  initialMode?: 'login' | 'signup'
  loading?: boolean
  error?: string
  onSubmit: (data: {
    mode: 'login' | 'signup'
    email: string
    password: string
    name?: string
    rememberMe: boolean
  }) => Promise<void> | void
  onGoogleSignIn?: () => void
  onUseDemo?: () => void
  onForgotPassword?: () => void
  backToHomeHref?: string
}

export function AuthUI({
  initialMode = 'login',
  loading = false,
  error = '',
  onSubmit,
  onGoogleSignIn,
  onUseDemo,
  onForgotPassword,
  backToHomeHref = '/',
}: AuthUIProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [localValidation, setLocalValidation] = useState('')

  React.useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 10) score += 1
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1
    return score
  }, [password])

  const strengthLabels = ['Too weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['#D64545', '#EAB308', '#6BBF4E', '#3F5A3A']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalValidation('')

    if (!email.trim() || !email.includes('@')) {
      setLocalValidation('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setLocalValidation('Password must be at least 6 characters.')
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setLocalValidation('Please enter your full name or family name.')
        return
      }
      if (!agreeTerms) {
        setLocalValidation('Please accept the Terms of Service and Privacy Policy.')
        return
      }
    }

    onSubmit({
      mode,
      email,
      password,
      name,
      rememberMe,
    })
  }

  const handleDemoClick = () => {
    setMode('login')
    setEmail('healthyfamily@example.com')
    setPassword('password123')
    setLocalValidation('')
    if (onUseDemo) onUseDemo()
  }

  return (
    <div className="ff-auth-root">
      {/* ── LEFT PANEL: AUTH FORM ── */}
      <div className="ff-auth-left-side">
        <div className="ff-auth-form-inner">
          {/* Top Row: Back link & Mobile Logo */}
          <div className="ff-auth-top-bar">
            <Link to={backToHomeHref} className="ff-back-link">
              <ArrowLeft size={14} />
              <span>Back to home</span>
            </Link>

            <Link to="/" className="ff-mobile-brand">
              <Leaf size={18} className="text-[#6BBF4E]" />
              <span>Family<span className="text-[#6BBF4E]">Fit</span></span>
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="ff-desktop-brand">
            <div className="ff-brand-badge">
              <Leaf size={18} />
            </div>
            <span className="ff-brand-title">
              Family<span className="text-[#6BBF4E]">Fit</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="ff-auth-header-copy">
            <h1 className="ff-auth-main-title">
              {mode === 'login' ? 'Welcome back!' : 'Join FamilyFit'}
            </h1>
            <p className="ff-auth-sub-title">
              {mode === 'login'
                ? 'Sign in to access personalized Kerala meal plans and smart grocery lists.'
                : 'Start personalizing wholesome recipes and allergen-safe meals for your family.'}
            </p>
          </div>

          {/* Pill Tab Switcher */}
          <div className="ff-tab-switcher">
            <button
              type="button"
              onClick={() => { setMode('login'); setLocalValidation('') }}
              className={`ff-tab-btn ${mode === 'login' ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setLocalValidation('') }}
              className={`ff-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {(error || localValidation) && (
            <div className="ff-auth-alert">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{localValidation || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="ff-auth-form">
            {mode === 'signup' && (
              <div className="ff-field-group">
                <label className="ff-field-label">Full Name / Family Name</label>
                <div className="ff-input-box">
                  <User size={16} className="ff-field-icon" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anjali Nair or The Menons"
                    className="ff-text-input"
                  />
                </div>
              </div>
            )}

            <div className="ff-field-group">
              <label className="ff-field-label">Email Address</label>
              <div className="ff-input-box">
                <Mail size={16} className="ff-field-icon" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="ff-text-input"
                />
              </div>
            </div>

            <div className="ff-field-group">
              <div className="ff-label-split">
                <label className="ff-field-label">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={onForgotPassword || (() => alert('Password reset instructions sent.'))}
                    className="ff-forgot-link"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="ff-input-box">
                <Lock size={16} className="ff-field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ff-text-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ff-eye-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength indicator for signup */}
              {mode === 'signup' && password.length > 0 && (
                <div className="ff-strength-meter">
                  <div className="ff-strength-bars">
                    {[0, 1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className="ff-strength-bar"
                        style={{
                          backgroundColor:
                            step < passwordStrength
                              ? strengthColors[passwordStrength - 1]
                              : '#E2DBD0',
                        }}
                      />
                    ))}
                  </div>
                  <div className="ff-strength-label-row">
                    <span>Password Strength</span>
                    <span style={{ color: strengthColors[Math.max(0, passwordStrength - 1)] }}>
                      {strengthLabels[Math.max(0, passwordStrength - 1)]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox row */}
            {mode === 'login' ? (
              <div className="ff-remember-row">
                <label className="ff-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="ff-checkbox"
                  />
                  <span>Remember me</span>
                </label>
              </div>
            ) : (
              <div className="ff-terms-row">
                <label className="ff-checkbox-label">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="ff-checkbox"
                  />
                  <span>
                    I agree to FamilyFit's{' '}
                    <Link to="/terms" className="ff-terms-link">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="ff-terms-link">Privacy Policy</Link>.
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="ff-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Leaf size={16} />
                  <span>{mode === 'login' ? 'Sign In to FamilyFit' : 'Create Free Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Demo account helper */}
          <div className="ff-demo-row">
            <span>Testing the app? </span>
            <button
              type="button"
              onClick={handleDemoClick}
              className="ff-demo-btn"
            >
              Use demo account
            </button>
          </div>

          {/* Divider */}
          <div className="ff-or-divider">
            <span className="ff-divider-line" />
            <span className="ff-divider-text">Or continue with</span>
            <span className="ff-divider-line" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={onGoogleSignIn || (() => alert('Google authentication is connected to your family workspace.'))}
            className="ff-google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL: KERALA PHOTO & TYPEWRITER GLASS CARD ── */}
      <div className="ff-auth-right-side">
        {/* Background photo */}
        <img
          src={mode === 'login' ? '/images/kerala_banana_leaf.png' : '/images/family_cooking.png'}
          alt={mode === 'login' ? 'Kerala banana-leaf nutritious sadya meal' : 'Family cooking wholesome South Indian meals together'}
          className="ff-auth-hero-img"
        />

        {/* Gradient overlay */}
        <div className="ff-auth-hero-overlay" />

        {/* Top badge */}
        <div className="ff-auth-top-pill">
          <Leaf size={14} className="text-[#84E164]" />
          <span>Kerala Culinary Wellness</span>
        </div>

        {/* Bottom Glass Card with Typewriter */}
        <div className="ff-auth-glass-card">
          <div className="ff-glass-tag">
            <span className="ff-pulse-dot" />
            <span>FamilyFit Daily Inspiration</span>
          </div>

          <div className="ff-glass-quote">
            “
            <Typewriter
              texts={
                mode === 'login'
                  ? [
                      "Welcome back! Your family's healthy journey continues.",
                      "Traditional nutrition for balanced everyday living.",
                      "Every meal is a step toward vibrant family health.",
                    ]
                  : [
                      "Small changes at the table, big changes in life.",
                      "Kerala's natural flavors crafted for every generation.",
                      "Wholesome, allergen-safe meals made simple.",
                    ]
              }
              typingSpeed={50}
              deletingSpeed={30}
              delayBetween={2800}
              cursorClassName="bg-[#7ED362]"
            />
            ”
          </div>

          <div className="ff-glass-author">
            — FamilyFit Health Architecture
          </div>

          {/* 3 Mini Badges */}
          <div className="ff-glass-badges-row">
            <div className="ff-glass-badge-item">
              <Leaf size={16} className="text-[#98E282] mb-1" />
              <span className="ff-badge-label">Healthy</span>
              <span className="ff-badge-sub">Choices</span>
            </div>
            <div className="ff-glass-badge-item">
              <Users size={16} className="text-[#98E282] mb-1" />
              <span className="ff-badge-label">Stronger</span>
              <span className="ff-badge-sub">Together</span>
            </div>
            <div className="ff-glass-badge-item">
              <Heart size={16} className="text-[#98E282] mb-1" />
              <span className="ff-badge-label">Better</span>
              <span className="ff-badge-sub">Every Day</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ff-auth-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: #F6F2EA;
          color: #1F2A24;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        @media (min-width: 960px) {
          .ff-auth-root {
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: 100vh;
            overflow: hidden;
          }
        }

        .ff-auth-left-side {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 24px;
          overflow-y: auto;
          background-color: #F6F2EA;
        }

        @media (min-width: 960px) {
          .ff-auth-left-side {
            padding: 48px 56px;
            height: 100vh;
          }
        }

        .ff-auth-form-inner {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        }

        .ff-auth-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .ff-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #6B7A70;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .ff-back-link:hover {
          color: #3F5A3A;
        }

        .ff-mobile-brand {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          font-weight: 800;
          font-size: 16px;
          color: #3F5A3A;
        }

        @media (min-width: 960px) {
          .ff-mobile-brand {
            display: none;
          }
        }

        .ff-desktop-brand {
          display: none;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        @media (min-width: 960px) {
          .ff-desktop-brand {
            display: flex;
          }
        }

        .ff-brand-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(63, 90, 58, 0.1);
          color: #3F5A3A;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ff-brand-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.3px;
          color: #3F5A3A;
        }

        .ff-auth-header-copy {
          margin-bottom: 22px;
        }

        .ff-auth-main-title {
          font-size: 28px;
          font-weight: 800;
          color: #1F2A24;
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
        }

        .ff-auth-sub-title {
          font-size: 13.5px;
          line-height: 1.5;
          color: #6B7A70;
          margin: 0;
        }

        .ff-tab-switcher {
          display: flex;
          background: #EDE8DE;
          padding: 4px;
          border-radius: 9999px;
          margin-bottom: 22px;
        }

        .ff-tab-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: #6B7A70;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ff-tab-btn.active {
          background: #FFFFFF;
          color: #1F2A24;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .ff-auth-alert {
          padding: 10px 14px;
          background: #FEE2E2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          border-radius: 10px;
          font-size: 13px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .ff-auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ff-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ff-label-split {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ff-field-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6B7A70;
        }

        .ff-forgot-link {
          background: none;
          border: none;
          padding: 0;
          font-size: 12px;
          font-weight: 600;
          color: #3F5A3A;
          cursor: pointer;
          text-decoration: underline;
        }

        .ff-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ff-field-icon {
          position: absolute;
          left: 14px;
          color: #8D9B91;
          pointer-events: none;
        }

        .ff-text-input {
          width: 100%;
          height: 44px;
          padding: 0 14px 0 42px;
          border-radius: 12px;
          border: 1px solid #DCD5C8;
          background: #FFFFFF;
          color: #1F2A24;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .ff-text-input:focus {
          border-color: #3F5A3A;
          box-shadow: 0 0 0 3px rgba(63, 90, 58, 0.12);
        }

        .ff-eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #8D9B91;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .ff-eye-btn:hover {
          color: #1F2A24;
        }

        .ff-strength-meter {
          margin-top: 6px;
        }

        .ff-strength-bars {
          display: flex;
          gap: 6px;
          height: 5px;
        }

        .ff-strength-bar {
          flex: 1;
          border-radius: 999px;
          transition: background-color 0.25s ease;
        }

        .ff-strength-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #6B7A70;
          margin-top: 4px;
        }

        .ff-remember-row, .ff-terms-row {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #6B7A70;
        }

        .ff-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .ff-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          accent-color: #3F5A3A;
          cursor: pointer;
        }

        .ff-terms-link {
          color: #3F5A3A;
          font-weight: 700;
          text-decoration: underline;
        }

        .ff-submit-btn {
          height: 48px;
          width: 100%;
          border-radius: 12px;
          background: #3F5A3A;
          color: #FFFFFF;
          border: none;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(63, 90, 58, 0.2);
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .ff-submit-btn:hover {
          background: #334B2E;
        }

        .ff-submit-btn:active {
          transform: scale(0.99);
        }

        .ff-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .ff-demo-row {
          text-align: center;
          font-size: 12.5px;
          color: #6B7A70;
          margin-top: 14px;
        }

        .ff-demo-btn {
          background: none;
          border: none;
          padding: 0;
          font-weight: 700;
          color: #3F5A3A;
          cursor: pointer;
          text-decoration: underline;
        }

        .ff-or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 18px 0;
        }

        .ff-divider-line {
          flex: 1;
          height: 1px;
          background: #E2DBD0;
        }

        .ff-divider-text {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #8D9B91;
        }

        .ff-google-btn {
          height: 44px;
          width: 100%;
          border-radius: 12px;
          border: 1px solid #DCD5C8;
          background: #FFFFFF;
          color: #1F2A24;
          font-size: 13.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .ff-google-btn:hover {
          background: #FAF7F2;
        }

        /* ── RIGHT PANEL (DESKTOP ONLY) ── */
        .ff-auth-right-side {
          display: none;
        }

        @media (min-width: 960px) {
          .ff-auth-right-side {
            display: flex;
            position: relative;
            height: 100vh;
            overflow: hidden;
            background-color: #243B21;
            align-items: flex-end;
            justify-content: center;
            padding: 48px;
          }
        }

        .ff-auth-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-cover: cover;
          object-position: center;
          transform: scale(1.03);
          transition: opacity 0.5s ease;
        }

        .ff-auth-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20, 32, 18, 0.92) 0%, rgba(30, 48, 26, 0.45) 50%, rgba(0, 0, 0, 0.25) 100%);
        }

        .ff-auth-top-pill {
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 10;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ff-auth-glass-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.28);
          padding: 24px 28px;
          color: #FFFFFF;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .ff-glass-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #98E282;
          margin-bottom: 12px;
        }

        .ff-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7ED362;
          box-shadow: 0 0 8px #7ED362;
        }

        .ff-glass-quote {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.35;
          min-height: 52px;
        }

        .ff-glass-author {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 8px;
          font-weight: 500;
        }

        .ff-glass-badges-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
        }

        .ff-glass-badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 8px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.12);
        }

        .ff-badge-label {
          font-size: 11px;
          font-weight: 700;
        }

        .ff-badge-sub {
          font-size: 9.5px;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  )
}

export default AuthUI
