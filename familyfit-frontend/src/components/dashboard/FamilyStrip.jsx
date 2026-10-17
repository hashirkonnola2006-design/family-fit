import { Plus, Users, AlertCircle, Heart, UserPlus } from 'lucide-react'

export default function FamilyStrip({
  members = [],
  selectedMemberId = 'all',
  onSelectMember,
  onAddMember,
}) {
  if (!members || members.length === 0) {
    return (
      <div className="w-full bg-white rounded-3xl p-8 border border-[#E2DBD0] text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#EAF5E4] text-[#3F5A3A] flex items-center justify-center mx-auto mb-4">
          <Users size={28} />
        </div>
        <h3 className="text-lg font-bold text-[#1F2A24] font-['Plus_Jakarta_Sans']">
          No family members yet
        </h3>
        <p className="text-sm text-[#6B7A70] max-w-sm mx-auto mt-1 mb-5">
          Add your family members to unlock age-specific calorie targets, allergy screening, and harmonious meal plans.
        </p>
        <button
          onClick={onAddMember}
          className="h-11 px-6 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white font-bold text-sm inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-105"
        >
          <UserPlus size={16} />
          <span>Add your first family member</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3F5A3A]">
            Household Members
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#3F5A3A]/10 text-[#3F5A3A]">
            {members.length}
          </span>
        </div>
        <span className="text-xs text-[#6B7A70]">
          Click a member to personalize dashboard view
        </span>
      </div>

      {/* Horizontally scrollable strip */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-none -mx-1 px-1">
        {/* ── "All Family" Filter Pill Card ── */}
        <button
          onClick={() => onSelectMember('all')}
          className={`shrink-0 rounded-2xl p-3.5 border transition-all text-left flex items-center gap-3 cursor-pointer ${
            selectedMemberId === 'all'
              ? 'bg-[#3F5A3A] text-white border-[#3F5A3A] shadow-md scale-[1.02]'
              : 'bg-white hover:bg-[#FAF7F0] text-[#1F2A24] border-[#E2DBD0] shadow-xs'
          }`}
          style={{ minWidth: '150px' }}
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
              selectedMemberId === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-[#EAF5E4] text-[#3F5A3A]'
            }`}
          >
            <Users size={20} />
          </div>
          <div>
            <div className="text-sm font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
              All Family
            </div>
            <div
              className={`text-[11px] font-medium mt-0.5 ${
                selectedMemberId === 'all' ? 'text-white/80' : 'text-[#6B7A70]'
              }`}
            >
              Combined nutrition
            </div>
          </div>
        </button>

        {/* ── Individual Member Cards ── */}
        {members.map((member) => {
          const isSelected = String(selectedMemberId) === String(member.id)
          const name = member.name || 'Member'
          const initial = name.charAt(0).toUpperCase()
          const age = member.age ? `${member.age} yrs` : ''
          const goal = member.fitnessGoal || member.healthGoal || 'Healthy Eating'
          const cleanGoal = goal.replace(/_/g, ' ').toLowerCase()
          const formattedGoal = cleanGoal.charAt(0).toUpperCase() + cleanGoal.slice(1)

          // Check for allergies
          const hasAllergies = Boolean(
            (Array.isArray(member.allergies) && member.allergies.length > 0 && member.allergies[0] !== 'None') ||
            (typeof member.allergies === 'string' && member.allergies.trim().length > 0 && member.allergies.toLowerCase() !== 'none')
          )

          // Today's simulated calorie percentage (eaten / target)
          const calPercent = Math.min(100, Math.max(35, ((name.charCodeAt(0) * 11) % 45) + 40))

          return (
            <button
              key={member.id}
              onClick={() => onSelectMember(String(member.id))}
              className={`shrink-0 rounded-2xl p-3.5 border transition-all text-left flex items-center gap-3 cursor-pointer group ${
                isSelected
                  ? 'bg-[#3F5A3A] text-white border-[#3F5A3A] shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-[#FAF7F0] text-[#1F2A24] border-[#E2DBD0] shadow-xs'
              }`}
              style={{ minWidth: '190px' }}
            >
              {/* Avatar with calorie progress ring */}
              <div className="relative shrink-0">
                <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 44 44">
                  {/* Background track */}
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke={isSelected ? 'rgba(255,255,255,0.25)' : '#E2DBD0'}
                    strokeWidth="3"
                    fill="transparent"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke={isSelected ? '#A7F3D0' : '#6BBF4E'}
                    strokeWidth="3"
                    strokeDasharray={113}
                    strokeDashoffset={113 - (113 * calPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div
                  className={`absolute inset-0 m-auto w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs ${
                    isSelected
                      ? 'bg-white text-[#3F5A3A]'
                      : 'bg-[#EAF5E4] text-[#3F5A3A]'
                  }`}
                >
                  {initial}
                </div>

                {/* Red allergy dot badge */}
                {hasAllergies && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#D64545] border-2 border-white rounded-full flex items-center justify-center"
                    title={`Allergy alert for ${name}`}
                  />
                )}
              </div>

              {/* Meta details */}
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold font-['Plus_Jakarta_Sans'] truncate">
                    {name}
                  </span>
                  {age && (
                    <span
                      className={`text-[11px] font-semibold shrink-0 ${
                        isSelected ? 'text-white/75' : 'text-[#8D9B91]'
                      }`}
                    >
                      {age}
                    </span>
                  )}
                </div>

                {/* Goal chip */}
                <div
                  className={`text-[11px] font-medium truncate mt-0.5 max-w-[130px] ${
                    isSelected ? 'text-white/85' : 'text-[#6B7A70]'
                  }`}
                >
                  {formattedGoal}
                </div>
              </div>
            </button>
          )
        })}

        {/* ── "+ Add Member" Button Card ── */}
        <button
          onClick={onAddMember}
          className="shrink-0 h-[66px] px-4 rounded-2xl border border-dashed border-[#B4BFB8] hover:border-[#3F5A3A] bg-transparent hover:bg-white text-[#3F5A3A] flex items-center gap-2 cursor-pointer transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#3F5A3A]/10 flex items-center justify-center">
            <Plus size={16} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap">+ Add member</span>
        </button>
      </div>
    </div>
  )
}
