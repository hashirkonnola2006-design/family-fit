import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Dr. Lakshmi Menon',
    location: 'Kochi, Kerala',
    role: 'Pediatrician & Mother of 2',
    quote: 'Finally an app that respects our traditional Red Matta and Thorans rather than forcing Western quinoa salads. The allergy shield gives me total peace of mind for my son.',
  },
  {
    name: 'Rajesh & Priya Varma',
    location: 'Thrissur, Kerala',
    role: 'Multi-Generational Household',
    quote: 'My father needed low-sodium Kerala kanji for his blood pressure, while the kids wanted flavorful food. FamilyFit generated one combined grocery list and meal plan that suited all 5 of us.',
  },
  {
    name: 'Harish Nair',
    location: 'Kozhikode, Kerala',
    role: 'Software Architect',
    quote: 'Lost 6 kilograms in 3 months just by following the Matta portion guidelines and the 100-step Shatapadi walk routine. Realistic, delicious, and easy to stick with.',
  },
]

export default function LandingTestimonials() {
  return (
    <section id="reviews" className="py-20 md:py-28 relative" style={{ backgroundColor: '#F6F2EA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F5A3A]">
            Trusted by 12,000+ Households
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A24] mt-2 font-['Plus_Jakarta_Sans']">
            Stories From Kerala Kitchens
          </h2>
          <p className="text-sm sm:text-base text-[#6B7A70] mt-3">
            Real families sharing how traditional culinary habits transformed their daily health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#E2DBD0] p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#F59E0B]">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={15} fill="#F59E0B" />
                  ))}
                </div>

                <p className="text-sm text-[#1F2A24] leading-relaxed italic">
                  “{t.quote}”
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EDE8DE]">
                <div className="font-bold text-sm text-[#1F2A24] font-['Plus_Jakarta_Sans']">
                  {t.name}
                </div>
                <div className="text-xs text-[#6B7A70]">
                  {t.role} • {t.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
