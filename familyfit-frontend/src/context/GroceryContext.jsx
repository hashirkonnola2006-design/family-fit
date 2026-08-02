import { createContext, useContext, useState, useEffect } from 'react'

const GroceryContext = createContext(null)

export const RAW_INGREDIENT_CATALOG = [
  // Protein
  { id: 'cat_p1', name: 'Fresh Mathi / Sardines (1 kg)', price: 180, category: 'Protein', whyBuy: 'Rich in Omega-3 fatty acids — Malabar coastal diet staple', allergies: ['Seafood/Fish'] },
  { id: 'cat_p2', name: 'Ayala / Mackerel (1 kg)', price: 240, category: 'Protein', whyBuy: 'High protein & essential healthy fatty acids', allergies: ['Seafood/Fish'] },
  { id: 'cat_p3', name: 'Neymeen / Seer Fish (500g)', price: 450, category: 'Protein', whyBuy: 'Lean protein for Kerala fish curry & grills', allergies: ['Seafood/Fish'] },
  { id: 'cat_p4', name: 'Fresh Chemmeen / Prawns (500g)', price: 320, category: 'Protein', whyBuy: 'High protein seafood delicacy', allergies: ['Seafood/Fish'] },
  { id: 'cat_p5', name: 'Nadan Farm Chicken (1 kg)', price: 220, category: 'Protein', whyBuy: 'Lean protein for Kerala chicken roast & stews', allergies: [] },
  { id: 'cat_p6', name: 'Fresh Country Eggs (12 Pack)', price: 90, category: 'Protein', whyBuy: 'High quality complete protein for breakfast egg roast', allergies: ['Eggs'] },
  { id: 'cat_p7', name: 'Cherupayar / Green Gram (1 kg)', price: 110, category: 'Protein', whyBuy: 'Traditional Kerala high-protein legume for kanji & curry', allergies: [] },
  { id: 'cat_p8', name: 'Kadala / Black Chickpeas (1 kg)', price: 90, category: 'Protein', whyBuy: 'High fibre & protein — classic accompaniment for puttu', allergies: [] },
  { id: 'cat_p9', name: 'Toor Dal / Parippu (1 kg)', price: 140, category: 'Protein', whyBuy: 'Essential lentil protein for Kerala parippu curry & sambar', allergies: [] },

  // Produce
  { id: 'cat_v1', name: 'Ethakka / Nendran Plantain (1 kg)', price: 60, category: 'Produce', whyBuy: 'Rich in potassium & complex carbs — Kerala energy staple', allergies: [] },
  { id: 'cat_v2', name: 'Tapioca / Kappa (1 kg)', price: 40, category: 'Produce', whyBuy: 'Traditional Kerala root vegetable — complex carbs', allergies: [] },
  { id: 'cat_v3', name: 'Chena / Elephant Foot Yam (1 kg)', price: 50, category: 'Produce', whyBuy: 'High fibre & micronutrients for kalan & erissery', allergies: [] },
  { id: 'cat_v4', name: 'Muringakka / Drumsticks (Pack of 3)', price: 40, category: 'Produce', whyBuy: 'Essential for Kerala sambar & avial — high antioxidants', allergies: [] },
  { id: 'cat_v5', name: 'Kumbalanga / Ash Gourd (1 kg)', price: 35, category: 'Produce', whyBuy: 'Low calorie & hydrating vegetable for olan', allergies: [] },
  { id: 'cat_v6', name: 'Fresh Grated Coconut (Pack of 2)', price: 30, category: 'Produce', whyBuy: 'Crucial Kerala staple for thoran, avial & coconut paste', allergies: [] },
  { id: 'cat_v7', name: 'Small Onions / Shallots (500g)', price: 50, category: 'Produce', whyBuy: 'Authentic Kerala seasoning for tadka & sambar', allergies: [] },
  { id: 'cat_v8', name: 'Fresh Curry Leaves (Bundle)', price: 15, category: 'Produce', whyBuy: 'Aromatic Kerala herbal staple — digestive & hair health', allergies: [] },

  // Dairy
  { id: 'cat_d1', name: 'Fresh Thayir / Set Curd (500g)', price: 45, category: 'Dairy', whyBuy: 'Probiotics & calcium for pulissery & meals', allergies: ['Milk/Dairy'] },
  { id: 'cat_d2', name: 'Sambharam / Spiced Buttermilk (500ml)', price: 25, category: 'Dairy', whyBuy: 'Cooling Kerala digestive drink with green chillies & ginger', allergies: ['Milk/Dairy'] },
  { id: 'cat_d3', name: 'Pure Cow Ghee (500ml)', price: 320, category: 'Dairy', whyBuy: 'Aromatic healthy fats for parippu & payasam', allergies: ['Milk/Dairy'] },

  // Pantry & Grains
  { id: 'cat_gr1', name: 'Kerala Matta Rice (5 kg)', price: 280, category: 'Pantry', whyBuy: 'Unpolished nutrient-rich Kerala red rice — low GI', allergies: [] },
  { id: 'cat_gr2', name: 'Roasted Puttu Podi (1 kg)', price: 70, category: 'Pantry', whyBuy: 'Authentic coarse rice flour for steamed Kerala puttu', allergies: [] },
  { id: 'cat_gr3', name: 'Idiyappam & Appam Podi (1 kg)', price: 65, category: 'Pantry', whyBuy: 'Fine rice flour for soft string hoppers & appam', allergies: [] },
  { id: 'cat_gr4', name: 'Cold-Pressed Coconut Oil (1L)', price: 210, category: 'Pantry', whyBuy: 'Pure Kerala coconut oil — healthy medium-chain fats', allergies: [] },
  { id: 'cat_gr5', name: 'Kudampuli / Gambooge (100g)', price: 80, category: 'Pantry', whyBuy: 'Authentic Kerala fish curry souring agent — aids metabolism', allergies: [] },
  { id: 'cat_gr6', name: 'Malabar Tamarind (200g)', price: 45, category: 'Pantry', whyBuy: 'Rich tangy flavouring for traditional Kerala curries', allergies: [] },
  { id: 'cat_gr7', name: 'Kashmiri Chilli Powder (200g)', price: 75, category: 'Pantry', whyBuy: 'Vibrant red color & mild spice for Kerala roast', allergies: [] },
  { id: 'cat_gr8', name: 'Kerala Nadan Garam Masala (100g)', price: 60, category: 'Pantry', whyBuy: 'Handcrafted Malabar whole spice blend', allergies: [] },

  // Snacks & Other
  { id: 'cat_sn1', name: 'Pazham Pori Ready Mix', price: 60, category: 'Other', whyBuy: 'Kerala banana fritters snack staple', allergies: [] },
  { id: 'cat_sn2', name: 'Chakka Upperi / Jackfruit Chips (250g)', price: 120, category: 'Other', whyBuy: 'Traditional Malabar crunchy tea-time snack', allergies: [] },
]

