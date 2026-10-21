import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const GroceryContext = createContext(null)

// Comprehensive Kerala / South Indian Grocery Recommendation Dataset
// Annotated with specific health benefits for conditions (Diabetes, High Blood Pressure, High Cholesterol)
// and fitness goals (Low sugar, Heart care, Lose weight, Gain muscle, Grow healthy, Maintain weight)
export const KERALA_GROCERY_DATASET = [
  // ── PRODUCE & VEGETABLES ──
  {
    id: 201,
    name: 'Ethakka / Nendran Plantain (1 kg)',
    price: 60,
    category: 'Produce',
    whyBuy: "Rich in potassium & complex carbs — Kerala's energy staple",
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80',
    bgTint: '#FFF8C5',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['grow healthy', 'gain muscle'],
    healthHighlight: 'High potassium & natural complex carbs for sustained growth and muscle replenishment',
  },
  {
    id: 202,
    name: 'Tapioca / Kappa (1 kg)',
    price: 40,
    category: 'Produce',
    whyBuy: 'Traditional Kerala root vegetable — complex carbs',
    imageUrl: '/images/tapioca_kappa.jpg',
    bgTint: '#F4EFE6',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['gain muscle', 'maintain weight'],
    healthHighlight: 'Traditional complex carbohydrates for clean stamina & active energy',
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
    goodForConditions: ['diabetes', 'high cholesterol'],
    goodForGoals: ['low sugar', 'lose weight'],
    healthHighlight: 'Prebiotic diosgenin & low glycemic index stabilizes glucose & flushes cholesterol',
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
    goodForConditions: [],
    goodForGoals: ['lose weight', 'maintain weight'],
    healthHighlight: 'Thermogenic antioxidants & Vitamin C accelerate fat metabolism',
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
    goodForConditions: ['diabetes', 'high cholesterol'],
    goodForGoals: ['low sugar', 'lose weight'],
    healthHighlight: 'High soluble fiber delays digestion and halts post-meal blood sugar surges',
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
    goodForConditions: ['high blood pressure', 'diabetes'],
    goodForGoals: ['heart care', 'low sugar'],
    healthHighlight: 'Bioactive potassium & quercetin relax arterial walls and lower blood pressure',
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
    goodForConditions: [],
    goodForGoals: ['maintain weight', 'grow healthy'],
    healthHighlight: 'Medium chain triglycerides (MCTs) support cellular energy and gut lining',
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
    goodForConditions: ['high blood pressure', 'high cholesterol'],
    goodForGoals: ['heart care'],
    healthHighlight: 'Allicin and organosulfur compounds prevent arterial stiffness and lower hypertension',
  },
  {
    id: 209,
    name: 'Kerala Farm Fresh Tomatoes / Thakkali (1 kg)',
    price: 45,
    category: 'Produce',
    whyBuy: 'Lycopene rich antioxidant staple for rasam, curries & salads',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
    bgTint: '#FEE2E2',
    allergies: [],
    goodForConditions: ['high blood pressure', 'high cholesterol'],
    goodForGoals: ['heart care', 'lose weight'],
    healthHighlight: 'Lycopene protects blood vessel endothelium and reduces LDL oxidation',
  },
  {
    id: 210,
    name: 'Fresh Potatoes / Urulakkizhangu (1 kg)',
    price: 40,
    category: 'Produce',
    whyBuy: 'Comforting complex carbs for Kerala stew & masala curries',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
    bgTint: '#FEF3C7',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['gain muscle', 'grow healthy'],
    healthHighlight: 'Readily absorbable glycogen support for sports and growing children',
  },
  {
    id: 211,
    name: 'Venda / Okra / Ladies Finger (1 kg)',
    price: 50,
    category: 'Produce',
    whyBuy: 'High in soluble fiber & folate — excellent for pachadi & theeyal',
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&q=80',
    bgTint: '#ECFDF5',
    allergies: [],
    goodForConditions: ['diabetes', 'high cholesterol'],
    goodForGoals: ['low sugar', 'lose weight'],
    healthHighlight: 'Natural mucilage traps sugar molecules in the gut, reducing blood glucose spikes',
  },
  {
    id: 212,
    name: 'Pavakka / Bitter Gourd (1 kg)',
    price: 55,
    category: 'Produce',
    whyBuy: 'Regulates blood glucose & boosts immunity — perfect for mezhukkupuratti',
    imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&q=80',
    bgTint: '#F0FDF4',
    allergies: [],
    goodForConditions: ['diabetes'],
    goodForGoals: ['low sugar'],
    healthHighlight: 'Plant insulin (polypeptide-p) & charantin directly reduce blood sugar levels',
  },
  {
    id: 213,
    name: 'Padavalanga / Snake Gourd (1 kg)',
    price: 45,
    category: 'Produce',
    whyBuy: 'Cooling, hydrating, and low-calorie — wonderful for kootu curry & thoran',
    imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&q=80',
    bgTint: '#F0FDF4',
    allergies: [],
    goodForConditions: ['diabetes'],
    goodForGoals: ['low sugar', 'lose weight'],
    healthHighlight: 'High water volume and zero fat gently regulates digestion and weight',
  },
  {
    id: 214,
    name: 'Kumbalanga / Ash Gourd (1 kg)',
    price: 35,
    category: 'Produce',
    whyBuy: 'High moisture, detoxifying & gut-healing — prime ingredient for olan',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
    bgTint: '#F8FAFC',
    allergies: [],
    goodForConditions: ['high blood pressure', 'diabetes'],
    goodForGoals: ['heart care', 'lose weight'],
    healthHighlight: 'Flushes excess systemic sodium and lowers elevated blood pressure naturally',
  },
  {
    id: 215,
    name: 'Mathanga / Red Pumpkin (1 kg)',
    price: 35,
    category: 'Produce',
    whyBuy: 'Beta-carotene powerhouse for eye health — essential for erissery & sambar',
    imageUrl: 'https://images.unsplash.com/photo-1506917728037-b6af01a7d403?w=800&q=80',
    bgTint: '#FFF7ED',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['grow healthy', 'maintain weight'],
    healthHighlight: 'High provitamin A carotenoids essential for childhood eyesight and cellular immunity',
  },
  {
    id: 216,
    name: 'Ooty Carrots (1 kg)',
    price: 60,
    category: 'Produce',
    whyBuy: 'Crunchy Vitamin A and dietary fiber for avial & salads',
    imageUrl: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&q=80',
    bgTint: '#FFF1F2',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['grow healthy', 'maintain weight'],
    healthHighlight: 'Beta-carotene and lutein protect retinal cells and promote healthy development',
  },
  {
    id: 217,
    name: 'Fresh Green Cabbage (1 kg)',
    price: 40,
    category: 'Produce',
    whyBuy: 'Crisp cruciferous veggie packed with Vitamin K — ideal for daily thoran',
    imageUrl: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&q=80',
    bgTint: '#F0FDF4',
    allergies: [],
    goodForConditions: ['diabetes'],
    goodForGoals: ['low sugar', 'lose weight'],
    healthHighlight: 'Cruciferous sulforaphane supports cellular detoxification and glycemic balance',
  },
  {
    id: 218,
    name: 'Fresh Cauliflower (1 piece / 800g)',
    price: 45,
    category: 'Produce',
    whyBuy: 'Choline & antioxidant-rich florets for nutritious curries & roasts',
    imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&q=80',
    bgTint: '#F8FAFC',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['lose weight', 'maintain weight'],
    healthHighlight: 'Very low carbohydrate density ideal for guilt-free fiber and weight management',
  },
  {
    id: 219,
    name: 'Beetroot (1 kg)',
    price: 45,
    category: 'Produce',
    whyBuy: 'Nitrates boost stamina & heart health — makes gorgeous pachadi & thoran',
    imageUrl: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&q=80',
    bgTint: '#FDF2F8',
    allergies: [],
    goodForConditions: ['high blood pressure'],
    goodForGoals: ['heart care', 'gain muscle'],
    healthHighlight: 'Dietary nitrates synthesize nitric oxide within hours, dilating constricted arteries and lowering BP',
  },
  {
    id: 220,
    name: 'Vazhuthananga / Green Brinjal (1 kg)',
    price: 45,
    category: 'Produce',
    whyBuy: 'Tender native eggplants with polyphenols for authentic ennai kathirikai',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
    bgTint: '#FAF5FF',
    allergies: [],
    goodForConditions: ['diabetes', 'high cholesterol'],
    goodForGoals: ['low sugar'],
    healthHighlight: 'Chlorogenic acid inhibits glucose-6-phosphatase, damping blood sugar elevation',
  },
  {
    id: 221,
    name: 'Cheera / Red Amaranth Spinach (Bunch)',
    price: 25,
    category: 'Produce',
    whyBuy: 'Supercharged iron & calcium greens — Kerala grandmother staple',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
    bgTint: '#FDF2F8',
    allergies: [],
    goodForConditions: ['high blood pressure', 'diabetes'],
    goodForGoals: ['heart care', 'grow healthy', 'gain muscle'],
    healthHighlight: 'Abundant bioavailable iron & potassium supports oxygenation, hemoglobin & BP control',
  },
  {
    id: 222,
    name: 'Chembu / Colocasia / Taro Root (1 kg)',
    price: 55,
    category: 'Produce',
    whyBuy: 'High prebiotic fiber root for gut health — classic boiled chembu & mulaku',
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&q=80',
    bgTint: '#F5F5F4',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['maintain weight', 'grow healthy'],
    healthHighlight: 'Resistant starch gently feeds beneficial colon bacteria and prevents sluggish digestion',
  },
  {
    id: 223,
    name: 'Vellarikka / Kerala Golden Cucumber (1 kg)',
    price: 35,
    category: 'Produce',
    whyBuy: 'Deeply hydrating traditional vegetable for moru curry & pulissery',
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80',
    bgTint: '#FEF9C3',
    allergies: [],
    goodForConditions: ['high blood pressure'],
    goodForGoals: ['heart care', 'lose weight'],
    healthHighlight: 'Natural plant sterols and high water content wash out excess fluid retention',
  },
  {
    id: 224,
    name: 'Nadan Inji / Fresh Green Ginger (250g)',
    price: 35,
    category: 'Produce',
    whyBuy: 'Potent digestive gingerols for inji puli & aromatic Kerala seasonings',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80',
    bgTint: '#FEF3C7',
    allergies: [],
    goodForConditions: ['diabetes', 'high cholesterol'],
    goodForGoals: ['heart care', 'lose weight'],
    healthHighlight: 'Gingerols enhance cellular insulin receptors and promote thermogenic calorie burning',
  },
  {
    id: 225,
    name: 'Fresh Green Chillies / Pacha Mulaku (250g)',
    price: 20,
    category: 'Produce',
    whyBuy: 'Capsaicin kicks metabolism and adds authentic Kerala zing',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&q=80',
    bgTint: '#ECFDF5',
    allergies: [],
    goodForConditions: [],
    goodForGoals: ['lose weight'],
    healthHighlight: 'Capsaicin temporarily accelerates resting metabolic rate and suppresses appetite',
  },

  // ── PROTEIN & SEAFOOD ──
  {
    id: 101,
    name: 'Fresh Mathi / Sardines (1 kg)',
    price: 180,
    category: 'Protein',
    whyBuy: 'Rich in Omega-3 fatty acids — Malabar coastal diet staple',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    bgTint: '#E0F2FE',
    allergies: ['Seafood/Fish'],
    goodForConditions: ['high blood pressure', 'high cholesterol'],
    goodForGoals: ['heart care', 'gain muscle'],
    healthHighlight: 'High EPA & DHA Omega-3 cleanses arterial walls, lowers triglycerides & protects the heart',
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
    goodForConditions: ['high blood pressure', 'high cholesterol'],
    goodForGoals: ['heart care', 'gain muscle'],
    healthHighlight: 'Cardio-protective marine fats and complete amino acids for athletic muscle repair',
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
    goodForConditions: [],
    goodForGoals: ['gain muscle', 'maintain weight'],
    healthHighlight: 'Ultra-pure lean protein with minimal saturated fat for muscle building',
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
    goodForConditions: [],
    goodForGoals: ['gain muscle', 'lose weight', 'grow healthy'],
    healthHighlight: 'Complete lean animal protein that supports muscle hypertrophy and kid growth without excess fat',
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
    goodForConditions: [],
    goodForGoals: ['gain muscle', 'grow healthy'],
    healthHighlight: 'Complete amino acid score + choline for brain cognitive development and muscle synthesis',
  },

  // ── DAIRY ──
  {
    id: 301,
    name: 'Fresh Thayir / Set Curd (500g)',
    price: 45,
    category: 'Dairy',
    whyBuy: 'Probiotics & calcium for pulissery & meals',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    bgTint: '#F8FAFC',
    allergies: ['Milk/Dairy'],
    goodForConditions: [],
    goodForGoals: ['maintain weight', 'grow healthy'],
    healthHighlight: 'Live Lactobacillus probiotics fortify microbiome and bioavailable calcium hardens bones',
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
    goodForConditions: [],
    goodForGoals: ['grow healthy'],
    healthHighlight: 'Short-chain butyric acid nourishes enterocytes and eases vitamin absorption for children',
  },
  {
    id: 303,
    name: 'Fresh Cow Milk (1L Pouch)',
    price: 54,
    category: 'Dairy',
    whyBuy: 'Pasteurized fresh cow milk for morning tea, coffee & porridge',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80',
    bgTint: '#F8FAFC',
    allergies: ['Milk/Dairy'],
    goodForConditions: [],
    goodForGoals: ['grow healthy', 'gain muscle'],
    healthHighlight: 'Calcium, phosphorus and whey protein for growing bones and muscle development',
  },

  // ── PANTRY & GRAINS ──
  {
    id: 401,
    name: 'Kerala Matta Rice (5 kg)',
    price: 280,
    category: 'Pantry',
    whyBuy: 'Unpolished nutrient-rich Kerala red rice — low GI',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    bgTint: '#FEE2E2',
    allergies: [],
    goodForConditions: ['diabetes'],
    goodForGoals: ['low sugar', 'maintain weight'],
    healthHighlight: 'Unpolished bran layer produces low glycemic response, preventing sugar crashes',
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
    goodForConditions: [],
    goodForGoals: ['maintain weight'],
    healthHighlight: 'Lauric acid and clean medium chain fatty acids promote healthy cellular metabolism',
  },
  {
    id: 403,
    name: 'Peanuts / Roasted Groundnuts (500g)',
    price: 75,
    category: 'Pantry',
    whyBuy: 'Roasted Kerala groundnuts for crunchy snack & chutneys',
    imageUrl: 'https://images.unsplash.com/photo-1567406899686-28c8959d0426?w=800&q=80',
    bgTint: '#FFFBEB',
    allergies: ['Peanuts/Tree Nuts'],
    goodForConditions: [],
    goodForGoals: ['gain muscle'],
    healthHighlight: 'High plant protein and monounsaturated fats (Severe allergen for nut-allergic members)',
  },
  {
    id: 404,
    name: 'Cashew Nuts / Andiparippu (250g)',
    price: 210,
    category: 'Pantry',
    whyBuy: 'Kollam premium cashews for Kerala payasam & garnishing',
    imageUrl: 'https://images.unsplash.com/photo-1509912760195-4f40f0ec997b?w=800&q=80',
    bgTint: '#FFF7ED',
    allergies: ['Peanuts/Tree Nuts'],
    goodForConditions: [],
    goodForGoals: ['gain muscle', 'grow healthy'],
    healthHighlight: 'Rich in magnesium and copper (Severe allergen for nut-allergic members)',
  },
  {
    id: 405,
    name: 'Whole Wheat Chakki Atta (5 kg)',
    price: 240,
    category: 'Pantry',
    whyBuy: 'High fiber whole wheat for soft Kerala chapathi',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
    bgTint: '#FEF3C7',
    allergies: ['Wheat/Gluten'],
    goodForConditions: [],
    goodForGoals: ['maintain weight'],
    healthHighlight: 'Stone ground whole grain with intact germ & endosperm fiber (Contains Gluten)',
  },
]

