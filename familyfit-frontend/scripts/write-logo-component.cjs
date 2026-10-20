const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('public/brand/paths_extracted.json', 'utf8'));
const taglineData = JSON.parse(fs.readFileSync('public/brand/tagline_vector.json', 'utf8'));

const mark_forest_d = data.markForest.d;
const mark_leaf_d = data.markLeaf.d;
const wm_family_d = data.wmFamily.d;
const wm_fit_d = data.wmFit.d;

const sMark = 0.7327;
const sWm = 0.8585;
const wmOffsetX = 516;
const taglineScale = 2.15;
const taglineX = wmOffsetX + 40;
const taglineY = 385;

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
    // Full with Tagline: viewBox 0 0 1620 440 (ratio ~ 3.68 : 1)
    const fullWidth = Math.round(effectiveHeight * (1620 / 440))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1620 440"
        width={fullWidth}
        height={effectiveHeight}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none block"
        style={{ height: effectiveHeight, width: 'auto', display: 'block' }}
      >
        <g transform="scale(0.7327)">
          <path d={PATH_MARK_FOREST} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_MARK_LEAF} fill={colorLeaf} fillRule="evenodd" />
        </g>
        <g transform="translate(516, 0) scale(0.8585)">
          <path d={PATH_WM_FAMILY} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_WM_FIT} fill={colorLeaf} fillRule="evenodd" />
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
    // Lockup (Mark + Wordmark, no tagline): viewBox 0 0 1620 340 (ratio ~ 4.76 : 1)
    const lockupWidth = Math.round(effectiveHeight * (1620 / 340))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1620 340"
        width={lockupWidth}
        height={effectiveHeight}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none block"
        style={{ height: effectiveHeight, width: 'auto', display: 'block' }}
      >
        <g transform="scale(0.7327)">
          <path d={PATH_MARK_FOREST} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_MARK_LEAF} fill={colorLeaf} fillRule="evenodd" />
        </g>
        <g transform="translate(516, 0) scale(0.8585)">
          <path d={PATH_WM_FAMILY} fill={colorForest} fillRule="evenodd" />
          <path d={PATH_WM_FIT} fill={colorLeaf} fillRule="evenodd" />
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

fs.writeFileSync(path.join(__dirname, '../src/components/brand/Logo.jsx'), logoJsx);
console.log('Successfully generated src/components/brand/Logo.jsx');
