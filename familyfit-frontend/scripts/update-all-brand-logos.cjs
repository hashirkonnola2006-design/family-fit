const fs = require('fs');
const path = require('path');

const wm = JSON.parse(fs.readFileSync('public/brand/clean_wm_traced.json', 'utf8'));
const orig = JSON.parse(fs.readFileSync('public/brand/paths_extracted.json', 'utf8'));
const taglineData = JSON.parse(fs.readFileSync('public/brand/tagline_vector.json', 'utf8'));

// Clean mark forest of the speck at the end
const mark_forest_d = orig.markForest.d.replace(/\s*M\s+631\.926.*$/, '');
const mark_leaf_d = orig.markLeaf.d;
const wm_family_d = wm.wmFamily.d;
const wm_fit_d = wm.wmFit.d;

const sMark = 0.7327;
const sWm = 0.8585;
const wmOffsetX = 516;
const wmOffsetY = 20;
const fitDeltaX = 910;
const fitDeltaY = -1;

const lockupWidth = 1620;
const lockupHeight = 340;
const fullWidth = 1620;
const fullHeight = 440;

const taglineScale = 2.15;
const taglineX = wmOffsetX + 40;
const taglineY = 385;

// 1. Build public/brand/logo-lockup.svg
const logoLockupColor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} ${lockupHeight}" width="${lockupWidth}" height="${lockupHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})">
    <path d="${mark_forest_d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${mark_leaf_d}" fill="#7CB342" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, ${wmOffsetY}) scale(${sWm})">
    <path d="${wm_family_d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${wm_fit_d}" transform="translate(${fitDeltaX}, ${fitDeltaY})" fill="#7CB342" fill-rule="evenodd" />
  </g>
</svg>`;

const logoLockupWhite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} ${lockupHeight}" width="${lockupWidth}" height="${lockupHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})" fill="#FFFFFF">
    <path d="${mark_forest_d}" fill-rule="evenodd" />
    <path d="${mark_leaf_d}" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, ${wmOffsetY}) scale(${sWm})" fill="#FFFFFF">
    <path d="${wm_family_d}" fill-rule="evenodd" />
    <path d="${wm_fit_d}" transform="translate(${fitDeltaX}, ${fitDeltaY})" fill-rule="evenodd" />
  </g>
</svg>`;

// Tagline glyph elements
const taglineGlyphsColor = taglineData.glyphs.map(g => 
  `<path d="${g.d}" transform="translate(${(taglineX + g.x * taglineScale).toFixed(2)}, ${taglineY}) scale(${(g.scale * taglineScale).toFixed(4)}, ${(-g.scale * taglineScale).toFixed(4)})" />`
).join('\n    ');

const logoFullColor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullWidth} ${fullHeight}" width="${fullWidth}" height="${fullHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})">
    <path d="${mark_forest_d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${mark_leaf_d}" fill="#7CB342" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, ${wmOffsetY}) scale(${sWm})">
    <path d="${wm_family_d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${wm_fit_d}" transform="translate(${fitDeltaX}, ${fitDeltaY})" fill="#7CB342" fill-rule="evenodd" />
  </g>
  <!-- Tagline -->
  <g class="ff-tagline" fill="#1A2E22">
    ${taglineGlyphsColor}
  </g>
</svg>`;

const logoFullWhite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullWidth} ${fullHeight}" width="${fullWidth}" height="${fullHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})" fill="#FFFFFF">
    <path d="${mark_forest_d}" fill-rule="evenodd" />
    <path d="${mark_leaf_d}" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, ${wmOffsetY}) scale(${sWm})" fill="#FFFFFF">
    <path d="${wm_family_d}" fill-rule="evenodd" />
    <path d="${wm_fit_d}" transform="translate(${fitDeltaX}, ${fitDeltaY})" fill-rule="evenodd" />
  </g>
  <!-- Tagline -->
  <g class="ff-tagline" fill="#FFFFFF">
    ${taglineGlyphsColor}
  </g>
</svg>`;

// Write SVGs to public/brand
fs.writeFileSync('public/brand/logo-lockup.svg', logoLockupColor);
fs.writeFileSync('public/brand/logo-lockup-white.svg', logoLockupWhite);
fs.writeFileSync('public/brand/logo-full.svg', logoFullColor);
fs.writeFileSync('public/brand/logo-full-white.svg', logoFullWhite);

// Also copy to src/assets/brand if it exists
if (fs.existsSync('src/assets/brand')) {
  fs.writeFileSync('src/assets/brand/logo-lockup.svg', logoLockupColor);
  fs.writeFileSync('src/assets/brand/logo-lockup-white.svg', logoLockupWhite);
  fs.writeFileSync('src/assets/brand/logo-full.svg', logoFullColor);
  fs.writeFileSync('src/assets/brand/logo-full-white.svg', logoFullWhite);
}

// Write src/components/brand/Logo.jsx
const glyphsJson = JSON.stringify(taglineData.glyphs);

