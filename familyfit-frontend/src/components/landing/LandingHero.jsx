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
          height: 'clamp(400px, min(calc(100dvh - 100px), 56.25vw), 760px)',
          minHeight: '400px',
        }}
      >
        {/* Background Layer: Hero Image fills the section edge to edge */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <picture className="w-full h-full block">
            {/* Desktop (1024px and up): 16:9 hero-desktop */}
            <source
              media="(min-width: 1024px)"
              srcSet="/images/hero-desktop.webp 2400w, /images/hero-desktop-1200.webp 1200w"
              type="image/webp"
              sizes="100vw"
            />
            <source
              media="(min-width: 1024px)"
              srcSet="/images/hero-desktop.png 2400w, /images/hero-desktop-1200.png 1200w"
              type="image/png"
              sizes="100vw"
            />
            {/* Tablet & Medium viewports (640px to 1023px): hero-desktop with right-anchored family */}
            <source
              media="(min-width: 640px)"
              srcSet="/images/hero-desktop-1200.webp 1200w, /images/hero-desktop.webp 2400w"
              type="image/webp"
            />
            <source
              media="(min-width: 640px)"
              srcSet="/images/hero-desktop-1200.png 1200w, /images/hero-desktop.png 2400w"
              type="image/png"
            />
            {/* Mobile (below 640px): 4/5 aspect ratio hero-mobile */}
            <source
              media="(max-width: 639px)"
              srcSet="/images/hero-mobile-800.webp 800w, /images/hero-mobile.webp 1200w"
              type="image/webp"
            />
            <source
              media="(max-width: 639px)"
              srcSet="/images/hero-mobile-800.png 800w, /images/hero-mobile.png 1200w"
              type="image/png"
            />
            <img
              src="/images/hero-desktop.png"
              alt="Smiling Kerala family sharing a healthy meal"
              width="2400"
              height="1350"
              fetchPriority="high"
              loading="eager"
              className="w-full h-full object-cover object-[78%_35%] md:object-[68%_40%] lg:object-[50%_40%] max-sm:object-[50%_bottom] select-none"
            />
          </picture>
        </div>

        {/* Text & Button Column Overlaid Directly INSIDE the Hero over the Cream Area */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-start pointer-events-none"
          style={{
            paddingLeft: 'clamp(16px, 3.5vw, 48px)',
            paddingRight: 'clamp(16px, 3.5vw, 48px)',
            paddingTop: 'clamp(20px, 3.5vw, 44px)',
          }}
        >
          <div className="w-full sm:w-[50%] md:w-[44%] lg:w-[40%] max-w-[320px] sm:max-w-[380px] md:max-w-[440px] pointer-events-auto flex flex-col items-start text-left">
            {/* 1. Eyebrow "FAMILYFIT" (Forest Green + Leaf Green matching brand sheet) */}
            <div className="text-xs sm:text-[13px] lg:text-sm font-bold tracking-[0.25em] uppercase leading-none select-none text-left">
              <span className="text-[#1F5D3A]">FAMILY</span>
              <span className="text-[#7CB342]">FIT</span>
            </div>

            {/* 2. H1 Headline (bigger, prominent in white space) */}
            <h1
              className="text-[#1F5D3A] font-bold tracking-[-0.025em] leading-[1.08] select-none mt-2.5 sm:mt-3 text-left font-['Plus_Jakarta_Sans',sans-serif] max-w-[195px] sm:max-w-none"
              style={{
                fontSize: 'clamp(1.45rem, 3.1vw, 3.15rem)',
              }}
            >
              Good food.
              <br />
              Stronger families.
            </h1>

            {/* 3. Subtitle */}
            <p className="text-[#1A2E22] text-xs sm:text-sm lg:text-base font-normal leading-snug select-none mt-1.5 sm:mt-2 max-w-[240px] sm:max-w-[300px] text-left">
              Simple, balanced meals for every day.
            </p>

            {/* 4. Action Button inside the White Space */}
            <div className="mt-4 sm:mt-5 lg:mt-6">
              <Link
                to={startHref}
                className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-[#1F5D3A] hover:bg-[#174A2E] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A] focus-visible:ring-offset-2 cursor-pointer"
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
