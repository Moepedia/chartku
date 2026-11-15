/* 05-render-core: canvas, geometri, seri utama */
/* ---------- canvas + geometry ---------- */
var wrap = $("#wrap"), cv = $("#cv"), ctx = cv.getContext("2d");
var W = 300, H = 300, dpr = 1, G = {};
function resize() {
  var rc = wrap.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  W = Math.max(200, Math.floor(rc.width)); H = Math.max(200, Math.floor(rc.height));
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
  draw();
}
function colors() {
  var o = {}; ["bg:--chart-bg", "grid:--grid", "ink:--ink", "muted:--muted", "up:--up", "down:--down", "acc:--accent", "line:--line", "tag:--tag", "tagInk:--tag-ink",
    "i1:--i1", "i2:--i2", "i3:--i3", "i4:--i4", "c1:--c1", "c2:--c2", "c3:--c3"].forEach(function (p) { var a = p.split(":"); o[a[0]] = css(a[1]); });
  if (S.colOv) Object.keys(S.colOv).forEach(function (k) { o[k] = S.colOv[k]; });
  return o;
}
function niceStep(raw) { var e = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / e; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * e; }
function curPrice() { return S.replay.on && bars[S.replay.idx] ? bars[S.replay.idx].c : live[S.sym.id]; }

function geom() {
  var n = bars.length, nv = S.replay.on && !S.replay.pick ? Math.min(n, S.replay.idx + 1) : n, bw = S.barW;
  var pw = W - R, ph = H - B, subs = [];
  if (S.ind.rsi) subs.push("rsi"); if (S.ind.macd) subs.push("macd"); if (S.ind.stoch) subs.push("stoch"); if (S.ind.atr) subs.push("atr"); if (S.ind.adx) subs.push("adx"); S.cmpP.forEach(function (id, ci) { subs.push("cmp" + ci); });
  xPanes().forEach(function (x) { subs.push("x:" + x.u); });
  if (pineOut && !pineOut.error && !pineOut.overlay && (pineOut.plots.length || pineOut.hlines.length)) subs.push("pine");
  var subH = subs.length ? Math.max(60, Math.min(150, ph * 0.2, ph * 0.55 / subs.length)) : 0, mainH = ph - subs.length * subH;
  var vis = pw / bw;
  S.off = Math.max(-(nv - 1) + vis * 0.3, Math.min(vis * 0.7, S.off));
  var X = function (fi) { return pw - (nv - 1 - fi + S.off) * bw - bw / 2; };
  var fiAtX = function (x) { return nv - 1 + S.off - (pw - bw / 2 - x) / bw; };
  var iL = Math.max(0, Math.floor(fiAtX(0)) - 1), iR = Math.min(nv - 1, Math.ceil(fiAtX(pw)));
  if (iL > iR) iL = iR;
  var src = S.type === "ha" ? ha : (altSrc(S.type) || bars), mode = cmpData.length ? "pct" : S.scale, ref0 = src[iL].c;
  var vOf = function (p, rf) { return mode === "log" ? Math.log(p) : mode === "pct" ? (p / rf - 1) * 100 : p; };
  var vm = function (p) { return vOf(p, ref0); };
  var lineish = ["line", "linem", "step", "area", "baseline"].indexOf(S.type) >= 0, lo = Infinity, hi = -Infinity, i;
  for (i = iL; i <= iR; i++) {
    var b = src[i], a = vm(lineish ? b.c : b.l), z = vm(lineish ? b.c : b.h);
    if (a < lo) lo = a; if (z > hi) hi = z;
    var arr = [];
    if (S.ind.sma) arr.push(ind.sma[i]); if (S.ind.ema) arr.push(ind.ema[i]); if (S.ind.vwap) arr.push(ind.vwap[i]);
    if (S.ind.bb) { arr.push(ind.bbU[i]); arr.push(ind.bbL[i]); }
    if (S.ind.st) arr.push(ind.st[i]); if (S.ind.ichi) { arr.push(ind.spA[i]); arr.push(ind.spB[i]); arr.push(ind.tenkan[i]); arr.push(ind.kijun[i]); }
    xOverlayVals(i, arr);
    arr.forEach(function (v) { if (v != null) { var q = vm(v); if (q < lo) lo = q; if (q > hi) hi = q; } });
    cmpData.forEach(function (c) { var cb = c.bars[i]; if (cb) { var q = vOf(cb.c, c.bars[iL].c); if (q < lo) lo = q; if (q > hi) hi = q; } });
  }
  if (!isFinite(lo)) { lo = vm(src[nv - 1].l); hi = vm(src[nv - 1].h); }
  var pad = (hi - lo) * 0.08 || Math.abs(hi) * 0.001 || 1; lo -= pad; hi += pad * 1.2;
  if (S.yMan) { var mid = (lo + hi) / 2 + S.yShift * (hi - lo), half = (hi - lo) / 2 * S.yScale; lo = mid - half; hi = mid + half; }
  if (S.lockScale) {
    if (!S.lockR || S.lockR.mode !== mode) S.lockR = { mode: mode, lo: lo, hi: hi };
    lo = S.lockR.lo; hi = S.lockR.hi;
  } else S.lockR = null;
  var priceH = (S.ind.vol ? (mainH - T) * 0.82 : mainH - T - 4);
  var Y = S.invert ? function (v) { return T + (v - lo) / (hi - lo) * priceH; } : function (v) { return T + (hi - v) / (hi - lo) * priceH; };
  G = { n: n, nv: nv, bw: bw, pw: pw, ph: ph, subs: subs, subH: subH, mainH: mainH, X: X, fiAtX: fiAtX, iL: iL, iR: iR, src: src, mode: mode, ref0: ref0, vm: vm, vOf: vOf,
    lo: lo, hi: hi, priceH: priceH, Y: Y, lineish: lineish, panes: [], tags: [] };
  G.Yp = function (p) { return Y(vm(p)); };
  G.Pinv = function (y) { var v = S.invert ? lo + (y - T) / priceH * (hi - lo) : hi - (y - T) / priceH * (hi - lo); return mode === "log" ? Math.exp(v) : mode === "pct" ? ref0 * (1 + v / 100) : v; };
  return G;
}