export function GroceryProvider({ children }) {
  const auth = useAuth()
  const familyId = auth?.user?.familyId
  const cartKey = familyId ? `familyfit_grocery_cart_${familyId}` : 'familyfit_grocery_cart'

  const [budget, setBudgetState] = useState(() => {
    const saved = localStorage.getItem('familyfit_grocery_budget')
    return saved ? Number(saved) : 1500
  })

  const [budgetPeriod, setBudgetPeriodState] = useState(() => {
    return localStorage.getItem('familyfit_grocery_period') || '2-Week'
  })

  // ── CART STATE (Empty by default for new accounts, persisted per family) ──
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(cartKey) || localStorage.getItem('familyfit_grocery_cart')
      if (saved !== null) {
        return JSON.parse(saved)
      }
    } catch {}
    return {}
  })

  // Synchronize cart when family switches or user signs up/in
  useEffect(() => {
    try {
      const saved = localStorage.getItem(cartKey)
      if (saved !== null) {
        setCart(JSON.parse(saved))
      } else {
        setCart({})
      }
    } catch {
      setCart({})
    }
  }, [familyId, cartKey])

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart))
    } catch (e) {
      console.warn('Failed to persist cart:', e)
    }
  }, [cart, cartKey])

  const setBudget = (newBudget) => {
    setBudgetState(newBudget)
    localStorage.setItem('familyfit_grocery_budget', newBudget.toString())
  }

  const setBudgetPeriod = (period) => {
    setBudgetPeriodState(period)
    localStorage.setItem('familyfit_grocery_period', period)
  }

  const addToCart = (item, quantity = 1) => {
    if (!item?.id) return
    setCart((prev) => {
      const currentQty = prev[item.id]?.quantity || 0
      const nextQty = currentQty + quantity
      return {
        ...prev,
        [item.id]: {
          id: item.id,
          name: item.name,
          price: item.price,
          unit: item.unit || '1 kg',
          category: item.category,
          imageUrl: item.imageUrl,
          quantity: nextQty,
        },
      }
    })
  }

  const updateCartQuantity = (itemId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const next = { ...prev }
        delete next[itemId]
        return next
      }
      if (!prev[itemId]) return prev
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity,
        },
      }
    })
  }

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }

  const clearCart = () => {
    setCart({})
  }

  const cartItemsArray = Object.values(cart)
  const cartCount = cartItemsArray.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
  const cartSubtotal = cartItemsArray.reduce(
    (acc, curr) => acc + (curr.price || 0) * (curr.quantity || 0),
    0
  )

  const addItemsFromPlan = (planOrRecipe) => {
    try {
      const existingRaw = localStorage.getItem('familyfit_planned_meals')
      const existing = existingRaw ? JSON.parse(existingRaw) : []
      const updated = [
        ...existing,
        { id: planOrRecipe.id || Date.now(), name: planOrRecipe.name, date: new Date().toISOString() },
      ]
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
        // Cart API
        cart,
        cartItemsArray,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </GroceryContext.Provider>
  )
}

export const useGrocery = () => useContext(GroceryContext)
