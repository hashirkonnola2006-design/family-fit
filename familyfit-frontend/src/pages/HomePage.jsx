import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { RECIPE_DATABASE } from '../data/recipeDatabase'

const MEMBER_THEMES = [
  {
    avatarBg: '#ea580c',
    boxBg: '#fff8f3',
    boxBorder: '#ffe8d6',
    allergiesColor: '#c2410c',
    btnBg: '#ffedd5',
    btnColor: '#c2410c',
  },
  {
    avatarBg: '#8b5cf6',
    boxBg: '#faf5ff',
    boxBorder: '#efe6fa',
    allergiesColor: '#4b5563',
    btnBg: '#f3e8ff',
    btnColor: '#7e22ce',
  },
  {
    avatarBg: '#0d9488',
    boxBg: '#f0fdfa',
    boxBorder: '#ccfbf1',
    allergiesColor: '#0f766e',
    btnBg: '#ccfbf1',
    btnColor: '#0f766e',
  },
  {
    avatarBg: '#2563eb',
    boxBg: '#dbeafe',
    boxBorder: '#dbeafe',
    allergiesColor: '#1e40af',
    btnBg: '#dbeafe',
    btnColor: '#1e40af',
  },
]

function getMemberHealthTag(m) {
  if (!m) return 'No restrictions'
  const allergies = Array.isArray(m.allergies) ? m.allergies.filter((a) => a && a !== 'None') : []
  if (allergies.length > 0) {
    return `${m.name} — ${allergies[0]} Allergy`
  }
  const conditions = Array.isArray(m.healthConditions) ? m.healthConditions.filter((c) => c && c !== 'None') : []
  if (conditions.length > 0) {
    return `${m.name} — ${conditions[0]}`
  }
  if (m.fitnessGoal) {
    const goalMap = {
      WEIGHT_LOSS: 'Weight Loss',
      WEIGHT_GAIN: 'Weight Gain',
      MUSCLE_GAIN: 'Muscle Gain',
      MANAGE_CONDITION: 'Manage Condition',
      MAINTAIN_WEIGHT: 'Maintain Weight',
    }
    const g = goalMap[m.fitnessGoal] || m.fitnessGoal
    if (g && g !== 'Maintain Weight') return `${m.name} — ${g}`
  }
  return `${m.name} — No restrictions`
}

function getRecipeMatchTag(recipe, members) {
  if (!members || members.length === 0) return '💡 Family Pick'
  const firstMatchingMember = members.find((m) => {
    const allergies = m.allergies || []
    const recipeAllergies = recipe.allergies || []
    return !allergies.some((a) => recipeAllergies.includes(a))
  })
  if (firstMatchingMember) {
    return `Matches: ${firstMatchingMember.name}`
  }
  return 'Matches: Family Pick'
}

