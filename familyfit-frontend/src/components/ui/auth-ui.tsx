import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Bell, 
  ChevronDown, 
  AlertCircle, 
  Loader2, 
  Check,
  ArrowLeft 
} from 'lucide-react'
import { Logo } from '../brand/Logo'

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

// ─── BRAND ICONS & DOODLES ──────────────────────────────────────────

// FamilyFit Brand Logo Lockup
function FamilyFitLogo({ tone = "color", height = 32 }: { tone?: "color" | "white"; height?: number }) {
  return (
    <Logo variant="lockup" tone={tone} height={height} asLink />
  )
}

// Google "G" Icon
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

// ─── AUTHENTICATION UI COMPONENT ────────────────────────────────────

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
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Validation States
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [globalError, setGlobalError] = useState(error)

  useEffect(() => {
    setGlobalError(error)
  }, [error])

  // Password strength score (0-4)
  const passwordStrength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 4)
  }, [password])

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['#E53E3E', '#DD6B20', '#38A169', '#2F4A2E']

  const validateField = (field: string, value: string, termsChecked = agreeTerms) => {
    const errors = { ...fieldErrors }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        errors.email = 'Email address is required'
      } else if (!emailRegex.test(value.trim())) {
        errors.email = 'Please enter a valid email address'
      } else {
        delete errors.email
      }
    }

    if (field === 'password') {
      if (!value) {
        errors.password = 'Password is required'
      } else if (mode === 'signup' && value.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      } else {
        delete errors.password
      }
    }

    if (field === 'name' && mode === 'signup') {
      if (!value.trim()) {
        errors.name = 'Please enter your name or family name'
      } else {
        delete errors.name
      }
    }

    if (field === 'terms' && mode === 'signup') {
      if (!termsChecked) {
        errors.terms = 'You must agree to the Terms of Service'
      } else {
        delete errors.terms
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateAll = () => {
    const errors: { [key: string]: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      errors.email = 'Email address is required'
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (mode === 'signup' && password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        errors.name = 'Please enter your name or family name'
      }
      if (!agreeTerms) {
        errors.terms = 'You must agree to the Terms of Service'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setMode(newMode)
    setTouched({})
    setSubmitted(false)
    setFieldErrors({})
    setGlobalError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched({ email: true, password: true, name: true, terms: true })

    if (!validateAll()) {
      return
    }

    onSubmit({
      mode,
      email: email.trim(),
      password,
      name: name.trim(),
      rememberMe,
    })
  }

  const handleDemoClick = () => {
    setMode('login')
    setEmail('healthyfamily@example.com')
    setPassword('password123')
    setTouched({})
    setSubmitted(false)
    setFieldErrors({})
    setGlobalError('')
    if (onUseDemo) onUseDemo()
  }

  const isSubmitDisabled = loading || (mode === 'signup' && !agreeTerms)

  return (
    <div className="min-h-screen min-h-dvh w-full flex flex-col lg:flex-row bg-[#FAF7F0] text-[#1E2E1A] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#2F4A2E] selection:text-white overflow-x-hidden">
      
      {/* ─── LEFT PANEL (DESKTOP): 52% PHOTO OF SMILING CHILD EATING ON BANANA LEAF ─── */}
      <div className="w-full lg:w-[52%] h-[360px] sm:h-[420px] lg:h-screen relative overflow-hidden bg-[#576D4C] select-none shrink-0">
        
        {/* Clean, Sharp, Ultra High-Resolution Photo (Zero Baked Text, No Artifacts) */}
        <img
          src="/images/auth-kid-clean.jpg"
          alt="Smiling Indian child eating a traditional Kerala meal on a banana leaf"
          className="w-full h-full object-cover object-[72%_36%] pointer-events-none"
          loading="eager"
        />

        {/* Soft Vignette Overlay for Text Legibility on Green Wall */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/5 to-transparent pointer-events-none" />

        {/* Top-Left Header: FamilyFit Logo over Photo */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8 xl:left-9 z-20">
          <FamilyFitLogo tone="white" height={34} />
        </div>

        {/* Mobile Top-Right: Back to Home Link */}
        <div className="lg:hidden absolute top-6 right-6 z-20 flex items-center">
          <Link
            to={backToHomeHref || '/'}
            className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/25 shadow-xs hover:bg-black/55 transition-all"
            aria-label="Back to home page"
          >
            <ArrowLeft size={13} strokeWidth={2.4} />
            <span>Home</span>
          </Link>
        </div>

        {/* Left-Center Typography Overlay (Pure HTML/CSS — Crisp and Legible) */}
        <div className="absolute top-20 sm:top-24 lg:top-32 left-6 sm:left-8 lg:left-8 xl:left-9 z-20 pointer-events-none max-w-[260px] sm:max-w-sm lg:max-w-[340px]">
          
          {/* "Good Food Builds" (handwritten script font Caveat) */}
          <div className="font-['Caveat',cursive] text-white text-3xl sm:text-4xl lg:text-[42px] leading-tight font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            Good Food Builds
          </div>

          {/* "Happy Kids" (bold rounded white font with yellow radiance lines and doodle heart) */}
          <div className="flex items-center gap-2 mt-0.5">
            <div className="relative inline-flex items-center">
              <span 
                className="font-['Plus_Jakarta_Sans',sans-serif] text-white font-black tracking-tight leading-[0.95] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                style={{ fontSize: 'clamp(44px, 4.5vw, 72px)' }}
              >
                Happy
                <br />
                Kids
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-white/95 text-xs sm:text-sm lg:text-[15px] font-medium mt-3.5 max-w-xs leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            Nutritious meals, healthy habits, brighter tomorrows.
          </p>
        </div>

        {/* ── Desktop Smooth Organic S-Curve Divider (Vector SVG filling #FAF7F0 into right panel) ── */}
        <svg
          className="hidden lg:block absolute right-0 top-0 h-full w-[90px] xl:w-[130px] 2xl:w-[160px] pointer-events-none z-10 translate-x-[1px]"
          viewBox="0 0 130 1000"
          preserveAspectRatio="none"
          fill="#FAF7F0"
          aria-hidden="true"
        >
          <path d="M60,0 C95,120 125,240 120,360 C115,480 30,550 20,680 C10,780 40,880 90,1000 L130,1000 L130,0 Z" />
        </svg>

        {/* ── Mobile Organic Wave at Bottom of Photo ── */}
        <svg
          className="lg:hidden absolute bottom-0 left-0 w-full h-[32px] sm:h-[44px] pointer-events-none z-10 translate-y-[1px]"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          fill="#FAF7F0"
          aria-hidden="true"
        >
          <path d="M0,45 C250,90 400,10 700,60 C850,85 950,55 1000,40 L1000,100 L0,100 Z" />
        </svg>
      </div>

      {/* ─── RIGHT SECTION: 48% WARM CREAM (#FAF7F0) WITH CENTERED FLOATING LOGIN CARD ─── */}
      <div className="w-full lg:w-[48%] min-h-[calc(100vh-360px)] lg:h-screen overflow-y-auto flex flex-col justify-between items-center px-5 py-6 sm:px-8 sm:py-8 lg:px-10 xl:px-14 bg-[#FAF7F0] relative z-20">
        
        {/* Desktop Top Header: "Back to Home" Button (Replaced notification, dropdown & avatar buttons) */}
        <div className="w-full flex items-center justify-end mb-2 lg:mb-4 shrink-0">
          <Link
            to={backToHomeHref || '/'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F5F2E8] active:scale-95 text-[#1F5D3A] border border-[#EAE5D9] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer font-['Fredoka',sans-serif] hover:-translate-x-0.5"
            aria-label="Back to home page"
          >
            <ArrowLeft size={15} strokeWidth={2.4} className="text-[#1F5D3A]" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Centered Rounded Auth Card (~430px wide, radius ~32px, 1px soft border, light shadow) */}
        <div className="w-full max-w-[430px] my-auto bg-transparent lg:bg-white border-0 lg:border lg:border-[#EAE5D9] rounded-none lg:rounded-[32px] p-0 lg:p-9 shadow-none lg:shadow-[0_10px_35px_-5px_rgba(47,74,46,0.05)] relative z-20">
          
          {/* Brand Logo Lockup inside Card */}
          <div className="mb-3">
            <FamilyFitLogo tone="color" height={32} />
          </div>

          {/* "Welcome Back" Heading with Small Green Leaf Icon */}
          <h1 className="text-2xl sm:text-[28px] font-black text-[#2F4A2E] tracking-tight leading-tight flex items-center gap-2">
            <span>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</span>
            <span className="inline-flex text-[#2F4A2E] text-xl" aria-hidden="true">
              🌿
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] text-[#667085] mt-1.5 mb-5 leading-relaxed font-normal">
            {mode === 'login' 
              ? 'Good to see you again! Sign in to continue your healthy journey.' 
              : 'Join FamilyFit for nutritious meals and healthy habits every day.'}
          </p>

          {/* Server / Global Error Alert Banner */}
          {globalError && (
            <div 
              role="alert" 
              className="p-3 mb-4 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/40 text-[#B91C1C] text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{globalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 w-full">
            
            {/* Full Name / Family Name (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label 
                  htmlFor="auth-name" 
                  className="text-xs font-semibold text-[#344054]"
                >
                  Full Name / Family Name
                </label>
                <div className={`h-12 w-full rounded-full border bg-[#FAFAF9] focus-within:bg-white px-4 flex items-center gap-3 transition-all focus-within:border-[#2F4A2E] focus-within:ring-2 focus-within:ring-[#2F4A2E]/20 ${
                  (touched.name || submitted) && fieldErrors.name 
                    ? 'border-[#DC2626] ring-1 ring-[#DC2626]/30' 
                    : 'border-[#D0D5DD]'
                }`}>
                  <User size={17} className="text-[#98A2B3] shrink-0" />
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, name: true }))
                      validateField('name', name)
                    }}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (touched.name || submitted) {
                        validateField('name', e.target.value)
                      }
                    }}
                    placeholder="e.g. Priya Menon or FamilyFit"
                    className="w-full bg-transparent text-sm text-[#1E2E1A] placeholder:text-[#98A2B3] outline-none"
                  />
                </div>
                {(touched.name || submitted) && fieldErrors.name && (
                  <p role="alert" className="text-xs font-semibold text-[#DC2626] flex items-center gap-1 mt-0.5 px-2">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>
            )}

            {/* Email Address Field (Pill Input with Mail Icon) */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="auth-email" 
                className="text-xs font-semibold text-[#344054]"
              >
                Email Address
              </label>
              <div className={`h-12 w-full rounded-full border bg-[#FAFAF9] focus-within:bg-white px-4 flex items-center gap-3 transition-all focus-within:border-[#2F4A2E] focus-within:ring-2 focus-within:ring-[#2F4A2E]/20 ${
                (touched.email || submitted) && fieldErrors.email 
                  ? 'border-[#DC2626] ring-1 ring-[#DC2626]/30' 
                  : 'border-[#D0D5DD]'
              }`}>
                <Mail size={17} className="text-[#98A2B3] shrink-0" />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, email: true }))
                    validateField('email', email)
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (touched.email || submitted) {
                      validateField('email', e.target.value)
                    }
                  }}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-[#1E2E1A] placeholder:text-[#98A2B3] outline-none"
                />
              </div>
              {(touched.email || submitted) && fieldErrors.email && (
                <p role="alert" className="text-xs font-semibold text-[#DC2626] flex items-center gap-1 mt-0.5 px-2">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field (Pill Input with Lock Icon and Eye Toggle) */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="auth-password" 
                className="text-xs font-semibold text-[#344054]"
              >
                Password
              </label>
              <div className={`h-12 w-full rounded-full border bg-[#FAFAF9] focus-within:bg-white px-4 flex items-center gap-3 transition-all focus-within:border-[#2F4A2E] focus-within:ring-2 focus-within:ring-[#2F4A2E]/20 ${
                (touched.password || submitted) && fieldErrors.password 
                  ? 'border-[#DC2626] ring-1 ring-[#DC2626]/30' 
                  : 'border-[#D0D5DD]'
              }`}>
                <Lock size={17} className="text-[#98A2B3] shrink-0" />
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, password: true }))
                    validateField('password', password)
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (touched.password || submitted) {
                      validateField('password', e.target.value)
                    }
                  }}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  className="w-full bg-transparent text-sm text-[#1E2E1A] placeholder:text-[#98A2B3] outline-none pr-1"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#98A2B3] hover:text-[#2F4A2E] rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4A2E]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {(touched.password || submitted) && fieldErrors.password && (
                <p role="alert" className="text-xs font-semibold text-[#DC2626] flex items-center gap-1 mt-0.5 px-2">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}

              {/* Password Strength Indicator for Signup */}
              {mode === 'signup' && password.length > 0 && (
                <div className="mt-1 space-y-1 px-1">
                  <div className="flex gap-1 h-1.5">
                    {[0, 1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className="flex-1 rounded-full transition-colors duration-200"
                        style={{
                          backgroundColor:
                            step < passwordStrength
                              ? strengthColors[passwordStrength - 1]
                              : '#E2DDD0',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-[#667085]">
                    <span>Strength</span>
                    <span style={{ color: strengthColors[Math.max(0, passwordStrength - 1)] }}>
                      {strengthLabels[Math.max(0, passwordStrength - 1)]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me Checkbox & Forgot Password Row */}
            {mode === 'login' ? (
              <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1">
                <label 
                  htmlFor="auth-remember" 
                  className="inline-flex items-center gap-2 cursor-pointer text-[#475467] select-none"
                >
                  <input
                    id="auth-remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-[4px] border border-[#D0D5DD] text-[#2F4A2E] accent-[#2F4A2E] cursor-pointer"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={onForgotPassword || (() => alert('Password reset instructions sent to your email.'))}
                  className="font-medium text-[#475467] hover:text-[#2F4A2E] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-1">
                <label 
                  htmlFor="auth-terms" 
                  className="inline-flex items-start gap-2 cursor-pointer text-xs text-[#475467] select-none"
                >
                  <input
                    id="auth-terms"
                    name="agreeTerms"
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked)
                      if (touched.terms || submitted) {
                        validateField('terms', '', e.target.checked)
                      }
                    }}
                    className="w-4 h-4 mt-0.5 rounded-[4px] border border-[#D0D5DD] text-[#2F4A2E] accent-[#2F4A2E] cursor-pointer"
                  />
                  <span className="font-normal leading-tight">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="font-bold text-[#2F4A2E] hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank" className="font-bold text-[#2F4A2E] hover:underline">
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
                {(touched.terms || submitted) && fieldErrors.terms && (
                  <p role="alert" className="text-xs font-semibold text-[#DC2626] flex items-center gap-1 mt-0.5 px-2">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{fieldErrors.terms}</span>
                  </p>
                )}
              </div>
            )}

            {/* Full-width Dark Green (#2F4A2E) Pill "Sign In →" Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              style={{
                backgroundColor: '#2F4A2E',
                color: '#FFFFFF',
                opacity: isSubmitDisabled ? 0.6 : 1,
              }}
              className="h-12 w-full mt-2 rounded-full font-bold text-sm sm:text-base text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:bg-[#243A23] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4A2E] focus-visible:ring-offset-2 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={16} className="text-white" />
                </>
              )}
            </button>
          </form>

          {/* Divider: "Or continue with" */}
          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-[1px] bg-[#E4E7EC]" />
            <span className="text-xs font-medium text-[#98A2B3]">
              {mode === 'login' ? 'Or continue with' : 'OR'}
            </span>
            <span className="flex-1 h-[1px] bg-[#E4E7EC]" />
          </div>

          {/* Outlined Pill "Continue with Google" Button */}
          <button
            type="button"
            onClick={onGoogleSignIn || (() => alert('Google authentication is connected to your family workspace.'))}
            className="h-12 w-full rounded-full border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] font-semibold text-sm text-[#344054] flex items-center justify-center gap-2.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4A2E] focus-visible:ring-offset-2 shadow-xs"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* "New to FamilyFit? Create an account →" Link */}
          <div className="text-center text-xs sm:text-[13px] text-[#475467] mt-5">
            {mode === 'login' ? (
              <p>
                New to FamilyFit?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="font-bold text-[#2F4A2E] hover:underline cursor-pointer inline-flex items-center gap-0.5 ml-1"
                >
                  <span>Create an account</span>
                  <ArrowRight size={13} className="inline" />
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="font-bold text-[#2F4A2E] hover:underline cursor-pointer inline-flex items-center gap-0.5 ml-1"
                >
                  <span>Sign in</span>
                  <ArrowRight size={13} className="inline" />
                </button>
              </p>
            )}
          </div>

          {/* "Testing the app? Use demo account" Helper */}
          <div className="text-center text-[11px] text-[#98A2B3] mt-3">
            <span>Testing the app? </span>
            <button
              type="button"
              onClick={handleDemoClick}
              className="font-semibold text-[#2F4A2E] hover:underline cursor-pointer"
            >
              Use demo account
            </button>
          </div>
        </div>

        {/* Footer Under Card: Small Leaf Icon + "Better Food • Healthier Families • Brighter Futures" */}
        <div className="w-full flex items-center justify-center gap-2 text-xs text-[#7A8B7B] font-medium py-3 text-center shrink-0">
          <Logo variant="mark" height={16} />
          <span>Better Food &bull; Healthier Families &bull; Brighter Futures</span>
        </div>

        {/* Faint Botanical Leaf Illustration Decoration in Bottom-Right Corner */}
        <div className="hidden lg:block absolute bottom-0 right-0 pointer-events-none opacity-30 z-0" aria-hidden="true">
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <path d="M180 90 C140 100 120 140 110 180 C125 145 155 120 180 90 Z" fill="#2F4A2E" />
            <path d="M180 135 C135 140 105 160 80 180 C115 165 150 150 180 135 Z" fill="#576D4C" />
            <path d="M135 180 C145 145 170 125 180 110 C165 135 150 155 135 180 Z" fill="#7A8B7B" />
          </svg>
        </div>

      </div>

    </div>
  )
}

export default AuthUI
