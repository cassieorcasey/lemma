"""Bangun index.html (dipakai GitHub Pages) dari src/.

    python3 build.py

Menyisipkan ikon (base64) dan src/aperture.js ke src/template.html.
"""
import base64, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'src'

def data_uri(name, mime='image/png'):
    return 'data:' + mime + ';base64,' + base64.b64encode((SRC / 'assets' / name).read_bytes()).decode()

def build():
    t = (SRC / 'template.html').read_text(encoding='utf-8')
    ap = (SRC / 'aperture.js').read_text(encoding='utf-8')
    ap = ap.replace("if (typeof module !== 'undefined') module.exports = apertureSVG;\n", '').rstrip()
    t = t.replace('  /*{{APERTURE_JS}}*/', '  ' + ap.replace('\n', '\n  '))
    t = (t.replace('{{FAV96}}', data_uri('fav96.png'))
          .replace('{{TOUCH}}', data_uri('touch180.png'))
          .replace('{{FAVSVG}}', data_uri('fav.svg', 'image/svg+xml')))
    left = re.findall(r'\{\{\w+\}\}', t)
    if left:
        raise SystemExit('Penanda belum terisi: ' + ', '.join(sorted(set(left))))
    (ROOT / 'index.html').write_text(t, encoding='utf-8')
    print('index.html dibangun (%d karakter)' % len(t))

if __name__ == '__main__':
    build()
