import json

with open('public/brand/paths_extracted.json') as f:
    data = json.load(f)

with open('public/brand/tagline_vector.json') as f:
    tagline_data = json.load(f)

mark_forest_d = data['markForest']['d']
mark_leaf_d = data['markLeaf']['d']
wm_family_d = data['wmFamily']['d']
wm_fit_d = data['wmFit']['d']

# Format tagline paths
sMark = 0.7327
sWm = 0.8585
wmOffsetX = 516
taglineScale = 2.15
taglineX = wmOffsetX + 40
taglineY = 385

tagline_color_elements = []
tagline_white_elements = []

for i, g in enumerate(tagline_data['glyphs']):
    tx = taglineX + g['x'] * taglineScale
    sx = g['scale'] * taglineScale
    sy = -g['scale'] * taglineScale
    tagline_color_elements.append(f'        <path key="{i}" d="{g["d"]}" transform="translate({tx:.2f}, {taglineY}) scale({sx:.4f}, {sy:.4f})" fill="#1A2E22" />')
    tagline_white_elements.append(f'        <path key="{i}" d="{g["d"]}" transform="translate({tx:.2f}, {taglineY}) scale({sx:.4f}, {sy:.4f})" fill="#FFFFFF" />')

tagline_color_jsx = "\n".join(tagline_color_elements)
tagline_white_jsx = "\n".join(tagline_white_elements)

logo_jsx = f'''import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Traced vector paths directly from brand sheet (public/brand/brand-sheet.png)
const PATH_MARK_FOREST = "{mark_forest_d}"
const PATH_MARK_LEAF = "{mark_leaf_d}"
const PATH_WM_FAMILY = "{wm_family_d}"
const PATH_WM_FIT = "{wm_fit_d}"

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
export function Logo({{
  variant = 'lockup',
  tone = 'color',
  height = 36,
  asLink = false,
  to,
  className = '',
  style = {{}},
  showTagline,
}}) {{
  // Auth context for default link destination (dashboard if logged in, / if not)
  let user = null
  try {{
    const auth = useAuth()
    user = auth?.user
  }} catch (e) {{
    // Outside AuthProvider fallback
  }}

  const defaultHref = user ? '/dashboard' : '/'
  const targetHref = to || defaultHref

  // Convert numeric height to number for constraint checks
  const numHeight = typeof height === 'number' ? height : parseInt(height, 10) || 36

  // Rules from brand sheet:
  // - Minimum heights: lockup 28px, mark 24px
  // - Tagline only appears on logo-full at 120px height or larger (unless showTagline is explicitly forced)
  const effectiveHeight = variant === 'mark' 
    ? Math.max(24, numHeight) 
    : Math.max(28, numHeight)

  const isFullWithTagline = variant === 'full' && (showTagline ?? effectiveHeight >= 120)

  // Color mappings
  const colorForest = tone === 'white' ? '#FFFFFF' : '#1F5D3A'
  const colorLeaf = tone === 'white' ? '#FFFFFF' : '#7CB342'

  // Render SVG based on variant
  let svgContent = null

  if (variant === 'mark') {{
    // Mark only: viewBox 0 0 636 464 (ratio ~ 1.37 : 1)
    const markWidth = Math.round(effectiveHeight * (636 / 464))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 636 464"
        width={{markWidth}}
        height={{effectiveHeight}}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none"
        style={{{{ height: effectiveHeight, width: 'auto', display: 'block' }}}}
      >
        <g fill={{colorForest}}>
          <path d={{PATH_MARK_FOREST}} fillRule="evenodd" />
        </g>
        <g fill={{colorLeaf}}>
          <path d={{PATH_MARK_LEAF}} fillRule="evenodd" />
        </g>
      </svg>
    )
  }} else if (isFullWithTagline) {{
    // Full with Tagline: viewBox 0 0 1620 440 (ratio ~ 3.68 : 1)
    const fullWidth = Math.round(effectiveHeight * (1620 / 440))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1620 440"
        width={{fullWidth}}
        height={{effectiveHeight}}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none"
        style={{{{ height: effectiveHeight, width: 'auto', display: 'block' }}}}
      >
        <!-- Mark -->
        <g transform="scale(0.7327)">
          <path d={{PATH_MARK_FOREST}} fill={{colorForest}} fillRule="evenodd" />
          <path d={{PATH_MARK_LEAF}} fill={{colorLeaf}} fillRule="evenodd" />
        </g>
        <!-- Wordmark -->
        <g transform="translate(516, 0) scale(0.8585)">
          <path d={{PATH_WM_FAMILY}} fill={{colorForest}} fillRule="evenodd" />
          <path d={{PATH_WM_FIT}} fill={{colorLeaf}} fillRule="evenodd" />
        </g>
        <!-- Tagline: "Healthy Families • Happier Lives" -->
        <g class="ff-tagline">
{tagline_color_jsx if tone == 'color' else tagline_white_jsx}
        </g>
      </svg>
    )
  }} else {{
    // Lockup (Mark + Wordmark, no tagline): viewBox 0 0 1620 340 (ratio ~ 4.76 : 1)
    const lockupWidth = Math.round(effectiveHeight * (1620 / 340))
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1620 340"
        width={{lockupWidth}}
        height={{effectiveHeight}}
        fill="none"
        aria-label="FamilyFit"
        className="shrink-0 select-none"
        style={{{{ height: effectiveHeight, width: 'auto', display: 'block' }}}}
      >
        <!-- Mark -->
        <g transform="scale(0.7327)">
          <path d={{PATH_MARK_FOREST}} fill={{colorForest}} fillRule="evenodd" />
          <path d={{PATH_MARK_LEAF}} fill={{colorLeaf}} fillRule="evenodd" />
        </g>
        <!-- Wordmark -->
        <g transform="translate(516, 0) scale(0.8585)">
          <path d={{PATH_WM_FAMILY}} fill={{colorForest}} fillRule="evenodd" />
          <path d={{PATH_WM_FIT}} fill={{colorLeaf}} fillRule="evenodd" />
        </g>
      </svg>
    )
  }}

  if (asLink) {{
    return (
      <Link
        to={{targetHref}}
        aria-label="FamilyFit"
        className={{`inline-flex items-center min-h-[44px] min-w-[44px] p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5D3A] rounded-md transition-opacity hover:opacity-90 ${{className}}`}}
        style={{style}}
      >
        {{svgContent}}
      </Link>
    )
  }}

  return (
    <div 
      className={{`inline-flex items-center select-none ${{className}}`}} 
      style={{style}}
      aria-label="FamilyFit"
    >
      {{svgContent}}
    </div>
  )
}}

export default Logo
'''

with open('src/components/brand/Logo.jsx', 'w', encoding='utf-8') as f:
    f.write(logo_jsx)

print('Generated src/components/brand/Logo.jsx successfully!')
