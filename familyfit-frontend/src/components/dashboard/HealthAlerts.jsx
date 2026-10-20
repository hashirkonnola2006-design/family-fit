import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, AlertTriangle, ArrowRight, Check } from 'lucide-react'

export default function HealthAlerts({
  familyMembers = [],
  mealPlan = {},
  onFixConflict,
}) {
  const membersWithAllergies = (familyMembers || []).filter((m) => {
    if (!m || !m.allergies) return false
    if (Array.isArray(m.allergies) && m.allergies.length > 0 && m.allergies[0] !== 'None') return true
    if (typeof m.allergies === 'string' && m.allergies.trim().length > 0 && m.allergies.toLowerCase() !== 'none') return true
    return false
  })

  // Detect conflicts with today's meals
  const detectedConflicts = []
  const mealsList = Object.entries(mealPlan || {})

  mealsList.forEach(([slotKey, dish]) => {
    if (!dish || !dish.allergies || !Array.isArray(dish.allergies)) return
    ;(familyMembers || []).forEach((member) => {
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
    <div className="duo-card p-5 sm:p-6 flex flex-col justify-between font-['Nunito',sans-serif] h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#F0F0F0]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                hasConflicts ? 'bg-[#FEE2E2] text-[#FF4B4B]' : 'bg-[#EAF9DE] text-[#58CC02]'
              }`}
            >
              {hasConflicts ? <AlertTriangle size={18} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#777777]">
                Safety Screen
              </span>
              <h3 className="text-base font-black text-[#1F2A24] leading-tight">
                Allergy Shield
              </h3>
            </div>
          </div>

          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
              hasConflicts
                ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                : 'bg-[#EAF9DE] text-[#3E7D00] border-[#D5F0C2]'
            }`}
          >
            {hasConflicts ? `${detectedConflicts.length} Alert` : '100% Safe'}
          </span>
        </div>

        {/* Body */}
        <div className="pt-4 space-y-3">
          {hasConflicts ? (
            detectedConflicts.slice(0, 2).map((conf, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECACA] border-b-4 border-b-[#FCA5A5] space-y-2"
              >
                <div className="text-xs font-black text-[#991B1B]">
                  {conf.dishName} &bull; {conf.allergen}
                </div>
                <div className="text-[11px] font-bold text-[#DC2626]">
                  Conflict with {conf.memberName}'s profile
                </div>
                {onFixConflict && (
                  <button
                    type="button"
                    onClick={() => onFixConflict(conf.slotKey)}
                    className="duo-btn duo-btn-danger text-xs py-1.5 px-3 w-full"
                  >
                    Swap {conf.slotKey}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#EAF9DE]/60 border-2 border-[#D5F0C2] flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#58CC02] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-xs font-black text-[#2E7D32]">
                  No allergen conflicts in today's menu
                </span>
              </div>

              <p className="text-xs font-bold text-[#666666] leading-relaxed">
                {membersWithAllergies.length > 0
                  ? `Active screening on for ${membersWithAllergies.map((m) => m.name).join(', ')}.`
                  : 'All recipes meet safety guidelines for children and seniors.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3.5 mt-4 border-t-2 border-[#F0F0F0]">
        <Link
          to="/tips"
          className="text-xs font-black text-[#58A700] hover:text-[#46A302] flex items-center justify-between group"
        >
          <span>View Allergen Safety Advisory</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
