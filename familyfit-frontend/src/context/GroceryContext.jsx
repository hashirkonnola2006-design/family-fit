import { createContext, useContext, useState, useEffect } from 'react'

const GroceryContext = createContext(null)

const DEFAULT_GROCERY_ITEMS = [
  {
    id: 101,
    name: 'Wild Alaskan Salmon Fillets',
    price: 14.99,
    category: 'Protein',
    whyBuy: 'Lean protein & Omega-3 — supports Sarah\'s Weight Loss goal',
    memberIds: [1, 2],
    greatForMemberId: 1,
    isPantry: false,
    allergies: ['Seafood/Fish'],
  },
  {
    id: 102,
    name: 'Organic Eggs (12 Pack)',
    price: 4.99,
    category: 'Protein',
    whyBuy: 'High protein — supports Alex\'s Muscle Gain goal',
    memberIds: [2],
    greatForMemberId: 2,
    isPantry: false,
    allergies: ['Eggs'],
  },
  {
    id: 103,
    name: 'Organic Whole Milk',
    price: 3.89,
    category: 'Dairy',
    whyBuy: 'Calcium & Vitamin D for growing children',
    memberIds: [3],
    greatForMemberId: null,
    isPantry: false,
    allergies: ['Milk/Dairy'],
  },
  {
    id: 104,
    name: 'Tri-Color Quinoa (500g)',
    price: 6.49,
    category: 'Pantry',
    whyBuy: 'Low GI & complex carbs — ideal for Maya\'s Blood Sugar balance',
    memberIds: [1, 3],
    greatForMemberId: 3,
    isPantry: false,
    allergies: [],
  },
  {
    id: 105,
    name: 'Fresh Organic Spinach',
    price: 2.99,
    category: 'Produce',
    whyBuy: 'Rich in iron and folate for family vitality',
    memberIds: [1, 2, 3],
    greatForMemberId: 1,
    isPantry: false,
    allergies: [],
  },
  {
    id: 106,
    name: 'Fresh Strawberries (1 lb)',
    price: 4.49,
    category: 'Produce',
    whyBuy: 'Vitamin C booster — Maya\'s top favorite fruit',
    memberIds: [3],
    greatForMemberId: 3,
    isPantry: false,
    allergies: [],
  },
  {
    id: 107,
    name: 'Greek Yogurt (Plain 500g)',
    price: 4.29,
    category: 'Dairy',
    whyBuy: 'High protein & probiotics for digestive health',
    memberIds: [1, 2],
    greatForMemberId: 2,
    isPantry: true, // Marked as owned in Pantry
    allergies: ['Milk/Dairy'],
  },
]

// Pre-defined plan ingredient templates for auto-populating
const PLAN_INGREDIENTS = {
  1: [ // Vitality & Growth Plan
    { name: 'Organic Chicken Breasts (1 kg)', price: 11.99, category: 'Protein', whyBuy: 'High protein — supports Alex\'s Muscle Gain', memberIds: [1, 2], greatForMemberId: 2, allergies: [] },
    { name: 'Avocados (Bag of 4)', price: 4.99, category: 'Produce', whyBuy: 'Healthy fats & satiety — supports Sarah', memberIds: [1, 2], greatForMemberId: 1, allergies: [] },
    { name: 'Whole Wheat Bread', price: 3.49, category: 'Bakery', whyBuy: 'Complex carbs for daily energy', memberIds: [1, 2, 3], greatForMemberId: null, allergies: ['Wheat/Gluten'] },
    { name: 'Broccoli Crowns', price: 2.49, category: 'Produce', whyBuy: 'Fibre & micronutrients for balanced nutrition', memberIds: [1, 2], greatForMemberId: null, allergies: [] },
  ],
  2: [ // Lean & Clean Plan
    { name: 'Extra Lean Turkey Breast', price: 9.99, category: 'Protein', whyBuy: 'Low calorie, high protein — supports Sarah\'s Weight Loss', memberIds: [1], greatForMemberId: 1, allergies: [] },
    { name: 'Cauliflower Rice (2 Packs)', price: 5.49, category: 'Produce', whyBuy: 'Low-carb rice alternative for calorie management', memberIds: [1], greatForMemberId: 1, allergies: [] },
    { name: 'Extra Virgin Olive Oil', price: 8.99, category: 'Pantry', whyBuy: 'Heart-healthy monounsaturated fats', memberIds: [1, 2], greatForMemberId: null, allergies: [] },
  ],
  3: [ // Blood Sugar Balance Plan
    { name: 'Red Lentils (1 kg)', price: 3.99, category: 'Pantry', whyBuy: 'High fibre & low GI — stabilizes Maya\'s blood glucose', memberIds: [3], greatForMemberId: 3, allergies: [] },
    { name: 'Raw Almonds (250g)', price: 5.99, category: 'Pantry', whyBuy: 'Healthy snacking for glucose stability', memberIds: [1, 2], greatForMemberId: null, allergies: ['Peanuts/Tree Nuts'] },
    { name: 'Chia Seeds (300g)', price: 4.49, category: 'Pantry', whyBuy: 'Omega-3 & soluble fibre for steady digestion', memberIds: [1, 3], greatForMemberId: 3, allergies: [] },
  ],
  4: [ // Happy Kids Plan
    { name: 'Bananas (Bunch)', price: 1.89, category: 'Produce', whyBuy: 'Kid favourite for energy & smoothies', memberIds: [3], greatForMemberId: 3, allergies: [] },
    { name: 'Rolled Oats (1 kg)', price: 3.99, category: 'Pantry', whyBuy: 'Sustained energy breakfast for kids', memberIds: [2, 3], greatForMemberId: 3, allergies: [] },
    { name: 'Cheddar Cheese Block', price: 4.29, category: 'Dairy', whyBuy: 'Calcium & protein snack for growing children', memberIds: [3], greatForMemberId: null, allergies: ['Milk/Dairy'] },
  ],
}

