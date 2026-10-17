import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const PLANS = [
  {
    id: 'weight',
    title: 'For Weight Balance',
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
    title: 'For Immunity & Digestion',
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
    title: 'For Heart & Longevity',
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
    <section id="plans" className="py-20 md:py-28 border-t border-[#E2DBD0]" style={{ backgroundColor: '#FAF7F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F5A3A]">
            Evidence-Based Meal Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A24] mt-2 font-['Plus_Jakarta_Sans']">
            Curated Kerala Health Plans
          </h2>
          <p className="text-sm sm:text-base text-[#6B7A70] mt-3">
            Pre-configured meal structures created by Kerala nutritionists, adaptable for any household calorie goal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl border border-[#E2DBD0] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#243422]">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    {plan.tag}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1F2A24] font-['Plus_Jakarta_Sans']">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-[#6B7A70] mt-1 mb-4">
                    {plan.subtitle}
                  </p>

                  <div className="text-xs font-bold text-[#3F5A3A] pb-3 border-b border-[#E2DBD0]">
                    Target: {plan.calories}
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {plan.highlights.map((item, i) => (
                      <li key={i} className="text-xs text-[#1F2A24] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6BBF4E] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/login?mode=signup"
                  className="w-full h-11 rounded-xl border-1.5 border-[#3F5A3A] text-[#3F5A3A] hover:bg-[#3F5A3A] hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>Select this plan</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
