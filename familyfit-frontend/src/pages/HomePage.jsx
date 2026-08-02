import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'
import NutritionRing from '../components/NutritionRing'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getRecommended } from '../api/plans'
import { getTodayLog } from '../api/nutrition'

const MEMBER_THEMES = [
  {
    avatarBg: '#ea580c',
    badgeBg: '#e8f5e9',
    badgeText: '#2e7d32',
    badgeIcon: '✔',
    status: 'Healthy',
    boxBg: '#fff8f3',
    boxBorder: '#ffe8d6',
    allergiesColor: '#c2410c',
    btnBg: '#ffedd5',
    btnColor: '#c2410c',
    imgUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
  },
  {
    avatarBg: '#8b5cf6',
    badgeBg: '#f3e8ff',
    badgeText: '#7e22ce',
    badgeIcon: '⭐',
    status: 'Excellent',
    boxBg: '#faf5ff',
    boxBorder: '#efe6fa',
    allergiesColor: '#4b5563',
    btnBg: '#f3e8ff',
    btnColor: '#7e22ce',
    imgUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
  },
  {
    avatarBg: '#0d9488',
    badgeBg: '#ccfbf1',
    badgeText: '#0f766e',
    badgeIcon: '✔',
    status: 'Healthy',
    boxBg: '#f0fdfa',
    boxBorder: '#ccfbf1',
    allergiesColor: '#0f766e',
    btnBg: '#ccfbf1',
    btnColor: '#0f766e',
    imgUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140061.png',
  },
  {
    avatarBg: '#2563eb',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    badgeIcon: '⭐',
    status: 'Excellent',
    boxBg: '#eff6ff',
    boxBorder: '#dbeafe',
    allergiesColor: '#1e40af',
    btnBg: '#dbeafe',
    btnColor: '#1e40af',
    imgUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png',
  },
]

const ALLERGEN_TIPS = {
  'Milk/Dairy': 'Check for milk powder, whey, butter, ghee, or curd in packaged snacks & gravies.',
  'Eggs': 'Check for egg powder in baked goods, egg noodles, mayonnaise, and batters.',
  'Peanuts/Tree Nuts': 'Check for peanut oil, nut pastes, or cross-contamination labels in snacks.',
  'Seafood/Fish': 'Check for fish sauce, shrimp paste (belacan), dried fish, or shellfish extract.',
  'Soy': 'Check for soy lecithin, soy sauce, tofu, or edamame in Asian marinades & broths.',
  'Wheat/Gluten': 'Check for maida, semolina, or wheat flour in fried coatings, parottas & gravies.',
}

