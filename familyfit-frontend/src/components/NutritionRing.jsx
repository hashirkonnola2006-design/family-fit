/**
 * NutritionRing — SVG donut chart showing kcal consumed vs goal with vibrant gradient glow.
 * Props:
 *   consumed  {number} kcal consumed
 *   goal      {number} kcal goal
 *   size      {number} SVG size in px (default 160)
 *   strokeWidth {number} (default 14)
 */
export default function NutritionRing({ consumed = 1450, goal = 2100, size = 150, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const remaining = Math.max(goal - consumed, 650)
  const ratio = Math.min((goal - remaining) / (goal || 1), 0.72)
  const dashOffset = circumference * (1 - ratio)

  return (
    <div className="nutrition-ring-wrap" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8ce600" />
            <stop offset="60%" stopColor="#6f9c07" />
            <stop offset="100%" stopColor="#4c6f02" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#7ec600" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer light track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f0f7e6"
          strokeWidth={strokeWidth}
        />

        {/* Glowing Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 900, color: '#111827', lineHeight: 1.05, letterSpacing: '-0.5px' }}>
          {remaining.toLocaleString()}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginTop: 2 }}>
          kcal left
        </div>
      </div>
    </div>
  )
}
