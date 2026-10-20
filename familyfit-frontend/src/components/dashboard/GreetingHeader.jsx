import React from 'react'
import { Plus, Calendar } from 'lucide-react'
import { BrandSprout } from '../brand/BrandElements'

export default function GreetingHeader({ familyName = 'Family', onAddMember }) {
  const now = new Date()
  const hours = now.getHours()
  let greeting = 'Good morning'
  if (hours >= 12 && hours < 17) greeting = 'Good afternoon'
  else if (hours >= 17) greeting = 'Good evening'

  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).toUpperCase()

  // Display family name (default to 'My Family!' matching reference)
  let displayGreetingName = 'My Family!'
  const trimmed = (familyName || '').trim()
  if (trimmed && !/^(my family|healthy family|family)$/i.test(trimmed)) {
    displayGreetingName = `${trimmed.replace(/ family$/i, '')} Family!`
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#E3EEE4] via-[#E6EFE6] to-[#E9F1E9] rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-[#D6E3D6] shadow-[0_4px_20px_rgba(31,90,58,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden select-none">
      {/* ── Left Column: Greeting, Date & Subtitle ── */}
      <div className="space-y-1.5 max-w-2xl relative z-10">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#1F5A3A] uppercase tracking-[0.2em]">
          <Calendar size={14} className="text-[#1F5A3A]" />
          <span>{dateFormatted}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1A3826] tracking-tight leading-snug">
          {greeting}, <span className="text-[#2E5F3E]">{displayGreetingName}</span>
        </h1>

        <p className="text-sm sm:text-[15px] text-[#4F6355] font-normal leading-relaxed">
          Here's your family's plan for today. Wholesome Ayurvedic balance tailored for every plate.
        </p>
      </div>

      {/* ── Right Column: White Pill Add Member Action ── */}
      <div className="flex items-center gap-3 shrink-0 relative z-10">
        <button
          type="button"
          onClick={onAddMember}
          style={{ backgroundColor: '#FFFFFF', color: '#1F5A3A' }}
          className="border border-[#D5E1D5] shadow-xs px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:bg-[#FAF9F5] active:scale-95 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Member</span>
        </button>
      </div>

      {/* ── Subtle Background Decorative Leaves ── */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-25 translate-x-3 translate-y-3">
        <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M130 110C95 105 70 70 75 30C95 50 120 70 130 110Z"
            fill="#2E5F3E"
          />
          <path
            d="M75 110C50 90 40 50 55 15C65 45 75 75 75 110Z"
            fill="#7CB342"
          />
        </svg>
      </div>
    </div>
  )
}
