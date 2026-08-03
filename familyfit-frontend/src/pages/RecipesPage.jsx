import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import RecipeCard from '../components/RecipeCard'
import { getAllRecipes } from '../api/recipes'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import { RECIPE_DATABASE } from '../data/recipeDatabase'

const FILTER_TABS = [
  {
    id: 'All',
    label: 'All Recipes (500)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    ),
  },
  {
    id: 'Saved',
    label: 'Saved Recipes',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'Kerala',
    label: 'Kerala Specials',
    icon: '🌴',
  },
  {
    id: 'Quick',
    label: 'Quick Meals',
    icon: '⚡',
  },
  {
    id: 'High-Protein',
    label: 'High-Protein',
    icon: '💪',
  },
  {
    id: 'Vegetarian',
    label: 'Vegetarian',
    icon: '🥗',
  },
  {
    id: 'Breakfast',
    label: 'Breakfast',
    icon: '☕',
  },
]

export default function RecipesPage() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [recipes, setRecipes] = useState(RECIPE_DATABASE)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [visibleCount, setVisibleCount] = useState(24)
  const [toast, setToast] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const recipesRes = await getAllRecipes({
          search: search || undefined,
          tag: activeTab !== 'All' && activeTab !== 'Saved' ? activeTab : undefined,
        }).catch(() => ({ data: null }))

        if (Array.isArray(recipesRes?.data) && recipesRes.data.length > 0) {
          setRecipes(recipesRes.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [search, activeTab])

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const getSavedIds = () => {
    try {
      const saved = localStorage.getItem('familyfit_saved_recipes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  const recipeList = Array.isArray(recipes) && recipes.length > 0 ? recipes : RECIPE_DATABASE

  const filteredRecipes = recipeList.filter((r) => {
    // 1. Saved Filter
    if (activeTab === 'Saved') {
      const savedIds = getSavedIds()
      if (!r.favorited && !savedIds.includes(String(r.id))) return false
    }

    // 2. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchesName = (r.name || '').toLowerCase().includes(q)
      const matchesCuisine = (r.cuisine || '').toLowerCase().includes(q)
      const matchesTags = (r.tags || []).some((t) => t.toLowerCase().includes(q))
      const matchesIng = (r.ingredients || []).some((i) => (i.name || '').toLowerCase().includes(q))
      if (!matchesName && !matchesCuisine && !matchesTags && !matchesIng) return false
    }

    // 3. Active Tab Filter
    if (activeTab === 'All' || activeTab === 'Saved') return true
    if (activeTab === 'Quick') return (r.prepTimeMinutes || 20) <= 20
    return (
      (r.cuisine || '').toLowerCase() === activeTab.toLowerCase() ||
      (r.category || '').toLowerCase() === activeTab.toLowerCase() ||
      r.tags?.some((t) => t.toLowerCase().includes(activeTab.toLowerCase()))
    )
  })

  const familyName = family?.name || user?.familyName || 'Healthy Family'
  const initial = (familyName[0] || 'H').toUpperCase()

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: isDark ? '#0a0f1d' : '#fcfaf5',
        paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))',
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: isDark ? '#f8fafc' : '#111827',
        position: 'relative',
        boxShadow: '0 0 40px rgba(0,0,0,0.06)',
        boxSizing: 'border-box',
      }}
    >
      {/* Toast Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e3815',
            color: 'white',
            padding: '12px 22px',
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}

      {/* ── HERO BANNER HEADER ── */}
      <div
        style={{
          position: 'relative',
          background: isDark
            ? 'linear-gradient(135deg, #0f172a 0%, #0a0f1d 100%)'
            : 'linear-gradient(135deg, #f7f4ed 0%, #ebe4d3 100%)',
          padding: 'max(20px, env(safe-area-inset-top, 20px)) 20px 24px 20px',
          overflow: 'hidden',
        }}
      >
        {/* Kerala Food Image positioned at top right */}
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: -20,
            width: 250,
            height: 230,
            borderRadius: '0 0 0 120px',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80"
            alt="Kerala Kadala Curry"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Subtle gradient overlay to blend seamlessly */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isDark
                ? 'linear-gradient(to right, #0f172a 0%, rgba(15,23,42,0.4) 40%, transparent 100%)'
                : 'linear-gradient(to right, #f7f4ed 0%, rgba(247,244,237,0.4) 35%, transparent 100%)',
            }}
          />
        </div>

        {/* Header Top Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#25451c" strokeWidth="2.6">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: isDark ? '#34d399' : '#25451c',
                letterSpacing: '-0.3px',
              }}
            >
              Family Fit
            </span>
          </div>

          {/* User Profile Avatar */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: isDark ? '#34d399' : '#25451c',
              color: isDark ? '#0f172a' : 'white',
              fontWeight: 800,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {initial}
            {/* Orange Status Dot */}
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: '#ff6b00',
                border: '2px solid white',
              }}
            />
          </div>
        </div>

        {/* Main Hero Header Title */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 270, marginBottom: 22 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
              fontSize: 34,
              fontWeight: 900,
              color: isDark ? '#f8fafc' : '#1b3815',
              margin: '0 0 6px 0',
              lineHeight: 1.12,
              letterSpacing: '-0.4px',
            }}
          >
            Kerala Recipes (500)
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: isDark ? '#94a3b8' : '#405837',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            Authentic South Indian & Malabar meal plans.
          </p>
        </div>

        {/* Search Bar Input Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: 30,
            padding: '6px 6px 6px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 6px 20px rgba(0,0,0,0.06)',
            border: isDark ? '1px solid #334155' : '1px solid #f0eee8',
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
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: 13.5,
              color: isDark ? '#f8fafc' : '#374151',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
          />

          {/* Right Filter Button */}
          <button
            onClick={() => {
              setShowFilterModal(!showFilterModal)
              showToastMsg('Filter options opened! 🎛️')
            }}
            aria-label="Filter"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: isDark ? 'rgba(52,211,153,0.18)' : '#e4edd4',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.15s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#34d399' : '#25451c'} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="17" x2="20" y2="17" />
              <circle cx="9" cy="7" r="2.5" fill={isDark ? '#0f172a' : '#e4edd4'} />
              <circle cx="15" cy="17" r="2.5" fill={isDark ? '#0f172a' : '#e4edd4'} />
            </svg>
          </button>
        </div>
      </div>

      {/* ── MAIN BODY CONTENT ── */}
      <div style={{ padding: '20px 20px 0 20px' }}>

        {/* Explore Recipes Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                margin: 0,
                color: isDark ? '#f8fafc' : '#1b2a1a',
                display: 'inline-block',
                position: 'relative',
              }}
            >
              Explore Recipes (500)
              {/* Short green underline under Explore Recipes */}
              <span
                style={{
                  display: 'block',
                  width: '100%',
                  height: 2.5,
                  background: isDark ? '#34d399' : '#25451c',
                  borderRadius: 2,
                  marginTop: 2,
                }}
              />
            </h2>
          </div>

          <div
            onClick={() => {
              setActiveTab('All')
              setSearch('')
              showToastMsg('Showing all 500 recipes!')
            }}
            style={{
              fontSize: 13,
              color: isDark ? '#34d399' : '#25451c',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>View all</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Horizontal Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 10,
            marginBottom: 16,
            scrollbarWidth: 'none',
          }}
        >
          {FILTER_TABS.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  border: active
                    ? 'none'
                    : isDark ? '1px solid #334155' : '1px solid #d4dfc4',
                  background: active
                    ? isDark ? '#34d399' : '#25451c'
                    : isDark ? '#1e293b' : '#ffffff',
                  color: active
                    ? isDark ? '#0f172a' : 'white'
                    : isDark ? '#94a3b8' : '#25451c',
                  padding: '8px 16px',
                  borderRadius: 18,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                  boxShadow: active ? '0 3px 10px rgba(37,69,28,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {typeof t.icon === 'string' ? (
                  <span>{t.icon}</span>
                ) : (
                  <span>{t.icon}</span>
                )}
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Recipe Grid (2 Columns) */}
        <div>
          {filteredRecipes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: isDark ? '#141c2e' : '#ffffff',
                borderRadius: 20,
                border: isDark ? '1px solid #24324a' : '1px dashed #d4dfc4',
                margin: '10px 0',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>{activeTab === 'Saved' ? '♥️' : '🥗'}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: isDark ? '#f8fafc' : '#111827', marginBottom: 6 }}>
                {activeTab === 'Saved' ? 'No saved recipes yet' : `No recipes found for "${activeTab}"`}
              </div>
              <div style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 500, maxWidth: 280, margin: '0 auto' }}>
                {activeTab === 'Saved'
                  ? 'Tap the heart icon on any recipe to save it here.'
                  : 'Try searching for a different dish or select another category tab.'}
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {filteredRecipes.slice(0, visibleCount).map((r) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    onClick={() => navigate(`/recipes/${r.id}`)}
                  />
                ))}
              </div>

              {visibleCount < filteredRecipes.length && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    style={{
                      background: isDark ? '#34d399' : '#25451c',
                      color: isDark ? '#0f172a' : 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(37,69,28,0.25)',
                    }}
                  >
                    Load More Recipes ({visibleCount} of {filteredRecipes.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
