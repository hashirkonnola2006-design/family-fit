import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'

// ── SVG & ICON HELPERS ──
const LightbulbIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" fill="#FACC15" fillOpacity="0.2" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#FEF2F2" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C95A3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const ArrowRightRed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ── PERSONALIZED MEMBER NUDGES GENERATOR ──
function getPersonalizedMemberTips(member) {
  if (!member) return []

  const tips = []
  const age = Number(member.age) || 30
  const gender = (member.gender || '').toUpperCase()
  const goal = (member.fitnessGoal || '').toUpperCase()
  const conditions = (member.healthConditions || []).map((c) => c.toUpperCase())

  // Senior (60+)
  if (age >= 60) {
    tips.push({
      id: 'senior_walk',
      icon: '🍵',
      category: 'SENIOR WELLNESS',
      title: 'Gentle Post-Dinner Stroll',
      text: 'Enjoy a slow 10–15 minute walk after dinner to improve evening digestion and sleep quality.',
      accent: '#2F6B1F',
      bgLight: '#FAFCF5',
      iconBg: '#E8F5E9',
    })
    tips.push({
      id: 'senior_warm',
      icon: '🥣',
      category: 'EASY DIGESTION',
      title: 'Comforting Warm Meals',
      text: 'Opt for steamed Appam with mild vegetable stew or warm Matta rice kanji in the evenings.',
      accent: '#0284C7',
      bgLight: '#F0F9FF',
      iconBg: '#E0F2FE',
    })
    tips.push({
      id: 'senior_gi',
      icon: '🌾',
      category: 'BLOOD SUGAR HARMONY',
      title: 'Balanced Low-GI Choices',
      text: 'Choose whole grains, leafy greens & lentils to maintain steady energy levels.',
      accent: '#F97316',
      bgLight: '#FFF7ED',
      iconBg: '#FFEDD5',
    })
  } else if (age <= 12) {
    // Child
    tips.push({
      id: 'child_snack',
      icon: '🍎',
      category: 'GROWTH & ENERGY',
      title: 'Colorful Snack Plate',
      text: 'Serve a vibrant afternoon snack with sliced papaya, bananas, and a handful of roasted makhana.',
      accent: '#F97316',
      bgLight: '#FFF7ED',
      iconBg: '#FFEDD5',
    })
    tips.push({
      id: 'child_play',
      icon: '⚽',
      category: 'ACTIVE PLAY',
      title: '60 Minutes of Fun Play',
      text: 'Encourage outdoor games, cycling, or dancing to build strong bones and healthy stamina.',
      accent: '#2F6B1F',
      bgLight: '#FAFCF5',
      iconBg: '#E8F5E9',
    })
    tips.push({
      id: 'child_digest',
      icon: '🥣',
      category: 'EASY DIGESTION',
      title: 'Mild Stew & Steamed Appam',
      text: 'Soft steamed rice hoppers with vegetable stew offer gentle digestion for growing bellies.',
      accent: '#0284C7',
      bgLight: '#F0F9FF',
      iconBg: '#E0F2FE',
    })
  } else if (age <= 19) {
    // Teen
    tips.push({
      id: 'teen_protein',
      icon: '⚡',
      category: 'TEEN VITALITY',
      title: 'Iron & Protein Boost',
      text: 'Include iron and protein rich foods like country eggs, dates, and sprouted green gram (cherupayar).',
      accent: '#8B5CF6',
      bgLight: '#FAF5FF',
      iconBg: '#F3E8FF',
    })
    tips.push({
      id: 'teen_hydration',
      icon: '💧',
      category: 'RECOVERY',
      title: 'Post-Activity Refuel',
      text: 'Rehydrate after sports with fresh tender coconut water (Elaneer) for natural electrolytes.',
      accent: '#0284C7',
      bgLight: '#F0F9FF',
      iconBg: '#E0F2FE',
    })
    tips.push({
      id: 'teen_balance',
      icon: '🥗',
      category: 'MEAL BALANCE',
      title: 'Balanced Complex Carbs',
      text: 'Pair main meals with unpolished Matta rice and fresh salads for sustained study energy.',
      accent: '#2F6B1F',
      bgLight: '#FAFCF5',
      iconBg: '#E8F5E9',
    })
  } else {
    // Adults (20-59)
    tips.push({
      id: 'adult_stroll',
      icon: '🍵',
      category: 'SENIOR WELLNESS',
      title: 'Gentle Post-Dinner Stroll',
      text: 'Enjoy a slow 10–15 minute walk after dinner to improve evening digestion and sleep quality.',
      accent: '#2F6B1F',
      bgLight: '#FAFCF5',
      iconBg: '#E8F5E9',
    })
    tips.push({
      id: 'adult_warm',
      icon: '🥣',
      category: 'EASY DIGESTION',
      title: 'Comforting Warm Meals',
      text: 'Opt for steamed Appam with mild vegetable stew or warm Matta rice kanji in the evenings.',
      accent: '#0284C7',
      bgLight: '#F0F9FF',
      iconBg: '#E0F2FE',
    })
    tips.push({
      id: 'adult_sugar',
      icon: '🌾',
      category: 'BLOOD SUGAR HARMONY',
      title: 'Balanced Low-GI Choices',
      text: 'Choose whole grains, leafy greens & lentils to maintain steady energy levels.',
      accent: '#F97316',
      bgLight: '#FFF7ED',
      iconBg: '#FFEDD5',
    })
  }

  // Health Conditions
  if (conditions.some((c) => c.includes('DIABETES') || c.includes('SUGAR')) || goal.includes('MANAGE')) {
    tips.push({
      id: 'cond_sugar',
      icon: '🌾',
      category: 'BLOOD SUGAR HARMONY',
      title: 'Choose Unpolished Red Matta Rice',
      text: 'Swap refined white rice for coarse Kerala Red Matta rice or barley to maintain steady blood glucose.',
      accent: '#D97706',
      bgLight: '#FFF7ED',
      iconBg: '#FFEDD5',
    })
  }

  return tips
}

