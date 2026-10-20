import { UserPlus, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Add your family',
    description:
      'Create profiles for each household member with their age, dietary targets, and any food allergies (nuts, lactose, seafood, etc.).',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'Get personalized plans',
    description:
      'Our engine balances calories, macros, and Ayurvedic food principles into breakfast, lunch, and dinner plans everyone can enjoy together.',
  },
  {
    num: '03',
    icon: ShoppingBag,
    title: 'Shop smart & cook',
    description:
      'Get an auto-generated grocery list formatted for local Kerala supermarkets and markets, with itemized pricing in Rupees.',
  },
]

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-20 md:py-28 bg-[#FAF6EC] border-b-2 border-[#E8DCC4] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#3D5A3A] bg-[#3D5A3A]/10 px-3.5 py-1 rounded-full border border-[#3D5A3A]/20">
            Simple 3-Step Process
          </span>
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-5xl font-black text-[#1F2A1C] mt-3 font-poster tracking-wide"
          >
            How{' '}
            <span className="font-script text-[#3D5A3A] text-4xl sm:text-6xl lowercase font-normal">
              FamilyFit
            </span>{' '}
            Works
          </h2>
          <p className="text-sm sm:text-base text-[#5E6B5A] font-body font-bold mt-3">
            Say goodbye to cooking three different meals every night. Harmonious nutrition for the whole house in three simple steps.
          </p>
        </div>

        {/* 3 Step Cards with Dashed Connectors */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hand-Drawn Desktop Dashed Connecting Arrow SVG */}
          <div className="hidden md:block absolute top-28 left-[22%] right-[22%] h-10 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 600 40" fill="none">
              <path
                d="M 20 20 Q 150 -5 280 20 T 560 20"
                stroke="#E8913A"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>

          {STEPS.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="landing-card-light p-8 flex flex-col justify-between relative z-10 transition-transform duration-300 hover:-translate-y-2 hover:rotate-1 cursor-default group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon in deep green circle */}
                    <div className="w-14 h-14 rounded-2xl bg-[#3D5A3A] border-2 border-[#2B4328] border-b-4 border-b-[#1F331D] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Icon size={26} strokeWidth={2.5} />
                    </div>

                    {/* Big outlined condensed numeral */}
                    <span
                      className="font-poster text-5xl sm:text-6xl text-transparent select-none"
                      style={{
                        WebkitTextStroke: '2px #D8CCA8',
                      }}
                    >
                      {item.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#1F2A1C] mb-2.5 font-body">
                    {item.title}
                  </h3>
                  <p className="text-sm font-bold text-[#5E6B5A] leading-relaxed font-body">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t-2 border-[#FAF6EC] flex items-center gap-1.5 text-xs font-black text-[#3D5A3A] uppercase tracking-wider">
                  <span>Step {item.num} of 03</span>
                  <ArrowRight size={13} strokeWidth={3} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
