import React from 'react'

/**
 * Brand Elements from the FamilyFit brand sheet:
 * - Leaf (Leaf Green #7CB342 / Forest Green #1F5D3A)
 * - Heart (Sun Orange #F59E0B)
 * - Family Dots (Forest Green #1F5D3A heads / bodies)
 * - Sprout (Two-tone green sprout)
 */

export function BrandLeaf({ size = 20, className = '', color = '#7CB342' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M20.5 3.5C12 3.5 4.5 9 3.5 17.5C3.3 19.5 4.9 21.1 6.9 20.9C15.4 19.9 20.9 12.4 20.9 3.9L20.5 3.5Z"
        fill={color}
      />
      <path
        d="M6 18C10 14 15 10 20.5 3.5"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BrandHeart({ size = 20, className = '', color = '#F59E0B' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
        fill={color}
      />
    </svg>
  )
}

export function BrandFamilyDots({ size = 22, className = '', color = '#1F5D3A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* 3 figures: center parent and two children */}
      <circle cx="12" cy="6" r="3" fill={color} />
      <path d="M7 19C7 15.7 9.2 13 12 13C14.8 13 17 15.7 17 19H7Z" fill={color} />
      <circle cx="5" cy="11" r="2.2" fill="#7CB342" />
      <circle cx="19" cy="11" r="2.2" fill="#7CB342" />
    </svg>
  )
}

export function BrandSprout({ size = 22, className = '', forest = '#1F5D3A', leaf = '#7CB342' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 22V13"
        stroke={forest}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Left Leaf */}
      <path
        d="M12 15C8.5 15 5.5 12 6.5 7.5C10.5 7.5 12 11 12 15Z"
        fill={forest}
      />
      {/* Right Leaf */}
      <path
        d="M12 13C15.5 13 18.5 10 17.5 5.5C13.5 5.5 12 9 12 13Z"
        fill={leaf}
      />
    </svg>
  )
}

export default {
  BrandLeaf,
  BrandHeart,
  BrandFamilyDots,
  BrandSprout,
}
