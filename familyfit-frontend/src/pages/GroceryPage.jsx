import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useFamily } from '../context/FamilyContext'
import { useGrocery, KERALA_GROCERY_DATASET } from '../context/GroceryContext'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Other']

const CATEGORY_ICONS = {
  Produce: '🥑',
  Protein: '🥩',
  Dairy: '🥛',
  Pantry: '🌾',
  Other: '🍎',
}

const BUDGET_PRESETS = [500, 1000, 1500, 2500, 3500, 5000]

/**
 * Independently evaluates whether a grocery item is a genuine & suitable match
 * for a specific family member based on:
 * 1. Hard exclusion: Allergies
 * 2. Hard exclusion: Dislikes
 * 3. Specific member goal & role alignment (Genuine Match)
 */
function evaluateItemSuitability(item, member) {
  if (!member) return { isSuitable: true, isStrongMatch: false, isGenuineMatch: true, warningText: null }

  const memberAllergies = Array.isArray(member.allergies) ? member.allergies : []
  const memberDislikes = Array.isArray(member.dislikes) ? member.dislikes : []
  const lowName = ((item.name || '') + ' ' + (item.whyBuy || '') + ' ' + (item.category || '')).toLowerCase()

  // 1. HARD EXCLUSION: Check Allergy Conflicts
  const allergenMatch = memberAllergies.find((allergen) => {
    if (Array.isArray(item.allergies) && item.allergies.includes(allergen)) return true
    if (allergen === 'Milk/Dairy' && (lowName.includes('milk') || lowName.includes('thayir') || lowName.includes('curd') || lowName.includes('ghee') || lowName.includes('sambharam') || lowName.includes('cheese') || lowName.includes('yogurt'))) return true
    if (allergen === 'Eggs' && (lowName.includes('egg') || lowName.includes('mutta'))) return true
    if (allergen === 'Peanuts/Tree Nuts' && (lowName.includes('nut') || lowName.includes('almond') || lowName.includes('peanut'))) return true
    if (allergen === 'Seafood/Fish' && (lowName.includes('fish') || lowName.includes('mathi') || lowName.includes('ayala') || lowName.includes('neymeen') || lowName.includes('chemmeen') || lowName.includes('prawn') || lowName.includes('seafood') || lowName.includes('karimeen'))) return true
    if (allergen === 'Soy' && (lowName.includes('tofu') || lowName.includes('soy'))) return true
    if (allergen === 'Wheat/Gluten' && (lowName.includes('wheat') || lowName.includes('bread'))) return true
    return false
  })

  if (allergenMatch) {
    return {
      isSuitable: false,
      isStrongMatch: false,
      isGenuineMatch: false,
      warningText: `⚠️ Not suitable for ${member.name} (${allergenMatch})`,
    }
  }

  // 2. HARD EXCLUSION: Check Dislikes
  const dislikeMatch = memberDislikes.find((d) => d.trim() && lowName.includes(d.toLowerCase()))
  if (dislikeMatch) {
    return {
      isSuitable: false,
      isStrongMatch: false,
      isGenuineMatch: false,
      warningText: `⚠️ Not suitable for ${member.name} (Dislikes ${dislikeMatch})`,
    }
  }

  // 3. MEMBER GOAL & ROLE MATCH EVALUATION
  const goal = (member.fitnessGoal || '').toUpperCase()
  const diet = (member.dietPreference || '').toUpperCase()
  const role = (member.role || '').toUpperCase()

  let isStrongMatch = false
  let isGenuineMatch = false

  // High Protein / Muscle Gain Goal
  if (goal.includes('MUSCLE') || goal.includes('BULK') || diet.includes('HIGH_PROTEIN')) {
    if (item.category === 'Protein' || lowName.includes('mathi') || lowName.includes('chicken') || lowName.includes('egg') || lowName.includes('cherupayar') || lowName.includes('ayala') || lowName.includes('neymeen') || lowName.includes('chemmeen') || lowName.includes('prawn') || lowName.includes('parippu') || lowName.includes('kadala')) {
      isStrongMatch = true
      isGenuineMatch = true
    }
  }
  // Weight Loss Goal
  else if (goal.includes('LOSS') || goal.includes('WEIGHT')) {
    if (item.category === 'Produce' || lowName.includes('spinach') || lowName.includes('ash gourd') || lowName.includes('kumbalanga') || lowName.includes('avial') || lowName.includes('thoran') || lowName.includes('muringakka') || lowName.includes('tapioca') || lowName.includes('chena') || lowName.includes('curry leaves') || lowName.includes('sambharam')) {
      isStrongMatch = true
      isGenuineMatch = true
    }
  }
  // Diabetes / Blood Sugar Management Goal
  else if (goal.includes('MANAGE') || goal.includes('DIABETES') || diet.includes('LOW_GI')) {
    if (lowName.includes('matta') || lowName.includes('cherupayar') || lowName.includes('kudampuli') || lowName.includes('lentil') || lowName.includes('spinach') || lowName.includes('kumbalanga') || lowName.includes('avial') || lowName.includes('oat')) {
      isStrongMatch = true
      isGenuineMatch = true
    }
  }
  // Child Role
  else if (role === 'CHILD' || role.includes('KID')) {
    if (lowName.includes('ethakka') || lowName.includes('appam') || lowName.includes('puttu') || lowName.includes('curd') || lowName.includes('pazham') || lowName.includes('egg') || lowName.includes('ghee')) {
      isStrongMatch = true
      isGenuineMatch = true
    }
  }

  // General fallback for member without specific goals or for universal healthy staples
  if (!goal && !diet && role !== 'CHILD') {
    isGenuineMatch = true
  } else if (!isGenuineMatch) {
    // Core wholesome produce/pantry staples match universally if no allergy conflict
    if (item.category === 'Produce' || lowName.includes('curry leaves') || lowName.includes('matta') || lowName.includes('coconut oil')) {
      isGenuineMatch = true
    }
  }

  return {
    isSuitable: true,
    isStrongMatch,
    isGenuineMatch,
    warningText: null,
  }
}

