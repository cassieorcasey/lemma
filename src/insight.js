// The Folded Insight. Grid 1024: lembar catatan 580 × 740 (X 222–802, Y 142–882) bersudut 56,
// lipatan sudut kanan atas 200 × 200 dengan sudut dalam 24, dan percikan empat sisi 224 × 224 di (502, 548).
// Warna dari palet Frosted Mineral: Deep Slate #243237, Steel Blue #81959F, Icy Pearl #DFEAEB, Frost Veil #F4F8F9.
function insightSVG(o) {
  o = Object.assign({ size: 1024, theme: 'light', bg: true, id: 'in', layer: 'all' }, o);
  const T = {
    light:  { bg: '#DFEAEB', s0: '#81959F', s1: '#52656D', f0: '#3A4F57', f1: '#243237', k0: '#F4F8F9', k1: '#DFEAEB', shadow: 'rgba(36,50,55,0.18)' },
    // Ikon iOS bertint: 20% latar, 60% lembar, lipatan lebih gelap, 100% percikan
    tinted: { bg: '#333333', s0: '#999999', s1: '#999999', f0: '#666666', f1: '#666666', k0: '#FFFFFF', k1: '#FFFFFF' }
  }[o.theme];
  const id = o.id;
  const SHEET = 'M278 142 L602 142 L802 342 L802 826 A56 56 0 0 1 746 882 L278 882 A56 56 0 0 1 222 826 L222 198 A56 56 0 0 1 278 142 Z';
  const FOLD = 'M602 142 L802 342 L626 342 A24 24 0 0 1 602 318 Z';
  const SPARK = 'M502 436 Q526 524 614 548 Q526 572 502 660 Q478 572 390 548 Q478 524 502 436 Z';
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + o.size + '" height="' + o.size + '"><defs>' +
    '<linearGradient id="' + id + 's" x1="220" y1="140" x2="800" y2="880" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.s0 + '"/><stop offset="1" stop-color="' + T.s1 + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'f" x1="600" y1="140" x2="800" y2="340" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.f0 + '"/><stop offset="1" stop-color="' + T.f1 + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'k" x1="390" y1="440" x2="614" y2="660" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.k0 + '"/><stop offset="1" stop-color="' + T.k1 + '"/></linearGradient>';
  if (T.shadow) s += '<filter id="' + id + 'd" filterUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="' + T.shadow + '"/></filter>';
  s += '</defs>';
  if (o.bg && o.layer !== 'front') s += '<rect width="1024" height="1024" fill="' + T.bg + '"/>';
  if (o.layer === 'back') return s + '</svg>';
  s += '<g' + (T.shadow ? ' filter="url(#' + id + 'd)"' : '') + '>' +
    '<path d="' + SHEET + '" fill="url(#' + id + 's)"/>' +                       // lembar catatan
    '<path d="' + FOLD + '" fill="url(#' + id + 'f)"/>' +                        // lipatan sudut: penanda progres
    '<path class="in-spark" d="' + SPARK + '" fill="url(#' + id + 'k)"/>' +      // percikan pemahaman
    '</g>';
  return s + '</svg>';
}
if (typeof module !== 'undefined') module.exports = insightSVG;
