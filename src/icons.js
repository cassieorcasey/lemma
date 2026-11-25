// Bangun ulang ikon dari src/keystone.js:  node src/icons.js
// Menulis src/assets/{fav96.png,touch180.png,fav.svg} (dipakai build.py) dan aset Xcode ke export/AppIcon.appiconset/.
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
const cd = require('./keystone.js');
const A = path.join(__dirname, 'assets'), X = path.join(__dirname, '..', 'export', 'AppIcon.appiconset');
(async () => {
  fs.mkdirSync(X, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage();
  const shot = async (svg, file, size, transparent) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent('<html><body style="margin:0;background:transparent">' + svg.replace(/width="\d+" height="\d+"/, 'width="' + size + '" height="' + size + '"') + '</body></html>');
    await p.screenshot({ path: file, omitBackground: !!transparent, clip: { x: 0, y: 0, width: size, height: size } });
  };
  const fav = cd({ theme: 'light', id: 'f', bg: false, shadow: false });   // favicon: tanpa bayangan agar tepi tajam
  await shot(cd({ theme: 'light', id: 'l' }), path.join(A, 'touch180.png'), 180);
  await shot(cd({ theme: 'light', id: 'f', bg: false, shadow: false }), path.join(A, 'fav96.png'), 96, true);
  fs.writeFileSync(path.join(A, 'fav.svg'), fav);
  await shot(cd({ theme: 'light', id: 'l' }), path.join(X, 'AppIcon-Default.png'), 1024);
  await shot(cd({ theme: 'tinted', id: 'tb', layer: 'back' }), path.join(X, 'AppIcon-Tinted-Back.png'), 1024);
  await shot(cd({ theme: 'tinted', id: 'tf', bg: false }), path.join(X, 'AppIcon-Tinted-Front.png'), 1024, true);
  fs.writeFileSync(path.join(X, 'Contents.json'), JSON.stringify({ images: [
    { filename: 'AppIcon-Default.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
    { appearances: [{ appearance: 'luminosity', value: 'tinted' }], filename: 'AppIcon-Tinted-Front.png', idiom: 'universal', platform: 'ios', size: '1024x1024' }
  ], info: { author: 'xcode', version: 1 } }, null, 2));
  await b.close();
  console.log('Ikon diperbarui di src/assets dan export/AppIcon.appiconset');
})();
