// Bangun ulang ikon dari src/aperture.js:  node src/icons.js
// Menulis src/assets/{fav96.png,touch180.png,fav.svg} (dipakai build.py) dan aset Xcode ke export/AppIcon.appiconset/.
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
const cd = require('./aperture.js');
const A = path.join(__dirname, 'assets'), X = path.join(__dirname, '..', 'export', 'AppIcon.appiconset');
(async () => {
  fs.mkdirSync(X, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage();
  const shot = async (svg, file, size, transparent) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent('<html><body style="margin:0;background:transparent">' + svg.replace(/width="\d+" height="\d+"/, 'width="' + size + '" height="' + size + '"') + '</body></html>');
    await p.screenshot({ path: file, omitBackground: !!transparent, clip: { x: 0, y: 0, width: size, height: size } });
  };
  const strip = s => s.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  const fav = cd({ theme: 'light', id: 'f', bg: false });
  await shot(cd({ theme: 'light', id: 'l' }), path.join(A, 'touch180.png'), 180);
  await shot(fav, path.join(A, 'fav96.png'), 96, true);
  fs.writeFileSync(path.join(A, 'fav.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><style>.d{display:none}@media (prefers-color-scheme:dark){.l{display:none}.d{display:inline}}</style><g class="l">' + strip(fav) + '</g><g class="d">' + strip(cd({ theme: 'dark', id: 'fd', bg: false })) + '</g></svg>');
  await shot(cd({ theme: 'light', id: 'l' }), path.join(X, 'AppIcon-Default.png'), 1024);
  await shot(cd({ theme: 'dark', id: 'd' }), path.join(X, 'AppIcon-Dark.png'), 1024);
  await shot(cd({ theme: 'tinted', id: 'tb', layer: 'back' }), path.join(X, 'AppIcon-Tinted-Back.png'), 1024);
  await shot(cd({ theme: 'tinted', id: 'tf', bg: false }), path.join(X, 'AppIcon-Tinted-Front.png'), 1024, true);
  fs.writeFileSync(path.join(X, 'Contents.json'), JSON.stringify({ images: [
    { filename: 'AppIcon-Default.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
    { appearances: [{ appearance: 'luminosity', value: 'dark' }], filename: 'AppIcon-Dark.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
    { appearances: [{ appearance: 'luminosity', value: 'tinted' }], filename: 'AppIcon-Tinted-Front.png', idiom: 'universal', platform: 'ios', size: '1024x1024' }
  ], info: { author: 'xcode', version: 1 } }, null, 2));
  await b.close();
  console.log('Ikon diperbarui di src/assets dan export/AppIcon.appiconset');
})();
