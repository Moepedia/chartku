/* 07-render-panes: sub-pane, sumbu, crosshair, orkestrator */
/* ---------- sub panes ---------- */
function drawSubs(C) {
  var pw = G.pw, X = G.X, i, v;
  G.subs.forEach(function (k, si) {
    var top = G.mainH + si * G.subH, h = G.subH, padT = 18, ih = h - padT - 4, lo, hi;
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(0, top + 0.5); ctx.lineTo(W, top + 0.5); ctx.stroke();
    if (k.indexOf("cmp") === 0) { drawCmpPane(+k.slice(3), top, h, C); return; }
    if (k === "pine") { drawPinePane(top, h, C); return; }
    if (k === "rsi" || k === "stoch") { lo = 0; hi = 100; }
    else if (k === "atr") { var mxa = 1e-9; for (i = G.iL; i <= G.iR; i++) if (ind.atr[i] != null && ind.atr[i] > mxa) mxa = ind.atr[i]; lo = 0; hi = mxa * 1.15; }
    else if (k === "adx") { var mxd = 40; for (i = G.iL; i <= G.iR; i++) [ind.adx[i], ind.pdi[i], ind.mdi[i]].forEach(function (q) { if (q != null && q > mxd) mxd = q; }); lo = 0; hi = mxd * 1.1; }
    else { var m = 1e-9; for (i = G.iL; i <= G.iR; i++) [ind.macd[i], ind.sig[i], ind.hist[i]].forEach(function (q) { if (q != null && Math.abs(q) > m) m = Math.abs(q); }); lo = -m * 1.15; hi = m * 1.15; }
    var Y2 = function (q) { return top + padT + (hi - q) / (hi - lo) * ih; };
    var ticks = k === "rsi" ? [30, 50, 70] : k === "stoch" ? [20, 50, 80] : (function () { var st = niceStep((hi - lo) / 3), o = [], q; for (q = Math.ceil(lo / st) * st; q < hi; q += st) o.push(q); return o; })();
    ctx.save(); ctx.beginPath(); ctx.rect(0, top + 1, pw, h - 1); ctx.clip();
    if (S.grid) { ctx.strokeStyle = C.grid; ticks.forEach(function (t) { var y = Math.round(Y2(t)) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }); }
    if (k === "stoch" || k === "atr" || k === "adx") {
      var sets = k === "stoch" ? [[ind.stK, C.i1], [ind.stD, C.i3]] : k === "atr" ? [[ind.atr, C.i4]] : [[ind.adx, C.i3], [ind.pdi, C.up], [ind.mdi, C.down]];
      if (k === "stoch") { ctx.globalAlpha = 0.07; ctx.fillStyle = C.i1; ctx.fillRect(0, Y2(80), pw, Y2(20) - Y2(80)); ctx.globalAlpha = 1; }
      sets.forEach(function (pr) {
        ctx.strokeStyle = pr[1]; ctx.lineWidth = 1.5; ctx.beginPath(); var st5 = false;
        for (i = G.iL; i <= G.iR; i++) { if (pr[0][i] == null) continue; var y5 = Y2(pr[0][i]); if (!st5) { ctx.moveTo(X(i), y5); st5 = true; } else ctx.lineTo(X(i), y5); }
        ctx.stroke(); ctx.lineWidth = 1;
      });
    } else if (k === "rsi") {
      ctx.globalAlpha = 0.07; ctx.fillStyle = C.i2; ctx.fillRect(0, Y2(70), pw, Y2(30) - Y2(70)); ctx.globalAlpha = 1;
      ctx.strokeStyle = C.i2; ctx.lineWidth = 1.5; ctx.beginPath(); var s = false;
      for (i = G.iL; i <= G.iR; i++) { if (ind.rsi[i] == null) continue; var yy = Y2(ind.rsi[i]); if (!s) { ctx.moveTo(X(i), yy); s = true; } else ctx.lineTo(X(i), yy); }
      ctx.stroke(); ctx.lineWidth = 1;
    } else {
      var zy = Y2(0); ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(0, zy); ctx.lineTo(pw, zy); ctx.stroke(); ctx.globalAlpha = 1;
      for (i = G.iL; i <= G.iR; i++) {
        v = ind.hist[i]; if (v == null) continue; var prev = ind.hist[i - 1];
        ctx.globalAlpha = 0.55; ctx.fillStyle = v >= 0 ? C.up : C.down; var bwid = Math.max(1, G.bw * 0.7);
        ctx.fillRect(X(i) - bwid / 2, Math.min(zy, Y2(v)), bwid, Math.max(1, Math.abs(Y2(v) - zy))); ctx.globalAlpha = 1;
      }
      [[ind.macd, C.i1], [ind.sig, C.i3]].forEach(function (pr) {
        ctx.strokeStyle = pr[1]; ctx.lineWidth = 1.5; ctx.beginPath(); var st = false;
        for (i = G.iL; i <= G.iR; i++) { if (pr[0][i] == null) continue; var y3 = Y2(pr[0][i]); if (!st) { ctx.moveTo(X(i), y3); st = true; } else ctx.lineTo(X(i), y3); }
        ctx.stroke(); ctx.lineWidth = 1;
      });
    }
    ctx.restore();
    G.panes.push({ k: k, top: top, h: h, Y2: Y2, lo: lo, hi: hi, ticks: ticks, padT: padT, ih: ih });
  });
}

