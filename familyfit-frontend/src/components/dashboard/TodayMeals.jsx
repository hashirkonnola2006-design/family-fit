import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Check, 
  RotateCw, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Flame, 
  ExternalLink, 
  Plus, 
  Sparkles,
  Calendar
} from 'lucide-react'
import { DAYS_OF_WEEK } from '../../services/dashboardService'

const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', timeRange: '7:30 AM - 9:00 AM' },
  { key: 'lunch',     label: 'Lunch',     timeRange: '12:30 PM - 2:00 PM' },
  { key: 'snack',     label: 'Snack',     timeRange: '4:30 PM - 5:30 PM' },
  { key: 'dinner',    label: 'Dinner',    timeRange: '7:30 PM - 9:00 PM' },
]

export default function TodayMeals({
  mealPlan = {},
  selectedDayIndex = 5,
  onSelectDay,
  onToggleEaten,
  onOpenSwap,
  familyMembers = [],
}) {
  const currentDay = DAYS_OF_WEEK.find(d => d.index === selectedDayIndex) || DAYS_OF_WEEK[5]

  // Helper to test if a meal has conflict with any family member
  const checkConflicts = (dish) => {
    if (!dish?.allergies || !Array.isArray(dish.allergies) || dish.allergies.length === 0) {
      return { isSafe: true, conflicts: [] }
    }
    const conflicts = []
    familyMembers.forEach(m => {
      let mAllergies = []
      if (Array.isArray(m.allergies)) mAllergies = m.allergies
      else if (typeof m.allergies === 'string') mAllergies = m.allergies.split(',').map(s => s.trim())

      mAllergies.forEach(a => {
        if (!a || a.toLowerCase() === 'none') return
        if (dish.allergies.some(da => da.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(da.toLowerCase()))) {
          conflicts.push(`${m.name} (${a})`)
        }
      })
    })
    return { isSafe: conflicts.length === 0, conflicts }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-sm flex flex-col justify-between transition-all">
      {/* ── Card Header ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EDE8DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3F5A3A]">
                Daily Nutrition Architecture
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5E4] text-[#3F5A3A] font-bold">
                {currentDay.full}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] mt-1">
              Today’s Meal Plan
            </h2>
          </div>

          <div className="text-xs text-[#6B7A70] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6BBF4E]" />
            <span>Harmonized for 4 daily eating windows</span>
          </div>
        </div>

        {/* ── 4 Meal Slots ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
          {MEAL_SLOTS.map(({ key, label, timeRange }) => {
            const dish = mealPlan[key]
            if (!dish) {
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-dashed border-[#DCD5C8] p-5 flex flex-col items-center justify-center text-center gap-2 bg-[#FAF7F0]/50 min-h-[170px]"
                >
                  <span className="text-xs font-bold uppercase text-[#8D9B91]">{label}</span>
                  <p className="text-xs text-[#6B7A70]">No meal scheduled yet</p>
                  <button
                    onClick={() => onOpenSwap(key)}
                    className="text-xs font-bold text-[#3F5A3A] hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>+ Add meal</span>
                  </button>
                </div>
              )
            }

            const { isSafe, conflicts } = checkConflicts(dish)
            const isEaten = Boolean(dish.eaten)

            return (
              <div
                key={key}
                className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                  isEaten
                    ? 'bg-[#FAF7F0]/60 border-[#E2DBD0] opacity-80'
                    : 'bg-white border-[#E2DBD0] hover:border-[#3F5A3A]/40 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Slot Top Meta Bar */}
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#3F5A3A] uppercase tracking-wider text-[11px]">
                        {label}
                      </span>
                      <span className="text-[10px] text-[#8D9B91]">
                        {timeRange}
                      </span>
                    </div>

                    {/* Very Healthy Badge */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5E4] text-[#2E7D32]">
                      Very Healthy
                    </span>
                  </div>

                  {/* Dish Thumbnail & Information */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#EDE8DE]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-bold leading-tight font-['Plus_Jakarta_Sans'] line-clamp-1 ${
                          isEaten ? 'line-through text-[#6B7A70]' : 'text-[#1F2A24]'
                        }`}
                        title={dish.name}
                      >
                        {dish.name}
                      </h4>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-[#6B7A70]">
                        <span className="flex items-center gap-1 font-semibold text-[#1F2A24]">
                          <Flame size={13} className="text-[#F26B3A]" />
                          {dish.kcal} kcal
                        </span>
                        <span className="flex items-center gap-1 text-[#6B7A70]">
                          <Clock size={13} />
                          {dish.cookTimeMinutes}m
                        </span>
                      </div>

                      {/* Safety & Allergy Strip */}
                      <div className="mt-2">
                        {isSafe ? (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E7D32]">
                            <ShieldCheck size={14} className="text-[#6BBF4E]" />
                            <span>Safe for all family</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D64545] bg-[#FDE8E8] px-2 py-0.5 rounded-md">
                            <AlertTriangle size={13} />
                            <span className="truncate">Conflict: {conflicts.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slot Actions Bar */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EDE8DE] text-xs">
                  {/* Mark as Eaten Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isEaten}
                      onChange={(e) => onToggleEaten(key, e.target.checked)}
                      className="w-4 h-4 rounded text-[#3F5A3A] focus:ring-[#3F5A3A] accent-[#3F5A3A] cursor-pointer"
                    />
                    <span className={isEaten ? 'text-[#3F5A3A] font-bold' : 'text-[#6B7A70] font-medium'}>
                      {isEaten ? 'Eaten' : 'Mark as eaten'}
                    </span>
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onOpenSwap(key)}
                      className="text-[#6B7A70] hover:text-[#3F5A3A] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Swap this dish"
                    >
                      <RotateCw size={13} />
                      <span>Swap</span>
                    </button>

                    <Link
                      to={`/recipes/${dish.id || 1}`}
                      className="text-[#3F5A3A] hover:text-[#32492E] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                      title="View full recipe and preparation steps"
                    >
                      <span>Recipe</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── "Week at a glance" Strip ── */}
      <div className="pt-6 mt-6 border-t border-[#EDE8DE]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#6B7A70] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={13} className="text-[#3F5A3A]" />
            Week at a glance
          </span>
          <span className="text-xs text-[#8D9B91]">
            Tap day to preview meals
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = day.index === selectedDayIndex
            const isPlanned = true // We provide balanced Kerala plans all 7 days
            return (
              <button
                key={day.index}
                onClick={() => onSelectDay(day.index)}
                className={`py-2 rounded-xl text-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#3F5A3A] text-white border-[#3F5A3A] shadow-xs'
                    : 'bg-[#FAF7F0] hover:bg-white text-[#1F2A24] border-[#E2DBD0]'
                }`}
              >
                <div className="text-[11px] font-bold">{day.short}</div>
                <div
                  className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${
                    isSelected
                      ? 'bg-[#A7F3D0]'
                      : isPlanned
                      ? 'bg-[#6BBF4E]'
                      : 'bg-[#CBD5E1]'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
