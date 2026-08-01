import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import RecipeCard from '../components/RecipeCard'
import { getAllRecipes, getRecommendedRecipes } from '../api/recipes'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'

const FILTER_TAGS = [
  { id: 'All', label: 'All', icon: '⊞' },
  { id: 'Recommended', label: 'Recommended', icon: '⭐' },
  { id: 'Breakfast', label: 'Breakfast', icon: '☼' },
  { id: 'Lunch', label: 'Lunch', icon: '☕' },
  { id: 'Dinner', label: 'Dinner', icon: '🍱' },
]

const ACCENT_COLORS = ['#5e8404', '#ff5e14', '#2563eb', '#d97706']

const DEMO_RECIPES = [
  {
    id: 1,
    name: 'Grilled Chicken Quinoa Bowl',
    kcal: 520,
    prepTimeMinutes: 25,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    tags: ['High-Protein', 'Lunch'],
    matchBadgeText: '100% Family Match',
    favorited: true,
  },
  {
    id: 2,
    name: 'Herb-Baked Salmon with Vegetables',
    kcal: 480,
    prepTimeMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    tags: ['Dinner', 'Gluten-Free'],
    matchBadgeText: 'Suitable for 3 Members',
    favorited: false,
  },
  {
    id: 3,
    name: 'Smashed Avocado Egg Toast',
    kcal: 290,
    prepTimeMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    tags: ['Breakfast', 'Quick'],
    matchBadgeText: 'Great for Parents',
    favorited: false,
  },
  {
    id: 4,
    name: 'Overnight Oats with Berries',
    kcal: 350,
    prepTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80',
    tags: ['Breakfast', 'High-Fibre'],
    matchBadgeText: 'Kids Favorite',
    favorited: true,
  },
  {
    id: 5,
    name: 'Red Lentil & Vegetable Soup',
    kcal: 320,
    prepTimeMinutes: 35,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    tags: ['Dinner', 'Vegan'],
    matchBadgeText: 'Heart Healthy',
    favorited: false,
  },
  {
    id: 6,
    name: '2-Ingredient Banana Pancakes',
    kcal: 220,
    prepTimeMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    tags: ['Breakfast', 'Kids'],
    matchBadgeText: '100% Kids Match',
    favorited: false,
  },
]

export default function RecipesPage() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [recipes, setRecipes]         = useState(DEMO_RECIPES)
  const [recommended, setRecommended] = useState([])
  const [search, setSearch]           = useState('')
  const [activeTag, setActiveTag]     = useState('All')
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const familyId = family?.id || 1
        if (activeTag === 'Recommended') {
          const res = await getRecommendedRecipes(familyId).catch(() => ({ data: null }))
          if (Array.isArray(res?.data) && res.data.length > 0) {
            setRecipes(res.data)
          }
        } else {
          const [allRes, recRes] = await Promise.all([
            getAllRecipes({
              search: search || undefined,
              tag: activeTag !== 'All' ? activeTag : undefined,
            }).catch(() => ({ data: null })),
            getRecommendedRecipes(familyId).catch(() => ({ data: null })),
          ])
          if (Array.isArray(allRes?.data) && allRes.data.length > 0) {
            setRecipes(allRes.data)
          }
          if (Array.isArray(recRes?.data) && recRes.data.length > 0) {
            setRecommended(recRes.data)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [search, activeTag, family])

  const recipeList = Array.isArray(recipes) && recipes.length > 0 ? recipes : DEMO_RECIPES
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
        {/* Brand Bar */}
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
          Recipes
        </h1>
        <p style={{ fontSize: 15, color: '#3d6b24', fontWeight: 600, margin: 0 }}>
          Make every meal count.
        </p>

        {/* ── 2. SEARCH BAR & FILTER BUTTON ───────────────────────────────── */}
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
              placeholder="Search recipes..."
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
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

        {/* ── 4. RECOMMENDED FOR YOUR FAMILY ───────────────────────────────── */}
        {activeTag === 'All' && recommended.length > 0 && !search && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#ff5e14', fontSize: 16 }}>✦</span>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: '#111827' }}>
                  Recommended for Your Family
                </h2>
              </div>
              <button
                onClick={() => setActiveTag('Recommended')}
                style={{ background: 'none', border: 'none', color: '#3d6b24', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                View all &rsaquo;
              </button>
            </div>

            {/* Horizontal 2-Column Cards Grid matching screenshot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {recommended.slice(0, 2).map((r) => (
                <RecipeCard key={r.id} recipe={r} onClick={() => navigate(`/recipes/${r.id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* ── 5. ALL RECIPES 2-COLUMN GRID ─────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>
              {activeTag === 'Recommended' ? 'All Recommended Recipes' : 'All Recipes'}
            </h2>
            <button
              style={{ background: 'none', border: 'none', color: '#3d6b24', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              View all &rsaquo;
            </button>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : recipeList.length === 0 ? (
            <div className="error-state">
              <p>No recipes found for "{activeTag}"</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {recipeList.map((r, i) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                  onClick={() => navigate(`/recipes/${r.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 6. FIXED BOTTOM NAVIGATION BAR ──────────────────────────────── */}
      <BottomNav />
    </div>
  )
}