/* ---------- main pane series + indicators ---------- */
function drawMain(C) {
  var pw = G.pw, mainH = G.mainH, dec = S.sym.dec, bw = G.bw, X = G.X, Y = G.Y, i, b, k;
  var ticks = [], lastLabelX = -1e9;
  if (G.mode === "pct") {
    var st = niceStep((G.hi - G.lo) / 6), v;
    for (v = Math.ceil(G.lo / st) * st; v < G.hi; v += st) ticks.push({ y: Y(v), label: (v >= 0 ? "+" : "") + v.toFixed(2) + "%" });
  } else {
    var loP = G.Pinv(T + G.priceH), hiP = G.Pinv(T), step = niceStep((hiP - loP) / 6), p;
    for (p = Math.ceil(loP / step) * step; p < hiP; p += step) ticks.push({ y: G.Yp(p), label: fmt(p, dec) });
  }
  G.ticks = ticks;

  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pw, G.ph); ctx.clip();
  ctx.lineWidth = 1;
  if (S.grid && S.sty.gh !== false) {
    ctx.strokeStyle = C.grid;
    ticks.forEach(function (t) { var y = Math.round(t.y) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); });
  }
  var kk = Math.max(1, Math.ceil(96 / bw)); G.tlabels = [];
  for (i = G.iL; i <= G.iR; i++) {
    if (i % kk === 0) {
      var gx = Math.round(X(i)) + 0.5;
      if (S.grid && S.sty.gv !== false) { ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, G.ph); ctx.stroke(); }
      G.tlabels.push([gx, axisTime(bars[i].t, i - kk >= 0 ? bars[i - kk].t : null)]);
    }
  }

  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pw, mainH); ctx.clip();
  if (S.ind.vol && !S.ihide.vol) {
    var vmax = 1, volH = (mainH - T) * 0.16, volTop = mainH - volH;
    for (i = G.iL; i <= G.iR; i++) if (bars[i].v > vmax) vmax = bars[i].v;
    ctx.globalAlpha = 0.38;
    for (i = G.iL; i <= G.iR; i++) {
      b = bars[i]; var vh = b.v / vmax * volH, vw = Math.max(1, bw * 0.7);
      ctx.fillStyle = b.c >= b.o ? C.up : C.down; ctx.fillRect(X(i) - vw / 2, volTop + volH - vh, vw, vh);
    }
    ctx.globalAlpha = 1;
  }
  if (S.ind.bb) {
    ctx.beginPath(); var st2 = false;
    for (i = G.iL; i <= G.iR; i++) if (ind.bbU[i] != null) { var yu = G.Yp(ind.bbU[i]); if (!st2) { ctx.moveTo(X(i), yu); st2 = true; } else ctx.lineTo(X(i), yu); }
    for (i = G.iR; i >= G.iL; i--) if (ind.bbL[i] != null) ctx.lineTo(X(i), G.Yp(ind.bbL[i]));
    ctx.closePath(); ctx.globalAlpha = 0.08; ctx.fillStyle = C.i3; ctx.fill(); ctx.globalAlpha = 1;
  }

  var src = G.src, ty = S.type;
  if (ty === "kagi") {
    ctx.lineJoin = "miter"; var kPrev = null;
    for (i = G.iL; i <= G.iR; i++) { b = src[i]; var kx = X(i), ky = G.Yp(b.c); ctx.strokeStyle = b.d > 0 ? C.up : C.down; ctx.lineWidth = b.d > 0 ? 3 : 1.5; ctx.beginPath(); if (kPrev) { ctx.moveTo(kPrev.x, kPrev.y); ctx.lineTo(kx, kPrev.y); ctx.lineTo(kx, ky); } else ctx.moveTo(kx, ky); ctx.stroke(); kPrev = { x: kx, y: ky }; }
    ctx.lineWidth = 1;
  } else if (ty === "pnf") {
    var gs = Math.max(3, Math.min(bw * 0.9, Math.abs(G.Yp(src[G.iL].l) - G.Yp(src[G.iL].h)) * 0.9 || 8));
    ctx.lineWidth = 1.4;
    for (i = G.iL; i <= G.iR; i++) { b = src[i]; var px = X(i), py = (G.Yp(b.l) + G.Yp(b.h)) / 2, hs = gs / 2; ctx.strokeStyle = b.d > 0 ? C.up : C.down; ctx.beginPath(); if (b.d > 0) { ctx.moveTo(px - hs, py - hs); ctx.lineTo(px + hs, py + hs); ctx.moveTo(px + hs, py - hs); ctx.lineTo(px - hs, py + hs); } else ctx.ellipse(px, py, hs, hs, 0, 0, 6.2832); ctx.stroke(); }
    ctx.lineWidth = 1;
  } else if (ty === "candles" || ty === "hollow" || ty === "ha" || ty === "vcandles" || ty === "renko" || ty === "range" || ty === "lbreak") {
    var cw0 = Math.max(1, Math.floor(bw * 0.7)), cw = cw0, vmax = 0;
    if (ty === "vcandles") for (i = G.iL; i <= G.iR; i++) vmax = Math.max(vmax, src[i].v || 0);
    for (i = G.iL; i <= G.iR; i++) {
      b = src[i]; if (b.rep) continue; if (ty === "vcandles") cw = Math.max(1, Math.floor(bw * (0.2 + 0.75 * (vmax ? (b.v || 0) / vmax : 1)))); var x = X(i), Q = S.sty, up = Q.pc && i > 0 ? b.c >= src[i - 1].c : b.c >= b.o;
      var bc = up ? (Q.bu || C.up) : (Q.bd || C.down), oc = up ? (Q.ou || C.up) : (Q.od || C.down), wc = up ? (Q.wu || C.up) : (Q.wd || C.down);
      if (Q.wick !== false) { ctx.strokeStyle = wc; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, G.Yp(b.h)); ctx.lineTo(Math.round(x) + 0.5, G.Yp(b.l)); ctx.stroke(); }
      var yt = G.Yp(Math.max(b.o, b.c)), yb = G.Yp(Math.min(b.o, b.c)), hh = Math.max(1, yb - yt);
      if (Q.body !== false) { ctx.fillStyle = (ty === "hollow" && up) ? C.bg : bc; ctx.fillRect(Math.round(x - cw / 2), yt, cw, hh); }
      if ((Q.border !== false && cw > 2) || (ty === "hollow" && up)) { ctx.strokeStyle = oc; ctx.strokeRect(Math.round(x - cw / 2) + 0.5, yt + 0.5, cw - 1, Math.max(0, hh - 1)); }
    }
  } else if (ty === "columns" || ty === "highlow") {
    var cw2 = Math.max(1, Math.floor(bw * 0.7)), bot = T + G.priceH;
    for (i = G.iL; i <= G.iR; i++) {
      b = bars[i]; var xc = X(i), up2 = b.c >= b.o;
      ctx.fillStyle = ty === "highlow" ? C.acc : (up2 ? C.up : C.down);
      var y0 = ty === "highlow" ? G.Yp(b.h) : G.Yp(b.c), y1 = ty === "highlow" ? G.Yp(b.l) : bot;
      ctx.fillRect(Math.round(xc - cw2 / 2), y0, cw2, Math.max(1, y1 - y0));
    }
  } else if (ty === "bars") {
    var tk = Math.max(2, bw * 0.35);
    for (i = G.iL; i <= G.iR; i++) {
      b = bars[i]; var xb = Math.round(X(i)) + 0.5; ctx.strokeStyle = b.c >= b.o ? C.up : C.down;
      ctx.beginPath(); ctx.moveTo(xb, G.Yp(b.h)); ctx.lineTo(xb, G.Yp(b.l));
      ctx.moveTo(xb - tk, G.Yp(b.o)); ctx.lineTo(xb, G.Yp(b.o)); ctx.moveTo(xb, G.Yp(b.c)); ctx.lineTo(xb + tk, G.Yp(b.c)); ctx.stroke();
    }
  } else {
    if (ty === "hlcarea") {
      ctx.beginPath();
      for (i = G.iL; i <= G.iR; i++) { if (i === G.iL) ctx.moveTo(X(i), G.Yp(bars[i].h)); else ctx.lineTo(X(i), G.Yp(bars[i].h)); }
      for (i = G.iR; i >= G.iL; i--) ctx.lineTo(X(i), G.Yp(bars[i].l));
      ctx.closePath(); ctx.globalAlpha = 0.18; ctx.fillStyle = C.acc; ctx.fill(); ctx.globalAlpha = 1;
    }
    if (ty === "baseline") {
      var by = G.Yp(bars[G.iL].c), pth = function () { ctx.beginPath(); for (i = G.iL; i <= G.iR; i++) { var yb2 = G.Yp(bars[i].c); if (i === G.iL) ctx.moveTo(X(i), yb2); else ctx.lineTo(X(i), yb2); } };
      [[T, by, C.up], [by, T + G.priceH, C.down]].forEach(function (z) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, z[0], pw, Math.max(0, z[1] - z[0])); ctx.clip();
        pth(); ctx.strokeStyle = z[2]; ctx.lineWidth = S.sty.lw || 2; ctx.stroke();
        pth(); ctx.lineTo(X(G.iR), by); ctx.lineTo(X(G.iL), by); ctx.closePath(); ctx.globalAlpha = 0.16; ctx.fillStyle = z[2]; ctx.fill(); ctx.restore();
      });
      ctx.setLineDash([3, 3]); ctx.strokeStyle = C.axT || C.acc; ctx.beginPath(); ctx.moveTo(0, Math.round(by) + 0.5); ctx.lineTo(pw, Math.round(by) + 0.5); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
    } else {
    ctx.beginPath();
    for (i = G.iL; i <= G.iR; i++) {
      var yy = G.Yp(bars[i].c);
      if (i === G.iL) ctx.moveTo(X(i), yy);
      else { if (ty === "step") ctx.lineTo(X(i), G.Yp(bars[i - 1].c)); ctx.lineTo(X(i), yy); }
    }
    if (ty === "area") {
      var gr = ctx.createLinearGradient(0, T, 0, T + G.priceH); gr.addColorStop(0, C.acc + "55"); gr.addColorStop(1, C.acc + "00");
      ctx.save(); ctx.lineTo(X(G.iR), T + G.priceH); ctx.lineTo(X(G.iL), T + G.priceH); ctx.closePath(); ctx.fillStyle = gr; ctx.fill(); ctx.restore();
      ctx.beginPath(); for (i = G.iL; i <= G.iR; i++) { var y2 = G.Yp(bars[i].c); if (i === G.iL) ctx.moveTo(X(i), y2); else ctx.lineTo(X(i), y2); }
    }
    ctx.strokeStyle = C.acc; ctx.lineWidth = S.sty.lw || 2; ctx.lineJoin = "round"; ctx.stroke(); ctx.lineWidth = 1;
    if (ty === "linem" && bw > 5) { ctx.fillStyle = C.acc; for (i = G.iL; i <= G.iR; i++) { ctx.beginPath(); ctx.arc(X(i), G.Yp(bars[i].c), 2.5, 0, 6.2832); ctx.fill(); } }
    }
  }

  var LW = 1.5;
  function line(arr, col, dash) {
    ctx.strokeStyle = col; ctx.lineWidth = LW; if (dash) ctx.setLineDash(dash); ctx.beginPath(); var s = false;
    for (var j = G.iL; j <= G.iR; j++) { if (arr[j] == null) continue; var yy2 = G.Yp(arr[j]); if (!s) { ctx.moveTo(X(j), yy2); s = true; } else ctx.lineTo(X(j), yy2); }
    ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
  }
  if (S.ind.sma && !S.ihide.sma) { LW = iw("sma"); line(ind.sma, C.i1); }
  if (S.ind.ema && !S.ihide.ema) { LW = iw("ema"); line(ind.ema, C.i2); }
  if (S.ind.vwap && !S.ihide.vwap) { LW = iw("vwap"); line(ind.vwap, C.i4); }
  if (S.ind.bb && !S.ihide.bb) { LW = iw("bb"); line(ind.bbU, C.i3); line(ind.bbL, C.i3); }
  if (S.ind.ichi && !S.ihide.ichi) {
    for (i = Math.max(0, G.iL); i < G.iR; i++) {
      var qa = ind.spA[i], qb = ind.spB[i], qc = ind.spA[i + 1], qd = ind.spB[i + 1]; if (qa == null || qb == null || qc == null || qd == null) continue;
      ctx.globalAlpha = 0.13; ctx.fillStyle = qa >= qb ? C.up : C.down; ctx.beginPath(); ctx.moveTo(X(i), G.Yp(qa)); ctx.lineTo(X(i + 1), G.Yp(qc)); ctx.lineTo(X(i + 1), G.Yp(qd)); ctx.lineTo(X(i), G.Yp(qb)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    }
    LW = iw("ichi"); line(ind.spA, C.up); line(ind.spB, C.down); line(ind.tenkan, C.i1); line(ind.kijun, C.i3);
  }
  if (S.ind.st && !S.ihide.st) {
    ctx.lineWidth = 2;
    for (i = Math.max(1, G.iL); i <= G.iR; i++) {
      if (ind.st[i] == null || ind.st[i - 1] == null || ind.stDir[i] !== ind.stDir[i - 1]) continue;
      ctx.strokeStyle = ind.stDir[i] === 1 ? C.up : C.down; ctx.beginPath(); ctx.moveTo(X(i - 1), G.Yp(ind.st[i - 1])); ctx.lineTo(X(i), G.Yp(ind.st[i])); ctx.stroke();
    }
    ctx.lineWidth = 1;
  }
  cmpData.forEach(function (c, ci) {
    var rf = c.bars[G.iL] ? c.bars[G.iL].c : 1;
    drawSeries(S.cmpT[c.sym.id] || "line", c.bars, function (p) { return Y(G.vOf(p, rf)); }, C["c" + (ci + 1)], C, T + G.priceH);
  });

  /* last price line */
  var last = bars[G.nv - 1], lcol = last.c >= last.o ? C.up : C.down, ly = G.Yp(last.c);
  if (S.sty.lastLine !== false) { ctx.setLineDash([4, 4]); ctx.strokeStyle = lcol; ctx.beginPath(); ctx.moveTo(0, Math.round(ly) + 0.5); ctx.lineTo(pw, Math.round(ly) + 0.5); ctx.stroke(); ctx.setLineDash([]); }
  if (S.sty.cd) G.tags.push({ y: ly + 17, text: cdText(), bg: lcol, fg: "#ffffff" });
  G.tags.push({ y: ly, text: S.sty.lastLabel === false ? "" : G.mode === "pct" ? ((last.c / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(last.c, dec), bg: lcol, fg: "#ffffff", last: true });

  /* highest / lowest visible price labels (hi/lo markers) */
  if (S.hilo) {
    var hiV = -Infinity, loV = Infinity, hiI = G.iL, loI = G.iL, srcH = G.src;
    for (i = G.iL; i <= G.iR; i++) {
      var hb = srcH[i], hv = G.lineish ? hb.c : hb.h, lv2 = G.lineish ? hb.c : hb.l;
      if (hv > hiV) { hiV = hv; hiI = i; } if (lv2 < loV) { loV = lv2; loI = i; }
    }
    var hl2f = function (v) { return G.mode === "pct" ? ((v / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(v, dec); };
    [[hiV, hiI, "hi"], [loV, loI, "lo"]].forEach(function (e2) {
      var ey = G.Yp(e2[0]), ex = X(e2[1]);
      G.tags.push({ y: ey, text: hl2f(e2[0]), bg: C.muted, fg: C.bg });
      ctx.strokeStyle = C.muted; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, 6.3); ctx.stroke();
      ctx.font = "10px " + css("--font-mono"); ctx.fillStyle = C.muted; ctx.textAlign = e2[2] === "hi" ? "center" : "center"; ctx.textBaseline = e2[2] === "hi" ? "bottom" : "top";
      ctx.fillText(e2[2], Math.max(10, Math.min(pw - 10, ex)), ey + (e2[2] === "hi" ? -5 : 5));
    });
  }

  drawXOverlay(C, function (a, c) { line(a, c); }, function (w) { LW = w; });

  /* Pine Script overlay plots */
  if (pineOut && pineOut.overlay && !pineOut.error) {
    pineOut.hlines.forEach(function (h2) {
      if (h2.value == null) return; var hy = G.Yp(h2.value);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = h2.color; ctx.beginPath(); ctx.moveTo(0, Math.round(hy) + 0.5); ctx.lineTo(pw, Math.round(hy) + 0.5); ctx.stroke(); ctx.setLineDash([]);
      G.tags.push({ y: hy, text: G.mode === "pct" ? ((h2.value / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(h2.value, dec), bg: h2.color, fg: "#ffffff" });
    });
    pineOut.plots.forEach(function (p2) { LW = p2.width; line(p2.data, p2.color); });
    ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillStyle = C.muted;
    ctx.fillText(pineOut.title, 8, T + 2);
    ctx.font = "11px " + css("--font-mono");
  }
  ctx.restore();
  ctx.restore();
}

function drawSeries(t, arr, Yf, col, C, base) {
  var i, bw = Math.max(1, G.bw * 0.7), b, x, y, s0 = false, fx = 0, lx = 0;
  if (t === "candles" || t === "bars") {
    for (i = G.iL; i <= G.iR; i++) {
      b = arr[i]; if (!b) continue; x = G.X(i); ctx.strokeStyle = ctx.fillStyle = b.c >= b.o ? C.up : C.down;
      ctx.beginPath(); ctx.moveTo(x, Yf(b.h)); ctx.lineTo(x, Yf(b.l)); ctx.stroke();
      if (t === "candles") ctx.fillRect(x - bw / 2, Math.min(Yf(b.o), Yf(b.c)), bw, Math.max(1, Math.abs(Yf(b.c) - Yf(b.o))));
      else { ctx.beginPath(); ctx.moveTo(x - bw / 2, Yf(b.o)); ctx.lineTo(x, Yf(b.o)); ctx.moveTo(x, Yf(b.c)); ctx.lineTo(x + bw / 2, Yf(b.c)); ctx.stroke(); }
    }
    return;
  }
  ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath();
  for (i = G.iL; i <= G.iR; i++) { b = arr[i]; if (!b) continue; x = G.X(i); y = Yf(b.c); if (!s0) { ctx.moveTo(x, y); fx = x; s0 = true; } else ctx.lineTo(x, y); lx = x; }
  ctx.stroke(); ctx.lineWidth = 1;
  if (t === "area" && s0) { ctx.lineTo(lx, base); ctx.lineTo(fx, base); ctx.closePath(); ctx.globalAlpha = 0.12; ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = 1; }
}
