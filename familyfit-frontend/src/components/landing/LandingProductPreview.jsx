import { useState } from 'react'
import { Flame, Clock, Users, ShieldCheck, CheckSquare, Square, IndianRupee, Sparkles } from 'lucide-react'

export default function LandingProductPreview() {
  const [checkedItems, setCheckedItems] = useState([0, 2])

  const toggleItem = (idx) => {
    setCheckedItems(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const GROCERY_ITEMS = [
    { name: 'Palakkadan Red Matta Rice (5kg)', category: 'Grains & Staples', price: 260 },
    { name: 'Fresh Grated Coconut (2 coconuts)', category: 'Produce', price: 70 },
    { name: 'Organic Moringa Leaves (Muringayila)', category: 'Greens', price: 40 },
    { name: 'Dry Ginger (Chukku) & Cumin (Jeera)', category: 'Spices & Herbs', price: 95 },
    { name: 'Cold-Pressed Coconut Oil (1L)', category: 'Oils', price: 320 },
  ]

  return (
    <section id="recipes-preview" className="py-20 md:py-24 relative" style={{ backgroundColor: '#F6F2EA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F5A3A]">
            Interactive Interface Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A24] mt-2 font-['Plus_Jakarta_Sans']">
            Designed for Simplicity and Calm
          </h2>
          <p className="text-sm sm:text-base text-[#6B7A70] mt-3">
            Real-time nutrition balance, allergen conflict protection, and streamlined grocery tracking in a single modern interface.
          </p>
        </div>

        {/* ── STYLIZED BROWSER FRAME ── */}
        <div className="rounded-3xl border border-[#DCD5C8] shadow-2xl overflow-hidden max-w-5xl mx-auto" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Browser Chrome Header */}
          <div className="bg-[#EDE8DE] px-5 py-3.5 border-b border-[#DCD5C8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
            </div>

            <div className="flex items-center justify-center px-4 py-1 rounded-full bg-white/90 border border-[#DCD5C8] text-xs font-medium text-[#6B7A70] w-64 text-center">
              https://familyfit.health/dashboard
            </div>

            <div className="text-xs font-bold text-[#3F5A3A] flex items-center gap-1.5">
              <Sparkles size={13} />
              <span className="hidden sm:inline">Family Sync Active</span>
            </div>
          </div>

          {/* Browser Content Area */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" style={{ backgroundColor: '#FAF7F0' }}>
            {/* Left: Recipe Preview Card */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E2DBD0] p-5 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 bg-[#263724]">
                <img
                  src="/kerala_recipes_hero.png"
                  alt="Kerala Traditional Avial & Red Matta Rice"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#3F5A3A] text-white text-[11px] font-bold">
                  Lunch Special
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#2E7D32] text-[11px] font-bold shadow-sm">
                  94/100 Very Healthy
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#1F2A24]">
                      Traditional Avial &amp; Palakkadan Matta
                    </h3>
                    <p className="text-xs text-[#6B7A70]">
                      Coconut-yogurt vegetable medley rich in prebiotic fiber
                    </p>
                  </div>
                </div>

                {/* Macro row */}
                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#EDE8DE] text-center">
                  <div className="p-2 rounded-lg bg-[#F6F2EA]">
                    <div className="text-[10px] text-[#6B7A70]">Calories</div>
                    <div className="text-xs font-bold text-[#1F2A24]">430 kcal</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F6F2EA]">
                    <div className="text-[10px] text-[#6B7A70]">Protein</div>
                    <div className="text-xs font-bold text-[#3F5A3A]">14g</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F6F2EA]">
                    <div className="text-[10px] text-[#6B7A70]">Carbs</div>
                    <div className="text-xs font-bold text-[#1F2A24]">68g</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F6F2EA]">
                    <div className="text-[10px] text-[#6B7A70]">Prep Time</div>
                    <div className="text-xs font-bold text-[#1F2A24]">25m</div>
                  </div>
                </div>

                {/* Family suitability strip */}
                <div className="p-2.5 rounded-xl bg-[#EAF5E4] text-xs flex items-center justify-between text-[#2D5A27] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={15} /> All 4 family members cleared
                  </span>
                  <span className="text-[11px] opacity-80">Low Glycemic</span>
                </div>
              </div>
            </div>

            {/* Right: Smart Grocery List Card */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E2DBD0] p-5 shadow-sm space-y-4" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DE]">
                <div>
                  <h3 className="text-base font-extrabold text-[#1F2A24]">
                    Smart Grocery List
                  </h3>
                  <p className="text-xs text-[#6B7A70]">
                    Automated weekly meal requirements
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-[#6B7A70]">Estimated Budget</div>
                  <div className="text-sm font-extrabold text-[#3F5A3A]">
                    ₹785.00
                  </div>
                </div>
              </div>

              {/* Grocery checklist items */}
              <div className="space-y-2.5">
                {GROCERY_ITEMS.map((item, idx) => {
                  const isChecked = checkedItems.includes(idx)
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleItem(idx)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#F6F2EA]/60 border-[#DCD5C8] opacity-60'
                          : 'bg-white border-[#E2DBD0] hover:border-[#3F5A3A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isChecked ? (
                          <CheckSquare size={17} className="text-[#3F5A3A]" />
                        ) : (
                          <Square size={17} className="text-[#8D9B91]" />
                        )}
                        <div>
                          <div className={`text-xs font-bold ${isChecked ? 'line-through text-[#8D9B91]' : 'text-[#1F2A24]'}`}>
                            {item.name}
                          </div>
                          <div className="text-[10px] text-[#6B7A70]">
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#1F2A24]">
                        ₹{item.price}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="p-3 rounded-xl bg-[#F6F2EA] flex items-center justify-between text-xs text-[#6B7A70]">
                <span>Progress: {checkedItems.length} of {GROCERY_ITEMS.length} purchased</span>
                <span className="font-bold text-[#3F5A3A]">
                  {Math.round((checkedItems.length / GROCERY_ITEMS.length) * 100)}% complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
