import React, { useState } from 'react'
import { Users, Plus, ChevronRight, ShoppingBag, List } from 'lucide-react'
import { suggestAvatarKey, AVATAR_REGISTRY } from '../../config/avatars'

function get3dAvatarPath(member) {
  const role = (member?.role || '').toUpperCase()
  const key = (member?.avatarKey || '').toLowerCase()
  const gender = (member?.gender || '').toUpperCase()
  const age = Number(member?.age)

  if (key === 'grandfather' || role === 'GRANDFATHER' || (age >= 60 && gender === 'MALE')) {
    return '/images/avatars-3d/grandfather.png'
  }
  if (key === 'grandmother' || role === 'GRANDMOTHER' || (age >= 60 && gender === 'FEMALE')) {
    return '/images/avatars-3d/grandmother.png'
  }
  if (key === 'father' || role === 'FATHER' || (age >= 25 && gender === 'MALE')) {
    return '/images/avatars-3d/father.png'
  }
  if (key === 'mother' || role === 'MOTHER' || (age >= 25 && gender === 'FEMALE')) {
    return '/images/avatars-3d/mother.png'
  }
  if (key === 'son' || role === 'SON' || (age < 25 && gender === 'MALE')) {
    return '/images/avatars-3d/son.png'
  }
  if (key === 'daughter' || role === 'DAUGHTER' || (age < 25 && gender === 'FEMALE')) {
    return '/images/avatars-3d/daughter.png'
  }
  return '/images/avatars-3d/father.png'
}

