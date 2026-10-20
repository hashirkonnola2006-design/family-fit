import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Heart, Leaf } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LandingFinalCTA() {
  const { user } = useAuth()

  return (
    <section
      aria-label="Call to action"
      className="py-20 md:py-28 bg-[#3D5A3A] text-[#F5EBD7] paper-grain relative overflow-hidden text-center"
      style={{ backgroundColor: '#3D5A3A' }}
    >
      {/* Decorative botanical circles */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#58CC02]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#E8913A]/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F5EBD7] text-xs font-black uppercase tracking-wider">
          <Leaf size={14} className="text-[#58CC02]" fill="#58CC02" />
          <span>Join the Kerala Family Wellness Movement</span>
        </div>

        {/* Condensed Headline */}
        <h2 className="font-poster text-4xl sm:text-6xl md:text-7xl text-[#F5EBD7] tracking-wide leading-tight">
          Start eating healthier together.
        </h2>

        <p className="font-body text-base sm:text-lg text-[#F5EBD7]/85 max-w-2xl mx-auto leading-relaxed font-bold">
          Create customized meal plans, eliminate allergy stress, and prepare balanced Kerala meals your entire family loves.
        </p>

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="landing-btn-primary px-8 py-4 text-base tracking-wider uppercase shadow-xl w-full sm:w-auto"
            >
              <span>Go to My Dashboard →</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login?mode=signup"
                className="landing-btn-primary px-8 py-4 text-base tracking-wider uppercase shadow-xl w-full sm:w-auto"
              >
                <span>Sign up free →</span>
              </Link>
              <Link
                to="/login"
                className="landing-btn-secondary px-8 py-4 text-base tracking-wider uppercase w-full sm:w-auto"
              >
                <span>Log in to your account</span>
              </Link>
            </>
          )}
        </div>

        {/* Sub-trust text */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#F5EBD7]/75">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#58CC02]" />
            <span>Free plan available</span>
          </span>
          <span className="text-[#F5EBD7]/40">•</span>
          <span className="flex items-center gap-2">
            <Heart size={16} className="text-[#58CC02]" fill="#58CC02" />
            <span>Built with love for Kerala</span>
          </span>
        </div>
      </div>
    </section>
  )
}
