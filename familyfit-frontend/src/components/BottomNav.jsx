import { useNavigate, useLocation } from 'react-router-dom'
import { Home, UtensilsCrossed, ShoppingBag, Lightbulb, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Dock, DockIcon, DockItem, DockLabel } from './ui/dock'

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    path: '/recipes',
    label: 'Recipes',
    icon: UtensilsCrossed,
  },
  {
    path: '/grocery',
    label: 'Grocery',
    icon: ShoppingBag,
  },
  {
    path: '/tips',
    label: 'Tips',
    icon: Lightbulb,
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: User,
  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isDark } = useTheme()

  return (
    <div
      className="mobile-bottom-dock-wrapper"
      style={{
        position: 'fixed',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        width: 'auto',
        maxWidth: '100vw',
      }}
    >
      <Dock className="items-end pb-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path
          const IconComponent = item.icon

          return (
            <DockItem
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`aspect-square rounded-full transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                  : 'bg-gray-100 text-neutral-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200'
              }`}
            >
              <DockLabel>{item.label}</DockLabel>
              <DockIcon>
                <IconComponent
                  className={`h-5 w-5 ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-700 dark:text-neutral-200'
                  }`}
                />
              </DockIcon>
            </DockItem>
          )
        })}
      </Dock>

      <style>{`
        /* Show dock on mobile/tablet view by default, hide top desktop navbar menu on small screens */
        .mobile-bottom-dock-wrapper {
          display: block;
        }

        @media (min-width: 768px) {
          .mobile-bottom-dock-wrapper {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
