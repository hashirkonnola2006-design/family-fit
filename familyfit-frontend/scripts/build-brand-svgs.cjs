const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

function tracePromise(file, options = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(file, {
      optCurve: true,
      turdSize: 4,
      alphaMax: 1.0,
      optTolerance: 0.2,
      ...options
    }, (err, svg) => {
      if (err) reject(err);
      else {
        // extract viewBox
        const vbMatch = svg.match(/viewBox="([^"]+)"/);
        // extract path d
        const match = svg.match(/<path\s+d="([^"]+)"/);
        resolve({ 
          viewBox: vbMatch ? vbMatch[1] : '', 
          d: match ? match[1] : '' 
        });
      }
    });
  });
}

async function run() {
  console.log('Tracing brand components...');
  const markForest = await tracePromise('public/brand/bw_mark_forest_tight.png');
  const markLeaf = await tracePromise('public/brand/bw_mark_leaf_tight.png');
  const wmFamily = await tracePromise('public/brand/bw_wm_family_tight.png');
  const wmFit = await tracePromise('public/brand/bw_wm_fit_tight.png');
  const tagline = await tracePromise('public/brand/bw_tagline_tight.png');

  console.log('markForest viewBox:', markForest.viewBox, 'd-len:', markForest.d.length);
  console.log('markLeaf viewBox:', markLeaf.viewBox, 'd-len:', markLeaf.d.length);
  console.log('wmFamily viewBox:', wmFamily.viewBox, 'd-len:', wmFamily.d.length);
  console.log('wmFit viewBox:', wmFit.viewBox, 'd-len:', wmFit.d.length);
  console.log('tagline viewBox:', tagline.viewBox, 'd-len:', tagline.d.length);

  fs.writeFileSync('public/brand/paths_extracted.json', JSON.stringify({
    markForest,
    markLeaf,
    wmFamily,
    wmFit,
    tagline
  }, null, 2));

  console.log('Successfully saved public/brand/paths_extracted.json');
}

run().catch(console.error);
