import { TrendingDown, Award, Plus, Activity } from 'lucide-react'
import { getWeeklyWeightHistory } from '../../services/dashboardService'

export default function ProgressChart({ selectedMember, onOpenWeightLog }) {
  const history = getWeeklyWeightHistory(selectedMember)

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-sm flex flex-col justify-between text-center transition-all">
        <div className="py-8">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F0] text-[#3F5A3A] flex items-center justify-center mx-auto mb-3">
            <Activity size={22} />
          </div>
          <h4 className="text-sm font-bold text-[#1F2A24]">No weight logged yet</h4>
          <p className="text-xs text-[#6B7A70] mt-1 mb-4">
            Log your weekly weight to track your family’s wellness trajectory.
          </p>
          <button
            onClick={onOpenWeightLog}
            className="text-xs font-bold text-[#3F5A3A] hover:underline"
          >
            + Log your weight to see progress
          </button>
        </div>
      </div>
    )
  }

  // Calculate SVG line path coordinates
  const minWeight = Math.min(...history.map(h => h.weight)) - 0.5
  const maxWeight = Math.max(...history.map(h => h.weight)) + 0.5
  const range = maxWeight - minWeight || 1

  const width = 240
  const height = 90
  const points = history.map((item, idx) => {
    const x = (idx / (history.length - 1)) * (width - 24) + 12
    const y = height - ((item.weight - minWeight) / range) * (height - 24) - 12
    return { x, y, weight: item.weight, week: item.week }
  })

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  const weightChange = (history[0].weight - history[history.length - 1].weight).toFixed(1)

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-sm flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DE]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3F5A3A]">
              Wellness Trajectory
            </span>
            <h3 className="text-lg font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] mt-0.5">
              Progress
            </h3>
          </div>
          <button
            onClick={onOpenWeightLog}
            className="text-xs font-bold text-[#3F5A3A] hover:text-[#32492E] flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} />
            <span>Log</span>
          </button>
        </div>

        {/* Lightweight SVG Line Chart */}
        <div className="pt-4">
          <div className="w-full flex justify-center overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6BBF4E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6BBF4E" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area under curve */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Trend line */}
              <path
                d={pathD}
                fill="none"
                stroke="#3F5A3A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={i === points.length - 1 ? 4.5 : 3}
                    fill={i === points.length - 1 ? '#3F5A3A' : '#FFFFFF'}
                    stroke="#3F5A3A"
                    strokeWidth="2"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-[#8D9B91] px-2 pt-1 font-semibold">
            {history.map((h, i) => (
              <span key={i}>{h.week}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Text Insight */}
      <div className="pt-4 mt-3 border-t border-[#EDE8DE]">
        <div className="p-2.5 rounded-xl bg-[#EAF5E4] flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
          <TrendingDown size={16} className="shrink-0" />
          <span className="line-clamp-1">
            You’re on track this week • -{weightChange} kg steady trend
          </span>
        </div>
      </div>
    </div>
  )
}
