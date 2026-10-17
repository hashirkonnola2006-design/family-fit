import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function HealthAlerts({
  familyMembers = [],
  mealPlan = {},
  onFixConflict,
}) {
  // Collect all family members with registered allergies
  const membersWithAllergies = familyMembers.filter((m) => {
    if (!m.allergies) return false
    if (Array.isArray(m.allergies) && m.allergies.length > 0 && m.allergies[0] !== 'None') return true
    if (typeof m.allergies === 'string' && m.allergies.trim().length > 0 && m.allergies.toLowerCase() !== 'none') return true
    return false
  })

  // Detect any meal in today's plan that triggers a conflict
  const detectedConflicts = []
  const mealsList = Object.entries(mealPlan)

  mealsList.forEach(([slotKey, dish]) => {
    if (!dish || !dish.allergies || !Array.isArray(dish.allergies)) return
    familyMembers.forEach((member) => {
      let mAllergies = []
      if (Array.isArray(member.allergies)) mAllergies = member.allergies
      else if (typeof member.allergies === 'string') mAllergies = member.allergies.split(',').map((s) => s.trim())

      mAllergies.forEach((allergy) => {
        if (!allergy || allergy.toLowerCase() === 'none') return
        const matches = dish.allergies.some(
          (da) =>
            da.toLowerCase().includes(allergy.toLowerCase()) ||
            allergy.toLowerCase().includes(da.toLowerCase())
        )
        if (matches) {
          detectedConflicts.push({
            slotKey,
            dishName: dish.name,
            memberName: member.name,
            allergen: allergy,
          })
        }
      })
    })
  })

  const hasConflicts = detectedConflicts.length > 0

  return (
    <div
      className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
        hasConflicts
          ? 'bg-[#FEF2F2] border-[#FCA5A5] shadow-xs'
          : 'bg-[#F0FDF4] border-[#BBF7D0] shadow-xs'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <div className="flex items-center gap-2">
            {hasConflicts ? (
              <div className="w-7 h-7 rounded-lg bg-[#D64545] text-white flex items-center justify-center">
                <AlertTriangle size={15} />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
            )}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A70]">
                Allergy &amp; Health Shield
              </span>
              <h3 className="text-base font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] leading-tight">
                {hasConflicts ? 'Things to Watch Today' : 'All Clear & Safe'}
              </h3>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              hasConflicts
                ? 'bg-[#FEE2E2] text-[#B91C1C]'
                : 'bg-[#DCFCE7] text-[#15803D]'
            }`}
          >
            {hasConflicts ? `${detectedConflicts.length} Conflict` : 'Zero Conflicts'}
          </span>
        </div>

        {/* Content Body */}
        <div className="pt-4 space-y-3">
          {hasConflicts ? (
            detectedConflicts.map((conf, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-[#FECACA] shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-[#991B1B]">
                      {conf.slotKey.toUpperCase()}: {conf.dishName}
                    </div>
                    <p className="text-xs text-[#7F1D1D] mt-0.5">
                      Contains <strong className="font-bold underline">{conf.allergen}</strong> — unsafe for <strong>{conf.memberName}</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onFixConflict(conf.slotKey)}
                  className="w-full h-8 rounded-xl bg-[#D64545] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles size={13} />
                  <span>Fix it with an allergy-safe swap</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-white/80 border border-[#86EFAC] text-left space-y-2">
              <div className="flex items-center gap-2 text-[#15803D] font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>All meals are safe for your family today</span>
              </div>
              <p className="text-xs text-[#166534] leading-relaxed">
                Zero conflicting ingredients detected across Breakfast, Lunch, Snack, and Dinner for all {familyMembers.length} family profiles.
              </p>
            </div>
          )}

          {/* Member Allergy Summary Chips */}
          {membersWithAllergies.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider mb-1.5">
                Household Allergies Monitored
              </div>
              <div className="flex flex-wrap gap-1.5">
                {membersWithAllergies.map((m) => {
                  const allergyList = Array.isArray(m.allergies)
                    ? m.allergies.join(', ')
                    : m.allergies
                  return (
                    <span
                      key={m.id}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-[#E2DBD0] text-[#1F2A24]"
                    >
                      <strong>{m.name}:</strong> {allergyList}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