const logoJsx = `import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Traced vector paths directly from brand sheet (public/brand/brand-sheet.png)
const PATH_MARK_FOREST = "${mark_forest_d}";
const PATH_MARK_LEAF = "${mark_leaf_d}";
const PATH_WM_FAMILY = "${wm_family_d}";
const PATH_WM_FIT = "${wm_fit_d}";

const TAGLINE_GLYPHS = ${glyphsJson};
const TAGLINE_X = ${taglineX};
const TAGLINE_Y = ${taglineY};
const TAGLINE_SCALE = ${taglineScale};

/**
 * FamilyFit Brand Logo Component
 * @param {{
 *   variant?: 'full' | 'lockup' | 'mark',
 *   tone?: 'color' | 'white',
 *   height?: number | string,
 *   asLink?: boolean,
 *   to?: string,
 *   className?: string,
 *   style?: React.CSSProperties,
 *   showTagline?: boolean
 * }} props
 */
export function Logo({
  variant = 'lockup',
  tone = 'color',
  height = 36,
  asLink = false,
  to,
  className = '',
  style = {},
  showTagline,
}) {
  let user = null
  try {
    const auth = useAuth()
    user = auth?.user
  } catch (e) {
    // Fallback if rendered outside AuthProvider
  }

  const defaultHref = user ? '/dashboard' : '/'
  const targetHref = to || defaultHref

  const numHeight = typeof height === 'number' ? height : parseInt(height, 10) || 36

  // Rules from brand sheet:
  // - Minimum heights: lockup 28px, mark 24px
  // - Tagline only appears on logo-full at 120px height or larger (unless showTagline is forced)
  const effectiveHeight = variant === 'mark' 
    ? Math.max(24, numHeight) 
    : Math.max(28, numHeight)

  const isFullWithTagline = variant === 'full' && (showTagline ?? effectiveHeight >= 120)

  // Color mappings: Forest Green #1F5D3A, Leaf Green #7CB342, White #FFFFFF
  const colorForest = tone === 'white' ? '#FFFFFF' : '#1F5D3A'
  const colorLeaf = tone === 'white' ? '#FFFFFF' : '#7CB342'
  const colorTagline = tone === 'white' ? '#FFFFFF' : '#1A2E22'

  let svgContent = null

  if (variant === 'mark') {
    // Mark only: viewBox 0 0 636 464 (ratio ~ 1.37 : 1)
    const markWidth = Math.round(effectiveHeight * (636 / 464))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 636 464"
        width={markWidth}
        height={effectiveHeight}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none block"
        style={{ height: effectiveHeight, width: 'auto', display: 'block' }}
      >
        <g fill={colorForest}>
          <path d={PATH_MARK_FOREST} fillRule="evenodd" />
        </g>
        <g fill={colorLeaf}>
          <path d={PATH_MARK_LEAF} fillRule="evenodd" />
        </g>
      </svg>
    )
  } else if (isFullWithTagline) {
    // Full with Tagline: viewBox 0 0 ${fullWidth} ${fullHeight} (ratio ~ 3.68 : 1)
    const fullWidthPx = Math.round(effectiveHeight * (${fullWidth} / ${fullHeight}))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${fullWidth} ${fullHeight}"
        width={fullWidthPx}
        height={effectiveHeight}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none block"
        style={{ height: effectiveHeight, width: 'auto', display: 'block' }}
      >
        <g transform="scale(${sMark})">
          <path d={PATH_MARK_FOREST} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_MARK_LEAF} fill={colorLeaf} fillRule="evenodd" />
        </g>
        <g transform="translate(${wmOffsetX}, ${wmOffsetY}) scale(${sWm})">
          <path d={PATH_WM_FAMILY} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_WM_FIT} transform="translate(${fitDeltaX}, ${fitDeltaY})" fill={colorLeaf} fillRule="evenodd" />
        </g>
        <g className="ff-tagline" fill={colorTagline}>
          {TAGLINE_GLYPHS.map((g, i) => (
            <path
              key={i}
              d={g.d}
              transform={\`translate(\${(TAGLINE_X + g.x * TAGLINE_SCALE).toFixed(2)}, \${TAGLINE_Y}) scale(\${(g.scale * TAGLINE_SCALE).toFixed(4)}, \${(-g.scale * TAGLINE_SCALE).toFixed(4)})\`}
            />
          ))}
        </g>
      </svg>
    )
  } else {
    // Lockup (Mark + Wordmark, no tagline): viewBox 0 0 ${lockupWidth} ${lockupHeight} (ratio ~ 4.76 : 1)
    const lockupWidthPx = Math.round(effectiveHeight * (${lockupWidth} / ${lockupHeight}))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${lockupWidth} ${lockupHeight}"
        width={lockupWidthPx}
        height={effectiveHeight}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none block"
        style={{ height: effectiveHeight, width: 'auto', display: 'block' }}
      >
        <g transform="scale(${sMark})">
          <path d={PATH_MARK_FOREST} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_MARK_LEAF} fill={colorLeaf} fillRule="evenodd" />
        </g>
        <g transform="translate(${wmOffsetX}, ${wmOffsetY}) scale(${sWm})">
          <path d={PATH_WM_FAMILY} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_WM_FIT} transform="translate(${fitDeltaX}, ${fitDeltaY})" fill={colorLeaf} fillRule="evenodd" />
        </g>
      </svg>
    )
  }

  if (asLink) {
    return (
      <Link
        to={targetHref}
        aria-label="FamilyFit"
        className={\`inline-flex items-center min-h-[44px] min-w-[44px] p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A] rounded-md transition-opacity hover:opacity-90 \${className}\`}
        style={style}
      >
        {svgContent}
      </Link>
    )
  }

  return (
    <div 
      className={\`inline-flex items-center select-none \${className}\`} 
      style={style}
      aria-label="FamilyFit"
    >
      {svgContent}
    </div>
  )
}

export default Logo;
`;

fs.writeFileSync('src/components/brand/Logo.jsx', logoJsx);
console.log('Successfully updated all SVG files and src/components/brand/Logo.jsx');
