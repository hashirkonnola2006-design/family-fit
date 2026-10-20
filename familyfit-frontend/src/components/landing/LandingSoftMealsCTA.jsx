import { Link } from 'react-router-dom'
import { Leaf, Heart, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LandingSoftMealsCTA() {
  const { user } = useAuth()
  const startHref = user ? '/dashboard' : '/login?mode=signup'

  return (
    <section
      aria-label="Soft meals, stronger bonds"
      className="relative w-full overflow-hidden select-none"
      style={{
        background: `
          radial-gradient(circle at 18% 25%, rgba(255, 255, 255, 0.5) 0%, transparent 55%),
          radial-gradient(circle at 82% 35%, rgba(210, 224, 196, 0.4) 0%, transparent 50%),
          linear-gradient(135deg, #F6F4E6 0%, #FAF8EF 100%)
        `,
      }}
    >
      {/* ── 1. DECORATIVE TOP-LEFT FOREGROUND BLUR LEAVES (Hidden on mobile for depth-of-field) ── */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute -top-12 -left-8 z-20 pointer-events-none opacity-90"
        style={{ filter: 'blur(7px)' }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-30 -20 C 40 40, 110 90, 190 150 C 145 195, 85 225, 15 245 C -5 190, -15 100, -30 -20 Z"
            fill="#234226"
            opacity="0.9"
          />
          <path
            d="M50 -30 C 120 20, 200 80, 270 170 C 220 205, 160 215, 105 180 C 70 105, 60 30, 50 -30 Z"
            fill="#2E5A33"
            opacity="0.85"
          />
          <path
            d="M-15 70 C 55 120, 135 160, 205 250 C 145 270, 90 260, 45 215 C 10 160, -10 105, -15 70 Z"
            fill="#3B6F40"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* ── 2. DECORATIVE TOP-RIGHT WATERCOLOR SAGE LEAVES (2-3 organic shapes) ── */}
      <div
        aria-hidden="true"
        className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 z-10 pointer-events-none"
      >
        <svg
          width="380"
          height="360"
          viewBox="0 0 380 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[180px] sm:w-[280px] lg:w-[380px] h-auto"
        >
          {/* Organic sage watercolor leaves overlapping */}
          <path
            d="M400 -20 C 335 45, 260 110, 200 200 C 190 140, 225 65, 305 20 C 340 0, 375 -10, 400 -20 Z"
            fill="#A9BC8A"
            fillOpacity="0.65"
          />
          <path
            d="M370 40 C 295 95, 235 170, 180 270 C 160 200, 180 125, 250 70 C 295 40, 335 30, 370 40 Z"
            fill="#C4D1A8"
            fillOpacity="0.6"
          />
          <path
            d="M410 90 C 335 145, 280 220, 225 310 C 235 235, 285 165, 350 120 C 380 100, 400 90, 410 90 Z"
            fill="#98B077"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* ── 3. BOTTOM-RIGHT PALE SAGE ROLLING HILL (Behind text) ── */}
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 pointer-events-none z-0 overflow-hidden w-full h-[65%] lg:h-[85%]"
      >
        <svg
          viewBox="0 0 1440 450"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M 600 450 C 820 380, 1020 260, 1240 180 C 1340 145, 1400 130, 1440 120 L 1440 450 Z"
            fill="#C4D1A8"
            fillOpacity="0.38"
          />
        </svg>
      </div>

      {/* ── 4. MAIN HERO BANNER CONTENT CONTAINER ── */}
      <div className="relative z-10 w-full pt-6 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 xl:gap-6 items-center">
            
            {/* ── LEFT: FOOD PHOTOGRAPH (Stacked on mobile, 55% width on desktop bleeding left) ── */}
            <div className="lg:col-span-7 xl:col-span-7 relative w-full flex justify-center lg:justify-start -ml-0 lg:-ml-12 xl:-ml-16">
              <div
                className="relative w-full max-w-[640px] lg:max-w-none lg:w-[108%] overflow-hidden rounded-2xl lg:rounded-none"
                style={{
                  /* Fades out at the bottom on mobile; fades out to the right on desktop */
                  WebkitMaskImage:
                    'var(--hero-mask, linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0) 100%))',
                  maskImage:
                    'var(--hero-mask, linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.85) 82%, rgba(0,0,0,0) 100%))',
                }}
              >
                <img
                  src="/images/cta-idli-hero.jpg"
                  alt="Overhead Kerala food scene: hand tearing steaming hot soft idlis on banana leaf plate with fresh coconut and tomato chutneys"
                  width={1376}
                  height={768}
                  loading="eager"
                  className="w-full h-auto object-cover select-none transition-transform duration-700 hover:scale-[1.01]"
                />
              </div>
            </div>

            {/* ── RIGHT: TYPOGRAPHY, BUTTON & 3 FEATURE CHIPS ── */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-2 xl:pl-6">
              
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-bold tracking-[0.22em] text-[#2F4A32] uppercase mb-3 sm:mb-4">
                <span className="w-5 sm:w-6 h-[2px] bg-[#2F4A32] inline-block" />
                <span>Real Food. Real Togetherness.</span>
              </div>

              {/* Heading in Outfit bold rounded geometric sans */}
              <h2
                className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[60px] font-extrabold text-[#2F4A32] tracking-tight leading-[1.06] select-none"
                style={{ fontFamily: "'Outfit', var(--font-display)" }}
              >
                Soft meals,
                <br />
                stronger bonds.
              </h2>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-[#55685A] font-medium mt-3.5 sm:mt-4 leading-relaxed max-w-md">
                Good food brings everyone to the table.{' '}
                <br className="hidden sm:inline" />
                Let's make it a healthy habit.
              </p>

              {/* Pill-shaped CTA Button with guaranteed crisp white text */}
              <div className="pt-6 sm:pt-7">
                <Link
                  to={startHref}
                  style={{ color: '#ffffff', backgroundColor: '#2D4F36' }}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full !bg-[#2D4F36] hover:!bg-[#24402F] active:scale-[0.98] !text-white font-bold text-base sm:text-[17px] shadow-[0_4px_16px_rgba(45,79,54,0.22)] hover:shadow-[0_8px_24px_rgba(45,79,54,0.32)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D4F36]"
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

              {/* ── 3 FEATURE CHIPS ROW (Separated by thin vertical dividers on desktop, neat stacked on mobile) ── */}
              <div className="mt-8 sm:mt-10 pt-6 border-t border-[#DDE5D0]/80 w-full flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5 xl:gap-6">
                
                {/* Chip 1: Nutritious Kerala recipes */}
                <div className="w-full sm:w-auto max-w-[260px] sm:max-w-none flex items-center gap-2.5 text-left">
                  <div className="w-10 h-10 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs">
                    <Leaf size={18} strokeWidth={2.2} />
                  </div>
                  <div className="text-xs sm:text-[13px] font-semibold text-[#2F4A32] leading-tight">
                    <span>Nutritious</span>
                    <br />
                    <span className="text-[#55685A] font-medium">Kerala recipes</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-[1px] h-8 bg-[#CBD8BC]" aria-hidden="true" />

                {/* Chip 2: Family focused */}
                <div className="w-full sm:w-auto max-w-[260px] sm:max-w-none flex items-center gap-2.5 text-left">
                  <div className="w-10 h-10 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs">
                    <Heart size={18} strokeWidth={2.2} />
                  </div>
                  <div className="text-xs sm:text-[13px] font-semibold text-[#2F4A32] leading-tight">
                    <span>Family</span>
                    <br />
                    <span className="text-[#55685A] font-medium">focused</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-[1px] h-8 bg-[#CBD8BC]" aria-hidden="true" />

                {/* Chip 3: Smart grocery help */}
                <div className="w-full sm:w-auto max-w-[260px] sm:max-w-none flex items-center gap-2.5 text-left">
                  <div className="w-10 h-10 rounded-full bg-[#E2EBD5] text-[#2F4A32] flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingBag size={18} strokeWidth={2.2} />
                  </div>
                  <div className="text-xs sm:text-[13px] font-semibold text-[#2F4A32] leading-tight">
                    <span>Smart</span>
                    <br />
                    <span className="text-[#55685A] font-medium">grocery help</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── 5. ORGANIC WAVE DIVIDER (Layered: Pale sage behind, Dark Green #2F4A32 in front) ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden z-20"
        style={{
          /* -1px overlap to guarantee zero subpixel gap/seam with footer */
          marginBottom: '-1px',
        }}
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-[65px] sm:h-[95px] lg:h-[125px] block"
        >
          {/* Layer 1: Pale sage wave behind on the right */}
          <path
            d="M 640 120 C 820 120, 980 20, 1220 30 C 1340 36, 1400 15, 1440 10 L 1440 120 Z"
            fill="#C4D1A8"
            fillOpacity="0.65"
          />

          {/* Layer 2: Main Dark Green wave matching Footer background #2F4A32 */}
          <path
            d="M 0 45 C 240 55, 480 82, 720 80 C 960 78, 1140 32, 1320 34 C 1380 35, 1415 40, 1440 42 L 1440 120 L 0 120 Z"
            fill="#2F4A32"
          />
        </svg>
      </div>
    </section>
  )
}
