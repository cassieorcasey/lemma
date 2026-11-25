// The Focus Aperture. Grid 1024: dua bilah bingkai fokus bersimetri putar 180° mengapit satu inti berlian di (512, 512).
// Bilah ±110 + stroke 28 (sudut membulat), inti berdiagonal ±210, celah ±36 antara bilah dan inti, margin aman ±152.
// Warna dari palet 硝子色の街: Deep Slate #243237, Steel Blue #81959F, Sea Glass #A5BEC1, Powder Blue #C7D8DF, Icy Pearl #DFEAEB.
function apertureSVG(o) {
  o = Object.assign({ size: 1024, theme: 'light', bg: true, id: 'ap', layer: 'all' }, o);
  const T = {
    // Frosted Mineral Focus
    light:  { bg: '#DFEAEB', f0: '#81959F', f1: '#52656D', c0: '#3A4F57', c1: '#243237', shadow: 'rgba(36,50,55,0.20)' },
    // Deep Slate Glass: bilah kaca gelap bertepi tipis, inti bercahaya beku
    dark:   { bg: '#141D21', f0: '#35474E', f1: '#243237', c0: '#DFEAEB', c1: '#A5BEC1', rim: 'rgba(255,255,255,0.12)', glow: '#A5BEC1' },
    // Ikon iOS bertint: 20% latar, 60% bingkai, 100% inti
    tinted: { bg: '#333333', f0: '#999999', f1: '#999999', c0: '#FFFFFF', c1: '#FFFFFF' }
  }[o.theme];
  const id = o.id;
  const BLADE_A = 'M512 164 L216 460 L294 538 L512 320 L656 464 L734 386 Z';   // bilah atas: penyaring distraksi
  const BLADE_B = 'M512 860 L808 564 L730 486 L512 704 L368 560 L290 638 Z';   // bilah bawah: penopang fokus
  const CORE = 'M512 414 L610 512 L512 610 L414 512 Z';                        // inti sari: pemahaman yang terkunci
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + o.size + '" height="' + o.size + '"><defs>' +
    '<linearGradient id="' + id + 'f" x1="200" y1="160" x2="820" y2="880" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.f0 + '"/><stop offset="1" stop-color="' + T.f1 + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'c" x1="420" y1="420" x2="604" y2="604" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.c0 + '"/><stop offset="1" stop-color="' + T.c1 + '"/></linearGradient>';
  if (T.shadow) s += '<filter id="' + id + 's" filterUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="' + T.shadow + '"/></filter>';
  if (T.glow) s += '<filter id="' + id + 'g" filterUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><feGaussianBlur stdDeviation="26"/></filter>';
  s += '</defs>';
  if (o.bg && o.layer !== 'front') s += '<rect width="1024" height="1024" fill="' + T.bg + '"/>';
  if (o.layer === 'back') return s + '</svg>';
  const blade = (d, cls) => '<path class="' + cls + '" d="' + d + '" fill="url(#' + id + 'f)" stroke="url(#' + id + 'f)" stroke-width="28" stroke-linejoin="round"/>';
  const core = '<path d="' + CORE + '" fill="url(#' + id + 'c)" stroke="url(#' + id + 'c)" stroke-width="24" stroke-linejoin="round"/>';
  s += '<g' + (T.shadow ? ' filter="url(#' + id + 's)"' : '') + '>' + blade(BLADE_A, 'ap-a') + blade(BLADE_B, 'ap-b');
  // kilau tepi kaca pada bilah (mode gelap)
  if (T.rim) s += '<path class="ap-a" d="' + BLADE_A + '" fill="none" stroke="' + T.rim + '" stroke-width="4" stroke-linejoin="round"/><path class="ap-b" d="' + BLADE_B + '" fill="none" stroke="' + T.rim + '" stroke-width="4" stroke-linejoin="round"/>';
  s += '<g class="ap-core">';
  if (T.glow) s += '<path d="' + CORE + '" fill="' + T.glow + '" stroke="' + T.glow + '" stroke-width="24" stroke-linejoin="round" opacity=".55" filter="url(#' + id + 'g)"/>';
  s += core + '</g></g>';
  return s + '</svg>';
}
if (typeof module !== 'undefined') module.exports = apertureSVG;
