import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Clock, Flame, Plus, Check, ArrowRight, Sparkles } from 'lucide-react'

// Curated 6 distinct Kerala recipes with unique imagery
const RECOMMENDED_POOL = [
  {
    id: 1,
    name: 'Palappam with Vegetable Stew',
    tag: 'Digestive Comfort',
    kcal: 360,
    cookTimeMinutes: 20,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    whyRecommended: 'Soft fermented rice flour with coconut milk & fresh local vegetables.',
  },
  {
    id: 2,
    name: 'Traditional Kerala Avial',
    tag: 'Low Glycemic',
    kcal: 290,
    cookTimeMinutes: 25,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    whyRecommended: 'Thirteen traditional vegetables cooked in coconut paste and fresh curd.',
  },
  {
    id: 3,
    name: 'Steamed Nendran Banana Roast',
    tag: 'Quick Healthy Snack',
    kcal: 180,
    cookTimeMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80',
    whyRecommended: 'Rich in dietary fiber and essential potassium for growing kids.',
  },
  {
    id: 4,
    name: 'Moringa Leaf Thoran with Coconut',
    tag: 'Superfood Iron',
    kcal: 210,
    cookTimeMinutes: 15,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80',
    whyRecommended: 'Nutrient-dense drumstick leaves with shallots and cold-pressed oil.',
  },
  {
    id: 5,
    name: 'Karimeen Pollichathu in Banana Leaf',
    tag: 'Heart & Omega-3',
    kcal: 380,
    cookTimeMinutes: 25,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    whyRecommended: 'Pearl spot marinated in shallot-chilli masala wrapped in charred leaf.',
  },
  {
    id: 6,
    name: 'Red Matta Rice Kanji with Payar',
    tag: 'Ayurvedic Detox',
    kcal: 310,
    cookTimeMinutes: 20,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    whyRecommended: 'Warm comfort kanji cooked with unpolished rice and green gram.',
  },
]

export default function RecommendedRecipes({ onAddDishToPlan }) {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([1, 4])
  const [addedIds, setAddedIds] = useState([])

  const toggleFav = (id, e) => {
    e.stopPropagation()
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleAdd = (dish, e) => {
    e.stopPropagation()
    setAddedIds(prev => [...prev, dish.id])
    if (onAddDishToPlan) onAddDishToPlan(dish)
    setTimeout(() => {
      setAddedIds(prev => prev.filter(i => i !== dish.id))
    }, 2500)
  }

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EDE8DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3F5A3A]">
              Personalized Nutrition Recommendations
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5E4] text-[#3F5A3A] font-bold">
              Tailored for Your Household
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] mt-1">
            Recommended For You
          </h2>
        </div>

        <button
          onClick={() => navigate('/recipes')}
          className="text-xs sm:text-sm font-bold text-[#3F5A3A] hover:text-[#32492E] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Explore all 500+ recipes</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Responsive Grid of 6 Distinct Recipe Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-6">
        {RECOMMENDED_POOL.map((dish) => {
          const isFav = favorites.includes(dish.id)
          const isAdded = addedIds.includes(dish.id)

          return (
            <div
              key={dish.id}
              onClick={() => navigate(`/recipes/${dish.id}`)}
              className="rounded-2xl border border-[#EDE8DE] hover:border-[#3F5A3A]/40 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 group cursor-pointer bg-white"
            >
              <div>
                {/* Image Wrap */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#243422]">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={(e) => toggleFav(dish.id, e)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xs"
                    title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart
                      size={15}
                      className={isFav ? 'text-[#EF4444] fill-[#EF4444]' : 'text-[#6B7A70]'}
                    />
                  </button>

                  {/* Category Tag */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                    {dish.tag}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1F2A24] font-['Plus_Jakarta_Sans'] line-clamp-1 group-hover:text-[#3F5A3A] transition-colors">
                    {dish.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-[#6B7A70] mt-2 pb-2.5 border-b border-[#EDE8DE]">
                    <span className="flex items-center gap-1 font-bold text-[#1F2A24] text-[11px]">
                      <Flame size={12} className="text-[#F26B3A]" />
                      {dish.kcal} kcal
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock size={12} />
                      {dish.cookTimeMinutes}m
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6B7A70] mt-2 line-clamp-2 leading-relaxed">
                    {dish.whyRecommended}
                  </p>
                </div>
              </div>

              {/* Add to Plan Button */}
              <div className="p-3.5 pt-0">
                <button
                  onClick={(e) => handleAdd(dish, e)}
                  disabled={isAdded}
                  className={`w-full h-8 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-[#EAF5E4] text-[#2E7D32]'
                      : 'border border-[#DCD5C8] hover:border-[#3F5A3A] hover:bg-[#3F5A3A] hover:text-white text-[#1F2A24]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={13} />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>+ Add to plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
