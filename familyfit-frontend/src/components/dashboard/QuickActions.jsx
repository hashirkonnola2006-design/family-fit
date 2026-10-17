import { useNavigate } from 'react-router-dom'
import { CalendarPlus, ShoppingCart, Activity, Compass } from 'lucide-react'

export default function QuickActions({ onPlanMeal, onOpenWeightLog }) {
  const navigate = useNavigate()

  const ACTIONS = [
    {
      id: 'plan',
      label: 'Add to Plan',
      sub: 'Schedule meals',
      icon: CalendarPlus,
      bg: '#EAF5E4',
      color: '#2E7D32',
      onClick: onPlanMeal,
    },
    {
      id: 'grocery',
      label: 'Grocery List',
      sub: 'Auto ingredients',
      icon: ShoppingCart,
      bg: '#FAF7F0',
      color: '#3F5A3A',
      onClick: () => navigate('/grocery'),
    },
    {
      id: 'log',
      label: 'Log Weight',
      sub: 'Track health',
      icon: Activity,
      bg: '#FFF7ED',
      color: '#EA580C',
      onClick: onOpenWeightLog,
    },
    {
      id: 'browse',
      label: 'Browse Recipes',
      sub: '500+ dishes',
      icon: Compass,
      bg: '#EFF6FF',
      color: '#2563EB',
      onClick: () => navigate('/recipes'),
    },
  ]

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-sm flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
        <div className="pb-3 border-b border-[#EDE8DE]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3F5A3A]">
            Shortcuts
          </span>
          <h3 className="text-lg font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] mt-0.5">
            Quick Actions
          </h3>
        </div>

        {/* 2x2 Grid Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          {ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="p-3.5 rounded-2xl border border-[#EDE8DE] hover:border-[#3F5A3A]/40 bg-[#FAF7F0]/40 hover:bg-white text-left transition-all duration-200 cursor-pointer group flex flex-col justify-between hover:shadow-xs"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: action.bg, color: action.color }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans']">
                    {action.label}
                  </div>
                  <div className="text-[10px] text-[#6B7A70] mt-0.5">
                    {action.sub}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
