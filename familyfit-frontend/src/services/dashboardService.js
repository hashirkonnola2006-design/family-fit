/**
 * FamilyFit Dashboard Mock & Service Layer
 * 
 * Provides mock/cached sample Kerala data for:
 * 1. Meal Plans (Breakfast, Lunch, Snack, Dinner across Mon-Sun)
 * 2. Water Intake tracking (glasses per day)
 * 3. Weight History trend logs
 * 4. Allergy Conflict Checking
 * 
 * TODO: Wire each method below to real backend API endpoints:
 * - GET/POST /api/meals/plan
 * - GET/POST /api/health/water
 * - GET/POST /api/health/weight-history
 */

import { KERALA_RECIPES } from '../data/keralaRecipesData'

// ── DAYS OF THE WEEK ──
export const DAYS_OF_WEEK = [
  { short: 'Mon', full: 'Monday', index: 0 },
  { short: 'Tue', full: 'Tuesday', index: 1 },
  { short: 'Wed', full: 'Wednesday', index: 2 },
  { short: 'Thu', full: 'Thursday', index: 3 },
  { short: 'Fri', full: 'Friday', index: 4 },
  { short: 'Sat', full: 'Saturday', index: 5 },
  { short: 'Sun', full: 'Sunday', index: 6 },
]

// ── DEFAULT KERALA 7-DAY MEAL PLAN DATASET ──
const DEFAULT_WEEK_PLAN = {
  // Saturday (Today default)
  5: {
    breakfast: {
      id: 1,
      name: 'Palappam with Mild Vegetable Stew',
      category: 'Breakfast',
      kcal: 360,
      cookTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
      allergies: [],
      isVeryHealthy: true,
      eaten: true,
    },
    lunch: {
      id: 2,
      name: 'Traditional Avial & Palakkadan Matta Rice',
      category: 'Lunch',
      kcal: 430,
      cookTimeMinutes: 25,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
      allergies: [],
      isVeryHealthy: true,
      eaten: false,
    },
    snack: {
      id: 3,
      name: 'Nendran Plantain Roast in Ghee & Chukku Tea',
      category: 'Snack',
      kcal: 180,
      cookTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80',
      allergies: [],
      isVeryHealthy: true,
      eaten: false,
    },
    dinner: {
      id: 101,
      name: 'Karimeen Pollichathu & Light Kanzi',
      category: 'Dinner',
      kcal: 380,
      cookTimeMinutes: 25,
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
      allergies: ['Seafood/Fish'],
      isVeryHealthy: true,
      eaten: false,
    },
  },
  // Friday
  4: {
    breakfast: {
      id: 4,
      name: 'Puttu with Kadala Curry',
      category: 'Breakfast',
      kcal: 390,
      cookTimeMinutes: 25,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
      allergies: [],
      isVeryHealthy: true,
      eaten: true,
    },
    lunch: {
      id: 5,
      name: 'Moringa Leaves Thoran with Moru Curry & Rice',
      category: 'Lunch',
      kcal: 380,
      cookTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
      allergies: ['Milk/Dairy'],
      isVeryHealthy: true,
      eaten: true,
    },
    snack: {
      id: 6,
      name: 'Sukhiyan (Green Gram & Jaggery Snack)',
      category: 'Snack',
      kcal: 190,
      cookTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80',
      allergies: [],
      isVeryHealthy: true,
      eaten: true,
    },
    dinner: {
      id: 7,
      name: 'Wheat Dosa with Tomato-Shallot Chutney',
      category: 'Dinner',
      kcal: 320,
      cookTimeMinutes: 15,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
      allergies: ['Wheat/Gluten'],
      isVeryHealthy: true,
      eaten: true,
    },
  },
}

// ── SWAP SUGGESTIONS ──
export const SAFE_SWAP_SUGGESTIONS = [
  {
    id: 201,
    name: 'Muringayila Thoran & Red Rice Kanji',
    category: 'Dinner',
    kcal: 310,
    cookTimeMinutes: 20,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    allergies: [],
    isVeryHealthy: true,
    tag: '100% Allergen Safe',
  },
  {
    id: 202,
    name: 'Kerala Vegetable Stew & Steamed Appam',
    category: 'Dinner',
    kcal: 340,
    cookTimeMinutes: 18,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    allergies: [],
    isVeryHealthy: true,
    tag: 'Gentle Digestion',
  },
  {
    id: 203,
    name: 'Kappa Veppichathu with Pachadi',
    category: 'Lunch',
    kcal: 390,
    cookTimeMinutes: 22,
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?w=800&q=80',
    allergies: [],
    isVeryHealthy: true,
    tag: 'High Energy',
  },
]

// ── SEASONAL KERALA NOTES ──
export const SEASONAL_KERALA_NOTES = [
  'Mango season is winding down in Palakkad; try ripe Nendran steamed with a pinch of cardamom today.',
  'Monsoon dampness calls for warm dry ginger (Chukku) & Tulsi water to boost immunity.',
  'Fresh tender coconut (Elaneer) provides natural electrolytes for sunny Kerala afternoons.',
  'Moringa (Muringayila) is peak harvest right now — an iron-rich superfood for the whole household.',
]

/**
 * Get or initialize meal plan for the given day index (0 = Mon, 6 = Sun)
 * TODO: Replace with GET /api/meals/plan?dayIndex={index}
 */