export default function GroceryPage() {
  const { family } = useFamily()
  const { isDark } = useTheme()
  const { budget, setBudget, budgetPeriod, setBudgetPeriod } = useGrocery()

  const navigate = useNavigate()
  const members = family?.members || []

  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [showBudgetModal, setShowBudgetModal]   = useState(false)
  const [tempBudget, setTempBudget]             = useState(budget)
  const [toast, setToast]                       = useState('')

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const selectedMember = selectedMemberId === 'ALL'
    ? null
    : members.find((m) => String(m.id) === String(selectedMemberId))

  // STRICT FILTER RECOMMENDATIONS:
  // - "All Members" view: Show all recommendations reasoned for the family
  // - Per-member view: Show ONLY items that are a GENUINE & SUITABLE match for that specific member
  const rawRecommendations = KERALA_GROCERY_DATASET
  const filteredRecommendations = selectedMemberId === 'ALL'
    ? rawRecommendations
    : rawRecommendations.filter((item) => {
        if (!selectedMember) return true
        const evalRes = evaluateItemSuitability(item, selectedMember)
        return evalRes.isSuitable && evalRes.isGenuineMatch
      })

  const handlePeriodChange = (period) => {
    setBudgetPeriod(period)
    if (period === 'Daily' && budget > 1000) setBudget(300)
    else if (period === 'Weekly' && (budget < 500 || budget > 3000)) setBudget(1500)
    else if (period === '2-Week' && budget < 1000) setBudget(2500)
    showToastMsg(`Recommendations scaled to ${period} budget`)
  }

  const handleSaveBudget = (e) => {
    e.preventDefault()
    setBudget(Math.max(10, parseFloat(tempBudget) || 1500))
    setShowBudgetModal(false)
    showToastMsg('Target budget updated — recommendations reshaped! 💰')
  }

  const familyName = family?.name || 'Healthy Family'
  const initial = (familyName[0] || 'F').toUpperCase()

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: isDark ? '#0a0f1d' : '#fcfaf5',
        paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px))',
        fontFamily: "'Inter', sans-serif",
        color: isDark ? '#f8fafc' : '#1a1a1a',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111827',
            color: 'white',
            padding: '12px 22px',
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}

      {/* ── 1. HEADER BAR ── */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0f172a 0%, #0a0f1d 100%)'
            : 'linear-gradient(135deg, #f3f7e6 0%, #fffdf4 100%)',
          padding: 'max(24px, env(safe-area-inset-top, 24px)) 24px 20px 24px',
          borderRadius: '0 0 32px 32px',
          borderBottom: isDark ? '1px solid #1e293b' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e5b12" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2e5b12', letterSpacing: '-0.3px' }}>
              Family Fit
            </span>
          </div>

          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#2e5b12',
              color: 'white',
              fontWeight: 800,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(46,91,18,0.3)',
            }}
          >
            {initial}
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
            Grocery Advisory
          </h1>
          <p style={{ fontSize: 13, color: '#3d6b24', fontWeight: 600, margin: 0 }}>
            Nutritional guide & Kerala ingredient recommendations.
          </p>
        </div>

        {/* ── BUDGET SHAPER CONTROL CARD ── */}
        <div
          style={{
            marginTop: 18,
            background: 'white',
            borderRadius: 20,
            padding: '14px 16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Target Family Budget ({budgetPeriod})
              </div>
              <div
                onClick={() => { setTempBudget(budget); setShowBudgetModal(true) }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, cursor: 'pointer' }}
                title="Click to adjust recommendation budget scale"
              >
                <span style={{ fontSize: 24, fontWeight: 900, color: '#2e5b12' }}>₹{budget}</span>
                <span style={{ fontSize: 14, color: '#6b7280' }}>✏️</span>
              </div>
            </div>

            {/* Time Period Selector: Daily, Weekly, 2-Week */}
            <div style={{ background: '#f3f4f6', borderRadius: 14, padding: 3, display: 'flex', gap: 3 }}>
              {['Daily', 'Weekly', '2-Week'].map((period) => {
                const active = budgetPeriod === period
                return (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    style={{
                      border: 'none',
                      background: active ? '#2e5b12' : 'transparent',
                      color: active ? 'white' : '#4b5563',
                      padding: '6px 10px',
                      borderRadius: 11,
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {period}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 8, fontWeight: 500 }}>
            💡 Shapes ingredient recommendations to fit your family's <strong>₹{budget}</strong> {budgetPeriod.toLowerCase()} target.
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0 20px' }}>

        {/* ── 2. MEMBER AVATAR FILTER ROW ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#8b949e' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Filter Recommendations by Family Member
          </div>

          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {/* All button */}
            <button
              onClick={() => setSelectedMemberId('ALL')}
              style={{
                border: selectedMemberId === 'ALL' ? 'none' : `1px solid ${isDark ? '#30363d' : '#d1dca7'}`,
                background: selectedMemberId === 'ALL' ? '#2e4a19' : isDark ? '#161b22' : 'white',
                color: selectedMemberId === 'ALL' ? 'white' : '#2e5b12',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>👥</span> All Members
            </button>

            {/* Member buttons */}
            {members.map((m) => {
              const active = selectedMemberId === String(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberId(String(m.id))}
                  style={{
                    border: active ? '2px solid #2e5b12' : `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
                    background: active ? (isDark ? '#1f2937' : '#e2f0d9') : (isDark ? '#161b22' : 'white'),
                    color: isDark ? '#f0f6fc' : '#111827',
                    padding: '6px 14px 6px 8px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#2e5b12',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {m.name[0]}
                  </div>
                  <span>{m.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 3. RECOMMENDATIONS FEED (BY CATEGORY) ── */}
        <div>
          {filteredRecommendations.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '36px 20px',
                background: isDark ? '#161b22' : 'white',
                borderRadius: 20,
                border: `1.5px dashed ${isDark ? '#30363d' : '#e5e7eb'}`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>🥑</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: isDark ? '#f0f6fc' : '#111827' }}>
                No recommendations specifically matching {selectedMember ? selectedMember.name : 'this filter'}
              </div>
              <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>
                Recommendations strictly match {selectedMember ? selectedMember.name : 'your family'}'s goals & health profile.
              </div>
            </div>
          ) : (
            CATEGORIES.map((cat) => {
              const catItems = filteredRecommendations.filter((i) => i.category === cat)
              if (catItems.length === 0) return null

              return (
                <div key={cat} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{CATEGORY_ICONS[cat] || '📦'}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, color: isDark ? '#f0f6fc' : '#111827' }}>
                      {cat} <span style={{ fontSize: 13, color: '#8b949e', fontWeight: 600 }}>({catItems.length})</span>
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {catItems.map((item) => {
                      const unsuitableMembers = members.filter((m) => !evaluateItemSuitability(item, m).isSuitable)
                      const suitedMembers = members.filter((m) => evaluateItemSuitability(item, m).isSuitable && evaluateItemSuitability(item, m).isGenuineMatch)
                      const strongMember = selectedMember
                        ? (evaluateItemSuitability(item, selectedMember).isStrongMatch ? selectedMember : null)
                        : members.find((m) => evaluateItemSuitability(item, m).isStrongMatch)

                      return (
                        <div
                          key={item.id}
                          style={{
                            background: isDark ? '#161b22' : 'white',
                            borderRadius: 20,
                            padding: '14px 16px',
                            boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
                            border: unsuitableMembers.length > 0
                              ? '1.5px solid #fecaca'
                              : isDark ? '1px solid #21262d' : '1px solid #f0ede8',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Top row: Name + Reference Price */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#f0f6fc' : '#111827' }}>
                                  {item.name}
                                </span>

                                {/* Great For Member Goal Badge */}
                                {strongMember && (
                                  <span
                                    style={{
                                      background: '#fce7f3',
                                      color: '#be185d',
                                      fontSize: 10,
                                      fontWeight: 800,
                                      padding: '2px 8px',
                                      borderRadius: 10,
                                    }}
                                  >
                                    ❤️ Great for {strongMember.name}
                                  </span>
                                )}

                                {/* Inline Warning Badge for Unsuitable Members (in All Members view) */}
                                {selectedMemberId === 'ALL' && unsuitableMembers.map((m) => {
                                  const evalRes = evaluateItemSuitability(item, m)
                                  return (
                                    <span
                                      key={m.id}
                                      style={{
                                        background: '#fee2e2',
                                        color: '#991b1b',
                                        fontSize: 10,
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: 10,
                                      }}
                                    >
                                      {evalRes.warningText || `⚠️ Not suitable for ${m.name}`}
                                    </span>
                                  )
                                })}
                              </div>

                              {/* Nutritional / Recommendation Reasoning */}
                              {item.whyBuy && (
                                <div style={{ fontSize: 12, color: isDark ? '#8b949e' : '#4b5563', marginTop: 4, fontWeight: 500, lineHeight: 1.4 }}>
                                  💡 {item.whyBuy}
                                </div>
                              )}
                            </div>

                            {/* Reference Est. Price */}
                            <div style={{ flexShrink: 0, textAlign: 'right' }}>
                              <span style={{ fontSize: 14, fontWeight: 900, color: '#2e5b12' }}>
                                Est. ₹{item.price}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Row: Member Avatars (ONLY RENDERED IN 'ALL MEMBERS' VIEW) */}
                          {selectedMemberId === 'ALL' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: isDark ? '1px solid #21262d' : '1px solid #f9fafb' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>Suited for:</span>
                                {suitedMembers.length > 0 ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {suitedMembers.map((m) => (
                                      <div
                                        key={m.id}
                                        title={`${m.name} (Recommended)`}
                                        style={{
                                          width: 22,
                                          height: 22,
                                          borderRadius: '50%',
                                          background: '#2e5b12',
                                          color: 'white',
                                          fontSize: 10,
                                          fontWeight: 800,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        {m.name[0]}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 11, color: '#9ca3af' }}>Whole Family</span>
                                )}
                              </div>

                              <span style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>
                                Advisory Recommendation
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── 4. EDIT TARGET BUDGET MODAL (SHAPES RECOMMENDATIONS) ── */}
      {showBudgetModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowBudgetModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              background: isDark ? '#1e2530' : 'white',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: isDark ? '#f0f6fc' : '#111827' }}>
                Set Recommendation Budget (₹)
              </h3>
              <button
                onClick={() => setShowBudgetModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 6 }}>
                  Target Budget Scale (₹)
                </label>
                <input
                  type="number"
                  step="50"
                  min="10"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 14,
                    border: '2px solid #2e5b12',
                    fontSize: 22,
                    fontWeight: 900,
                    outline: 'none',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    color: '#111827',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 6 }}>
                  Quick Presets (INR)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {BUDGET_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTempBudget(amt)}
                      style={{
                        padding: '10px',
                        borderRadius: 12,
                        border: Number(tempBudget) === amt ? '2px solid #2e5b12' : '1px solid #e5e7eb',
                        background: Number(tempBudget) === amt ? '#e2f0d9' : 'transparent',
                        color: Number(tempBudget) === amt ? '#2e5b12' : '#374151',
                        fontWeight: 800,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 8,
                  background: 'linear-gradient(135deg, #5e8404 0%, #3d6b3f 100%)',
                  color: 'white',
                  border: 'none',
                  padding: 14,
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(61,107,63,0.3)',
                }}
              >
                Apply Recommendation Scale
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