export default function TipsPage() {
  const { user } = useAuth()
  const { family, setActiveMember } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const members = family?.members || []
  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [refreshSeed, setRefreshSeed] = useState(0)

  const familyName = user?.familyName || family?.name || 'Family'

  // Determine member for single selection view
  const activeMember = selectedMemberId === 'ALL'
    ? null
    : members.find((m) => String(m.id) === String(selectedMemberId))

  // Find family members with allergies for "Things to Avoid"
  const membersWithAllergies = members.filter((m) => Array.isArray(m.allergies) && m.allergies.length > 0)

  return (
    <div
      className="page-responsive-container"
      style={{
        background: isDark ? '#0A0F1D' : '#FAFAF7',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: isDark ? '#F8FAFC' : '#121826',
        position: 'relative',
        WebkitFontSmoothing: 'antialiased',
      }}
    >


      <div style={{ padding: '16px 16px 0 16px' }}>

        {/* ── 1. TOP BANNER / HEADER CARD ("Tips & Suggestions") ── */}
        <div
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            background: isDark
              ? 'linear-gradient(135deg, #1E3A1A 0%, #153413 50%, #0F260E 100%)'
              : 'linear-gradient(135deg, #1E4D18 0%, #2F6B1F 55%, #163A12 100%)',
            color: 'white',
            padding: '24px 20px',
            boxShadow: '0 20px 40px rgba(30,77,24,0.22)',
            marginBottom: 20,
          }}
        >
          {/* Decorative Leaf Art on Bottom Right */}
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              right: -10,
              width: 140,
              height: 140,
              opacity: 0.25,
              pointerEvents: 'none',
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 90C20 90 40 40 90 20C90 20 80 80 20 90Z" fill="#CFE8A9" />
              <path d="M10 70C10 70 30 30 70 10C70 10 60 60 10 70Z" fill="#7DAA4B" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Circular Lightbulb Badge */}
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <LightbulbIcon />
              </div>

              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.4px', lineHeight: 1.2 }}>
                  Tips &amp; Suggestions
                </h1>
                <p style={{ fontSize: 13, color: '#CFE8A9', margin: '4px 0 0 0', fontWeight: 500 }}>
                  Everyday nudges for your family
                </p>
              </div>
            </div>

            {/* Refresh Pill Button */}
            <button
              onClick={() => setRefreshSeed((prev) => prev + 1)}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: 999,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backdropFilter: 'blur(8px)',
                flexShrink: 0,
                transition: 'background 0.2s ease',
              }}
            >
              <RefreshIcon />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ── 2. "THINGS TO AVOID" CARD (ALLERGY & HEALTH WARNINGS) ── */}
        <div
          style={{
            background: isDark ? '#141C2E' : '#FFFFFF',
            borderRadius: 24,
            padding: '20px 18px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: isDark ? '1px solid #24324A' : '1px solid #F4F5EF',
            borderLeft: '4px solid #EF4444',
            marginBottom: 20,
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WarningIcon />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isDark ? '#F8FAFC' : '#121826', letterSpacing: '-0.3px' }}>
                  Things to Avoid
                </h2>
              </div>
              <p style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#5B6472', margin: '4px 0 0 34px', fontWeight: 500 }}>
                Severe health &amp; allergy warnings for your family.
              </p>
            </div>

            <button
              onClick={() => navigate('/profile')}
              style={{
                background: 'none',
                border: 'none',
                color: '#EF4444',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: 0,
              }}
            >
              Manage <ArrowRightRed />
            </button>
          </div>

          {/* Member Warning Box */}
          {membersWithAllergies.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {membersWithAllergies.map((m) => {
                const totalAllergies = (m.allergies || []).length

                return (
                  <div
                    key={m.id || m.name}
                    style={{
                      background: isDark ? '#261719' : '#FFF5F5',
                      borderRadius: 20,
                      padding: '16px',
                      border: isDark ? '1px solid #4C1D24' : '1px solid #FFE2E2',
                    }}
                  >
                    {/* Top row: Avatar + Name + Allergies Count + Profile Link */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <MemberAvatar member={m} size={42} />
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#FCA5A5' : '#121826' }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>⚠️</span>
                            <span>{totalAllergies} {totalAllergies === 1 ? 'allergy' : 'allergies'} listed</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveMember(m)
                          navigate('/profile')
                        }}
                        style={{
                          background: isDark ? '#3D1B20' : '#FFFFFF',
                          color: '#DC2626',
                          border: isDark ? '1px solid #5C232B' : '1px solid #FEE2E2',
                          borderRadius: 999,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          boxShadow: '0 2px 6px rgba(220,38,38,0.06)',
                        }}
                      >
                        Profile &rsaquo;
                      </button>
                    </div>

                    {/* Allergy Pills Row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(m.allergies || []).map((allergy) => (
                        <div
                          key={allergy}
                          style={{
                            background: isDark ? '#4A1D24' : '#FEE2E2',
                            color: isDark ? '#FCA5A5' : '#991B1B',
                            borderRadius: 999,
                            padding: '6px 14px',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>⛔</span>
                          <span>{allergy}</span>
                          <span style={{ fontSize: 12, opacity: 0.7 }}>ⓘ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Fallback clean state if no member has allergies listed */
            <div
              style={{
                background: isDark ? '#1E293B' : '#F4F5EF',
                borderRadius: 20,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 18 }}>✅</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#94A3B8' : '#5B6472' }}>
                No severe allergy warnings listed for your family members.
              </div>
            </div>
          )}
        </div>

        {/* ── 3. FAMILY MEMBER FILTER PILLS ── */}
        {members.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
              {/* "All Family" Pill */}
              <button
                onClick={() => setSelectedMemberId('ALL')}
                style={{
                  background: selectedMemberId === 'ALL' ? '#2F6B1F' : isDark ? '#1E293B' : '#FFFFFF',
                  color: selectedMemberId === 'ALL' ? '#FFFFFF' : isDark ? '#F8FAFC' : '#121826',
                  border: selectedMemberId === 'ALL' ? 'none' : `1px solid ${isDark ? '#334155' : '#E8E8E3'}`,
                  borderRadius: 999,
                  padding: '8px 18px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: selectedMemberId === 'ALL' ? '0 4px 14px rgba(47,107,31,0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span>👥</span>
                <span>All Family ({members.length})</span>
              </button>

              {/* Member Pills */}
              {members.map((m) => {
                const active = String(m.id) === String(selectedMemberId)
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMemberId(m.id)}
                    style={{
                      background: active ? '#2F6B1F' : isDark ? '#1E293B' : '#FFFFFF',
                      color: active ? '#FFFFFF' : isDark ? '#F8FAFC' : '#121826',
                      border: active ? 'none' : `1px solid ${isDark ? '#334155' : '#E8E8E3'}`,
                      borderRadius: 999,
                      padding: '6px 14px 6px 8px',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: active ? '0 4px 14px rgba(47,107,31,0.25)' : 'none',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <MemberAvatar member={m} size={26} />
                    <span>{m.name.toLowerCase()}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 4. MEMBER SUGGESTIONS LIST ── */}
        <div className="tips-responsive-grid" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {(selectedMemberId === 'ALL' ? members : [activeMember]).map((member) => {
            if (!member) return null
            const memberTips = getPersonalizedMemberTips(member)

            return (
              <div
                key={member.id}
                style={{
                  background: isDark ? '#141C2E' : '#FFFFFF',
                  borderRadius: 24,
                  padding: '20px 18px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: isDark ? '1px solid #24324A' : '1px solid #F4F5EF',
                }}
              >
                {/* Member Title Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MemberAvatar member={member} size={44} />
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#F8FAFC' : '#121826' }}>
                        {member.name.toLowerCase()}
                      </div>
                      <div style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#5B6472', fontWeight: 600, marginTop: 2 }}>
                        {(member.role || 'PARENT').toUpperCase()} &bull; {member.age ? `${member.age} yrs` : '30 yrs'}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      background: '#CFE8A9',
                      color: '#1E4D18',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: 999,
                    }}
                  >
                    {memberTips.length} Suggestions
                  </span>
                </div>

                {/* Suggestions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {memberTips.map((tip) => (
                    <div
                      key={tip.id}
                      style={{
                        background: isDark ? '#1E293B' : tip.bgLight,
                        borderRadius: 20,
                        padding: '16px 16px',
                        borderLeft: `4px solid ${tip.accent}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(2px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                        {/* Circular Category Icon */}
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: isDark ? '#334155' : tip.iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                            flexShrink: 0,
                          }}
                        >
                          {tip.icon}
                        </div>

                        {/* Text details */}
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: tip.accent, letterSpacing: '0.6px', marginBottom: 3 }}>
                            {tip.category}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', marginBottom: 4, lineHeight: 1.25 }}>
                            {tip.title}
                          </div>
                          <div style={{ fontSize: 13, color: isDark ? '#CBD5E1' : '#5B6472', lineHeight: 1.45, fontWeight: 500 }}>
                            {tip.text}
                          </div>
                        </div>
                      </div>

                      {/* Right Chevron */}
                      <ChevronRightIcon />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── UNTOUCHED BOTTOM NAVIGATION BAR ── */}
      <BottomNav />

      {/* Responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .tips-responsive-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px !important;
          }
        }
      `}} />
    </div>
  )
}
