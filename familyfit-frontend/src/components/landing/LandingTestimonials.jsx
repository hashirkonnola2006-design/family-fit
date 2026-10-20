import { useState, useEffect, useRef } from 'react'
import { Star, Heart } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Dr. Lakshmi Menon',
    location: 'Kochi, Kerala',
    role: 'Pediatrician & Mother of 2',
    initials: 'LM',
    avatarBg: '#58CC02',
    rotation: 'md:-rotate-1',
    quote:
      'Finally an app that respects our traditional Red Matta and Thorans rather than forcing Western quinoa salads. The allergy shield gives me total peace of mind for my son.',
  },
  {
    name: 'Rajesh & Priya Varma',
    location: 'Thrissur, Kerala',
    role: 'Multi-Generational Household',
    initials: 'RV',
    avatarBg: '#FF9600',
    rotation: 'md:rotate-1',
    quote:
      'My father needed low-sodium Kerala kanji for his blood pressure, while the kids wanted flavorful food. FamilyFit generated one combined grocery list and meal plan that suited all 5 of us.',
  },
  {
    name: 'Harish Nair',
    location: 'Kozhikode, Kerala',
    role: 'Software Architect',
    initials: 'HN',
    avatarBg: '#1CB0F6',
    rotation: 'md:-rotate-1',
    quote:
      'Lost 6 kilograms in 3 months just by following the Matta portion guidelines and the 100-step Shatapadi walk routine. Realistic, delicious, and easy to stick with.',
  },
]

export default function LandingTestimonials() {
  const [count, setCount] = useState(0)
  const sectionRef = useRef(null)
  const [hasCounted, setHasCounted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
          setHasCounted(true)
          let start = 0
          const target = 12400
          const duration = 1600
          const stepTime = 25
          const totalSteps = duration / stepTime
          const increment = target / totalSteps

          const timer = setInterval(() => {
            start += increment
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, stepTime)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasCounted])

  return (
    <section
      id="reviews"
      ref={sectionRef}
      aria-labelledby="reviews-heading"
      className="py-20 md:py-28 bg-[#FAF6EC] border-b-2 border-[#E8DCC4] relative overflow-hidden scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8913A]/15 border-2 border-[#E8913A]/30 text-[#E8913A] text-xs font-black uppercase tracking-wider mb-3">
            <Heart size={14} fill="#E8913A" />
            <span>
              {count > 0 ? `${count.toLocaleString()}+` : '12,000+'} Happy Kerala Households
            </span>
          </div>

          <h2
            id="reviews-heading"
            className="text-3xl sm:text-5xl font-black text-[#1F2A1C] mt-2 font-poster tracking-wide"
          >
            Stories From{' '}
            <span className="font-script text-[#3D5A3A] text-4xl sm:text-6xl font-normal lowercase">
              Kerala Kitchens
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#5E6B5A] font-body font-bold mt-3">
            Real families sharing how traditional culinary habits transformed their daily health.
          </p>
        </div>

        {/* 3 Testimonial Cards with Scrapbook Alternating Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`landing-card-light p-8 flex flex-col justify-between ${t.rotation} hover:rotate-0 transition-transform duration-300 shadow-md`}
            >
              <div>
                {/* 5 Warm Orange Stars */}
                <div className="flex items-center gap-1.5 mb-5 text-[#E8913A]">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={18} fill="#E8913A" strokeWidth={1} />
                  ))}
                </div>

                <p className="text-base sm:text-lg text-[#1F2A1C] leading-relaxed font-body font-semibold italic">
                  “{t.quote}”
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-6 mt-6 border-t-2 border-[#FAF6EC] flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 border-2 border-white shadow-xs"
                  style={{ backgroundColor: t.avatarBg }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-black text-base text-[#1F2A1C] font-body">
                    {t.name}
                  </div>
                  <div className="text-xs font-bold text-[#5E6B5A]">
                    {t.role} • {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
