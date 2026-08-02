/**
 * MemberAvatar Component
 * Renders vector SVG avatars for family members matching their age category:
 * - CHILD (<13 yrs)
 * - TEENAGER (13-19 yrs)
 * - ADULT (20-59 yrs)
 * - ELDER (60+ yrs)
 * and gender (MALE / FEMALE).
 */

export function getDemographicCategory(member) {
  if (!member) return { ageCategory: 'ADULT', gender: 'FEMALE' }

  const gender = (member.gender || 'FEMALE').toUpperCase()
  const age = Number(member.age) || 30
  const role = (member.role || '').toUpperCase()

  let ageCategory = 'ADULT'

  if (age >= 60 || role.includes('GRAND') || role.includes('ELDER')) {
    ageCategory = 'ELDER'
  } else if (age >= 13 && age <= 19) {
    ageCategory = 'TEENAGER'
  } else if (age < 13 || role.includes('CHILD') || role.includes('KID') || role.includes('BABY')) {
    if (age >= 13 && age <= 19) {
      ageCategory = 'TEENAGER'
    } else {
      ageCategory = 'CHILD'
    }
  } else {
    ageCategory = 'ADULT'
  }

  return { ageCategory, gender }
}

export default function MemberAvatar({ member, size = 38, style = {} }) {
  const { ageCategory, gender } = getDemographicCategory(member)
  const isMale = gender === 'MALE'

  // Colors per age category matching design
  const config = {
    CHILD: { bg: '#dcfce7', stroke: '#166534', mainColor: '#22c55e' },
    TEENAGER: { bg: '#dbeafe', stroke: '#1e40af', mainColor: '#3b82f6' },
    ADULT: { bg: '#ffedd5', stroke: '#9a3412', mainColor: '#f97316' },
    ELDER: { bg: '#f3e8ff', stroke: '#6b21a8', mainColor: '#a855f7' },
  }[ageCategory] || { bg: '#ffedd5', stroke: '#9a3412', mainColor: '#f97316' }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: config.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        border: '1.5px solid rgba(0,0,0,0.05)',
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Background Circle */}
        <circle cx="50" cy="50" r="50" fill={config.bg} />

        {/* 1. CHILD MALE */}
        {ageCategory === 'CHILD' && isMale && (
          <g>
            {/* Clothes */}
            <path d="M 25 82 Q 50 68 75 82 L 75 100 L 25 100 Z" fill={config.mainColor} />
            <path d="M 42 70 A 8 8 0 0 0 58 70" fill="none" stroke="#1f2937" strokeWidth="2.5" />
            {/* Neck & Face */}
            <rect x="44" y="58" width="12" height="14" fill="#fed7aa" rx="4" />
            <ellipse cx="50" cy="46" rx="20" ry="22" fill="#fed7aa" />
            {/* Hair */}
            <path d="M 28 44 Q 30 22 50 22 Q 70 22 72 44 Q 65 30 50 30 Q 35 30 28 44 Z" fill="#1f2937" />
            <path d="M 46 22 Q 50 14 54 22 Z" fill="#1f2937" />
            {/* Eyes & Smile */}
            <circle cx="42" cy="46" r="3" fill="#1f2937" />
            <circle cx="58" cy="46" r="3" fill="#1f2937" />
            <path d="M 45 52 Q 50 57 55 52" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="50" r="3" fill="#fca5a5" opacity="0.6" />
            <circle cx="64" cy="50" r="3" fill="#fca5a5" opacity="0.6" />
          </g>
        )}

        {/* 2. CHILD FEMALE */}
        {ageCategory === 'CHILD' && !isMale && (
          <g>
            {/* Clothes */}
            <path d="M 25 82 Q 50 68 75 82 L 75 100 L 25 100 Z" fill={config.mainColor} />
            {/* Overalls Straps */}
            <line x1="36" y1="72" x2="36" y2="100" stroke="#15803d" strokeWidth="4" />
            <line x1="64" y1="72" x2="64" y2="100" stroke="#15803d" strokeWidth="4" />
            {/* Neck & Face */}
            <rect x="44" y="58" width="12" height="14" fill="#fed7aa" rx="4" />
            {/* Pigtails */}
            <ellipse cx="22" cy="52" rx="7" ry="14" fill="#1f2937" />
            <ellipse cx="78" cy="52" rx="7" ry="14" fill="#1f2937" />
            <circle cx="28" cy="44" r="4" fill="#22c55e" />
            <circle cx="72" cy="44" r="4" fill="#22c55e" />
            {/* Face */}
            <ellipse cx="50" cy="46" rx="20" ry="22" fill="#fed7aa" />
            {/* Bangs */}
            <path d="M 30 40 Q 50 22 70 40 Q 60 32 50 32 Q 40 32 30 40 Z" fill="#1f2937" />
            {/* Eyes & Smile */}
            <circle cx="42" cy="46" r="3" fill="#1f2937" />
            <circle cx="58" cy="46" r="3" fill="#1f2937" />
            <path d="M 45 53 Q 50 57 55 53" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="50" r="3.5" fill="#fca5a5" opacity="0.6" />
            <circle cx="64" cy="50" r="3.5" fill="#fca5a5" opacity="0.6" />
          </g>
        )}

        {/* 3. TEENAGER MALE */}
        {ageCategory === 'TEENAGER' && isMale && (
          <g>
            {/* Hoodie */}
            <path d="M 22 82 Q 50 66 78 82 L 78 100 L 22 100 Z" fill={config.mainColor} />
            <path d="M 38 72 L 50 88 L 62 72" fill="none" stroke="#1d4ed8" strokeWidth="3" />
            {/* Neck & Face */}
            <rect x="44" y="56" width="12" height="14" fill="#fed7aa" rx="4" />
            <ellipse cx="50" cy="44" rx="20" ry="22" fill="#fed7aa" />
            {/* Spiky Cool Hair */}
            <path d="M 26 42 Q 28 18 50 18 Q 72 18 74 42 Q 62 26 50 26 Q 38 26 26 42 Z" fill="#1f2937" />
            <path d="M 35 22 L 42 12 L 48 20 L 56 10 L 62 20" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Eyes & Smile */}
            <circle cx="42" cy="44" r="3" fill="#1f2937" />
            <circle cx="58" cy="44" r="3" fill="#1f2937" />
            <path d="M 45 52 Q 50 56 55 52" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 4. TEENAGER FEMALE */}
        {ageCategory === 'TEENAGER' && !isMale && (
          <g>
            {/* Ponytail behind */}
            <path d="M 22 30 Q 12 45 20 60 Q 28 50 28 36 Z" fill="#1f2937" />
            {/* Hoodie */}
            <path d="M 22 82 Q 50 66 78 82 L 78 100 L 22 100 Z" fill={config.mainColor} />
            <path d="M 38 72 L 50 88 L 62 72" fill="none" stroke="#1d4ed8" strokeWidth="3" />
            {/* Neck & Face */}
            <rect x="44" y="56" width="12" height="14" fill="#fed7aa" rx="4" />
            <ellipse cx="50" cy="44" rx="20" ry="22" fill="#fed7aa" />
            {/* Hair with side bangs & ponytail tie */}
            <path d="M 28 42 Q 30 20 50 20 Q 70 20 72 42 Q 60 28 50 28 Q 38 28 28 42 Z" fill="#1f2937" />
            <circle cx="28" cy="30" r="4" fill="#3b82f6" />
            {/* Eyes & Smile */}
            <circle cx="42" cy="44" r="3" fill="#1f2937" />
            <circle cx="58" cy="44" r="3" fill="#1f2937" />
            <path d="M 45 52 Q 50 56 55 52" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="48" r="3" fill="#fca5a5" opacity="0.6" />
            <circle cx="64" cy="48" r="3" fill="#fca5a5" opacity="0.6" />
          </g>
        )}

        {/* 5. ADULT MALE */}
        {ageCategory === 'ADULT' && isMale && (
          <g>
            {/* Collared Shirt */}
            <path d="M 22 82 Q 50 66 78 82 L 78 100 L 22 100 Z" fill={config.mainColor} />
            <path d="M 42 66 L 50 82 L 58 66" fill="#fff" />
            {/* Neck & Face */}
            <rect x="44" y="54" width="12" height="14" fill="#fed7aa" rx="4" />
            <ellipse cx="50" cy="44" rx="20" ry="22" fill="#fed7aa" />
            {/* Neat Hair */}
            <path d="M 28 40 Q 30 18 50 18 Q 70 18 72 40 Q 62 26 50 26 Q 38 26 28 40 Z" fill="#1f2937" />
            {/* Beard & Mustache */}
            <path d="M 33 46 C 33 66 67 66 67 46 C 63 60 37 60 33 46 Z" fill="#1f2937" />
            <path d="M 42 50 Q 50 55 58 50 Q 50 51 42 50 Z" fill="#1f2937" />
            {/* Eyes */}
            <circle cx="42" cy="42" r="3" fill="#1f2937" />
            <circle cx="58" cy="42" r="3" fill="#1f2937" />
          </g>
        )}

        {/* 6. ADULT FEMALE */}
        {ageCategory === 'ADULT' && !isMale && (
          <g>
            {/* Long Hair back */}
            <path d="M 26 35 C 20 60 25 80 32 90 L 68 90 C 75 80 80 60 74 35 Z" fill="#1f2937" />
            {/* Top */}
            <path d="M 22 82 Q 50 68 78 82 L 78 100 L 22 100 Z" fill={config.mainColor} />
            {/* Neck & Face */}
            <rect x="44" y="56" width="12" height="14" fill="#fed7aa" rx="4" />
            <ellipse cx="50" cy="44" rx="20" ry="22" fill="#fed7aa" />
            {/* Hair Front */}
            <path d="M 28 42 Q 30 18 50 18 Q 70 18 72 42 Q 60 28 50 28 Q 38 28 28 42 Z" fill="#1f2937" />
            {/* Earrings */}
            <circle cx="28" cy="48" r="3" fill="#fbbf24" />
            <circle cx="72" cy="48" r="3" fill="#fbbf24" />
            {/* Eyes & Smile */}
            <circle cx="42" cy="44" r="3" fill="#1f2937" />
            <circle cx="58" cy="44" r="3" fill="#1f2937" />
            <path d="M 45 52 Q 50 56 55 52" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="48" r="3" fill="#fca5a5" opacity="0.6" />
            <circle cx="64" cy="48" r="3" fill="#fca5a5" opacity="0.6" />
          </g>
        )}

        {/* 7. ELDER MALE */}
        {ageCategory === 'ELDER' && isMale && (
          <g>
            {/* Sweater */}
            <path d="M 22 82 Q 50 66 78 82 L 78 100 L 22 100 Z" fill={config.mainColor} />
            <path d="M 42 66 L 50 80 L 58 66" fill="#fff" />
            {/* Neck & Face */}
            <rect x="44" y="54" width="12" height="14" fill="#fed7aa" rx="4" />
            <ellipse cx="50" cy="44" rx="20" ry="22" fill="#fed7aa" />
            {/* Balding Grey Hair on sides */}
            <path d="M 28 40 Q 28 28 36 24 M 64 24 Q 72 28 72 40" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Glasses */}
            <circle cx="40" cy="42" r="7" fill="none" stroke="#1f2937" strokeWidth="2.5" />
            <circle cx="60" cy="42" r="7" fill="none" stroke="#1f2937" strokeWidth="2.5" />
            <line x1="47" y1="42" x2="53" y2="42" stroke="#1f2937" strokeWidth="2.5" />
            {/* Eyes & Mustache */}
            <circle cx="40" cy="42" r="2.5" fill="#1f2937" />
            <circle cx="60" cy="42" r="2.5" fill="#1f2937" />
            <path d="M 38 52 Q 50 48 62 52 Q 50 57 38 52 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
          </g>
        )}

        {/* 8. ELDER FEMALE */}
        {ageCategory === 'ELDER' && !isMale && (
          <g>
            {/* Hair Bun top */}
            <circle cx="50" cy="18" r="10" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />
            {/* Blouse */}
            <path d="M 22 82 Q 50 68 78 82 L 78 100 L 22 100 Z" fill={config.mainColor} />
            {/* Neck & Face */}
            <rect x="44" y="56" width="12" height="14" fill="#fed7aa" rx="4" />
            <ellipse cx="50" cy="44" rx="20" ry="22" fill="#fed7aa" />
            {/* Grey Hair */}
            <path d="M 28 42 Q 30 24 50 24 Q 70 24 72 42 Q 60 30 50 30 Q 38 30 28 42 Z" fill="#9ca3af" />
            {/* Glasses */}
            <circle cx="40" cy="44" r="7" fill="none" stroke="#1f2937" strokeWidth="2.5" />
            <circle cx="60" cy="44" r="7" fill="none" stroke="#1f2937" strokeWidth="2.5" />
            <line x1="47" y1="44" x2="53" y2="44" stroke="#1f2937" strokeWidth="2.5" />
            {/* Eyes & Gentle Smile */}
            <circle cx="40" cy="44" r="2.5" fill="#1f2937" />
            <circle cx="60" cy="44" r="2.5" fill="#1f2937" />
            <path d="M 45 54 Q 50 58 55 54" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  )
}
