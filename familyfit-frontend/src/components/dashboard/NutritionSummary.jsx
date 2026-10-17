import { useState } from 'react'
import { Droplet, Plus, Minus, Flame, PieChart } from 'lucide-react'

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
    <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-sm flex flex-col justify-between transition-all">
      {/* ── Top Header ── */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DE]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3F5A3A]">
              Macro &amp; Hydration Balance
            </span>
            <h3 className="text-lg font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] mt-0.5">
              Nutrition Today
            </h3>
          </div>
          <span className="text-xs font-bold text-[#6B7A70] bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#E2DBD0]">
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
                stroke="#EDE8DE"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3F5A3A"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * caloriePercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-black text-[#1F2A24] font-['Plus_Jakarta_Sans'] block leading-none">
                {caloriePercent}%
              </span>
              <span className="text-[10px] text-[#6B7A70] font-semibold mt-1 block">
                {consumedCalories} kcal
              </span>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <div className="text-xs text-[#6B7A70] font-medium">Daily Budget</div>
            <div className="text-base font-extrabold text-[#1F2A24]">
              {consumedCalories} / {targetCalories}
            </div>
            <div className="text-xs font-bold text-[#2E7D32] bg-[#EAF5E4] px-2 py-0.5 rounded-md inline-block">
              {remainingCalories} kcal left
            </div>
          </div>
        </div>

        {/* ── 3 Macro Progress Bars (Protein, Carbs, Fat) ── */}
        <div className="space-y-3 pt-2">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-[#1F2A24]">Protein</span>
              <span className="text-[#6B7A70]">{consumedProtein}g / {targetProtein}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDE8DE] overflow-hidden">
              <div 
                className="h-full bg-[#3F5A3A] rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (consumedProtein / targetProtein) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-[#1F2A24]">Carbs (Matta / Grains)</span>
              <span className="text-[#6B7A70]">{consumedCarbs}g / {targetCarbs}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDE8DE] overflow-hidden">
              <div 
                className="h-full bg-[#6BBF4E] rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%` }}
              />
            </div>
          </div>

          {/* Healthy Fats */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-[#1F2A24]">Healthy Fats (Coconut Oil)</span>
              <span className="text-[#6B7A70]">{consumedFat}g / {targetFat}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDE8DE] overflow-hidden">
              <div 
                className="h-full bg-[#F26B3A] rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (consumedFat / targetFat) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Water Tracker: 8 Glass Icons ── */}
      <div className="pt-5 mt-5 border-t border-[#EDE8DE]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Droplet size={15} className="text-[#3B82F6]" />
            <span className="text-xs font-bold text-[#1F2A24]">Water Intake</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateWater(-1)}
              className="w-6 h-6 rounded-md bg-[#FAF7F0] border border-[#DCD5C8] hover:bg-[#EDE8DE] flex items-center justify-center text-[#1F2A24] cursor-pointer"
              title="Minus one glass"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs font-bold text-[#1F2A24] w-12 text-center">
              {waterGlasses} / 8 gls
            </span>
            <button
              onClick={() => onUpdateWater(1)}
              className="w-6 h-6 rounded-md bg-[#3F5A3A] hover:bg-[#32492E] text-white flex items-center justify-center cursor-pointer"
              title="Add one glass"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* 8 Glass Visual Grid */}
        <div className="grid grid-cols-8 gap-1.5">
          {[...Array(8)].map((_, i) => {
            const filled = i < waterGlasses
            return (
              <div
                key={i}
                onClick={() => onUpdateWater(filled ? -1 : 1)}
                className={`h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                  filled
                    ? 'bg-[#E0F2FE] text-[#0284C7] shadow-2xs scale-105'
                    : 'bg-[#F1F5F9] text-[#94A3B8] opacity-60 hover:opacity-100'
                }`}
                title={`Glass ${i + 1}`}
              >
                <Droplet size={13} fill={filled ? '#0284C7' : 'none'} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
