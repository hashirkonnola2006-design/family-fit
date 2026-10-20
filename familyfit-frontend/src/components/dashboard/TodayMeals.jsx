import React, { useState } from 'react'
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
  const currentDay = DAYS_OF_WEEK.find((d) => d.index === selectedDayIndex) || DAYS_OF_WEEK[5]
  const [poppingSlot, setPoppingSlot] = useState(null)

  // Helper to test if a meal has conflict with any family member
  const checkConflicts = (dish) => {
    if (!dish?.allergies || !Array.isArray(dish.allergies) || dish.allergies.length === 0) {
      return { isSafe: true, conflicts: [] }
    }
    const conflicts = []
    ;(familyMembers || []).forEach((m) => {
      let mAllergies = []
      if (Array.isArray(m.allergies)) mAllergies = m.allergies
      else if (typeof m.allergies === 'string') mAllergies = m.allergies.split(',').map((s) => s.trim())

      mAllergies.forEach((a) => {
        if (!a || a.toLowerCase() === 'none') return
        if (dish.allergies.some((da) => da.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(da.toLowerCase()))) {
          conflicts.push(`${m.name} (${a})`)
        }
      })
    })
    return { isSafe: conflicts.length === 0, conflicts }
  }

  const handleCheckboxClick = (slotKey, newEaten) => {
    if (newEaten) {
      setPoppingSlot(slotKey)
      setTimeout(() => setPoppingSlot(null), 300)
    }
    onToggleEaten(slotKey, newEaten)
  }

  return (
    <div className="duo-card p-5 sm:p-7 w-full font-['Nunito',sans-serif]">
      {/* ── Card Header ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b-2 border-[#F0F0F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#58A700]">
                Daily Meal Schedule
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF9DE] text-[#3E7D00] border border-[#D5F0C2] font-black">
                {currentDay.full}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1F2A24] tracking-tight mt-1">
              Today's Meal Plan
            </h2>
          </div>

          <div className="text-xs font-bold text-[#777777] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02] animate-pulse" />
            <span>4 Kerala Nutritional Windows</span>
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
                  className="rounded-2xl border-2 border-dashed border-[#D8D8D8] p-5 flex flex-col items-center justify-center text-center gap-2 bg-[#FAFAF8] min-h-[170px]"
                >
                  <span className="text-xs font-black uppercase text-[#888888]">{label}</span>
                  <p className="text-xs font-bold text-[#777777]">No dish scheduled</p>
                  <button
                    type="button"
                    onClick={() => onOpenSwap(key)}
                    className="duo-btn duo-btn-secondary text-xs py-1.5 px-3 mt-1"
                  >
                    <Plus size={13} strokeWidth={3} />
                    <span>Choose Meal</span>
                  </button>
                </div>
              )
            }

            const { isSafe, conflicts } = checkConflicts(dish)
            const isEaten = Boolean(dish.eaten)
            const isPopping = poppingSlot === key

            return (
              <div
                key={key}
                className={`rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between p-4 ${
                  isEaten
                    ? 'bg-[#FAFAF8] border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] opacity-85'
                    : 'bg-white border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] hover:border-[#B5E890]'
                } ${isPopping ? 'animate-duo-pop' : ''}`}
              >
                <div>
                  {/* Slot Top Meta Bar */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#58A700] uppercase tracking-wider text-[11px]">
                        {label}
                      </span>
                      <span className="text-[11px] font-bold text-[#888888]">
                        {timeRange}
                      </span>
                    </div>

                    {/* Badge */}
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#EAF9DE] text-[#3E7D00] border border-[#D5F0C2]">
                      Traditional Healthy
                    </span>
                  </div>

                  {/* Dish Thumbnail & Information */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-[#F0F0F0] border-2 border-[#E5E5E5]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-black leading-snug line-clamp-1 ${
                          isEaten ? 'line-through text-[#888888]' : 'text-[#1F2A24]'
                        }`}
                        title={dish.name}
                      >
                        {dish.name}
                      </h4>

                      <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-[#666666]">
                        <span className="flex items-center gap-1 font-black text-[#FF9600]">
                          <Flame size={13} className="fill-[#FF9600]" />
                          {dish.kcal} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {dish.cookTimeMinutes}m
                        </span>
                      </div>

                      {/* Safety & Allergy Strip */}
                      <div className="mt-2">
                        {isSafe ? (
                          <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#58A700]">
                            <ShieldCheck size={14} />
                            <span>Safe for all members</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#FF4B4B] bg-[#FEE2E2] px-2 py-0.5 rounded-lg border border-[#FECACA]">
                            <AlertTriangle size={13} />
                            <span className="truncate">Conflict: {conflicts.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slot Actions Bar */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-[#F0F0F0] text-xs">
                  {/* Chunky 3D Mark as Eaten Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleCheckboxClick(key, !isEaten)}
                    className="flex items-center gap-2 cursor-pointer select-none group text-left"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isEaten
                          ? 'bg-[#58CC02] border-[#58A700] border-b-3 border-b-[#46A302] text-white scale-105'
                          : 'border-[#CCCCCC] border-b-3 border-b-[#B0B0B0] bg-white group-hover:border-[#58CC02]'
                      }`}
                    >
                      {isEaten && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-xs font-black ${isEaten ? 'text-[#58A700]' : 'text-[#666666]'}`}>
                      {isEaten ? 'Eaten' : 'Mark as eaten'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onOpenSwap(key)}
                      className="px-2.5 py-1 rounded-xl text-xs font-black text-[#666666] hover:text-[#1F2A24] hover:bg-[#F2F2F2] flex items-center gap-1 transition-all cursor-pointer"
                      title="Swap this dish"
                    >
                      <RotateCw size={12} />
                      <span>Swap</span>
                    </button>

                    <Link
                      to={`/recipes/${dish.id || 1}`}
                      className="px-2.5 py-1 rounded-xl text-xs font-black text-[#58A700] hover:text-[#46A302] hover:bg-[#EAF9DE] flex items-center gap-0.5 transition-all cursor-pointer"
                      title="View full recipe"
                    >
                      <span>Recipe</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── "Week at a glance" Strip ── */}
      <div className="pt-6 mt-6 border-t-2 border-[#F0F0F0]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-[#777777] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={14} className="text-[#58CC02]" />
            Week at a glance
          </span>
          <span className="text-xs font-bold text-[#888888]">
            Tap day to preview meals
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = day.index === selectedDayIndex
            return (
              <button
                key={day.index}
                type="button"
                onClick={() => onSelectDay(day.index)}
                className={`py-2.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#58CC02] text-white border-[#58A700] border-b-4 border-b-[#46A302] shadow-sm scale-105'
                    : 'bg-white hover:bg-[#F7F7F7] text-[#4B4B4B] border-[#E5E5E5] border-b-4 border-b-[#D0D0D0]'
                }`}
              >
                <div className="text-xs font-black">{day.short}</div>
                <div
                  className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                    isSelected ? 'bg-white' : 'bg-[#58CC02]'
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
