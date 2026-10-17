import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, ShieldCheck, Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LandingFinalCTA() {
  const { user } = useAuth()

  return (
    <section className="py-20 md:py-24 bg-[#3F5A3A] text-white relative overflow-hidden">
      {/* Subtle organic watermark elements */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6BBF4E 0%, transparent 70%)',
        }}
      />
      <div 
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D4EDC9] text-xs font-bold uppercase tracking-wider">
          <Leaf size={14} />
          <span>Join the Kerala Family Wellness Movement</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-['Plus_Jakarta_Sans']">
          Start eating healthier together.
        </h2>

        <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
          Create customized meal plans, eliminate allergy stress, and prepare balanced Kerala meals your entire family loves.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 min-h-[52px] rounded-full bg-white text-[#3F5A3A] hover:bg-[#F6F2EA] font-extrabold text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-8 min-h-[52px] rounded-full bg-[#6BBF4E] hover:bg-[#5EAC43] text-[#1F2A24] font-extrabold text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Sign up free</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-7 min-h-[52px] rounded-full border border-white/40 hover:bg-white/10 text-white font-bold text-base transition-all"
              >
                <span>Log in to your account</span>
              </Link>
            </>
          )}
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#6BBF4E]" /> Free plan available
          </span>
          <span className="flex items-center gap-1.5">
            <Heart size={14} className="text-[#6BBF4E]" /> Built with love for Kerala
          </span>
        </div>
      </div>
    </section>
  )
}
