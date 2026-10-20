import { useNavigate } from 'react-router-dom'
import { CalendarPlus, ShoppingCart, Activity, Compass, Zap } from 'lucide-react'

export default function QuickActions({ onPlanMeal, onOpenWeightLog }) {
  const navigate = useNavigate()

  const ACTIONS = [
    {
      id: 'plan',
      label: 'Add to Plan',
      sub: 'Schedule meals',
      icon: CalendarPlus,
      bg: '#58CC02',
      borderDark: '#58A700',
      textColor: 'text-[#58CC02]',
      onClick: onPlanMeal,
    },
    {
      id: 'grocery',
      label: 'Grocery List',
      sub: 'Auto ingredients',
      icon: ShoppingCart,
      bg: '#1CB0F6',
      borderDark: '#1899D6',
      textColor: 'text-[#1CB0F6]',
      onClick: () => navigate('/grocery'),
    },
    {
      id: 'log',
      label: 'Log Weight',
      sub: 'Track health',
      icon: Activity,
      bg: '#FF9600',
      borderDark: '#E08500',
      textColor: 'text-[#FF9600]',
      onClick: onOpenWeightLog,
    },
    {
      id: 'browse',
      label: 'Browse Recipes',
      sub: '500+ dishes',
      icon: Compass,
      bg: '#CE82FF',
      borderDark: '#B865F2',
      textColor: 'text-[#CE82FF]',
      onClick: () => navigate('/recipes'),
    },
  ]

  return (
    <div className="duo-card p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b-2 border-[#E5E5E5]">
          <div className="w-8 h-8 rounded-xl bg-[#FFC800]/20 text-[#FF9600] flex items-center justify-center font-bold">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#AFAFAF]">
              Shortcuts
            </span>
            <h3 className="text-lg font-black text-[#4B4B4B]">
              Quick Actions
            </h3>
          </div>
        </div>

        {/* Action Buttons: 2 cols on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
          {ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                type="button"
                className="p-4 rounded-2xl border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] hover:border-[#4B4B4B]/30 hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 text-left transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mb-3 text-white shadow-xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: action.bg }}
                >
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-sm font-black text-[#4B4B4B]">
                    {action.label}
                  </div>
                  <div className="text-xs font-bold text-[#AFAFAF] mt-0.5">
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
