import { TrendingDown, Award, Plus, Activity } from 'lucide-react'
import { getWeeklyWeightHistory } from '../../services/dashboardService'

export default function ProgressChart({ selectedMember, onOpenWeightLog }) {
  const history = getWeeklyWeightHistory(selectedMember)

  if (!history || history.length === 0) {
    return (
      <div className="duo-card p-6 flex flex-col justify-between text-center">
        <div className="py-8">
          <div className="w-12 h-12 rounded-2xl bg-[#58CC02]/15 text-[#58CC02] flex items-center justify-center mx-auto mb-3 font-bold">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <h4 className="text-sm font-black text-[#4B4B4B]">No weight logged yet</h4>
          <p className="text-xs text-[#AFAFAF] font-bold mt-1 mb-4">
            Log your weekly weight to track your family’s wellness trajectory.
          </p>
          <button
            onClick={onOpenWeightLog}
            className="duo-btn duo-btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <Plus size={14} strokeWidth={3} />
            <span>Log weight to see progress</span>
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
    <div className="duo-card p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#58CC02]/15 text-[#58CC02] flex items-center justify-center font-bold">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#AFAFAF]">
                Wellness Trajectory
              </span>
              <h3 className="text-lg font-black text-[#4B4B4B]">
                Progress
              </h3>
            </div>
          </div>
          <button
            onClick={onOpenWeightLog}
            className="duo-btn duo-btn-secondary text-xs py-1 px-3 flex items-center gap-1"
          >
            <Plus size={13} strokeWidth={3} />
            <span>Log</span>
          </button>
        </div>

        {/* Lightweight SVG Line Chart */}
        <div className="pt-4">
          <div className="w-full flex justify-center overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#58CC02" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#58CC02" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area under curve */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Trend line */}
              <path
                d={pathD}
                fill="none"
                stroke="#58CC02"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={i === points.length - 1 ? 5 : 3.5}
                    fill={i === points.length - 1 ? '#58CC02' : '#FFFFFF'}
                    stroke="#58CC02"
                    strokeWidth="2.5"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-[#AFAFAF] px-2 pt-1 font-black">
            {history.map((h, i) => (
              <span key={i}>{h.week}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Text Insight */}
      <div className="pt-4 mt-3 border-t-2 border-[#E5E5E5]">
        <div className="p-3 rounded-2xl bg-[#58CC02]/15 border border-[#58CC02]/30 flex items-center gap-2 text-xs font-black text-[#58CC02]">
          <TrendingDown size={16} strokeWidth={2.5} className="shrink-0" />
          <span className="line-clamp-1">
            You’re on track this week • -{weightChange} kg steady trend
          </span>
        </div>
      </div>
    </div>
  )
}
