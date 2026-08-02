import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import RecipeCard from '../components/RecipeCard'
import { getAllRecipes, getRecommendedRecipes } from '../api/recipes'
import { getAllPlans } from '../api/plans'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import { useGrocery } from '../context/GroceryContext'
import { KERALA_RECIPES } from '../data/keralaRecipesData'

const RECIPE_FILTER_TAGS = [
  { id: 'All', label: 'All Recipes', icon: '⊞' },
  { id: 'Recommended', label: 'Recommended', icon: '⭐' },
  { id: 'Weight Loss', label: 'Weight Loss', icon: '🏋️' },
  { id: 'Diabetes', label: 'Diabetes', icon: '💧' },
  { id: 'Kids', label: 'Kid-Friendly', icon: '🙂' },
  { id: 'High-Protein', label: 'High-Protein', icon: '⚡' },
  { id: 'Breakfast', label: 'Breakfast', icon: '☼' },
  { id: 'Dinner', label: 'Dinner', icon: '🍱' },
]

const DEMO_PLANS = [
  {
    id: 1,
    name: 'Kerala Family Thali Plan',
    description: 'Balanced Kerala nutrients with Matta rice, Parippu curry, Thoran, Fish Curry & fresh curd.',
    tags: ['family', 'balanced'],
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80',
    accent: '#5e8404',
  },
  {
    id: 2,
    name: 'Malabar High-Protein Plan',
    description: 'Coastal protein diet featuring Mathi (sardine), Meen Curry, Nadan Chicken & Country Eggs.',
    tags: ['high-protein', 'coastal'],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    accent: '#ff5e14',
  },
  {
    id: 3,
    name: 'Diabetes-Friendly Kerala Plan',
    description: 'Low-GI Kerala meals with Cherupayar, Matta red rice, Avial & Kudampuli Fish Curry.',
    tags: ['diabetes', 'low-gi'],
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    accent: '#2563eb',
  },
  {
    id: 4,
    name: 'Kids Special Malabar Plan',
    description: 'Soft Appam & Veg Stew, Puttu & Kadala, Idiyappam, and Pazham Pori banana snacks.',
    tags: ['kids', 'traditional'],
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    accent: '#d97706',
  },
]

const ACCENT_COLORS = ['#5e8404', '#ff5e14', '#2563eb', '#d97706']

