import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Logo } from '../brand/Logo'

export default function LandingNavbar() {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const drawerRef = useRef(null)
  const menuButtonRef = useRef(null)

  const startHref = user ? '/dashboard' : '/login?mode=signup'
  const startText = user ? 'Open dashboard' : 'Get started'

  // Scroll detection for shadow (after 8px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)

      // Scroll-spy for active section
      const sections = ['how-it-works', 'family-care', 'our-approach']
      const scrollPos = window.scrollY + 120

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

  // Body scroll lock & Esc key listener when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileOpen(false)
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
  }, [mobileOpen])

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
          {/* ── Left: Brand Logo Lockup (Color, 36px tall) ── */}
          <Logo variant="lockup" tone="color" height={36} asLink />

          {/* ── Desktop Nav Links (1024px and up) ── */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Main Navigation"
          >
            <a
              href="#how-it-works"
              className={`h-11 inline-flex items-center text-base font-semibold transition-colors duration-150 relative ${
                activeSection === 'how-it-works'
                  ? 'text-[#1F5A32] underline decoration-[#B4530A] decoration-2 underline-offset-[6px]'
                  : 'text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px]'
              }`}
            >
              How it works
            </a>
            <a
              href="#family-care"
              className={`h-11 inline-flex items-center text-base font-semibold transition-colors duration-150 relative ${
                activeSection === 'family-care'
                  ? 'text-[#1F5D3A] underline decoration-[#F59E0B] decoration-2 underline-offset-[6px]'
                  : 'text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px]'
              }`}
            >
              For your family
            </a>
            <a
              href="#our-approach"
              className={`h-11 inline-flex items-center text-base font-semibold transition-colors duration-150 relative ${
                activeSection === 'our-approach'
                  ? 'text-[#1F5D3A] underline decoration-[#F59E0B] decoration-2 underline-offset-[6px]'
                  : 'text-[#1A2E22] hover:text-[#1F5D3A] hover:underline hover:decoration-[#F59E0B] hover:decoration-2 hover:underline-offset-[6px]'
              }`}
            >
              Our approach
            </a>
          </nav>

          {/* ── Desktop Actions: Log In & Get Started ── */}
          <div className="hidden lg:flex items-center gap-6">
            {!user && (
              <Link
                to="/login"
                className="h-11 inline-flex items-center text-base font-semibold text-[#1A2E22] hover:text-[#1F5D3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A] rounded-lg px-2"
              >
                Log in
              </Link>
            )}

            <Link
              to={startHref}
              className="h-11 px-6 rounded-full bg-[#1F5D3A] hover:bg-[#174A2E] active:scale-[0.98] text-white font-semibold text-base inline-flex items-center gap-2 shadow-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A] focus-visible:ring-offset-2"
            >
              <span className="text-white" style={{ color: '#FFFFFF' }}>{startText}</span>
              <ArrowRight size={17} className="text-white" />
            </Link>
          </div>

          {/* ── Mobile/Tablet Hamburger Button (below 1024px) ── */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label="Open Navigation Menu"
            className="lg:hidden w-11 h-11 rounded-xl border border-[rgba(31,93,58,0.3)] bg-white/70 text-[#1F5D3A] flex items-center justify-center hover:bg-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A]"
          >
            <Menu size={22} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* ── Full-Screen Mobile Drawer (below 1024px) ── */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[100] bg-[#F8F6EF] flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Drawer Header with Logo lockup */}
          <div className="flex items-center justify-between pb-6 border-b border-[rgba(31,93,58,0.12)]">
            <Logo variant="lockup" tone="color" height={34} asLink onClick={() => setMobileOpen(false)} />

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close Navigation Menu"
              className="w-11 h-11 rounded-xl border border-[rgba(31,93,58,0.3)] bg-white/70 text-[#1F5D3A] flex items-center justify-center hover:bg-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A]"
            >
              <X size={22} strokeWidth={2.2} />
            </button>
          </div>

          {/* Large Navigation Links */}
          <nav className="flex flex-col gap-6 py-8" aria-label="Mobile Menu Links">
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-bold text-[#1F3A28] hover:text-[#1F5A32] transition-colors"
            >
              How it works
            </a>
            <a
              href="#family-care"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-bold text-[#1F3A28] hover:text-[#1F5A32] transition-colors"
            >
              For your family
            </a>
            <a
              href="#our-approach"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-bold text-[#1F3A28] hover:text-[#1F5A32] transition-colors"
            >
              Our approach
            </a>
          </nav>

          {/* Drawer Actions */}
          <div className="pt-6 border-t border-[rgba(31,90,50,0.12)] flex flex-col gap-4">
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full h-12 rounded-full border border-[rgba(31,90,50,0.25)] bg-white text-[#1F3A28] font-bold text-base flex items-center justify-center hover:bg-[#FAF8F2] transition-colors"
              >
                Log in
              </Link>
            )}

            <Link
              to={startHref}
              onClick={() => setMobileOpen(false)}
              className="w-full h-12 rounded-full bg-[#1F5A32] hover:bg-[#174826] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span className="text-white" style={{ color: '#FFFFFF' }}>{startText}</span>
              <ArrowRight size={18} className="text-white" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
