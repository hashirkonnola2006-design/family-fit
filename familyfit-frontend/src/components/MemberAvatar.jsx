/**
 * MemberAvatar Component
 * Uses the exact demographic profile photos for family members strictly based on AGE:
 * - CHILD (<13 yrs)
 * - TEENAGER (13-19 yrs)
 * - ADULT (20-59 yrs)
 * - ELDER (60+ yrs)
 * and gender (MALE / FEMALE).
 */

export function getDemographicCategory(member) {
  if (!member) return { ageCategory: 'ADULT', gender: 'FEMALE' }

  const gender = (member.gender || 'FEMALE').toUpperCase()
  const age = Number(member.age)

  let ageCategory = 'ADULT'

  if (!isNaN(age) && age > 0) {
    if (age >= 60) {
      ageCategory = 'ELDER'
    } else if (age >= 20) {
      ageCategory = 'ADULT'
    } else if (age >= 13) {
      ageCategory = 'TEENAGER'
    } else {
      ageCategory = 'CHILD'
    }
  } else {
    // Fallback if age is unassigned or NaN
    const role = (member.role || '').toUpperCase()
    if (role.includes('GRAND') || role.includes('ELDER')) ageCategory = 'ELDER'
    else if (role.includes('CHILD') || role.includes('KID') || role.includes('BABY')) ageCategory = 'CHILD'
    else ageCategory = 'ADULT'
  }

  return { ageCategory, gender }
}

const AVATAR_MAP = {
  CHILD_MALE: '/avatars/child_male.png',
  CHILD_FEMALE: '/avatars/child_female.png',
  TEENAGER_MALE: '/avatars/teen_male.png',
  TEENAGER_FEMALE: '/avatars/teen_female.png',
  ADULT_MALE: '/avatars/adult_male.png',
  ADULT_FEMALE: '/avatars/adult_female.png',
  ELDER_MALE: '/avatars/elder_male.png',
  ELDER_FEMALE: '/avatars/elder_female.png',
}

export default function MemberAvatar({ member, size = 38, style = {} }) {
  const { ageCategory, gender } = getDemographicCategory(member)
  const isMale = gender === 'MALE'
  const key = `${ageCategory}_${isMale ? 'MALE' : 'FEMALE'}`
  const imgSrc = AVATAR_MAP[key] || '/avatars/adult_female.png'

  return (
    <img
      src={imgSrc}
      alt={member?.name || 'Family Member'}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1.5px solid rgba(0,0,0,0.06)',
        display: 'block',
        ...style,
      }}
    />
  )
}
