import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const LeafIcon = ({ size = 20, color = '#4F5C40' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill={color} />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#81C784" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#EBF5E1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const HeartIcon = ({ size = 20, color = '#4F5C40' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ArrowRight = ({ color = 'currentColor' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const TEAM = [
  {
    name: 'Dr. Lakshmi Pillai',
    role: 'Head Nutritionist',
    bio: 'Certified clinical nutritionist with 12+ years helping Kerala families eat healthier.',
    avatar: '👩‍⚕️',
    bg: '#E8F0E3',
  },
  {
    name: 'Rohit Menon',
    role: 'Product Lead',
    bio: 'Building tools that make healthy eating simple, joyful, and culturally rooted.',
    avatar: '👨‍💻',
    bg: '#FFF3E0',
  },
  {
    name: 'Anitha Nair',
    role: 'Kerala Cuisine Expert',
    bio: 'Curating authentic, nutritious Kerala recipes passed down through generations.',
    avatar: '👩‍🍳',
    bg: '#E8F5E9',
  },
]

const VALUES = [
  { icon: '🌿', title: 'Rooted in Culture', desc: 'Every recipe celebrates Kerala\'s rich culinary heritage and traditional wisdom.' },
  { icon: '💚', title: 'Family First', desc: 'Designed for real families — from toddlers to grandparents, everyone thrives together.' },
  { icon: '🔬', title: 'Science-Backed', desc: 'All meal plans and nutrition data are validated by certified dietitians.' },
  { icon: '🛒', title: 'End-to-End Planning', desc: 'From recipes to grocery lists, we handle the full healthy eating journey.' },
]

export default function AboutPage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const bg = isDark ? '#0A0F1D' : '#F5F3EE'
  const card = isDark ? '#1E293B' : '#FFFFFF'
  const text = isDark ? '#F1F5F9' : '#1E293B'
  const muted = '#64748B'
  const green = '#4F5C40'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>

      {/* ── HERO BANNER ── */}
      <div style={{ background: green, padding: '72px 80px 64px 80px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LeafIcon size={28} color="#FFFFFF" />
          </div>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0', letterSpacing: '-0.8px', lineHeight: 1.15 }}>
          About FamilyFit
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 560, margin: '0 auto 32px auto', lineHeight: 1.6 }}>
          We are on a mission to make wholesome Kerala nutrition accessible, personal, and joyful for every family.
        </p>
        <button
          onClick={() => navigate('/recipes')}
          style={{ background: '#FFFFFF', color: green, border: 'none', padding: '14px 32px', borderRadius: 9999, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <span>Explore our recipes</span>
          <ArrowRight color={green} />
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 80px' }}>

        {/* ── OUR STORY ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8F0E3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LeafIcon size={16} color={green} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: green, textTransform: 'uppercase', letterSpacing: 1 }}>Our Story</span>
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 20px 0', lineHeight: 1.2, color: text }}>
              Born in a Kerala kitchen, built for every family.
            </h2>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7, margin: '0 0 16px 0' }}>
              FamilyFit started when a group of nutritionists and parents realized how difficult it was to plan healthy, culturally authentic meals for their families while managing busy schedules.
            </p>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7, margin: 0 }}>
              Rooted in the wholesome traditions of Kerala cuisine — rich in vegetables, legumes, and fresh coconut — we built a platform that combines ancestral wisdom with modern nutrition science to help families eat better, feel stronger, and live healthier every single day.
            </p>
          </div>

          <div style={{ background: '#E8F0E3', borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { num: '500+', label: 'Authentic Kerala recipes' },
              { num: '10,000+', label: 'Families served across Kerala' },
              { num: '98%', label: 'Satisfaction from family meal plans' },
              { num: '15+', label: 'Certified nutritionists on our team' },
            ].map((stat) => (
              <div key={stat.num} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: green, minWidth: 90 }}>{stat.num}</div>
                <div style={{ fontSize: 14, color: muted, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── OUR VALUES ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: green, textTransform: 'uppercase', letterSpacing: 1 }}>What We Believe</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '8px 0 0 0', color: text }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: card, borderRadius: 20, padding: 28, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: text, margin: '0 0 8px 0' }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TEAM ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: green, textTransform: 'uppercase', letterSpacing: 1 }}>The People</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '8px 0 0 0', color: text }}>Meet Our Team</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TEAM.map((member) => (
              <div key={member.name} style={{ background: card, borderRadius: 20, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: member.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px auto' }}>
                  {member.avatar}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: text, margin: '0 0 4px 0' }}>{member.name}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: green, background: '#E8F0E3', padding: '4px 12px', borderRadius: 9999, display: 'inline-block', marginBottom: 12 }}>{member.role}</span>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.6, margin: 0 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div style={{ background: green, borderRadius: 24, padding: '52px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <HeartIcon size={18} color="#FFFFFF" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Join the FamilyFit family</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>Start your healthy journey today.</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Personalized Kerala meal plans for your whole family, starting now.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <button
              onClick={() => navigate('/recipes')}
              style={{ background: '#FFFFFF', color: green, border: 'none', padding: '14px 28px', borderRadius: 9999, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Browse Recipes
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.5)', padding: '14px 28px', borderRadius: 9999, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Go Home
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
