import { Sparkles, Plus, UserPlus, Calendar } from 'lucide-react'
import { SEASONAL_KERALA_NOTES } from '../../services/dashboardService'

export default function GreetingHeader({ familyName = 'Family', onAddMember, onPlanMeal }) {
  const now = new Date()
  const hours = now.getHours()
  let greeting = 'Good morning'
  if (hours >= 12 && hours < 17) greeting = 'Good afternoon'
  else if (hours >= 17) greeting = 'Good evening'

  // Format date: "Saturday, 17 October"
  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Deterministic daily seasonal note
  const seasonalNote = SEASONAL_KERALA_NOTES[now.getDate() % SEASONAL_KERALA_NOTES.length]

  return (
    <div className="w-full bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
      {/* ── Left Column: Greeting, Date & Subtitle ── */}
      <div className="space-y-2.5 max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B7A70] uppercase tracking-wider">
          <Calendar size={14} className="text-[#3F5A3A]" />
          <span>{dateFormatted}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2A24] tracking-tight font-['Plus_Jakarta_Sans']">
          {greeting}, <span className="text-[#3F5A3A]">{familyName}</span>
        </h1>

        <p className="text-sm sm:text-base text-[#6B7A70] font-normal leading-relaxed">
          Here’s your family’s plan for today. Wholesome Ayurvedic balance tailored for every plate.
        </p>

        {/* Seasonal Kerala Note Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border border-[#E2DBD0] text-xs font-semibold text-[#3F5A3A] mt-1 shadow-2xs">
          <Sparkles size={13} className="text-[#6BBF4E] shrink-0" />
          <span className="line-clamp-1">{seasonalNote}</span>
        </div>
      </div>

      {/* ── Right Column: Primary & Secondary Actions ── */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
        <button
          onClick={onAddMember}
          className="h-11 px-5 rounded-full border border-[#DCD5C8] hover:border-[#3F5A3A] bg-white hover:bg-[#FAF7F2] text-[#1F2A24] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <UserPlus size={16} className="text-[#3F5A3A]" />
          <span>Add member</span>
        </button>

        <button
          onClick={onPlanMeal}
          className="h-11 px-6 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>+ Plan a meal</span>
        </button>
      </div>
    </div>
  )
}
