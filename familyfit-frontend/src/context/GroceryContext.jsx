import { createContext, useContext, useState, useEffect } from 'react'

const GroceryContext = createContext(null)

// Comprehensive Kerala / South Indian Grocery Recommendation Dataset
export const KERALA_GROCERY_DATASET = [
  // Protein
  { id: 101, name: 'Fresh Mathi / Sardines (1 kg)', price: 180, category: 'Protein', whyBuy: 'Rich in Omega-3 fatty acids — Malabar coastal diet staple', allergies: ['Seafood/Fish'] },
  { id: 102, name: 'Ayala / Mackerel (1 kg)', price: 240, category: 'Protein', whyBuy: 'High protein & essential healthy fatty acids', allergies: ['Seafood/Fish'] },
  { id: 103, name: 'Neymeen / Seer Fish (500g)', price: 450, category: 'Protein', whyBuy: 'Lean protein for Kerala fish curry & grills', allergies: ['Seafood/Fish'] },
  { id: 104, name: 'Fresh Chemmeen / Prawns (500g)', price: 320, category: 'Protein', whyBuy: 'High protein seafood delicacy', allergies: ['Seafood/Fish'] },
  { id: 105, name: 'Nadan Farm Chicken (1 kg)', price: 220, category: 'Protein', whyBuy: 'Lean protein for Kerala chicken roast & stews', allergies: [] },
  { id: 106, name: 'Fresh Country Eggs (12 Pack)', price: 90, category: 'Protein', whyBuy: 'High quality complete protein for breakfast egg roast', allergies: ['Eggs'] },
  { id: 107, name: 'Cherupayar / Green Gram (1 kg)', price: 110, category: 'Protein', whyBuy: 'Traditional Kerala high-protein legume for kanji & curry', allergies: [] },
  { id: 108, name: 'Kadala / Black Chickpeas (1 kg)', price: 90, category: 'Protein', whyBuy: 'High fibre & protein — classic accompaniment for puttu', allergies: [] },
  { id: 109, name: 'Toor Dal / Parippu (1 kg)', price: 140, category: 'Protein', whyBuy: 'Essential lentil protein for Kerala parippu curry & sambar', allergies: [] },

  // Produce
  { id: 201, name: 'Ethakka / Nendran Plantain (1 kg)', price: 60, category: 'Produce', whyBuy: 'Rich in potassium & complex carbs — Kerala energy staple', allergies: [] },
  { id: 202, name: 'Tapioca / Kappa (1 kg)', price: 40, category: 'Produce', whyBuy: 'Traditional Kerala root vegetable — complex carbs', allergies: [] },
  { id: 203, name: 'Chena / Elephant Foot Yam (1 kg)', price: 50, category: 'Produce', whyBuy: 'High fibre & micronutrients for kalan & erissery', allergies: [] },
  { id: 204, name: 'Muringakka / Drumsticks (Pack of 3)', price: 40, category: 'Produce', whyBuy: 'Essential for Kerala sambar & avial — high antioxidants', allergies: [] },
  { id: 205, name: 'Kumbalanga / Ash Gourd (1 kg)', price: 35, category: 'Produce', whyBuy: 'Low calorie & hydrating vegetable for olan', allergies: [] },
  { id: 206, name: 'Fresh Grated Coconut (Pack of 2)', price: 30, category: 'Produce', whyBuy: 'Crucial Kerala staple for thoran, avial & coconut paste', allergies: [] },
  { id: 207, name: 'Small Onions / Shallots (500g)', price: 50, category: 'Produce', whyBuy: 'Authentic Kerala seasoning for tadka & sambar', allergies: [] },
  { id: 208, name: 'Fresh Curry Leaves (Bundle)', price: 15, category: 'Produce', whyBuy: 'Aromatic Kerala herbal staple — digestive & hair health', allergies: [] },

  // Dairy
  { id: 301, name: 'Fresh Thayir / Set Curd (500g)', price: 45, category: 'Dairy', whyBuy: 'Probiotics & calcium for pulissery & meals', allergies: ['Milk/Dairy'] },
  { id: 302, name: 'Sambharam / Spiced Buttermilk (500ml)', price: 25, category: 'Dairy', whyBuy: 'Cooling Kerala digestive drink with green chillies & ginger', allergies: ['Milk/Dairy'] },
  { id: 303, name: 'Pure Cow Ghee (500ml)', price: 320, category: 'Dairy', whyBuy: 'Aromatic healthy fats for parippu & payasam', allergies: ['Milk/Dairy'] },

  // Pantry & Grains
  { id: 401, name: 'Kerala Matta Rice (5 kg)', price: 280, category: 'Pantry', whyBuy: 'Unpolished nutrient-rich Kerala red rice — low GI', allergies: [] },
  { id: 402, name: 'Roasted Puttu Podi (1 kg)', price: 70, category: 'Pantry', whyBuy: 'Authentic coarse rice flour for steamed Kerala puttu', allergies: [] },
  { id: 403, name: 'Idiyappam & Appam Podi (1 kg)', price: 65, category: 'Pantry', whyBuy: 'Fine rice flour for soft string hoppers & appam', allergies: [] },
  { id: 404, name: 'Cold-Pressed Coconut Oil (1L)', price: 210, category: 'Pantry', whyBuy: 'Pure Kerala coconut oil — healthy medium-chain fats', allergies: [] },
  { id: 405, name: 'Kudampuli / Gambooge (100g)', price: 80, category: 'Pantry', whyBuy: 'Authentic Kerala fish curry souring agent — aids metabolism', allergies: [] },
  { id: 406, name: 'Malabar Tamarind (200g)', price: 45, category: 'Pantry', whyBuy: 'Rich tangy flavouring for traditional Kerala curries', allergies: [] },
  { id: 407, name: 'Kashmiri Chilli Powder (200g)', price: 75, category: 'Pantry', whyBuy: 'Vibrant red color & mild spice for Kerala roast', allergies: [] },
  { id: 408, name: 'Kerala Nadan Garam Masala (100g)', price: 60, category: 'Pantry', whyBuy: 'Handcrafted Malabar whole spice blend', allergies: [] },

  // Snacks & Other
  { id: 501, name: 'Pazham Pori Ready Mix', price: 60, category: 'Other', whyBuy: 'Kerala banana fritters snack staple', allergies: [] },
  { id: 502, name: 'Chakka Upperi / Jackfruit Chips (250g)', price: 120, category: 'Other', whyBuy: 'Traditional Malabar crunchy tea-time snack', allergies: [] },
]