export default function HomePage() {
  const { user } = useAuth()
  const { family, setActiveMember } = useFamily()
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [savedRecipeIds, setSavedRecipeIds] = useState([])
  const navigate = useNavigate()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning,'
    if (h < 17) return 'Good afternoon,'
    return 'Good evening,'
  }

  const memberList = family?.members || []
  const familyName = user?.familyName || family?.name || (user?.email ? user.email.split('@')[0] : 'Family')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('familyfit_saved_recipes')
      if (saved) {
        setSavedRecipeIds(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const toggleSaveRecipe = (recipeId) => {
    const idStr = String(recipeId)
    let updated = []
    if (savedRecipeIds.includes(idStr)) {
      updated = savedRecipeIds.filter((i) => i !== idStr)
    } else {
      updated = [...savedRecipeIds, idStr]
    }
    setSavedRecipeIds(updated)
    localStorage.setItem('familyfit_saved_recipes', JSON.stringify(updated))
  }

  const recommendedRecipes = search
    ? RECIPE_DATABASE.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : RECIPE_DATABASE.slice(0, 6)

  const initial = user?.name ? user.name[0].toUpperCase() : 'F'

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
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #2e4a19 0%, #1c300f 100%)',
          color: 'white',
          padding: '24px 20px 38px 20px',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 12px 32px rgba(46,74,25,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 20 }}>🌿</span>
            <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.3px', color: '#8ce600' }}>Family Fit</span>
          </div>

          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#689f00',
              color: 'white',
              fontWeight: 800,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid rgba(255,255,255,0.6)',
            }}
          >
            {initial}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1.15, margin: 0, letterSpacing: '-0.5px' }}>
            {greeting()}<br />
            <span style={{ color: '#8ce600', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {familyName}!
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8ce600" strokeWidth="2.5">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
              </svg>
            </span>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: 400, margin: '6px 0 0' }}>
            Eat well today, live better together.
          </p>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: -24, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              background: isDark ? '#1e293b' : 'white',
              borderRadius: 30,
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              border: isDark ? '1px solid #334155' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search meals, recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: 14,
                color: isDark ? '#f8fafc' : '#374151',
                background: 'transparent',
              }}
            />
          </div>

          <button
            onClick={() => navigate('/recipes')}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff5e14 0%, #e04800 100%)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(224, 72, 0, 0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6" />
              <circle cx="14" cy="6" r="2.5" fill="#ff5e14" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="10" cy="18" r="2.5" fill="#ff5e14" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
              Family Health Snapshot
            </h2>
            <p style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', margin: '2px 0 0', fontWeight: 500 }}>
              Personalized health tags & diet profiles at a glance
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'none',
              border: 'none',
              color: '#5e8404',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            View profiles &rsaquo;
          </button>
        </div>

        {memberList.length > 0 ? (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
            {memberList.map((m, idx) => {
              const tag = getMemberHealthTag(m)
              const allergyCount = (m.allergies || []).filter((a) => a !== 'None').length
              const hasWarning = allergyCount > 0 || (m.healthConditions || []).filter((c) => c !== 'None').length > 0

              return (
                <div
                  key={m.id || idx}
                  onClick={() => {
                    setActiveMember(m)
                    navigate('/profile')
                  }}
                  style={{
                    minWidth: 170,
                    maxWidth: 210,
                    background: isDark ? '#161b22' : 'white',
                    borderRadius: 20,
                    padding: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    border: `1.5px solid ${isDark ? '#21262d' : '#f0f0f0'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MemberAvatar member={m} size={38} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', lineHeight: 1.2 }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 500, marginTop: 2 }}>
                        {m.role || 'Member'}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: hasWarning
                        ? (isDark ? 'rgba(239,68,68,0.15)' : '#fff1f2')
                        : (isDark ? 'rgba(140,230,0,0.12)' : '#f4fce8'),
                      color: hasWarning
                        ? (isDark ? '#fca5a5' : '#b91c1c')
                        : (isDark ? '#8ce600' : '#3d6b3f'),
                      border: `1px solid ${
                        hasWarning
                          ? (isDark ? '#4c1d24' : '#fecaca')
                          : (isDark ? 'rgba(140,230,0,0.25)' : '#d6ebae')
                      }`,
                      borderRadius: 12,
                      padding: '6px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{hasWarning ? '⚠️' : '💚'}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tag}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            onClick={() => navigate('/onboarding')}
            style={{
              background: isDark ? '#161b22' : 'white',
              borderRadius: 24,
              padding: '24px 20px',
              textAlign: 'center',
              border: `1.5px dashed ${isDark ? '#30363d' : '#e5e7eb'}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 2 }}>👨‍👩‍👧‍👦</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: isDark ? '#f8fafc' : '#111827' }}>
              Add your family to see personalized health info here
            </div>
            <div style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 500, marginBottom: 6 }}>
              Set up family profiles to tailor meal recommendations and health tags for everyone.
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate('/onboarding')
              }}
              style={{
                background: 'linear-gradient(135deg, #ff5e14 0%, #e04800 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 16,
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(224, 72, 0, 0.3)',
              }}
            >
              + Add Family Member
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '0 20px', marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
              Recommended For Your Family
            </h2>
            <p style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', margin: '2px 0 0', fontWeight: 500 }}>
              {memberList.length === 0
                ? 'Add your family for personalized picks'
                : 'Curated dishes based on your family\'s dietary preferences'}
            </p>
          </div>
          <button
            onClick={() => navigate('/recipes')}
            style={{
              background: 'none',
              border: 'none',
              color: '#5e8404',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            View all &rsaquo;
          </button>
        </div>

        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
          {recommendedRecipes.map((recipe) => {
            const matchTag = getRecipeMatchTag(recipe, memberList)
            const isSaved = savedRecipeIds.includes(String(recipe.id))

            return (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                style={{
                  minWidth: 220,
                  maxWidth: 240,
                  background: isDark ? '#161b22' : 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  border: `1px solid ${isDark ? '#21262d' : '#f0f0f0'}`,
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: 130 }}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaveRecipe(recipe.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    {isSaved ? '❤️' : '🤍'}
                  </button>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      background: 'rgba(0,0,0,0.65)',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {matchTag}
                  </div>
                </div>

                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', lineHeight: 1.3 }}>
                    {recipe.name}
                  </div>
                  <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 500 }}>
                    ⏱️ {recipe.prepTimeMinutes || 20} mins • 🔥 {recipe.kcal || 350} kcal
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {memberList.length > 0 && (
        <div style={{ padding: '0 20px', marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 19, fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
              Family Profiles
            </h3>
            <button
              onClick={() => navigate('/profile')}
              style={{
                background: 'none',
                border: 'none',
                color: '#5e8404',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              Manage &rsaquo;
            </button>
          </div>

          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
            {memberList.map((m, idx) => {
              const theme = MEMBER_THEMES[idx % MEMBER_THEMES.length]
              const bmi = m.bmi || (m.weightKg && m.heightCm ? (m.weightKg / Math.pow(m.heightCm / 100, 2)).toFixed(1) : 24.5)
              const allergyList = Array.isArray(m.allergies) ? m.allergies.filter((a) => a !== 'None') : []
              const allergyCount = allergyList.length

              return (
                <div
                  key={m.id || idx}
                  onClick={() => {
                    setActiveMember(m)
                    navigate('/profile')
                  }}
                  style={{
                    minWidth: 280,
                    maxWidth: 300,
                    background: isDark ? '#141c2e' : 'white',
                    borderRadius: 22,
                    padding: '18px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? '#24324a' : theme.boxBorder}`,
                    flexShrink: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MemberAvatar member={m} size={44} />
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', marginTop: 2 }}>
                        {m.age} yrs • {m.heightCm || 170} cm
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: isDark ? '#1e293b' : theme.boxBg,
                      borderRadius: 14,
                      padding: '10px 12px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      textAlign: 'center',
                      gap: 6,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#94a3b8' : '#6b7280' }}>WEIGHT</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', marginTop: 2 }}>{m.weightKg || '—'} kg</div>
                    </div>
                    <div style={{ borderLeft: `1px solid ${isDark ? '#334155' : theme.boxBorder}`, borderRight: `1px solid ${isDark ? '#334155' : theme.boxBorder}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#94a3b8' : '#6b7280' }}>BMI</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', marginTop: 2 }}>{bmi}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#94a3b8' : '#6b7280' }}>ALLERGIES</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: allergyCount > 0 ? theme.allergiesColor : (isDark ? '#34d399' : '#16a34a'), marginTop: 2 }}>
                        {allergyCount > 0 ? `${allergyCount} Listed` : 'None'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 6. FIXED BOTTOM NAVIGATION BAR ── */}
      <BottomNav />
    </div>
  )
}
