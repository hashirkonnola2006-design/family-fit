import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LandingNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuRef = useRef(null)

  // Track scroll for transparent-to-solid transition and active link highlight
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      const sections = ['features', 'plans', 'reviews']
      const scrollPos = window.scrollY + 120
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Focus trap & Escape key listener for accessible mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  const scrollToSection = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FBF8F0]/95 backdrop-blur-md border-b-2 border-[#E8DCC4] py-3.5 shadow-sm text-[#1F2A1C]'
          : 'bg-transparent border-b border-transparent py-4 text-[#1F2A1C]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* ── Brand Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-9 h-9 rounded-xl bg-[#3E7D1E] border border-[#2F6215] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Leaf size={20} strokeWidth={2.5} fill="#FFFFFF" />
          </div>
          <span className="font-poster text-2xl tracking-wide text-[#1F2A1C]">
            Family<span className="text-[#3E7D1E]">Fit</span>
          </span>
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <nav className="hidden md:flex items-center gap-8 font-body font-bold text-sm">
          <button
            onClick={() => scrollToSection('features')}
            className={`transition-colors cursor-pointer relative py-1 ${
              activeSection === 'features'
                ? 'text-[#285233]'
                : 'text-[#1F2A1C]/80 hover:text-[#1F2A1C]'
            }`}
          >
            <span>Features</span>
            {activeSection === 'features' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#285233] rounded-full" />
            )}
          </button>

          <button
            onClick={() => scrollToSection('plans')}
            className={`transition-colors cursor-pointer relative py-1 ${
              activeSection === 'plans'
                ? 'text-[#285233]'
                : 'text-[#1F2A1C]/80 hover:text-[#1F2A1C]'
            }`}
          >
            <span>Plans</span>
            {activeSection === 'plans' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#285233] rounded-full" />
            )}
          </button>

          <button
            onClick={() => scrollToSection('reviews')}
            className={`transition-colors cursor-pointer relative py-1 ${
              activeSection === 'reviews'
                ? 'text-[#285233]'
                : 'text-[#1F2A1C]/80 hover:text-[#1F2A1C]'
            }`}
          >
            <span>Reviews</span>
            {activeSection === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#285233] rounded-full" />
            )}
          </button>
        </nav>

        {/* ── Auth CTA Buttons ── */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="landing-btn-primary px-5 py-2 text-xs uppercase tracking-wider"
              >
                <LayoutDashboard size={14} className="mr-1.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-bold text-[#5E6B5A] hover:text-[#1F2A1C] hover:underline transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-extrabold text-[#1F2A1C] hover:text-[#285233] underline hover:no-underline transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/login?mode=signup"
                className="landing-btn-primary px-5 py-2 text-xs uppercase tracking-wider shadow-sm"
              >
                <span>Sign up</span>
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger Toggle ── */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-[#1F2A1C] hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Mobile Full-Screen Cream Menu with Focus Trap ── */}
      {mobileOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="md:hidden fixed inset-0 z-50 bg-[#F5EBD7] text-[#1F2A1C] p-6 flex flex-col justify-between animate-in fade-in duration-200"
        >
          {/* Top Bar with Brand and Close Button */}
          <div className="flex items-center justify-between border-b-2 border-[#E8DCC4] pb-5">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#58CC02] flex items-center justify-center text-white">
                <Leaf size={20} fill="#ffffff" />
              </div>
              <span className="font-poster text-2xl tracking-wide text-[#1F2A1C]">
                Family<span className="text-[#58CC02]">Fit</span>
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-[#1F2A1C] hover:bg-black/5 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X size={26} strokeWidth={2.5} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-6 py-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left font-poster text-3xl text-[#1F2A1C] hover:text-[#58CC02] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('plans')}
              className="text-left font-poster text-3xl text-[#1F2A1C] hover:text-[#58CC02] transition-colors cursor-pointer"
            >
              Plans
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left font-poster text-3xl text-[#1F2A1C] hover:text-[#58CC02] transition-colors cursor-pointer"
            >
              Reviews
            </button>
          </nav>

          {/* Bottom CTAs */}
          <div className="pt-6 border-t-2 border-[#E8DCC4] flex flex-col gap-3.5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="landing-btn-primary w-full h-12 text-sm uppercase tracking-wider"
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="w-full h-12 rounded-full border-2 border-[#E8DCC4] text-sm font-bold text-[#5E6B5A]"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login?mode=signup"
                  onClick={() => setMobileOpen(false)}
                  className="landing-btn-primary w-full h-12 text-sm uppercase tracking-wider"
                >
                  <span>Sign up free</span>
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-12 rounded-full border-2 border-[#1F2A1C] text-[#1F2A1C] flex items-center justify-center font-black text-sm uppercase tracking-wider hover:bg-black/5"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
