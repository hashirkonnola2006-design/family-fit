import { createContext, useContext, useState, useEffect } from 'react'

const GroceryContext = createContext(null)

export const RAW_INGREDIENT_CATALOG = [
  // Protein
  { id: 'cat_p1', name: 'Organic Chicken Breasts (1 kg)', price: 11.99, category: 'Protein', whyBuy: 'High protein & lean muscle fuel', allergies: [] },
  { id: 'cat_p2', name: 'Wild Alaskan Salmon Fillets', price: 14.99, category: 'Protein', whyBuy: 'Rich in Omega-3 fatty acids for heart & brain health', allergies: ['Seafood/Fish'] },
  { id: 'cat_p3', name: 'Organic Eggs (12 Pack)', price: 4.99, category: 'Protein', whyBuy: 'Essential choline & complete protein', allergies: ['Eggs'] },
  { id: 'cat_p4', name: 'Organic Tofu Block (400g)', price: 3.49, category: 'Protein', whyBuy: 'Plant-based high protein & calcium', allergies: ['Soy'] },
  { id: 'cat_p5', name: 'Red Lentils (1 kg)', price: 3.99, category: 'Protein', whyBuy: 'Low GI & high fibre legume protein', allergies: [] },
  { id: 'cat_p6', name: 'Lean Turkey Breast (500g)', price: 8.49, category: 'Protein', whyBuy: 'Ultra-low fat, high protein for calorie control', allergies: [] },
  { id: 'cat_p7', name: 'White Fish Fillets (Cod 500g)', price: 8.99, category: 'Protein', whyBuy: 'Light, easy to digest high-protein option', allergies: ['Seafood/Fish'] },

  // Produce
  { id: 'cat_v1', name: 'Fresh Organic Spinach (250g)', price: 2.99, category: 'Produce', whyBuy: 'Folate, iron & antioxidant rich greens', allergies: [] },
  { id: 'cat_v2', name: 'Fresh Strawberries (1 lb)', price: 4.49, category: 'Produce', whyBuy: 'High Vitamin C & natural sweetness', allergies: [] },
  { id: 'cat_v3', name: 'Avocados (Bag of 4)', price: 4.99, category: 'Produce', whyBuy: 'Heart-healthy monounsaturated fats & fibre', allergies: [] },
  { id: 'cat_v4', name: 'Broccoli Crowns (500g)', price: 2.49, category: 'Produce', whyBuy: 'Sulforaphane & immune-boosting greens', allergies: [] },
  { id: 'cat_v5', name: 'Blueberries (Punnet 250g)', price: 3.99, category: 'Produce', whyBuy: 'Superfood antioxidants for cognitive energy', allergies: [] },
  { id: 'cat_v6', name: 'Organic Bananas (Bunch)', price: 1.89, category: 'Produce', whyBuy: 'Potassium & quick healthy fuel for kids', allergies: [] },
  { id: 'cat_v7', name: 'Cauliflower Rice (2 Packs)', price: 5.49, category: 'Produce', whyBuy: 'Low-carb vegetable staple', allergies: [] },

  // Dairy
  { id: 'cat_d1', name: 'Organic Whole Milk (1 Gallon)', price: 3.89, category: 'Dairy', whyBuy: 'Calcium & Vitamin D for growing bones', allergies: ['Milk/Dairy'] },
  { id: 'cat_d2', name: 'Unsweetened Almond Milk (1L)', price: 2.99, category: 'Dairy', whyBuy: 'Dairy-free, low-calorie calcium alternative', allergies: ['Peanuts/Tree Nuts'] },
  { id: 'cat_d3', name: 'Greek Yogurt (Plain 500g)', price: 4.29, category: 'Dairy', whyBuy: 'Probiotics & gut health booster', allergies: ['Milk/Dairy'] },
  { id: 'cat_d4', name: 'Cheddar Cheese Block (250g)', price: 4.29, category: 'Dairy', whyBuy: 'Rich calcium snack for active kids', allergies: ['Milk/Dairy'] },

  // Pantry
  { id: 'cat_gr1', name: 'Tri-Color Quinoa (500g)', price: 6.49, category: 'Pantry', whyBuy: 'Complete amino acids & low-GI grain', allergies: [] },
  { id: 'cat_gr2', name: 'Rolled Oats (1 kg)', price: 3.99, category: 'Pantry', whyBuy: 'Beta-glucan soluble fibre for cholesterol health', allergies: [] },
  { id: 'cat_gr3', name: 'Whole Wheat Loaf', price: 3.49, category: 'Bakery', whyBuy: 'Complex carbs & sustained energy', allergies: ['Wheat/Gluten'] },
  { id: 'cat_gr4', name: 'Extra Virgin Olive Oil (500ml)', price: 8.99, category: 'Pantry', whyBuy: 'Healthy fats for cooking & salad dressings', allergies: [] },
  { id: 'cat_gr5', name: 'Chia Seeds (300g)', price: 4.49, category: 'Pantry', whyBuy: 'Omega-3 fatty acids & digestive fibre', allergies: [] },
  { id: 'cat_gr6', name: 'Raw Whole Almonds (250g)', price: 5.99, category: 'Pantry', whyBuy: 'Vitamin E & healthy snacking', allergies: ['Peanuts/Tree Nuts'] },

  // Snacks & Other
  { id: 'cat_sn1', name: 'Dark Chocolate 85% (100g)', price: 3.29, category: 'Other', whyBuy: 'Flavonoids & magnesium-rich treat', allergies: [] },
  { id: 'cat_sn2', name: 'Whey Protein Powder (500g)', price: 18.99, category: 'Protein', whyBuy: 'Post-workout muscle recovery fuel', allergies: ['Milk/Dairy'] },
]

