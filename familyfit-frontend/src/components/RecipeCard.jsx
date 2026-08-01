import { useState } from 'react'
import { toggleFavorite } from '../api/recipes'
import { useTheme } from '../context/ThemeContext'

/**
 * RecipeCard — dark-mode-aware recipe card.
 */
export default function RecipeCard({ recipe: initialRecipe, onClick, accentColor }) {
  const [recipe, setRecipe] = useState(initialRecipe)
  const [toggling, setToggling] = useState(false)
  const { isDark } = useTheme()

  if (!recipe) return null

  const handleFavorite = async (e) => {
    e.stopPropagation()
    if (toggling) return
    setToggling(true)
    try {
      const { data } = await toggleFavorite(recipe.id)
      setRecipe(data)
    } catch (err) {
      setRecipe(r => ({ ...r, favorited: !r.favorited }))
    } finally {
      setToggling(false)
    }
  }

  const tags = recipe.tags || ['Breakfast', 'Quick']
  const isFavorited = recipe.favorited

  return (
    <div
      onClick={onClick}
      style={{
        background: isDark
          ? 'linear-gradient(145deg, #141c2e 0%, #182238 100%)'
          : 'white',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.5)'
          : '0 8px 24px rgba(0,0,0,0.06)',
        border: isDark ? '1px solid #24324a' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: accentColor ? `5px solid ${accentColor}` : undefined,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.transform = 'none')}
    >
      {/* Recipe Image */}
      <div style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80'}
          alt={recipe.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        {/* Family Match Pill */}
        {recipe.matchBadgeText && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: isDark ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(6px)',
              color: isDark ? '#34d399' : '#2e5b12',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              border: isDark ? '1px solid rgba(52,211,153,0.3)' : 'none',
            }}
          >
            <span>👥</span> {recipe.matchBadgeText}
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.92)',
            border: isDark ? '1px solid #334155' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorited ? '#ef4444' : 'none'} stroke={isFavorited ? '#ef4444' : (isDark ? '#94a3b8' : '#6b7280')} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: 15, color: isDark ? '#f8fafc' : '#111827', margin: '0 0 8px 0', lineHeight: 1.25 }}>
            {recipe.name}
          </h4>

          {/* Tag Badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {tags.slice(0, 2).map((t) => {
              const isBlue = t.toLowerCase().includes('dinner')
              return (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: isDark
                      ? isBlue ? 'rgba(37,99,235,0.2)' : 'rgba(16,185,129,0.18)'
                      : isBlue ? '#e0f2fe' : '#edf7d8',
                    color: isDark
                      ? isBlue ? '#60a5fa' : '#34d399'
                      : isBlue ? '#0369a1' : '#3d6b24',
                    padding: '3px 10px',
                    borderRadius: 10,
                    border: isDark
                      ? isBlue ? '1px solid rgba(96,165,250,0.25)' : '1px solid rgba(52,211,153,0.25)'
                      : 'none',
                  }}
                >
                  {t}
                </span>
              )
            })}
          </div>
        </div>

        {/* Calories & Prep Time */}
        <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#ff5e14' }}>🔥</span> {recipe.kcal} kcal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#8b5cf6' }}>⏱️</span> {recipe.prepTimeMinutes} mins
          </span>
        </div>
      </div>
    </div>
  )
}
