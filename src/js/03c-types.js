/* 03c-types: Renko, Range, Line break, Kagi, Point & figure (selaras dengan sumbu waktu bar sumber) */
var ALT = {};
function altBox() { var a = atrOf(14), v = null, i; for (i = a.length - 1; i >= 0; i--) if (a[i] != null) { v = a[i]; break; } if (!v) v = bars[bars.length - 1].c * 0.005; return Math.max(v, 1e-9); }
function altPush(out, b, o, c, h, l, extra) { var r = { t: b.t, o: o, c: c, h: h == null ? Math.max(o, c) : h, l: l == null ? Math.min(o, c) : l, v: b.v }; if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; }); out.push(r); }
function calcAlt() {
  ALT = {}; if (!bars.length) return;
  var B = altBox(), out, lvl, dir, last, n;
  /* Renko */
  out = []; lvl = bars[0].c; dir = 0; last = { o: lvl, c: lvl };
  bars.forEach(function (b) {
    var c = b.c, was = lvl, wd = dir;
    if (dir >= 0 && c >= lvl + B) { n = Math.floor((c - lvl) / B); last = { o: lvl + (n - 1) * B, c: lvl + n * B }; lvl += n * B; dir = 1; }
    else if (dir <= 0 && c <= lvl - B) { n = Math.floor((lvl - c) / B); last = { o: lvl - (n - 1) * B, c: lvl - n * B }; lvl -= n * B; dir = -1; }
    else if (dir === 1 && c <= lvl - 2 * B) { n = Math.floor((lvl - B - c) / B); last = { o: lvl - B - (n - 1) * B, c: lvl - B - n * B }; lvl = lvl - B - n * B; dir = -1; }
    else if (dir === -1 && c >= lvl + 2 * B) { n = Math.floor((c - lvl - B) / B); last = { o: lvl + B + (n - 1) * B, c: lvl + B + n * B }; lvl = lvl + B + n * B; dir = 1; }
    altPush(out, b, last.o, last.c, null, null, { rep: lvl === was && dir === wd });
  });
  ALT.renko = out;
  /* Range */
  out = []; var ro = null, rh = 0, rl = 0;
  bars.forEach(function (b) {
    if (ro == null) { ro = b.o; rh = b.h; rl = b.l; } else { rh = Math.max(rh, b.h); rl = Math.min(rl, b.l); }
    altPush(out, b, ro, b.c, rh, rl);
    if (rh - rl >= B) { ro = b.c; rh = b.c; rl = b.c; }
  });
  ALT.range = out;
  /* Line break (3 line) */
  out = []; var lines = [{ o: bars[0].o, c: bars[0].c }];
  var nl = 0;
  bars.forEach(function (b, i) {
    nl = lines.length;
    if (i) {
      var L = lines[lines.length - 1], up = L.c >= L.o, rec = lines.slice(-3), hi = Math.max.apply(null, rec.map(function (q) { return Math.max(q.o, q.c); })), lo = Math.min.apply(null, rec.map(function (q) { return Math.min(q.o, q.c); }));
      if (up) { if (b.c > L.c) lines.push({ o: L.c, c: b.c }); else if (b.c < lo) lines.push({ o: L.c, c: b.c }); }
      else { if (b.c < L.c) lines.push({ o: L.c, c: b.c }); else if (b.c > hi) lines.push({ o: L.c, c: b.c }); }
    }
    var Q = lines[lines.length - 1]; altPush(out, b, Q.o, Q.c, null, null, { rep: i > 0 && lines.length === nl });
  });
  ALT.lbreak = out;
  /* Kagi */
  out = []; lvl = bars[0].c; dir = 1; var prev = lvl;
  bars.forEach(function (b) {
    var c = b.c; prev = lvl;
    if (dir > 0) { if (c > lvl) lvl = c; else if (c <= lvl - B) { dir = -1; lvl = c; } }
    else { if (c < lvl) lvl = c; else if (c >= lvl + B) { dir = 1; lvl = c; } }
    altPush(out, b, prev, lvl, Math.max(prev, lvl), Math.min(prev, lvl), { d: dir });
  });
  ALT.kagi = out;
  /* Point & figure (reversal 3 kotak) */
  out = []; lvl = Math.floor(bars[0].c / B) * B; dir = 1;
  bars.forEach(function (b) {
    var c = b.c;
    if (dir > 0) { if (c >= lvl + B) lvl = Math.floor(c / B) * B; else if (c <= lvl - 3 * B) { dir = -1; lvl = Math.floor(c / B) * B; } }
    else { if (c <= lvl - B) lvl = Math.floor(c / B) * B; else if (c >= lvl + 3 * B) { dir = 1; lvl = Math.floor(c / B) * B; } }
    altPush(out, b, lvl, lvl, lvl + B, lvl, { d: dir });
  });
  ALT.pnf = out;
}
function altSrc(t) { return ALT[t] && ALT[t].length === bars.length ? ALT[t] : null; }