export function GroceryProvider({ children }) {
  const [budget, setBudgetState] = useState(() => {
    const saved = localStorage.getItem('familyfit_grocery_budget')
    return saved ? Number(saved) : 1500
  })

  const [budgetPeriod, setBudgetPeriodState] = useState(() => {
    return localStorage.getItem('familyfit_grocery_period') || '2-Week'
  })

  const setBudget = (newBudget) => {
    setBudgetState(newBudget)
    localStorage.setItem('familyfit_grocery_budget', newBudget.toString())
  }

  const setBudgetPeriod = (period) => {
    setBudgetPeriodState(period)
    localStorage.setItem('familyfit_grocery_period', period)
  }

  const addItemsFromPlan = (planOrRecipe) => {
    try {
      const existingRaw = localStorage.getItem('familyfit_planned_meals')
      const existing = existingRaw ? JSON.parse(existingRaw) : []
      const updated = [...existing, { id: planOrRecipe.id || Date.now(), name: planOrRecipe.name, date: new Date().toISOString() }]
      localStorage.setItem('familyfit_planned_meals', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to update planned meals:', e)
    }
  }

  return (
    <GroceryContext.Provider
      value={{
        recommendations: KERALA_GROCERY_DATASET,
        budget,
        setBudget,
        budgetPeriod,
        setBudgetPeriod,
        addItemsFromPlan,
      }}
    >
      {children}
    </GroceryContext.Provider>
  )
}

export const useGrocery = () => useContext(GroceryContext)