export function getStoredMealPlan(dayIndex = 5) {
  try {
    const raw = localStorage.getItem('familyfit_dashboard_mealplan')
    const store = raw ? JSON.parse(raw) : DEFAULT_WEEK_PLAN
    if (store[dayIndex]) return store[dayIndex]

    // Default template for days not filled yet
    return {
      breakfast: {
        id: 10 + dayIndex,
        name: 'Palappam with Vegetable Stew',
        category: 'Breakfast',
        kcal: 340,
        cookTimeMinutes: 20,
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
        allergies: [],
        isVeryHealthy: true,
        eaten: false,
      },
      lunch: {
        id: 20 + dayIndex,
        name: 'Matta Rice, Sambar & Cabbage Thoran',
        category: 'Lunch',
        kcal: 410,
        cookTimeMinutes: 25,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
        allergies: [],
        isVeryHealthy: true,
        eaten: false,
      },
      snack: {
        id: 30 + dayIndex,
        name: 'Steamed Sweet Corn & Spiced Chukku Water',
        category: 'Snack',
        kcal: 160,
        cookTimeMinutes: 10,
        imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80',
        allergies: [],
        isVeryHealthy: true,
        eaten: false,
      },
      dinner: {
        id: 40 + dayIndex,
        name: 'Red Rice Kanji & Cherupayar Payar Thoran',
        category: 'Dinner',
        kcal: 310,
        cookTimeMinutes: 20,
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
        allergies: [],
        isVeryHealthy: true,
        eaten: false,
      },
    }
  } catch (err) {
    console.error('Failed to load meal plan:', err)
    return DEFAULT_WEEK_PLAN[5]
  }
}

/**
 * Toggle eaten status for a slot
 * TODO: Replace with PATCH /api/meals/plan/{slot}/eaten
 */
export function toggleMealEaten(dayIndex, slotKey, eaten) {
  try {
    const raw = localStorage.getItem('familyfit_dashboard_mealplan')
    const store = raw ? JSON.parse(raw) : { ...DEFAULT_WEEK_PLAN }
    if (!store[dayIndex]) store[dayIndex] = getStoredMealPlan(dayIndex)
    if (store[dayIndex][slotKey]) {
      store[dayIndex][slotKey].eaten = eaten
      localStorage.setItem('familyfit_dashboard_mealplan', JSON.stringify(store))
    }
    return store[dayIndex]
  } catch (err) {
    console.error('Failed to update meal status:', err)
    return null
  }
}

/**
 * Swap meal with a new dish
 * TODO: Replace with PUT /api/meals/plan/{slot}
 */
export function swapMealDish(dayIndex, slotKey, newDish) {
  try {
    const raw = localStorage.getItem('familyfit_dashboard_mealplan')
    const store = raw ? JSON.parse(raw) : { ...DEFAULT_WEEK_PLAN }
    if (!store[dayIndex]) store[dayIndex] = getStoredMealPlan(dayIndex)
    store[dayIndex][slotKey] = {
      ...newDish,
      eaten: false,
      category: slotKey.charAt(0).toUpperCase() + slotKey.slice(1),
    }
    localStorage.setItem('familyfit_dashboard_mealplan', JSON.stringify(store))
    return store[dayIndex]
  } catch (err) {
    console.error('Failed to swap meal dish:', err)
    return null
  }
}

/**
 * Water tracker
 * TODO: Replace with GET/POST /api/health/water
 */
export function getWaterIntake(memberId = 'all') {
  try {
    const raw = localStorage.getItem(`familyfit_water_${memberId}`)
    return raw ? parseInt(raw, 10) : 5
  } catch {
    return 5
  }
}

export function updateWaterIntake(memberId = 'all', delta = 1) {
  try {
    const current = getWaterIntake(memberId)
    const updated = Math.max(0, Math.min(12, current + delta))
    localStorage.setItem(`familyfit_water_${memberId}`, updated.toString())
    return updated
  } catch {
    return 5
  }
}

/**
 * Weekly Weight History
 * TODO: Replace with GET /api/health/weight-history?memberId={id}
 */
export function getWeeklyWeightHistory(member) {
  const baseWeight = member?.weightKg ? parseFloat(member.weightKg) : 67.5
  return [
    { week: 'W1', weight: parseFloat((baseWeight + 1.2).toFixed(1)) },
    { week: 'W2', weight: parseFloat((baseWeight + 0.9).toFixed(1)) },
    { week: 'W3', weight: parseFloat((baseWeight + 0.6).toFixed(1)) },
    { week: 'W4', weight: parseFloat((baseWeight + 0.3).toFixed(1)) },
    { week: 'W5', weight: parseFloat((baseWeight + 0.1).toFixed(1)) },
    { week: 'W6', weight: parseFloat(baseWeight.toFixed(1)) },
  ]
}

/**
 * Check allergy conflicts for a dish against family members
 */
export function checkMealAllergyConflicts(dish, members = []) {
  if (!dish?.allergies || !Array.isArray(dish.allergies) || dish.allergies.length === 0) {
    return { isSafe: true, conflicts: [] }
  }

  const conflicts = []

  members.forEach((m) => {
    let memberAllergies = []
    if (Array.isArray(m.allergies)) {
      memberAllergies = m.allergies
    } else if (typeof m.allergies === 'string') {
      memberAllergies = m.allergies.split(',').map((s) => s.trim())
    }

    memberAllergies.forEach((allergy) => {
      if (!allergy || allergy.toLowerCase() === 'none') return
      const matched = dish.allergies.some((dishAllergy) =>
        dishAllergy.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(dishAllergy.toLowerCase())
      )
      if (matched) {
        conflicts.push({
          memberId: m.id,
          memberName: m.name,
          allergen: allergy,
        })
      }
    })
  })

  return {
    isSafe: conflicts.length === 0,
    conflicts,
  }
}
