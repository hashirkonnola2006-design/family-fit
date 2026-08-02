import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'

/**
 * Generates friendly, actionable, non-clinical lifestyle nudges for a family member
 * based on age bracket, health conditions, allergies, and fitness goals.
 */
function getPersonalizedMemberTips(member) {
  if (!member) return []

  const tips = []
  const age = Number(member.age) || 30
  const gender = (member.gender || '').toUpperCase()
  const goal = (member.fitnessGoal || '').toUpperCase()
  const conditions = (member.healthConditions || []).map((c) => c.toUpperCase())
  const allergies = (member.allergies || []).map((a) => a.toLowerCase())

  // 1. Age-Bracket Nudges
  if (age <= 3) {
    tips.push({
      id: 'age_infant',
      icon: '👶',
      category: 'WEANING & DIGESTION',
      title: 'Soft, Steamed Textures',
      text: 'Offer soft steamed Kerala plantain (Ethakka podi) or well-mashed ragi porridge for easy digestion.',
      accent: '#8ce600',
    })
    tips.push({
      id: 'age_infant_hydration',
      icon: '💧',
      category: 'HYDRATION',
      title: 'Gentle Hydration',
      text: 'Ensure small, frequent sips of lukewarm boiled water throughout warm afternoons.',
      accent: '#2563eb',
    })
  } else if (age <= 12) {
    tips.push({
      id: 'age_child',
      icon: '🍎',
      category: 'GROWTH & ENERGY',
      title: 'Colorful Snack Plate',
      text: 'Serve a vibrant afternoon snack with sliced papaya, bananas, and a handful of roasted makhana.',
      accent: '#ff5e14',
    })
    tips.push({
      id: 'age_child_active',
      icon: '⚽',
      category: 'ACTIVE PLAY',
      title: '60 Minutes of Fun Play',
      text: 'Encourage outdoor games, cycling, or dancing to build strong bones and healthy stamina.',
      accent: '#d97706',
    })
  } else if (age <= 19) {
    tips.push({
      id: 'age_teen',
      icon: '⚡',
      category: 'TEEN VITALITY',
      title: 'Iron & Protein Boost',
      text: 'Include iron and protein rich foods like boiled eggs, dates, and sprouted green gram (cherupayar).',
      accent: '#8b5cf6',
    })
    tips.push({
      id: 'age_teen_post_workout',
      icon: '🚴',
      category: 'RECOVERY',
      title: 'Post-Activity Refuel',
      text: 'Rehydrate after sports with fresh tender coconut water (Elaneer) for natural electrolytes.',
      accent: '#0284c7',
    })
  } else if (age >= 60) {
    tips.push({
      id: 'age_senior',
      icon: '🍵',
      category: 'SENIOR WELLNESS',
      title: 'Gentle Post-Dinner Stroll',
      text: 'Enjoy a slow 10-15 minute walk after dinner to improve evening digestion and sleep quality.',
      accent: '#16a34a',
    })
    tips.push({
      id: 'age_senior_food',
      icon: '🥣',
      category: 'EASY DIGESTION',
      title: 'Comforting Warm Meals',
      text: 'Opt for steamed Appam with mild vegetable stew or warm Matta rice kanji in the evenings.',
      accent: '#5e8404',
    })
  } else {
    // Adults (20-59)
    tips.push({
      id: 'adult_water',
      icon: '💧',
      category: 'DAILY HYDRATION',
      title: 'Hydration Goal: 8 Glasses',
      text: 'Keep a water bottle at your desk and sip regularly. Hydration boosts focus and cuts fatigue.',
      accent: '#0284c7',
    })
    tips.push({
      id: 'adult_fiber',
      icon: '🥗',
      category: 'PLATE BALANCE',
      title: 'Fill Half Your Plate with Veggies',
      text: 'Pair main meals with fiber-dense Kerala Thoran (cabbage, beans, or spinach) to stay comfortably full.',
      accent: '#16a34a',
    })
  }

  // 2. Health Goals & Conditions Nudges
  if (conditions.some((c) => c.includes('DIABETES') || c.includes('SUGAR')) || goal.includes('MANAGE') || goal.includes('DIABETES')) {
    tips.push({
      id: 'cond_diabetes',
      icon: '🌾',
      category: 'BLOOD SUGAR HARMONY',
      title: 'Choose Unpolished Red Matta Rice',
      text: 'Swap refined white rice for coarse Kerala Red Matta rice or barley to maintain steady blood glucose.',
      accent: '#d97706',
    })
    tips.push({
      id: 'cond_walk',
      icon: '🚶‍♂️',
      category: 'POST-MEAL MOVEMENT',
      title: '10-Minute Post-Meal Stroll',
      text: 'A light 10-minute walk after lunch or dinner naturally supports post-meal glucose absorption.',
      accent: '#2563eb',
    })
  }

  if (conditions.some((c) => c.includes('HYPERTENSION') || c.includes('PRESSURE') || c.includes('BP'))) {
    tips.push({
      id: 'cond_bp',
      icon: '🌿',
      category: 'HERBAL FLAVORING',
      title: 'Flavor with Curry Leaves & Kudampuli',
      text: 'Enhance curry depth using lemon juice, fresh curry leaves, and black pepper to reduce added salt intake.',
      accent: '#16a34a',
    })
  }

  if (goal.includes('WEIGHT_LOSS') || goal.includes('SLIM')) {
    tips.push({
      id: 'goal_weight',
      icon: '🥑',
      category: 'MINDFUL EATING',
      title: 'Pre-Meal Water Habit',
      text: 'Drink a glass of plain water 15 minutes before lunch and dinner to promote calm, mindful portioning.',
      accent: '#ff5e14',
    })
  }

  if (goal.includes('MUSCLE') || goal.includes('BULK') || goal.includes('HIGH_PROTEIN')) {
    tips.push({
      id: 'goal_muscle',
      icon: '💪',
      category: 'PROTEIN TIMING',
      title: 'Spread Protein Across Meals',
      text: 'Include a protein anchor (fish, country eggs, paneer, or lentils) in every main meal.',
      accent: '#8b5cf6',
    })
  }

  // 3. Female Specific Nudges
  if (gender === 'FEMALE' && age >= 15 && age <= 50) {
    tips.push({
      id: 'female_iron',
      icon: '🌱',
      category: 'VITALITY & IRON',
      title: 'Iron-Rich Plant Foods',
      text: 'Enjoy iron-rich foods like moringa leaves (muringayila), dates, and sesame seeds with Vitamin C.',
      accent: '#059669',
    })
  }

  return tips
}

