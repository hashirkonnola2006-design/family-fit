const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

function tracePromise(file, options = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(file, {
      optCurve: true,
      turdSize: 3,
      alphaMax: 1.0,
      optTolerance: 0.15,
      ...options
    }, (err, svg) => {
      if (err) reject(err);
      else {
        const vbMatch = svg.match(/viewBox="([^"]+)"/);
        const match = svg.match(/<path\s+d="([^"]+)"/);
        resolve({ 
          viewBox: vbMatch ? vbMatch[1] : '', 
          d: match ? match[1] : '' 
        });
      }
    });
  });
}

async function buildLogos() {
  console.log('Tracing clean masks...');
  const markForest = await tracePromise('public/brand/bw_mark_forest_tight.png');
  const markLeaf = await tracePromise('public/brand/bw_mark_leaf_tight.png');
  const wmFamily = await tracePromise('public/brand/bw_family_clean.png');
  const wmFit = await tracePromise('public/brand/bw_fit_clean.png');

  // Load tagline vectors
  const taglineData = JSON.parse(fs.readFileSync('public/brand/tagline_vector.json', 'utf8'));

  // Ensure output directory exists
  const outDir = path.join(__dirname, '../src/assets/brand');
  fs.mkdirSync(outDir, { recursive: true });

  // ─── 1. LOGO-MARK.SVG ──────────────────────────────────────────
  // The mark has viewBox "0 0 636 464" (aspect ~ 1.37 : 1)
  // Let's create logo-mark.svg (color and white)
  const logoMarkColor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 636 464" width="636" height="464" fill="none" aria-label="FamilyFit">
  <g class="ff-mark-forest" fill="#1F5D3A">
    <path d="${markForest.d}" fill-rule="evenodd" />
  </g>
  <g class="ff-mark-leaf" fill="#7CB342">
    <path d="${markLeaf.d}" fill-rule="evenodd" />
  </g>
</svg>`;

  const logoMarkWhite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 636 464" width="636" height="464" fill="none" aria-label="FamilyFit">
  <g class="ff-mark-white" fill="#FFFFFF">
    <path d="${markForest.d}" fill-rule="evenodd" />
    <path d="${markLeaf.d}" fill-rule="evenodd" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(outDir, 'logo-mark.svg'), logoMarkColor);
  fs.writeFileSync(path.join(outDir, 'logo-mark-white.svg'), logoMarkWhite);
  console.log('Saved logo-mark.svg and logo-mark-white.svg');

  // ─── 2. LOGO-LOCKUP.SVG (Mark + Wordmark, no tagline) ───────────
  // We place Mark on the left and Wordmark on the right.
  // In the original sheet, the mark is ~200 tall, wordmark is ~100 tall, vertically centered.
  // In our traced units:
  // mark viewBox: 636 x 464
  // wordmark viewBox: 1272 x 396
  // If we scale the mark to height 340 (scale = 340/464 = 0.7327):
  // mark width = 636 * 0.7327 = 466
  // wordmark height 340 (scale = 340/396 = 0.8585):
  // wordmark width = 1272 * 0.8585 = 1092
  // Total width = mark width (466) + gap (60) + wordmark width (1092) = 1618
  // Total height = 340
  // Mark transform: scale(0.7327)
  // Wordmark transform: translate(526, 0) scale(0.8585)

  const sMark = 0.7327;
  const sWm = 0.8585;
  const wmOffsetX = 516;
  const lockupWidth = 1620;
  const lockupHeight = 340;

  const logoLockupColor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} ${lockupHeight}" width="${lockupWidth}" height="${lockupHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})">
    <path d="${markForest.d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${markLeaf.d}" fill="#7CB342" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, 0) scale(${sWm})">
    <path d="${wmFamily.d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${wmFit.d}" fill="#7CB342" fill-rule="evenodd" />
  </g>
</svg>`;

  const logoLockupWhite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockupWidth} ${lockupHeight}" width="${lockupWidth}" height="${lockupHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})" fill="#FFFFFF">
    <path d="${markForest.d}" fill-rule="evenodd" />
    <path d="${markLeaf.d}" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, 0) scale(${sWm})" fill="#FFFFFF">
    <path d="${wmFamily.d}" fill-rule="evenodd" />
    <path d="${wmFit.d}" fill-rule="evenodd" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(outDir, 'logo-lockup.svg'), logoLockupColor);
  fs.writeFileSync(path.join(outDir, 'logo-lockup-white.svg'), logoLockupWhite);
  console.log('Saved logo-lockup.svg and logo-lockup-white.svg');

  // ─── 3. LOGO-FULL.SVG (Mark + Wordmark + Tagline) ───────────────
  // Wordmark sits on top right, Tagline sits below Wordmark.
  // Total height = 430
  // Tagline width = 453.7. To span across the wordmark (~1000px):
  // scale tagline by ~2.1 -> width ~950px
  // Tagline Y offset = 390
  const fullWidth = 1620;
  const fullHeight = 440;
  const taglineScale = 2.15;
  const taglineX = wmOffsetX + 40;
  const taglineY = 385;

  const taglinePathsColor = taglineData.glyphs.map(g => 
    `<path d="${g.d}" transform="translate(${taglineX + g.x * taglineScale}, ${taglineY}) scale(${g.scale * taglineScale}, ${-g.scale * taglineScale})" fill="#1A2E22" />`
  ).join('\n    ');

  const taglinePathsWhite = taglineData.glyphs.map(g => 
    `<path d="${g.d}" transform="translate(${taglineX + g.x * taglineScale}, ${taglineY}) scale(${g.scale * taglineScale}, ${-g.scale * taglineScale})" fill="#FFFFFF" />`
  ).join('\n    ');

  const logoFullColor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullWidth} ${fullHeight}" width="${fullWidth}" height="${fullHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})">
    <path d="${markForest.d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${markLeaf.d}" fill="#7CB342" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, 0) scale(${sWm})">
    <path d="${wmFamily.d}" fill="#1F5D3A" fill-rule="evenodd" />
    <path d="${wmFit.d}" fill="#7CB342" fill-rule="evenodd" />
  </g>
  <!-- Tagline: "Healthy Families • Happier Lives" -->
  <g class="ff-tagline">
    ${taglinePathsColor}
  </g>
</svg>`;

  const logoFullWhite = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullWidth} ${fullHeight}" width="${fullWidth}" height="${fullHeight}" fill="none" aria-label="FamilyFit">
  <!-- Mark -->
  <g transform="scale(${sMark})" fill="#FFFFFF">
    <path d="${markForest.d}" fill-rule="evenodd" />
    <path d="${markLeaf.d}" fill-rule="evenodd" />
  </g>
  <!-- Wordmark -->
  <g transform="translate(${wmOffsetX}, 0) scale(${sWm})" fill="#FFFFFF">
    <path d="${wmFamily.d}" fill-rule="evenodd" />
    <path d="${wmFit.d}" fill-rule="evenodd" />
  </g>
  <!-- Tagline -->
  <g class="ff-tagline">
    ${taglinePathsWhite}
  </g>
</svg>`;

  fs.writeFileSync(path.join(outDir, 'logo-full.svg'), logoFullColor);
  fs.writeFileSync(path.join(outDir, 'logo-full-white.svg'), logoFullWhite);
  console.log('Saved logo-full.svg and logo-full-white.svg');
}

buildLogos().catch(console.error);
