const potrace = require('potrace');
const fs = require('fs');

function trace(file, opts = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(file, {
      optCurve: true,
      turdSize: 4,
      alphaMax: 1.0,
      optTolerance: 0.2,
      ...opts
    }, (err, svg) => {
      if (err) return reject(err);
      const vbMatch = svg.match(/viewBox="([^"]+)"/);
      const match = svg.match(/<path\s+d="([^"]+)"/);
      resolve({
        viewBox: vbMatch ? vbMatch[1] : '',
        d: match ? match[1] : ''
      });
    });
  });
}

async function main() {
  console.log('Tracing clean wordmarks...');
  const wmFamily = await trace('public/brand/clean_wm_family.png');
  const wmFit = await trace('public/brand/clean_wm_fit.png');

  console.log('wmFamily viewBox:', wmFamily.viewBox, 'length:', wmFamily.d.length);
  console.log('wmFit viewBox:', wmFit.viewBox, 'length:', wmFit.d.length);

  fs.writeFileSync('public/brand/clean_wm_traced.json', JSON.stringify({
    wmFamily,
    wmFit
  }, null, 2));

  console.log('Saved public/brand/clean_wm_traced.json');
}

main().catch(console.error);