export default function HomePage() {
  const { user } = useAuth()
  const { family, activeMember, setActiveMember, loading: familyLoading } = useFamily()
  const { isDark } = useTheme()
  const [plan, setPlan]                 = useState(null)
  const [todayLog, setTodayLog]         = useState(null)
  const [search, setSearch]             = useState('')
  const [expandedTipKey, setExpandedTipKey] = useState(null)
  const navigate = useNavigate()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning,'
    if (h < 17) return 'Good afternoon,'
    return 'Good evening,'
  }

  useEffect(() => {
    async function load() {
      try {
        const [planRes, logRes] = await Promise.all([
          getRecommended().catch(() => ({ data: [] })),
          activeMember?.id ? getTodayLog(activeMember.id).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
        ])
        setPlan(planRes?.data?.[0] || null)
        setTodayLog(logRes?.data || null)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [activeMember])

  const meals = plan?.meals || []
  const familyName = family?.name || user?.familyName || 'Healthy Family'

  // Family members list
  const memberList = family?.members || []

  const initial = (familyName[0] || 'T').toUpperCase()

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: isDark ? '#0a0f1d' : '#fcfaf7',
        paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px))',
        fontFamily: "'Inter', sans-serif",
        color: isDark ? '#f8fafc' : '#1a1a1a',
        position: 'relative',
        boxShadow: '0 0 40px rgba(0,0,0,0.06)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── 1. HERO HEADER ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 320,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          borderRadius: '0 0 36px 36px',
          padding: 'max(28px, env(safe-area-inset-top, 28px)) 24px 35px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8ce600" strokeWidth="2.5">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>
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
                background: 'rgba(255,255,255,0.92)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2c3e2d" strokeWidth="2">
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
                background: '#689f00',
                color: 'white',
                fontWeight: 800,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid rgba(255,255,255,0.6)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {initial}
            </div>
          </div>
        </div>

        {/* Hero Greeting Text */}
        <div style={{ marginBottom: 10 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', lineHeight: 1.15, margin: 0, letterSpacing: '-0.5px' }}>
            {greeting()}<br />
            <span style={{ color: '#8ce600', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {familyName}!
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8ce600" strokeWidth="2.5">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
              </svg>
            </span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: 400, margin: '8px 0 0' }}>
            Eat well today, live better together.
          </p>
        </div>
      </div>

      {/* ── 2. SEARCH BAR & FLOATING ORANGE FILTER BUTTON ────────────────── */}
      <div style={{ padding: '0 20px', marginTop: -26, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              background: 'white',
              borderRadius: 30,
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.2">
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
            onClick={() => navigate('/plans')}
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

      {/* ── 3. TODAY'S PLAN (GREEN CARD) ─────────────────────────────────── */}
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #70a100 0%, #517900 100%)',
            borderRadius: 28,
            padding: '22px 20px 20px',
            color: 'white',
            boxShadow: '0 10px 25px rgba(81, 121, 0, 0.22)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>Today's Plan</h2>
            <button
              onClick={() => navigate('/plans')}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View full plan &rsaquo;
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, opacity: 0.9, marginBottom: 16 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            August 1, 2026
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '18px 16px',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                background: '#f1f8e4',
                border: '1px solid #d6ebae',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e8404" strokeWidth="2">
                <path d="M18 2v20" />
                <path d="M15 2h6" />
                <path d="M6 2v7a3 3 0 0 0 6 0V2" />
                <path d="M9 9v13" />
              </svg>
            </div>

            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 2 }}>
                {meals.length > 0 ? `${meals.length} Meals Planned Today` : '4 Meals Planned Today'}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                Tap to view recipes & ingredients
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. DAILY NUTRITION SUMMARY ──────────────────────────────────── */}
      <div style={{ padding: '0 20px', marginTop: 24, overflow: 'visible' }}>
        <div
          style={{
            background: 'white',
            borderRadius: 28,
            padding: '24px 22px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            overflow: 'visible',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, cursor: 'pointer' }}
            onClick={() => navigate('/progress')}
          >
            <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: '#111827' }}>
              Daily Nutrition Summary
            </h3>
            <span style={{ fontSize: 13, color: '#3d7a12', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
              View all &rsaquo;
            </span>
          </div>

          <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, marginBottom: 20 }}>
            Goal: 2,801 kcal
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <NutritionRing consumed={2154} goal={2801} size={145} strokeWidth={14} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Carbs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  <span style={{ color: '#111827' }}>Carbs</span>
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>165.39g / 350g</span>
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>47%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div style={{ width: '47%', height: '100%', background: '#5e8404', borderRadius: 4 }} />
                </div>
              </div>

              {/* Protein */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  <span style={{ color: '#111827' }}>Protein</span>
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>79.90g / 140g</span>
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>57%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div style={{ width: '57%', height: '100%', background: '#5e8404', borderRadius: 4 }} />
                </div>
              </div>

              {/* Fats */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  <span style={{ color: '#111827' }}>Fats</span>
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>74.69g / 93g</span>
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>80%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div style={{ width: '80%', height: '100%', background: '#ff5e14', borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. FOR YOUR FAMILY ───────────────────────────────────────────── */}
      <div style={{ padding: '0 20px', marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>For Your Family</h3>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3d7a12',
              fontSize: 14,
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

        {/* Horizontal Scroll Row of Detailed Member Cards matching screenshot */}
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
          {memberList.length > 0 ? (
            memberList.map((m, idx) => {
              const theme = MEMBER_THEMES[idx % MEMBER_THEMES.length]
              const bmi = m.bmi || (m.weightKg && m.heightCm ? (m.weightKg / Math.pow(m.heightCm / 100, 2)).toFixed(1) : 24.5)
              const allergyList = Array.isArray(m.allergies) ? m.allergies : []
              const allergyCount = allergyList.length

              return (
                <div
                  key={m.id || idx}
                  onClick={() => {
                    setActiveMember(m)
                    navigate('/profile')
                  }}
                  style={{
                    minWidth: 310,
                    maxWidth: 320,
                    background: isDark ? '#141c2e' : 'white',
                    borderRadius: 24,
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? '#24324a' : theme.boxBorder}`,
                    flexShrink: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Member Header Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <MemberAvatar member={m} size={48} />

                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', lineHeight: 1.2 }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', marginTop: 2, fontWeight: 500 }}>
                          {m.age} years • {m.heightCm || 170} cm
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Columns */}
                  <div
                    style={{
                      background: isDark ? '#1e293b' : theme.boxBg,
                      borderRadius: 16,
                      padding: '12px 14px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      textAlign: 'center',
                      gap: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#94a3b8' : '#6b7280' }}>WEIGHT</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', marginTop: 2 }}>{m.weightKg || '—'} kg</div>
                    </div>
                    <div style={{ borderLeft: `1px solid ${isDark ? '#334155' : theme.boxBorder}`, borderRight: `1px solid ${isDark ? '#334155' : theme.boxBorder}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#94a3b8' : '#6b7280' }}>BMI</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', marginTop: 2 }}>{bmi}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#94a3b8' : '#6b7280' }}>ALLERGIES</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: allergyCount > 0 ? theme.allergiesColor : (isDark ? '#34d399' : '#16a34a'), marginTop: 2 }}>
                        {allergyCount > 0 ? `${allergyCount} Listed` : 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div
                    style={{
                      background: isDark ? 'rgba(16,185,129,0.15)' : theme.btnBg,
                      color: isDark ? '#34d399' : theme.btnColor,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '10px 14px',
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>View Health Profile</span>
                    <span>&rsaquo;</span>
                  </div>
                </div>
              )
            })
          ) : (
            <div
              onClick={() => navigate('/profile')}
              style={{
                width: '100%',
                background: isDark ? '#141c2e' : 'white',
                borderRadius: 20,
                padding: '24px 20px',
                textAlign: 'center',
                border: `1.5px dashed ${isDark ? '#24324a' : '#e5e7eb'}`,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>👨‍👩‍👧‍👦</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: isDark ? '#f8fafc' : '#111827', marginBottom: 2 }}>
                No family members added yet
              </div>
              <div style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 500 }}>
                Tap here to add your family members in Profile
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 6. THINGS TO AVOID (ALLERGY & HEALTH CONFLICT WARNINGS) ─────── */}
      {memberList.some((m) => Array.isArray(m.allergies) && m.allergies.length > 0) && (
        <div style={{ padding: '0 20px', marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
                ⚠️ Things to Avoid
              </h3>
              <p style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', margin: '2px 0 0', fontWeight: 500 }}>
                Severe health & allergy warnings for your family members
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {memberList
              .filter((m) => Array.isArray(m.allergies) && m.allergies.length > 0)
              .map((m) => {
                const allergyList = m.allergies || []
                const totalAllergies = allergyList.length
                const displayedAllergies = allergyList.slice(0, 3)
                const extraCount = totalAllergies - displayedAllergies.length

                return (
                  <div
                    key={m.id || m.name}
                    style={{
                      background: isDark ? '#211215' : '#fff1f2',
                      borderRadius: 24,
                      padding: '18px 20px',
                      border: `1.5px solid ${isDark ? '#4c1d24' : '#fecaca'}`,
                      borderLeft: '5px solid #ef4444',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(239,68,68,0.06)',
                    }}
                  >
                    {/* Header: Avatar, Name, Count */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <MemberAvatar member={m} size={40} />
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#fecaca' : '#991b1b' }}>
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

                      {/* +X more link */}
                      {extraCount > 0 && (
                        <button
                          onClick={() => navigate('/profile')}
                          style={{
                            background: 'transparent',
                            color: isDark ? '#fca5a5' : '#b91c1c',
                            border: `1px dashed ${isDark ? '#fca5a5' : '#f87171'}`,
                            padding: '6px 12px',
                            borderRadius: 14,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          +{extraCount} more — View Health Profile &rsaquo;
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ── 7. FIXED BOTTOM NAVIGATION BAR ──────────────────────────────── */}
      <BottomNav />
    </div>
  )
}