export default function FamilyStrip({
  members = [],
  selectedMemberId = 'all',
  onSelectMember,
  onEditMember,
  onAddMember,
}) {
  const [activeView, setActiveView] = useState('family') // 'family' | 'list'
  const safeMembers = Array.isArray(members) && members.length > 0 ? members.filter(Boolean) : []

  return (
    <div className="w-full bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-[#E8ECE8] shadow-[0_4px_24px_rgba(0,0,0,0.02)] select-none">
      {/* ── CARD HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E5EFE6] text-[#2E5F3E] flex items-center justify-center shrink-0">
            <Users size={18} strokeWidth={2.2} />
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A3826] tracking-tight">
              Your Family
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EDF3ED] text-[#4A6353] text-xs font-semibold">
              {safeMembers.length}
            </span>
          </div>
        </div>

        {/* View Toggle Group */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('family')}
            style={{
              backgroundColor: activeView === 'family' ? '#2E5F3E' : '#FFFFFF',
              color: activeView === 'family' ? '#FFFFFF' : '#4A6353',
              borderColor: activeView === 'family' ? '#2E5F3E' : '#D5E1D5',
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border shadow-2xs"
          >
            <Users size={15} />
            <span>Family View</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('list')}
            style={{
              backgroundColor: activeView === 'list' ? '#2E5F3E' : '#FFFFFF',
              color: activeView === 'list' ? '#FFFFFF' : '#4A6353',
              borderColor: activeView === 'list' ? '#2E5F3E' : '#D5E1D5',
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border"
          >
            <List size={15} />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* ── FAMILY VIEW: ROW OF 7 ARCHED CAPSULE CARDS (6 MEMBERS + ADD MEMBER) ── */}
      {activeView === 'family' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4 items-stretch">
          {safeMembers.map((m) => {
            const isSelected = String(selectedMemberId) === String(m.id)
            const avatar3dPath = get3dAvatarPath(m)

            return (
              <div
                key={m.id || m.name}
                onClick={() => {
                  onSelectMember(m.id)
                  if (onEditMember) onEditMember(m)
                }}
                className={`rounded-[24px] bg-white p-2.5 sm:p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-[#2E5F3E] ring-2 ring-[#2E5F3E]/40 shadow-md scale-[1.02]'
                    : 'border-[#E8ECE8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#D5E2D5]'
                }`}
              >
                {/* 1. Arched Pill Aperture with 3D Avatar (Taller, Prominent & Bigger People) */}
                <div className="relative w-full h-[205px] sm:h-[225px] rounded-t-[76px] rounded-b-[20px] bg-[#E4EEE5] overflow-hidden flex items-end justify-center group-hover:bg-[#DEEADC] transition-colors pt-2">
                  {/* Subtle ground oval shadow */}
                  <div className="absolute bottom-1 w-2/3 h-2 rounded-full bg-[#1A3826]/12 blur-[2px] pointer-events-none" />

                  {/* 3D Character (Bigger Scale: h-full + scale-112 to make the people prominent) */}
                  <img
                    src={avatar3dPath}
                    alt={m.name || 'Family member'}
                    className="relative z-10 h-full w-auto max-w-none object-contain object-bottom scale-112 origin-bottom filter drop-shadow-[0_8px_14px_rgba(31,60,40,0.18)] transition-transform duration-300 group-hover:scale-120 pointer-events-none"
                    loading="lazy"
                  />
                </div>

                {/* 2. Member Info Below Arch */}
                <div className="pt-3 px-1 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Name + Chevron Button */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-sm sm:text-base text-[#1A3826] tracking-tight truncate">
                        {m.name}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-[#EDF3ED] text-[#4A6353] flex items-center justify-center shrink-0 group-hover:bg-[#2E5F3E] group-hover:text-white transition-colors">
                        <ChevronRight size={13} />
                      </span>
                    </div>

                    {/* Age */}
                    {m.age && (
                      <div className="text-xs text-[#5A6B5F] font-normal mt-0.5 mb-2">
                        {m.age} yrs
                      </div>
                    )}
                  </div>

                  {/* Goal Badge (Maintain weight style) */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3EC] text-[#2E5F3E] text-[11px] font-semibold border border-[#D5E4D6]/60 w-fit mt-auto">
                    <ShoppingBag size={11} className="shrink-0 text-[#2E5F3E]" />
                    <span className="truncate">
                      {m.goal || 'Maintain weight'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* 7th Card: Add Member Card */}
          <div
            onClick={onAddMember}
            className="rounded-[24px] bg-[#EAF1EA]/70 p-2.5 sm:p-3 border border-[#E0EBE0] hover:bg-[#E4EDE4] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            {/* Arched Dashed Outline Area */}
            <div className="relative w-full h-[205px] sm:h-[225px] rounded-t-[76px] rounded-b-[20px] border-2 border-dashed border-[#A8C6AB] flex items-center justify-center overflow-hidden">
              {/* Circular + button */}
              <div className="w-12 h-12 rounded-full bg-[#3D774D] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Plus size={22} strokeWidth={2.5} />
              </div>

              {/* Delicate sprout leaf accents in corner */}
              <div className="absolute bottom-2 right-2 opacity-60 text-[#3D774D]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22v-8m0 0a5 5 0 0 1 5-5h2a5 5 0 0 1-5 5h-2zm0 0a5 5 0 0 0-5-5H5a5 5 0 0 0 5 5h2z" />
                </svg>
              </div>
            </div>

            {/* Add Member Details */}
            <div className="pt-3 px-1 text-center flex flex-col flex-1 justify-between">
              <div>
                <div className="font-bold text-sm text-[#1A3826]">Add Member</div>
                <div className="text-xs text-[#5A6B5F] mt-0.5">New profile</div>
              </div>

              {/* Bottom Chevron Circle */}
              <div className="w-6 h-6 rounded-full bg-[#EDF3ED] text-[#4A6353] flex items-center justify-center mx-auto mt-2.5 group-hover:bg-[#2E5F3E] group-hover:text-white transition-colors">
                <ChevronRight size={13} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── LIST VIEW: COMPACT ACCORDION / ROWS ── */
        <div className="space-y-3">
          {safeMembers.map((m) => {
            const avatar3dPath = get3dAvatarPath(m)
            const isSelected = String(selectedMemberId) === String(m.id)

            return (
              <div
                key={m.id || m.name}
                onClick={() => {
                  onSelectMember(m.id)
                  if (onEditMember) onEditMember(m)
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-[#2E5F3E] bg-[#F4F8F4] ring-1 ring-[#2E5F3E]'
                    : 'border-[#E8ECE8] bg-white hover:bg-[#FAFBF9]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#E4EEE5] overflow-hidden flex items-end justify-center shrink-0 border border-[#D5E1D5]">
                    <img
                      src={avatar3dPath}
                      alt={m.name}
                      className="h-full w-auto object-contain object-bottom"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A3826]">{m.name}</h3>
                    <p className="text-xs text-[#5A6B5F] font-normal">
                      {m.age ? `${m.age} yrs` : 'Member'} • {m.role || 'Family'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF3EC] text-[#2E5F3E] text-xs font-semibold">
                    <ShoppingBag size={12} />
                    <span>{m.goal || 'Maintain weight'}</span>
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#EDF3ED] text-[#4A6353] flex items-center justify-center">
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            )
          })}

          <button
            type="button"
            onClick={onAddMember}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#A8C6AB] text-[#2E5F3E] hover:bg-[#F4F8F4] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Member Profile</span>
          </button>
        </div>
      )}
    </div>
  )
}
