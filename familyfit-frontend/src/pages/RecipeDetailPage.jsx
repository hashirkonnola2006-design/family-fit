import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipeDetail } from '../api/recipes'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import BottomNav from '../components/BottomNav'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const familyId = family?.id || 1
        const { data } = await getRecipeDetail(id, familyId)
        setRecipe(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, family])

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const handleAddToPlan = () => {
    setToastMessage(`Added "${recipe?.name}" to Today's Plan! 🎉`)
    setTimeout(() => setToastMessage(''), 3500)
  }

  if (loading) {
    return (
      <div className="app-container" style={{ textAlign: 'center', paddingTop: 100 }}>
        <div className="spinner" />
        <p style={{ marginTop: 12, color: '#6b7280' }}>Loading recipe details...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="app-container" style={{ padding: 24, textAlign: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', float: 'left' }}>
          &larr;
        </button>
        <h2 style={{ marginTop: 60 }}>Recipe Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/recipes')} style={{ marginTop: 20 }}>
          Back to Recipes
        </button>
      </div>
    )
  }

  const suitabilityList = recipe.suitabilityByMember || []

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: isDark ? '#0a0f1d' : '#fcfaf7',
        paddingBottom: 110,
        fontFamily: "'Inter', sans-serif",
        color: isDark ? '#f8fafc' : '#1a1a1a',
        position: 'relative',
      }}
    >
      {/* Toast alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#2e7d32',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 700,
            zIndex: 2000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* 1. HERO IMAGE WITH GRADIENT & OVERLAY */}
      <div style={{ position: 'relative', width: '100%', height: 320, overflow: 'hidden' }}>
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'}
          alt={recipe.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 20,
          }}
        >
          {/* Top Bar: Back Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          </div>

          {/* Title and match badge */}
          <div>
            {recipe.matchBadgeText && (
              <span
                style={{
                  background: recipe.fullySuitableForFamily ? '#e8f5e9' : '#fff3e0',
                  color: recipe.fullySuitableForFamily ? '#2e7d32' : '#e65100',
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: 12,
                  display: 'inline-block',
                  marginBottom: 8,
                }}
              >
                ★ {recipe.matchBadgeText}
              </span>
            )}
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.2 }}>
              {recipe.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div style={{ padding: '20px 20px 0 20px' }}>

        {/* 2. QUICK STATS ROW */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
            background: 'white',
            borderRadius: 20,
            padding: '16px 10px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 16 }}>🔥</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginTop: 2 }}>{recipe.kcal}</div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>kcal</div>
          </div>
          <div>
            <div style={{ fontSize: 16 }}>⏱️</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginTop: 2 }}>{recipe.prepTimeMinutes}</div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>mins</div>
          </div>
          <div>
            <div style={{ fontSize: 16 }}>🥩</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#5e8404', marginTop: 2 }}>{recipe.proteinG}g</div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>protein</div>
          </div>
          <div>
            <div style={{ fontSize: 16 }}>🌾</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#d97706', marginTop: 2 }}>{recipe.carbsG}g</div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>carbs</div>
          </div>
        </div>

        {/* 3. WHY IT'S GOOD SECTION */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f1f8e4 0%, #e6f4ce 100%)',
            borderRadius: 24,
            padding: '18px 20px',
            marginBottom: 24,
            border: '1px solid #d6ebae',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#3d6b3f', margin: 0 }}>Why It's Good</h3>
          </div>
          <p style={{ fontSize: 14, color: '#2c3e2d', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
            {recipe.whyItsGood}
          </p>
        </div>

        {/* 4. GOOD FOR YOUR FAMILY SECTION */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
            Family Suitability
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {suitabilityList.map((item, idx) => (
              <div
                key={item.memberId || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'white',
                  borderRadius: 16,
                  padding: '12px 16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  border: item.suitable ? '1px solid #e5e7eb' : '1px solid #fee2e2',
                }}
              >
                {/* Icon Checkmark or X */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: item.suitable ? '#e8f5e9' : '#fee2e2',
                    color: item.suitable ? '#2e7d32' : '#dc2626',
                    fontWeight: 900,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.suitable ? '✓' : '✕'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                    {item.memberName} <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>({item.memberRole})</span>
                  </div>
                  <div style={{ fontSize: 12, color: item.suitable ? '#4b5563' : '#dc2626', marginTop: 2, fontWeight: 500 }}>
                    {item.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. INGREDIENTS CHECKLIST */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
            Ingredients ({recipe.ingredients?.length || 0})
          </h3>
          <div style={{ background: 'white', borderRadius: 20, padding: '10px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            {recipe.ingredients?.map((ing, i) => (
              <div
                key={ing.id || i}
                onClick={() => toggleIngredient(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: i < recipe.ingredients.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                  opacity: checkedIngredients[i] ? 0.5 : 1,
                  textDecoration: checkedIngredients[i] ? 'line-through' : 'none',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: checkedIngredients[i] ? 'none' : '2px solid #9ca3af',
                    background: checkedIngredients[i] ? '#5e8404' : 'transparent',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {checkedIngredients[i] ? '✓' : ''}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                  {ing.quantity} {ing.unit} {ing.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. HOW TO MAKE STEPS */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
            How to Make
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recipe.steps?.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: 14,
                  background: 'white',
                  borderRadius: 18,
                  padding: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#5e8404',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. STICKY BOTTOM BUTTON */}
        <div
          style={{
            position: 'fixed',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 480,
            padding: '0 20px',
            boxSizing: 'border-box',
            zIndex: 990,
          }}
        >
          <button
            onClick={handleAddToPlan}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #5e8404 0%, #3d6b3f 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 24,
              padding: '16px',
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(61,107,63,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>+ Add to Today's Plan</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
