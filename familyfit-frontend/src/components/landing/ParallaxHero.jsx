import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ParallaxHero() {
  const { user } = useAuth()

  return (
    <section 
      aria-label="FamilyFit Hero"
      className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex items-end overflow-hidden pt-24"
    >
      {/* ── Background Family Dining Photo ── */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <source
          media="(max-width: 768px)"
          srcSet="/images/hero/frame3-family-mobile.webp"
        />
        <img
          src="/images/hero/frame3-family.webp"
          alt="Kerala family enjoying a healthy traditional Sadhya meal together"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* ── Cinematic Gradients (Top navbar shade + bottom text contrast) ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 25%),
            linear-gradient(to top, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.65) 42%, rgba(0, 0, 0, 0) 75%)
          `
        }}
      />

      {/* ── Hero Text & Action Callout ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-2xl text-left space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
            <ShieldCheck size={15} className="text-[#6BBF4E]" />
            <span>Ayurvedic Nutrition for Every Generation</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Plus_Jakarta_Sans'] leading-[1.14] tracking-tight">
            Start eating healthier together.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl leading-relaxed">
            Personalized Kerala meal plans, balanced nutrition for all ages, and allergen-safe family dining.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <Link
              to={user ? '/dashboard' : '/login?mode=signup'}
              className="h-12 sm:h-14 px-8 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white font-bold text-sm sm:text-base inline-flex items-center gap-2.5 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer border border-[#6BBF4E]/30"
            >
              <span>{user ? 'Go to dashboard' : 'Get started'}</span>
              <ArrowRight size={18} />
            </Link>

            {!user && (
              <Link
                to="/login"
                className="h-12 sm:h-14 px-6 sm:px-7 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base inline-flex items-center backdrop-blur-md border border-white/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                I already have an account
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
