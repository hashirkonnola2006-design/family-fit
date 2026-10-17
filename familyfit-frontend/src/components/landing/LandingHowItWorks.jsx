import { UserPlus, Sparkles, ShoppingBag } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Add your family',
    description: 'Create profiles for each household member with their age, dietary targets, and any food allergies (nuts, lactose, seafood, etc.).',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Get personalized plans',
    description: 'Our engine balances calories, macros, and Ayurvedic food principles into breakfast, lunch, and dinner plans everyone can enjoy together.',
  },
  {
    step: '03',
    icon: ShoppingBag,
    title: 'Shop smart & cook',
    description: 'Get an auto-generated grocery list formatted for local Kerala supermarkets and markets, with itemized pricing in Rupees.',
  },
]

export default function LandingHowItWorks() {
  return (
    <section className="py-20 md:py-24 relative" style={{ backgroundColor: '#F6F2EA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F5A3A]">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A24] mt-2 font-['Plus_Jakarta_Sans']">
            How FamilyFit Works
          </h2>
          <p className="text-sm sm:text-base text-[#6B7A70] mt-3">
            Say goodbye to cooking three different meals every night. Harmonious nutrition for the whole house in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="relative rounded-3xl bg-white p-8 border border-[#E2DBD0] shadow-sm hover:shadow-md transition-all group hover:-translate-y-1"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#3F5A3A]/10 flex items-center justify-center text-[#3F5A3A] group-hover:scale-110 transition-transform">
                    <Icon size={26} />
                  </div>
                  <span className="text-3xl font-black text-[#E2DBD0] font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1F2A24] mb-2 font-['Plus_Jakarta_Sans']">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B7A70] leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
