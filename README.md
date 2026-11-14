# ChartKu Terminal

Sumber: `src/` (index.html, style.css, js/01..12). Rakitan: `node build.mjs` -> `dist/`.
`dist/` sudah ikut di zip, jadi bisa langsung di-deploy tanpa build.

## Deploy ke Vercel
1. Ekstrak zip, lalu `npx vercel --prod` di folder ini, atau unggah ke GitHub dan impor di vercel.com.
2. Framework preset: **Other**. Build command dan output directory sudah di `vercel.json`.
3. `api/proxy.js` otomatis menjadi fungsi serverless `/api/proxy` (fallback CORS untuk penyedia data; hanya host di allowlist).

## Mengubah kode
Edit file di `src/js/` (urutan nomor = urutan eksekusi; semua bagian digabung kembali ke satu IIFE),
lalu `node build.mjs`. Jangan mengedit `dist/` langsung.

## Catatan
- Layout dan setelan tersimpan di localStorage peramban.
- Lisensi data tiap penyedia (Binance, Coinbase, Kraken, Yahoo, CoinGecko, Upstox) berbeda-beda; periksa sebelum membuka untuk publik.

## Uji end-to-end
`npm i` lalu `npx playwright install chromium`, kemudian `npm run test:e2e`.
Menjalankan `dist/` di Chromium headless dengan semua panggilan data disimulasikan (tanpa jaringan): memuat halaman,
13 jenis chart, 7 timeframe, 12 indikator, drawing + undo/redo, tema, persistensi, watchlist, replay, unduh PNG,
nama aksesibel kontrol, dan mobile 390 px. Screenshot masuk ke `e2e/shots/`.
