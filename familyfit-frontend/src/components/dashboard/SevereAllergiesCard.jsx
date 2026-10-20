import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, AlertTriangle, ShieldCheck, ArrowRight, Ban, Info } from 'lucide-react'
import MemberAvatar from '../MemberAvatar'

// Clinical severity and avoidance guidelines for common allergens
const ALLERGY_META = {
  'peanuts/tree nuts': {
    severity: 'Severe',
    severityLabel: 'High Risk (Anaphylaxis)',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    strictlyAvoid: 'Groundnuts, peanut oil, cashew/almond gravies, mixed nut chutneys, bakery items.',
    safeAlternatives: 'Sunflower seeds, roasted pumpkin seeds, sesame paste (tahini).',
  },
  'seafood/fish': {
    severity: 'Severe',
    severityLabel: 'High Risk',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    strictlyAvoid: 'Prawns, crab, fish curry, anchovy broth, fish sauce, dry fish (karuvadu).',
    safeAlternatives: 'Lentils, paneer (if non-dairy allergic), soya chunks, legumes.',
  },
  'wheat/gluten': {
    severity: 'Severe',
    severityLabel: 'High Risk (Celiac)',
    color: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA',
    badgeBg: '#FFEDD5',
    badgeText: '#9A3412',
    strictlyAvoid: 'Maida, sooji (rava), wheat flour (atta), porotta, commercial breads.',
    safeAlternatives: 'Kerala matta rice, appam (rice flour), ragi puttu, tapioca (kappa).',
  },
  'milk/dairy': {
    severity: 'Moderate',
    severityLabel: 'Moderate (Digestive/Skin)',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    strictlyAvoid: 'Cow milk, set curd, paneer, cow ghee, butter, dairy payasam.',
    safeAlternatives: 'Fresh coconut milk (theeyal/stew base), almond milk, oat milk.',
  },
  'eggs': {
    severity: 'Moderate',
    severityLabel: 'Moderate',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    strictlyAvoid: 'Whole eggs, egg roast, mayonnaise, bakery goods with egg wash.',
    safeAlternatives: 'Mung bean scramble, paneer bhurji, tofu scramble.',
  },
  'soy': {
    severity: 'Moderate',
    severityLabel: 'Moderate',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    strictlyAvoid: 'Soy sauce, soya meal maker chunks, edamame, processed soy protein.',
    safeAlternatives: 'Native Kerala pulses, kadala (black chickpeas), cherupayar.',
  },
}

function normalizeKey(str) {
  return (str || '').toLowerCase().trim()
}

