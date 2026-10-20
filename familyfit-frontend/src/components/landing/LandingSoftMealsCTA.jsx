import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function LandingSoftMealsCTA() {
  const { user } = useAuth()
  const startHref = user ? '/dashboard' : '/login?mode=signup'

  return (
    <section
      aria-label="Soft meals, stronger bonds"
      className="relative w-full bg-[#FAF7F0] overflow-hidden py-14 sm:py-18 lg:py-24 border-t border-[#F0EBE1]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Food Visual Container (Isolated plate with transparent blending & natural shadow) */}
          <motion.div
            initial={{ opacity: 0.9, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-start items-center relative"
          >
            <picture className="w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[620px] block">
              <source srcSet="/images/cta-idli-food-isolated.webp" type="image/webp" />
              <img
                src="/images/cta-idli-food-isolated.png"
                alt="Steaming hot soft idlis with tomato and coconut chutneys on banana leaf"
                fetchPriority="high"
                loading="lazy"
                className="w-full h-auto object-contain select-none transition-transform duration-500 hover:scale-[1.02]"
              />
            </picture>
          </motion.div>

          {/* Typography & Action Container */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left lg:pl-2 xl:pl-6">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 text-xs xl:text-sm font-bold tracking-[0.2em] text-[#3D5240] uppercase mb-4">
              <span className="w-6 h-[2px] bg-[#3D5240]" />
              <span>Real Food. Real Togetherness.</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] xl:text-[3.5rem] font-extrabold text-[#1E3A20] tracking-tight leading-[1.12] select-none">
              Soft meals,
              <br />
              stronger bonds.
            </h2>

            {/* Subtitle */}
            <p className="text-base xl:text-lg text-[#3D5240] font-medium mt-4 leading-relaxed max-w-md">
              Good food brings everyone to the table.
              <br />
              Let's make it a healthy habit.
            </p>

            {/* CTA Button */}
            <div className="pt-7 xl:pt-8">
              <Link
                to={startHref}
                style={{ color: '#ffffff', backgroundColor: '#1F5D3A' }}
                className="inline-flex items-center justify-center gap-2 px-8 xl:px-9 py-3.5 xl:py-4 rounded-full hover:bg-[#174A2E] active:scale-[0.98] !text-white font-bold text-base shadow-md hover:shadow-xl transition-all duration-200"
              >
                <span className="!text-white" style={{ color: '#ffffff' }}>
                  {user ? "Open your family dashboard →" : "Start a family plan →"}
                </span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