export function GroceryProvider({ children }) {
  const [groceryItems, setGroceryItems] = useState(() => {
    const saved = localStorage.getItem('familyfit_grocery_items')
    return saved ? JSON.parse(saved) : DEFAULT_GROCERY_ITEMS
  })

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('familyfit_grocery_budget')
    return saved ? Number(saved) : 50.00
  })

  const [budgetPeriod, setBudgetPeriodState] = useState(() => {
    return localStorage.getItem('familyfit_grocery_period') || '2-Week'
  })

  const setBudgetPeriod = (period) => {
    setBudgetPeriodState(period)
    localStorage.setItem('familyfit_grocery_period', period)
  }

  const [activePlan, setActivePlan] = useState(null)

  useEffect(() => {
    localStorage.setItem('familyfit_grocery_items', JSON.stringify(groceryItems))
  }, [groceryItems])

  useEffect(() => {
    localStorage.setItem('familyfit_grocery_budget', budget.toString())
  }, [budget])

  useEffect(() => {
    localStorage.setItem('familyfit_grocery_period', budgetPeriod)
  }, [budgetPeriod])

  const togglePantry = (id) => {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPantry: !item.isPantry } : item))
    )
  }

  const removeItem = (id) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addCustomItem = (newItem) => {
    const itemToAdd = {
      id: Date.now(),
      name: newItem.name || 'New Item',
      price: Number(newItem.price) || 0,
      category: newItem.category || 'Produce',
      whyBuy: newItem.whyBuy || 'Family nutrition',
      memberIds: newItem.memberIds || [1],
      greatForMemberId: newItem.greatForMemberId || null,
      isPantry: false,
      allergies: newItem.allergies || [],
    }
    setGroceryItems((prev) => [itemToAdd, ...prev])
  }

  const addItemsFromPlan = (plan) => {
    setActivePlan(plan)
    const templateItems = PLAN_INGREDIENTS[plan.id] || [
      { name: `${plan.name} Ingredients Pack`, price: 12.50, category: 'Pantry', whyBuy: `Auto-populated from ${plan.name}`, memberIds: [1, 2, 3], greatForMemberId: 1, allergies: [] },
    ]

    setGroceryItems((prev) => {
      const existingNames = new Set(prev.map((i) => i.name.toLowerCase()))
      const newItems = templateItems
        .filter((t) => !existingNames.has(t.name.toLowerCase()))
        .map((t, idx) => ({
          ...t,
          id: Date.now() + idx,
          isPantry: false,
        }))
      return [...newItems, ...prev]
    })
  }

  return (
    <GroceryContext.Provider
      value={{
        groceryItems,
        budget,
        setBudget,
        budgetPeriod,
        setBudgetPeriod,
        activePlan,
        togglePantry,
        removeItem,
        addCustomItem,
        addItemsFromPlan,
      }}
    >
      {children}
    </GroceryContext.Provider>
  )
}

export const useGrocery = () => useContext(GroceryContext)
