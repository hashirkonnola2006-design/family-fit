import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useFamily } from '../context/FamilyContext'
import { evaluateRecipeHealth } from '../utils/healthEvaluation'

/**
 * RecipeCard — exact match to screenshot specification.
 */
export default function RecipeCard({ recipe: initialRecipe, onClick, onToggleSaved, activeMember: passedMember }) {
  const [recipe, setRecipe] = useState(initialRecipe)
  const { isDark } = useTheme()
  const { activeMember: contextMember } = useFamily()
  const member = passedMember || contextMember

  if (!recipe) return null

  const health = evaluateRecipeHealth(recipe, member)

  const getSavedIds = () => {
    try {
      const saved = localStorage.getItem('familyfit_saved_recipes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  const isFavorited = Boolean(recipe.favorited || getSavedIds().includes(String(recipe.id)))

  const handleFavorite = (e) => {
    e.stopPropagation()
    const currentSaved = getSavedIds()
    const idStr = String(recipe.id)
    let updatedSaved = []
    if (currentSaved.includes(idStr)) {
      updatedSaved = currentSaved.filter((i) => i !== idStr)
    } else {
      updatedSaved = [...currentSaved, idStr]
    }
    localStorage.setItem('familyfit_saved_recipes', JSON.stringify(updatedSaved))
    const updatedRecipe = { ...recipe, favorited: updatedSaved.includes(idStr) }
    setRecipe(updatedRecipe)
    if (typeof onToggleSaved === 'function') {
      onToggleSaved(updatedRecipe)
    }
  }

  const tags = recipe.tags || ['Breakfast', 'Kids']

  // Determine badge text fallback if not explicitly provided
  const badgeText =
    recipe.matchBadgeText ||
    (recipe.id === 1 ? '100% Family Favorite' :
     recipe.id === 2 ? 'High Protein Breakfast' :
     recipe.id === 3 ? 'Complete Protein' :
     recipe.id === 4 ? 'Low GI Dosa' :
     'Family Favorite')

  return (
    <div
      onClick={onClick}
      style={{
        background: isDark ? '#141c2e' : '#ffffff',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 6px 24px rgba(0,0,0,0.4)'
          : '0 4px 18px rgba(0,0,0,0.05)',
        border: isDark ? '1px solid #24324a' : '1px solid #f0ede6',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'none')}
    >
      {/* Recipe Image */}
      <div style={{ position: 'relative', width: '100%', height: 145, overflow: 'hidden' }}>
        <img
          src={recipe.imageUrl || recipe.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80'}
          alt={recipe.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        {/* Top-Left Match Badge */}
        {badgeText && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(4px)',
              color: isDark ? '#34d399' : '#1c3815',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 9px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              letterSpacing: '-0.1px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span>{badgeText}</span>
          </span>
        )}

        {/* Top-Right Favorite Button */}
        <button
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: isDark ? 'rgba(15,23,42,0.85)' : '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={isFavorited ? '#e11d48' : 'none'}
            stroke={isFavorited ? '#e11d48' : (isDark ? '#94a3b8' : '#374151')}
            strokeWidth="2.2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: 14.5, color: isDark ? '#f8fafc' : '#111827', margin: '0 0 8px 0', lineHeight: 1.25, minHeight: 36 }}>
            {recipe.name}
          </h4>

          {/* Tag Badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {tags.slice(0, 2).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: isDark ? 'rgba(52,211,153,0.15)' : '#edf6db',
                  color: isDark ? '#34d399' : '#2b531e',
                  padding: '3px 9px',
                  borderRadius: 10,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Calories & Health Indicator */}
        <div style={{ fontSize: 11.5, color: isDark ? '#94a3b8' : '#4b5563', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#f97316' }}>🔥</span> {recipe.kcal || recipe.calories || 300} kcal
            </span>

            {/* Red / Green Health Badge near kcal */}
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                color: health.color,
                background: isDark ? (health.status === 'bad' ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)') : health.bg,
                padding: '2px 7px',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                border: `1px solid ${health.color}33`,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: health.color, display: 'inline-block' }} />
              {health.status === 'bad' ? (health.text.includes('Allergy') ? 'Unhealthy (Allergy)' : 'Unhealthy') : 'Very Healthy'}
            </span>
          </div>

          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#6b7280' }}>⏱️</span> {recipe.prepTimeMinutes || 20} mins
          </span>
        </div>
      </div>
    </div>
  )
}

