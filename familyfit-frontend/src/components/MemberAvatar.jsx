import React from 'react'
import { AVATAR_REGISTRY, suggestAvatarKey } from '../config/avatars'

/**
 * Reusable MemberAvatar component
 * Uses the registry in src/config/avatars.ts
 * Allows simple swapping of illustrations without modifying component logic.
 * Fallback: bold initials on a colored circle.
 */
export default function MemberAvatar({
  member,
  size = 48,
  className = '',
  style = {},
  showBorder = false,
  use3d = false,
}) {
  const avatarKey =
    member?.avatarKey ||
    suggestAvatarKey(member?.role, member?.gender, member?.age)

  const avatarMeta = AVATAR_REGISTRY[avatarKey] || AVATAR_REGISTRY.other
  const name = member?.name || 'Member'
  const initial = (name.trim()[0] || 'M').toUpperCase()

  const [hasError, setHasError] = React.useState(false)
  const imageSrc = (use3d && avatarMeta?.src3d) ? avatarMeta.src3d : (avatarMeta?.src || avatarMeta?.src3d)

  // Size styling
  const sizePx = typeof size === 'number' ? `${size}px` : size

  if (hasError || !imageSrc) {
    return (
      <div
        className={`flex items-center justify-center font-black rounded-full select-none ${className}`}
        style={{
          width: sizePx,
          height: sizePx,
          backgroundColor: avatarMeta?.themeColor || '#E2E8F0',
          color: avatarMeta?.borderDark || '#1E293B',
          fontSize: typeof size === 'number' ? Math.max(12, Math.round(size * 0.4)) : 16,
          border: showBorder ? `3px solid ${avatarMeta?.borderColor || '#CBD5E1'}` : 'none',
          ...style,
        }}
        aria-label={name}
      >
        {initial}
      </div>
    )
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none shrink-0 ${className}`}
      style={{
        width: sizePx,
        height: sizePx,
        backgroundColor: avatarMeta.themeColor,
        border: showBorder ? `3px solid ${avatarMeta.borderColor}` : 'none',
        ...style,
      }}
    >
      <img
        src={imageSrc}
        alt={name}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover pointer-events-none"
        loading="lazy"
      />
    </div>
  )
}
