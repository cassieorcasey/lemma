// The Cadence Disk. Grid 1024: diameter luar 720, rongga 360, dinding 180,
// blok aksen 60° (jam 1–3), sudut 16 di setiap potongan, penanda indeks presisi di tepi luar.
function cadenceSVG(o) {
  o = Object.assign({ size: 1024, theme: 'light', bg: true, id: 'c', sweep: 60, start: 30, ticks: true, layer: 'all' }, o);
  const C = 512, RO = 360, RI = 180, K = 16, GAP = 28, TW = 22, TD = 58;
  const P = (a, r) => { const t = (a - 90) * Math.PI / 180; return [C + r * Math.cos(t), C + r * Math.sin(t)]; };
  const f = v => v.toFixed(2);
  // sektor cincin dengan sudut membulat radius K: bentuk diperkecil K lalu diberi stroke 2K bersudut bulat
  function sector(a0, a1) {
    const r2 = RO - K, r1 = RI + K;
    if (a1 - a0 >= 359.9) return '<circle cx="512" cy="512" r="' + ((RO + RI) / 2) + '" fill="none" stroke-width="' + (RO - RI) + '"/>';
    const d2 = Math.asin((GAP / 2 + K) / r2) * 180 / Math.PI, d1 = Math.asin((GAP / 2 + K) / r1) * 180 / Math.PI;
    const b0 = a0 + d2, b1 = a1 - d2, c0 = a0 + d1, c1 = a1 - d1;
    if (b1 <= b0 || c1 <= c0) return '';
    const p = [P(b0, r2), P(b1, r2), P(c1, r1), P(c0, r1)];
    return '<path d="M' + f(p[0][0]) + ' ' + f(p[0][1]) + ' A' + r2 + ' ' + r2 + ' 0 ' + (b1 - b0 > 180 ? 1 : 0) + ' 1 ' + f(p[1][0]) + ' ' + f(p[1][1]) +
      ' L' + f(p[2][0]) + ' ' + f(p[2][1]) + ' A' + r1 + ' ' + r1 + ' 0 ' + (c1 - c0 > 180 ? 1 : 0) + ' 0 ' + f(p[3][0]) + ' ' + f(p[3][1]) + ' Z" stroke-width="' + 2 * K + '" stroke-linejoin="round"/>';
  }
  const T = {
    // Frosted Mineral (terang) dan Deep Slate Glass (gelap)
    light:  { bg: '#DFEAEB', b0: '#81959F', b1: '#52656D', acc: '#243237', acc2: '#3A4F57', shadow: true },
    dark:   { bg: '#141D21', b0: '#35474E', b1: '#243237', acc: '#A5BEC1', acc2: '#DFEAEB', glow: true },
    tinted: { bg: '#333333', b0: '#999999', b1: '#999999', acc: '#FFFFFF', acc2: '#FFFFFF' }   // 20% / 60% / 100%
  }[o.theme];
  const id = o.id, sw = Math.max(0, Math.min(360, o.sweep));
  const full = sw >= 359.9, none = sw < 8;
  const a0 = o.start, a1 = o.start + sw;
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + o.size + '" height="' + o.size + '"><defs>' +
    '<linearGradient id="' + id + 'b" x1="200" y1="160" x2="820" y2="880" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.b0 + '"/><stop offset="1" stop-color="' + T.b1 + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'a" x1="560" y1="150" x2="880" y2="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="' + T.acc2 + '"/><stop offset="1" stop-color="' + T.acc + '"/></linearGradient>' +
    '<filter id="' + id + 's" filterUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><feDropShadow dx="0" dy="14" stdDeviation="20" flood-color="#243237" flood-opacity=".22"/></filter>' +
    '<filter id="' + id + 'g" filterUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><feGaussianBlur stdDeviation="22"/></filter>';
  // penanda indeks: potongan radial di tepi luar, jam 5, 7, 9, 11 (selaras kelipatan 60° dari blok aksen)
  let ticks = '';
  if (o.ticks) [150, 210, 270, 330].forEach(a => { ticks += '<rect x="' + (C - TW / 2) + '" y="' + (C - RO - 2) + '" width="' + TW + '" height="' + (TD + 2) + '" rx="' + (TW / 2) + '" transform="rotate(' + a + ' 512 512)" fill="#000"/>'; });
  s += '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><rect width="1024" height="1024" fill="#fff"/>' + ticks + '</mask></defs>';
  if (o.bg && o.layer !== 'front') s += '<rect width="1024" height="1024" fill="' + T.bg + '"/>';
  if (o.layer === 'back') return s + '</svg>';
  const body = full ? '' : none ? sector(0, 360) : sector(a1, a0 + 360);
  const acc = none ? '' : full ? sector(0, 360) : sector(a0, a1);
  const bodyG = '<g mask="url(#' + id + 'm)" fill="url(#' + id + 'b)" stroke="url(#' + id + 'b)">' + body + '</g>';
  const accG = '<g fill="url(#' + id + 'a)" stroke="url(#' + id + 'a)">' + acc + '</g>';
  if (T.shadow) s += '<g filter="url(#' + id + 's)">' + bodyG + accG + '</g>'; else s += bodyG;
  if (T.glow && acc) s += '<g filter="url(#' + id + 'g)" opacity=".65" fill="' + T.acc + '" stroke="' + T.acc + '">' + acc + '</g>';
  if (!T.shadow) s += accG;
  // rim highlight tipis di tepi luar (mode gelap)
  if (T.glow) s += '<circle cx="512" cy="512" r="' + (RO - 3) + '" fill="none" stroke="#FFFFFF" stroke-opacity=".10" stroke-width="3" mask="url(#' + id + 'm)"/>';
  return s + '</svg>';
}
if (typeof module !== 'undefined') module.exports = cadenceSVG;
