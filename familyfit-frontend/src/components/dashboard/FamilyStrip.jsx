import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Users,
  Plus,
  ChevronRight,
  ChevronLeft,
  List,
  Droplets,
  Heart,
  TrendingDown,
  Scale,
  Dumbbell,
  Sprout,
  Activity,
  Trash2,
} from 'lucide-react'

function get3dAvatarKey(member) {
  const name = (member?.name || '').toLowerCase()
  const role = (member?.role || '').toUpperCase()
  const key = (member?.avatarKey || '').toLowerCase()
  const gender = (member?.gender || '').toUpperCase()
  const age = Number(member?.age)

  if (name.includes('madhavan') || key === 'grandfather' || role === 'GRANDFATHER' || (age >= 60 && gender === 'MALE')) {
    return 'grandfather'
  }
  if (name.includes('sarada') || key === 'grandmother' || role === 'GRANDMOTHER' || (age >= 60 && gender === 'FEMALE')) {
    return 'grandmother'
  }
  if (name.includes('rajesh') || key === 'father' || role === 'FATHER' || (age >= 25 && gender === 'MALE')) {
    return 'father'
  }
  if (name.includes('deepa') || key === 'mother' || role === 'MOTHER' || (age >= 25 && gender === 'FEMALE')) {
    return 'mother'
  }
  if (name.includes('rahul') || key === 'son' || role === 'SON' || (age < 25 && gender === 'MALE')) {
    return 'son'
  }
  if (name.includes('ananya') || key === 'daughter' || role === 'DAUGHTER' || (age < 25 && gender === 'FEMALE')) {
    return 'daughter'
  }
  return 'father'
}

/**
 * Resolves tailored wellness badge matching reference layout:
 * Low sugar, Heart care, Lose weight, Maintain weight, Gain muscle, Grow healthy
 */
function getMemberBadge(member) {
  const name = (member?.name || '').toLowerCase()
  const role = (member?.role || '').toUpperCase()
  const rawGoal = (member?.goal || member?.healthGoal || '').toLowerCase()
  const age = Number(member?.age)

  if (rawGoal.includes('sugar') || rawGoal.includes('diabet') || name.includes('madhavan') || role === 'GRANDFATHER') {
    return { label: member?.goal || 'Low sugar', Icon: Droplets }
  }
  if (rawGoal.includes('heart') || rawGoal.includes('bp') || rawGoal.includes('cardio') || name.includes('sarada') || role === 'GRANDMOTHER') {
    return { label: member?.goal || 'Heart care', Icon: Heart }
  }
  if (rawGoal.includes('lose') || rawGoal.includes('loss') || name.includes('rajesh') || (role === 'FATHER' && !rawGoal.includes('maintain'))) {
    return { label: member?.goal || 'Lose weight', Icon: TrendingDown }
  }
  if (rawGoal.includes('muscle') || rawGoal.includes('gain') || name.includes('rahul') || role === 'SON') {
    return { label: member?.goal || 'Gain muscle', Icon: Dumbbell }
  }
  if (rawGoal.includes('grow') || name.includes('ananya') || role === 'DAUGHTER' || (age > 0 && age <= 12)) {
    return { label: member?.goal || 'Grow healthy', Icon: Sprout }
  }
  if (rawGoal.includes('energy') || rawGoal.includes('active')) {
    return { label: member?.goal || 'Stay active', Icon: Activity }
  }
  return { label: member?.goal || 'Maintain weight', Icon: Scale }
}

