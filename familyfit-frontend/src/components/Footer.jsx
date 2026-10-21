import { Link, useNavigate } from 'react-router-dom'
import { Leaf, ArrowUp, Globe } from 'lucide-react'
import { Logo } from './brand/Logo'

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
)

export default function Footer() {
  const navigate = useNavigate()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
  }

  return (
    <footer
      aria-label="Footer"
      className="text-[#F8F6EF] pt-8 sm:pt-10 pb-28 sm:pb-12 select-none relative z-10"
      style={{
        background: 'linear-gradient(180deg, #2F4A32 0%, #24402F 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── BRAND TAGLINE UNDER WAVE: LIME LEAF + CAVEAT HANDWRITTEN + LIME BRUSH WAVY UNDERLINE ── */}
        <div className="pb-6 sm:pb-12 mb-6 sm:mb-10 border-b border-white/10 flex flex-col items-center justify-center text-center">
          
          {/* Lime leaf icon flanked by two thin horizontal lines */}
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 sm:w-16 h-[1px] bg-white/20" aria-hidden="true" />
            <div className="w-7 h-7 rounded-full bg-[#8DB445]/15 flex items-center justify-center text-[#8DB445]">
              <Leaf size={16} strokeWidth={2.4} className="rotate-12" />
            </div>
            <div className="w-10 sm:w-16 h-[1px] bg-white/20" aria-hidden="true" />
          </div>

          {/* Handwritten Tagline with -2deg tilt & lime wavy underline */}
          <div className="relative inline-block -rotate-2 transform transition-transform hover:rotate-0 duration-300">
            <span
              className="text-2xl sm:text-3xl lg:text-[34px] text-white font-semibold tracking-wide drop-shadow-xs"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Small changes. Big health gains.
            </span>
            
            {/* Hand-drawn lime green wavy underline SVG */}
            <svg
              className="w-full h-3 sm:h-3.5 mt-0.5"
              viewBox="0 0 240 12"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M4 7 C 45 3, 85 9, 125 5 C 165 2, 205 8, 236 6"
                stroke="#8DB445"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* ── RESPONSIVE COLUMNS GRID: 2-Cols on Mobile, 2 on Tablet, 4 on Desktop ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-white/15">
          {/* Column 1: Brand & Tagline (Full width on mobile) */}
          <div className="col-span-2 lg:col-span-1 space-y-3 sm:space-y-4">
            <Logo variant="full" tone="white" height={42} showTagline asLink />

            <p className="text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80 leading-relaxed max-w-sm">
              Wholesome food wisdom and personalized Kerala family nutrition for toddlers to seniors.
            </p>

            <div className="flex items-center gap-2 pt-1 sm:pt-2 flex-wrap">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-[#8DB445] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-[#8DB445] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-[#8DB445] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-[#8DB445] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://familyfit.health"
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-[#8DB445] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Product (Left column on mobile) */}
          <div className="col-span-1">
            <h4 className="font-poster text-xs sm:text-base text-[#F8F6EF] tracking-wider uppercase mb-3 sm:mb-4">
              Product
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-[#8DB445] transition-colors cursor-pointer text-left"
                >
                  Features &amp; Allergy Shield
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('plans')}
                  className="hover:text-[#8DB445] transition-colors cursor-pointer text-left"
                >
                  Curated Health Plans
                </button>
              </li>
              <li>
                <Link to="/recipes" className="hover:text-[#8DB445] transition-colors">
                  500+ Kerala Recipes
                </Link>
              </li>
              <li>
                <Link to="/grocery" className="hover:text-[#8DB445] transition-colors">
                  Smart Grocery Budget
                </Link>
              </li>
              <li>
                <Link to="/tips" className="hover:text-[#8DB445] transition-colors">
                  Daily Ayurvedic Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (Right column on mobile) */}
          <div className="col-span-1">
            <h4 className="font-poster text-xs sm:text-base text-[#F8F6EF] tracking-wider uppercase mb-3 sm:mb-4">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80">
              <li>
                <Link to="/about" className="hover:text-[#8DB445] transition-colors">
                  About FamilyFit
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className="hover:text-[#8DB445] transition-colors cursor-pointer text-left"
                >
                  Stories From Kitchens
                </button>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#8DB445] transition-colors">
                  Family Dashboard
                </Link>
              </li>
              <li>
                <span className="text-[#F8F6EF]/50 cursor-default">
                  Careers (Hiring)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Trust (Span 2 on mobile with clean border) */}
          <div className="col-span-2 lg:col-span-1 pt-3 sm:pt-0 border-t border-white/10 sm:border-t-0">
            <h4 className="font-poster text-xs sm:text-base text-[#F8F6EF] tracking-wider uppercase mb-2 sm:mb-4">
              Legal &amp; Trust
            </h4>
            <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80">
              <div className="flex items-center gap-3 sm:block sm:space-y-2.5 flex-wrap">
                <Link to="/privacy" className="hover:text-[#8DB445] transition-colors">
                  Privacy Policy
                </Link>
                <span className="sm:hidden text-white/30">•</span>
                <Link to="/terms" className="hover:text-[#8DB445] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </div>
              <p className="text-[#F8F6EF]/60 block leading-relaxed text-[11px] sm:text-xs pt-1 sm:pt-0 max-w-sm">
                Allergen screening assists meal preparation but does not replace professional medical diagnosis.
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-bold text-[#F8F6EF]/70 text-center sm:text-left">
          <p>© {new Date().getFullYear()} FamilyFit. Wholesome Kerala Family Nutrition.</p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-[#F8F6EF] hover:text-[#8DB445] font-black cursor-pointer transition-colors py-1.5 px-3 rounded-full bg-white/5 sm:bg-transparent"
          >
            <span>Back to top</span>
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </footer>
  )
}