const DEFAULT_GROCERY_ITEMS = [
  {
    id: 101,
    name: 'Fresh Mathi / Sardines (1 kg)',
    price: 180,
    category: 'Protein',
    whyBuy: 'Rich in Omega-3 fatty acids — Malabar coastal diet staple',
    isPantry: false,
    allergies: ['Seafood/Fish'],
  },
  {
    id: 102,
    name: 'Fresh Country Eggs (12 Pack)',
    price: 90,
    category: 'Protein',
    whyBuy: 'Complete protein for breakfast egg roast',
    isPantry: false,
    allergies: ['Eggs'],
  },
  {
    id: 103,
    name: 'Kerala Matta Rice (5 kg)',
    price: 280,
    category: 'Pantry',
    whyBuy: 'Unpolished Kerala red rice — low GI & high fibre',
    isPantry: false,
    allergies: [],
  },
  {
    id: 104,
    name: 'Ethakka / Nendran Plantain (1 kg)',
    price: 60,
    category: 'Produce',
    whyBuy: 'Rich in potassium & complex carbs — energy staple',
    isPantry: false,
    allergies: [],
  },
  {
    id: 105,
    name: 'Cold-Pressed Coconut Oil (1L)',
    price: 210,
    category: 'Pantry',
    whyBuy: 'Pure Kerala coconut oil — healthy medium-chain fats',
    isPantry: false,
    allergies: [],
  },
  {
    id: 106,
    name: 'Fresh Grated Coconut (Pack of 2)',
    price: 30,
    category: 'Produce',
    whyBuy: 'Crucial Kerala staple for thoran & avial',
    isPantry: false,
    allergies: [],
  },
  {
    id: 107,
    name: 'Fresh Thayir / Set Curd (500g)',
    price: 45,
    category: 'Dairy',
    whyBuy: 'Probiotics & gut health booster',
    isPantry: true,
    allergies: ['Milk/Dairy'],
  },
]

