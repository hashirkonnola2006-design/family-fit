import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X, FileText, Shield, Info, Sparkles, HelpCircle, HeartHandshake, Compass } from 'lucide-react'
import { Logo } from '../brand/Logo'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const drawerRef = useRef(null)
  const menuButtonRef = useRef(null)
  const location = useLocation()

  // Smooth scroll handler for landing page sections
  const handleSectionClick = (e, sectionId) => {
    if (e) e.preventDefault()
    setMenuOpen(false)

    if (location.pathname === '/') {
      const el = document.getElementById(sectionId)
      if (el) {
        const yOffset = -76
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        window.history.pushState(null, '', `#${sectionId}`)
        setActiveSection(sectionId)
      }
    } else {
      window.location.href = `/#${sectionId}`
    }
  }

  // Scroll detection for shadow and active section indicator
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)

      const sections = ['how-it-works', 'family-care', 'our-approach']
      const scrollPos = window.scrollY + 140

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId)
            return
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Body scroll lock & Esc key listener when menu drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMenuOpen(false)
          menuButtonRef.current?.focus()
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-[#F8F6EF] border-b border-[rgba(31,93,58,0.12)] transition-shadow duration-200 select-none ${
          scrolled ? 'shadow-[0_2px_12px_rgba(31,93,58,0.08)]' : ''
        }`}
        style={{ height: 'var(--navbar-height, 72px)' }}
      >
        <div
          className="w-full h-full flex items-center justify-between"
          style={{ paddingLeft: 'var(--page-gutter)', paddingRight: 'var(--page-gutter)' }}
        >
          {/* ── Left: Brand Logo Lockup ── */}
          <Logo variant="lockup" tone="color" height={36} asLink />

          {/* ── Desktop Inline Section Links (1024px and up) ── */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8"
            aria-label="Main Navigation"
          >
            <a
              href="#how-it-works"
              onClick={(e) => handleSectionClick(e, 'how-it-works')}
              style={{ fontFamily: 'var(--font-body)' }}
              className={`h-11 inline-flex items-center text-[16px] xl:text-[17px] font-semibold transition-colors duration-150 relative cursor-pointer ${
                activeSection === 'how-it-works'
                  ? 'text-[#1F5A32] underline decoration-[#B4530A] decoration-2 underline-offset-[6px]'
                  : 'text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px]'
              }`}
            >
              How it works
            </a>

            <a
              href="#family-care"
              onClick={(e) => handleSectionClick(e, 'family-care')}
              style={{ fontFamily: 'var(--font-body)' }}
              className={`h-11 inline-flex items-center text-[16px] xl:text-[17px] font-semibold transition-colors duration-150 relative cursor-pointer ${
                activeSection === 'family-care'
                  ? 'text-[#1F5D3A] underline decoration-[#F59E0B] decoration-2 underline-offset-[6px]'
                  : 'text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px]'
              }`}
            >
              For your family
            </a>

            <a
              href="#our-approach"
              onClick={(e) => handleSectionClick(e, 'our-approach')}
              style={{ fontFamily: 'var(--font-body)' }}
              className={`h-11 inline-flex items-center text-[16px] xl:text-[17px] font-semibold transition-colors duration-150 relative cursor-pointer ${
                activeSection === 'our-approach'
                  ? 'text-[#1F5D3A] underline decoration-[#F59E0B] decoration-2 underline-offset-[6px]'
                  : 'text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px]'
              }`}
            >
              Our approach
            </a>

            {/* Added: Shortened Links to Privacy & Terms */}
            <Link
              to="/privacy"
              style={{ fontFamily: 'var(--font-body)' }}
              className="h-11 inline-flex items-center text-[16px] xl:text-[17px] font-semibold text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px] transition-colors duration-150 relative"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              style={{ fontFamily: 'var(--font-body)' }}
              className="h-11 inline-flex items-center text-[16px] xl:text-[17px] font-semibold text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px] transition-colors duration-150 relative"
            >
              Terms
            </Link>
          </nav>

          {/* ── Right Actions: Log in, Sign Up, & 3-line Nav Menu Button ── */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              style={{ fontFamily: 'var(--font-body)' }}
              className="hidden sm:inline-flex h-11 items-center text-[16px] sm:text-[17px] font-semibold text-[#1A2E22] hover:text-[#1F5D3A] transition-colors rounded-lg px-2"
            >
              Log in
            </Link>

            {/* Primary "Sign up" button */}
            <Link
              to="/login?mode=signup"
              style={{ fontFamily: 'var(--font-body)' }}
              className="h-11 px-5 sm:px-6 rounded-full bg-[#1F5D3A] hover:bg-[#174A2E] active:scale-[0.98] text-white font-semibold text-[15px] sm:text-[17px] inline-flex items-center gap-2 shadow-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A] focus-visible:ring-offset-2"
            >
              <span className="text-white" style={{ color: '#FFFFFF' }}>Sign up</span>
              <ArrowRight size={17} className="text-white" />
            </Link>

            {/* 3-line Nav Menu Button (Always visible on all screens) */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="public-navigation-drawer"
              aria-label="Open Navigation Menu"
              className="w-11 h-11 rounded-xl border border-[rgba(31,93,58,0.3)] bg-white/80 text-[#1F5D3A] flex items-center justify-center hover:bg-white hover:border-[#1F5D3A] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A]"
            >
              <Menu size={22} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Public Pages Navigation Drawer / Slide-Over ── */}
      {menuOpen && (
        <div
          id="public-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Public Navigation Menu"
          className="fixed inset-0 z-[100] flex justify-end"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-over Content Drawer */}
          <div
            ref={drawerRef}
            className="relative z-10 w-full max-w-md bg-[#FBF9F3] text-[#1A2E22] flex flex-col justify-between p-6 sm:p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-[#E5E0D5]"
          >
            <div>
              {/* Drawer Top Row: Logo + Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-[rgba(31,93,58,0.12)]">
                <Logo variant="lockup" tone="color" height={34} asLink onClick={() => setMenuOpen(false)} />

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close Navigation Menu"
                  className="w-10 h-10 rounded-xl border border-[rgba(31,93,58,0.3)] bg-white text-[#1F5D3A] flex items-center justify-center hover:bg-[#F3EFE6] active:scale-95 transition-all cursor-pointer"
                >
                  <X size={20} strokeWidth={2.2} />
                </button>
              </div>

              {/* Navigation Section 1: Public Pages & Policies */}
              <div className="pt-6 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7B6E] block mb-3">
                  Information & Policies
                </span>
                <nav className="flex flex-col gap-1.5" aria-label="Public Policy Pages">
                  <Link
                    to="/privacy"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-[#1A2E22] hover:text-[#1F5D3A]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EAEFEA] text-[#1F5D3A] flex items-center justify-center shrink-0">
                      <Shield size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Privacy</div>
                      <div className="text-xs text-[#5D6F61]">How we safeguard your family health data</div>
                    </div>
                  </Link>

                  <Link
                    to="/terms"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-[#1A2E22] hover:text-[#1F5D3A]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EAEFEA] text-[#1F5D3A] flex items-center justify-center shrink-0">
                      <FileText size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Terms</div>
                      <div className="text-xs text-[#5D6F61]">Platform usage guidelines & policies</div>
                    </div>
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-[#1A2E22] hover:text-[#1F5D3A]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EAEFEA] text-[#1F5D3A] flex items-center justify-center shrink-0">
                      <Info size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">About Us</div>
                      <div className="text-xs text-[#5D6F61]">Our mission, team & Ayurvedic heritage</div>
                    </div>
                  </Link>

                  <Link
                    to="/brand-showcase"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-[#1A2E22] hover:text-[#1F5D3A]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EAEFEA] text-[#1F5D3A] flex items-center justify-center shrink-0">
                      <Sparkles size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Brand Showcase</div>
                      <div className="text-xs text-[#5D6F61]">Visual identity, typography & palettes</div>
                    </div>
                  </Link>
                </nav>
              </div>

              {/* Navigation Section 2: Landing Page Highlights */}
              <div className="pt-4 pb-4 border-t border-[rgba(31,93,58,0.12)]">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7B6E] block mb-3">
                  Explore FamilyFit
                </span>
                <nav className="flex flex-col gap-1.5" aria-label="Landing Page Sections">
                  <a
                    href="#how-it-works"
                    onClick={(e) => handleSectionClick(e, 'how-it-works')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-[#1A2E22] hover:text-[#1F5D3A] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F0EFEB] text-[#6B5E49] flex items-center justify-center shrink-0">
                      <Compass size={17} />
                    </div>
                    <span className="font-semibold text-sm sm:text-base">How it works</span>
                  </a>

                  <a
                    href="#family-care"
                    onClick={(e) => handleSectionClick(e, 'family-care')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-[#1A2E22] hover:text-[#1F5D3A] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F0EFEB] text-[#6B5E49] flex items-center justify-center shrink-0">
                      <HeartHandshake size={17} />
                    </div>
                    <span className="font-semibold text-sm sm:text-base">For your family</span>
                  </a>

                  <a
                    href="#our-approach"
                    onClick={(e) => handleSectionClick(e, 'our-approach')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-[#1A2E22] hover:text-[#1F5D3A] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F0EFEB] text-[#6B5E49] flex items-center justify-center shrink-0">
                      <HelpCircle size={17} />
                    </div>
                    <span className="font-semibold text-sm sm:text-base">Our approach</span>
                  </a>
                </nav>
              </div>
            </div>

            {/* Bottom Actions: Sign Up & Log In */}
            <div className="pt-6 border-t border-[rgba(31,93,58,0.12)] flex flex-col gap-3">
              <Link
                to="/login?mode=signup"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full h-12 rounded-full bg-[#1F5D3A] hover:bg-[#174A2E] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span className="text-white" style={{ color: '#FFFFFF' }}>Create Free Account</span>
                <ArrowRight size={17} className="text-white" />
              </Link>

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full h-12 rounded-full border border-[rgba(31,93,58,0.25)] bg-white text-[#1F3A28] font-bold text-[16px] flex items-center justify-center hover:bg-[#FAF8F2] transition-colors"
              >
                Log in to your account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
