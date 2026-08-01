const MEAL_ICONS = { BREAKFAST: '☼', LUNCH: '☼', DINNER: '🌙', SNACK: '🍎' }

/**
 * MealCard — displays meal image, type, name, and kcal.
 * Props: meal {MealDTO}, onClick?, variant?: 'default' | 'circle'
 */
export default function MealCard({ meal, onClick, variant = 'default' }) {
  if (!meal) return null
  const icon = MEAL_ICONS[meal.type] || '🍽️'

  if (variant === 'circle') {
    return (
      <div
        className="card animate-fade-up"
        style={{
          padding: '16px 14px',
          textAlign: 'center',
          cursor: onClick ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 165,
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        }}
        onClick={onClick}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#8e9b90',
            letterSpacing: '0.8px',
            marginBottom: 12,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>{icon}</span> {meal.type}
        </div>
        <img
          src={meal.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=70'}
          alt={meal.name}
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: 12,
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          }}
          loading="lazy"
        />
        <div
          style={{
            fontWeight: 800,
            fontSize: 14,
            color: 'var(--color-text-primary)',
            lineHeight: 1.25,
            marginBottom: 4,
            height: 36,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {meal.name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
          {meal.kcal} kcal
        </div>
      </div>
    )
  }

  return (
    <div className="meal-card" onClick={onClick}>
      <img
        className="meal-card-img"
        src={meal.imageUrl || `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=70`}
        alt={meal.name}
        loading="lazy"
      />
      <div className="meal-card-body">
        <div className="meal-type-label">
          <span>{icon}</span>
          <span>{meal.type?.charAt(0) + meal.type?.slice(1).toLowerCase()}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4, lineHeight: 1.3 }}>
          {meal.name}
        </div>
        <div className="kcal-badge">
          🔥 {meal.kcal} kcal
        </div>
      </div>
    </div>
  )
}
