/* 07b-profiles: Volume footprint, Time price opportunity (TPO), Session volume profile (SVP). Dihitung dari OHLCV (tanpa data tick) */
function profTick(lo, hi, rows) { return niceStep(Math.max(hi - lo, 1e-9) / rows); }
function profDist(b, tick) {
  /* sebar volume bar ke baris harga: gaussian di sekitar close */
  var r0 = Math.floor(b.l / tick), r1 = Math.max(r0, Math.ceil(b.h / tick) - 1), out = [], sum = 0, k, rg = Math.max(b.h - b.l, tick), sg = rg * 0.38;
  for (k = r0; k <= r1; k++) { var p = (k + 0.5) * tick, w = Math.exp(-Math.pow((p - b.c) / sg, 2)) + 0.12; out.push({ k: k, p: p, w: w }); sum += w; }
  out.forEach(function (o) { o.v = (b.v || 1) * o.w / sum; }); return out;
}
function profSessions(src) {
  var key = function (t) { return S.tf.s < 86400 ? Math.floor(t / 86400) : S.tf.s < 604800 ? Math.floor(t / 604800) : Math.floor(t / 2592000); }, out = [], cur = null, i;
  for (i = 0; i < src.length; i++) { var kk = key(src[i].t); if (!cur || cur.k !== kk) { cur = { k: kk, i0: i, i1: i }; out.push(cur); } else cur.i1 = i; }
  return out;
}
function drawFootprint(src, C) {
  var iL = G.iL, iR = G.iR, bw = G.bw, i, rg = 0, n = 0;
  for (i = iL; i <= iR; i++) { rg += src[i].h - src[i].l; n++; } var tick = profTick(0, rg / Math.max(n, 1), 6), rnd = seededRnd("fp"), mx = 0, cache = [];
  for (i = iL; i <= iR; i++) { var d = profDist(src[i], tick); cache.push(d); d.forEach(function (o) { if (o.v > mx) mx = o.v; }); }
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "9px " + css("--font-mono");
  for (i = iL; i <= iR; i++) {
    var b = src[i], x = G.X(i), rows = cache[i - iL], up = b.c >= b.o, cw = Math.max(1.5, bw * 0.92), poc = rows.reduce(function (m, o) { return o.v > m.v ? o : m; }, rows[0]);
    rows.forEach(function (o) {
      var y0 = G.Yp(o.p + tick / 2), y1 = G.Yp(o.p - tick / 2), hgt = Math.abs(y1 - y0), top = Math.min(y0, y1), ask = Math.max(0.1, Math.min(0.9, 0.5 + (b.c - b.o) / Math.max(b.h - b.l, tick) * 0.22 + (rnd() - 0.5) * 0.3)), a = o.v * ask, bd = o.v * (1 - ask), heat = Math.min(1, o.v / mx);
      ctx.globalAlpha = 0.18 + heat * 0.5; ctx.fillStyle = a >= bd ? C.up : C.down; ctx.fillRect(x - cw / 2, top, cw, Math.max(1, hgt - 0.5)); ctx.globalAlpha = 1;
      if (o === poc) { ctx.strokeStyle = "#ff9800"; ctx.strokeRect(x - cw / 2 + 0.5, top + 0.5, cw - 1, Math.max(1, hgt - 1.5)); }
      if (bw >= 38 && hgt >= 10) { ctx.fillStyle = C.text || "#d1d4dc"; ctx.fillText(Math.round(bd) + " x " + Math.round(a), x, top + hgt / 2); }
    });
    ctx.strokeStyle = up ? C.up : C.down; ctx.beginPath(); ctx.moveTo(x, G.Yp(b.h)); ctx.lineTo(x, G.Yp(b.l)); ctx.stroke();
  }
}
function drawSVP(src, C) {
  var ss = profSessions(src); ctx.lineWidth = 1;
  ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.7; ctx.beginPath(); var st = false, i; for (i = G.iL; i <= G.iR; i++) { var px = G.X(i), py = G.Yp(src[i].c); if (!st) { ctx.moveTo(px, py); st = true; } else ctx.lineTo(px, py); } ctx.stroke(); ctx.globalAlpha = 1;
  ss.forEach(function (s) {
    if (s.i1 < G.iL || s.i0 > G.iR) return; var hi = -Infinity, lo = Infinity, j; for (j = s.i0; j <= s.i1; j++) { if (src[j].h > hi) hi = src[j].h; if (src[j].l < lo) lo = src[j].l; }
    var tick = profTick(lo, hi, 36), rows = {}, mx = 0, tot = 0, poc = null; for (j = s.i0; j <= s.i1; j++) profDist(src[j], tick).forEach(function (o) { rows[o.k] = (rows[o.k] || 0) + o.v; tot += o.v; });
    Object.keys(rows).forEach(function (k) { if (rows[k] > mx) { mx = rows[k]; poc = +k; } });
    var ks = Object.keys(rows).map(Number).sort(function (a, b) { return a - b; }), vaLo = poc, vaHi = poc, acc = rows[poc];
    while (acc < tot * 0.7 && (vaLo > ks[0] || vaHi < ks[ks.length - 1])) { var dn = rows[vaLo - 1] || 0, up = rows[vaHi + 1] || 0; if (up >= dn) { vaHi++; acc += up; } else { vaLo--; acc += dn; } }
    var x0 = G.X(s.i0) - G.bw / 2, wMax = Math.min(180, Math.max(40, (G.X(s.i1) - x0) * 0.85));
    ks.forEach(function (k) { var y0 = G.Yp((k + 1) * tick), y1 = G.Yp(k * tick); ctx.globalAlpha = k >= vaLo && k <= vaHi ? 0.5 : 0.22; ctx.fillStyle = k === poc ? "#ff9800" : (k >= vaLo && k <= vaHi ? C.acc : C.muted); ctx.fillRect(x0, Math.min(y0, y1) + 0.5, rows[k] / mx * wMax, Math.max(1, Math.abs(y1 - y0) - 1)); });
    ctx.globalAlpha = 0.8; ctx.strokeStyle = "#ff9800"; ctx.setLineDash([4, 3]); var py2 = G.Yp((poc + 0.5) * tick); ctx.beginPath(); ctx.moveTo(x0, py2); ctx.lineTo(G.X(s.i1) + G.bw / 2, py2); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
  });
}
function drawTPO(src, C) {
  var ss = profSessions(src), L = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = "9px " + css("--font-mono");
  ss.forEach(function (s) {
    if (s.i1 < G.iL || s.i0 > G.iR) return; var hi = -Infinity, lo = Infinity, j; for (j = s.i0; j <= s.i1; j++) { if (src[j].h > hi) hi = src[j].h; if (src[j].l < lo) lo = src[j].l; }
    var tick = profTick(lo, hi, 40), rows = {}, per = S.tf.s <= 1800 ? Math.max(1, Math.round(1800 / S.tf.s)) : 1, mx = 0, poc = null, np = 0;
    for (j = s.i0; j <= s.i1; j++) { var pi = Math.floor((j - s.i0) / per); np = Math.max(np, pi + 1); var r0 = Math.floor(src[j].l / tick), r1 = Math.max(r0, Math.ceil(src[j].h / tick) - 1), k; for (k = r0; k <= r1; k++) { (rows[k] = rows[k] || {})[pi] = 1; } }
    Object.keys(rows).forEach(function (k) { var c = Object.keys(rows[k]).length; if (c > mx) { mx = c; poc = +k; } });
    var x0 = G.X(s.i0) - G.bw / 2, sw = Math.max(20, G.X(s.i1) - x0 + G.bw), cw = Math.min(8, sw / Math.max(mx, 1));
    Object.keys(rows).map(Number).forEach(function (k) {
      var y0 = G.Yp((k + 1) * tick), y1 = G.Yp(k * tick), top = Math.min(y0, y1), hgt = Math.max(2, Math.abs(y1 - y0)), ps = Object.keys(rows[k]).map(Number).sort(function (a, b) { return a - b; });
      if (k === poc) { ctx.globalAlpha = 0.22; ctx.fillStyle = "#ff9800"; ctx.fillRect(x0, top, ps.length * cw + 2, hgt); ctx.globalAlpha = 1; }
      ps.forEach(function (pidx, n) { ctx.fillStyle = k === poc ? "#ff9800" : (pidx % 2 ? C.up : C.down); if (hgt >= 8 && cw >= 5.5) ctx.fillText(L[pidx % L.length], x0 + n * cw + 1, top + hgt / 2); else { ctx.globalAlpha = 0.6; ctx.fillRect(x0 + n * cw, top + 0.5, Math.max(1, cw - 1), Math.max(1, hgt - 1)); ctx.globalAlpha = 1; } });
    });
  });
}

