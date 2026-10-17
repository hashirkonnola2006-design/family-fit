import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles, Flame, Check } from 'lucide-react'
import { Typewriter } from '../ui/typewriter-text'
import { useAuth } from '../../context/AuthContext'

export default function LandingHero() {
  const { user } = useAuth()

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: '128px', paddingBottom: '70px', backgroundColor: '#F6F2EA' }}>
      {/* Background soft ambient gradient & leaf watermark */}
      <div 
        className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6BBF4E 0%, rgba(63,90,58,0) 70%)',
        }}
      />
      <div 
        className="absolute -bottom-20 -left-20 -z-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3F5A3A 0%, rgba(246,242,234,0) 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* ── LEFT: HEADLINE & CTAS ── */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F5A3A]/10 border border-[#3F5A3A]/20 text-[#3F5A3A] text-xs font-bold tracking-wide uppercase">
              <Sparkles size={13} className="text-[#6BBF4E]" />
              <span>Ayurvedic Nutrition • Personalized for Every Age</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#1F2A24] leading-[1.12] font-['Plus_Jakarta_Sans']">
              Kerala’s flavors.{' '}
              <span className="text-[#3F5A3A] block sm:inline">
                Your family’s strength.
              </span>
            </h1>

            {/* Typewriter Rotating Line */}
            <div className="text-xl sm:text-2xl font-bold text-[#6B7A70] flex items-center justify-center lg:justify-start gap-2 h-9">
              <span className="text-[#1F2A24]">Designed for:</span>
              <Typewriter
                texts={[
                  'Healthier breakfasts.',
                  'Allergy-safe dinners.',
                  'Smarter grocery lists.',
                  'Balanced Kerala Matta meals.',
                ]}
                typingSpeed={60}
                deletingSpeed={35}
                delayBetween={2200}
                className="text-[#3F5A3A] underline decoration-[#6BBF4E]/40 underline-offset-4"
                cursorClassName="bg-[#6BBF4E]"
              />
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6B7A70] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Personalized meal plans, recipes, and smart grocery lists, made for every member of your family—from energetic toddlers to grandparents managing blood sugar.
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="ff-btn-primary"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login?mode=signup"
                    className="ff-btn-primary"
                  >
                    <span>Get started free</span>
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/login"
                    className="ff-btn-secondary"
                  >
                    <span>I already have an account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Social proof guarantee tag */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#6B7A70]">
              <span className="flex items-center gap-1.5 font-medium">
                <Check size={15} className="text-[#6BBF4E]" /> Free forever tier
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check size={15} className="text-[#6BBF4E]" /> 100% Allergen-aware
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check size={15} className="text-[#6BBF4E]" /> No credit card needed
              </span>
            </div>
          </div>

          {/* ── RIGHT: HERO IMAGE & FLOATING CARDS ── */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end pt-6 lg:pt-0">
            {/* Main Visual Container */}
            <div className="relative w-full max-w-[480px]">
              <div 
                className="relative rounded-3xl overflow-hidden border-4 border-white aspect-[4/3] bg-[#2E422C]"
                style={{
                  boxShadow: '0 24px 50px -12px rgba(31, 42, 36, 0.22)'
                }}
              >
                <img
                  src="/hero_sadya.png"
                  alt="Kerala family dining over wholesome banana leaf meal"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Card 1: Calorie / Meal Card */}
              <div 
                className="absolute bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#E2DBD0] flex items-center gap-3 z-10 transition-transform hover:scale-105"
                style={{ 
                  top: '-16px', 
                  left: '-16px', 
                  boxShadow: '0 12px 32px rgba(31, 42, 36, 0.12)' 
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F26B3A] shrink-0">
                  <Flame size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-[#1F2A24]">Steamed Puttu</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EAF5E4] text-[#3F5A3A] font-bold">
                      Healthy
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7A70] font-medium">
                    420 kcal • High fiber &amp; gentle digestion
                  </p>
                </div>
              </div>

              {/* Floating Card 2: Safe for Family Shield */}
              <div 
                className="absolute bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#E2DBD0] flex items-center gap-3 z-10 transition-transform hover:scale-105"
                style={{ 
                  bottom: '-16px', 
                  right: '-16px', 
                  boxShadow: '0 12px 32px rgba(31, 42, 36, 0.12)' 
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF5E4] flex items-center justify-center text-[#3F5A3A] shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#1F2A24]">
                    Safe for the whole family
                  </div>
                  <p className="text-xs text-[#6B7A70]">
                    Automated allergen &amp; sodium filter active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
