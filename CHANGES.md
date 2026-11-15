# Perubahan (pembaruan paritas TradingView)

- Perbaikan bug: dropdown (timeframe, jenis chart, indikator, layout, pengaturan, popup tanggal) terpotong header; kini `position:fixed`.
- Perbaikan bug: legend tidak ter-update saat indikator terakhir dihapus; dropdown jenis chart kini menutup setelah memilih.
- Dialog Indikator ala TradingView (pencarian, kategori, daftar aktif) dengan 49 indikator baru (src/js/03b-xind.js, 10b-indlg.js).
- Jenis chart baru: Renko, Line break, Kagi, Point & figure, Range (src/js/03c-types.js; selaras dengan sumbu waktu bar sumber).
- 15 drawing tools baru (src/js/08b-toolsx.js).
- Tombol pencarian cepat, label Alert/Replay, tab pengaturan Trading/Alerts/Events.
- Gelombang 2: 19 drawing tools lagi (Schiff/Modified Schiff, Flat top/bottom, Fib channel/arcs/spiral, Gann fan, Cypher, Cyclic lines, Sine line, Anchored VWAP, Fixed range volume profile, Triangle, Rotated rectangle, Note, Price note, Callout, Comment, Pin).
- UI/UX: layout mobile ala TradingView mobile (chart memenuhi layar, toolbar gambar di bawah, dropdown jadi bottom sheet, toolbar drawing melayang satu baris, bar bawah ringkas).
- Rasa pakai drawing: jenis kursor Cross/Dot/Arrow, magnet lemah/kuat (klik berulang pada tombol magnet), shortcut Alt+J (horizontal ray) dan Alt+Shift+R (rectangle).
