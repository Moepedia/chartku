/* 06-drawings: drawing, undo/redo, range bar */
/* ---------- drawings ---------- */
var FIB = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
function tToI(t) {
  var n = bars.length, lo = 0, hi = n - 1, m;
  if (t <= bars[0].t) return (t - bars[0].t) / S.tf.s;
  if (t >= bars[n - 1].t) return n - 1 + (t - bars[n - 1].t) / S.tf.s;
  while (hi - lo > 1) { m = (lo + hi) >> 1; if (bars[m].t <= t) lo = m; else hi = m; }
  return lo + (t - bars[lo].t) / ((bars[hi].t - bars[lo].t) || 1);
}
function iToT(fi) {
  var n = bars.length;
  if (fi <= 0) return bars[0].t + fi * S.tf.s;
  if (fi >= n - 1) return bars[n - 1].t + (fi - (n - 1)) * S.tf.s;
  var i = Math.floor(fi); return bars[i].t + (fi - i) * (bars[i + 1].t - bars[i].t);
}
function pxOf(pt) { return { x: G.X(tToI(pt.t)), y: G.Yp(pt.p) }; }
function extendRay(a, b, xmax) {
  var dx = b.x - a.x, dy = b.y - a.y; if (Math.abs(dx) < 0.001) return { x: a.x, y: dy >= 0 ? 1e5 : -1e5 };
  var s = dx > 0 ? (xmax + 2000 - a.x) / dx : (-2000 - a.x) / dx; return { x: a.x + dx * s, y: a.y + dy * s };
}
var TOL = 7, HR = matchMedia("(pointer: coarse)").matches ? 7 : 5, ONE = { hline: 1, vline: 1, hray: 1, cross: 1 };
var EXTRA = { arrow: 1, brush: 1, ellipse: 1, channel: 1, pitch: 1, fibext: 1, long: 1, short: 1, xabcd: 1, abcd: 1, triangle: 1, hs: 1, elliott: 1, drives: 1 };
var NP = { xabcd: 5, abcd: 4, triangle: 5, hs: 7, elliott: 6, drives: 5 };
var PLBL = { xabcd: ["X", "A", "B", "C", "D"], abcd: ["A", "B", "C", "D"], triangle: ["A", "B", "C", "D", "E"], hs: ["L Sh", "Tr 1", "Head", "Tr 2", "R Sh", "Neck", "Neck"], elliott: ["0", "1", "2", "3", "4", "5"], drives: ["0", "1", "2", "3", "4"] };
var TWO = { trend: 1, ray: 1, extended: 1, rect: 1, fib: 1, arrow: 1, fibext: 1, ellipse: 1, long: 1, short: 1 };
var THREE = { channel: 1, pitch: 1 };
var FIBX = [0, 0.618, 1, 1.272, 1.618, 2, 2.618];
function channelOff(a, b, c) { var dx = b.x - a.x, yl = dx ? a.y + (b.y - a.y) * (c.x - a.x) / dx : a.y; return c.y - yl; }
function pitchLines(a, b, c) {
  var mx = (b.x + c.x) / 2, my = (b.y + c.y) / 2, m = { x: mx - a.x, y: my - a.y };
  return [[a, extendRay(a, { x: mx, y: my }, G.pw)], [b, extendRay(b, { x: b.x + m.x, y: b.y + m.y }, G.pw)], [c, extendRay(c, { x: c.x + m.x, y: c.y + m.y }, G.pw)]];
}
function stopOf(d) { return d.p1.p - (d.p2.p - d.p1.p); }
function drawExtra(d, C, pv, a, b) {
  var t = d.type, c3 = d.p3 ? pxOf(d.p3) : null, col = d.cx || C[d.c || "acc"] || C.acc, i, p;
  if (XT[t]) { drawXT(d, C, a, b, col); return; }
  function seg(p0, p1) { ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); }
  if (t === "arrow" && b) {
    seg(a, b); var an = Math.atan2(b.y - a.y, b.x - a.x), hl = 11;
    ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - hl * Math.cos(an - 0.45), b.y - hl * Math.sin(an - 0.45)); ctx.lineTo(b.x - hl * Math.cos(an + 0.45), b.y - hl * Math.sin(an + 0.45)); ctx.closePath(); ctx.fill();
  } else if (t === "brush" && d.pts) {
    ctx.lineJoin = "round"; ctx.beginPath(); d.pts.forEach(function (q, k) { p = pxOf(q); if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
  } else if (t === "ellipse" && b) {
    ctx.beginPath(); ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2 || 1, Math.abs(b.y - a.y) / 2 || 1, 0, 0, 6.2832);
    ctx.globalAlpha = 0.13; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
  } else if (t === "channel" && b) {
    var off = c3 ? channelOff(a, b, c3) : 0, a2 = { x: a.x, y: a.y + off }, b2 = { x: b.x, y: b.y + off };
    if (c3) { ctx.globalAlpha = 0.08; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(b2.x, b2.y); ctx.lineTo(a2.x, a2.y); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    seg(a, b); if (c3) { seg(a2, b2); ctx.setLineDash([4, 4]); ctx.globalAlpha = 0.6; seg({ x: a.x, y: a.y + off / 2 }, { x: b.x, y: b.y + off / 2 }); ctx.globalAlpha = 1; ctx.setLineDash([]); }
  } else if (t === "pitch" && b) {
    if (!c3) { seg(a, b); return; }
    var L3 = pitchLines(a, b, c3);
    ctx.globalAlpha = 0.07; ctx.beginPath(); ctx.moveTo(L3[1][0].x, L3[1][0].y); ctx.lineTo(L3[1][1].x, L3[1][1].y); ctx.lineTo(L3[2][1].x, L3[2][1].y); ctx.lineTo(L3[2][0].x, L3[2][0].y); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    L3.forEach(function (l, k) { ctx.lineWidth = k === 0 ? (d.w || 1.5) : 1; seg(l[0], l[1]); }); ctx.lineWidth = d.w || 1.5; seg(b, c3);
  } else if (t === "fibext" && b) {
    var xl = Math.min(a.x, b.x); ctx.font = "11px " + css("--font-mono"); ctx.textBaseline = "bottom"; ctx.textAlign = "left";
    FIBX.forEach(function (lv) {
      var price = d.p1.p + (d.p2.p - d.p1.p) * lv, y = G.Yp(price); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xl, Math.round(y) + 0.5); ctx.lineTo(G.pw, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillText(lv + "  (" + fmtAxis(price) + ")", xl + 4, y - 2);
    });
    ctx.globalAlpha = 0.6; ctx.setLineDash([3, 4]); seg(a, b); ctx.globalAlpha = 1;
  } else if ((t === "long" || t === "short") && b) {
    var yE = a.y, yT = b.y, yS = G.Yp(stopOf(d)), x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x, x0 + 70);
    ctx.globalAlpha = 0.18; ctx.fillStyle = C.up; ctx.fillRect(x0, Math.min(yE, yT), x1 - x0, Math.abs(yT - yE));
    ctx.fillStyle = C.down; ctx.fillRect(x0, Math.min(yE, yS), x1 - x0, Math.abs(yS - yE)); ctx.globalAlpha = 1;
    ctx.lineWidth = 1; [yE, yT, yS].forEach(function (y, k) { ctx.strokeStyle = k === 0 ? col : k === 1 ? C.up : C.down; ctx.beginPath(); ctx.moveTo(x0, Math.round(y) + 0.5); ctx.lineTo(x1, Math.round(y) + 0.5); ctx.stroke(); });
    var gain = d.p2.p - d.p1.p; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.fillStyle = C.ink; ctx.textBaseline = "middle";
    ctx.fillText((t === "long" ? "Long" : "Short") + "  R:R 1:1", x0 + 6, yE + (yT < yE ? 10 : -10));
    ctx.fillText("Target " + fmt(gain, S.sym.dec) + " (" + (gain / d.p1.p * 100).toFixed(2) + "%)", x0 + 6, yT + (yT < yE ? 10 : -10));
    ctx.fillText("Stop " + fmtAxis(stopOf(d)), x0 + 6, yS + (yS > yE ? -10 : 10));
  } else if (NP[t] && d.pts) {
    var pp = d.pts.map(pxOf), LB = PLBL[t] || [];
    ctx.lineJoin = "round"; ctx.beginPath();
    pp.forEach(function (q, k) { if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); });
    ctx.stroke();
    ctx.globalAlpha = 0.08;
    for (i = 2; i < pp.length; i++) { ctx.beginPath(); ctx.moveTo(pp[i - 2].x, pp[i - 2].y); ctx.lineTo(pp[i - 1].x, pp[i - 1].y); ctx.lineTo(pp[i].x, pp[i].y); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.font = "11px " + css("--font-body"); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    pp.forEach(function (q, k) { ctx.beginPath(); ctx.arc(q.x, q.y, 2.5, 0, 6.2832); ctx.fill(); if (LB[k]) ctx.fillText(LB[k], q.x, q.y - 5); });
  }
}
function hitExtra(d, a, b, x, y) {
  var t = d.type, c3 = d.p3 ? pxOf(d.p3) : null, i;
  if (XT[t]) return hitXT(d, a, b, x, y);
  if (t === "arrow") return dSeg(x, y, a, b) < TOL;
  if (t === "brush") { var pp = (d.pts || []).map(pxOf); for (i = 1; i < pp.length; i++) if (dSeg(x, y, pp[i - 1], pp[i]) < TOL) return true; return false; }
  if (t === "ellipse" || t === "fibext") return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x) + 4 && y >= Math.min(a.y, b.y) - 4 && y <= Math.max(a.y, b.y) + 4;
  if (t === "long" || t === "short") { var ys = [a.y, b.y, G.Yp(stopOf(d))], x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x, x0 + 70); return x >= x0 - 4 && x <= x1 + 4 && y >= Math.min.apply(null, ys) - 4 && y <= Math.max.apply(null, ys) + 4; }
  if (t === "channel" && b) { var off = c3 ? channelOff(a, b, c3) : 0; return dSeg(x, y, a, b) < TOL || (c3 && dSeg(x, y, { x: a.x, y: a.y + off }, { x: b.x, y: b.y + off }) < TOL); }
  if (t === "pitch" && b) { if (!c3) return dSeg(x, y, a, b) < TOL; return pitchLines(a, b, c3).some(function (l) { return dSeg(x, y, l[0], l[1]) < TOL; }) || dSeg(x, y, b, c3) < TOL; }
  if (NP[t]) { var ppts = (d.pts || []).map(pxOf); for (i = 1; i < ppts.length; i++) if (dSeg(x, y, ppts[i - 1], ppts[i]) < TOL) return true; return false; }
  if (t === "emoji") return Math.hypot(x - a.x, y - a.y) < 16;
  return false;
}
/* ---------- undo / redo ---------- */
var undoS = [], redoS = [];
function syncUndo() { $("#undoBtn").disabled = !undoS.length; $("#redoBtn").disabled = !redoS.length; }
function snap() { undoS.push(JSON.stringify(S.drawings)); if (undoS.length > 60) undoS.shift(); redoS = []; syncUndo(); }
function undo() { if (!undoS.length) return; redoS.push(JSON.stringify(S.drawings)); S.drawings = JSON.parse(undoS.pop()); S.sel = null; syncSel(); syncUndo(); draw(); save(); }
function redo() { if (!redoS.length) return; undoS.push(JSON.stringify(S.drawings)); S.drawings = JSON.parse(redoS.pop()); S.sel = null; syncSel(); syncUndo(); draw(); save(); }
function finishBrush() {
  var pts = drag.pts; if (pts.length < 3) return;
  snap(); var d = { id: "d" + Date.now().toString(36) + Math.floor(Math.random() * 1e4), type: "brush", p1: pts[0], pts: pts, c: "acc", w: 1.5 };
  (S.drawings[S.sym.id] = S.drawings[S.sym.id] || []).push(d); save();
}
/* ---------- range bar, clock, extras ---------- */
function wireExtras() {
  $("#undoBtn").addEventListener("click", undo); $("#redoBtn").addEventListener("click", redo); syncUndo();
  $("#goLatest").addEventListener("click", function () { S.off = 6; draw(); });
  $("#resetView").addEventListener("click", function () { resetView(); draw(); });
  wireDd($("#gotoBtn"), $("#gotoPop"));
  $("#gotoPop").addEventListener("click", function (e) { e.stopPropagation(); });
  $("#gotoGo").addEventListener("click", function () {
    var v = $("#gotoDate").value;
    if (!v) { toast("Pilih tanggal dulu."); return; }
    if (!bars.length) { toast("Data chart belum termuat. Coba lagi setelah feed aktif."); return; }
    var ts = Math.floor(new Date(v + "T00:00:00Z").getTime() / 1000), bi = 0;
    for (var gi = 0; gi < bars.length; gi++) { if (bars[gi].t <= ts) bi = gi; else break; }
    S.range = null; S.off = bi - (G.nv - 1) + (G.pw * 0.3) / S.barW - 0.5; closeAll(); syncUI(); draw();
  });
  $("#dhint").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.x === "keep") { S.keep = !S.keep; syncUI(); syncDraw(true); save(); } else { S.pend = null; setTool("cursor"); }
  });
  setInterval(function () {
    $("#goLatest").hidden = !(S.off < -3);
    var z = TZS.filter(function (q) { return q[0] === S.tz; })[0] || TZS[0], tx;
    try { tx = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: z[2] }).format(new Date()); } catch (e) { tx = ""; }
    $("#tzClock").textContent = tx + " (" + z[1] + ")";
  }, 1000);
}

