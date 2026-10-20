import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Heart, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LandingSoftMealsCTA() {
  const { user } = useAuth()
  const startHref = user ? '/dashboard' : '/login?mode=signup'

  return (
    <section
      id="our-approach"
      aria-label="Soft meals, stronger bonds"
      className="cta-soft-meals-section relative w-full overflow-x-hidden select-none bg-[#F8F5E9]"
      style={{
        scrollMarginTop: '80px',
        backgroundColor: '#F8F5E9',
      }}
    >
      {/* ── 1. DESKTOP FULL-BLEED ABSOLUTE FOOD IMAGE (Flush with left & top edges of viewport) ── */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute left-0 top-0 h-full w-[56%] xl:w-[58%] pointer-events-none z-0 overflow-hidden"
        style={{
          /* Mask to fade right (70%->100%) and bottom (85%->100%) */
          WebkitMaskImage:
            'linear-gradient(to right, black 70%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 70%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <img
          src="/images/cta-idli-hero.jpg"
          alt="Authentic Kerala breakfast idli with fresh coconut and tomato chutneys on banana leaf plate"
          width={1376}
          height={768}
          loading="lazy"
          className="w-full h-full object-cover object-[left_center] select-none"
          style={{
            mixBlendMode: 'multiply',
          }}
        />
        {/* Subtle gradient overlay in exact hero background color #F8F5E9 on the right edge */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent 65%, #F8F5E9 100%)',
          }}
        />
      </div>

      {/* ── 2. DECORATIVE TOP-RIGHT BRANCH (Sitting above image, behind text) ── */}
      <div
        aria-hidden="true"
        className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 lg:-top-8 lg:-right-8 pointer-events-none z-10"
      >
        <svg
          width="360"
          height="340"
          viewBox="0 0 360 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[170px] sm:w-[240px] lg:w-[340px] h-auto opacity-40 lg:opacity-65"
        >
          {/* Main curved branch stem */}
          <path
            d="M 370 -20 C 310 50, 260 140, 220 280"
            stroke="#5E7E40"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Leaf 1 (Top right) */}
          <g transform="translate(320, 25) rotate(-25)">
            <path
              d="M 0 0 C 35 -16, 75 -12, 105 0 C 75 16, 35 16, 0 0 Z"
              fill="#7E9E56"
            />
            <path d="M 0 0 Q 55 0 100 0" stroke="#4D6B2C" strokeWidth="1.2" />
            <path d="M 30 0 Q 42 -8 50 -10" stroke="#4D6B2C" strokeWidth="0.8" opacity="0.6" />
            <path d="M 55 0 Q 67 -6 75 -8" stroke="#4D6B2C" strokeWidth="0.8" opacity="0.6" />
            <path d="M 35 0 Q 45 8 52 10" stroke="#4D6B2C" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* Leaf 2 */}
          <g transform="translate(285, 75) rotate(-42)">
            <path
              d="M 0 0 C 32 -18, 70 -14, 98 0 C 70 18, 32 18, 0 0 Z"
              fill="#98AE74"
            />
            <path d="M 0 0 Q 50 0 94 0" stroke="#5D7C36" strokeWidth="1.2" />
            <path d="M 28 0 Q 38 -7 48 -9" stroke="#5D7C36" strokeWidth="0.8" opacity="0.6" />
            <path d="M 32 0 Q 42 7 50 9" stroke="#5D7C36" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* Leaf 3 */}
          <g transform="translate(262, 130) rotate(-15)">
            <path
              d="M 0 0 C 36 -17, 80 -14, 110 0 C 80 17, 36 17, 0 0 Z"
              fill="#6F8F4E"
            />
            <path d="M 0 0 Q 55 0 105 0" stroke="#446124" strokeWidth="1.2" />
            <path d="M 30 0 Q 42 -8 52 -10" stroke="#446124" strokeWidth="0.8" opacity="0.6" />
            <path d="M 58 0 Q 70 -7 78 -9" stroke="#446124" strokeWidth="0.8" opacity="0.6" />
            <path d="M 36 0 Q 48 8 56 10" stroke="#446124" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* Leaf 4 */}
          <g transform="translate(240, 185) rotate(-48)">
            <path
              d="M 0 0 C 30 -16, 68 -13, 92 0 C 68 16, 30 16, 0 0 Z"
              fill="#A9BC8A"
            />
            <path d="M 0 0 Q 48 0 88 0" stroke="#688448" strokeWidth="1.2" />
            <path d="M 26 0 Q 35 -6 44 -8" stroke="#688448" strokeWidth="0.8" opacity="0.6" />
            <path d="M 30 0 Q 38 6 46 8" stroke="#688448" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* Leaf 5 */}
          <g transform="translate(230, 235) rotate(-20)">
            <path
              d="M 0 0 C 28 -15, 62 -12, 85 0 C 62 15, 28 15, 0 0 Z"
              fill="#83A25C"
            />
            <path d="M 0 0 Q 42 0 80 0" stroke="#4D6B2C" strokeWidth="1.2" />
            <path d="M 24 0 Q 34 -6 42 -8" stroke="#4D6B2C" strokeWidth="0.8" opacity="0.6" />
            <path d="M 28 0 Q 36 6 44 8" stroke="#4D6B2C" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* Leaf 6 (Tip of branch) */}
          <g transform="translate(220, 275) rotate(-35)">
            <path
              d="M 0 0 C 22 -12, 50 -10, 68 0 C 50 12, 22 12, 0 0 Z"
              fill="#A9BC8A"
            />
            <path d="M 0 0 Q 34 0 64 0" stroke="#5D7C36" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* ── 3. SCATTERED TINY ACCENT LEAVES & SEEDS (Desktop only, sitting above image z-10) ── */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-0 pointer-events-none z-10"
      >
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8%" cy="72%" r="2.5" fill="#2E3C2B" opacity="0.45" />
          <circle cx="11%" cy="80%" r="2" fill="#2E3C2B" opacity="0.4" />
          <circle cx="9%" cy="83%" r="2.8" fill="#2E3C2B" opacity="0.35" />
          <circle cx="48%" cy="18%" r="2.2" fill="#2E3C2B" opacity="0.3" />

          <path
            d="M 20 40 C 32 32, 44 34, 52 40 C 44 46, 32 46, 20 40 Z"
            fill="#8EA868"
            opacity="0.35"
            transform="translate(120, 20) rotate(-15)"
          />
          <path
            d="M 20 40 C 32 32, 44 34, 52 40 C 44 46, 32 46, 20 40 Z"
            fill="#A9BC8A"
            opacity="0.3"
            transform="translate(940, 70) rotate(35)"
          />
        </svg>
      </div>

      {/* ── 4. MOBILE-ONLY TOP FOOD IMAGE (Full width, fading out at bottom) ── */}
      <div
        aria-hidden="true"
        className="block lg:hidden relative w-full h-[280px] sm:h-[360px] overflow-hidden z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
        }}
      >
        <img
          src="/images/cta-idli-hero.jpg"
          alt="Authentic Kerala breakfast idli on banana leaf"
          width={1376}
          height={768}
          loading="lazy"
          className="w-full h-full object-cover object-[left_top] select-none"
          style={{
            mixBlendMode: 'multiply',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 65%, #F8F5E9 100%)',
          }}
        />
      </div>

      {/* ── 5. MAIN CONTENT CONTAINER (Desktop 2-column with left spacer, Mobile centered text) ── */}
      <div className="relative z-10 w-full pt-4 sm:pt-6 lg:pt-16 pb-20 sm:pb-24 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 xl:gap-8 items-center">
            
            {/* Desktop Left Spacer Column: The absolute image occupies this space without being boxed */}
            <div className="hidden lg:block lg:col-span-7 xl:col-span-7 h-full min-h-[460px] pointer-events-none" aria-hidden="true" />

            {/* Right: Typography, CTA Button & 3 Feature Chips */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-4 xl:pl-6">
              
              {/* Eyebrow */}
              <div
                style={{ fontFamily: 'var(--font-body)' }}
                className="flex items-center gap-2.5 text-[14px] font-bold tracking-[0.2em] text-[#2F4A32] uppercase mb-3 sm:mb-4"
              >
                <span className="w-5 sm:w-6 h-[2px] bg-[#2F4A32] inline-block" />
                <span>Real Food. Real Togetherness.</span>
              </div>

              {/* Heading */}
              <h2
                className="font-bold text-[#2F4A32] tracking-tight select-none"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                  lineHeight: 1.08,
                }}
              >
                Soft meals,
                <br />
                stronger bonds.
              </h2>

              {/* Subtext */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  lineHeight: 1.6,
                }}
                className="text-[#3D4D42] font-medium mt-3.5 sm:mt-4 max-w-md text-[17px] sm:text-[18px]"
              >
                Good food brings everyone to the table.{' '}
                <br className="hidden sm:inline" />
                Let's make it a healthy habit.
              </p>

              {/* Pill-shaped CTA Button */}
              <div className="pt-6 sm:pt-7 w-full sm:w-auto flex justify-center lg:justify-start">
                <Link
                  to={startHref}
                  style={{
                    color: '#ffffff',
                    backgroundColor: '#2D4F36',
                    fontFamily: 'var(--font-body)',
                  }}
                  className="group w-full max-w-[340px] sm:w-auto h-[56px] px-8 sm:px-9 rounded-full !bg-[#2D4F36] hover:!bg-[#24402F] active:scale-[0.98] !text-white font-bold text-[17px] sm:text-[18px] inline-flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(45,79,54,0.22)] hover:shadow-[0_8px_24px_rgba(45,79,54,0.32)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D4F36]"
                >
                  <span style={{ color: '#ffffff' }} className="!text-white font-bold">
                    {user ? 'Open your family dashboard' : 'Start a family plan'}
                  </span>
                  <span
                    style={{ color: '#ffffff' }}
                    className="!text-white inline-block transition-transform duration-200 group-hover:translate-x-1 font-sans"
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* ── 3 FEATURE CHIPS ROW ── */}
              <div className="mt-8 sm:mt-10 pt-6 border-t border-[#DDE5D0]/80 w-full">
                
                {/* Mobile Grid Layout (<640px) */}
                <div className="grid sm:hidden grid-cols-3 divide-x divide-[#CBD8BC]/70 text-center items-start">
                  
                  {/* Mobile Chip 1 */}
                  <div className="px-1.5 flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs mb-2">
                      <Leaf size={18} strokeWidth={2.2} />
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[14px] font-semibold text-[#2F4A32] leading-tight"
                    >
                      <span>Nutritious</span>
                      <br />
                      <span className="text-[#4F6355] font-medium text-[13px]">Kerala recipes</span>
                    </div>
                  </div>

                  {/* Mobile Chip 2 */}
                  <div className="px-1.5 flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs mb-2">
                      <Heart size={18} strokeWidth={2.2} />
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[14px] font-semibold text-[#2F4A32] leading-tight"
                    >
                      <span>Family</span>
                      <br />
                      <span className="text-[#4F6355] font-medium text-[13px]">focused</span>
                    </div>
                  </div>

                  {/* Mobile Chip 3 */}
                  <div className="px-1.5 flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs mb-2">
                      <ShoppingBag size={18} strokeWidth={2.2} />
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[14px] font-semibold text-[#2F4A32] leading-tight"
                    >
                      <span>Smart</span>
                      <br />
                      <span className="text-[#4F6355] font-medium text-[13px]">grocery help</span>
                    </div>
                  </div>
                </div>

                {/* Tablet & Desktop Horizontal Row (>=640px) */}
                <div className="hidden sm:flex items-center justify-center lg:justify-start gap-5 xl:gap-6">
                  
                  {/* Desktop Chip 1 */}
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-11 h-11 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs">
                      <Leaf size={19} strokeWidth={2.2} />
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[15px] xl:text-[16px] font-semibold text-[#2F4A32] leading-tight"
                    >
                      <span>Nutritious</span>
                      <br />
                      <span className="text-[#4F6355] font-medium text-[14px] xl:text-[15px]">Kerala recipes</span>
                    </div>
                  </div>

                  <div className="w-[1px] h-9 bg-[#CBD8BC]" aria-hidden="true" />

                  {/* Desktop Chip 2 */}
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-11 h-11 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs">
                      <Heart size={19} strokeWidth={2.2} />
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[15px] xl:text-[16px] font-semibold text-[#2F4A32] leading-tight"
                    >
                      <span>Family</span>
                      <br />
                      <span className="text-[#4F6355] font-medium text-[14px] xl:text-[15px]">focused</span>
                    </div>
                  </div>

                  <div className="w-[1px] h-9 bg-[#CBD8BC]" aria-hidden="true" />

                  {/* Desktop Chip 3 */}
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-11 h-11 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs">
                      <ShoppingBag size={19} strokeWidth={2.2} />
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[15px] xl:text-[16px] font-semibold text-[#2F4A32] leading-tight"
                    >
                      <span>Smart</span>
                      <br />
                      <span className="text-[#4F6355] font-medium text-[14px] xl:text-[15px]">grocery help</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── 6. ORGANIC 2-LAYER WAVE DIVIDER INTO FOOTER (Pale sage behind #DCE5C4, Dark green #2F4A32 in front) ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden z-20"
        style={{
          marginBottom: '-1px',
        }}
      >
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-[52px] sm:h-[75px] lg:h-[105px] block"
        >
          {/* Layer 1: Pale sage wave behind on the right */}
          <path
            d="M 620 100 C 800 100, 960 16, 1200 24 C 1320 28, 1390 12, 1440 8 L 1440 100 Z"
            fill="#DCE5C4"
            fillOpacity="0.8"
          />

          {/* Layer 2: Main Dark Green wave matching Footer background #2F4A32 */}
          <path
            d="M 0 38 C 240 46, 480 68, 720 66 C 960 64, 1140 26, 1320 28 C 1380 29, 1415 33, 1440 35 L 1440 100 L 0 100 Z"
            fill="#2F4A32"
          />
        </svg>
      </div>

      {/* Narrow-screen layout styles for screens <360px */}
      <style>{`
        @media (max-width: 359px) {
          .cta-soft-meals-section .grid-cols-3 {
            display: flex !important;
            flex-direction: column !important;
            gap: 14px !important;
            align-items: center !important;
          }
          .cta-soft-meals-section .grid-cols-3 > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(203, 216, 188, 0.6) !important;
            padding-bottom: 10px !important;
            width: 100% !important;
          }
          .cta-soft-meals-section .grid-cols-3 > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  )
}
