import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function LandingHero() {
  const { user } = useAuth()
  const startHref = user ? '/dashboard' : '/login?mode=signup'
  const ctaText = user ? "Go to your family's plan" : "Build your family's plan"

  // Subtle entrance animation variants (disabled gracefully if user prefers reduced motion)
  const fadeUpVariant = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.25, 1, 0.5, 1] },
  })

  return (
    <section
      aria-label="FamilyFit Hero — Good food. Stronger families."
      className="relative w-full bg-[#F7F5EE] overflow-hidden select-none"
    >
      {/* ── UNIFIED HERO: Edge-to-Edge Image with Text Overlaid Directly as Part of the Hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: 'clamp(520px, min(calc(100dvh - 80px), 64vw), 800px)',
          height: 'clamp(520px, min(calc(100dvh - 80px), 64vw), 800px)',
        }}
      >
        {/* Background Layer: Hero Image fills the section edge to edge */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[#2D4F36]">
          <picture className="w-full h-full block">
            {/* Mobile (below 640px): 4/5 aspect ratio hero-mobile */}
            <source
              media="(max-width: 639px)"
              srcSet="/images/hero-mobile-800.webp 800w, /images/hero-mobile.webp 1200w"
              type="image/webp"
              sizes="100vw"
            />
            {/* Desktop and Tablet: 16:9 ultra-high resolution responsive srcset */}
            <source
              type="image/webp"
              srcSet="/images/hero-800.webp 800w, /images/hero-1280.webp 1280w, /images/hero-1920.webp 1920w, /images/hero-2560.webp 2560w"
              sizes="100vw"
            />
            <img
              src="/images/hero-2560.jpg"
              srcSet="/images/hero-800.jpg 800w, /images/hero-1280.jpg 1280w, /images/hero-1920.jpg 1920w, /images/hero-2560.jpg 2560w"
              sizes="100vw"
              alt="Smiling Kerala family sharing a healthy meal"
              width="2560"
              height="1428"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-[84%_35%] md:object-[76%_40%] lg:object-[62%_40%] max-sm:object-[86%_bottom] select-none"
              style={{
                imageRendering: 'auto',
              }}
            />
          </picture>
        </div>

        {/* Text & Button Column Overlaid Directly INSIDE the Hero over the Cream Area */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-start pointer-events-none"
          style={{
            paddingLeft: 'clamp(20px, 4.5vw, 64px)',
            paddingRight: 'clamp(20px, 4.5vw, 64px)',
            paddingTop: 'clamp(24px, 4.5vw, 60px)',
            paddingBottom: 'clamp(20px, 4vw, 56px)',
          }}
        >
          <div className="w-full sm:w-[52%] md:w-[48%] lg:w-[45%] max-w-[280px] sm:max-w-[560px] pointer-events-auto flex flex-col items-start text-left">
            {/* 1. Eyebrow "FAMILYFIT" (14-15px, letter-spacing 0.2em, font-body) */}
            <div
              className="font-bold uppercase leading-none select-none text-left"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                letterSpacing: '0.2em',
              }}
            >
              <span className="text-[#1F5D3A]">FAMILY</span>
              <span className="text-[#7CB342]">FIT</span>
            </div>

            {/* 2. H1 Headline (clamp(~2.5rem on mobile to 5.5rem on desktop), weight 700, line-height 1.05, letter-spacing -0.01em) */}
            <h1
              className="text-[#1F5D3A] font-bold select-none mt-2.5 sm:mt-4 text-left"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 5.2vw, 5.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              Good food.
              <br />
              <span className="sm:inline block">Stronger </span>
              <span className="sm:inline block">families.</span>
            </h1>

            {/* 3. Subtitle (clamp(1.125rem, 1.6vw, 1.5rem), font-body, line-height 1.5) */}
            <p
              className="text-[#1A2E22] font-normal select-none mt-2.5 sm:mt-4 max-w-[200px] sm:max-w-[460px] text-left"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.125rem, 1.6vw, 1.5rem)',
                lineHeight: 1.45,
              }}
            >
              Simple, balanced meals
              <br className="sm:hidden" /> for every day.
            </p>

            {/* 4. Action Button (18px text, padding 16px 32px, pill shape, font-body) */}
            <div className="mt-4 sm:mt-7 lg:mt-8">
              <Link
                to={startHref}
                className="rounded-full bg-[#1F5D3A] hover:bg-[#174A2E] active:scale-[0.98] text-white font-semibold inline-flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A] focus-visible:ring-offset-2 cursor-pointer text-center"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  padding: 'clamp(14px, 1.4vw, 16px) clamp(24px, 2.5vw, 32px)',
                  borderRadius: '9999px',
                  lineHeight: 1.2,
                }}
              >
                <span className="text-white" style={{ color: '#FFFFFF' }}>{ctaText}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
