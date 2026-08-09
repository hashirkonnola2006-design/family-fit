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
    <nav
      className={`relative flex items-center gap-1 p-1.5 rounded-full transition-all duration-300 ${
        isHomePage
          ? 'bg-white/15 backdrop-blur-md border border-white/20 shadow-lg'
          : isDark
          ? 'bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-lg'
          : 'bg-emerald-900/5 backdrop-blur-md border border-emerald-950/10 shadow-sm'
      }`}
    >
      {navItems.map((item) => {
        const isActive =
          (item.path === '/' && pathname === '/') ||
          (item.path !== '/' && pathname.startsWith(item.path))

        const IconComponent = item.icon

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer border-0 select-none ${
              isActive
                ? isHomePage
                  ? 'text-emerald-950 font-bold'
                  : isDark
                  ? 'text-emerald-300 font-bold'
                  : 'text-emerald-950 font-bold'
                : isHomePage
                ? 'text-white/90 hover:text-white'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-emerald-900'
            }`}
          >
            {/* Animated Active Background Pill */}
            {isActive && (
              <motion.div
                layoutId="activeNavPill"
                className={`absolute inset-0 rounded-full shadow-md z-0 ${
                  isHomePage
                    ? 'bg-white'
                    : isDark
                    ? 'bg-emerald-950/90 border border-emerald-800/50'
                    : 'bg-white border border-emerald-900/10'
                }`}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}

            {/* Icon & Label content above background */}
            <span className="relative z-10 flex items-center gap-2">
              <IconComponent
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'opacity-80'
                }`}
              />
              <span>{item.label}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
