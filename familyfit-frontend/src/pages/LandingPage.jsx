import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Utensils,
  Heart,
  Sparkles,
  Users,
  Check,
  ArrowRight,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  CookingPot,
  HeartPulse,
  Clock,
  Sparkle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import LandingHero from '../components/landing/LandingHero'
import LandingSoftMealsCTA from '../components/landing/LandingSoftMealsCTA'
import LandingNavbar from '../components/landing/LandingNavbar'

export default function LandingPage() {
  const { user } = useAuth()
  const startHref = user ? '/dashboard' : '/login?mode=signup'

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const yOffset = -76
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 150)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [])

  return (
    <div className="ffx-site bg-[#F8F6EF] text-[#1A2E22] font-sans">
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[#1F5D3A] focus:text-white focus:rounded-lg shadow-lg font-bold text-sm outline-none"
      >
        Skip to main content
      </a>

      <LandingNavbar />

      <main id="main-content">
        {/* ── HERO SECTION ── */}
        <LandingHero />

        {/* ── 1. TRUST & WELLNESS HIGHLIGHTS RIBBON ── */}
        <section
          aria-label="FamilyFit Core Commitments"
          className="relative z-10 w-full bg-[#EFE9DA] border-y border-[#D8D1BD] py-6 sm:py-8 select-none"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:divide-x divide-[#D8D1BD]/80">
              {/* Item 1 */}
              <div className="flex items-center gap-3.5 lg:px-5 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-[#244C27]/10 border border-[#244C27]/20 flex items-center justify-center text-[#244C27] shrink-0 group-hover:scale-105 group-hover:bg-[#244C27] group-hover:text-white transition-all duration-200">
                  <ShieldCheck size={24} strokeWidth={2.2} />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-[18px] font-bold text-[#1E3A20] tracking-tight leading-snug"
                  >
                    100% Allergy Shield
                  </h3>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[16px] font-medium text-[#4F6355] mt-0.5 leading-normal"
                  >
                    Zero ingredient conflict engine
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3.5 lg:px-5 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-[#C86228]/10 border border-[#C86228]/20 flex items-center justify-center text-[#C86228] shrink-0 group-hover:scale-105 group-hover:bg-[#C86228] group-hover:text-white transition-all duration-200">
                  <Utensils size={24} strokeWidth={2.2} />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-[18px] font-bold text-[#1E3A20] tracking-tight leading-snug"
                  >
                    500+ Kerala Recipes
                  </h3>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[16px] font-medium text-[#4F6355] mt-0.5 leading-normal"
                  >
                    Authentic home-cooked nutrition
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3.5 lg:px-5 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-[#244C27]/10 border border-[#244C27]/20 flex items-center justify-center text-[#244C27] shrink-0 group-hover:scale-105 group-hover:bg-[#244C27] group-hover:text-white transition-all duration-200">
                  <Users size={24} strokeWidth={2.2} />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-[18px] font-bold text-[#1E3A20] tracking-tight leading-snug"
                  >
                    Every Age, One Plan
                  </h3>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[16px] font-medium text-[#4F6355] mt-0.5 leading-normal"
                  >
                    Toddlers (1y+) to elders (80y+)
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center gap-3.5 lg:px-5 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-[#B88B2A]/10 border border-[#B88B2A]/20 flex items-center justify-center text-[#B88B2A] shrink-0 group-hover:scale-105 group-hover:bg-[#B88B2A] group-hover:text-white transition-all duration-200">
                  <Sparkles size={24} strokeWidth={2.2} />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-[18px] font-bold text-[#1E3A20] tracking-tight leading-snug"
                  >
                    Dietitian Approved
                  </h3>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[16px] font-medium text-[#4F6355] mt-0.5 leading-normal"
                  >
                    Ayurvedic & clinical balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SECTION 1: HEALTHY ROUTINES, CRAFTED TOGETHER (3 STEPS) ── */}
        <section
          id="how-it-works"
          style={{ scrollMarginTop: '80px' }}
          aria-labelledby="how-it-works-heading"
          className="py-16 sm:py-24 bg-[#FAF7F0] relative overflow-hidden select-none"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
              <div className="max-w-xl">
                <div
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="text-[14px] font-bold tracking-[0.2em] uppercase mb-3 text-left"
                >
                  <span className="text-[#1F5A3A]">HEALTHY </span>
                  <span className="text-[#B5541C]">ROUTINES</span>
                </div>
                <h2
                  id="how-it-works-heading"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                  className="text-[#1F5A3A] tracking-tight"
                >
                  Healthy routines, crafted together.
                </h2>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  lineHeight: 1.6,
                }}
                className="text-[#3D4D42] font-normal leading-relaxed max-w-md"
              >
                Family nutrition can feel like a lot to juggle. FamilyFit harmonizes preferences,
                allergies, and market schedules into one calm, delightful kitchen routine.
              </p>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 Card */}
              <div className="rounded-[24px] bg-white border border-[#E8E2D3] shadow-[0_4px_20px_rgba(31,90,58,0.04)] overflow-hidden flex flex-col h-full">
                {/* 4:3 Aspect Ratio Photo with Overlay Chip */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F0]">
                  <img
                    src="/images/landing/step-family-planning.jpg"
                    alt="Kerala grandmother, mother and child sitting together at dining table planning family meals"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-[#E8E2D3] text-[12px] font-semibold text-[#1F5A2E] shadow-2xs"
                  >
                    Peanut-safe for Ammu
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <span
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[13px] font-bold tracking-[0.2em] text-[#B5541C] uppercase mb-2 block"
                  >
                    STEP 1
                  </span>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-2xl font-bold text-[#1F5A3A] tracking-tight mb-2.5"
                  >
                    Bring your family together
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      lineHeight: 1.6,
                    }}
                    className="text-[#3D4D42] font-normal leading-relaxed"
                  >
                    Add the people you cook for and record their allergies, medical guidelines,
                    and favorite Kerala comfort meals in seconds.
                  </p>
                </div>
              </div>

              {/* Step 2 Card */}
              <div className="rounded-[24px] bg-white border border-[#E8E2D3] shadow-[0_4px_20px_rgba(31,90,58,0.04)] overflow-hidden flex flex-col h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F0]">
                  <img
                    src="/images/landing/step-matta-avial.jpg"
                    alt="Palakkadan matta red rice and fresh vegetable avial meal served on banana leaf"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-[#E8E2D3] text-[12px] font-semibold text-[#1F5A2E] shadow-2xs"
                  >
                    Low salt for Muthassi
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <span
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[13px] font-bold tracking-[0.2em] text-[#B5541C] uppercase mb-2 block"
                  >
                    STEP 2
                  </span>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-2xl font-bold text-[#1F5A3A] tracking-tight mb-2.5"
                  >
                    Find meals that truly fit
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      lineHeight: 1.6,
                    }}
                    className="text-[#3D4D42] font-normal leading-relaxed"
                  >
                    Browse practical, dietitian-tested Kerala recipes that balance everyone's nutrition
                    without needing to cook separate pots.
                  </p>
                </div>
              </div>

              {/* Step 3 Card */}
              <div className="rounded-[24px] bg-white border border-[#E8E2D3] shadow-[0_4px_20px_rgba(31,90,58,0.04)] overflow-hidden flex flex-col h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F0]">
                  <img
                    src="/images/landing/step-market-basket.jpg"
                    alt="Artisanal woven market basket with fresh coconuts, curry leaves, and green bananas"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-[#E8E2D3] text-[12px] font-semibold text-[#1F5A2E] shadow-2xs"
                  >
                    ₹380 saved
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <span
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[13px] font-bold tracking-[0.2em] text-[#B5541C] uppercase mb-2 block"
                  >
                    STEP 3
                  </span>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-2xl font-bold text-[#1F5A3A] tracking-tight mb-2.5"
                  >
                    Make healthy feel simple
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      lineHeight: 1.6,
                    }}
                    className="text-[#3D4D42] font-normal leading-relaxed"
                  >
                    Consolidate all ingredients into one organized supermarket checklist with
                    itemized Rupee budgeting and zero food waste.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. SECTION 2: FOR YOUR FAMILY / KERALA ON YOUR TABLE (PHOTO GALLERY BAND) ── */}
        <section
          id="family-care"
          style={{ scrollMarginTop: '80px' }}
          aria-labelledby="kerala-table-heading"
          className="py-16 sm:py-24 bg-[#FAF7F0] border-y border-[#E8E2D3] relative overflow-hidden select-none"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-left mb-10 sm:mb-12">
              <div
                style={{ fontFamily: 'var(--font-body)' }}
                className="text-[14px] font-bold tracking-[0.2em] uppercase mb-3"
              >
                <span className="text-[#1F5A3A]">EVERY MEAL, </span>
                <span className="text-[#B5541C]">EVERY AGE</span>
              </div>
              <h2
                id="kerala-table-heading"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
                className="text-[#1F5A3A] tracking-tight"
              >
                Kerala on your table
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  lineHeight: 1.6,
                }}
                className="text-[#3D4D42] mt-3 max-w-xl"
              >
                Wholesome, traditional recipes tailored for every family member's health and taste.
              </p>
            </div>

            {/* 4-Column Dish Grid (2-Column on Mobile) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Dish 1: Puttu & Kadala */}
              <div className="flex flex-col">
                <div className="aspect-square w-full rounded-[20px] overflow-hidden border border-[#E8E2D3] shadow-xs bg-[#FAF7F0]">
                  <img
                    src="/images/landing/dish-puttu-kadala.jpg"
                    alt="Authentic Kerala steamed rice puttu with spicy black chickpea kadala curry"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-left">
                  <h4
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="font-bold text-lg text-[#1F5A3A] tracking-tight leading-snug"
                  >
                    Puttu & Kadala Curry
                  </h4>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[14px] font-semibold text-[#B5541C] mt-1"
                  >
                    Toddler friendly
                  </p>
                </div>
              </div>

              {/* Dish 2: Fish Curry */}
              <div className="flex flex-col">
                <div className="aspect-square w-full rounded-[20px] overflow-hidden border border-[#E8E2D3] shadow-xs bg-[#FAF7F0]">
                  <img
                    src="/images/landing/dish-fish-curry.jpg"
                    alt="Traditional Kerala clay-pot fish curry with red matta rice"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-left">
                  <h4
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="font-bold text-lg text-[#1F5A3A] tracking-tight leading-snug"
                  >
                    Clay-Pot Fish Curry
                  </h4>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[14px] font-semibold text-[#B5541C] mt-1"
                  >
                    Heart healthy
                  </p>
                </div>
              </div>

              {/* Dish 3: Idli & Sambar */}
              <div className="flex flex-col">
                <div className="aspect-square w-full rounded-[20px] overflow-hidden border border-[#E8E2D3] shadow-xs bg-[#FAF7F0]">
                  <img
                    src="/images/landing/dish-idli-sambar.jpg"
                    alt="Steamed white idlis with vegetable sambar and fresh coconut chutney"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-left">
                  <h4
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="font-bold text-lg text-[#1F5A3A] tracking-tight leading-snug"
                  >
                    Idli & Sambar
                  </h4>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[14px] font-semibold text-[#B5541C] mt-1"
                  >
                    Low sodium
                  </p>
                </div>
              </div>

              {/* Dish 4: Payasam */}
              <div className="flex flex-col">
                <div className="aspect-square w-full rounded-[20px] overflow-hidden border border-[#E8E2D3] shadow-xs bg-[#FAF7F0]">
                  <img
                    src="/images/landing/dish-payasam.jpg"
                    alt="Traditional Kerala Ada Pradhaman jaggery payasam dessert in bronze uruli"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-left">
                  <h4
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="font-bold text-lg text-[#1F5A3A] tracking-tight leading-snug"
                  >
                    Ada Pradhaman Payasam
                  </h4>
                  <p
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="text-[14px] font-semibold text-[#B5541C] mt-1"
                  >
                    Naturally sweet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. SECTION 3: CUSTOMER REVIEWS ── */}
        <section
          id="reviews"
          aria-labelledby="reviews-heading"
          className="py-20 sm:py-28 bg-[#FAF7F0] select-none"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header (Centered) */}
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div
                style={{ fontFamily: 'var(--font-body)' }}
                className="text-[14px] font-bold tracking-[0.2em] uppercase mb-3"
              >
                <span className="text-[#1F5A3A]">LOVED BY </span>
                <span className="text-[#B5541C]">FAMILIES</span>
              </div>
              <h2
                id="reviews-heading"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
                className="text-[#1F5A3A] tracking-tight"
              >
                Families are eating better, together.
              </h2>

              {/* Rating Summary Banner */}
              <div
                style={{ fontFamily: 'var(--font-body)' }}
                className="mt-4 inline-flex items-center justify-center gap-2.5 text-base sm:text-lg flex-wrap"
              >
                <span className="font-bold text-[#1F5A3A]">4.9 / 5</span>
                <div className="flex items-center gap-1 text-[#B5541C]" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((starIdx) => (
                    <svg key={starIdx} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[#4F6355] font-normal">from 1,200+ families</span>
              </div>
            </div>

            {/* 3 Review Cards (Equal Height, Middle Raised Deep Green Accent) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {/* Review 1 (White Card) */}
              <div className="rounded-[24px] bg-white border border-[#E8E2D3] p-7 sm:p-8 shadow-[0_4px_20px_rgba(31,90,58,0.04)] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#B5541C] mb-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      lineHeight: 1.6,
                    }}
                    className="text-[#2C3E30] font-normal mb-6"
                  >
                    "My son has a peanut allergy and my mother-in-law needs low-salt food.
                    FamilyFit finally lets me cook one meal everyone can eat without stressing over
                    separate pots."
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-[#E8E2D3]/60">
                  <img
                    src="/images/landing/avatar-anjali.jpg"
                    alt="Anjali Menon"
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E8E2D3]"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <h4
                      style={{ fontFamily: 'var(--font-heading)' }}
                      className="font-bold text-[18px] text-[#1F5A3A]"
                    >
                      Anjali Menon
                    </h4>
                    <p
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[14px] text-[#4F6355] font-normal mt-0.5"
                    >
                      Mother of two, Kozhikode
                    </p>
                  </div>
                </div>
              </div>

              {/* Review 2 (Middle Raised Deep Green Accent Card) */}
              <div className="rounded-[24px] bg-[#1F5A2E] border border-[#2B6E3F]/40 p-7 sm:p-8 shadow-[0_12px_32px_rgba(31,90,46,0.18)] md:-translate-y-2 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#F59E0B] mb-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      lineHeight: 1.6,
                    }}
                    className="text-white/95 font-normal mb-6"
                  >
                    "Balancing toddler meals and diabetes-safe food for my father used to mean three
                    separate preparations. Now our whole household shares the same Kerala Sadhya
                    with total peace of mind."
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-white/20">
                  <img
                    src="/images/landing/avatar-rahul.jpg"
                    alt="Rahul Varma"
                    className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white/40"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <h4
                      style={{ fontFamily: 'var(--font-heading)' }}
                      className="font-bold text-[18px] text-white"
                    >
                      Rahul Varma
                    </h4>
                    <p
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[14px] text-[#A9CBA1] font-normal mt-0.5"
                    >
                      Father of three, Kochi
                    </p>
                  </div>
                </div>
              </div>

              {/* Review 3 (White Card) */}
              <div className="rounded-[24px] bg-white border border-[#E8E2D3] p-7 sm:p-8 shadow-[0_4px_20px_rgba(31,90,58,0.04)] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#B5541C] mb-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '18px',
                      lineHeight: 1.6,
                    }}
                    className="text-[#2C3E30] font-normal mb-6"
                  >
                    "The weekly supermarket grocery list with exact Palakkad market prices saves us
                    ₹1,500 every month, and we haven't thrown away wilted vegetables or expired
                    spices once."
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-[#E8E2D3]/60">
                  <img
                    src="/images/landing/avatar-deepa.jpg"
                    alt="Deepa Nambiar"
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E8E2D3]"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <h4
                      style={{ fontFamily: 'var(--font-heading)' }}
                      className="font-bold text-[18px] text-[#1F5A3A]"
                    >
                      Deepa Nambiar
                    </h4>
                    <p
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="text-[14px] text-[#4F6355] font-normal mt-0.5"
                    >
                      Home chef & caregiver, Thrissur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. FINAL SOFT MEALS CTA ── */}
        <LandingSoftMealsCTA />
      </main>

      <Footer />
    </div>
  )
}
