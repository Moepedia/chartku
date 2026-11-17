/* 08d-toolsz: sisa drawing tools dari daftar resmi TradingView */
var XT3 = { disjoint: 1, insidepitch: 1, trendfibtime: 1, pitchfan: 1, fibwedge: 1, sector: 1, gannsq: 1, gannsqf: 1, doublecurve: 1, arrowmarker: 1, timecycles: 1, forecast: 1, barspat: 1, ghost: 1, arc: 1, curve: 1, path: 1, polyline: 1, highlighter: 1, arrowleft: 1, arrowright: 1, anchorednote: 1, signpost: 1 };
var VARNP = { path: 1, polyline: 1 };
Object.keys(XT3).forEach(function (k) { XT[k] = 1; EXTRA[k] = 1; });
["insidepitch", "trendfibtime", "pitchfan", "fibwedge", "sector"].forEach(function (k) { THREE[k] = 1; });
["gannsq", "gannsqf", "doublecurve", "arrowmarker", "timecycles", "forecast", "barspat", "ghost"].forEach(function (k) { TWO[k] = 1; });
["arrowleft", "arrowright"].forEach(function (k) { ONE[k] = 1; });
XTXT.anchorednote = 1; XTXT.signpost = 1;
NP.disjoint = 4; NP.arc = 3; NP.curve = 3; NP.path = 99; NP.polyline = 99;
/* pola gelombang Elliott tambahan memakai render pola generik */
NP.elltri = 5; NP.ellcombo3 = 5; NP.ellcorr = 3; NP.ellcombo2 = 3;
PLBL.elltri = ["A", "B", "C", "D", "E"]; PLBL.ellcombo3 = ["W", "X", "Y", "X", "Z"]; PLBL.ellcorr = ["A", "B", "C"]; PLBL.ellcombo2 = ["W", "X", "Y"];
["elltri", "ellcombo3", "ellcorr", "ellcombo2"].forEach(function (k) { EXTRA[k] = 1; });
Object.assign(ICONS, {
  disjoint: "<path d='M3 14L11 8M9 17l9-6'/><path d='M3 14l6 3M11 8l7 3' stroke-dasharray='2 2'/>", insidepitch: "<path d='M4 17L18 8M4 12L18 6M8 19L19 12M6 14L18 9'/>", trendfibtime: "<path d='M4 4v14M9 4v14M13 4v14M19 4v14'/><path d='M4 11h5' stroke-dasharray='2 2'/>",
  pitchfan: "<path d='M4 18L19 4M4 18L19 9M4 18L19 14M4 18L19 18'/>", fibwedge: "<path d='M4 18L18 6M4 18L18 14'/><path d='M10 12a8 8 0 0 1 0 4M14 9a12 12 0 0 1 0 6'/>", sector: "<path d='M4 18L16 6a12 12 0 0 1 3 12z'/>",
  gannsq: "<rect x='4' y='4' width='14' height='14'/><path d='M4 11h14M11 4v14M4 4l14 14M18 4L4 18'/>", gannsqf: "<rect x='4' y='4' width='14' height='14'/><path d='M4 8h14M4 14h14M8 4v14M14 4v14'/>",
  doublecurve: "<path d='M3 16c6 0 5-10 16-10'/>", arrowmarker: "<path d='M4 18L16 6M10 5h7v7'/>", timecycles: "<path d='M3 14a4 4 0 0 1 8 0M11 14a4 4 0 0 1 8 0'/>", forecast: "<rect x='4' y='8' width='14' height='8'/><path d='M4 16L18 6M14 6h4v4'/>",
  barspat: "<path d='M5 15v-5M5 12h2M9 18V8M9 14h2M13 15v-6M13 11h2'/>", ghost: "<path d='M6 16v-5M10 17V9M14 15V6M18 12V5' stroke-dasharray='2 2'/>", arc: "<path d='M4 17A10 10 0 0 1 18 5'/>", curve: "<path d='M3 17Q11 -3 19 17'/>",
  path: "<path d='M3 16l5-6 5 3 6-8M16 5h3v3'/>", polyline: "<path d='M4 16l3-9 8 2 3 8z'/>", highlighter: "<path d='M5 16l8-8 4 4-8 8H5z'/><path d='M14 7l2-2 4 4-2 2'/>", arrowleft: "<path d='M19 11H6M12 5l-6 6 6 6'/>", arrowright: "<path d='M3 11h13M10 5l6 6-6 6'/>",
  anchorednote: "<path d='M4 4h12v8H4z'/><path d='M10 12v7'/><circle cx='10' cy='19' r='1.2'/>", signpost: "<path d='M11 3v16M11 4h8l-2 3 2 3h-8'/>", elltri: "<path d='M3 16l4-8 3 5 3-4 3 3 3-1'/>", ellcombo3: "<path d='M3 14l3-7 3 5 3-6 3 5 3-4'/>",
  ellcorr: "<path d='M4 6l6 9 3-4 5 6'/>", ellcombo2: "<path d='M4 8l5 8 4-5 5 4'/>", demo: "<circle cx='11' cy='11' r='7' stroke-dasharray='2 2'/><circle cx='11' cy='11' r='2.4' fill='currentColor'/>"
});
Object.assign(TN, { disjoint: "Disjoint channel", insidepitch: "Inside pitchfork", trendfibtime: "Trend-based fib time", pitchfan: "Pitchfan", fibwedge: "Fib wedge", sector: "Sector", gannsq: "Gann square", gannsqf: "Gann square fixed",
  doublecurve: "Double curve", arrowmarker: "Arrow marker", timecycles: "Time cycles", forecast: "Position forecast", barspat: "Bars pattern", ghost: "Ghost feed", arc: "Arc", curve: "Curve", path: "Path", polyline: "Polyline",
  highlighter: "Highlighter", arrowleft: "Arrow mark left", arrowright: "Arrow mark right", anchorednote: "Anchored note", signpost: "Signpost", elltri: "Elliott triangle wave (ABCDE)", ellcombo3: "Elliott triple combo wave (WXYXZ)",
  ellcorr: "Elliott correction wave (ABC)", ellcombo2: "Elliott double combo wave (WXY)", demo: "Demonstration" });
