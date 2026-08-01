/**
 * MacroBar — progress bar for a single macronutrient.
 * Props:
 *   label   {string}  e.g. "Protein"
 *   current {number}  grams consumed
 *   target  {number}  grams target
 *   color   {string}  CSS color variable
 */
export default function MacroBar({ label, current = 0, target = 100, color = 'var(--color-protein)' }) {
  const percent = Math.min((current / (target || 1)) * 100, 100)

  return (
    <div className="macro-bar-wrap">
      <div className="macro-bar-header">
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span>{current}g / {target}g</span>
      </div>
      <div className="macro-bar-track">
        <div
          className="macro-bar-fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  )
}