/* util status line / legenda */
function prevDayClose() {
  if (!bars.length) return null; if (S.tf.s >= 86400) return bars.length > 1 ? bars[bars.length - 2].c : null;
  var d0 = tparts(bars[bars.length - 1].t).d, i = bars.length - 1; while (i > 0 && tparts(bars[i].t).d === d0) i--; return i >= 0 && tparts(bars[i].t).d !== d0 ? bars[i].c : null;
}
function dayChgHtml(b, d) { var pc = prevDayClose(); if (pc == null) return ""; var ch = bars[bars.length - 1].c - pc; return "<span>Day<b class=\"" + (ch >= 0 ? "up" : "down") + "\">" + (ch >= 0 ? "+" : "") + fmt(ch, d) + " (" + (ch >= 0 ? "+" : "") + (ch / pc * 100).toFixed(2) + "%)</b></span>"; }
function mktOpen() {
  if (S.sym.cat === "Crypto") return true; var now = new Date(), dw = now.getUTCDay(), h = now.getUTCHours();
  if (S.sym.cat === "Index") return dw >= 1 && dw <= 5 && h >= 13 && h < 21; return !(dw === 6 || (dw === 0 && h < 22) || (dw === 5 && h >= 22));
}
function legName(name) { var n = name; if (S.sty.iInp === false) n = n.replace(/\s[\d.,x ]+$/, ""); return S.sty.iTit === false ? "" : n; }
