import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, ShoppingCart, Sparkles, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/recipes',   label: 'Recipes',   icon: Utensils },
  { path: '/grocery',   label: 'Grocery',   icon: ShoppingCart },
  { path: '/tips',      label: 'Tips',      icon: Sparkles },
  { path: '/profile',   label: 'Settings',  icon: Settings },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#E5E5E5] px-2 py-2 shadow-lg">
      <nav className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || (item.path === '/dashboard' && (pathname === '/' || pathname === '/home'))
          const IconComponent = item.icon

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl cursor-pointer transition-all ${
                isActive
                  ? 'text-[#58CC02] font-black scale-105'
                  : 'text-[#AFAFAF] hover:text-[#4B4B4B] font-bold'
              }`}
            >
              <IconComponent size={22} strokeWidth={isActive ? 3 : 2} />
              <span className="text-[10px] leading-tight tracking-tight">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
