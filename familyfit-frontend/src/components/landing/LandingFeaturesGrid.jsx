import { 
  Users, 
  BookOpen, 
  ShoppingCart, 
  Lightbulb, 
  HeartPulse, 
  ShieldAlert 
} from 'lucide-react'

const FEATURES = [
  {
    icon: Users,
    title: 'Family Health Profiles',
    description: 'Track individual metrics, dietary goals, calorie requirements, and specific medical conditions for every member.',
    badge: 'Multi-member',
  },
  {
    icon: BookOpen,
    title: '500+ Kerala Recipes',
    description: 'Authentic Sadhya curries, breakfast Appam and Puttu, Matta rice specialties, Thorans, and gentle Ayurvedic broths.',
    badge: 'Authentic',
  },
  {
    icon: ShoppingCart,
    title: 'Smart Grocery Budgeting',
    description: 'Consolidates all ingredients needed for your weekly meals into a neat shopping list with real-time Rupee budget estimates.',
    badge: 'Rupee Budget',
  },
  {
    icon: Lightbulb,
    title: 'Daily Digestion & Health Tips',
    description: 'Kerala wellness nuggets on Jeera water, Moringa, curry leaf iron synergy, and post-meal Shatapadi metabolic walks.',
    badge: 'Ayurvedic',
  },
  {
    icon: HeartPulse,
    title: 'Goal-Driven Meal Plans',
    description: 'Specialized dietary tracks for gentle weight management, diabetic glycemic balance, immune strength, and heart longevity.',
    badge: 'Targeted',
  },
  {
    icon: ShieldAlert,
    title: 'Real-Time Allergy Shield',
    description: 'Automatic recipe screening instantly flags nuts, shellfish, dairy, or gluten conflicts before you start cooking.',
    badge: '100% Safe',
  },
]

export default function LandingFeaturesGrid() {
  return (
    <section id="features" className="py-20 border-t border-[#E2DBD0]" style={{ backgroundColor: '#FAF7F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F5A3A]">
            Comprehensive Nutrition Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A24] mt-2 font-['Plus_Jakarta_Sans']">
            Engineered for Real Family Routines
          </h2>
          <p className="text-sm sm:text-base text-[#6B7A70] mt-3">
            Every feature is rooted in traditional South Indian culinary habits while leveraging modern macro and micronutrient precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="rounded-3xl p-7 border border-[#E2DBD0] hover:border-[#3F5A3A]/40 transition-all duration-300 hover:shadow-md group"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5E4] shadow-sm flex items-center justify-center text-[#3F5A3A] group-hover:scale-105 transition-transform">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F6F2EA] text-[#3F5A3A] border border-[#E2DBD0]">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1F2A24] mb-2 font-['Plus_Jakarta_Sans']">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#6B7A70] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