function drawOne(d, C, preview) {
  if (d.hide || (d.only && d.only !== S.tf.k)) return;
  drawOne0(d, C, preview);
  if (LINE_T[d.type] && d.p2) { var lc = d.cx || C[d.c || "acc"] || C.acc; ctx.strokeStyle = lc; ctx.fillStyle = lc; ctx.lineWidth = d.w || 1.5; ctx.setLineDash(preview ? [5, 4] : d.ls === 1 ? [7, 5] : d.ls === 2 ? [2, 4] : []); drawLineOpts(d, pxOf(d.p1), pxOf(d.p2), lc, C); ctx.setLineDash([]); }
}
function drawOne0(d, C, preview) {
  var col = d.cx || C[d.c || "acc"] || C.acc, a = pxOf(d.p1), b = d.p2 ? pxOf(d.p2) : null, pw = G.pw;
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = d.w || 1.5; ctx.setLineDash(preview ? [5, 4] : d.ls === 1 ? [7, 5] : d.ls === 2 ? [2, 4] : []);
  if (d.type === "trend" && b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  else if (d.type === "ray" && b) { var e = extendRay(a, b, pw); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(e.x, e.y); ctx.stroke(); }
  else if (d.type === "hline") { ctx.beginPath(); ctx.moveTo(0, a.y); ctx.lineTo(pw, a.y); ctx.stroke(); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
  else if (d.type === "vline") { ctx.beginPath(); ctx.moveTo(a.x, 0); ctx.lineTo(a.x, G.ph); ctx.stroke(); }
  else if (d.type === "hray") { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pw, a.y); ctx.stroke(); ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, 6.3); ctx.fill(); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
  else if (d.type === "cross") { ctx.beginPath(); ctx.moveTo(0, a.y); ctx.lineTo(pw, a.y); ctx.moveTo(a.x, 0); ctx.lineTo(a.x, G.ph); ctx.stroke(); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
  else if (d.type === "extended" && b) { var x0e = extendRay(b, a, pw), x1e = extendRay(a, b, pw); ctx.beginPath(); ctx.moveTo(x0e.x, x0e.y); ctx.lineTo(x1e.x, x1e.y); ctx.stroke(); }
  else if (d.type === "rect" && b) {
    ctx.globalAlpha = d.fo != null ? d.fo : 0.13; ctx.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)); ctx.globalAlpha = 1;
    ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  } else if (d.type === "fib" && b) {
    var xl = Math.min(a.x, b.x), xr = Math.max(a.x, b.x, xl + 90), prevY = null;
    ctx.font = "11px " + css("--font-mono"); ctx.textBaseline = "bottom"; ctx.textAlign = "left";
    FIB.forEach(function (lv, li) {
      var price = d.p2.p + (d.p1.p - d.p2.p) * lv, y = G.Yp(price);
      if (prevY !== null && li % 2 === 1) { ctx.globalAlpha = d.fo != null ? d.fo * 0.55 : 0.07; ctx.fillRect(xl, Math.min(y, prevY), xr - xl, Math.abs(y - prevY)); ctx.globalAlpha = 1; }
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xl, Math.round(y) + 0.5); ctx.lineTo(xr, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillText(lv + "  (" + fmtAxis(price) + ")", xl + 4, y - 2); prevY = y;
    });
    ctx.globalAlpha = 0.6; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.globalAlpha = 1;
  } else if (EXTRA[d.type]) { drawExtra(d, C, preview, a, b);
  } else if (d.type === "emoji") {
    ctx.font = (d.fs || 22) + "px " + css("--font-body"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(d.ch || "\u2B50", a.x, a.y);
  } else if (d.type === "text") {
    ctx.font = "600 " + (d.fs || 13) + "px " + css("--font-body"); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, 6.3); ctx.fill(); ctx.fillText(d.text || "", a.x + 7, a.y + 4);
  }
  ctx.setLineDash([]); ctx.lineWidth = 1;
}
function fmtAxis(p) { return G.mode === "pct" ? ((p / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(p, S.sym.dec); }
function drawMeasure(m, C) {
  var a = pxOf(m.p1), b = pxOf(m.p2), up = m.p2.p >= m.p1.p, col = up ? C.up : C.down;
  ctx.globalAlpha = 0.14; ctx.fillStyle = col; ctx.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)); ctx.globalAlpha = 1;
  ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  var dp = m.p2.p - m.p1.p, nb = Math.round((m.p2.t - m.p1.t) / S.tf.s);
  var l1 = (dp >= 0 ? "+" : "") + fmt(dp, S.sym.dec) + " (" + (dp >= 0 ? "+" : "") + (dp / m.p1.p * 100).toFixed(2) + "%)", l2 = nb + " bars, " + dur(m.p2.t - m.p1.t);
  ctx.font = "12px " + css("--font-mono"); var w = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 16;
  var cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - 38; if (cy < 4) cy = Math.max(a.y, b.y) + 8;
  cx = Math.max(w / 2 + 2, Math.min(G.pw - w / 2 - 2, cx));
  ctx.fillStyle = col; ctx.fillRect(cx - w / 2, cy, w, 34);
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(l1, cx, cy + 10); ctx.fillText(l2, cx, cy + 25);
}
function handlesOf(d) {
  if (THREE[d.type] && d.p3) return [["p1", pxOf(d.p1)], ["p2", pxOf(d.p2)], ["p3", pxOf(d.p3)]];
  if (TWO[d.type] || THREE[d.type]) return [["p1", pxOf(d.p1)], ["p2", pxOf(d.p2)]];
  if (d.type === "hline") return [["body", { x: 18, y: pxOf(d.p1).y }]];
  if (d.type === "hray" || d.type === "cross") return [["p1", pxOf(d.p1)]];
  return [];
}
function drawDrawings(C) {
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, G.pw, G.ph); ctx.clip();
  var list = S.hideD ? [] : (S.drawings[S.sym.id] || []);
  list.forEach(function (d) { drawOne(d, C, false); });
  if (drag && drag.kind === "brush") drawOne({ type: "brush", pts: drag.pts, p1: drag.pts[0], c: "acc", w: 1.5 }, C, true);
  if (S.pend && S.cx !== null && S.cx < G.pw && S.tool !== "text") {
    var p2 = toPt(S.cx, S.cy);
    if (S.pend.type === "measure") drawMeasure({ p1: S.pend.p1, p2: p2 }, C); else if (S.pend.pts) { drawOne({ type: S.pend.type, p1: S.pend.pts[0], pts: S.pend.pts.concat([p2]), c: "acc", w: 1.5 }, C, true); } else { var pdv = S.pend, pv; if (THREE[pdv.type]) pv = pdv.p2 ? { type: pdv.type, p1: pdv.p1, p2: pdv.p2, p3: p2 } : { type: "trend", p1: pdv.p1, p2: p2 }; else pv = { type: pdv.type, p1: pdv.p1, p2: p2 }; pv.c = "acc"; pv.w = 1.5; drawOne(pv, C, true); }
  }
  if (S.meas) drawMeasure(S.meas, C);
  var sel = list.filter(function (d) { return d.id === S.sel; })[0];
  if (sel && !sel.lock) handlesOf(sel).forEach(function (h) { ctx.fillStyle = C.bg; ctx.strokeStyle = sel.cx || C[sel.c || "acc"]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(h[1].x, h[1].y, HR, 0, 6.3); ctx.fill(); ctx.stroke(); });
  ctx.lineWidth = 1;

  /* alerts + position */
  S.alerts.forEach(function (al) {
    if (al.sym !== S.sym.id || !al.active || S.sty.aLn === false) return;
    var y = G.Yp(al.price); ctx.strokeStyle = C.acc; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(G.pw, Math.round(y) + 0.5); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = "11px " + css("--font-mono"); ctx.fillStyle = C.acc; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("Alert", 8, y - 3);
    G.tags.push({ y: y, text: fmtAxis(al.price), bg: C.acc, fg: C.bg });
  });
  var pos = S.acc.pos[S.sym.id];
  if (pos && pos.q) {
    var py = G.Yp(pos.avg), pnl = (curPrice() - pos.avg) * pos.q, pc = pnl >= 0 ? C.up : C.down;
    ctx.strokeStyle = pc; ctx.beginPath(); ctx.moveTo(0, Math.round(py) + 0.5); ctx.lineTo(G.pw, Math.round(py) + 0.5); ctx.stroke();
    var txt = (pos.q > 0 ? "LONG " : "SHORT ") + Math.abs(pos.q) + "  " + (pnl >= 0 ? "+" : "") + fmt(pnl, 2) + " USD";
    ctx.font = "11px " + css("--font-mono"); var tw = ctx.measureText(txt).width + 12;
    ctx.fillStyle = pc; ctx.fillRect(8, py - 17, tw, 16); ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, 14, py - 8.5);
    G.tags.push({ y: py, text: fmtAxis(pos.avg), bg: pc, fg: "#ffffff" });
  }
  ctx.restore();
}

