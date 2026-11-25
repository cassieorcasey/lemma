// The Keystone Notch. Grid 1024, area aman X 256–768, Y 176–848.
// Pasak kunci (256,176)→(520,176)→(632,488)→(256,488), celah 48 (Y 488–536),
// fondasi (256,536)→(680,536)→(768,848)→(256,848). Sudut luar 56, sudut di tepi celah 20.
// Palet Frosted Mineral: fondasi Deep Slate 135°, pasak Frost Glass 160°, latar Icy Pearl.
function keystoneSVG(o) {
  o = Object.assign({ size: 1024, theme: 'light', bg: true, id: 'ks', layer: 'all', shadow: true }, o);
  const T = {
    light:  { bg: '#DFEAEB', b0: '#3A4F57', b1: '#243237', w0: '#FFFFFF', w1: '#B8CCD1', shadow: 'rgba(36,50,55,0.20)' },
    // Ikon iOS bertint: latar gelap, fondasi abu sedang, pasak putih penuh
    tinted: { bg: '#333333', b0: '#8C8C8C', b1: '#7A7A7A', w0: '#FFFFFF', w1: '#FFFFFF' }
  }[o.theme];
  const id = o.id, sh = o.shadow && T.shadow;
  const WEDGE = 'M256 232 A56 56 0 0 1 312 176 L480.6 176 A56 56 0 0 1 533.3 213.1 L622.4 461.2 A20 20 0 0 1 603.6 488 L276 488 A20 20 0 0 1 256 468 Z';
  const BASE = 'M256 556 A20 20 0 0 1 276 536 L664.9 536 A20 20 0 0 1 684.1 550.6 L747.9 776.8 A56 56 0 0 1 694 848 L312 848 A56 56 0 0 1 256 792 Z';
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + o.size + '" height="' + o.size + '"><defs>' +
    // 135°: kiri atas → kanan bawah bidang fondasi
    '<linearGradient id="' + id + 'b" x1="256" y1="536" x2="768" y2="848" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.b0 + '"/><stop offset="1" stop-color="' + T.b1 + '"/></linearGradient>' +
    // 160°: hampir tegak ke bawah, sedikit ke kanan
    '<linearGradient id="' + id + 'w" x1="390" y1="176" x2="503" y2="488" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.w0 + '"/><stop offset="1" stop-color="' + T.w1 + '"/></linearGradient>';
  if (sh) s += '<filter id="' + id + 'd" filterUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="' + T.shadow + '"/></filter>';
  s += '</defs>';
  if (o.bg && o.layer !== 'front') s += '<rect width="1024" height="1024" fill="' + T.bg + '"/>';
  if (o.layer === 'back') return s + '</svg>';
  const g = sh ? ' filter="url(#' + id + 'd)"' : '';
  s += '<path class="in-base" d="' + BASE + '" fill="url(#' + id + 'b)"' + g + '/>' +   // fondasi teorema: jangkar, tidak bergerak
    '<path class="in-wedge" d="' + WEDGE + '" fill="url(#' + id + 'w)"' + g + '/>';    // pasak kunci
  return s + '</svg>';
}
if (typeof module !== 'undefined') module.exports = keystoneSVG;