export default function SevereAllergiesCard({ familyMembers = [] }) {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('ALL')

  // Parse all members and their allergies
  const allergyEntries = useMemo(() => {
    const list = []

    familyMembers.forEach((member) => {
      if (!member) return
      let rawList = []
      if (Array.isArray(member.allergies)) {
        rawList = member.allergies
      } else if (typeof member.allergies === 'string') {
        rawList = member.allergies.split(',').map((s) => s.trim())
      }

      rawList.forEach((allergyName) => {
        const clean = normalizeKey(allergyName)
        if (!clean || clean === 'none') return

        const meta =
          ALLERGY_META[clean] || {
            severity: 'Moderate',
            severityLabel: 'Moderate Watch',
            color: '#D97706',
            bg: '#FFFBEB',
            border: '#FDE68A',
            badgeBg: '#FEF3C7',
            badgeText: '#92400E',
            strictlyAvoid: `All dishes containing ${allergyName}.`,
            safeAlternatives: 'Natural whole vegetables and pulses.',
          }

        list.push({
          memberId: member.id || member._id,
          memberName: member.name,
          memberRole: member.role,
          member,
          allergyName,
          meta,
          isSevere: meta.severity === 'Severe',
        })
      })
    })

    // Sort severe first
    list.sort((a, b) => (b.isSevere ? 1 : 0) - (a.isSevere ? 1 : 0))
    return list
  }, [familyMembers])

  const filteredEntries = useMemo(() => {
    if (selectedMemberFilter === 'ALL') return allergyEntries
    return allergyEntries.filter(
      (entry) => String(entry.memberId) === String(selectedMemberFilter)
    )
  }, [allergyEntries, selectedMemberFilter])

  const severeCount = allergyEntries.filter((e) => e.isSevere).length

  // Members who have allergies for the filter buttons
  const allergicMembers = useMemo(() => {
    const map = new Map()
    allergyEntries.forEach((e) => {
      if (!map.has(e.memberId)) {
        map.set(e.memberId, e.member)
      }
    })
    return Array.from(map.values())
  }, [allergyEntries])

  return (
    <div className="duo-card p-5 sm:p-6 flex flex-col justify-between font-['Nunito',sans-serif] h-full bg-white border-2 border-[#ECEAE3] shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#F0F0F0]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                severeCount > 0
                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                  : allergyEntries.length > 0
                  ? 'bg-[#FEF3C7] text-[#D97706]'
                  : 'bg-[#EAF9DE] text-[#58CC02]'
              }`}
            >
              {severeCount > 0 ? (
                <AlertOctagon size={18} />
              ) : allergyEntries.length > 0 ? (
                <AlertTriangle size={18} />
              ) : (
                <ShieldCheck size={20} />
              )}
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#777777]">
                Critical Health Safety
              </span>
              <h3 className="text-base font-black text-[#1F2A24] leading-tight">
                Important Allergies
              </h3>
            </div>
          </div>

          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
              severeCount > 0
                ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                : allergyEntries.length > 0
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                : 'bg-[#EAF9DE] text-[#3E7D00] border-[#D5F0C2]'
            }`}
          >
            {severeCount > 0
              ? `${severeCount} Severe Alert${severeCount > 1 ? 's' : ''}`
              : allergyEntries.length > 0
              ? `${allergyEntries.length} Monitored`
              : 'All Clear'}
          </span>
        </div>

        {/* Member Filter Pills (if multiple members have allergies) */}
        {allergicMembers.length > 1 && (
          <div className="flex items-center gap-1.5 pt-3 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedMemberFilter('ALL')}
              className={`text-[11px] font-black px-2.5 py-1 rounded-full border transition-all ${
                selectedMemberFilter === 'ALL'
                  ? 'bg-[#24402F] text-white border-[#24402F]'
                  : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
              }`}
            >
              All ({allergyEntries.length})
            </button>
            {allergicMembers.map((m) => (
              <button
                key={m.id || m._id}
                type="button"
                onClick={() => setSelectedMemberFilter(String(m.id || m._id))}
                className={`text-[11px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
                  selectedMemberFilter === String(m.id || m._id)
                    ? 'bg-[#24402F] text-white border-[#24402F]'
                    : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                }`}
              >
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* List of Important Allergies */}
        <div className="pt-3.5 space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
                <ShieldCheck size={18} />
              </div>
              <div className="text-xs font-black text-[#15803D]">
                No Severe Allergies Flagged
              </div>
              <p className="text-[11px] font-bold text-[#166534]">
                All family profiles are currently screened with no high-risk allergen warnings.
              </p>
            </div>
          ) : (
            filteredEntries.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: item.meta.bg,
                  borderColor: item.meta.border,
                }}
                className="p-3.5 rounded-2xl border-2 space-y-2.5 transition-all hover:shadow-xs"
              >
                {/* Member & Severity Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MemberAvatar member={item.member} size={24} />
                    <span className="text-xs font-black text-[#1F2A24]">
                      {item.memberName}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/80 text-[#6B7280] border border-[#E5E7EB]">
                      {item.memberRole}
                    </span>
                  </div>

                  <span
                    style={{
                      backgroundColor: item.meta.badgeBg,
                      color: item.meta.badgeText,
                    }}
                    className="text-[10.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"
                  >
                    <Ban size={11} />
                    {item.meta.severityLabel}
                  </span>
                </div>

                {/* Allergen & Actionable Avoidance */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-black/5 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black text-[#111827]">
                      {item.allergyName}
                    </span>
                    <span className="text-[10px] font-bold text-[#DC2626]">
                      Strict Avoidance
                    </span>
                  </div>
                  <div className="text-[11px] text-[#4B5563] leading-relaxed">
                    <span className="font-bold text-[#991B1B]">Avoid: </span>
                    {item.meta.strictlyAvoid}
                  </div>
                  {item.meta.safeAlternatives && (
                    <div className="text-[10.5px] text-[#065F46] font-medium pt-0.5">
                      <span className="font-bold text-[#047857]">Safe: </span>
                      {item.meta.safeAlternatives}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 mt-2 border-t border-[#F0F0F0]">
        <Link
          to="/profile"
          className="flex items-center justify-between text-xs font-black text-[#24402F] hover:text-[#58CC02] transition-colors"
        >
          <span>Update Family Allergen Profiles</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
