import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import { RECIPE_DATABASE } from '../data/recipeDatabase'
import { getAllRecipes } from '../api/recipes'

// ── FILTER TABS ──
const FILTER_TABS = [
  { id: 'All',          label: 'All Recipes (500)', icon: '▦' },
  { id: 'Saved',        label: 'Saved Recipes',     icon: '♡' },
  { id: 'Kerala',       label: 'Kerala Specials',   icon: '🌴' },
  { id: 'Quick',        label: 'Quick Meals',        icon: '⚡' },
  { id: 'High-Protein', label: 'High-Protein',       icon: '💪' },
  { id: 'Vegetarian',   label: 'Vegetarian',         icon: '🥗' },
  { id: 'Breakfast',    label: 'Breakfast',           icon: '☕' },
]

// Category tag colors matching the reference
const TAG_COLORS = {
  Breakfast:      { bg: '#2D5A27', text: '#FFFFFF' },
  'High-Protein': { bg: '#1A2E1A', text: '#FFFFFF' },
  Vegetarian:     { bg: '#3D6B38', text: '#FFFFFF' },
  Kerala:         { bg: '#4A7C59', text: '#FFFFFF' },
  Quick:          { bg: '#5A6E2A', text: '#FFFFFF' },
  default:        { bg: '#2D5A27', text: '#FFFFFF' },
}

function getTagColor(tag) {
  return TAG_COLORS[tag] || TAG_COLORS.default
}

