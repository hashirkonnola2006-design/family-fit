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
      className="bg-[#143F27] text-[#F8F6EF] border-t-2 border-[#1F5D3A] pt-16 pb-12 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Sheet Accent Line: "Small changes. Big health gains." */}
        <div className="pb-10 mb-10 border-b border-white/10 flex flex-col items-center justify-center text-center">
          <div className="relative inline-block">
            <span className="font-['Caveat',cursive] text-2xl sm:text-3xl lg:text-4xl text-[#F8F6EF] font-semibold tracking-wide">
              Small changes. Big health gains.
            </span>
            <svg className="w-full h-2.5 mt-0.5" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
              <path d="M2 5 Q 100 1 198 5" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Logo variant="full" tone="white" height={44} showTagline asLink />

            <p className="text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80 leading-relaxed max-w-xs">
              Wholesome food wisdom and personalized Kerala family nutrition for toddlers to seniors.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#7CB342] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#7CB342] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#7CB342] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#7CB342] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://familyfit.health"
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#7CB342] hover:text-white text-[#F8F6EF] flex items-center justify-center transition-all"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-poster text-base text-[#F8F6EF] tracking-wider uppercase mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-[#7CB342] transition-colors cursor-pointer"
                >
                  Features &amp; Allergy Shield
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('plans')}
                  className="hover:text-[#7CB342] transition-colors cursor-pointer"
                >
                  Curated Health Plans
                </button>
              </li>
              <li>
                <Link to="/recipes" className="hover:text-[#7CB342] transition-colors">
                  500+ Kerala Recipes
                </Link>
              </li>
              <li>
                <Link to="/grocery" className="hover:text-[#7CB342] transition-colors">
                  Smart Grocery Budget
                </Link>
              </li>
              <li>
                <Link to="/tips" className="hover:text-[#7CB342] transition-colors">
                  Daily Ayurvedic Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-poster text-base text-[#F8F6EF] tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80">
              <li>
                <Link to="/about" className="hover:text-[#7CB342] transition-colors">
                  About FamilyFit
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className="hover:text-[#7CB342] transition-colors cursor-pointer"
                >
                  Stories From Kitchens
                </button>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#7CB342] transition-colors">
                  Family Dashboard
                </Link>
              </li>
              <li>
                <span className="text-[#F8F6EF]/50 cursor-default">
                  Careers (Hiring Dietitians)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Trust */}
          <div>
            <h4 className="font-poster text-base text-[#F8F6EF] tracking-wider uppercase mb-4">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-body font-bold text-[#F8F6EF]/80">
              <li>
                <Link to="/privacy" className="hover:text-[#7CB342] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#7CB342] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <span className="text-[#F8F6EF]/60 block leading-relaxed text-xs">
                  Allergen screening assists meal preparation but does not replace professional medical diagnosis.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#F8F6EF]/70">
          <p>© 2026 FamilyFit. Wholesome Kerala Family Nutrition.</p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-[#F8F6EF] hover:text-[#7CB342] font-black cursor-pointer transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </footer>
  )
}