function drawCmpPane(ci, top, h, C) {
  var pw = G.pw, padT = 18, ih = h - padT - 4, d = panData[ci], sym = N_(S.cmpP[ci]), col = C["c" + (ci % 3 + 1)], ty = S.cmpT[sym.id] || "line", i, lo = Infinity, hi = -Infinity, lastV = null;
  var ohlc = ty === "candles" || ty === "bars";
  if (d) for (i = G.iL; i <= G.iR; i++) { var cb = d.bars[i]; if (!cb) continue; lastV = cb.c; var a1 = ohlc ? cb.l : cb.c, z1 = ohlc ? cb.h : cb.c; if (a1 < lo) lo = a1; if (z1 > hi) hi = z1; }
  if (!isFinite(lo)) { lo = 0; hi = 1; }
  var pad = (hi - lo) * 0.12 || Math.abs(hi) * 0.001 || 1; lo -= pad; hi += pad;
  var Y2 = function (q) { return top + padT + (hi - q) / (hi - lo) * ih; };
  var st = niceStep((hi - lo) / 3), ticks = [], q;
  for (q = Math.ceil(lo / st) * st; q < hi; q += st) ticks.push(q);
  ctx.save(); ctx.beginPath(); ctx.rect(0, top + 1, pw, h - 1); ctx.clip();
  if (S.grid) { ctx.strokeStyle = C.grid; ticks.forEach(function (t) { var y = Math.round(Y2(t)) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }); }
  if (d) drawSeries(ty, d.bars, Y2, col, C, top + h);
  ctx.restore();
  ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = col;
  ctx.fillText(sym.label + (lastV != null ? "  " + fmt(lastV, sym.dec) : "  loading"), 8, top + 10);
  ctx.font = "11px " + css("--font-mono");
  G.panes.push({ k: "cmp" + ci, top: top, h: h, Y2: Y2, lo: lo, hi: hi, ticks: ticks, padT: padT, ih: ih, dec: sym.dec });
}
function drawPinePane(top, h, C) {
  var pw = G.pw, X = G.X, padT = 18, ih = h - padT - 4, i, lo = Infinity, hi = -Infinity;
  for (i = G.iL; i <= G.iR; i++) pineOut.plots.forEach(function (p) { var v = p.data[i]; if (v != null) { if (v < lo) lo = v; if (v > hi) hi = v; } });
  pineOut.hlines.forEach(function (hl) { if (hl.value != null) { if (hl.value < lo) lo = hl.value; if (hl.value > hi) hi = hl.value; } });
  if (!isFinite(lo)) { lo = 0; hi = 1; }
  var pad = (hi - lo) * 0.12 || Math.abs(hi) * 0.001 || 1; lo -= pad; hi += pad;
  var Y2 = function (q) { return top + padT + (hi - q) / (hi - lo) * ih; };
  var st = niceStep((hi - lo) / 3), ticks = [], q;
  for (q = Math.ceil(lo / st) * st; q < hi; q += st) ticks.push(q);
  ctx.save(); ctx.beginPath(); ctx.rect(0, top + 1, pw, h - 1); ctx.clip();
  if (S.grid) { ctx.strokeStyle = C.grid; ticks.forEach(function (t) { var y = Math.round(Y2(t)) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }); }
  pineOut.hlines.forEach(function (hl) {
    if (hl.value == null) return; var y = Math.round(Y2(hl.value)) + 0.5;
    ctx.setLineDash([5, 4]); ctx.strokeStyle = hl.color; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); ctx.setLineDash([]);
  });
  pineOut.plots.forEach(function (p) {
    ctx.strokeStyle = p.color; ctx.lineWidth = p.width; ctx.beginPath(); var s = false;
    for (i = G.iL; i <= G.iR; i++) { var v = p.data[i]; if (v == null) continue; var y2 = Y2(v); if (!s) { ctx.moveTo(X(i), y2); s = true; } else ctx.lineTo(X(i), y2); }
    ctx.stroke(); ctx.lineWidth = 1;
  });
  ctx.restore();
  ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
  var tx = 8, names = pineOut.plots.map(function (p) { return p.name; }).join("  ·  ");
  ctx.fillStyle = C.muted; ctx.fillText(pineOut.title + (names ? "   " + names : ""), tx, top + 10);
  ctx.font = "11px " + css("--font-mono");
  G.panes.push({ k: "pine", top: top, h: h, Y2: Y2, lo: lo, hi: hi, ticks: ticks, padT: padT, ih: ih, dec: 2 });
}

