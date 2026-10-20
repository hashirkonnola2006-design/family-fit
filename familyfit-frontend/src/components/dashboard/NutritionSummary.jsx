import { Droplet, Plus, Minus, Flame, Activity } from 'lucide-react'

export default function NutritionSummary({
  mealPlan = {},
  selectedMember,
  waterGlasses = 5,
  onUpdateWater,
}) {
  // Target calories based on member or family default
  const targetCalories = selectedMember?.calorieTarget || 1850

  // Calculate consumed calories from eaten dishes
  const mealsList = Object.values(mealPlan).filter(Boolean)
  const consumedCalories = mealsList
    .filter(m => m.eaten)
    .reduce((sum, m) => sum + (m.kcal || 0), 0)

  const plannedTotalCalories = mealsList.reduce((sum, m) => sum + (m.kcal || 0), 0)
  const remainingCalories = Math.max(0, targetCalories - consumedCalories)
  const caloriePercent = Math.min(100, Math.round((consumedCalories / targetCalories) * 100))

  // Macros targets (typical balanced Kerala Matta distribution: 55% carb, 20% protein, 25% fat)
  const targetProtein = Math.round((targetCalories * 0.20) / 4) // grams
  const targetCarbs   = Math.round((targetCalories * 0.55) / 4)
  const targetFat     = Math.round((targetCalories * 0.25) / 9)

  const consumedProtein = Math.round(targetProtein * (caloriePercent / 100))
  const consumedCarbs   = Math.round(targetCarbs * (caloriePercent / 100))
  const consumedFat     = Math.round(targetFat * (caloriePercent / 100))

  return (
    <div className="duo-card p-6 flex flex-col justify-between">
      {/* ── Top Header ── */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#58CC02]/15 text-[#58CC02] flex items-center justify-center font-bold">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#AFAFAF]">
                Daily Balance
              </span>
              <h3 className="text-lg font-black text-[#4B4B4B]">
                Nutrition Today
              </h3>
            </div>
          </div>
          <span className="text-xs font-black text-[#58CC02] bg-[#58CC02]/10 px-3 py-1 rounded-full border border-[#58CC02]/30">
            Target: {targetCalories} kcal
          </span>
        </div>

        {/* ── Calorie Ring & Left Text ── */}
        <div className="py-5 flex items-center justify-around gap-4">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#E5E5E5"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#58CC02"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * caloriePercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-[#4B4B4B] block leading-none">
                {caloriePercent}%
              </span>
              <span className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-wider mt-1 block">
                {consumedCalories} kcal
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="text-xs text-[#AFAFAF] font-black uppercase tracking-wider">Daily Calorie Budget</div>
            <div className="text-xl font-black text-[#4B4B4B]">
              {consumedCalories} <span className="text-sm font-bold text-[#AFAFAF]">/ {targetCalories}</span>
            </div>
            <div className="text-xs font-black text-[#58CC02] bg-[#58CC02]/15 px-2.5 py-1 rounded-full inline-block border border-[#58CC02]/30">
              {remainingCalories} kcal left
            </div>
          </div>
        </div>

        {/* ── 3 Macro Progress Bars (Protein, Carbs, Fat) ── */}
        {/* Progress bars: 16px thick, fully rounded, with a light highlight strip on top */}
        <div className="space-y-3.5 pt-2">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-black">
              <span className="text-[#4B4B4B]">Protein</span>
              <span className="text-[#AFAFAF]">{consumedProtein}g / {targetProtein}g</span>
            </div>
            <div className="w-full h-4 rounded-full bg-[#E5E5E5] overflow-hidden relative shadow-inner">
              <div 
                className="h-full bg-[#1CB0F6] rounded-full transition-all duration-500 relative"
                style={{ width: `${Math.min(100, (consumedProtein / targetProtein) * 100)}%` }}
              >
                {/* Top glossy highlight strip */}
                <div className="absolute top-0.5 inset-x-1 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-black">
              <span className="text-[#4B4B4B]">Carbs (Matta / Grains)</span>
              <span className="text-[#AFAFAF]">{consumedCarbs}g / {targetCarbs}g</span>
            </div>
            <div className="w-full h-4 rounded-full bg-[#E5E5E5] overflow-hidden relative shadow-inner">
              <div 
                className="h-full bg-[#FF9600] rounded-full transition-all duration-500 relative"
                style={{ width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%` }}
              >
                {/* Top glossy highlight strip */}
                <div className="absolute top-0.5 inset-x-1 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Healthy Fats */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-black">
              <span className="text-[#4B4B4B]">Healthy Fats</span>
              <span className="text-[#AFAFAF]">{consumedFat}g / {targetFat}g</span>
            </div>
            <div className="w-full h-4 rounded-full bg-[#E5E5E5] overflow-hidden relative shadow-inner">
              <div 
                className="h-full bg-[#CE82FF] rounded-full transition-all duration-500 relative"
                style={{ width: `${Math.min(100, (consumedFat / targetFat) * 100)}%` }}
              >
                {/* Top glossy highlight strip */}
                <div className="absolute top-0.5 inset-x-1 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Water Tracker: 8 Glass Icons ── */}
      <div className="pt-5 mt-5 border-t-2 border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Droplet size={18} className="text-[#1CB0F6]" fill="#1CB0F6" />
            <span className="text-sm font-black text-[#4B4B4B]">Water Intake</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateWater(-1)}
              className="w-7 h-7 rounded-lg bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#CECECE] hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 flex items-center justify-center text-[#4B4B4B] font-black cursor-pointer transition-all"
              title="Minus one glass"
            >
              <Minus size={14} strokeWidth={3} />
            </button>
            <span className="text-xs font-black text-[#4B4B4B] w-14 text-center">
              {waterGlasses} / 8 gls
            </span>
            <button
              onClick={() => onUpdateWater(1)}
              className="w-7 h-7 rounded-lg bg-[#1CB0F6] border-2 border-[#1899D6] border-b-4 border-b-[#147fad] hover:bg-[#1899D6] active:translate-y-[2px] active:border-b-2 text-white flex items-center justify-center cursor-pointer transition-all font-black shadow-sm"
              title="Add one glass"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* 8 Glass Visual Grid */}
        <div className="grid grid-cols-8 gap-1.5">
          {[...Array(8)].map((_, i) => {
            const filled = i < waterGlasses
            return (
              <button
                key={i}
                type="button"
                onClick={() => onUpdateWater(filled ? -1 : 1)}
                className={`h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 ${
                  filled
                    ? 'bg-[#1CB0F6] border-[#1899D6] border-b-4 border-b-[#147fad] text-white scale-105 shadow-sm'
                    : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF] hover:border-[#1CB0F6]/50 hover:text-[#1CB0F6]'
                }`}
                title={`Glass ${i + 1}`}
              >
                <Droplet size={14} strokeWidth={2.5} fill={filled ? '#ffffff' : 'none'} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