// Pre-defined plan ingredient templates for auto-populating
const PLAN_INGREDIENTS = {
  1: [ // Kerala Family Thali Plan
    { name: 'Kerala Matta Rice (5 kg)', price: 280, category: 'Pantry', whyBuy: 'Nutrient-dense Kerala red rice staple', allergies: [] },
    { name: 'Toor Dal / Parippu (1 kg)', price: 140, category: 'Protein', whyBuy: 'Lentil protein for parippu curry', allergies: [] },
    { name: 'Beans & Cabbage for Thoran', price: 50, category: 'Produce', whyBuy: 'High fibre vegetable side dish', allergies: [] },
    { name: 'Fresh Thayir / Set Curd (500g)', price: 45, category: 'Dairy', whyBuy: 'Probiotics & cooling side', allergies: ['Milk/Dairy'] },
  ],
  2: [ // Malabar High-Protein Plan
    { name: 'Fresh Mathi / Sardines (1 kg)', price: 180, category: 'Protein', whyBuy: 'High Omega-3 protein for fish curry', allergies: ['Seafood/Fish'] },
    { name: 'Nadan Farm Chicken (1 kg)', price: 220, category: 'Protein', whyBuy: 'Lean protein for Kerala chicken roast', allergies: [] },
    { name: 'Fresh Country Eggs (12 Pack)', price: 90, category: 'Protein', whyBuy: 'Protein fuel for egg curry', allergies: ['Eggs'] },
  ],
  3: [ // Diabetes-Friendly Kerala Plan
    { name: 'Cherupayar / Green Gram (1 kg)', price: 110, category: 'Protein', whyBuy: 'Low GI green gram legume', allergies: [] },
    { name: 'Kudampuli / Gambooge (100g)', price: 80, category: 'Pantry', whyBuy: 'Metabolism-supporting fish curry souring agent', allergies: [] },
    { name: 'Fresh Organic Spinach & Drumstick', price: 60, category: 'Produce', whyBuy: 'Low GI veggies for blood sugar management', allergies: [] },
  ],
  4: [ // Kids Special Malabar Plan
    { name: 'Appam & Idiyappam Podi (1 kg)', price: 65, category: 'Pantry', whyBuy: 'Soft rice flour for kids breakfast appam', allergies: [] },
    { name: 'Ethakka / Nendran Bananas (1 kg)', price: 60, category: 'Produce', whyBuy: 'Natural energy fruit for pazham pori', allergies: [] },
    { name: 'Kadala / Black Chickpeas (1 kg)', price: 90, category: 'Protein', whyBuy: 'High protein curry partner for puttu', allergies: [] },
  ],
}

export function GroceryProvider({ children }) {
  const [groceryItems, setGroceryItems] = useState(() => {
    const saved = localStorage.getItem('familyfit_grocery_items')
    return saved ? JSON.parse(saved) : DEFAULT_GROCERY_ITEMS
  })

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('familyfit_grocery_budget')
    return saved ? Number(saved) : 1500
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
      whyBuy: newItem.whyBuy || 'Kerala family nutrition',
      isPantry: false,
      allergies: newItem.allergies || [],
    }
    setGroceryItems((prev) => [itemToAdd, ...prev])
  }

  const addCatalogItemToGrocery = (catalogItem) => {
    setGroceryItems((prev) => {
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
      { name: `${plan.name} Ingredients Pack`, price: 450, category: 'Pantry', whyBuy: `Auto-populated from ${plan.name}`, allergies: [] },
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
