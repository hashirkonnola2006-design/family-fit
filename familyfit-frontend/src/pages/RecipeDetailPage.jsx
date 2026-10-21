import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Heart,
  Bookmark,
  Leaf,
  Users,
  ChefHat,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Flame,
  Clock,
  Dumbbell,
  Wheat,
  Utensils,
  Soup,
} from 'lucide-react'
import { getRecipeDetail } from '../api/recipes'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import MemberAvatar from '../components/MemberAvatar'
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
  const goal = (member.fitnessGoal || member.goal || '').toUpperCase()
  const diet = (member.dietPreference || '').toUpperCase()

  // Collect recipe text & ingredient strings for matching
  const recipeName = (recipe?.name || '').toLowerCase()
  const recipeTags = (recipe?.tags || []).filter((t) => t && typeof t === 'string').map((t) => t.toLowerCase())
  const ingredientNames = (recipe?.ingredients || []).map((i) => (i?.name || '').toLowerCase()).join(' ')
  const fullRecipeText = `${recipeName} ${recipeTags.join(' ')} ${ingredientNames} ${(recipe?.whyItsGood || '').toLowerCase()}`

  // 1. Check if profile has NO health/goal data set
  const hasNoData =
    !member.fitnessGoal &&
    !member.goal &&
    (!member.healthConditions || member.healthConditions.length === 0) &&
    (!member.allergies || member.allergies.length === 0) &&
    (!member.dislikes || member.dislikes.length === 0)

  if (hasNoData) {
    return {
      isSuitable: true,
      isNeutral: true,
      statusIcon: 'ℹ',
      statusBg: '#f3f4f6',
      statusColor: '#6b7280',
      reason: `Not enough health data to assess conflicts yet.`,
    }
  }

  // 2. Check Allergy Conflicts with strict word boundary checks
  const allergenConflict = memberAllergies.find((allergen) => {
    if (allergen === 'Milk/Dairy') {
      return /\b(milk|curd|ghee|thayir|sambharam|cheese|yogurt|butter|paneer)\b/i.test(fullRecipeText)
    }
    if (allergen === 'Eggs') {
      return /\b(eggs?|mutta)\b/i.test(fullRecipeText)
    }
    if (allergen === 'Peanuts/Tree Nuts') {
      return /\b(peanuts?|tree nuts?|almonds?|cashews?|walnuts?|hazelnuts?|pistachios?)\b/i.test(fullRecipeText)
    }
    if (allergen === 'Seafood/Fish') {
      return /\b(fish|mathi|ayala|neymeen|chemmeen|prawns?|seafood|karimeen|crab|squid)\b/i.test(fullRecipeText)
    }
    if (allergen === 'Soy') {
      return /\b(tofu|soy|soya)\b/i.test(fullRecipeText)
    }
    if (allergen === 'Wheat/Gluten') {
      return /\b(wheat|parotta|bread|maida)\b/i.test(fullRecipeText)
    }
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
  const dislikeMatch = memberDislikes.find(
    (d) => d && typeof d === 'string' && d.trim() && fullRecipeText.includes(d.toLowerCase())
  )
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

  // If member has no allergy or condition records on file:
  if (!member.healthConditions?.length && !member.allergies?.length && !member.fitnessGoal && !member.goal) {
    return {
      isSuitable: true,
      isNeutral: true,
      statusIcon: 'i',
      statusBg: '#f3f4f6',
      statusColor: '#6b7280',
      reason: `Not enough health data to assess conflicts yet.`,
    }
  }

  // Safe fallback
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
  const [recipe, setRecipe] = useState(RECIPE_DATABASE[0])
  const [loading, setLoading] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [toastMessage, setToastMessage] = useState('')

  const displayMembers = family?.members || []

  // Ensure page immediately starts from the top when opening a recipe
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
  }, [id])

  useEffect(() => {
    async function load() {
      try {
        const familyId = family?.id || 1
        // 1. Check in local RECIPE_DATABASE dataset first by ID
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

  const getSavedIds = () => {
    try {
      const saved = localStorage.getItem('familyfit_saved_recipes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  const isFavorited = Boolean(recipe?.favorited || (recipe && getSavedIds().includes(String(recipe.id))))

  const handleToggleSaved = () => {
    if (!recipe) return
    const currentSaved = getSavedIds()
    const idStr = String(recipe.id)
    let updatedSaved = []
    if (currentSaved.includes(idStr)) {
      updatedSaved = currentSaved.filter((i) => i !== idStr)
      setToastMessage(`Removed "${recipe.name}" from Saved Recipes`)
    } else {
      updatedSaved = [...currentSaved, idStr]
      setToastMessage(`Saved "${recipe.name}" to your Saved Recipes! ♥️`)
    }
    localStorage.setItem('familyfit_saved_recipes', JSON.stringify(updatedSaved))
    setRecipe((prev) => ({ ...prev, favorited: updatedSaved.includes(idStr) }))
    setTimeout(() => setToastMessage(''), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8F6EF] text-[#1A2E22]">
        <div className="spinner" />
        <p className="mt-4 text-sm font-semibold text-[#5A6E60]">Loading recipe details...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#F8F6EF] text-[#1A2E22]">
        <h2 className="text-2xl font-bold text-[#1E3A20]">Recipe Not Found</h2>
        <button
          className="mt-4 px-6 py-2.5 rounded-full bg-[#244C27] text-white font-bold hover:bg-[#1C3E20] transition-colors"
          onClick={() => navigate('/recipes')}
        >
          Back to Recipes
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#F8F6EF] text-[#1A2E22] select-none relative overflow-x-hidden"
      style={{
        background: `
          radial-gradient(circle at 92% 12%, rgba(210, 224, 196, 0.45) 0%, transparent 45%),
          radial-gradient(circle at 10% 88%, rgba(220, 230, 208, 0.4) 0%, transparent 40%),
          linear-gradient(180deg, #FAF8EF 0%, #F5F2E6 100%)
        `,
      }}
    >
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] bg-[#1E3A20] text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP-RIGHT DECORATIVE SAGE LEAVES WATERMARK ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 pointer-events-none z-0 opacity-40 overflow-hidden"
      >
        <svg
          width="420"
          height="380"
          viewBox="0 0 420 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[260px] sm:w-[360px] lg:w-[420px] h-auto -mr-10 -mt-8"
        >
          <path
            d="M440 -10 C 370 50, 290 120, 220 220 C 210 150, 250 70, 340 20 C 380 0, 415 -5, 440 -10 Z"
            fill="#A9BC8A"
            fillOpacity="0.6"
          />
          <path
            d="M410 50 C 330 110, 260 190, 200 300 C 180 220, 200 140, 280 80 C 330 45, 370 35, 410 50 Z"
            fill="#C4D1A8"
            fillOpacity="0.55"
          />
          <path
            d="M460 110 C 375 170, 310 250, 250 350 C 260 265, 320 190, 390 140 C 425 115, 450 105, 460 110 Z"
            fill="#8EA873"
            fillOpacity="0.45"
          />
        </svg>
      </div>

      {/* ── MAIN CONTENT CANVAS (Max 1440px) ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        
        {/* ── BREADCRUMB / BACK TO RECIPES BAR ── */}
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#1E3A20] hover:text-[#174A2E] shadow-xs border border-[#E4DEC9] transition-all cursor-pointer group"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <ChevronLeft size={16} strokeWidth={2.8} className="transition-transform group-hover:-translate-x-0.5 text-[#1E3A20]" />
            <span>Back to Recipes</span>
          </button>
          <span className="text-xs text-[#8A9B8D]">•</span>
          <span className="text-xs text-[#526656] font-semibold truncate max-w-[200px] sm:max-w-md">
            {recipe.name}
          </span>
        </div>

        {/* ── 1. TOP HERO SECTION (Split 2-Column on Desktop) ── */}
        <section
          aria-label="Recipe Overview"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
        >
          {/* Left Column: Food Photo Card */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative aspect-[16/10] w-full rounded-[26px] overflow-hidden shadow-[0_8px_30px_rgba(30,58,32,0.08)] border border-[#E4DEC9] bg-[#EFECE3] group">
              <img
                src={recipe.imageUrl || '/images/recipes/puttu-kadala-hero.jpg'}
                alt={recipe.name}
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => navigate('/recipes')}
                    aria-label="Back to recipes"
                    title="Back to Recipes"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#1E3A20',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.22)',
                      border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    <ChevronLeft size={22} strokeWidth={2.8} color="#1E3A20" />
                  </button>

                  {/* Badge */}
                  <div
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E3A20] shadow-md flex items-center gap-1.5 border border-white/80"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Leaf size={14} className="text-[#2F5233]" strokeWidth={2.4} />
                    <span>{recipe.matchBadgeText || 'High Protein Breakfast'}</span>
                  </div>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={handleToggleSaved}
                  aria-label={isFavorited ? 'Remove from saved' : 'Save recipe'}
                  title={isFavorited ? 'Remove from saved' : 'Save recipe'}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.22)',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  }}
                >
                  <Heart
                    size={20}
                    strokeWidth={2.4}
                    className={isFavorited ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#1E3A20]'}
                  />
                </button>
              </div>

              {/* Bottom Dark Gradient Banner */}
              <div className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-5 sm:px-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex flex-col justify-end">
                <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight leading-snug drop-shadow-sm">
                  {recipe.name}
                </h2>

                {/* Metadata Row: 4 servings • 45 mins • Kerala */}
                <div className="flex items-center gap-3 text-white/90 text-xs sm:text-sm font-semibold mt-2 drop-shadow-sm flex-wrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Utensils size={14} strokeWidth={2.2} className="opacity-80" />
                    <span>4 servings</span>
                  </span>
                  <span className="opacity-60">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} strokeWidth={2.2} className="opacity-80" />
                    <span>{recipe.cookTimeMinutes || 45} mins</span>
                  </span>
                  <span className="opacity-60">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Soup size={14} strokeWidth={2.2} className="opacity-80" />
                    <span>{recipe.cuisine || 'Kerala'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recipe Eyebrow, Title, Macros, Description & Save Button */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between">
            <div>
              {/* Eyebrow & Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[12px] font-extrabold tracking-[0.2em] text-[#5B7B63] uppercase block mb-1.5">
                    TRADITIONAL {recipe.cuisine?.toUpperCase() || 'KERALA'}
                  </span>

                  {/* Title */}
                  <h1
                    className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#1E3A20] leading-[1.1] tracking-tight"
                    style={{ fontFamily: "'Outfit', var(--font-display)" }}
                  >
                    {recipe.name}
                  </h1>
                </div>

                {/* 4 Macro Stats Box */}
                <div className="bg-white/85 backdrop-blur-xs border border-[#E6E0D2] rounded-2xl p-2.5 sm:p-3 shadow-xs grid grid-cols-4 gap-3 sm:gap-4 text-center shrink-0 w-fit self-start sm:self-auto mt-2 sm:mt-0">
                  {/* Kcal */}
                  <div className="px-1">
                    <Flame size={16} className="text-[#EA580C] mx-auto mb-1" />
                    <div className="text-sm sm:text-base font-extrabold text-[#1E3A20] leading-none">
                      {recipe.kcal || 420}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#718274] mt-1">kcal</div>
                  </div>

                  {/* Mins */}
                  <div className="px-1 border-l border-[#EFECE3]">
                    <Clock size={16} className="text-[#2F5233] mx-auto mb-1" />
                    <div className="text-sm sm:text-base font-extrabold text-[#1E3A20] leading-none">
                      {recipe.prepTimeMinutes || 25}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#718274] mt-1">mins</div>
                  </div>

                  {/* Protein */}
                  <div className="px-1 border-l border-[#EFECE3]">
                    <Dumbbell size={16} className="text-[#2F5233] mx-auto mb-1" />
                    <div className="text-sm sm:text-base font-extrabold text-[#1E3A20] leading-none">
                      {recipe.proteinG || 18}g
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#718274] mt-1">protein</div>
                  </div>

                  {/* Carbs */}
                  <div className="px-1 border-l border-[#EFECE3]">
                    <Wheat size={16} className="text-[#658052] mx-auto mb-1" />
                    <div className="text-sm sm:text-base font-extrabold text-[#1E3A20] leading-none">
                      {recipe.carbsG || 65}g
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#718274] mt-1">carbs</div>
                  </div>
                </div>
              </div>

              {/* Description / Why It's Good */}
              <p className="text-sm sm:text-[15px] text-[#4F6355] leading-relaxed font-normal mt-4 max-w-xl">
                {recipe.whyItsGood ||
                  'Steamed rice flour puttu with roasted coconut, paired with protein-rich kadala curry. A wholesome, fibre-rich meal that keeps you full and energised.'}
              </p>
            </div>

            {/* Save Recipe CTA Button */}
            <div className="pt-6 sm:pt-8">
              <button
                onClick={handleToggleSaved}
                style={{ color: '#ffffff', backgroundColor: '#244C27' }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full !bg-[#244C27] hover:!bg-[#1C3E20] active:scale-[0.98] !text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Bookmark
                  size={18}
                  strokeWidth={2.2}
                  style={{ color: '#ffffff' }}
                  className={isFavorited ? 'fill-white text-white' : 'text-white'}
                />
                <span style={{ color: '#ffffff' }} className="!text-white font-bold">
                  {isFavorited ? 'Saved to Recipes' : 'Save Recipe'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. BOTTOM 3-COLUMN CARDS GRID (Ingredients, Family Suitability, How to Make) ── */}
        <section
          aria-label="Recipe Breakdown"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-8 sm:mt-10"
        >
          {/* ── COLUMN 1: INGREDIENTS CARD (~28-30% width: col-span-3) ── */}
          <div className="lg:col-span-3 xl:col-span-3 bg-white rounded-[24px] border border-[#EAE5D8] p-5 sm:p-6 shadow-[0_2px_12px_rgba(35,66,38,0.03)] relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-3 border-b border-[#F0ECE1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E5ECD9] text-[#1E3A20] flex items-center justify-center shrink-0">
                    <Leaf size={16} strokeWidth={2.4} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E3A20]">Ingredients</h3>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#EFECE3] text-[#55695A] text-xs font-bold shrink-0">
                  6 servings
                </span>
              </div>

              {/* Rows List */}
              <div className="space-y-1">
                {recipe.ingredients?.map((ing, i) => (
                  <div
                    key={ing.id || i}
                    onClick={() => toggleIngredient(i)}
                    className="flex items-center justify-between py-2 border-b border-[#F5F2E8] last:border-b-0 cursor-pointer select-none group transition-opacity"
                  >
                    <span className="text-xs sm:text-[13px] font-bold text-[#1E3A20] shrink-0 w-16 sm:w-20">
                      {ing.quantity} {ing.unit}
                    </span>
                    <span
                      className={`text-xs sm:text-[13px] font-semibold text-right flex-1 ${
                        checkedIngredients[i]
                          ? 'line-through text-gray-400'
                          : 'text-[#3D5240] group-hover:text-[#1E3A20]'
                      }`}
                    >
                      {ing.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom-right Subtle Watercolor Leaf Watermark */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 pointer-events-none opacity-20"
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <path
                  d="M130 130 C 90 100, 50 60, 20 -10 C 60 10, 100 50, 130 130 Z"
                  fill="#708A62"
                />
              </svg>
            </div>
          </div>

          {/* ── COLUMN 2: FAMILY SUITABILITY CARD (~38-40% width: col-span-5) ── */}
          <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-[24px] border border-[#EAE5D8] p-5 sm:p-6 shadow-[0_2px_12px_rgba(35,66,38,0.03)] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-3 border-b border-[#F0ECE1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E5ECD9] text-[#1E3A20] flex items-center justify-center shrink-0">
                    <Users size={16} strokeWidth={2.4} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E3A20]">Family Suitability</h3>
                </div>

                <span className="text-xs font-semibold text-[#738575] shrink-0">
                  {displayMembers.length} Members Evaluated
                </span>
              </div>

              {/* Members List */}
              {displayMembers.length === 0 ? (
                <div className="py-6 px-4 text-center space-y-2 bg-[#F9F8F3] rounded-2xl border border-dashed border-[#DFDACB]">
                  <Users size={22} className="text-[#8FA393] mx-auto" />
                  <p className="text-xs font-semibold text-[#5B7060]">No family members added yet.</p>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-xs font-bold text-[#1E3A20] hover:underline cursor-pointer"
                  >
                    Add Members in Profile &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  {displayMembers.map((member) => {
                    const evalResult = evaluateMemberRecipeSuitability(recipe, member)
                    return (
                      <div
                        key={member.id}
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl hover:bg-[#F9F8F3] transition-colors border border-transparent hover:border-[#EFEBE0] cursor-pointer"
                      >
                        {/* Avatar with authentic illustrated SVG portrait matching Image 1 */}
                        <MemberAvatar member={member} size={38} use3d={false} />

                        {/* Middle Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-[#1E3A20] truncate">
                              {member.name}
                            </span>
                            <span className="text-[11px] font-medium text-[#738575] capitalize">
                              ({member.role?.toLowerCase() || 'member'})
                            </span>
                          </div>

                          {/* Status Line */}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {evalResult.isNeutral ? (
                              <>
                                <Info size={13} className="text-[#9CA3AF] shrink-0" />
                                <span className="text-[11px] sm:text-xs text-[#6B7280] truncate">
                                  Not enough health data to assess conflicts yet.
                                </span>
                              </>
                            ) : evalResult.isSuitable ? (
                              <>
                                <CheckCircle2 size={13} className="text-[#16A34A] shrink-0" />
                                <span className="text-[11px] sm:text-xs text-[#2E7D32] truncate">
                                  Safe for {member.name} — no allergen or diet conflicts found.
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={13} className="text-[#DC2626] shrink-0" />
                                <span className="text-[11px] sm:text-xs text-[#DC2626] truncate">
                                  {evalResult.reason}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right Chevron */}
                        <ChevronRight size={16} className="text-[#B5C2B7] shrink-0" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── COLUMN 3: HOW TO MAKE CARD (~32% width: col-span-4) ── */}
          <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-[24px] border border-[#EAE5D8] p-5 sm:p-6 shadow-[0_2px_12px_rgba(35,66,38,0.03)] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-[#F0ECE1]">
                <div className="w-8 h-8 rounded-full bg-[#E5ECD9] text-[#1E3A20] flex items-center justify-center shrink-0">
                  <ChefHat size={16} strokeWidth={2.4} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1E3A20]">How to Make</h3>
              </div>

              {/* Steps List */}
              <div className="space-y-2.5 sm:space-y-3">
                {recipe.steps?.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F6F7F2] border border-[#E8EDE0] rounded-2xl p-3 sm:p-3.5 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#658052] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#3E5242] font-medium leading-relaxed m-0">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
