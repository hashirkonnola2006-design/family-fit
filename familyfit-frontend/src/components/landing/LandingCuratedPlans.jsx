import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'

const PLANS = [
  {
    id: 'weight',
    title: 'Weight Balance',
    subtitle: 'High-fiber complex carbs & metabolism nudges',
    image: '/kerala_vegetable_upma.png',
    tag: 'Metabolic Health',
    calories: '1,450 – 1,750 kcal/day',
    highlights: [
      'Red Matta kanji & steamed plantains',
      'Morning cumin & dry ginger chukku water',
      'Steamed idli/appam light evening dinner rule',
    ],
  },
  {
    id: 'immunity',
    title: 'Immunity & Digestion',
    subtitle: 'Antioxidant-dense Kerala spices & superfoods',
    image: '/kerala_vegetable_stew.png',
    tag: 'Ayurvedic Strength',
    calories: '1,600 – 1,900 kcal/day',
    highlights: [
      'Muringayila (Moringa) iron thorans',
      'Turmeric & black pepper golden milk',
      'Fresh curry leaf non-heme iron synergy',
    ],
  },
  {
    id: 'heart',
    title: 'Heart & Longevity',
    subtitle: 'Omega-3 fatty acids, low sodium & potassium-rich',
    image: '/heart_health_salmon_salad.png',
    tag: 'Cardiovascular Care',
    calories: '1,500 – 1,800 kcal/day',
    highlights: [
      'Steamed fish pollichathu with kokum',
      'Potassium-rich tender coconut elaneer',
      'Cold-pressed virgin coconut & olive balance',
    ],
  },
]

export default function LandingCuratedPlans() {
  return (
    <section
      id="plans"
      aria-labelledby="plans-heading"
      className="py-20 md:py-28 bg-[#3D5A3A] text-[#F5EBD7] paper-grain relative border-b-2 border-[#2B4328] scroll-mt-20"
      style={{ backgroundColor: '#3D5A3A' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#F5EBD7] bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
            Evidence-Based Meal Architecture
          </span>
          <h2
            id="plans-heading"
            className="text-3xl sm:text-5xl font-black text-[#F5EBD7] mt-3 font-poster tracking-wide"
          >
            Curated Kerala Health Plans
          </h2>
          <p className="text-sm sm:text-base text-[#F5EBD7]/85 font-body font-bold mt-3">
            Pre-configured meal structures created by Kerala nutritionists, adaptable for any household calorie goal.
          </p>
        </div>

        {/* 3 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="landing-card-forest overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image with slight zoom hover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#243422]">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#F5EBD7] text-xs font-black uppercase tracking-wider">
                    {plan.tag}
                  </div>
                </div>

                {/* Details */}
                <div className="p-7">
                  <h3 className="text-2xl font-black text-[#F5EBD7] font-body">
                    {plan.title}
                  </h3>
                  <p className="text-xs font-bold text-[#F5EBD7]/80 mt-1 mb-4 leading-relaxed font-body">
                    {plan.subtitle}
                  </p>

                  <div className="text-xs font-black text-[#58CC02] pb-3 border-b border-white/15 uppercase tracking-wider">
                    Target: {plan.calories}
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {plan.highlights.map((item, i) => (
                      <li key={i} className="text-xs font-bold text-[#F5EBD7]/90 flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#58CC02]/25 text-[#58CC02] flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-7 pt-0">
                <Link
                  to="/login?mode=signup"
                  className="landing-btn-primary w-full h-12 text-xs uppercase tracking-wider text-center"
                >
                  <span>Select this plan →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
