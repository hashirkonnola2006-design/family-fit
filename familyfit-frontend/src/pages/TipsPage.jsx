import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bookmark,
  Clock,
  Check,
  ShieldAlert,
  ShieldCheck,
  ArrowUpDown,
  User,
  Activity,
  HeartPulse,
  Sparkles,
  ChevronRight,
  X,
  SlidersHorizontal
} from 'lucide-react'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import BottomNav from '../components/BottomNav'

/**
 * Dynamically builds evidence-based Kerala wellness tips based on the
 * real family members' age, medical conditions, allergies, and goals.
 */
function buildPersonalizedTips(members = []) {
  const tips = []

  // Extract member details
  const seniors = []
  const kids = []
  const adults = []

  members.forEach((m) => {
    if (!m) return
    const age = Number(m.age) || 0
    if (age >= 60) seniors.push(m)
    else if (age > 0 && age < 18) kids.push(m)
    else if (age >= 18) adults.push(m)
  })

  const matchCondition = (keyword) => {
    const matched = members.filter((m) => {
      const conds = (m.healthConditions || []).map((c) => String(c).toLowerCase())
      const goal = String(m.goal || '').toLowerCase()
      return conds.some((c) => c.includes(keyword)) || goal.includes(keyword)
    })
    return {
      names: matched.map((m) => m.name),
      ids: matched.map((m) => m.id),
      found: matched.length > 0,
    }
  }

  const matchAllergy = (keyword) => {
    const matched = members.filter((m) => {
      const allergies = (m.allergies || []).map((a) => String(a).toLowerCase())
      return allergies.some((a) => a.includes(keyword))
    })
    return {
      names: matched.map((m) => m.name),
      ids: matched.map((m) => m.id),
      found: matched.length > 0,
    }
  }

  // ── 1. CLINICAL CONDITIONS (DIABETES, BLOOD PRESSURE, CHOLESTEROL) ──
  const diabetesMatch = matchCondition('diabet')
  const lowSugarMatch = matchCondition('sugar')
  const diabetesTarget = diabetesMatch.found ? diabetesMatch : lowSugarMatch

  tips.push({
    id: 'tip-matta-rice',
    category: 'Clinical Care',
    tag: 'Blood Sugar Control',
    title: 'Unpolished Kerala Matta Rice for Sustained Glucose Balance',
    summary: 'Unlike polished white rice, parboiled Red Matta rice preserves its nutrient-dense bran layer and germ to prevent energy crashes.',
    detail: 'Matta rice has a lower glycemic index than polished long-grain rice. Its complex carbohydrates release glucose gradually into the bloodstream, blunting postprandial insulin spikes.',
    benefit: 'Sustained energy and stabilized insulin response',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: diabetesTarget.found ? 1 : 2,
    targetMemberIds: diabetesTarget.ids,
    targetMemberNames: diabetesTarget.names,
    accent: '#2E7D32',
    isUniversal: !diabetesTarget.found,
  })

  tips.push({
    id: 'tip-pavakka',
    category: 'Clinical Care',
    tag: 'Glycemic Regulation',
    title: 'Bitter Gourd (Pavakka) and Plant Insulin (Polypeptide-P)',
    summary: 'Bitter melon contains charantin and polypeptide-p, bio-compounds that mimic insulin and stimulate cellular glucose uptake.',
    detail: 'Consuming lightly salted steamed Pavakka Mezhukkupuratti 2 to 3 times weekly assists pancreatic beta-cell efficiency and helps reduce post-meal spikes after traditional Kerala meals.',
    benefit: 'Stimulates cellular glucose uptake and improves insulin sensitivity',
    readTime: '3 min read',
    readTimeMinutes: 3,
    priority: diabetesTarget.found ? 1 : 2,
    targetMemberIds: diabetesTarget.ids,
    targetMemberNames: diabetesTarget.names,
    accent: '#15803D',
    isUniversal: !diabetesTarget.found,
  })

  tips.push({
    id: 'tip-fenugreek',
    category: 'Clinical Care',
    tag: 'Metabolic Ritual',
    title: 'Fenugreek (Uluva Kanji) for Post-Meal Glucose Moderation',
    summary: 'Fenugreek seeds are loaded with 4-hydroxyisoleucine, a soluble fiber that delays carbohydrate absorption in the stomach.',
    detail: 'A warm bowl of light Uluva Kanji or drinking warm water infused with overnight-soaked fenugreek seeds before lunch moderates glucose absorption and improves glycemic markers.',
    benefit: 'Delays glucose absorption and optimizes digestion',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: diabetesTarget.found ? 1 : 3,
    targetMemberIds: diabetesTarget.ids,
    targetMemberNames: diabetesTarget.names,
    accent: '#C2410C',
    isUniversal: !diabetesTarget.found,
  })

  // High Blood Pressure / Hypertension
  const bpMatch = matchCondition('blood pressure')
  const hyperMatch = matchCondition('hypertens')
  const bpTarget = bpMatch.found ? bpMatch : hyperMatch

  tips.push({
    id: 'tip-moringa-bp',
    category: 'Clinical Care',
    tag: 'Blood Pressure Care',
    title: 'Moringa Leaves (Muringayila) for Vascular Health',
    summary: 'Moringa leaves contain bioavailable potassium and quercetin, naturally relaxing arterial walls and helping flush excess dietary sodium.',
    detail: 'Muringayila thoran with minimal coconut oil is a staple of Kerala longevity. Potassium counterbalances dietary sodium while quercetin acts as an antioxidant that supports arterial elasticity.',
    benefit: 'Relaxes blood vessel walls and promotes healthy blood pressure',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: bpTarget.found ? 1 : 2,
    targetMemberIds: bpTarget.ids,
    targetMemberNames: bpTarget.names,
    accent: '#0284C7',
    isUniversal: !bpTarget.found,
  })

  tips.push({
    id: 'tip-garlic-rasam',
    category: 'Clinical Care',
    tag: 'Vascular Relaxation',
    title: 'Fresh Garlic (Veluthulli) Rasam for Nitric Oxide Release',
    summary: 'Crushed raw garlic contains allicin, which prompts endothelial cells to generate nitric oxide for natural arterial vasodilation.',
    detail: 'Simmering freshly crushed garlic cloves in mild cumin-tomato rasam without boiling off volatile sulfur compounds preserves allicin activity, supporting relaxed arteries and lower vascular tension.',
    benefit: 'Promotes arterial vasodilation and cardiac relaxation',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: bpTarget.found ? 1 : 3,
    targetMemberIds: bpTarget.ids,
    targetMemberNames: bpTarget.names,
    accent: '#0369A1',
    isUniversal: !bpTarget.found,
  })

  tips.push({
    id: 'tip-kodampuli-sodium',
    category: 'Clinical Care',
    tag: 'Sodium Moderation',
    title: 'Replace Table Salt with Kodampuli & Kokum Acidity',
    summary: 'Using tart Garcinia cambogia (Kodampuli) enhances savory taste depth, allowing you to lower table salt by up to 40% without losing flavor.',
    detail: 'High sodium stiffens arterial walls. Kodampuli contributes hydroxycitric acid (HCA) and a signature deep tang that stimulates salivary taste buds, creating culinary satisfaction with minimal added sodium.',
    benefit: 'Reduces dietary sodium intake by up to 40% safely',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: bpTarget.found ? 1 : 2,
    targetMemberIds: bpTarget.ids,
    targetMemberNames: bpTarget.names,
    accent: '#7C3AED',
    isUniversal: !bpTarget.found,
  })

  // Cholesterol & Heart Health
  const cholMatch = matchCondition('cholesterol')
  const heartMatch = matchCondition('heart')
  const lipidTarget = cholMatch.found ? cholMatch : heartMatch

  tips.push({
    id: 'tip-curry-leaves-lipid',
    category: 'Kerala Superfoods',
    tag: 'Cardiovascular Care',
    title: 'Curry Leaves (Kariveppila) for Lipid Oxidation Defense',
    summary: 'Fresh curry leaves contain carbazole alkaloids and antioxidants that prevent LDL cholesterol from oxidizing against arterial walls.',
    detail: 'Instead of discarding cooked curry leaves, chewing them or preparing fresh raw Kariveppila Chammanthi delivers concentrated lutein and alkaloids that support healthy blood lipid profiles and clean arterial flow.',
    benefit: 'Inhibits arterial plaque oxidation and supports healthy lipid levels',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: lipidTarget.found ? 1 : 2,
    targetMemberIds: lipidTarget.ids,
    targetMemberNames: lipidTarget.names,
    accent: '#047857',
    isUniversal: true,
  })

  tips.push({
    id: 'tip-sardines-omega3',
    category: 'Kerala Superfoods',
    tag: 'Omega-3 Nutrition',
    title: 'Small Coastal Catch (Mathi / Sardines) for Artery Cleanliness',
    summary: 'Sardines (Mathi) are packed with Omega-3 EPA and DHA fatty acids that lower blood triglycerides and elevate protective HDL.',
    detail: 'Small coastal fish do not accumulate the heavy mercury found in large predatory species. Prepared in a light clay-pot curry with ginger, garlic, and kodampuli, it offers clean anti-inflammatory cardiovascular fuel.',
    benefit: 'Clears arterial triglycerides and raises protective HDL',
    readTime: '3 min read',
    readTimeMinutes: 3,
    priority: lipidTarget.found ? 1 : 3,
    targetMemberIds: lipidTarget.ids,
    targetMemberNames: lipidTarget.names,
    accent: '#0284C7',
    isUniversal: true,
  })

  // ── 2. ALLERGY SAFETY & SUBSTITUTES ──
  const nutMatch = matchAllergy('nut')
  tips.push({
    id: 'tip-allergy-nuts',
    category: 'Allergy Safety',
    tag: 'Nut-Free Household Safety',
    title: 'Nut-Free Kerala Gravies: Coconut & Roasted Seed Substitutes',
    summary: 'Traditional restaurant kurma recipes often blend cashew paste; learn to substitute sunflower seeds and coconut for velvety texture.',
    detail: 'To protect household members with peanut or nut allergies, replace cashew pastes in gravies with soaked pumpkin seeds, sunflower seeds, or rich fresh coconut milk. Always verify spice powders for nut processing traces.',
    benefit: '100% nut-safe creamy texture without anaphylaxis risk',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: nutMatch.found ? 1 : 3,
    targetMemberIds: nutMatch.ids,
    targetMemberNames: nutMatch.names,
    accent: '#DC2626',
    isUniversal: nutMatch.found,
  })

  const dairyMatch = matchAllergy('dairy')
  const milkMatch = matchAllergy('milk')
  const dairyTarget = dairyMatch.found ? dairyMatch : milkMatch

  tips.push({
    id: 'tip-allergy-dairy',
    category: 'Allergy Safety',
    tag: 'Dairy-Free Living',
    title: 'Coconut Milk & Ragi: Nature’s Dairy-Free Replacements',
    summary: 'Kerala cuisine naturally excels at dairy-free cooking through freshly pressed coconut milk and mineral-rich finger millet (Ragi).',
    detail: 'For family members with lactose intolerance or milk protein allergy, use coconut milk in stews and theeyal. Meeting calcium requirements is effortlessly achieved with sprouted ragi porridge, sesame seeds, and drumstick leaves.',
    benefit: 'Rich bioavailable calcium without digestive distress or allergic reactions',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: dairyTarget.found ? 1 : 3,
    targetMemberIds: dairyTarget.ids,
    targetMemberNames: dairyTarget.names,
    accent: '#EA580C',
    isUniversal: dairyTarget.found,
  })

  const seafoodMatch = matchAllergy('seafood')
  const fishMatch = matchAllergy('fish')
  const seafoodTarget = seafoodMatch.found ? seafoodMatch : fishMatch
  if (seafoodTarget.found) {
    tips.push({
      id: 'tip-allergy-seafood',
      category: 'Allergy Safety',
      tag: 'Seafood Cross-Contact',
      title: 'Separate Cookware Protocol for Household Seafood Allergies',
      summary: 'In coastal cooking, airborne steam and shared frying oil from fish preparations can trigger severe reactions in allergic individuals.',
      detail: 'Designate separate frying pans and cutting boards for seafood. Ensure vegetable curries (sambar, avial, theeyal) never share utensils with fish dishes, and inspect packaged dried spices for fish allergen disclosures.',
      benefit: 'Eliminates cross-contact contamination in the family kitchen',
      readTime: '2 min read',
      readTimeMinutes: 2,
      priority: 1,
      targetMemberIds: seafoodTarget.ids,
      targetMemberNames: seafoodTarget.names,
      accent: '#DC2626',
      isUniversal: false,
    })
  }

  const wheatMatch = matchAllergy('wheat')
  const glutenMatch = matchAllergy('gluten')
  const glutenTarget = wheatMatch.found ? wheatMatch : glutenMatch
  if (glutenTarget.found) {
    tips.push({
      id: 'tip-allergy-gluten',
      category: 'Allergy Safety',
      tag: 'Gluten-Free Grains',
      title: 'Embrace Naturally Gluten-Free Kerala Rice & Cassava Staples',
      summary: 'Kerala culinary culture provides an ideal natural gluten-free foundation without needing ultra-processed commercial gluten-free mixes.',
      detail: 'Traditional staples like Appam, Idiyappam, Ari Puttu, Pathiri, and boiled Kappa (Tapioca) are 100% naturally wheat-free. Avoid restaurant parottas (maida) and commercial asafoetida (hing) blended with wheat flour.',
      benefit: 'Complete digestive safety with authentic heritage grains',
      readTime: '2 min read',
      readTimeMinutes: 2,
      priority: 1,
      targetMemberIds: glutenTarget.ids,
      targetMemberNames: glutenTarget.names,
      accent: '#EA580C',
      isUniversal: false,
    })
  }

  // ── 3. AGE & LONGEVITY GUIDELINES ──
  // Seniors (60+)
  tips.push({
    id: 'tip-senior-steamed-dinner',
    category: 'Age & Longevity',
    tag: 'Senior Digestive Care',
    title: 'The Steamed Dinner Rule: Appam or Idiyappam with Light Stew',
    summary: 'Ending the evening with steamed rice dough and mild vegetable broth prevents nocturnal acid reflux and promotes restorative sleep.',
    detail: 'As we age, stomach acid production and gastric motility gradually slow. Naturally fermented steamed batters contain soothing lactic acid probiotics that prevent indigestion and facilitate nighttime cellular repair.',
    benefit: 'Deeper sleep quality and effortless overnight digestion',
    readTime: '3 min read',
    readTimeMinutes: 3,
    priority: seniors.length > 0 ? 1 : 2,
    targetMemberIds: seniors.map((s) => s.id),
    targetMemberNames: seniors.map((s) => s.name),
    accent: '#7C3AED',
    isUniversal: true,
  })

  tips.push({
    id: 'tip-senior-shatapadi',
    category: 'Age & Longevity',
    tag: 'Gentle Mobility',
    title: 'Shatapadi: The 100-Step Gentle Post-Meal Stroll',
    summary: 'A slow 10 to 15 minute relaxed walk after lunch or dinner accelerates gastric emptying and smooths postprandial glucose curves.',
    detail: 'Gentle post-meal movement stimulates low-intensity muscle contractions that clear glucose from circulation without raising blood pressure or putting pressure on aging knees and joints.',
    benefit: 'Flattens blood sugar spikes without putting strain on joints',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: seniors.length > 0 ? 1 : 2,
    targetMemberIds: seniors.map((s) => s.id),
    targetMemberNames: seniors.map((s) => s.name),
    accent: '#475569',
    isUniversal: true,
  })

  // Children & Teens (< 18)
  tips.push({
    id: 'tip-kid-nendran',
    category: 'Age & Longevity',
    tag: 'Child Gut Health',
    title: 'Steamed Nendran Plantains for Prebiotic Gut Microbiome',
    summary: 'Steamed ripe or half-ripe Kerala plantains provide prebiotic resistant starch that feeds beneficial intestinal flora in growing children.',
    detail: 'Pazham Puzhingiyathu is naturally sweet, potassium-rich, gentle on sensitive young tummies, and eliminates the need for refined processed sugars or artificial packaged snacks during tea time.',
    benefit: 'Nourishes developing gut flora without sugar crashes',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: kids.length > 0 ? 1 : 2,
    targetMemberIds: kids.map((k) => k.id),
    targetMemberNames: kids.map((k) => k.name),
    accent: '#B45309',
    isUniversal: true,
  })

  tips.push({
    id: 'tip-kid-protein-timing',
    category: 'Age & Longevity',
    tag: 'Youth Muscle & Growth',
    title: 'Sprouted Cherupayar & Kadala: High-Efficiency Plant Protein',
    summary: 'Active school-age kids and growing teens need bioavailable amino acids timed around study hours and athletic activities.',
    detail: 'Sprouting green gram (Cherupayar) degrades phytic acid, multiplying zinc and iron absorption by 400%. Pairing sprouted pulses with Kerala Matta rice provides a complete amino acid profile for muscle development.',
    benefit: 'Supports healthy bone density and athletic muscle recovery',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: kids.length > 0 ? 1 : 2,
    targetMemberIds: kids.map((k) => k.id),
    targetMemberNames: kids.map((k) => k.name),
    accent: '#D97706',
    isUniversal: true,
  })

  // Adults (18 - 59)
  tips.push({
    id: 'tip-adult-meal-sequence',
    category: 'Daily Habits',
    tag: 'Metabolic Longevity',
    title: 'Fiber-First Meal Sequencing: Salad & Thoran Before Rice',
    summary: 'Eating dietary fiber and vegetable thoran 5 minutes before carbs forms a viscous mesh in the small intestine that blunts glucose spikes.',
    detail: 'Clinical metabolic studies demonstrate that eating green vegetables and proteins prior to starch reduces peak postprandial glucose by up to 35% and prolongs afternoon mental focus for working adults.',
    benefit: 'Eliminates afternoon sluggishness and controls metabolic weight',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: adults.length > 0 ? 1 : 2,
    targetMemberIds: adults.map((a) => a.id),
    targetMemberNames: adults.map((a) => a.name),
    accent: '#059669',
    isUniversal: true,
  })

  // ── 4. DAILY HABITS & AYURVEDA ──
  tips.push({
    id: 'tip-daily-jeera-water',
    category: 'Daily Habits',
    tag: 'Digestive Ritual',
    title: 'Start Morning with Warm Jeera & Chukku Infusion',
    summary: 'Drinking water boiled with cumin seeds and dry ginger awakens digestive enzymes and clears morning sluggishness.',
    detail: 'Warm jeera water stimulates the production of pancreatic enzymes, bile, and gastric juices, preparing the digestive tract for optimal nutrient extraction throughout the day.',
    benefit: 'Reduces morning bloating and jumpstarts gut motility',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: 2,
    targetMemberIds: members.map((m) => m.id),
    targetMemberNames: members.map((m) => m.name),
    accent: '#2E7D32',
    isUniversal: true,
  })

  tips.push({
    id: 'tip-daily-turmeric-pepper',
    category: 'Daily Habits',
    tag: 'Immunity Protocol',
    title: 'Turmeric & Black Pepper Synergy (Manjal Paal)',
    summary: 'Piperine in freshly crushed black pepper enhances curcumin absorption by up to 2000%, providing systemic anti-inflammatory relief.',
    detail: 'A warm bedtime cup of plant or dairy milk simmered with organic turmeric, crushed black pepper, and green cardamom reinforces respiratory mucosal defenses during seasonal weather shifts.',
    benefit: 'Reduces systemic inflammation and supports respiratory defenses',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: 2,
    targetMemberIds: members.map((m) => m.id),
    targetMemberNames: members.map((m) => m.name),
    accent: '#D97706',
    isUniversal: true,
  })

  tips.push({
    id: 'tip-superfood-elaneer',
    category: 'Kerala Superfoods',
    tag: 'Cellular Hydration',
    title: 'Tender Coconut Water (Elaneer) as an Isotonic Electrolyte',
    summary: 'Pure potassium, magnesium, and bio-identical electrolytes direct from nature without artificial colorants or refined corn syrups.',
    detail: 'One tender coconut delivers more potassium than a medium banana, supporting cellular hydration, healthy renal filtration, and heart rhythm under tropical heat conditions.',
    benefit: 'Restores electrolyte balance and protects kidney function',
    readTime: '2 min read',
    readTimeMinutes: 2,
    priority: 3,
    targetMemberIds: members.map((m) => m.id),
    targetMemberNames: members.map((m) => m.name),
    accent: '#0284C7',
    isUniversal: true,
  })

  return tips
}

