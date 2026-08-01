import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
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

export default function HomePage() {
  const { user } = useAuth()
  const { family, activeMember, setActiveMember, loading: familyLoading } = useFamily()
  const { isDark } = useTheme()
  const [plan, setPlan]         = useState(null)
  const [todayLog, setTodayLog] = useState(null)
  const [search, setSearch]     = useState('')
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

  // Fallback demo members if family members not loaded yet
  const memberList = family?.members?.length > 0 ? family.members : [
    {
      id: 1,
      name: 'David',
      age: 38,
      heightCm: 178,
      weightKg: 82,
      bmi: 25.9,
      allergies: ['Soy', 'Peanuts/Tree Nuts', 'Milk/Dairy', 'Eggs'],
    },
    {
      id: 2,
      name: 'Sarah',
      age: 35,
      heightCm: 165,
      weightKg: 63,
      bmi: 23.1,
      allergies: [],
    },
  ]

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

      {/* ── 5. FOR YOUR FAMILY (EXACT SCREENSHOT REDESIGN) ───────────────── */}
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
          {memberList.map((m, idx) => {
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
                  background: 'white',
                  borderRadius: 24,
                  padding: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: `1px solid ${theme.boxBorder}`,
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
                    {/* Circle Avatar Initial */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: theme.avatarBg,
                        color: 'white',
                        fontWeight: 800,
                        fontSize: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {m.name?.[0]?.toUpperCase() || 'M'}
                    </div>

                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, fontWeight: 500 }}>
                        {m.age} years • {m.heightCm || 170} cm
                      </div>

                      {/* Status Badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: theme.badgeBg,
                          color: theme.badgeText,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 12,
                          marginTop: 6,
                        }}
                      >
                        <span>{theme.badgeIcon}</span> {theme.status}
                      </div>
                    </div>
                  </div>

                  {/* Character Illustration & Chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: '#f9fafb',
                      }}
                    >
                      <img
                        src={theme.imgUrl}
                        alt={m.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ fontSize: 18, color: '#9ca3af', fontWeight: 700 }}>&rsaquo;</span>
                  </div>
                </div>

                {/* 3 Metric Columns Inner Box */}
                <div
                  style={{
                    background: theme.boxBg,
                    borderRadius: 16,
                    padding: '12px 14px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    textAlign: 'center',
                    gap: 8,
                  }}
                >
                  {/* WEIGHT */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: theme.allergiesColor, fontSize: 12, marginBottom: 4 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>WEIGHT</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginTop: 2 }}>
                      {m.weightKg || 70} kg
                    </div>
                  </div>

                  {/* BMI */}
                  <div style={{ borderLeft: '1px solid rgba(0,0,0,0.06)', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#16a34a', fontSize: 12, marginBottom: 4 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>BMI</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginTop: 2 }}>
                      {bmi}
                    </div>
                  </div>

                  {/* ALLERGIES */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: allergyCount > 0 ? '#ea580c' : '#7e22ce', fontSize: 12, marginBottom: 4 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>ALLERGIES</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginTop: 2 }}>
                      {allergyCount > 0 ? allergyCount : 'None'}
                    </div>
                  </div>
                </div>

                {/* Allergies Summary List */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', marginBottom: 4 }}>
                    ALLERGIES
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: allergyCount > 0 ? theme.allergiesColor : '#6b7280', lineHeight: 1.3 }}>
                    {allergyCount > 0 ? allergyList.join(', ') : 'None reported'}
                  </div>
                </div>

                {/* Bottom Action Button: View Diet Plan */}
                <button
                  style={{
                    background: theme.btnBg,
                    color: theme.btnColor,
                    border: 'none',
                    borderRadius: 14,
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z" />
                      <path d="M12 3v9" />
                    </svg>
                    <span>View Diet Plan</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>&rsaquo;</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 6. FIXED BOTTOM NAVIGATION BAR ──────────────────────────────── */}
      <BottomNav />
    </div>
  )
}
