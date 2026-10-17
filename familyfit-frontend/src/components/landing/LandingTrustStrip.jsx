import { Utensils, ShieldCheck, Users, IndianRupee } from 'lucide-react'

const TRUST_METRICS = [
  {
    icon: Utensils,
    title: '500+ Kerala Recipes',
    subtitle: 'Dietitian-tested authentic meals',
  },
  {
    icon: ShieldCheck,
    title: 'Allergy-Aware',
    subtitle: 'Zero conflict allergen engine',
  },
  {
    icon: Users,
    title: 'Built for Every Age',
    subtitle: 'Toddlers to senior citizen care',
  },
  {
    icon: IndianRupee,
    title: 'Budget Friendly in Rupees',
    subtitle: 'Calculated local market pricing',
  },
]

export default function LandingTrustStrip() {
  return (
    <section className="py-10 bg-white/80 border-y border-[#E2DBD0]" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {TRUST_METRICS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex items-center gap-3.5 group">
                <div className="w-12 h-12 rounded-2xl bg-[#3F5A3A]/10 flex items-center justify-center text-[#3F5A3A] shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1F2A24] leading-tight font-['Plus_Jakarta_Sans']">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#6B7A70] mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