/* ---------- axes, crosshair, orchestrator ---------- */
function tagBox(text, x, y, w, bg, fg) {
  ctx.fillStyle = bg; ctx.fillRect(x, y - 9, w, 18);
  ctx.fillStyle = fg; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x + 6, y + 0.5);
}
function drawPos(C) {
  var ps = S.acc.pos[S.sym.id]; if (!ps) return;
  var y = G.Yp(ps.avg); if (!(y > T && y < G.mainH)) return;
  var pnl = (curPrice() - ps.avg) * ps.q, col = pnl >= 0 ? C.up : C.down, txt = (ps.q > 0 ? "LONG " : "SHORT ") + Math.abs(ps.q) + "  " + (pnl >= 0 ? "+" : "") + fmt(pnl, 2);
  ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(G.pw, Math.round(y) + 0.5); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = "600 11px " + css("--font-mono"); var w = ctx.measureText(txt).width + 14; ctx.fillStyle = col; ctx.fillRect(10, y - 9, w, 18);
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, 17, y + 0.5); ctx.restore();
  G.tags.push({ y: y, text: fmt(ps.avg, S.sym.dec), bg: col, fg: "#ffffff" });
}
function draw() {
  if (!bars.length || !ctx) return;
  var C = colors(); geom();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  if (S.sty.wm !== false && G.pw > 200) {
    ctx.save(); ctx.globalAlpha = 0.055; ctx.fillStyle = C.muted; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "700 " + Math.max(26, Math.min(64, G.pw / 11)) + "px " + css("--font-body");
    ctx.fillText(S.sym.label, G.pw / 2, T + G.mainH / 2); ctx.restore();
  }
  ctx.font = "11px " + css("--font-mono");
  var pw = G.pw, ph = G.ph, i;
  drawMain(C); drawDrawings(C); drawPos(C); drawSubs(C);
  if (S.replay.on && S.replay.pick) {
    var pi = S.replay.idx, px = Math.round(G.X(pi)) + 0.5;
    if (px < pw) { ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = C.bg; ctx.fillRect(px, 0, pw - px, ph); ctx.restore(); }
    ctx.strokeStyle = C.acc; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, ph); ctx.stroke(); ctx.lineWidth = 1;
    ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
    tagBox("Replay starts here. Tap or drag to move", Math.max(4, Math.min(pw - 176, px - 88)), 16, 172, C.acc, "#ffffff");
  }

  /* axis column + time row */
  ctx.fillStyle = C.bg; ctx.fillRect(pw, 0, R, H); ctx.fillRect(0, ph, W, B);
  ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(pw + 0.5, 0); ctx.lineTo(pw + 0.5, ph + 0.5); ctx.lineTo(0, ph + 0.5); ctx.stroke();
  ctx.font = "11px " + css("--font-mono"); ctx.fillStyle = C.muted; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  G.ticks.forEach(function (t) { if (t.y > T + 4 && t.y < G.mainH - 6) ctx.fillText(t.label, pw + 7, t.y); });
  G.panes.forEach(function (p) {
    ctx.fillStyle = C.muted; ctx.textAlign = "left";
    p.ticks.forEach(function (t) { var y = p.Y2(t); if (y > p.top + 14 && y < p.top + p.h - 4) ctx.fillText(p.dec != null ? fmt(t, p.dec) : p.k === "rsi" ? String(t) : t.toFixed(2), pw + 7, y); });
  });
  ctx.fillStyle = C.muted; ctx.textAlign = "center";
  G.tlabels.forEach(function (t) { if (t[0] > 24 && t[0] < pw - 24) ctx.fillText(t[1], t[0], ph + B / 2 + 1); });
  /* economic / corporate event markers on the time axis */
  if (S.events && evs.length) {
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "600 9px " + css("--font-body");
    evs.forEach(function (ev) {
      var x = G.X(ev.i); if (x < 12 || x > pw - 12) return;
      ctx.fillStyle = ev.imp === "h" ? C.down : ev.imp === "m" ? C.i3 : C.muted;
      ctx.beginPath(); ctx.arc(x, ph + B / 2 + 1, 7, 0, 6.3); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.fillText(ev.code, x, ph + B / 2 + 1.5);
    });
  }
  G.tags.forEach(function (t) { if (t.text) tagBox(t.text, pw + 1, Math.max(T + 9, Math.min(G.mainH - 9, t.y)), R - 1, t.bg, t.fg); });

  /* crosshair */
  var hovIdx = G.nv - 1;
  if (S.cx !== null && S.cx < pw && S.cy !== null && S.cy < ph && !(S.pend && S.pend.down)) {
    var fi = G.fiAtX(S.cx), idx = Math.round(fi); hovIdx = Math.max(0, Math.min(G.nv - 1, idx));
    var sx = Math.round(G.X(idx)) + 0.5;
    ctx.setLineDash(S.sty.cls === 1 ? [] : S.sty.cls === 2 ? [1, 3] : [3, 4]); ctx.strokeStyle = C.cross || C.muted;
    ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, ph); ctx.moveTo(0, Math.round(S.cy) + 0.5); ctx.lineTo(pw, Math.round(S.cy) + 0.5); ctx.stroke(); ctx.setLineDash([]);
    var label = null;
    if (S.cy < G.mainH) { var pr = G.Pinv(S.cy); label = G.mode === "pct" ? ((pr / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(pr, S.sym.dec); }
    else G.panes.forEach(function (p) { if (S.cy >= p.top && S.cy < p.top + p.h) { var vv = p.hi - (S.cy - p.top - p.padT) / p.ih * (p.hi - p.lo); label = p.dec != null ? fmt(vv, p.dec) : vv.toFixed(2); } });
    ctx.font = "11px " + css("--font-mono");
    if (label) tagBox(label, pw + 1, S.cy, R - 1, C.tag, C.tagInk);
    var tl = fullTime(iToT(idx)), tw = ctx.measureText(tl).width + 14, tx = Math.max(0, Math.min(pw - tw, sx - tw / 2));
    ctx.fillStyle = C.tag; ctx.fillRect(tx, ph + 2, tw, 20); ctx.fillStyle = C.tagInk; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tl, tx + 7, ph + 12);
  }
  G.hovIdx = hovIdx; paintReadout(hovIdx, C);
}
var legendHtml = "";
function paintReadout(i, C) {
  var b = bars[i], d = S.sym.dec, up = b.c >= b.o, cls = up ? "up" : "down", ch = b.c - b.o;
  $("#readout").innerHTML = "<span>O<b>" + fmt(b.o, d) + "</b></span><span>H<b>" + fmt(b.h, d) + "</b></span><span>L<b>" + fmt(b.l, d) + "</b></span><span>C<b class=\"" + cls + "\">" + fmt(b.c, d) + "</b></span>" +
    "<span>Chg<b class=\"" + cls + "\">" + (ch >= 0 ? "+" : "") + fmt(ch, d) + " (" + (ch >= 0 ? "+" : "") + (ch / b.o * 100).toFixed(2) + "%)</b></span><span>Vol<b>" + b.v.toLocaleString("en-US") + "</b></span>" +
    "<span class=\"when\">" + S.sym.label + " &middot; " + S.tf.k + " &middot; " + fullTime(b.t) + "</span>";
  var h = "", v = function (a, dd) { return a[i] == null ? "&ndash;" : a[i].toFixed(dd == null ? d : dd); };
  var item = function (col, name, val) { return "<span class=\"chip\" style=\"color:" + col + hidSt(name) + "\">" + name + " <b style=\"font-weight:500\">" + val + "</b><span class=\"lt\">" + ltools(name) + "</span></span>"; };
  if (S.ind.sma) h += item(C.i1, "SMA " + S.len.sma, v(ind.sma)); if (S.ind.ema) h += item(C.i2, "EMA " + S.len.ema, v(ind.ema));
  if (S.ind.bb) h += item(C.i3, "BB", v(ind.bbL) + " / " + v(ind.bbU)); if (S.ind.vwap) h += item(C.i4, "VWAP", v(ind.vwap));
  if (S.ind.rsi) h += item(C.i2, "RSI " + S.len.rsi, v(ind.rsi, 1));
  if (S.ind.stoch) h += item(C.i1, "Stoch " + S.len.stoch, v(ind.stK, 1) + " / " + v(ind.stD, 1)); if (S.ind.atr) h += item(C.i4, "ATR " + S.len.atr, v(ind.atr));
  if (S.ind.adx) h += item(C.i3, "ADX " + S.len.adx, v(ind.adx, 1)); if (S.ind.st) h += item(C.i3, "Supertrend", v(ind.st)); if (S.ind.ichi) h += item(C.i1, "Ichimoku", v(ind.tenkan) + " / " + v(ind.kijun));
  if (S.ind.macd) h += item(C.i1, "MACD", v(ind.macd, 2) + " / " + v(ind.sig, 2));
  cmpData.forEach(function (c, ci) { var cb = c.bars[i]; if (cb) h += item(C["c" + (ci + 1)], c.sym.label, fmt(cb.c, c.sym.dec)); });
  if (h !== legendHtml) { $("#legend").innerHTML = h; legendHtml = h; }
}

