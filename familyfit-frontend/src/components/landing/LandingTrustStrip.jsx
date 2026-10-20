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
    <section className="bg-[#F5EBD7] border-b-2 border-[#E8DCC4] py-7 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop 4-column row with thin dividers */}
        <div className="hidden md:grid md:grid-cols-4 divide-x-2 divide-[#E8DCC4]">
          {TRUST_METRICS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex items-center gap-3.5 px-6 group">
                <div className="w-12 h-12 rounded-2xl bg-[#3D5A3A]/10 border-2 border-[#3D5A3A]/15 flex items-center justify-center text-[#3D5A3A] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1F2A1C] uppercase tracking-wide font-body">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-[#5E6B5A] mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Marquee Horizontal Scroll */}
        <div className="md:hidden flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          {TRUST_METRICS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-3 shrink-0 bg-white/60 px-4 py-2.5 rounded-2xl border border-[#E8DCC4]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3D5A3A]/10 flex items-center justify-center text-[#3D5A3A] shrink-0">
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#1F2A1C] uppercase font-body whitespace-nowrap">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-bold text-[#5E6B5A] whitespace-nowrap">
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
