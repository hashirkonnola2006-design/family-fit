import {
  Users,
  BookOpen,
  ShoppingCart,
  Lightbulb,
  HeartPulse,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'

const FEATURES = [
  {
    id: 'profiles',
    icon: Users,
    title: 'Family Health Profiles',
    description:
      'Track individual metrics, dietary goals, calorie requirements, and specific medical conditions for every member.',
    badge: 'Multi-member',
    color: '#58CC02',
    bgLight: '#58CC02/15',
    isEmphasized: false,
  },
  {
    id: 'recipes',
    icon: BookOpen,
    title: '500+ Kerala Recipes',
    description:
      'Authentic Sadhya curries, breakfast Appam and Puttu, Matta rice specialties, Thorans, and gentle Ayurvedic broths.',
    badge: 'Authentic',
    color: '#FF9600',
    bgLight: '#FF9600/15',
    isEmphasized: false,
  },
  {
    id: 'budget',
    icon: ShoppingCart,
    title: 'Smart Grocery Budgeting',
    description:
      'Consolidates all ingredients needed for your weekly meals into a neat shopping list with real-time Rupee budget estimates.',
    badge: 'Rupee Budget',
    color: '#1CB0F6',
    bgLight: '#1CB0F6/15',
    isEmphasized: false,
  },
  {
    id: 'tips',
    icon: Lightbulb,
    title: 'Daily Digestion & Health Tips',
    description:
      'Kerala wellness nuggets on Jeera water, Moringa, curry leaf iron synergy, and post-meal Shatapadi metabolic walks.',
    badge: 'Ayurvedic',
    color: '#CE82FF',
    bgLight: '#CE82FF/15',
    isEmphasized: false,
  },
  {
    id: 'goals',
    icon: HeartPulse,
    title: 'Goal-Driven Meal Plans',
    description:
      'Specialized dietary tracks for gentle weight management, diabetic glycemic balance, immune strength, and heart longevity.',
    badge: 'Targeted',
    color: '#FFC800',
    bgLight: '#FFC800/20',
    isEmphasized: false,
  },
  {
    id: 'allergy',
    icon: ShieldAlert,
    title: 'Real-Time Allergy Shield',
    description:
      'Automatic recipe screening instantly flags nuts, shellfish, dairy, or gluten conflicts before you start cooking.',
    badge: '100% Safe',
    color: '#58CC02',
    bgLight: '#58CC02',
    isEmphasized: true, // Visually emphasized green-filled card
  },
]

export default function LandingFeaturesGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 md:py-28 bg-[#F5EBD7] border-b-2 border-[#E8DCC4] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#3D5A3A] bg-[#3D5A3A]/10 px-3.5 py-1 rounded-full border border-[#3D5A3A]/20">
            Comprehensive Nutrition Suite
          </span>
          <h2
            id="features-heading"
            className="text-3xl sm:text-5xl font-black text-[#1F2A1C] mt-3 font-poster tracking-wide"
          >
            Engineered for Real Family Routines
          </h2>
          <p className="text-sm sm:text-base text-[#5E6B5A] font-body font-bold mt-3">
            Every feature is rooted in traditional South Indian culinary habits while leveraging modern macro and micronutrient precision.
          </p>
        </div>

        {/* 3x2 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon

            if (feat.isEmphasized) {
              return (
                <div
                  key={feat.id}
                  className="landing-card-forest p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl"
                  style={{ backgroundColor: '#2C4329' }}
                >
                  {/* Subtle decorative glow */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#58CC02]/20 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-13 h-13 rounded-2xl bg-[#58CC02] border-2 border-[#58A700] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Icon size={24} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-[#58CC02] text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Sparkles size={12} fill="#ffffff" />
                        <span>{feat.badge}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#F5EBD7] mb-2 font-body">
                      {feat.title}
                    </h3>
                    <p className="text-sm font-bold text-[#F5EBD7]/85 leading-relaxed font-body">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/20 flex items-center gap-2 text-xs font-black text-[#58CC02] uppercase tracking-wider">
                    <span>Active Safety Engine</span>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={feat.id}
                className="landing-card-light p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon in colored rounded square */}
                    <div
                      className="w-13 h-13 rounded-2xl border-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `${feat.color}18`,
                        borderColor: `${feat.color}40`,
                        color: feat.color,
                      }}
                    >
                      <Icon size={24} strokeWidth={2.5} />
                    </div>

                    {/* Pill Badge */}
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${feat.color}15`,
                        borderColor: `${feat.color}35`,
                        color: feat.color === '#FFC800' ? '#B88B00' : feat.color,
                      }}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#1F2A1C] mb-2 font-body">
                    {feat.title}
                  </h3>
                  <p className="text-sm font-bold text-[#5E6B5A] leading-relaxed font-body">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t-2 border-[#FAF6EC] flex items-center gap-2 text-xs font-black text-[#5E6B5A] uppercase tracking-wider">
                  <span>Included in plan</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