/* nama sesuai TradingView */
Object.assign(TN, { fibext: "Trend-based fib extension", pitch: "Pitchfork", fibtz: "Fib time zone", cross: "Crossline", text: "Text", elliott: "Elliott impulse wave (12345)", drives: "Three drives pattern" });
addTools("lines", ["disjoint"]); addTools("fib", ["insidepitch", "gannsq", "gannsqf", "trendfibtime", "pitchfan", "fibwedge"]); addTools("shape", ["highlighter", "path", "curve", "polyline", "arc", "doublecurve"]);
addTools("note", ["anchorednote", "signpost", "arrowmarker", "arrowleft", "arrowright"]); addTools("pat", ["elltri", "ellcombo3", "ellcorr", "ellcombo2", "timecycles"]); addTools("fore", ["forecast", "barspat", "ghost", "sector"]);
grpById("cur").tools.splice(3, 0, "demo");

function seededRnd(seed) { var s = 0, i; for (i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function xtBar(b, i, col, alpha, C) { var x = G.X(i), up = b.c >= b.o, cl = up ? C.up : C.down, w = Math.max(1.5, G.bw * 0.7); ctx.globalAlpha = alpha; ctx.strokeStyle = cl; ctx.fillStyle = cl; ctx.beginPath(); ctx.moveTo(x, G.Yp(b.h)); ctx.lineTo(x, G.Yp(b.l)); ctx.stroke(); ctx.fillRect(x - w / 2, Math.min(G.Yp(b.o), G.Yp(b.c)), w, Math.max(1, Math.abs(G.Yp(b.o) - G.Yp(b.c)))); ctx.globalAlpha = 1; }
function drawXT3(d, C, a, b, col) {
  var t = d.type, pw = G.pw, ph = G.ph, c3 = d.p3 ? pxOf(d.p3) : null, pts = d.pts ? d.pts.map(pxOf) : null, i;
  function seg(p, q) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  function dot(p) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 6.2832); ctx.fill(); }
  function mid(p, q) { return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; }
  ctx.font = "11px " + css("--font-mono");
  if (t === "disjoint" && pts) { if (pts.length >= 2) seg(pts[0], pts[1]); if (pts.length >= 4) { seg(pts[2], pts[3]); ctx.globalAlpha = 0.08; xtPoly([pts[0], pts[1], pts[3], pts[2]], true); ctx.fill(); ctx.globalAlpha = 1; } else if (pts.length === 3) dot(pts[2]); pts.forEach(dot); }
  else if (t === "insidepitch" && b) {
    if (!c3) { seg(a, b); return; } var o = mid(a, b), m = mid(b, c3), L3 = pitchLines(o, b, c3);
    ctx.globalAlpha = 0.07; xtPoly([L3[1][0], L3[1][1], L3[2][1], L3[2][0]], true); ctx.fill(); ctx.globalAlpha = 1; L3.forEach(function (l, k) { ctx.lineWidth = k === 0 ? 1.5 : 1; seg(l[0], l[1]); });
    [0.5].forEach(function (r) { [b, c3].forEach(function (q) { var tp = { x: m.x + (q.x - m.x) * r, y: m.y + (q.y - m.y) * r }; seg(o, extendRay(o, tp, pw)); }); });
    ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1;
  } else if (t === "trendfibtime" && b) {
    ctx.globalAlpha = 0.6; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1; if (!c3) return; var dx = b.x - a.x; ctx.textAlign = "left"; ctx.textBaseline = "top";
    [0, 0.382, 0.5, 0.618, 1, 1.382, 1.618, 2, 2.618].forEach(function (f) { var x = c3.x + dx * f; if (x < -5 || x > pw + 5) return; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, ph); ctx.stroke(); ctx.fillText(String(f), x + 3, 4); });
  } else if (t === "pitchfan" && b) {
    seg(a, b); if (!c3) return; seg(b, c3); var mm = mid(b, c3); ctx.lineWidth = 1.6; seg(a, extendRay(a, mm, pw)); ctx.lineWidth = 1; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0, 0.25, 0.382, 0.618, 0.75, 1].forEach(function (r) { var tp = { x: b.x + (c3.x - b.x) * r, y: b.y + (c3.y - b.y) * r }; seg(a, extendRay(a, tp, pw)); });
  } else if (t === "fibwedge" && b) {
    seg(a, b); if (!c3) return; seg(a, c3); var R0 = Math.hypot(b.x - a.x, b.y - a.y), a1 = Math.atan2(b.y - a.y, b.x - a.x), a2 = Math.atan2(c3.y - a.y, c3.x - a.x), da = a2 - a1; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    [0.236, 0.382, 0.5, 0.618, 0.786, 1].forEach(function (r) { ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(a.x, a.y, R0 * r, a1, a1 + da, da < 0); ctx.stroke(); });
  } else if (t === "sector" && b) {
    var Rs = Math.hypot(b.x - a.x, b.y - a.y), s1 = Math.atan2(b.y - a.y, b.x - a.x); seg(a, b); if (!c3) return; var s2 = Math.atan2(c3.y - a.y, c3.x - a.x), ds = s2 - s1; while (ds > Math.PI) ds -= 2 * Math.PI; while (ds < -Math.PI) ds += 2 * Math.PI;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.arc(a.x, a.y, Rs, s1, s1 + ds, ds < 0); ctx.closePath(); ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); dot(a);
  } else if ((t === "gannsq" || t === "gannsqf") && b) {
    var sdx = b.x - a.x, sdy = b.y - a.y, sd = t === "gannsq" ? Math.max(Math.abs(sdx), Math.abs(sdy)) : Math.abs(sdx), sx = sdx >= 0 ? 1 : -1, sy = sdy >= 0 ? 1 : -1, x0 = a.x, y0 = a.y, x1 = a.x + sx * sd, y1 = a.y + sy * sd;
    ctx.globalAlpha = 0.05; ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), sd, sd); ctx.globalAlpha = 1; ctx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), sd, sd); ctx.lineWidth = 1;
    for (i = 1; i < 8; i++) { var f = i / 8; ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.moveTo(x0 + (x1 - x0) * f, y0); ctx.lineTo(x0 + (x1 - x0) * f, y1); ctx.moveTo(x0, y0 + (y1 - y0) * f); ctx.lineTo(x1, y0 + (y1 - y0) * f); ctx.stroke(); }
    ctx.globalAlpha = 0.8; seg({ x: x0, y: y0 }, { x: x1, y: y1 }); seg({ x: x0, y: y1 }, { x: x1, y: y0 }); ctx.globalAlpha = 1;
  } else if (t === "doublecurve" && b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.bezierCurveTo((a.x + b.x) / 2, a.y, (a.x + b.x) / 2, b.y, b.x, b.y); ctx.stroke(); dot(a); dot(b); }
  else if (t === "arrowmarker" && b) {
    var len = Math.hypot(b.x - a.x, b.y - a.y) || 1, ux = (b.x - a.x) / len, uy = (b.y - a.y) / len, nx = -uy, ny = ux, hw = Math.min(14, len * 0.25), hl = Math.min(26, len * 0.45), bw2 = hw * 0.4, bx = b.x - ux * hl, by = b.y - uy * hl;
    ctx.beginPath(); ctx.moveTo(a.x + nx * bw2 * 0.2, a.y + ny * bw2 * 0.2); ctx.lineTo(bx + nx * bw2, by + ny * bw2); ctx.lineTo(bx + nx * hw, by + ny * hw); ctx.lineTo(b.x, b.y); ctx.lineTo(bx - nx * hw, by - ny * hw); ctx.lineTo(bx - nx * bw2, by - ny * bw2); ctx.lineTo(a.x - nx * bw2 * 0.2, a.y - ny * bw2 * 0.2); ctx.closePath(); ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
  } else if (t === "timecycles" && b) {
    var cw = Math.abs(b.x - a.x); if (cw < 6) return; var n0 = Math.floor((0 - a.x) / cw), n1 = Math.ceil((pw - a.x) / cw);
    for (i = n0; i <= n1; i++) { var cx = a.x + (i + 0.5) * cw; ctx.beginPath(); ctx.arc(cx, a.y, cw / 2, Math.PI, 2 * Math.PI); ctx.globalAlpha = 0.1; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); }
    ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(0, Math.round(a.y) + 0.5); ctx.lineTo(pw, Math.round(a.y) + 0.5); ctx.stroke(); ctx.globalAlpha = 1;
  } else if (t === "forecast" && b) {
    var dd = xtDelta(d), upf = dd.dp >= 0, cf = upf ? C.up : C.down; ctx.strokeStyle = cf; ctx.fillStyle = cf; ctx.globalAlpha = 0.12; ctx.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)); ctx.globalAlpha = 1; ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    seg(a, b); arrowHead(a, b, cf, 9); dot(a); xtBox((dd.dp >= 0 ? "+" : "") + fmt(dd.dp, S.sym.dec) + " (" + (dd.pc >= 0 ? "+" : "") + dd.pc.toFixed(2) + "%)  " + Math.abs(dd.nb) + " bars", Math.max(a.x, b.x) - 100, Math.min(a.y, b.y) - 22, cf);
  } else if (t === "barspat" && b) {
    var i1 = Math.max(0, Math.round(Math.min(tToI(d.p1.t), tToI(d.p2.t)))), i2 = Math.min(bars.length - 1, Math.round(Math.max(tToI(d.p1.t), tToI(d.p2.t)))), n = i2 - i1 + 1; if (n < 2) return;
    var shift = bars[i2].c - bars[i1].o; ctx.globalAlpha = 0.3; ctx.strokeStyle = col; ctx.setLineDash([4, 3]); ctx.strokeRect(G.X(i1) - G.bw / 2, Math.min(G.Yp(Math.max.apply(null, bars.slice(i1, i2 + 1).map(function (q) { return q.h; }))), G.Yp(Math.min.apply(null, bars.slice(i1, i2 + 1).map(function (q) { return q.l; })))), G.X(i2) - G.X(i1) + G.bw, Math.abs(G.Yp(Math.max.apply(null, bars.slice(i1, i2 + 1).map(function (q) { return q.h; }))) - G.Yp(Math.min.apply(null, bars.slice(i1, i2 + 1).map(function (q) { return q.l; }))))); ctx.setLineDash([]); ctx.globalAlpha = 1;
    for (i = 0; i < n; i++) { var sb = bars[i1 + i], pb = { o: sb.o + shift, h: sb.h + shift, l: sb.l + shift, c: sb.c + shift }; xtBar(pb, i2 + 1 + i, col, 0.75, C); }
  } else if (t === "ghost" && b) {
    var g1 = Math.max(0, Math.round(tToI(d.p1.t))), g2 = Math.round(tToI(d.p2.t)), cnt = g2 - g1; if (cnt < 1) return; var rnd = seededRnd(d.id || "g"), rng = 0, kk, nb2 = Math.min(50, bars.length - 1); for (kk = bars.length - nb2; kk < bars.length; kk++) rng += bars[kk].h - bars[kk].l; rng = rng / nb2 || 1; var pr = d.p1.p;
    for (i = 0; i < cnt; i++) { var o2 = pr, c2 = pr + (rnd() - 0.5) * rng * 1.4, h2 = Math.max(o2, c2) + rnd() * rng * 0.4, l2 = Math.min(o2, c2) - rnd() * rng * 0.4; xtBar({ o: o2, h: h2, l: l2, c: c2 }, g1 + i, col, 0.5, C); pr = c2; }
  } else if (t === "arc" && pts) {
    if (pts.length < 3) { xtPoly(pts, false); ctx.stroke(); pts.forEach(dot); return; } var p0 = pts[0], p1 = pts[1], p2 = pts[2], D = 2 * (p0.x * (p1.y - p2.y) + p1.x * (p2.y - p0.y) + p2.x * (p0.y - p1.y));
    if (Math.abs(D) < 1e-6) { xtPoly(pts, false); ctx.stroke(); return; } var ux = ((p0.x * p0.x + p0.y * p0.y) * (p1.y - p2.y) + (p1.x * p1.x + p1.y * p1.y) * (p2.y - p0.y) + (p2.x * p2.x + p2.y * p2.y) * (p0.y - p1.y)) / D, uy = ((p0.x * p0.x + p0.y * p0.y) * (p2.x - p1.x) + (p1.x * p1.x + p1.y * p1.y) * (p0.x - p2.x) + (p2.x * p2.x + p2.y * p2.y) * (p1.x - p0.x)) / D, r = Math.hypot(p0.x - ux, p0.y - uy);
    var A0 = Math.atan2(p0.y - uy, p0.x - ux), A1 = Math.atan2(p1.y - uy, p1.x - ux), A2 = Math.atan2(p2.y - uy, p2.x - ux), TP = 2 * Math.PI, d1 = ((A1 - A0) % TP + TP) % TP, d2 = ((A2 - A0) % TP + TP) % TP;
    ctx.beginPath(); ctx.arc(ux, uy, r, A0, A2, !(d1 < d2)); ctx.stroke(); pts.forEach(dot);
  } else if (t === "curve" && pts) {
    if (pts.length < 3) { xtPoly(pts, false); ctx.stroke(); pts.forEach(dot); return; } var cq = { x: 2 * pts[1].x - (pts[0].x + pts[2].x) / 2, y: 2 * pts[1].y - (pts[0].y + pts[2].y) / 2 };
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); ctx.quadraticCurveTo(cq.x, cq.y, pts[2].x, pts[2].y); ctx.stroke(); pts.forEach(dot);
  } else if (t === "path" && pts) { xtPoly(pts, false); ctx.stroke(); if (pts.length >= 2) arrowHead(pts[pts.length - 2], pts[pts.length - 1], col, 9); pts.forEach(dot); }
  else if (t === "polyline" && pts) { if (pts.length > 2) { ctx.globalAlpha = 0.1; xtPoly(pts, true); ctx.fill(); ctx.globalAlpha = 1; } xtPoly(pts, pts.length > 2 && !d.open); ctx.stroke(); pts.forEach(dot); }
  else if (t === "highlighter" && pts) { ctx.save(); ctx.globalAlpha = 0.35; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round"; xtPoly(pts, false); ctx.stroke(); ctx.restore(); }
  else if (t === "arrowleft" || t === "arrowright") { var sg = t === "arrowleft" ? 1 : -1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + 11 * sg, a.y - 9); ctx.lineTo(a.x + 11 * sg, a.y - 3.5); ctx.lineTo(a.x + 24 * sg, a.y - 3.5); ctx.lineTo(a.x + 24 * sg, a.y + 3.5); ctx.lineTo(a.x + 11 * sg, a.y + 3.5); ctx.lineTo(a.x + 11 * sg, a.y + 9); ctx.closePath(); ctx.fill(); }
  else if (t === "anchorednote") { ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, ph); ctx.stroke(); ctx.setLineDash([]); dot(a); xtTextBox(d, a.x + 8, a.y - 30, col, true); }
  else if (t === "signpost") { ctx.beginPath(); ctx.moveTo(Math.round(a.x) + 0.5, 28); ctx.lineTo(Math.round(a.x) + 0.5, ph); ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1; var wS = xtTextBox(d, a.x, 4, col, true); ctx.beginPath(); ctx.moveTo(a.x, 28); ctx.lineTo(a.x + 6, 28); ctx.lineTo(a.x, 36); ctx.closePath(); ctx.fill(); }
}
function hitXT3(d, a, b, x, y) {
  var t = d.type, pts = d.pts ? d.pts.map(pxOf) : [a].concat(b ? [b] : []).concat(d.p3 ? [pxOf(d.p3)] : []), i;
  if (t === "highlighter" || t === "path") { for (i = 1; i < pts.length; i++) if (dSeg(x, y, pts[i - 1], pts[i]) < (t === "highlighter" ? 10 : TOL)) return true; return false; }
  if (XTXT[t]) return t === "signpost" ? Math.abs(x - a.x) < 8 || (x >= a.x && x <= a.x + 200 && y < 32) : x >= a.x - 8 && x <= a.x + 220 && y >= a.y - 34 && y <= a.y + 8;
  if (t === "arrowleft" || t === "arrowright") return Math.abs(x - (a.x + (t === "arrowleft" ? 12 : -12))) < 16 && Math.abs(y - a.y) < 11;
  var xs = pts.map(function (q) { return q.x; }), ys = pts.map(function (q) { return q.y; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  if (t === "timecycles") return x >= x0 - 4 && Math.abs(y - a.y) < Math.abs(b.x - a.x) / 2 + 4;
  if (t === "barspat" || t === "ghost" || t === "trendfibtime") { var spanX = x1 + (x1 - x0); return x >= x0 - 4 && x <= spanX + 4 && y >= y0 - 40 && y <= y1 + 40; }
  if (t === "sector" || t === "fibwedge") { var R = b ? Math.hypot(b.x - a.x, b.y - a.y) : 0; return Math.hypot(x - a.x, y - a.y) <= R + 4; }
  return x >= x0 - 6 && x <= x1 + 6 && y >= y0 - 6 && y <= y1 + 6;
}
