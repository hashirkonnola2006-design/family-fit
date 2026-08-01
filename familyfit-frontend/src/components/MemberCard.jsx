import { useTheme } from '../context/ThemeContext'

// Character illustration URLs matching each member theme
const MEMBER_THEMES = [
  {
    avatarBg: '#ea580c',
    cardBg: '#fff8f2',
    cardBorder: '#fde8d5',
    statBg: '#fff0e6',
    allergyColor: '#ea580c',
    illustration: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
  },
  {
    avatarBg: '#8b5cf6',
    cardBg: '#faf5ff',
    cardBorder: '#ede9fa',
    statBg: '#f3eeff',
    allergyColor: '#4b5563',
    illustration: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
  },
  {
    avatarBg: '#16a34a',
    cardBg: '#f0fdf4',
    cardBorder: '#dcfce7',
    statBg: '#e8fdf0',
    allergyColor: '#ea580c',
    illustration: 'https://cdn-icons-png.flaticon.com/512/4140/4140061.png',
  },
  {
    avatarBg: '#e07b39',
    cardBg: '#fff8f2',
    cardBorder: '#fde8d5',
    statBg: '#fff0e6',
    allergyColor: '#4b5563',
    illustration: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png',
  },
  {
    avatarBg: '#2563eb',
    cardBg: '#eff6ff',
    cardBorder: '#dbeafe',
    statBg: '#e0f0ff',
    allergyColor: '#2563eb',
    illustration: 'https://cdn-icons-png.flaticon.com/512/4140/4140039.png',
  },
]

/**
 * MemberCard — redesigned to match reference screenshot design.
 * Shows avatar initial, character illustration, weight/BMI stats, allergies.
 */
export default function MemberCard({ member, onEdit, themeIndex }) {
  const { isDark } = useTheme()
  if (!member) return null

  const idx = themeIndex !== undefined ? themeIndex : (member.id % MEMBER_THEMES.length)
  const theme = MEMBER_THEMES[idx % MEMBER_THEMES.length]

  const initial = member.name?.[0]?.toUpperCase() || '?'
  const bmi = member.bmi?.toFixed(1) ?? (
    member.weightKg && member.heightCm
      ? (member.weightKg / Math.pow(member.heightCm / 100, 2)).toFixed(1)
      : '—'
  )
  const allergyList = Array.isArray(member.allergies) ? member.allergies : []
  const hasAllergy = allergyList.length > 0

  return (
    <div
      style={{
        background: isDark ? 'linear-gradient(145deg, #141c2e 0%, #1a2540 100%)' : theme.cardBg,
        borderRadius: 20,
        border: `1px solid ${isDark ? '#24324a' : theme.cardBorder}`,
        padding: '14px',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.45)'
          : '0 4px 16px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        overflow: 'hidden',
      }}
      onClick={() => onEdit && onEdit(member)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.06)' }}
    >
      {/* Edit pencil button */}
      {onEdit && (
        <button
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
            color: isDark ? '#9ca3af' : '#6b7280',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            zIndex: 2,
            transition: 'background 0.15s ease',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onEdit(member)
          }}
          title="Edit Member"
        >
          {/* Pencil icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}

      {/* ── Top Row: Avatar + Name/Age ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 36 }}>
        {/* Colored circle avatar */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: theme.avatarBg,
            color: 'white',
            fontWeight: 800,
            fontSize: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${theme.avatarBg}55`,
          }}
        >
          {initial}
        </div>

        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: isDark ? '#f0f6fc' : '#111827', lineHeight: 1.2 }}>
            {member.name}
          </div>
          <div style={{ fontSize: 11, color: isDark ? '#8b949e' : '#6b7280', fontWeight: 600, marginTop: 2 }}>
            {member.age} years • {member.heightCm || '—'} cm
          </div>
        </div>
      </div>

      {/* ── Middle: Illustration + Stats side by side ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        {/* Character illustration */}
        <img
          src={theme.illustration}
          alt={member.name}
          style={{
            width: 64,
            height: 64,
            objectFit: 'contain',
            flexShrink: 0,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
          }}
        />

        {/* Weight + BMI stats */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
          }}
        >
          <div
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : theme.statBg,
              borderRadius: 10,
              padding: '7px 10px',
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: isDark ? '#6e7681' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              WEIGHT
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: isDark ? '#f0f6fc' : '#111827', marginTop: 2 }}>
              {member.weightKg ?? '—'} kg
            </div>
          </div>

          <div
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : theme.statBg,
              borderRadius: 10,
              padding: '7px 10px',
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: isDark ? '#6e7681' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              BMI
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: isDark ? '#f0f6fc' : '#111827', marginTop: 2 }}>
              {bmi}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: Allergies ── */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: isDark ? '#6e7681' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>
          ALLERGIES
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: hasAllergy
              ? (isDark ? '#fb923c' : theme.allergyColor)
              : (isDark ? '#6b7280' : '#4b5563'),
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {hasAllergy ? allergyList.join(', ') : 'None reported'}
        </div>
      </div>
    </div>
  )
}
