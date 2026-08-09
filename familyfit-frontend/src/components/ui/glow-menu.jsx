import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Utensils, ShoppingBag, Lightbulb, User } from 'lucide-react'

const menuItems = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Home",
    href: "/",
    gradient: "radial-gradient(circle, rgba(74,222,128,0.25) 0%, rgba(34,197,94,0.1) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-emerald-400",
  },
  {
    icon: <Utensils className="h-5 w-5" />,
    label: "Recipes",
    href: "/recipes",
    gradient: "radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(249,115,22,0.1) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-400",
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Grocery",
    href: "/grocery",
    gradient: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(14,165,233,0.1) 50%, rgba(3,105,161,0) 100%)",
    iconColor: "text-sky-400",
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    label: "Tips",
    href: "/tips",
    gradient: "radial-gradient(circle, rgba(250,204,21,0.25) 0%, rgba(234,179,8,0.1) 50%, rgba(161,98,7,0) 100%)",
    iconColor: "text-amber-400",
  },
  {
    icon: <User className="h-5 w-5" />,
    label: "Profile",
    href: "/profile",
    gradient: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(147,51,234,0.1) 50%, rgba(126,34,206,0) 100%)",
    iconColor: "text-purple-400",
  },
]

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

export function GlowMenuBar({ isDark = false, isHomePage = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <motion.nav
      className={`p-1.5 rounded-2xl relative overflow-hidden transition-all duration-300 ${
        isHomePage
          ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
          : isDark
          ? "bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl"
          : "bg-white/90 backdrop-blur-md border border-emerald-900/10 shadow-lg"
      }`}
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className={`absolute -inset-2 bg-gradient-radial from-transparent ${
          isHomePage
            ? "via-emerald-400/30 via-30% via-teal-400/30 via-60% via-lime-400/30 via-90%"
            : isDark
            ? "via-emerald-500/20 via-30% via-teal-500/20 via-60% via-cyan-500/20 via-90%"
            : "via-emerald-400/20 via-30% via-green-400/20 via-60% via-teal-400/20 via-90%"
        } to-transparent rounded-3xl z-0 pointer-events-none`}
        variants={navGlowVariants}
      />
      <ul className="flex items-center gap-1 relative z-10">
        {menuItems.map((item) => {
          const active = pathname === item.href
          return (
            <motion.li key={item.label} className="relative">
              <motion.div
                className="block rounded-xl overflow-visible group relative"
                style={{ perspective: "600px" }}
                whileHover="hover"
                initial="initial"
              >
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none"
                  variants={glowVariants}
                  style={{
                    background: item.gradient,
                    opacity: 0,
                    borderRadius: "12px",
                  }}
                />
                <motion.button
                  onClick={() => navigate(item.href)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 relative z-10 text-sm font-semibold rounded-xl transition-colors cursor-pointer border-0 ${
                    active
                      ? isHomePage
                        ? "bg-white/25 text-white"
                        : isDark
                        ? "bg-emerald-950/60 text-emerald-400"
                        : "bg-emerald-50 text-emerald-900"
                      : isHomePage
                      ? "text-white/80 hover:text-white"
                      : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  variants={itemVariants}
                  transition={sharedTransition}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
                >
                  <span className={`transition-colors duration-300 ${item.iconColor}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate(item.href)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 absolute inset-0 z-10 text-sm font-semibold rounded-xl transition-colors cursor-pointer border-0 ${
                    active
                      ? isHomePage
                        ? "bg-white/25 text-white"
                        : isDark
                        ? "bg-emerald-950/60 text-emerald-400"
                        : "bg-emerald-50 text-emerald-900"
                      : isHomePage
                      ? "text-white/80 hover:text-white"
                      : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  variants={backVariants}
                  transition={sharedTransition}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
                >
                  <span className={`transition-colors duration-300 ${item.iconColor}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.button>
              </motion.div>
            </motion.li>
          )
        })}
      </ul>
    </motion.nav>
  )
}

export default GlowMenuBar