const ALLERGEN_TIPS = {
  'Milk/Dairy': 'Check for milk powder, whey, butter, ghee, or curd in packaged snacks & gravies.',
  'Eggs': 'Check for egg powder in baked goods, egg noodles, mayonnaise, and batters.',
  'Peanuts/Tree Nuts': 'Check for peanut oil, nut pastes, or cross-contamination labels in snacks.',
  'Seafood/Fish': 'Check for fish sauce, shrimp paste (belacan), dried fish, or shellfish extract.',
  'Soy': 'Check for soy lecithin, soy sauce, tofu, or edamame in Asian marinades & broths.',
  'Wheat/Gluten': 'Check for maida, semolina, or wheat flour in fried coatings, parottas & gravies.',
}

export default function TipsPage() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const members = family?.members || []
  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [refreshSeed, setRefreshSeed] = useState(0)
  const [expandedTipKey, setExpandedTipKey] = useState(null)

  const activeMember = selectedMemberId === 'ALL'
    ? null
    : members.find((m) => String(m.id) === String(selectedMemberId))

  const familyName = user?.familyName || family?.name || (user?.email ? user.email.split('@')[0] : 'Family')

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
      {/* ── 1. HEADER HERO ── */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #2e4a19 0%, #1c300f 100%)',
          color: 'white',
          padding: '24px 20px 28px 20px',
          borderRadius: '0 0 28px 28px',
          boxShadow: '0 8px 24px rgba(46,74,25,0.18)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              💡
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: '-0.3px' }}>
                Tips & Suggestions
              </h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0 0', fontWeight: 500 }}>
                Everyday wellness nudges for the {familyName} family
              </p>
            </div>
          </div>

          <button
            onClick={() => setRefreshSeed((prev) => prev + 1)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              borderRadius: 16,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0 20px' }}>

        {/* ── 2. THINGS TO AVOID (ALLERGY & HEALTH WARNINGS) ── */}
        {(() => {
          const avoidanceMembers = members.filter((m) => {
            const hasAllergies = Array.isArray(m.allergies) && m.allergies.length > 0
            if (!hasAllergies) return false
            if (selectedMemberId === 'ALL') return true
            return String(m.id) === String(selectedMemberId)
          })

          if (avoidanceMembers.length === 0) return null

          return (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
                    ⚠️ Things to Avoid
                  </h3>
                  <p style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', margin: '2px 0 0', fontWeight: 500 }}>
                    Severe health & allergy warnings for your family
                  </p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Manage &rsaquo;
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {avoidanceMembers.map((m) => {
                  const allergyList = m.allergies || []
                  const totalAllergies = allergyList.length
                  const displayedAllergies = allergyList.slice(0, 3)

                  return (
                    <div
                      key={m.id || m.name}
                      style={{
                        background: isDark ? '#211215' : '#fff1f2',
                        borderRadius: 20,
                        padding: '16px 18px',
                        border: `1.5px solid ${isDark ? '#4c1d24' : '#fecaca'}`,
                        borderLeft: '5px solid #ef4444',
                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(239,68,68,0.06)',
                      }}
                    >
                      {/* Header: Avatar, Name, Count */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <MemberAvatar name={m.name} size={36} />
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#fecaca' : '#991b1b' }}>
                              {m.name}
                            </div>
                            <div style={{ fontSize: 11, color: isDark ? '#fca5a5' : '#b91c1c', fontWeight: 600 }}>
                              ⚠️ {totalAllergies} allerg{totalAllergies === 1 ? 'y' : 'ies'} listed
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('/profile')}
                          style={{
                            background: isDark ? '#37181c' : '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          Profile &rsaquo;
                        </button>
                      </div>

                      {/* Interactive Allergen Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {displayedAllergies.map((allergen) => {
                          const tagKey = `${m.id || m.name}-${allergen}`
                          const isExpanded = expandedTipKey === tagKey
                          const tipText = ALLERGEN_TIPS[allergen] || 'Check packaged ingredient labels carefully before serving.'

                          return (
                            <div key={allergen} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <button
                                type="button"
                                onClick={() => setExpandedTipKey(isExpanded ? null : tagKey)}
                                style={{
                                  background: isDark ? '#451a1d' : '#fecaca',
                                  color: isDark ? '#fca5a5' : '#991b1b',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: 14,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                }}
                              >
                                <span>⛔ {allergen}</span>
                                <span style={{ fontSize: 10, opacity: 0.8 }}>{isExpanded ? '▲' : 'ℹ️'}</span>
                              </button>

                              {isExpanded && (
                                <div
                                  style={{
                                    background: isDark ? '#2d1417' : '#ffffff',
                                    color: isDark ? '#fca5a5' : '#7f1d1d',
                                    padding: '8px 12px',
                                    borderRadius: 12,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    lineHeight: 1.4,
                                    border: `1px solid ${isDark ? '#4c1d24' : '#fca5a5'}`,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    marginTop: 2,
                                    maxWidth: 280,
                                  }}
                                >
                                  💡 <strong>Hidden Sources:</strong> {tipText}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* ── 3. FAMILY MEMBER SELECTOR ── */}
        {members.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#94a3b8' : '#6b7280', letterSpacing: '0.5px', marginBottom: 10 }}>
              FILTER TIPS BY FAMILY MEMBER
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
              <button
                onClick={() => setSelectedMemberId('ALL')}
                style={{
                  background: selectedMemberId === 'ALL' ? '#8ce600' : isDark ? '#1e293b' : 'white',
                  color: selectedMemberId === 'ALL' ? '#1c300f' : isDark ? '#f8fafc' : '#374151',
                  border: selectedMemberId === 'ALL' ? 'none' : `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                  borderRadius: 20,
                  padding: '8px 16px',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: selectedMemberId === 'ALL' ? '0 4px 12px rgba(140,230,0,0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                👥 All Family ({members.length})
              </button>

              {members.map((m) => {
                const active = String(m.id) === String(selectedMemberId)
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMemberId(m.id)}
                    style={{
                      background: active ? '#8ce600' : isDark ? '#1e293b' : 'white',
                      color: active ? '#1c300f' : isDark ? '#f8fafc' : '#374151',
                      border: active ? 'none' : `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                      borderRadius: 20,
                      padding: '6px 14px 6px 8px',
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: active ? '0 4px 12px rgba(140,230,0,0.3)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <MemberAvatar name={m.name} size={24} />
                    <span>{m.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 3. EMPTY STATE (NO FAMILY MEMBERS) ── */}
        {members.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '44px 20px',
              background: isDark ? '#161b22' : 'white',
              borderRadius: 24,
              border: isDark ? '1px solid #30363d' : '1.5px dashed #e5e7eb',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              margin: '10px 0',
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 8 }}>🌱</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: isDark ? '#f8fafc' : '#111827', marginBottom: 6 }}>
              No family profiles added yet
            </div>
            <div style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 500, lineHeight: 1.5, maxWidth: 300, margin: '0 auto 20px auto' }}>
              Add your family members to unlock personalized daily health tips and wellness suggestions tailored for everyone at home.
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              style={{
                background: 'linear-gradient(135deg, #ff5e14 0%, #e04800 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 20,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(224,72,0,0.3)',
              }}
            >
              + Add Family Member
            </button>
          </div>
        ) : (
          /* ── 4. SUGGESTIONS LIST BY MEMBER ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {(selectedMemberId === 'ALL' ? members : [activeMember]).map((member) => {
              if (!member) return null
              const memberTips = getPersonalizedMemberTips(member)

              return (
                <div
                  key={member.id}
                  style={{
                    background: isDark ? '#161b22' : 'white',
                    borderRadius: 24,
                    padding: '18px 20px',
                    border: isDark ? '1px solid #2d3748' : '1px solid #f0edf6',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Member Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 10, borderBottom: isDark ? '1px solid #2d3748' : '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <MemberAvatar name={member.name} size={36} />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: isDark ? '#f8fafc' : '#111827' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 600 }}>
                          {member.role || 'Family Member'} &bull; {member.age ? `${member.age} yrs` : 'Age N/A'}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        background: '#edf7d8',
                        color: '#3d6b24',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 12,
                      }}
                    >
                      {memberTips.length} Suggestions
                    </span>
                  </div>

                  {/* Nudges list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {memberTips.map((tip) => (
                      <div
                        key={tip.id}
                        style={{
                          background: isDark ? '#0f172a' : '#fafcf5',
                          borderRadius: 18,
                          padding: '14px 16px',
                          borderLeft: `4px solid ${tip.accent || '#8ce600'}`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                        }}
                      >
                        <div style={{ fontSize: 24, lineHeight: 1 }}>{tip.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, fontWeight: 900, color: tip.accent || '#5e8404', letterSpacing: '0.6px', marginBottom: 2 }}>
                            {tip.category}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f8fafc' : '#1f2937', marginBottom: 4 }}>
                            {tip.title}
                          </div>
                          <div style={{ fontSize: 12.5, color: isDark ? '#cbd5e1' : '#4b5563', lineHeight: 1.45, fontWeight: 500 }}>
                            {tip.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