const CATEGORIES = [
  'All Tips',
  'Clinical Care',
  'Allergy Safety',
  'Age & Longevity',
  'Kerala Superfoods',
  'Daily Habits',
]

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'priority', label: 'Health Priority' },
  { id: 'readTime', label: 'Shortest Read' },
  { id: 'saved', label: 'Saved First' },
  { id: 'alpha', label: 'Alphabetical' },
]

export default function TipsPage() {
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const members = Array.isArray(family?.members) ? family.members.filter(Boolean) : []
  const membersWithAllergies = members.filter(
    (m) => m && Array.isArray(m.allergies) && m.allergies.length > 0 && !m.allergies.includes('None')
  )
  const membersWithConditions = members.filter(
    (m) => m && Array.isArray(m.healthConditions) && m.healthConditions.length > 0 && !m.healthConditions.includes('None')
  )

  const [activeCategory, setActiveCategory] = useState('All Tips')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [sortBy, setSortBy] = useState('recommended')
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('familyfit_bookmarked_tips') || '[]')
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState('')

  // Ensure page starts from top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
  }, [])

  // Dynamically generate tips based on real family profile
  const allTips = useMemo(() => {
    return buildPersonalizedTips(members)
  }, [members])

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem('familyfit_bookmarked_tips', JSON.stringify(next))
      setToast(prev.includes(id) ? 'Tip removed from saved list' : 'Tip saved to your reading list')
      setTimeout(() => setToast(''), 2200)
      return next
    })
  }

  // Active member object if a specific member is selected
  const activeMember = useMemo(() => {
    if (selectedMemberId === 'ALL') return null
    return members.find((m) => String(m.id) === String(selectedMemberId)) || null
  }, [members, selectedMemberId])

  // Filter and sort tips
  const filteredTips = useMemo(() => {
    let list = allTips

    // 1. Filter by Selected Member
    if (selectedMemberId !== 'ALL') {
      const strId = String(selectedMemberId)
      const memName = activeMember?.name?.toLowerCase() || ''
      list = list.filter((tip) => {
        // Direct target ID match
        if (tip.targetMemberIds?.some((id) => String(id) === strId)) return true
        // Member name match
        if (memName && tip.targetMemberNames?.some((n) => n.toLowerCase() === memName)) return true
        // Universal foundational habit
        if (tip.isUniversal) return true
        return false
      })
    }

    // 2. Filter by Category
    if (activeCategory !== 'All Tips') {
      list = list.filter((t) => t.category === activeCategory)
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.detail.toLowerCase().includes(q) ||
          t.tag.toLowerCase().includes(q) ||
          t.benefit.toLowerCase().includes(q) ||
          t.targetMemberNames?.some((n) => n.toLowerCase().includes(q))
      )
    }

    // 4. Sorting System
    const sorted = [...list]
    if (sortBy === 'recommended') {
      sorted.sort((a, b) => {
        if (selectedMemberId !== 'ALL') {
          const aMatch = a.targetMemberIds?.some((id) => String(id) === String(selectedMemberId)) ? 1 : 0
          const bMatch = b.targetMemberIds?.some((id) => String(id) === String(selectedMemberId)) ? 1 : 0
          if (bMatch !== aMatch) return bMatch - aMatch
        }
        return a.priority - b.priority
      })
    } else if (sortBy === 'priority') {
      sorted.sort((a, b) => a.priority - b.priority)
    } else if (sortBy === 'readTime') {
      sorted.sort((a, b) => a.readTimeMinutes - b.readTimeMinutes)
    } else if (sortBy === 'saved') {
      sorted.sort((a, b) => {
        const aSaved = bookmarkedIds.includes(a.id) ? 1 : 0
        const bSaved = bookmarkedIds.includes(b.id) ? 1 : 0
        return bSaved - aSaved
      })
    } else if (sortBy === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title))
    }

    return sorted
  }, [allTips, selectedMemberId, activeMember, activeCategory, searchQuery, sortBy, bookmarkedIds])

  return (
    <div className="ff-tips-root">
      {/* Toast Alert without emojis */}
      {toast && (
        <div className="ff-toast-bar">
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* ── FULL-WIDTH WELLNESS HERO BANNER MATCHING RECIPES & GROCERY ── */}
      <div
        className="ff-wellness-hero"
        style={{
          width: '100%',
          position: 'relative',
          background: isDark
            ? '#0F1A0A url(/wellness_hero_banner.jpg) no-repeat right center / cover'
            : '#1A3828 url(/wellness_hero_banner.jpg) no-repeat right center / cover',
          minHeight: 340,
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '40px 60px',
        }}
      >
        {/* Left content positioned over blank area */}
        <div className="ff-wellness-hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '50%', flexShrink: 0 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#A7F3D0',
              letterSpacing: 2,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 10,
            }}
          >
            DIETITIAN-CURATED WELLNESS
          </span>

          <h1
            className="ff-wellness-hero-title"
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 12px 0',
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}
          >
            Nutrition &amp; Health Tips
          </h1>

          <p
            style={{
              fontSize: 15,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 28px 0',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Time-tested Kerala food wisdom, daily metabolic habits,<br />and personalized household nutrition.
          </p>

          {/* Search Bar matching Recipes & Grocery pages */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 9999,
              padding: '8px 8px 8px 20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              maxWidth: 420,
            }}
          >
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search tips, jeera, moringa, habits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 13.5,
                color: '#111827',
                background: 'transparent',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#EDF4E8',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-label="Clear search"
              >
                <X size={15} color="#2D5A27" />
              </button>
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#EDF4E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SlidersHorizontal size={15} color="#2D5A27" />
              </div>
            )}
          </div>

          {/* Stats row with dividers matching Recipes & Grocery pages */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginTop: 20,
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={14} color="#86EFAC" /> Evidence-Based
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={14} color="#86EFAC" /> Metabolic Guidance
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color="#86EFAC" /> Safe for All Ages
            </span>
          </div>
        </div>
      </div>

      <div className="ff-tips-container">

        {/* ── 2. HOUSEHOLD HEALTH SUMMARY BANNER ── */}
        <section className="ff-allergy-bar-section">
          {membersWithAllergies.length > 0 || membersWithConditions.length > 0 ? (
            <div className="ff-allergy-alert-card">
              <div className="ff-alert-left">
                <div className="ff-alert-icon-wrap">
                  <ShieldAlert size={17} />
                </div>
                <div>
                  <div className="ff-alert-heading">
                    Active Household Screening
                  </div>
                  <div className="ff-alert-text">
                    Personalized for {membersWithConditions.map((m) => m.name).join(', ')} (Conditions) and {membersWithAllergies.map((m) => m.name).join(', ')} (Allergies). All recommendations adapt to your entries.
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="ff-alert-manage-btn">
                <span>Manage Profile</span>
                <ChevronRight size={13} />
              </button>
            </div>
          ) : members.length > 0 ? (
            <div className="ff-allergy-shield-pill">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Profile Active:</strong> Nutritional guidelines balanced across all family members.
              </span>
            </div>
          ) : (
            <div className="ff-allergy-alert-card" style={{ background: '#F8FAF8', borderColor: '#D7E5D9' }}>
              <div className="ff-alert-left">
                <div className="ff-alert-icon-wrap" style={{ background: '#EAF3EC', color: '#1F5D3A' }}>
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <div className="ff-alert-heading" style={{ color: '#1F5D3A' }}>
                    Household Personalization Ready
                  </div>
                  <div className="ff-alert-text" style={{ color: '#4A6353' }}>
                    Add your family members in Profile to unlock personalized clinical diet screening and allergen safety alerts.
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="ff-alert-manage-btn" style={{ background: '#1F5D3A', color: '#FFFFFF' }}>
                <span>Add Family Members</span>
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </section>

        {/* ── 3. FAMILY MEMBER FILTER STRIP ── */}
        {members.length > 0 && (
          <section className="ff-member-filter-section">
            <span className="ff-filter-label">Member Focus:</span>
            <div className="ff-member-pill-row">
              <button
                type="button"
                onClick={() => setSelectedMemberId('ALL')}
                className={`ff-member-pill ${selectedMemberId === 'ALL' ? 'active' : ''}`}
              >
                <span>Entire Family ({members.length})</span>
              </button>
              {members.map((m) => {
                const isSelected = String(selectedMemberId) === String(m?.id)
                return (
                  <button
                    key={m?.id || m?.name}
                    type="button"
                    onClick={() => setSelectedMemberId(m?.id)}
                    className={`ff-member-pill ${isSelected ? 'active' : ''}`}
                  >
                    <span className="ff-member-dot" />
                    <span>{m?.name || 'Member'}</span>
                    {m?.age && <span className="ff-member-age">({m.age})</span>}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Active Member Focus Context Info */}
        {activeMember && (
          <div className="ff-active-member-banner">
            <User size={14} className="text-[#315b45]" />
            <span>
              Showing recommendations tailored for <strong>{activeMember.name}</strong> (Age {activeMember.age || '--'}
              {activeMember.healthConditions?.length > 0 && !activeMember.healthConditions.includes('None') ? ` • ${activeMember.healthConditions.join(', ')}` : ''}
              {activeMember.allergies?.length > 0 && !activeMember.allergies.includes('None') ? ` • Allergic to: ${activeMember.allergies.join(', ')}` : ''}
              {activeMember.goal ? ` • Goal: ${activeMember.goal}` : ''}
              )
            </span>
          </div>
        )}

        {/* ── 4. CATEGORY TABS & WORKING SORT SYSTEM ── */}
        <div className="ff-category-tabs-row">
          <div className="ff-tabs-scrollable">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`ff-cat-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ff-filter-controls-right">
            {/* Real Sorting System Dropdown */}
            <div className="ff-sort-selector-wrap">
              <ArrowUpDown size={13} className="text-[#68766d]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ff-sort-select"
                aria-label="Sort tips"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="ff-tips-count-indicator">
              {filteredTips.length} {filteredTips.length === 1 ? 'tip' : 'tips'}
            </div>
          </div>
        </div>

        {/* ── 5. CLEAN EDITORIAL TIPS GRID (NO EMOJIS) ── */}
        {filteredTips.length === 0 ? (
          <div className="ff-tips-empty-box">
            <div className="ff-empty-icon-clean">
              <Search size={32} />
            </div>
            <h3>No matching wellness tips found</h3>
            <p>Try searching for a different keyword or reset filters to see all family guidance.</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All Tips')
                setSearchQuery('')
                setSelectedMemberId('ALL')
              }}
              className="ff-btn-reset-filters"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="ff-tips-grid">
            {filteredTips.map((tip) => {
              const isSaved = bookmarkedIds.includes(tip.id)
              const hasTargetMembers = tip.targetMemberNames && tip.targetMemberNames.length > 0

              return (
                <article key={tip.id} className="ff-tip-card">
                  {/* Card Header Meta */}
                  <div className="ff-tip-meta-row">
                    <span className="ff-tip-tag" style={{ color: tip.accent }}>
                      {tip.tag}
                    </span>

                    <div className="ff-tip-meta-right">
                      {hasTargetMembers && selectedMemberId === 'ALL' && (
                        <span className="ff-tip-target-badge" title={`Personalized for ${tip.targetMemberNames.join(', ')}`}>
                          <User size={11} />
                          <span>{tip.targetMemberNames.slice(0, 2).join(', ')}{tip.targetMemberNames.length > 2 ? ` +${tip.targetMemberNames.length - 2}` : ''}</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleBookmark(tip.id)}
                        className={`ff-tip-bookmark-btn ${isSaved ? 'saved' : ''}`}
                        title={isSaved ? 'Remove bookmark' : 'Bookmark tip'}
                        aria-label="Save tip"
                      >
                        <Bookmark size={15} fill={isSaved ? '#2E7D32' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="ff-tip-title">{tip.title}</h3>
                  <p className="ff-tip-summary">{tip.summary}</p>

                  {/* Scientific Rationale Detail Box */}
                  <div className="ff-tip-detail-box">
                    <p>{tip.detail}</p>
                  </div>

                  {/* Card Footer / Benefit Callout */}
                  <div className="ff-tip-footer">
                    <div className="ff-tip-benefit">
                      <Check size={14} className="text-[#2E7D32] shrink-0" />
                      <span>{tip.benefit}</span>
                    </div>
                    <div className="ff-tip-read-time">
                      <Clock size={12} />
                      <span>{tip.readTime}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />

      {/* ── SIMPLIFIED & POLISHED CLEAN STYLING (ZERO EMOJIS) ── */}
      <style>{`
        .ff-tips-root {
          min-height: 100vh;
          background-color: ${isDark ? '#0A0F1D' : '#F7F6F1'};
          color: ${isDark ? '#F1F5F9' : '#25352C'};
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .ff-tips-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 28px 32px 80px 32px;
        }

        /* TOAST */
        .ff-toast-bar {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #25352c;
          color: #fffefa;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 650;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 3000;
          box-shadow: 0 10px 24px rgba(37,53,44,0.18);
        }

        /* HEADER */
        .ff-tips-header {
          margin-bottom: 20px;
        }

        .ff-header-top-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ff-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: ${isDark ? '#34D399' : '#315b45'};
          margin-bottom: 6px;
        }

        .ff-header-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0 0 6px 0;
          color: ${isDark ? '#FFFFFF' : '#25352c'};
          line-height: 1.15;
        }

        .ff-header-subtitle {
          font-size: 14px;
          color: ${isDark ? '#94A3B8' : '#68766d'};
          margin: 0;
          max-width: 580px;
          line-height: 1.5;
        }

        /* SEARCH CAPSULE */
        .ff-search-capsule {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${isDark ? '#141E30' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#23324C' : '#E2E4DA'};
          padding: 8px 14px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          width: 270px;
          transition: border-color 0.15s ease;
        }

        .ff-search-capsule:focus-within {
          border-color: #315b45;
        }

        .ff-search-icon {
          color: #8a968d;
          flex-shrink: 0;
        }

        .ff-search-input {
          border: none;
          background: transparent;
          font-size: 13px;
          color: ${isDark ? '#F8FAFC' : '#25352c'};
          outline: none;
          width: 100%;
          font-family: inherit;
        }

        .ff-search-clear {
          background: none;
          border: none;
          color: #8a968d;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }
        .ff-search-clear:hover {
          color: #25352c;
        }

        /* ALLERGEN & CLINICAL BAR */
        .ff-allergy-bar-section {
          margin-bottom: 16px;
        }

        .ff-allergy-alert-card {
          background: ${isDark ? '#201316' : '#FEF2F2'};
          border: 1px solid ${isDark ? '#4A1D24' : '#FEE2E2'};
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .ff-alert-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ff-alert-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #FEE2E2;
          color: #DC2626;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ff-alert-heading {
          font-size: 13px;
          font-weight: 750;
          color: ${isDark ? '#FCA5A5' : '#991B1B'};
        }

        .ff-alert-text {
          font-size: 12px;
          color: ${isDark ? '#F87171' : '#B91C1C'};
          margin-top: 1px;
        }

        .ff-alert-manage-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid ${isDark ? '#5C232B' : '#FCA5A5'};
          color: ${isDark ? '#FCA5A5' : '#DC2626'};
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }

        .ff-alert-manage-btn:hover {
          background: rgba(220, 38, 38, 0.08);
        }

        .ff-allergy-shield-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${isDark ? 'rgba(16, 185, 129, 0.12)' : '#EDF4EB'};
          border: 1px solid ${isDark ? '#1E3A2F' : '#DCEBD9'};
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 12px;
          color: ${isDark ? '#CBD5E1' : '#3E5039'};
        }

        /* MEMBER FILTER ROW */
        .ff-member-filter-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .ff-filter-label {
          font-size: 11.5px;
          font-weight: 750;
          color: #8a968d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ff-member-pill-row {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .ff-member-pill {
          background: ${isDark ? '#141E30' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#23324C' : '#DFE7DC'};
          color: ${isDark ? '#CBD5E1' : '#475643'};
          padding: 5px 13px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .ff-member-pill:hover {
          border-color: #315b45;
          color: #315b45;
        }

        .ff-member-pill.active {
          background: #315b45;
          color: #FFFFFF;
          border-color: #315b45;
        }

        .ff-member-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
        }

        .ff-member-age {
          font-size: 11px;
          opacity: 0.8;
          font-weight: 500;
        }

        /* ACTIVE MEMBER CONTEXT BANNER */
        .ff-active-member-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: ${isDark ? '#162235' : '#EEF3EC'};
          border: 1px solid ${isDark ? '#243750' : '#D8E4D5'};
          border-radius: 10px;
          font-size: 12.5px;
          color: ${isDark ? '#94A3B8' : '#415545'};
          margin-bottom: 16px;
        }

        /* CATEGORY TABS & SORT */
        .ff-category-tabs-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E2E6DF'};
          padding-bottom: 10px;
          margin-bottom: 24px;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ff-tabs-scrollable {
          display: flex;
          gap: 5px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .ff-cat-tab-btn {
          border: none;
          background: transparent;
          color: ${isDark ? '#94A3B8' : '#68766d'};
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .ff-cat-tab-btn:hover {
          color: #315b45;
          background: ${isDark ? 'rgba(49, 91, 69, 0.2)' : '#EDF2EB'};
        }

        .ff-cat-tab-btn.active {
          background: #315b45;
          color: #FFFFFF;
          font-weight: 700;
        }

        .ff-filter-controls-right {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .ff-sort-selector-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          background: ${isDark ? '#141E30' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#23324C' : '#DFE7DC'};
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .ff-sort-select {
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 650;
          color: ${isDark ? '#CBD5E1' : '#435349'};
          cursor: pointer;
          outline: none;
          font-family: inherit;
        }

        .ff-tips-count-indicator {
          font-size: 12px;
          font-weight: 700;
          color: #8a968d;
          white-space: nowrap;
        }

        /* TIPS GRID */
        .ff-tips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        @media (max-width: 1024px) {
          .ff-wellness-hero-content {
            max-width: 70% !important;
          }
        }

        @media (max-width: 768px) {
          .ff-wellness-hero {
            padding: 28px 18px !important;
            min-height: auto !important;
          }
          .ff-wellness-hero-content {
            max-width: 100% !important;
          }
          .ff-wellness-hero-title {
            font-size: 30px !important;
            margin-bottom: 8px !important;
          }
        }

        @media (max-width: 980px) {
          .ff-tips-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .ff-tips-grid {
            grid-template-columns: 1fr;
          }
        }

        .ff-tip-card {
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2D44' : '#E5E8E1'};
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: ${isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 10px rgba(37,53,44,0.03)'};
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }

        .ff-tip-card:hover {
          transform: translateY(-2px);
          border-color: #ced6cb;
          box-shadow: ${isDark ? '0 10px 24px rgba(0,0,0,0.45)' : '0 6px 20px rgba(37,53,44,0.07)'};
        }

        .ff-tip-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 8px;
        }

        .ff-tip-tag {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ff-tip-meta-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ff-tip-target-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: ${isDark ? '#1A293E' : '#EEF3EC'};
          border: 1px solid ${isDark ? '#284163' : '#DDE6DB'};
          color: ${isDark ? '#93C5FD' : '#315b45'};
          padding: 2px 7px;
          border-radius: 9999px;
          font-size: 10.5px;
          font-weight: 700;
        }

        .ff-tip-bookmark-btn {
          border: none;
          background: transparent;
          color: #8a968d;
          cursor: pointer;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: transform 0.15s, color 0.15s;
        }

        .ff-tip-bookmark-btn:hover {
          transform: scale(1.12);
          color: #315b45;
        }

        .ff-tip-bookmark-btn.saved {
          color: #315b45;
        }

        .ff-tip-title {
          font-size: 15.5px;
          font-weight: 750;
          color: ${isDark ? '#FFFFFF' : '#25352c'};
          line-height: 1.35;
          margin: 0 0 8px 0;
        }

        .ff-tip-summary {
          font-size: 13px;
          line-height: 1.5;
          color: ${isDark ? '#CBD5E1' : '#526257'};
          margin: 0 0 12px 0;
        }

        .ff-tip-detail-box {
          background: ${isDark ? '#142138' : '#F7FAF5'};
          border: 1px solid ${isDark ? '#1E3254' : '#E6EFE4'};
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 14px;
          flex: 1;
        }

        .ff-tip-detail-box p {
          font-size: 12px;
          line-height: 1.5;
          color: ${isDark ? '#94A3B8' : '#556658'};
          margin: 0;
        }

        .ff-tip-footer {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid ${isDark ? '#1C293E' : '#EDF1EA'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .ff-tip-benefit {
          display: flex;
          align-items: flex-start;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 650;
          color: ${isDark ? '#F1F5F9' : '#25352c'};
          line-height: 1.35;
          flex: 1;
        }

        .ff-tip-read-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #8a968d;
          font-weight: 600;
          flex-shrink: 0;
        }

        /* EMPTY STATE */
        .ff-tips-empty-box {
          text-align: center;
          padding: 50px 20px;
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2D44' : '#E5E8E1'};
          border-radius: 16px;
        }

        .ff-empty-icon-clean {
          color: #8a968d;
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
        }

        .ff-tips-empty-box h3 {
          font-size: 17px;
          font-weight: 750;
          color: ${isDark ? '#FFFFFF' : '#25352c'};
          margin: 0 0 6px 0;
        }

        .ff-tips-empty-box p {
          font-size: 13px;
          color: #8a968d;
          margin: 0 0 16px 0;
        }

        .ff-btn-reset-filters {
          background: #315b45;
          color: #FFFFFF;
          border: none;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .ff-btn-reset-filters:hover {
          background: #244434;
        }
      `}</style>
    </div>
  )
}

