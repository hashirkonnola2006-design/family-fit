import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LandingNav() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: scrolled ? 'rgba(246, 242, 234, 0.98)' : 'rgba(246, 242, 234, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2DBD0',
        boxShadow: scrolled ? '0 4px 16px rgba(31, 42, 36, 0.05)' : 'none',
        padding: '14px 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* ── Brand Logo ── */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#3F5A3A]/10 flex items-center justify-center text-[#3F5A3A] group-hover:scale-105 transition-transform">
            <Leaf size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#3F5A3A] font-['Plus_Jakarta_Sans']">
            Family<span className="text-[#6BBF4E]">Fit</span>
          </span>
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-semibold text-[#1F2A24]/80 hover:text-[#3F5A3A] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('recipes-preview')}
            className="text-sm font-semibold text-[#1F2A24]/80 hover:text-[#3F5A3A] transition-colors cursor-pointer"
          >
            Recipes
          </button>
          <button
            onClick={() => scrollToSection('plans')}
            className="text-sm font-semibold text-[#1F2A24]/80 hover:text-[#3F5A3A] transition-colors cursor-pointer"
          >
            Plans
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="text-sm font-semibold text-[#1F2A24]/80 hover:text-[#3F5A3A] transition-colors cursor-pointer"
          >
            Reviews
          </button>
        </nav>

        {/* ── Auth CTA Buttons ── */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="ff-btn-nav"
            >
              <LayoutDashboard size={15} />
              <span>Go to dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="ff-btn-nav-outline"
              >
                Log in
              </Link>
              <Link
                to="/login?mode=signup"
                className="ff-btn-nav"
              >
                <span>Sign up</span>
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger Toggle ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-[#1F2A24] hover:bg-black/5 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileOpen && (
        <div 
          className="md:hidden border-b border-[#E2DBD0] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2"
          style={{ backgroundColor: '#F6F2EA' }}
        >
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-sm font-semibold text-[#1F2A24]"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('recipes-preview')}
            className="block w-full text-left py-2 text-sm font-semibold text-[#1F2A24]"
          >
            Recipes
          </button>
          <button
            onClick={() => scrollToSection('plans')}
            className="block w-full text-left py-2 text-sm font-semibold text-[#1F2A24]"
          >
            Plans
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="block w-full text-left py-2 text-sm font-semibold text-[#1F2A24]"
          >
            Reviews
          </button>

          <div className="pt-3 border-t border-[#E2DBD0] flex flex-col gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full h-11 rounded-full bg-[#3F5A3A] text-white flex items-center justify-center font-bold text-sm shadow-sm"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full h-11 rounded-full border border-[#3F5A3A] text-[#3F5A3A] flex items-center justify-center font-bold text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/login?mode=signup"
                  className="w-full h-11 rounded-full bg-[#3F5A3A] text-white flex items-center justify-center font-bold text-sm shadow-sm"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
