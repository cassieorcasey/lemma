# Lemma

> **In English:** A notebook for recording what I understood after studying, with an optional timer. Static web app that syncs across devices through Supabase. The rest of this page is in Indonesian.

Catatan hasil belajar. Setelah belajar, catat apa yang kamu pahami: topik, jenis hasil (Bab selesai, Rangkuman, Latihan soal, Paham konsep), dan satu kalimat. Layar Progres menampilkan linimasa hasil per topik tanpa total jam atau target.

Timer (Stopwatch, Countdown, Break) tetap ada sebagai alat opsional lewat ikon di navigasi. Setelah sesi belajar berhenti, Lemma menawarkan mencatat hasilnya dengan topik dan menit terisi. Statistik jam belajar tetap tersedia sebagai layar sekunder. Data tersimpan di perangkat dan tersinkron antar perangkat lewat Supabase.

Aplikasi: https://cassieorcasey.github.io/lemma/

## Struktur

| Lokasi | Isi |
|---|---|
| `src/template.html` | Sumber aplikasi: CSS, HTML, dan JavaScript. **Sunting di sini.** |
| `src/keystone.js` | Generator logo The Keystone Notch (SVG), dipakai di aplikasi dan untuk ikon |
| `src/icons.js` | Membuat ulang ikon dari `keystone.js` |
| `src/assets/` | Ikon yang disisipkan ke aplikasi saat build |
| `build.py` | Menggabungkan `src/` menjadi `index.html` |
| `index.html` | Hasil build yang dibuka GitHub Pages. **Jangan disunting langsung.** |
| `supabase/notes.sql` | Tabel `notes` untuk catatan hasil. Jalankan sekali di SQL Editor Supabase |
| `tests/` | Uji Playwright, dengan Supabase tiruan (`mock-sb.js`) |

## Perintah

```bash
npm install                      # sekali, memasang Playwright
npx playwright install chromium  # sekali, memasang browser uji

npm run build   # src/ → index.html
npm test        # build lalu jalankan semua uji
npm run icons   # buat ulang ikon dari src/keystone.js, lalu build
```

Setiap push menjalankan uji di GitHub Actions. Uji juga memeriksa bahwa `index.html` sudah dibangun ulang dari `src/`.

## Arsitektur (di dalam `src/template.html`)

| Module | Tanggung jawab | Interface |
|---|---|---|
| **Hari** | Memecah Sesi per hari (zona Asia/Bangkok, jam pergantian hari) | `dayKey`, `perDay`, `split` |
| **Catatan** | Catatan hasil dan menit dari timer yang belum dicatat (`S.drafts`) | `add`, `remove`, `onDay`, `draft`, `addDraft`, `dropDraft` |
| **Kategori** | Kategori aktif dan yang sudah dihapus (tetap dihitung di statistik) | `find`, `group`, `label`, `remove`, `remember` |
| **Timer** | Satu-satunya pemilik Sesi aktif: mode, jeda, Countdown, pindah topik | `toggle`, `reset`, `setMode`, `setCountdown`, `switchTo`, `cut`, `stoppedBy`, `tick`, `state`, `on` |
| **Sync** | Sinkron Supabase (termasuk tabel `notes`; bila tabel itu belum ada, catatan tetap tersimpan lokal), dipasang lewat seam `sync` (adapter offline bila belum terpasang) | `changed`, `started`, `ended`, `beforeStart`, `notice`, `remote`, `device` |

Layar: Catat (`#catat`, layar pertama), Progres (`#progres`), Timer (`#timer`), Statistik (`#statistik`), Pengaturan (`#pengaturan`). Tampilan (`renderLog`, `renderProg`, `renderTimerCard`, `renderToday`, `renderStats`) hanya membaca keadaan dan mendengarkan `Timer.on(...)`. Daftar yang berisi tombol memakai `keyed(...)` agar tidak dibangun ulang di tengah klik. `window.StudyO` membuka module inti untuk `tests/timer.js`. Uji mesin timer membuka `index.html#timer`; `tests/catat.js` menguji layar Catat dan Progres.

## Alur mengubah aplikasi

1. Sunting `src/template.html` (atau `src/keystone.js` untuk logo).
2. `npm test`. Semua uji harus lolos.
3. Commit `src/` dan `index.html` bersamaan, lalu push.

Kalau skema database berubah, jalankan SQL-nya di Supabase sebelum push.