const DEFAULT_GROCERY_ITEMS = [
  {
    id: 101,
    name: 'Wild Alaskan Salmon Fillets',
    price: 14.99,
    category: 'Protein',
    whyBuy: 'Lean protein & Omega-3 — supports healthy energy',
    isPantry: false,
    allergies: ['Seafood/Fish'],
  },
  {
    id: 102,
    name: 'Organic Eggs (12 Pack)',
    price: 4.99,
    category: 'Protein',
    whyBuy: 'High protein — great muscle fuel',
    isPantry: false,
    allergies: ['Eggs'],
  },
  {
    id: 103,
    name: 'Organic Whole Milk',
    price: 3.89,
    category: 'Dairy',
    whyBuy: 'Calcium & Vitamin D for growing kids',
    isPantry: false,
    allergies: ['Milk/Dairy'],
  },
  {
    id: 104,
    name: 'Tri-Color Quinoa (500g)',
    price: 6.49,
    category: 'Pantry',
    whyBuy: 'Low GI & complex carbs — ideal for steady blood sugar',
    isPantry: false,
    allergies: [],
  },
  {
    id: 105,
    name: 'Fresh Organic Spinach',
    price: 2.99,
    category: 'Produce',
    whyBuy: 'Rich in iron and folate for family vitality',
    isPantry: false,
    allergies: [],
  },
  {
    id: 106,
    name: 'Fresh Strawberries (1 lb)',
    price: 4.49,
    category: 'Produce',
    whyBuy: 'Vitamin C booster — delicious fresh fruit',
    isPantry: false,
    allergies: [],
  },
  {
    id: 107,
    name: 'Greek Yogurt (Plain 500g)',
    price: 4.29,
    category: 'Dairy',
    whyBuy: 'High protein & probiotics for digestive health',
    isPantry: true,
    allergies: ['Milk/Dairy'],
  },
]

// Pre-defined plan ingredient templates for auto-populating
const PLAN_INGREDIENTS = {
  1: [ // Vitality & Growth Plan
    { name: 'Organic Chicken Breasts (1 kg)', price: 11.99, category: 'Protein', whyBuy: 'High protein muscle fuel', allergies: [] },
    { name: 'Avocados (Bag of 4)', price: 4.99, category: 'Produce', whyBuy: 'Healthy fats & satiety', allergies: [] },
    { name: 'Whole Wheat Bread', price: 3.49, category: 'Bakery', whyBuy: 'Complex carbs for daily energy', allergies: ['Wheat/Gluten'] },
    { name: 'Broccoli Crowns', price: 2.49, category: 'Produce', whyBuy: 'Fibre & micronutrients for balanced nutrition', allergies: [] },
  ],
  2: [ // Lean & Clean Plan
    { name: 'Extra Lean Turkey Breast', price: 9.99, category: 'Protein', whyBuy: 'Low calorie, high protein for weight management', allergies: [] },
    { name: 'Cauliflower Rice (2 Packs)', price: 5.49, category: 'Produce', whyBuy: 'Low-carb rice alternative', allergies: [] },
    { name: 'Extra Virgin Olive Oil', price: 8.99, category: 'Pantry', whyBuy: 'Heart-healthy monounsaturated fats', allergies: [] },
  ],
  3: [ // Blood Sugar Balance Plan
    { name: 'Red Lentils (1 kg)', price: 3.99, category: 'Pantry', whyBuy: 'High fibre & low GI — stabilizes blood glucose', allergies: [] },
    { name: 'Raw Almonds (250g)', price: 5.99, category: 'Pantry', whyBuy: 'Healthy snacking for glucose stability', allergies: ['Peanuts/Tree Nuts'] },
    { name: 'Chia Seeds (300g)', price: 4.49, category: 'Pantry', whyBuy: 'Omega-3 & soluble fibre for steady digestion', allergies: [] },
  ],
  4: [ // Happy Kids Plan
    { name: 'Bananas (Bunch)', price: 1.89, category: 'Produce', whyBuy: 'Kid favourite for energy & smoothies', allergies: [] },
    { name: 'Rolled Oats (1 kg)', price: 3.99, category: 'Pantry', whyBuy: 'Sustained energy breakfast for kids', allergies: [] },
    { name: 'Cheddar Cheese Block', price: 4.29, category: 'Dairy', whyBuy: 'Calcium & protein snack for growing children', allergies: ['Milk/Dairy'] },
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
      isPantry: false,
      allergies: newItem.allergies || [],
    }
    setGroceryItems((prev) => [itemToAdd, ...prev])
  }

  const addCatalogItemToGrocery = (catalogItem) => {
    setGroceryItems((prev) => {
      // Check if already in list
      const existing = prev.find((i) => i.name.toLowerCase() === catalogItem.name.toLowerCase())
      if (existing) return prev
      const itemToAdd = {
        id: Date.now(),
        name: catalogItem.name,
        price: Number(catalogItem.price) || 0,
        category: catalogItem.category,
        whyBuy: catalogItem.whyBuy,
        isPantry: false,
        allergies: catalogItem.allergies || [],
      }
      return [itemToAdd, ...prev]
    })
  }

  const addItemsFromPlan = (plan) => {
    setActivePlan(plan)
    const templateItems = PLAN_INGREDIENTS[plan.id] || [
      { name: `${plan.name} Ingredients Pack`, price: 12.50, category: 'Pantry', whyBuy: `Auto-populated from ${plan.name}`, allergies: [] },
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
        addCatalogItemToGrocery,
        addItemsFromPlan,
      }}
    >
      {children}
    </GroceryContext.Provider>
  )
}

export const useGrocery = () => useContext(GroceryContext)
