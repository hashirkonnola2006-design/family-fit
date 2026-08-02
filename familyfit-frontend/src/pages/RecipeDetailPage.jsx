import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipeDetail } from '../api/recipes'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import MemberAvatar from '../components/MemberAvatar'
import BottomNav from '../components/BottomNav'
import { RECIPE_DATABASE } from '../data/recipeDatabase'

/**
 * Dynamically evaluates a recipe's suitability for a specific family member using their actual profile data:
 * - Allergies (hard conflict)
 * - Food Dislikes (conflict)
 * - Health Goals / Conditions (positive or negative match)
 * - Neutral state when data is missing
 */
function evaluateMemberRecipeSuitability(recipe, member) {
  if (!member) return null

  const memberAllergies = Array.isArray(member.allergies) ? member.allergies : []
  const memberDislikes = Array.isArray(member.dislikes) ? member.dislikes : []
  const goal = (member.fitnessGoal || '').toUpperCase()
  const diet = (member.dietPreference || '').toUpperCase()

  // Collect recipe text & ingredient strings for matching
  const recipeName = (recipe?.name || '').toLowerCase()
  const recipeTags = (recipe?.tags || []).map((t) => t.toLowerCase())
  const ingredientNames = (recipe?.ingredients || []).map((i) => (i.name || '').toLowerCase()).join(' ')
  const fullRecipeText = `${recipeName} ${recipeTags.join(' ')} ${ingredientNames} ${(recipe?.whyItsGood || '').toLowerCase()}`

  // 1. Check if profile has NO health/goal data set
  const hasNoData = !member.fitnessGoal && (!member.allergies || member.allergies.length === 0) && (!member.dislikes || member.dislikes.length === 0)
  if (hasNoData) {
    return {
      isSuitable: true,
      isNeutral: true,
      statusIcon: 'ℹ',
      statusBg: '#f3f4f6',
      statusColor: '#4b5563',
      reason: `No health data set for ${member.name} yet.`,
    }
  }

  // 2. Check Allergy Conflicts
  const allergenConflict = memberAllergies.find((allergen) => {
    if (allergen === 'Milk/Dairy' && (fullRecipeText.includes('milk') || fullRecipeText.includes('curd') || fullRecipeText.includes('ghee') || fullRecipeText.includes('thayir') || fullRecipeText.includes('sambharam') || fullRecipeText.includes('cheese') || fullRecipeText.includes('yogurt'))) return true
    if (allergen === 'Eggs' && (fullRecipeText.includes('egg') || fullRecipeText.includes('mutta'))) return true
    if (allergen === 'Peanuts/Tree Nuts' && (fullRecipeText.includes('nut') || fullRecipeText.includes('almond') || fullRecipeText.includes('peanut'))) return true
    if (allergen === 'Seafood/Fish' && (fullRecipeText.includes('fish') || fullRecipeText.includes('mathi') || fullRecipeText.includes('ayala') || fullRecipeText.includes('neymeen') || fullRecipeText.includes('chemmeen') || fullRecipeText.includes('prawn') || fullRecipeText.includes('seafood') || fullRecipeText.includes('karimeen'))) return true
    if (allergen === 'Soy' && (fullRecipeText.includes('tofu') || fullRecipeText.includes('soy'))) return true
    if (allergen === 'Wheat/Gluten' && (fullRecipeText.includes('wheat') || fullRecipeText.includes('bread'))) return true
    return false
  })

  if (allergenConflict) {
    return {
      isSuitable: false,
      isNeutral: false,
      statusIcon: '✕',
      statusBg: '#fee2e2',
      statusColor: '#dc2626',
      reason: `Not suitable for ${member.name} — contains ${allergenConflict} (allergy conflict).`,
    }
  }

  // 3. Check Dislikes
  const dislikeMatch = memberDislikes.find((d) => d.trim() && fullRecipeText.includes(d.toLowerCase()))
  if (dislikeMatch) {
    return {
      isSuitable: false,
      isNeutral: false,
      statusIcon: '✕',
      statusBg: '#fee2e2',
      statusColor: '#dc2626',
      reason: `Not ideal for ${member.name} — contains ${dislikeMatch} (food dislike).`,
    }
  }

  // 4. Check Health Goal & Diet Match
  const protein = Number(recipe?.proteinG) || 0
  const carbs = Number(recipe?.carbsG) || 0
  const kcal = Number(recipe?.kcal) || 0

  // Diabetes / Blood Sugar Management
  if (goal.includes('DIABETES') || goal.includes('MANAGE') || diet.includes('LOW_GI')) {
    if (carbs > 65) {
      return {
        isSuitable: false,
        isNeutral: false,
        statusIcon: '✕',
        statusBg: '#fff3e0',
        statusColor: '#d97706',
        reason: `Not ideal for ${member.name} — high carb content (${carbs}g) conflicts with blood sugar control.`,
      }
    }
    return {
      isSuitable: true,
      isNeutral: false,
      statusIcon: '✓',
      statusBg: '#e8f5e9',
      statusColor: '#2e7d32',
      reason: `Good for ${member.name} — low GI & controlled carbs (${carbs}g) support blood sugar control.`,
    }
  }

  // Muscle Gain / High-Protein
  if (goal.includes('MUSCLE') || goal.includes('BULK') || diet.includes('HIGH_PROTEIN')) {
    if (protein >= 25 || recipeTags.includes('high-protein')) {
      return {
        isSuitable: true,
        isNeutral: false,
        statusIcon: '✓',
        statusBg: '#e8f5e9',
        statusColor: '#2e7d32',
        reason: `Good for ${member.name} — high protein (${protein}g) supports her muscle gain goal.`,
      }
    }
    return {
      isSuitable: true,
      isNeutral: false,
      statusIcon: '✓',
      statusBg: '#e8f5e9',
      statusColor: '#2e7d32',
      reason: `Safe for ${member.name} — balanced protein (${protein}g) fuel.`,
    }
  }

  // Weight Loss
  if (goal.includes('LOSS') || goal.includes('WEIGHT')) {
    if (kcal > 550) {
      return {
        isSuitable: false,
        isNeutral: false,
        statusIcon: '✕',
        statusBg: '#fff3e0',
        statusColor: '#d97706',
        reason: `Not ideal for ${member.name} — high calorie count (${kcal} kcal) exceeds weight loss target.`,
      }
    }
    return {
      isSuitable: true,
      isNeutral: false,
      statusIcon: '✓',
      statusBg: '#e8f5e9',
      statusColor: '#2e7d32',
      reason: `Good for ${member.name} — controlled calories (${kcal} kcal) supports weight loss goal.`,
    }
  }

  // Kids Role
  if (member.role === 'CHILD') {
    return {
      isSuitable: true,
      isNeutral: false,
      statusIcon: '✓',
      statusBg: '#e8f5e9',
      statusColor: '#2e7d32',
      reason: `Great for ${member.name} — wholesome nutrients for growing energy.`,
    }
  }

  // Default safe fallback
  return {
    isSuitable: true,
    isNeutral: false,
    statusIcon: '✓',
    statusBg: '#e8f5e9',
    statusColor: '#2e7d32',
    reason: `Safe for ${member.name} — no allergen or diet conflicts found.`,
  }
}

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const [recipe, setRecipe] = useState(KERALA_RECIPES[0])
  const [loading, setLoading] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [toastMessage, setToastMessage] = useState('')

  const members = family?.members || []

  useEffect(() => {
    async function load() {
      try {
        const familyId = family?.id || 1
        // 1. Check in local RECIPE_DATABASE (500 recipes) dataset first by ID
        const localFound = RECIPE_DATABASE.find((r) => String(r.id) === String(id))
        if (localFound) {
          setRecipe(localFound)
          return
        }

        // 2. Fallback to API if not in static dataset
        const res = await getRecipeDetail(id, familyId).catch(() => ({ data: null }))
        if (res?.data && typeof res.data === 'object' && res.data.name) {
          setRecipe(res.data)
        }
      } catch (e) {
        console.error(e)
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

  // Calculate dynamic suitability for every active member in family.members
  const dynamicSuitabilityList = members.map((member) => {
    const evalResult = evaluateMemberRecipeSuitability(recipe, member)
    return {
      member,
      ...evalResult,
    }
  })

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
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80'}
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
                  background: '#e8f5e9',
                  color: '#2e7d32',
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
            background: isDark ? '#161b22' : 'white',
            borderRadius: 20,
            padding: '16px 10px',
            textAlign: 'center',
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.04)',
            border: isDark ? '1px solid #21262d' : '1px solid #f0ede8',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 16 }}>🔥</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f0f6fc' : '#111827', marginTop: 2 }}>{recipe.kcal}</div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>kcal</div>
          </div>
          <div>
            <div style={{ fontSize: 16 }}>⏱️</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f0f6fc' : '#111827', marginTop: 2 }}>{recipe.prepTimeMinutes}</div>
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
            background: isDark
              ? 'linear-gradient(135deg, #1c2617 0%, #111a0d 100%)'
              : 'linear-gradient(135deg, #f1f8e4 0%, #e6f4ce 100%)',
            borderRadius: 24,
            padding: '18px 20px',
            marginBottom: 24,
            border: `1px solid ${isDark ? '#2e4a19' : '#d6ebae'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#a3e635' : '#3d6b3f', margin: 0 }}>Why It's Good</h3>
          </div>
          <p style={{ fontSize: 14, color: isDark ? '#e2e8f0' : '#2c3e2d', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
            {recipe.whyItsGood}
          </p>
        </div>

        {/* 4. DYNAMIC FAMILY SUITABILITY SECTION */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#f0f6fc' : '#111827', margin: 0 }}>
              Family Suitability
            </h3>
            <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
              {members.length} Member{members.length !== 1 ? 's' : ''} Evaluated
            </span>
          </div>

          {dynamicSuitabilityList.length === 0 ? (
            <div
              style={{
                background: isDark ? '#161b22' : 'white',
                borderRadius: 16,
                padding: 16,
                textAlign: 'center',
                color: '#8b949e',
                fontSize: 13,
              }}
            >
              No family members added yet. Add family members in Profile to see personalized suitability reasoning!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dynamicSuitabilityList.map(({ member, statusIcon, statusBg, statusColor, reason, isSuitable }) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: isDark ? '#161b22' : 'white',
                    borderRadius: 16,
                    padding: '12px 16px',
                    boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.03)',
                    border: !isSuitable
                      ? '1.5px solid #fee2e2'
                      : isDark ? '1px solid #21262d' : '1px solid #e5e7eb',
                  }}
                >
                  <MemberAvatar member={member} size={36} />

                  {/* Status Icon Badge */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: statusBg,
                      color: statusColor,
                      fontWeight: 900,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {statusIcon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f0f6fc' : '#111827' }}>
                      {member.name}{' '}
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, textTransform: 'capitalize' }}>
                        ({member.role || 'Member'})
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: isDark ? (isSuitable ? '#9ca3af' : '#fca5a5') : (isSuitable ? '#4b5563' : '#dc2626'), marginTop: 2, fontWeight: 500, lineHeight: 1.4 }}>
                      {reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. INGREDIENTS CHECKLIST */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#f0f6fc' : '#111827', marginBottom: 12 }}>
            Ingredients ({recipe.ingredients?.length || 0})
          </h3>
          <div
            style={{
              background: isDark ? '#161b22' : 'white',
              borderRadius: 20,
              padding: '10px 16px',
              boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.03)',
              border: isDark ? '1px solid #21262d' : 'none',
            }}
          >
            {recipe.ingredients?.map((ing, i) => (
              <div
                key={ing.id || i}
                onClick={() => toggleIngredient(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: i < recipe.ingredients.length - 1 ? (isDark ? '1px solid #21262d' : '1px solid #f3f4f6') : 'none',
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
                    border: checkedIngredients[i] ? 'none' : `2px solid ${isDark ? '#48515d' : '#9ca3af'}`,
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
                <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f0f6fc' : '#111827' }}>
                  {ing.quantity} {ing.unit} {ing.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. HOW TO MAKE STEPS */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#f0f6fc' : '#111827', marginBottom: 12 }}>
            How to Make
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recipe.steps?.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: 14,
                  background: isDark ? '#161b22' : 'white',
                  borderRadius: 18,
                  padding: '16px',
                  boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.03)',
                  border: isDark ? '1px solid #21262d' : 'none',
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
                <p style={{ fontSize: 14, color: isDark ? '#c9d1d9' : '#374151', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
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
