/**
 * Evaluates whether a recipe is healthy or unhealthy for a specific family member (or general family).
 * Returns status ('healthy' | 'bad'), formatted text, and color tokens (red for unhealthy, green for healthy).
 */
export function evaluateRecipeHealth(recipe, member) {
  if (!recipe) {
    return {
      isHealthy: true,
      status: 'healthy',
      text: 'Healthy',
      color: '#16A34A',
      bg: '#DCFCE7',
    }
  }

  const memberName = member?.name || 'You'
  const allergies = member?.allergies || []
  const conditions = member?.healthConditions || []
  const goal = member?.fitnessGoal || ''
  const kcal = recipe.kcal || recipe.calories || recipe.macros?.calories || 300
  const protein = recipe.proteinG || recipe.protein || recipe.macros?.protein || 10
  const carbs = recipe.carbsG || recipe.carbs || recipe.macros?.carbs || 30
  const fat = recipe.fatG || recipe.fat || recipe.macros?.fat || 10
  const nameLower = (recipe.name || '').toLowerCase()
  const recipeAllergies = recipe.allergies || []

  // 1. Check Allergy Conflict -> RED (Unhealthy)
  const hasAllergyConflict = allergies.some((a) => {
    if (a === 'None') return false
    const aLower = a.toLowerCase()
    if (aLower.includes('fish') || aLower.includes('seafood')) {
      return (
        recipeAllergies.some(
          (ra) => ra.toLowerCase().includes('fish') || ra.toLowerCase().includes('seafood')
        ) ||
        nameLower.includes('fish') ||
        nameLower.includes('prawn') ||
        nameLower.includes('chemmeen') ||
        nameLower.includes('meen') ||
        nameLower.includes('mathi') ||
        nameLower.includes('ayala') ||
        nameLower.includes('seer')
      )
    }
    if (aLower.includes('dairy') || aLower.includes('milk')) {
      return (
        recipeAllergies.some((ra) => ra.toLowerCase().includes('dairy')) ||
        nameLower.includes('paneer') ||
        nameLower.includes('milk') ||
        nameLower.includes('curd') ||
        nameLower.includes('ghee')
      )
    }
    if (aLower.includes('egg')) {
      return (
        recipeAllergies.some((ra) => ra.toLowerCase().includes('egg')) ||
        nameLower.includes('egg') ||
        nameLower.includes('mutta')
      )
    }
    if (aLower.includes('wheat') || aLower.includes('gluten')) {
      return (
        recipeAllergies.some((ra) => ra.toLowerCase().includes('gluten')) ||
        nameLower.includes('parotta') ||
        nameLower.includes('wheat')
      )
    }
    return false
  })

  if (hasAllergyConflict) {
    return {
      isHealthy: false,
      status: 'bad',
      text: `Unhealthy for ${memberName} (Allergy)`,
      color: '#DC2626',
      bg: '#FEE2E2',
    }
  }

  // 2. Diabetes + High Carbs -> RED (Unhealthy)
  if (conditions.includes('Diabetes') && carbs > 50) {
    return {
      isHealthy: false,
      status: 'bad',
      text: `Unhealthy for ${memberName} (High Carbs)`,
      color: '#DC2626',
      bg: '#FEE2E2',
    }
  }

  // 3. High Blood Pressure / Heart Disease + High Fat/Sodium -> RED (Unhealthy)
  if (
    (conditions.includes('High Blood Pressure') ||
      conditions.includes('Heart Disease') ||
      conditions.includes('High Cholesterol')) &&
    (fat > 20 || kcal > 450)
  ) {
    return {
      isHealthy: false,
      status: 'bad',
      text: `Unhealthy for ${memberName} (High Fat/Kcal)`,
      color: '#DC2626',
      bg: '#FEE2E2',
    }
  }

  // 4. Weight Loss Goal + High Calorie -> RED (Unhealthy)
  if (goal === 'WEIGHT_LOSS' && kcal > 420) {
    return {
      isHealthy: false,
      status: 'bad',
      text: `Unhealthy for ${memberName} (High Kcal)`,
      color: '#DC2626',
      bg: '#FEE2E2',
    }
  }

  // 5. Very Healthy Matches -> GREEN
  if (
    protein >= 16 ||
    (goal === 'WEIGHT_LOSS' && kcal <= 350) ||
    (goal === 'MUSCLE_GAIN' && protein >= 20) ||
    (conditions.includes('Diabetes') && carbs <= 35) ||
    recipe.tags?.includes('High-Protein') ||
    recipe.tags?.includes('Superfood')
  ) {
    return {
      isHealthy: true,
      status: 'healthy',
      text: `Very Healthy for ${memberName}`,
      color: '#16A34A',
      bg: '#DCFCE7',
    }
  }

  // Default: Healthy Choice -> GREEN
  return {
    isHealthy: true,
    status: 'healthy',
    text: `Very Healthy`,
    color: '#16A34A',
    bg: '#DCFCE7',
  }
}