export default function FamilyStrip({
  members = [],
  selectedMemberId = 'all',
  onSelectMember,
  onEditMember,
  onAddMember,
  onDeleteMember,
}) {
  const [activeView, setActiveView] = useState('family') // 'family' | 'list'
  const safeMembers = Array.isArray(members) && members.length > 0 ? members.filter(Boolean) : []

  // Horizontal Scroll & Drag-to-Scroll State
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const isDraggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 6)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6)
  }, [])

  useEffect(() => {
    updateScrollState()
    const handleResize = () => updateScrollState()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateScrollState, safeMembers.length, activeView])

  const handleScroll = () => {
    updateScrollState()
  }

  const scrollByAmount = (direction) => {
    const el = scrollContainerRef.current
    if (!el) return
    // Scroll by approximately one card width + gap (approx 236px)
    const cardWidth = window.innerWidth < 640 ? window.innerWidth * 0.44 + 16 : 236
    el.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth',
    })
  }

  // Mouse Drag-to-Scroll handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return // primary click only
    const el = scrollContainerRef.current
    if (!el) return
    isDraggingRef.current = true
    setIsDragging(true)
    hasDraggedRef.current = false
    dragStartXRef.current = e.pageX - el.offsetLeft
    dragStartScrollLeftRef.current = el.scrollLeft
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    const el = scrollContainerRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - dragStartXRef.current) * 1.3
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true
    }
    el.scrollLeft = dragStartScrollLeftRef.current - walk
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    setIsDragging(false)
    setTimeout(() => {
      hasDraggedRef.current = false
    }, 50)
  }

  const handleMouseLeave = () => {
    isDraggingRef.current = false
    setIsDragging(false)
    setTimeout(() => {
      hasDraggedRef.current = false
    }, 50)
  }

  return (
    <div className="w-full bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 xl:p-9 border border-[#E8ECE8] shadow-[0_4px_24px_rgba(0,0,0,0.02)] select-none">
      {/* ── CARD HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E5EFE6] text-[#2E5F3E] flex items-center justify-center shrink-0">
            <Users size={20} strokeWidth={2.2} />
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

        {/* View Toggle Group & Desktop Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          {/* Desktop Carousel Navigation Arrows (visible in family view) */}
          {activeView === 'family' && (
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
                aria-label="Scroll family cards left"
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'text-[#2E5F3E] border-[#D5E1D5] hover:bg-[#EBF3EC] cursor-pointer'
                    : 'text-[#BAC7BA] border-[#E8ECE8] cursor-not-allowed opacity-35'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollRight}
                aria-label="Scroll family cards right"
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'text-[#2E5F3E] border-[#D5E1D5] hover:bg-[#EBF3EC] cursor-pointer'
                    : 'text-[#BAC7BA] border-[#E8ECE8] cursor-not-allowed opacity-35'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setActiveView('family')}
            style={{
              backgroundColor: activeView === 'family' ? '#2E5F3E' : '#FFFFFF',
              color: activeView === 'family' ? '#FFFFFF' : '#4A6353',
              borderColor: activeView === 'family' ? '#2E5F3E' : '#D5E1D5',
            }}
            className="px-4 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border shadow-2xs"
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
            className="px-4 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border"
          >
            <List size={15} />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* ── FAMILY VIEW: HORIZONTAL SCROLLING ROW (Never wraps, page height stays constant) ── */}
      {activeView === 'family' ? (
        <div className="relative w-full overflow-hidden">
          {/* Left Fade Overlay (shows when scrolled horizontally to indicate left items) */}
          {canScrollLeft && (
            <div
              aria-hidden="true"
              className="hidden sm:block absolute left-0 top-0 bottom-2 w-10 sm:w-16 pointer-events-none z-20 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to right, #FFFFFF 15%, transparent 100%)',
              }}
            />
          )}

          {/* Right Fade Overlay (signals that user can scroll sideways) */}
          {canScrollRight && (
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 bottom-2 w-12 sm:w-20 pointer-events-none z-20 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to left, #FFFFFF 15%, transparent 100%)',
              }}
            />
          )}

          {/* Single horizontal scroll row */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="horizontal-cards-row select-none"
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {safeMembers.map((m) => {
              const isSelected = String(selectedMemberId) === String(m.id)
              const avatarKey = get3dAvatarKey(m)
              const badge = getMemberBadge(m)
              const BadgeIcon = badge.Icon

              return (
                <div
                  key={m.id || m.name}
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
                      e.preventDefault()
                      return
                    }
                    onSelectMember(m.id)
                    if (onEditMember) onEditMember(m)
                  }}
                  className={`shrink-0 w-[44vw] max-w-[180px] sm:w-[210px] md:w-[220px] rounded-[26px] sm:rounded-[30px] bg-white p-3.5 sm:p-4 border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[#2E5F3E] ring-2 ring-[#2E5F3E]/40 shadow-lg scale-[1.01]'
                      : 'border-[#E8ECE8] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[#D5E2D5]'
                  }`}
                  style={{
                    flex: '0 0 auto',
                    scrollSnapAlign: 'start',
                  }}
                >
                  {/* 1. High Resolution Photo Stage with Ayurvedic Backdrop & CSS Ellipse Ground Shadow */}
                  <div className="relative w-full h-[280px] sm:h-[310px] md:h-[330px] lg:h-[340px] xl:h-[350px] rounded-[22px] sm:rounded-[24px] bg-[#EBF2EB] overflow-hidden flex items-end justify-center group-hover:bg-[#E3EDE3] transition-colors p-2.5 sm:p-3 border border-[#DFE7DF]/90">
                    {/* Soft Kerala Ayurvedic organic leaf watercolor wash backdrop */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-45">
                      <svg width="100%" height="100%" viewBox="0 0 200 320" fill="none" preserveAspectRatio="none">
                        <path
                          d="M25 70C65 45 135 65 170 120C195 165 180 240 135 275C90 300 35 270 15 210C-5 155 5 80 25 70Z"
                          fill="#D9E6DA"
                        />
                        <path
                          d="M178 200C168 180 152 175 136 180C130 195 142 215 162 225C172 220 178 210 178 200Z"
                          stroke="#9EBFA0"
                          strokeWidth="1.6"
                          strokeDasharray="2 2"
                          fill="none"
                          opacity="0.7"
                        />
                      </svg>
                    </div>

                    {/* Ground shadow drawn in CSS (sharp radial-gradient ellipse under the feet, no baked blurry shadow) */}
                    <div
                      aria-hidden="true"
                      className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[68%] h-3 rounded-full pointer-events-none z-[5]"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(26, 56, 38, 0.28) 0%, rgba(26, 56, 38, 0.12) 45%, transparent 72%)',
                      }}
                    />

                    {/* 3D Character: Full Standing View (Head to Toe) served with high-res WebP / srcset */}
                    <picture className="relative z-10 h-full w-full flex items-end justify-center pointer-events-none">
                      <source
                        type="image/webp"
                        srcSet={`/images/avatars-3d/${avatarKey}.webp 1200w, /images/avatars-3d/${avatarKey}@2x.webp 600w, /images/avatars-3d/${avatarKey}@1x.webp 300w`}
                        sizes="(max-width: 640px) 180px, 220px"
                      />
                      <img
                        src={`/images/avatars-3d/${avatarKey}.webp`}
                        alt={m.name || 'Family member'}
                        width={400}
                        height={1200}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain object-bottom pointer-events-none select-none transition-transform duration-300 group-hover:scale-[1.03]"
                        style={{
                          imageRendering: 'auto',
                        }}
                      />
                    </picture>
                  </div>

                  {/* 2. Member Info Below Photo */}
                  <div className="pt-3.5 px-1 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Name + Circular Action Buttons */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-base sm:text-[17px] text-[#1A3826] tracking-tight truncate">
                          {m.name}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {onDeleteMember && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteMember(m)
                              }}
                              className="w-7 h-7 rounded-full bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105"
                              title={`Delete ${m.name}`}
                              aria-label={`Delete ${m.name}`}
                            >
                              <Trash2 size={13} strokeWidth={2.2} />
                            </button>
                          )}
                          <span className="w-6 h-6 rounded-full bg-[#EDF3ED] text-[#4A6353] flex items-center justify-center shrink-0 group-hover:bg-[#2E5F3E] group-hover:text-white transition-colors">
                            <ChevronRight size={13} />
                          </span>
                        </div>
                      </div>

                      {/* Age */}
                      <div className="text-xs text-[#5A6B5F] font-normal mt-0.5 mb-2">
                        {m.age ? `${m.age} yrs` : 'Member'}
                      </div>
                    </div>

                    {/* Health Goal Pill Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3EC] text-[#2E5F3E] text-[11px] sm:text-xs font-semibold border border-[#D5E4D6]/70 w-fit mt-1">
                      <BadgeIcon size={12} className="shrink-0 text-[#2E5F3E]" />
                      <span className="truncate">{badge.label}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Last Item in Row: "Add Member" Card (Matching Dimensions & Height) */}
            <div
              onClick={(e) => {
                if (hasDraggedRef.current) {
                  e.preventDefault()
                  return
                }
                if (onAddMember) onAddMember()
              }}
              className="shrink-0 w-[44vw] max-w-[180px] sm:w-[210px] md:w-[220px] rounded-[26px] sm:rounded-[30px] bg-[#F7FAF7] p-3.5 sm:p-4 border border-[#DFE8DF] hover:bg-[#EEF5EE] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              style={{
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
              }}
            >
              {/* Dashed Border Stage Matching Avatar Box Height */}
              <div className="relative w-full h-[280px] sm:h-[310px] md:h-[330px] lg:h-[340px] xl:h-[350px] rounded-[22px] sm:rounded-[24px] border-2 border-dashed border-[#A4C2A7] bg-[#F1F6F1]/70 flex items-center justify-center overflow-hidden group-hover:border-[#2E5F3E] transition-colors">
                {/* Circular + button */}
                <div className="w-16 h-16 rounded-full bg-[#2E5F3E] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Plus size={26} strokeWidth={2.4} />
                </div>

                {/* Sprout leaf accent in corner */}
                <div className="absolute bottom-3 right-3 opacity-60 text-[#2E5F3E]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22v-8m0 0a5 5 0 0 1 5-5h2a5 5 0 0 1-5 5h-2zm0 0a5 5 0 0 0-5-5H5a5 5 0 0 0 5 5h2z" />
                  </svg>
                </div>
              </div>

              {/* Add Member Details Below */}
              <div className="pt-3.5 px-1 text-center flex flex-col flex-1 justify-between">
                <div>
                  <div className="font-bold text-base text-[#1A3826]">Add Member</div>
                  <div className="text-xs text-[#5A6B5F] mt-0.5">New profile</div>
                </div>

                {/* Bottom Chevron Circle */}
                <div className="w-6 h-6 rounded-full bg-[#EDF3ED] text-[#4A6353] flex items-center justify-center mx-auto mt-2.5 group-hover:bg-[#2E5F3E] group-hover:text-white transition-colors">
                  <ChevronRight size={13} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── LIST VIEW: COMPACT ACCORDION / ROWS ── */
        <div className="space-y-3">
          {safeMembers.map((m) => {
            const avatarKey = get3dAvatarKey(m)
            const isSelected = String(selectedMemberId) === String(m.id)
            const badge = getMemberBadge(m)
            const BadgeIcon = badge.Icon

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
                      src={`/images/avatars-3d/${avatarKey}.webp`}
                      alt={m.name}
                      width={48}
                      height={48}
                      className="h-full w-auto object-contain object-bottom"
                      style={{ imageRendering: 'auto' }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A3826]">{m.name}</h3>
                    <p className="text-xs text-[#5A6B5F] font-normal">
                      {m.age ? `${m.age} yrs` : 'Member'} • {m.role || 'Family'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3EC] text-[#2E5F3E] text-xs font-semibold">
                    <BadgeIcon size={12} />
                    <span>{badge.label}</span>
                  </span>
                  {onDeleteMember && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteMember(m)
                      }}
                      className="w-8 h-8 rounded-full bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center transition-all cursor-pointer"
                      title={`Delete ${m.name}`}
                      aria-label={`Delete ${m.name}`}
                    >
                      <Trash2 size={14} strokeWidth={2.2} />
                    </button>
                  )}
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
