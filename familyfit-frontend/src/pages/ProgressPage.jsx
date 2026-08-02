import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getHealthScore } from '../api/progress'

// Glowing SVG Donut Ring Component matching screenshot
function HealthScoreDonut({ score = 98 }) {
  const size = 210
  const strokeWidth = 18
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(score, 100) / 100)

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 8px 24px rgba(140,230,0,0.35))' }}>
        <defs>
          <linearGradient id="scoreGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8ce600" />
            <stop offset="100%" stopColor="#3d6b24" />
          </linearGradient>
        </defs>

        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />

        {/* Animated Active Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGlowGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>

      {/* Inner White Circle with Score */}
      <div
        style={{
          position: 'absolute',
          width: size - strokeWidth * 2 - 8,
          height: size - strokeWidth * 2 - 8,
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 900, color: '#111827', lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginTop: 4 }}>
          Health Score
        </div>
      </div>
    </div>
  )
}

// Mini Sparkline SVG for progress metrics
function MiniSparkline({ color = '#4ade80' }) {
  return (
    <svg width="90" height="28" viewBox="0 0 90 28" fill="none">
      <path
        d="M2 20 C15 24, 25 10, 40 18 C55 26, 65 8, 88 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export default function ProgressPage() {
  const { user } = useAuth()
  const { family, activeMember } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [healthScore, setHealthScore] = useState(null)
  const [period, setPeriod] = useState('WEEKLY')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        if (activeMember?.id) {
          const res = await getHealthScore(activeMember.id).catch(() => ({ data: null }))
          if (res?.data && typeof res.data === 'object' && res.data.score) {
            setHealthScore(res.data)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeMember])

  const hasLogs = Boolean(healthScore && (healthScore.hasLogs || healthScore.score > 0))
  const score = hasLogs ? healthScore.score : 0
  const insight = hasLogs
    ? (healthScore?.insightText || 'Your family is thriving! Small steps today lead to a healthier, happier tomorrow.')
    : 'Log your daily meals to unlock AI-powered health scores and personalized progress insights for your family.'

  const familyName = user?.familyName || family?.name || (user?.email ? user.email.split('@')[0] : 'Family')
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
        {/* Brand Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
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

        {/* ── 2. GLOWING HEALTH SCORE DONUT RING ──────────────────────────── */}
        <div style={{ margin: '10px 0 24px 0' }}>
          <HealthScoreDonut score={score} />
        </div>

        {/* ── 3. SMART INSIGHT CARD ────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff9ee 0%, #fff2dd 100%)',
            borderRadius: 24,
            padding: '18px 20px',
            border: '1px solid #ffe3b8',
            boxShadow: '0 4px 16px rgba(217,119,6,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#d97706', letterSpacing: '0.5px' }}>
              SMART INSIGHT
            </span>
          </div>

          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
            &ldquo;{insight}&rdquo;
          </p>

          {/* Background graphic */}
          <div
            style={{
              position: 'absolute',
              right: -10,
              bottom: -10,
              opacity: 0.12,
              pointerEvents: 'none',
              fontSize: 80,
            }}
          >
            🎯
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px 0 20px' }}>

        {/* ── 4. WEEKLY / MONTHLY TOGGLE SWITCH ───────────────────────────── */}
        <div
          style={{
            background: '#f3f4f6',
            borderRadius: 24,
            padding: 4,
            display: 'flex',
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => setPeriod('WEEKLY')}
            style={{
              flex: 1,
              background: period === 'WEEKLY' ? '#2e4a19' : 'transparent',
              color: period === 'WEEKLY' ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: 20,
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
              boxShadow: period === 'WEEKLY' ? '0 4px 12px rgba(46,74,25,0.25)' : 'none',
            }}
          >
            <span>📈</span> Weekly
          </button>

          <button
            onClick={() => setPeriod('MONTHLY')}
            style={{
              flex: 1,
              background: period === 'MONTHLY' ? '#2e4a19' : 'transparent',
              color: period === 'MONTHLY' ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: 20,
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
              boxShadow: period === 'MONTHLY' ? '0 4px 12px rgba(46,74,25,0.25)' : 'none',
            }}
          >
            <span>📅</span> Monthly
          </button>
        </div>
        {/* ── 5. METRICS & EMPTY STATE ─────────────── */}
        {!hasLogs ? (
          <div
            style={{
              textAlign: 'center',
              padding: '44px 20px',
              background: 'white',
              borderRadius: 24,
              border: '1.5px dashed #e5e7eb',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 2 }}>📊</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#111827' }}>
              No progress tracked yet
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, lineHeight: 1.5, maxWidth: 300 }}>
              Log your daily meals or complete a check-in to unlock health scores, nutrition trends, and smart family insights.
            </div>
            <button
              onClick={() => navigate('/recipes')}
              style={{
                marginTop: 6,
                background: 'linear-gradient(135deg, #ff5e14 0%, #e04800 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 18,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(224, 72, 0, 0.3)',
              }}
            >
              Plan Your First Meal &rsaquo;
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {/* Card 1: Average Calories */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'white',
                borderRadius: 20,
                padding: '14px 16px',
                borderLeft: '5px solid #ea580c',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: '#ffedd5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  🔥
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', letterSpacing: '0.5px' }}>
                    AVERAGE CALORIES
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', marginTop: 2 }}>
                    {healthScore?.avgCalories || 0} <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>kcal/day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 7. FIXED BOTTOM NAVIGATION BAR ──────────────────────────────── */}
      <BottomNav />
    </div>
  )
}