export default function RecipesPage() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const { addItemsFromPlan } = useGrocery()
  const navigate = useNavigate()

  const [plans, setPlans]             = useState(DEMO_PLANS)
  const [recipes, setRecipes]         = useState(KERALA_RECIPES)
  const [search, setSearch]           = useState('')
  const [activeTag, setActiveTag]     = useState('All')
  const [toast, setToast]             = useState('')

  useEffect(() => {
    async function load() {
      try {
        const familyId = family?.id || 1
        const [plansRes, recipesRes] = await Promise.all([
          getAllPlans().catch(() => ({ data: null })),
          getAllRecipes({
            search: search || undefined,
            tag: activeTag !== 'All' && activeTag !== 'Recommended' ? activeTag : undefined,
          }).catch(() => ({ data: null })),
        ])

        if (Array.isArray(plansRes?.data) && plansRes.data.length > 0) {
          setPlans(plansRes.data)
        }
        if (Array.isArray(recipesRes?.data) && recipesRes.data.length > 0) {
          setRecipes(recipesRes.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [search, activeTag, family])

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }

  const handleSelectPlan = (e, plan) => {
    e.stopPropagation()
    if (typeof addItemsFromPlan === 'function') {
      addItemsFromPlan(plan)
    }
    showToastMsg(`Added ingredients for "${plan.name}" to Grocery list! 🛒`)
  }

  const recipeList = Array.isArray(recipes) && recipes.length > 0 ? recipes : KERALA_RECIPES
  const filteredRecipes = recipeList.filter((r) => {
    // 1. Search Query Filter
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchesName = (r.name || '').toLowerCase().includes(q)
      const matchesDesc = (r.whyItsGood || '').toLowerCase().includes(q)
      const matchesTags = (r.tags || []).some((t) => t.toLowerCase().includes(q))
      if (!matchesName && !matchesDesc && !matchesTags) return false
    }

    // 2. Active Tag Filter
    if (activeTag === 'All') return true
    if (activeTag === 'Recommended') return r.matchBadgeText || r.favorited
    return r.tags?.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()))
  })

  const familyName = family?.name || user?.familyName || 'Healthy Family'
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
      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111827',
            color: 'white',
            padding: '12px 22px',
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {toast}
        </div>
      )}

      {/* ── 1. TOP HEADER BAR ── */}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e5b12" strokeWidth="2.5">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2e5b12', letterSpacing: '-0.3px' }}>
              Family Fit
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              onClick={() => navigate('/profile')}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#2e5b12',
                color: 'white',
                fontWeight: 800,
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(46,91,18,0.3)',
              }}
            >
              {initial}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
          Kerala Recipes ({recipeList.length})
        </h1>
        <p style={{ fontSize: 14, color: '#3d6b24', fontWeight: 600, margin: 0 }}>
          Authentic South Indian & Malabar meal plans.
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18 }}>
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
              placeholder="Search recipes, meen pollichathu, avial, appam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, color: '#374151', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0 20px' }}>

        {/* ── 2. TOP SECTION: HORIZONTALLY SCROLLABLE KERALA PLANS ── */}
        {!search && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#5e8404', fontSize: 18 }}>🌿</span>
                <h2 style={{ fontSize: 19, fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
                  Curated Kerala Plans
                </h2>
              </div>
              <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Scroll &rsaquo;</span>
            </div>

            {/* Horizontal Scroll Cards */}
            <div
              style={{
                display: 'flex',
                gap: 14,
                overflowX: 'auto',
                paddingBottom: 10,
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
              }}
            >
              {plans.map((p) => (
                <div
                  key={p.id}
                  style={{
                    flexShrink: 0,
                    width: 260,
                    borderRadius: 22,
                    background: isDark ? '#161b22' : 'white',
                    boxShadow: isDark ? '0 4px 18px rgba(0,0,0,0.3)' : '0 6px 20px rgba(0,0,0,0.06)',
                    border: isDark ? '1px solid #21262d' : '1px solid #f0ede8',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    scrollSnapAlign: 'start',
                    position: 'relative',
                  }}
                >
                  {/* Card Image Banner */}
                  <div
                    style={{
                      height: 120,
                      backgroundImage: `url('${p.imageUrl}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                      }}
                    />
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 6 }}>
                      {(p.tags || ['Balanced']).slice(0, 2).map((t) => (
                        <span
                          key={t}
                          style={{
                            background: 'rgba(255,255,255,0.92)',
                            color: '#2e5b12',
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '3px 9px',
                            borderRadius: 10,
                            textTransform: 'capitalize',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px 0', color: isDark ? '#f0f6fc' : '#111827', lineHeight: 1.25 }}>
                        {p.name}
                      </h3>
                      <p style={{ fontSize: 12, color: isDark ? '#8b949e' : '#6b7280', margin: 0, lineHeight: 1.4, height: 34, overflow: 'hidden' }}>
                        {p.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleSelectPlan(e, p)}
                      style={{
                        marginTop: 12,
                        width: '100%',
                        background: 'linear-gradient(135deg, #5e8404 0%, #3d6b3f 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '9px 12px',
                        borderRadius: 14,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        boxShadow: '0 3px 10px rgba(61,107,63,0.25)',
                      }}
                    >
                      <span>🌿</span> Select Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. FILTER CHIPS FOR RECIPES ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 style={{ fontSize: 19, fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
              Explore Recipes ({filteredRecipes.length})
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
            {RECIPE_FILTER_TAGS.map((t) => {
              const active = activeTag === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTag(t.id)}
                  style={{
                    border: active ? 'none' : `1px solid ${isDark ? '#30363d' : '#d1dca7'}`,
                    background: active ? '#2e4a19' : isDark ? '#161b22' : '#fafcf0',
                    color: active ? 'white' : isDark ? '#8b949e' : '#2e5b12',
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 4. RECIPES 2-COLUMN GRID ── */}
        <div>
          {filteredRecipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🥗</div>
              <div style={{ fontWeight: 700 }}>No Kerala recipes found for "{activeTag}"</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {filteredRecipes.map((r, i) => (
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

      <BottomNav />
    </div>
  )
}
