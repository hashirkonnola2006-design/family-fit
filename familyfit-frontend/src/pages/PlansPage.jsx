import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { getAllPlans, getRecommended } from '../api/plans'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'

const FILTER_TAGS = [
  { id: 'All Plans', label: 'All Plans', icon: '🌿' },
  { id: 'Weight Loss', label: 'Weight Loss', icon: '🏋️' },
  { id: 'Diabetes', label: 'Diabetes', icon: '💧' },
  { id: 'Kids', label: 'Kids', icon: '🙂' },
  { id: 'High-Protein', label: 'High-Protein', icon: '⚡' },
]

const PLAN_THEMES = [
  { accentColor: '#5e8404', tagBg: '#e2f0d9', tagColor: '#3d6b24' },
  { accentColor: '#ff5e14', tagBg: '#ffebd9', tagColor: '#e05600' },
  { accentColor: '#2563eb', tagBg: '#deebff', tagColor: '#1e56b3' },
  { accentColor: '#d97706', tagBg: '#fef3c7', tagColor: '#b45309' },
]

const DEMO_PLANS = [
  {
    id: 1,
    name: 'Vitality & Growth Plan',
    description: 'Perfectly balanced nutrients for active adults and growing kids. Rich in protein, whole grains, and colourful vegetables.',
    tags: ['family', 'balanced', 'recommended'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  },
  {
    id: 2,
    name: 'Lean & Clean Plan',
    description: 'Lower-calorie, high-satiety meals designed for gradual healthy weight loss without deprivation.',
    tags: ['weight-loss', 'low-carb', 'high-protein'],
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  },
  {
    id: 3,
    name: 'Blood Sugar Balance Plan',
    description: 'Low-GI meals that help stabilise blood glucose while still being delicious and family-friendly.',
    tags: ['diabetes', 'low-gi', 'balanced'],
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
  },
  {
    id: 4,
    name: 'Happy Kids Plan',
    description: 'Fun, nutritious meals designed for little ones aged 4-12. Hidden veggies, colourful plates, no fuss.',
    tags: ['kids', 'fun', 'colourful'],
    imageUrl: 'https://images.unsplash.com/photo-1564802270019-c50fa2d5c945?w=800&q=80',
  },
]

export default function PlansPage() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const [plans, setPlans]           = useState(DEMO_PLANS)
  const [recommended, setRecommended] = useState([DEMO_PLANS[0]])
  const [search, setSearch]         = useState('')
  const [activeTag, setActiveTag]   = useState('All Plans')
  const [loading, setLoading]       = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const [allRes, recRes] = await Promise.all([
          getAllPlans().catch(() => ({ data: null })),
          getRecommended().catch(() => ({ data: null })),
        ])
        if (Array.isArray(allRes?.data) && allRes.data.length > 0) {
          setPlans(allRes.data)
        }
        if (Array.isArray(recRes?.data) && recRes.data.length > 0) {
          setRecommended(recRes.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const planList = Array.isArray(plans) && plans.length > 0 ? plans : DEMO_PLANS
  const recList = Array.isArray(recommended) && recommended.length > 0 ? recommended : [planList[0]]

  const filtered = activeTag === 'All Plans'
    ? planList
    : planList.filter(p => p.tags?.some(t => t.toLowerCase().includes(activeTag.toLowerCase())))

  const topPick = recList[0] || planList[0]
  const familyName = family?.name || user?.familyName || 'Healthy Family'
  const initial = (familyName[0] || 'T').toUpperCase()

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
        boxShadow: '0 0 40px rgba(0,0,0,0.06)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── 1. TOP BACKSPLASH HEADER ───────────────────────────────────────── */}
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
        {/* Brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e5b12" strokeWidth="2.5">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2e5b12', letterSpacing: '-0.3px' }}>
              Family Fit
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => navigate('/notifications')}
              style={{
                position: 'relative',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: '50%', background: '#ff4d4d' }} />
            </button>

            <div
              onClick={() => navigate('/profile')}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#2e5b12',
                color: 'white',
                fontWeight: 800,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {initial}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
          Meal Plans
        </h1>
        <p style={{ fontSize: 15, color: '#3d6b24', fontWeight: 600, margin: 0 }}>
          Eat well. Live well. Together.
        </p>

        {/* ── 2. SEARCH BAR & DARK GREEN FILTER BUTTON ────────────────────── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 20 }}>
          <div
            style={{
              flex: 1,
              background: 'white',
              borderRadius: 30,
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search meals, plans, recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, color: '#374151', background: 'transparent' }}
            />
          </div>

          <button
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: '#2e4a19',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(46,74,25,0.3)',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6" />
              <circle cx="14" cy="6" r="2.5" fill="#2e4a19" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="10" cy="18" r="2.5" fill="#2e4a19" />
            </svg>
          </button>
        </div>

        {/* ── 3. CATEGORY FILTER PILLS ────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 16, paddingBottom: 4, scrollbarWidth: 'none' }}>
          {FILTER_TAGS.map((t) => {
            const active = activeTag === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTag(t.id)}
                style={{
                  border: active ? 'none' : '1px solid #d1dca7',
                  background: active ? '#2e4a19' : '#fafcf0',
                  color: active ? 'white' : '#2e5b12',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '24px 20px 0 20px' }}>

        {/* ── 4. RECOMMENDED FOR YOU FEATURED BANNER CARD ──────────────────── */}
        {topPick && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#ff5e14', fontSize: 16 }}>✦</span>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: '#111827' }}>
                  Recommended for You
                </h2>
              </div>
              <button
                onClick={() => navigate('/recipes')}
                style={{ background: 'none', border: 'none', color: '#3d6b24', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                View all &rsaquo;
              </button>
            </div>

            {/* Featured Hero Banner Card matching screenshot */}
            <div
              onClick={() => navigate(`/plans/${topPick.id}`)}
              style={{
                position: 'relative',
                borderRadius: 28,
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                minHeight: 340,
                cursor: 'pointer',
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 100%), url('${topPick.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              {/* Top row badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    background: '#ff5e14',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '5px 14px',
                    borderRadius: 14,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  ★ TOP PICK
                </span>

                <button
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>

              {/* Center Title & Description */}
              <div style={{ marginTop: 40, marginBottom: 20 }}>
                <h3 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '0 0 8px 0', lineHeight: 1.15 }}>
                  {topPick.name}
                </h3>
                <div style={{ width: 40, height: 3, background: '#8ce600', borderRadius: 2, marginBottom: 12 }} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.45, margin: 0, fontWeight: 500, maxWidth: 300 }}>
                  {topPick.description}
                </p>
              </div>

              {/* Bottom Social Proof Avatars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                    alt="User"
                    style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                    alt="User"
                    style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid white', marginLeft: -8, objectFit: 'cover' }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                    alt="User"
                    style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid white', marginLeft: -8, objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>
                  Loved by<br />
                  <span style={{ color: '#facc15', fontWeight: 800 }}>4.8K+ families</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. ALL PLANS LIST WITH COLOR ACCENT BARS & TAGS ───────────────── */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 14px 0', color: '#111827' }}>
            All Plans
          </h2>

          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div className="error-state">
              <p>No plans found for "{activeTag}"</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((plan, i) => {
                const theme = PLAN_THEMES[i % PLAN_THEMES.length]
                const tags = plan.tags || ['family', 'balanced']

                return (
                  <div
                    key={plan.id}
                    onClick={() => navigate(`/plans/${plan.id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'white',
                      borderRadius: 20,
                      padding: '12px 14px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      borderLeft: `5px solid ${theme.accentColor}`,
                      gap: 14,
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {/* Meal Plan Thumbnail Image */}
                    <img
                      src={plan.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=70'}
                      alt={plan.name}
                      style={{
                        width: 90,
                        height: 75,
                        borderRadius: 16,
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />

                    {/* Info Column */}
                    <div style={{ flex: 1 }}>
                      {/* Name */}
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#111827', marginBottom: 4, lineHeight: 1.2 }}>
                        {plan.name}
                      </div>

                      {/* Description */}
                      <div
                        style={{
                          fontSize: 12,
                          color: '#6b7280',
                          lineHeight: 1.35,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          marginBottom: 6,
                        }}
                      >
                        {plan.description}
                      </div>

                      {/* Tag Pills */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              background: theme.tagBg,
                              color: theme.tagColor,
                              padding: '2px 8px',
                              borderRadius: 8,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Chevron Arrow Icon */}
                    <span style={{ fontSize: 20, color: '#9ca3af', fontWeight: 700 }}>&rsaquo;</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── 6. FIXED BOTTOM NAVIGATION BAR ──────────────────────────────── */}
      <BottomNav />
    </div>
  )
}