function HeartIcon({ filled = false, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#EF4444' : 'none'} stroke={filled ? '#EF4444' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F97316" stroke="none">
      <path d="M12 2c1 3 4 4.5 4 9a6 6 0 1 1-12 0c0-4 3.5-7 5-9 0 2.5 1.5 3.5 3 2z"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function FilterIcon({ color = '#2D5A27' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="9" cy="7" r="2.5" fill={color} />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="15" cy="17" r="2.5" fill={color} />
    </svg>
  )
}

function ChevronDown({ color = '#374151' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ── RECIPE CARD ──
function RecipeCard({ recipe, onFavorite, isFavorited, onClick }) {
  const tag = recipe.category || recipe.tags?.[0] || 'Vegetarian'
  const tagStyle = getTagColor(tag)
  const kcal = recipe.calories || recipe.macros?.calories || 300
  const time = recipe.prepTimeMinutes || recipe.totalTime || 25

  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        border: '1px solid #F3F4F6',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden', background: '#F9FAFB' }}>
        <img
          src={recipe.image || recipe.imageUrl || `https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=75`}
          alt={recipe.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=75' }}
        />
        {/* Category tag pill - bottom left of image */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          background: tagStyle.bg, color: tagStyle.text,
          fontSize: 11, fontWeight: 700,
          padding: '4px 10px', borderRadius: 9999,
          letterSpacing: 0.2,
        }}>
          {tag}
        </div>
        {/* Favorite button - top right */}
        <button
          onClick={e => { e.stopPropagation(); onFavorite(recipe.id) }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32, borderRadius: '50%',
            background: '#FFFFFF', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s',
          }}
        >
          <HeartIcon filled={isFavorited} size={15} />
        </button>
      </div>
      {/* Body */}
      <div style={{ padding: '14px 14px 16px 14px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 10px 0', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {recipe.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FlameIcon />
            <span>{kcal} kcal</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockIcon />
            <span>{time} mins</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ──
export default function RecipesPage() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [recipes, setRecipes] = useState(RECIPE_DATABASE)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [visibleCount, setVisibleCount] = useState(8)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('familyfit_saved_recipes') || '[]') } catch { return [] }
  })
  const [sortBy, setSortBy] = useState('Popular')

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllRecipes({ search: search || undefined, tag: activeTab !== 'All' && activeTab !== 'Saved' ? activeTab : undefined }).catch(() => ({ data: null }))
        if (Array.isArray(res?.data) && res.data.length > 0) setRecipes(res.data)
      } catch {}
    }
    load()
  }, [search, activeTab])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const sid = String(id)
      const next = prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]
      localStorage.setItem('familyfit_saved_recipes', JSON.stringify(next))
      return next
    })
  }

  const recipeList = Array.isArray(recipes) && recipes.length > 0 ? recipes : RECIPE_DATABASE

  const filtered = useMemo(() => {
    let list = [...recipeList]
    if (activeTab === 'Saved') list = list.filter(r => favorites.includes(String(r.id)))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.cuisine || '').toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeTab !== 'All' && activeTab !== 'Saved' && activeTab !== 'Quick') {
      list = list.filter(r =>
        (r.cuisine || '').toLowerCase() === activeTab.toLowerCase() ||
        (r.category || '').toLowerCase() === activeTab.toLowerCase() ||
        r.tags?.some(t => t.toLowerCase().includes(activeTab.toLowerCase()))
      )
    }
    if (activeTab === 'Quick') list = list.filter(r => (r.prepTimeMinutes || 20) <= 20)
    return list
  }, [recipeList, activeTab, search, favorites])

  const bg = isDark ? '#0A0F1D' : '#F8F6F1'
  const card = isDark ? '#1E293B' : '#FFFFFF'
  const textPrimary = isDark ? '#F1F5F9' : '#111827'
  const textMuted = isDark ? '#94A3B8' : '#6B7280'
  const green = '#2D5A27'
  const greenLight = isDark ? '#1A2E1A' : '#F0F5EC'

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", color: textPrimary }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        position: 'relative',
        background: isDark
          ? '#0F1A0A url(/kerala_recipes_hero.png) no-repeat center right / cover'
          : '#EDE8DE url(/kerala_recipes_hero.png) no-repeat center right / cover',
        overflow: 'hidden',
        minHeight: 340,
        display: 'flex',
        alignItems: 'center',
        padding: '40px 60px',
      }}>
        {/* Left content positioned over blank area */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '50%', flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: green, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
            DISCOVER
          </span>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: isDark ? '#FFFFFF' : '#111827', margin: '0 0 12px 0', lineHeight: 1.1, letterSpacing: '-0.5px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            Kerala Recipes
          </h1>
          <p style={{ fontSize: 15, color: textMuted, margin: '0 0 28px 0', lineHeight: 1.6, fontWeight: 500 }}>
            Authentic South Indian & Malabar meal plans,<br />made simple and wholesome.
          </p>

          {/* Search Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: isDark ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
            borderRadius: 9999, padding: '8px 8px 8px 20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            maxWidth: 420,
          }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search recipes, meen pollichathu, avial, appam..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, color: textPrimary, background: 'transparent', fontFamily: 'inherit' }}
            />
            <button style={{
              width: 36, height: 36, borderRadius: '50%',
              background: isDark ? '#2D3A20' : '#EDF4E8',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
            }}>
              <FilterIcon color={green} />
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, fontSize: 13, color: textMuted, fontWeight: 600, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: green }}>🌿</span> 500+ Recipes
            </span>
            <span style={{ color: '#D1D5DB' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🍱</span> Healthy & Wholesome
            </span>
            <span style={{ color: '#D1D5DB' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>♡</span> Made for Families
            </span>
          </div>
        </div>
      </div>


      {/* ── FILTER TABS ── */}
      <div style={{ background: isDark ? '#111827' : '#FFFFFF', borderBottom: `1px solid ${isDark ? '#1F2937' : '#F3F4F6'}`, padding: '0 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', padding: '12px 0' }}>
          {FILTER_TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px',
                  borderRadius: 9999,
                  border: active ? 'none' : `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                  background: active ? green : 'transparent',
                  color: active ? '#FFFFFF' : textMuted,
                  fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
        <button
          onClick={() => { setActiveTab('All'); setSearch('') }}
          style={{ background: 'none', border: 'none', color: green, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, padding: '0 0 0 16px', flexShrink: 0 }}
        >
          View all <span>→</span>
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 60px 60px 60px' }}>

        {/* Explore Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, margin: 0 }}>
            Explore Recipes
          </h2>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: isDark ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
              borderRadius: 9999, padding: '7px 14px',
              fontSize: 13, fontWeight: 600, color: textPrimary, cursor: 'pointer',
            }}
          >
            {sortBy} <ChevronDown color={textMuted} />
          </button>
        </div>

        {/* Recipe Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: card, borderRadius: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{activeTab === 'Saved' ? '♡' : '🥗'}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: textPrimary, marginBottom: 6 }}>
              {activeTab === 'Saved' ? 'No saved recipes yet' : `No recipes found`}
            </div>
            <div style={{ fontSize: 13, color: textMuted }}>
              {activeTab === 'Saved' ? 'Tap the heart icon on any recipe to save it.' : 'Try a different search or category.'}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 36 }}>
              {filtered.slice(0, visibleCount).map(r => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  isFavorited={favorites.includes(String(r.id))}
                  onFavorite={toggleFavorite}
                  onClick={() => navigate(`/recipes/${r.id}`)}
                />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  style={{
                    background: green, color: '#FFFFFF', border: 'none',
                    padding: '13px 32px', borderRadius: 9999,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(45,90,39,0.25)',
                    transition: 'transform 0.15s',
                  }}
                >
                  Load More Recipes ({visibleCount} of {filtered.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Responsive CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="max-width: 50%"] {
            max-width: 100% !important;
          }
          div[style*="padding: 40px 60px"] {
            padding: 32px 20px !important;
          }
          div[style*="padding: 0 60px"] {
            padding: 0 16px !important;
          }
          div[style*="padding: 32px 60px 60px 60px"] {
            padding: 24px 16px 40px 16px !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
        }
        ::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  )
}
