import grandfatherSvg from '../assets/avatars/grandfather.svg'
import grandmotherSvg from '../assets/avatars/grandmother.svg'
import fatherSvg from '../assets/avatars/father.svg'
import motherSvg from '../assets/avatars/mother.svg'
import sonSvg from '../assets/avatars/son.svg'
import daughterSvg from '../assets/avatars/daughter.svg'
import babySvg from '../assets/avatars/baby.svg'
import otherSvg from '../assets/avatars/other.svg'

export interface AvatarMeta {
  key: string
  label: string
  src: string
  src3d?: string
  themeColor: string
  borderColor: string
  borderDark: string
}

export const AVATAR_REGISTRY: Record<string, AvatarMeta> = {
  grandfather: {
    key: 'grandfather',
    label: 'Grandfather',
    src: grandfatherSvg,
    src3d: '/images/avatars-3d/grandfather.png',
    themeColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderDark: '#D97706',
  },
  grandmother: {
    key: 'grandmother',
    label: 'Grandmother',
    src: grandmotherSvg,
    src3d: '/images/avatars-3d/grandmother.png',
    themeColor: '#FFFBEB',
    borderColor: '#EAB308',
    borderDark: '#CA8A04',
  },
  father: {
    key: 'father',
    label: 'Father',
    src: fatherSvg,
    src3d: '/images/avatars-3d/father.png',
    themeColor: '#ECFDF5',
    borderColor: '#10B981',
    borderDark: '#059669',
  },
  mother: {
    key: 'mother',
    label: 'Mother',
    src: motherSvg,
    src3d: '/images/avatars-3d/mother.png',
    themeColor: '#FDF2F8',
    borderColor: '#EC4899',
    borderDark: '#DB2777',
  },
  son: {
    key: 'son',
    label: 'Son / Boy',
    src: sonSvg,
    src3d: '/images/avatars-3d/son.png',
    themeColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderDark: '#2563EB',
  },
  daughter: {
    key: 'daughter',
    label: 'Daughter / Girl',
    src: daughterSvg,
    src3d: '/images/avatars-3d/daughter.png',
    themeColor: '#FDF4FF',
    borderColor: '#A855F7',
    borderDark: '#9333EA',
  },
  baby: {
    key: 'baby',
    label: 'Baby / Toddler',
    src: babySvg,
    src3d: '/images/avatars-3d/daughter.png',
    themeColor: '#F0FDF4',
    borderColor: '#22C55E',
    borderDark: '#16A34A',
  },
  other: {
    key: 'other',
    label: 'Family Member',
    src: otherSvg,
    src3d: '/images/avatars-3d/father.png',
    themeColor: '#F3E8FF',
    borderColor: '#8B5CF6',
    borderDark: '#7C3AED',
  },
}

export const AVATAR_KEYS = Object.keys(AVATAR_REGISTRY)

/**
 * Suggest a default avatarKey based on Role, Gender, and Age.
 */
export function suggestAvatarKey(role?: string, gender?: string, age?: number | string): string {
  const normRole = (role || '').trim().toUpperCase()
  const normGender = (gender || '').trim().toUpperCase()
  const numAge = Number(age)

  if (normRole === 'BABY' || (!isNaN(numAge) && numAge > 0 && numAge <= 3)) {
    return 'baby'
  }
  if (normRole === 'GRANDFATHER' || (!isNaN(numAge) && numAge >= 60 && normGender === 'MALE')) {
    return 'grandfather'
  }
  if (normRole === 'GRANDMOTHER' || (!isNaN(numAge) && numAge >= 60 && normGender === 'FEMALE')) {
    return 'grandmother'
  }
  if (normRole === 'SON' || (!isNaN(numAge) && numAge > 3 && numAge < 18 && normGender === 'MALE')) {
    return 'son'
  }
  if (normRole === 'DAUGHTER' || (!isNaN(numAge) && numAge > 3 && numAge < 18 && normGender === 'FEMALE')) {
    return 'daughter'
  }
  if (normRole === 'FATHER' || normGender === 'MALE') {
    return 'father'
  }
  if (normRole === 'MOTHER' || normGender === 'FEMALE') {
    return 'mother'
  }
  return 'other'
}

/**
 * Get the theme color palette for an avatar key.
 */
export function getAvatarTheme(avatarKey?: string) {
  if (avatarKey && AVATAR_REGISTRY[avatarKey]) {
    return AVATAR_REGISTRY[avatarKey]
  }
  return AVATAR_REGISTRY.other
}
