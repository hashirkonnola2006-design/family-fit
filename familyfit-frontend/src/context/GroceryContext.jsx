import { createContext, useContext, useState } from 'react'

const GroceryContext = createContext(null)

// Comprehensive Kerala / South Indian Grocery Recommendation Dataset
export const KERALA_GROCERY_DATASET = [
  // Produce (8 Items)
  {
    id: 201,
    name: 'Ethakka / Nendran Plantain (1 kg)',
    price: 60,
    category: 'Produce',
    whyBuy: "Rich in potassium & complex carbs — Kerala's energy staple",
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80',
    bgTint: '#FFF8C5',
    allergies: [],
  },
  {
    id: 202,
    name: 'Tapioca / Kappa (1 kg)',
    price: 40,
    category: 'Produce',
    whyBuy: 'Traditional Kerala root vegetable — complex carbs',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?w=800&q=80',
    bgTint: '#F4EFE6',
    allergies: [],
  },
  {
    id: 203,
    name: 'Chena / Elephant Foot Yam (1 kg)',
    price: 50,
    category: 'Produce',
    whyBuy: 'Great source of fiber & minerals — perfect for balanced meals',
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&q=80',
    bgTint: '#EFECE6',
    allergies: [],
  },
  {
    id: 204,
    name: 'Capsicum Yellow (1 kg)',
    price: 80,
    category: 'Produce',
    whyBuy: 'High in Vitamin C & antioxidants — adds color & nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80',
    bgTint: '#FFF3E0',
    allergies: [],
  },
  {
    id: 205,
    name: 'Beans (1 kg)',
    price: 60,
    category: 'Produce',
    whyBuy: 'High in fiber, vitamins & minerals — supports healthy digestion',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80',
    bgTint: '#EBF5E1',
    allergies: [],
  },
  {
    id: 206,
    name: 'Muringakka / Drumsticks (Pack of 3)',
    price: 40,
    category: 'Produce',
    whyBuy: 'Essential for Kerala sambar & avial — high antioxidants',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80',
    bgTint: '#E8F5E9',
    allergies: [],
  },
  {
    id: 207,
    name: 'Fresh Grated Coconut (Pack of 2)',
    price: 30,
    category: 'Produce',
    whyBuy: 'Crucial Kerala staple for thoran, avial & coconut paste',
    imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
    bgTint: '#F5F5F5',
    allergies: [],
  },
  {
    id: 208,
    name: 'Small Onions / Shallots (500g)',
    price: 50,
    category: 'Produce',
    whyBuy: 'Authentic Kerala seasoning for tadka & sambar',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80',
    bgTint: '#FCE4EC',
    allergies: [],
  },

  // Protein
  {
    id: 101,
    name: 'Fresh Mathi / Sardines (1 kg)',
    price: 180,
    category: 'Protein',
    whyBuy: 'Rich in Omega-3 fatty acids — Malabar coastal diet staple',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    bgTint: '#E0F2FE',
    allergies: ['Seafood/Fish'],
  },
  {
    id: 102,
    name: 'Ayala / Mackerel (1 kg)',
    price: 240,
    category: 'Protein',
    whyBuy: 'High protein & essential healthy fatty acids',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    bgTint: '#E0F2FE',
    allergies: ['Seafood/Fish'],
  },
  {
    id: 103,
    name: 'Neymeen / Seer Fish (500g)',
    price: 450,
    category: 'Protein',
    whyBuy: 'Lean protein for Kerala fish curry & grills',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    bgTint: '#E0F2FE',
    allergies: ['Seafood/Fish'],
  },
  {
    id: 104,
    name: 'Nadan Farm Chicken (1 kg)',
    price: 220,
    category: 'Protein',
    whyBuy: 'Lean protein for Kerala chicken roast & stews',
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80',
    bgTint: '#FEF3C7',
    allergies: [],
  },
  {
    id: 105,
    name: 'Fresh Country Eggs (12 Pack)',
    price: 90,
    category: 'Protein',
    whyBuy: 'High quality complete protein for breakfast egg roast',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80',
    bgTint: '#FFFBEB',
    allergies: ['Eggs'],
  },

  // Dairy
  {
    id: 301,
    name: 'Fresh Thayir / Set Curd (500g)',
    price: 45,
    category: 'Dairy',
    whyBuy: 'Probiotics & calcium for pulissery & meals',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    bgTint: '#F8FAFC',
    allergies: ['Milk/Dairy'],
  },
  {
    id: 302,
    name: 'Pure Cow Ghee (500ml)',
    price: 320,
    category: 'Dairy',
    whyBuy: 'Aromatic healthy fats for parippu & payasam',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&q=80',
    bgTint: '#FEF3C7',
    allergies: ['Milk/Dairy'],
  },

  // Pantry & Grains
  {
    id: 401,
    name: 'Kerala Matta Rice (5 kg)',
    price: 280,
    category: 'Pantry',
    whyBuy: 'Unpolished nutrient-rich Kerala red rice — low GI',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    bgTint: '#FEE2E2',
    allergies: [],
  },
  {
    id: 402,
    name: 'Cold-Pressed Coconut Oil (1L)',
    price: 210,
    category: 'Pantry',
    whyBuy: 'Pure Kerala coconut oil — healthy medium-chain fats',
    imageUrl: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&q=80',
    bgTint: '#F1F5F9',
    allergies: [],
  },
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
