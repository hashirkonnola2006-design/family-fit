import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Utensils, ShoppingBag, Lightbulb, User } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/recipes', label: 'Recipes', icon: Utensils },
  { path: '/grocery', label: 'Groceries', icon: ShoppingBag },
  { path: '/tips', label: 'Tips', icon: Lightbulb },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function AnimatedNavbar({ isDark = false, isHomePage = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="flex items-center gap-2 p-1.5 rounded-full transition-all duration-300">
      {navItems.map((item) => {
        const isActive =
          (item.path === '/' && pathname === '/') ||
          (item.path !== '/' && pathname.startsWith(item.path))

        const IconComponent = item.icon

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex items-center gap-2.5 px-5 py-2.5 text-[15px] font-medium rounded-full transition-colors duration-200 cursor-pointer border-0 select-none ${
              isActive
                ? isHomePage
                  ? 'text-emerald-950 font-semibold'
                  : isDark
                  ? 'text-emerald-300 font-semibold'
                  : 'text-emerald-950 font-semibold'
                : isHomePage
                ? 'text-white/80 hover:text-white'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {/* Animated Active Pill Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeNavPill"
                className={`absolute inset-0 rounded-full shadow-sm z-0 ${
                  isHomePage
                    ? 'bg-white'
                    : isDark
                    ? 'bg-emerald-950/80 border border-emerald-800/60'
                    : 'bg-white border border-slate-200/80'
                }`}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32,
                }}
              />
            )}

            {/* Icon & Label */}
            <span className="relative z-10 flex items-center gap-2.5">
              <IconComponent
                className={`w-4.5 h-4.5 transition-transform duration-200 ${
                  isActive ? 'scale-105 opacity-100' : 'opacity-70'
                }`}
              />
              <span className="tracking-tight">{item.label}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
