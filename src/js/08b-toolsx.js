/* 08b-toolsx: drawing tools tambahan (gaya TradingView) */
var XT = { angle: 1, infoline: 1, regr: 1, fibtz: 1, fibfan: 1, fibcirc: 1, gannbox: 1, daterange: 1, pricerange: 1, dprange: 1, circle: 1, pricelabel: 1, flag: 1, arrowup: 1, arrowdown: 1 };
var XT1 = { pricelabel: 1, flag: 1, arrowup: 1, arrowdown: 1 };
Object.keys(XT).forEach(function (k) { EXTRA[k] = 1; if (XT1[k]) ONE[k] = 1; else TWO[k] = 1; });
Object.assign(ICONS, {
  angle: "<path d='M4 17h14M4 17L16 6'/><path d='M10 17a6 6 0 0 0-2-4.5' />", infoline: "<path d='M4 17L17 6'/><rect x='9' y='11' width='9' height='6' rx='1'/>",
  regr: "<path d='M3 15L19 7'/><path d='M3 11L19 3M3 19L19 11' stroke-dasharray='2 2'/>", fibtz: "<path d='M4 4v14M7 4v14M11 4v14M18 4v14'/>",
  fibfan: "<path d='M4 18L19 4M4 18L19 9M4 18L19 14'/>", fibcirc: "<circle cx='11' cy='11' r='3'/><circle cx='11' cy='11' r='6'/><circle cx='11' cy='11' r='9'/>",
  gannbox: "<rect x='4' y='4' width='14' height='14'/><path d='M4 18L18 4M4 11h14M11 4v14'/>", daterange: "<path d='M5 4v14M17 4v14M5 11h12M8 8l-3 3 3 3M14 8l3 3-3 3'/>",
  pricerange: "<path d='M4 5h14M4 17h14M11 5v12M8 8l3-3 3 3M8 14l3 3 3-3'/>", dprange: "<rect x='4' y='5' width='14' height='12'/><path d='M11 5v12M4 11h14'/>",
  circle: "<circle cx='11' cy='11' r='7'/>", pricelabel: "<path d='M3 11l4-4h12v8H7z'/>", flag: "<path d='M6 19V4M6 5h11l-3 3.5 3 3.5H6'/>",
  arrowup: "<path d='M11 19V6M5 12l6-6 6 6'/>", arrowdown: "<path d='M11 3v13M5 10l6 6 6-6'/>"
});
Object.assign(TN, { angle: "Trend angle", infoline: "Info line", regr: "Regression trend", fibtz: "Fib time zones", fibfan: "Fib speed resistance fan", fibcirc: "Fib circles", gannbox: "Gann box",
  daterange: "Date range", pricerange: "Price range", dprange: "Date and price range", circle: "Circle", pricelabel: "Price label", flag: "Flag mark", arrowup: "Arrow mark up", arrowdown: "Arrow mark down" });
function addTools(gid, list) { var g = grpById(gid); list.forEach(function (t) { if (g.tools.indexOf(t) < 0) g.tools.push(t); }); }
addTools("lines", ["angle", "infoline", "regr"]); addTools("fib", ["fibtz", "fibfan", "fibcirc", "gannbox"]);
addTools("fore", ["daterange", "pricerange", "dprange"]); addTools("shape", ["circle"]); addTools("note", ["pricelabel", "flag", "arrowup", "arrowdown"]);

function xtBox(txt, x, y, col) { ctx.font = "11px " + css("--font-mono"); var w = ctx.measureText(txt).width + 12; x = Math.max(2, Math.min(G.pw - w - 2, x)); ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillRect(x, y, w, 18); ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, x + 6, y + 9.5); ctx.restore(); }
function xtDelta(d) { var dp = d.p2.p - d.p1.p, nb = Math.round((d.p2.t - d.p1.t) / S.tf.s); return { dp: dp, pc: dp / d.p1.p * 100, nb: nb, dt: d.p2.t - d.p1.t }; }
function drawXT(d, C, a, b, col) {
  if (XT2[d.type]) { drawXT2(d, C, a, b, col); return; }
  var t = d.type, pw = G.pw, ph = G.ph, dd = b ? xtDelta(d) : null, i, up = dd ? dd.dp >= 0 : true, sc = up ? C.up : C.down;
  function seg(p, q) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  function dot(p) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 6.2832); ctx.fill(); }
  if (t === "angle" && b) {
    seg(a, b); dot(a); ctx.setLineDash([3, 4]); seg(a, { x: Math.max(a.x, b.x) + 40, y: a.y }); ctx.setLineDash([]);
    var ang = -Math.atan2(b.y - a.y, b.x - a.x), deg = ang * 180 / Math.PI, dir = b.x >= a.x;
    ctx.beginPath(); ctx.arc(a.x, a.y, 28, dir ? 0 : Math.PI, dir ? -ang : Math.PI - ang, (dir ? ang > 0 : ang < 0) !== !dir); ctx.stroke();
    xtBox(Math.abs(deg).toFixed(1) + "\u00B0", b.x + 8, b.y - 9, col);
  } else if (t === "infoline" && b) {
    seg(a, b); dot(a); dot(b);
    xtBox((dd.dp >= 0 ? "+" : "") + fmt(dd.dp, S.sym.dec) + " (" + (dd.pc >= 0 ? "+" : "") + dd.pc.toFixed(2) + "%)  " + dd.nb + " bars, " + dur(dd.dt), (a.x + b.x) / 2 - 60, Math.min(a.y, b.y) - 26, sc);
  } else if (t === "regr" && b) {
    var i1 = Math.max(0, Math.round(Math.min(tToI(d.p1.t), tToI(d.p2.t)))), i2 = Math.min(bars.length - 1, Math.round(Math.max(tToI(d.p1.t), tToI(d.p2.t)))), n = i2 - i1 + 1;
    if (n < 3) { seg(a, b); return; }
    var sx = 0, sy = 0, sxy = 0, sxx = 0; for (i = 0; i < n; i++) { var y = bars[i1 + i].c; sx += i; sy += y; sxy += i * y; sxx += i * i; }
    var sl = (n * sxy - sx * sy) / ((n * sxx - sx * sx) || 1), ic = (sy - sl * sx) / n, sd = 0; for (i = 0; i < n; i++) { var r = bars[i1 + i].c - (ic + sl * i); sd += r * r; } sd = Math.sqrt(sd / n);
    var P = function (k, off) { return { x: G.X(i1 + k), y: G.Yp(ic + sl * k + off) }; };
    ctx.globalAlpha = 0.08; ctx.beginPath(); ctx.moveTo(P(0, 2 * sd).x, P(0, 2 * sd).y); ctx.lineTo(P(n - 1, 2 * sd).x, P(n - 1, 2 * sd).y); ctx.lineTo(P(n - 1, -2 * sd).x, P(n - 1, -2 * sd).y); ctx.lineTo(P(0, -2 * sd).x, P(0, -2 * sd).y); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    seg(P(0, 0), P(n - 1, 0)); ctx.setLineDash([5, 4]); seg(P(0, 2 * sd), P(n - 1, 2 * sd)); seg(P(0, -2 * sd), P(n - 1, -2 * sd)); ctx.setLineDash([]);
  } else if (t === "fibtz" && b) {
    var dx = b.x - a.x, L = [0, 1, 2, 3, 5, 8, 13, 21, 34]; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "top";
    L.forEach(function (f) { var x = a.x + dx * f; if (x < -10 || x > pw + 10) return; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, ph); ctx.stroke(); ctx.fillText(String(f), x + 3, 4); });
    ctx.globalAlpha = 0.6; ctx.setLineDash([3, 4]); seg(a, { x: b.x, y: a.y }); ctx.globalAlpha = 1; ctx.setLineDash([]);
  } else if (t === "fibfan" && b) {
    ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.25, 0.382, 0.5, 0.618, 0.75, 1].forEach(function (r) { var tp = { x: b.x, y: a.y + (b.y - a.y) * r }, e = extendRay(a, tp, pw); ctx.lineWidth = r === 1 ? 1.5 : 1; seg(a, e); ctx.fillText(String(r), Math.min(pw - 28, b.x + 4), tp.y - 2); });
    ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg({ x: b.x, y: a.y }, b); ctx.globalAlpha = 1; ctx.setLineDash([]);
  } else if (t === "fibcirc" && b) {
    var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2, R0 = Math.hypot(b.x - a.x, b.y - a.y) / 2; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.382, 0.5, 0.618, 1, 1.618].forEach(function (r) { ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R0 * r, 0, 6.2832); ctx.stroke(); ctx.fillText(String(r), cx + R0 * r + 3, cy - 2); });
    ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.globalAlpha = 1; ctx.setLineDash([]);
  } else if (t === "gannbox" && b) {
    var gx = Math.min(a.x, b.x), gy = Math.min(a.y, b.y), gw = Math.abs(b.x - a.x), gh = Math.abs(b.y - a.y);
    ctx.globalAlpha = 0.06; ctx.fillRect(gx, gy, gw, gh); ctx.globalAlpha = 1; ctx.strokeRect(gx, gy, gw, gh); ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(function (r) { ctx.beginPath(); ctx.moveTo(gx + gw * r, gy); ctx.lineTo(gx + gw * r, gy + gh); ctx.moveTo(gx, gy + gh * r); ctx.lineTo(gx + gw, gy + gh * r); ctx.stroke(); });
    ctx.globalAlpha = 0.7; seg({ x: gx, y: gy }, { x: gx + gw, y: gy + gh }); seg({ x: gx, y: gy + gh }, { x: gx + gw, y: gy }); ctx.globalAlpha = 1;
  } else if (t === "daterange" && b) {
    var x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), my = (a.y + b.y) / 2;
    ctx.globalAlpha = 0.09; ctx.fillRect(x0, 0, x1 - x0, ph); ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(Math.round(x0) + 0.5, 0); ctx.lineTo(Math.round(x0) + 0.5, ph); ctx.moveTo(Math.round(x1) + 0.5, 0); ctx.lineTo(Math.round(x1) + 0.5, ph); ctx.stroke();
    seg({ x: x0, y: my }, { x: x1, y: my }); ctx.beginPath(); ctx.moveTo(x1 - 6, my - 4); ctx.lineTo(x1, my); ctx.lineTo(x1 - 6, my + 4); ctx.stroke();
    xtBox(Math.abs(dd.nb) + " bars, " + dur(Math.abs(dd.dt)), (x0 + x1) / 2 - 50, my - 26, col);
  } else if (t === "pricerange" && b) {
    var y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y), xa = Math.min(a.x, b.x), xb = Math.max(a.x, b.x, xa + 80), mx = (xa + xb) / 2;
    ctx.globalAlpha = 0.09; ctx.fillRect(xa, y0, xb - xa, y1 - y0); ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(xa, Math.round(y0) + 0.5); ctx.lineTo(xb, Math.round(y0) + 0.5); ctx.moveTo(xa, Math.round(y1) + 0.5); ctx.lineTo(xb, Math.round(y1) + 0.5); ctx.stroke();
    seg({ x: mx, y: y1 }, { x: mx, y: y0 }); ctx.beginPath(); ctx.moveTo(mx - 4, y0 + 6); ctx.lineTo(mx, y0); ctx.lineTo(mx + 4, y0 + 6); ctx.stroke();
    xtBox((dd.dp >= 0 ? "+" : "") + fmt(dd.dp, S.sym.dec) + " (" + (dd.pc >= 0 ? "+" : "") + dd.pc.toFixed(2) + "%)", mx - 50, (y0 + y1) / 2 - 9, col);
  } else if (t === "dprange" && b) {
    var rx = Math.min(a.x, b.x), ry = Math.min(a.y, b.y), rw = Math.abs(b.x - a.x), rh = Math.abs(b.y - a.y);
    ctx.globalAlpha = 0.1; ctx.fillStyle = sc; ctx.fillRect(rx, ry, rw, rh); ctx.globalAlpha = 1; ctx.strokeStyle = sc; ctx.strokeRect(rx, ry, rw, rh);
    xtBox((dd.dp >= 0 ? "+" : "") + fmt(dd.dp, S.sym.dec) + " (" + (dd.pc >= 0 ? "+" : "") + dd.pc.toFixed(2) + "%), " + Math.abs(dd.nb) + " bars, " + dur(Math.abs(dd.dt)), rx + rw / 2 - 90, ry - 22 < 2 ? ry + rh + 4 : ry - 22, sc);
  } else if (t === "circle" && b) {
    var rr = Math.hypot(b.x - a.x, b.y - a.y); ctx.beginPath(); ctx.arc(a.x, a.y, rr, 0, 6.2832); ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); dot(a);
  } else if (t === "pricelabel") {
    var txt = fmtAxis(d.p1.p); ctx.font = "600 11px " + css("--font-mono"); var tw = ctx.measureText(txt).width + 14;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + 7, a.y - 9); ctx.lineTo(a.x + 7 + tw, a.y - 9); ctx.lineTo(a.x + 7 + tw, a.y + 9); ctx.lineTo(a.x + 7, a.y + 9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, a.x + 14, a.y + 0.5);
  } else if (t === "flag") {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, a.y - 30); ctx.stroke(); ctx.beginPath(); ctx.moveTo(a.x, a.y - 30); ctx.lineTo(a.x + 20, a.y - 30); ctx.lineTo(a.x + 14, a.y - 23); ctx.lineTo(a.x + 20, a.y - 16); ctx.lineTo(a.x, a.y - 16); ctx.closePath(); ctx.fill(); dot(a);
  } else if (t === "arrowup" || t === "arrowdown") {
    var s = t === "arrowup" ? 1 : -1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x - 9, a.y + 11 * s); ctx.lineTo(a.x - 3.5, a.y + 11 * s); ctx.lineTo(a.x - 3.5, a.y + 24 * s); ctx.lineTo(a.x + 3.5, a.y + 24 * s); ctx.lineTo(a.x + 3.5, a.y + 11 * s); ctx.lineTo(a.x + 9, a.y + 11 * s); ctx.closePath(); ctx.fill();
  }
}
function hitXT(d, a, b, x, y) {
  if (XT2[d.type]) return hitXT2(d, a, b, x, y);
  var t = d.type;
  if (XT1[t]) { if (t === "pricelabel") return x >= a.x - 4 && x <= a.x + 90 && y >= a.y - 11 && y <= a.y + 11; if (t === "flag") return x >= a.x - 6 && x <= a.x + 24 && y >= a.y - 34 && y <= a.y + 4; return Math.abs(x - a.x) < 12 && y >= Math.min(a.y, a.y + (t === "arrowup" ? 26 : -26)) - 2 && y <= Math.max(a.y, a.y + (t === "arrowup" ? 26 : -26)) + 2; }
  if (!b) return false;
  if (t === "angle" || t === "infoline" || t === "regr") return dSeg(x, y, a, b) < TOL;
  if (t === "circle") return Math.hypot(x - a.x, y - a.y) <= Math.hypot(b.x - a.x, b.y - a.y) + 4;
  if (t === "fibtz") { var dx = b.x - a.x; return [0, 1, 2, 3, 5, 8, 13, 21, 34].some(function (f) { return Math.abs(x - (a.x + dx * f)) < TOL; }); }
  if (t === "fibfan") return [0.25, 0.382, 0.5, 0.618, 0.75, 1].some(function (r) { return dSeg(x, y, a, extendRay(a, { x: b.x, y: a.y + (b.y - a.y) * r }, G.pw)) < TOL; });
  if (t === "fibcirc") { var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2, R0 = Math.hypot(b.x - a.x, b.y - a.y) / 2, dd = Math.hypot(x - cx, y - cy); return [0.382, 0.5, 0.618, 1, 1.618].some(function (r) { return Math.abs(dd - R0 * r) < TOL; }); }
  if (t === "daterange") return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x) + 4;
  return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x, Math.min(a.x, b.x) + 80) + 4 && y >= Math.min(a.y, b.y) - 4 && y <= Math.max(a.y, b.y) + 4;
}

/* ===== gelombang 2 ===== */
var XT2 = { flattop: 1, schiff: 1, mschiff: 1, fibchannel: 1, fibarcs: 1, gannfan: 1, fibspiral: 1, cyclic: 1, sine: 1, trishape: 1, rotrect: 1, avwap: 1, volprofile: 1, note: 1, callout: 1, comment: 1, pricenote: 1, pin: 1 };
var XTXT = { note: 1, callout: 1, comment: 1, pricenote: 1, pin: 1 };
Object.keys(XT2).forEach(function (k) { XT[k] = 1; EXTRA[k] = 1; });
["flattop", "schiff", "mschiff", "fibchannel"].forEach(function (k) { THREE[k] = 1; });
["fibarcs", "gannfan", "fibspiral", "cyclic", "sine", "volprofile"].forEach(function (k) { TWO[k] = 1; });
ONE.avwap = 1; NP.trishape = 3; NP.rotrect = 3; NP.cypher = 5; EXTRA.cypher = 1; PLBL.cypher = ["X", "A", "B", "C", "D"];
Object.assign(ICONS, {
  flattop: "<path d='M4 16L15 9M5 5h13'/><path d='M4 16L5 5' stroke-dasharray='2 2'/>", schiff: "<path d='M4 17L18 8M4 12L18 5M8 19L19 12' />", mschiff: "<path d='M5 15L18 9M5 10L18 4M9 19L19 13'/>",
  fibchannel: "<path d='M3 15L18 8M3 12L18 5M3 9L18 2' /><path d='M3 18L18 11' stroke-dasharray='2 2'/>", fibarcs: "<path d='M5 18a13 13 0 0 1 13-13M5 18a8 8 0 0 1 8-8'/>",
  gannfan: "<path d='M4 18L19 3M4 18L19 8M4 18L19 13M4 18L13 3M4 18L8 3'/>", fibspiral: "<path d='M11 11a2 2 0 0 1 2 2 4 4 0 0 1-4 4 7 7 0 0 1-7-7 11 11 0 0 1 11-9'/>",
  cypher: "<path d='M3 15L7 6l5 8 4-11 3 14'/>", cyclic: "<path d='M4 4v14M9 4v14M14 4v14M19 4v14'/>", sine: "<path d='M2 11c2-8 4-8 6 0s4 8 6 0 4-8 6 0'/>",
  trishape: "<path d='M11 4L4 17h14z'/>", rotrect: "<path d='M4 9l9-5 5 9-9 5z'/>", avwap: "<path d='M3 15c4 0 4-7 8-5s5-4 8-2'/><circle cx='3' cy='15' r='1.8'/>",
  volprofile: "<path d='M4 4v14M4 6h8M4 9h12M4 12h7M4 15h5'/>", note: "<path d='M4 4h14v11H10l-4 4v-4H4z'/>", callout: "<path d='M3 5h12v8H9l-5 5v-5H3z'/>",
  comment: "<path d='M4 4h14v10H11l-4 4v-4H4z'/><path d='M7 8h8M7 11h5'/>", pricenote: "<path d='M3 11h16M5 6h9v5H5z'/>", pin: "<path d='M11 3a5 5 0 0 1 5 5c0 4-5 10-5 10S6 12 6 8a5 5 0 0 1 5-5z'/><circle cx='11' cy='8' r='1.8'/>"
});
Object.assign(TN, { flattop: "Flat top/bottom", schiff: "Schiff pitchfork", mschiff: "Modified Schiff pitchfork", fibchannel: "Fib channel", fibarcs: "Fib speed resistance arcs", gannfan: "Gann fan", fibspiral: "Fib spiral",
  cypher: "Cypher pattern", cyclic: "Cyclic lines", sine: "Sine line", trishape: "Triangle", rotrect: "Rotated rectangle", avwap: "Anchored VWAP", volprofile: "Fixed range volume profile",
  note: "Note", callout: "Callout", comment: "Comment", pricenote: "Price note", pin: "Pin" });
addTools("lines", ["flattop", "schiff", "mschiff"]); addTools("fib", ["fibchannel", "fibarcs", "gannfan", "fibspiral"]); addTools("pat", ["cypher", "cyclic", "sine"]);
addTools("fore", ["avwap", "volprofile"]); addTools("shape", ["trishape", "rotrect"]); addTools("note", ["note", "pricenote", "callout", "comment", "pin"]);

function xtPoly(pts, close) { ctx.beginPath(); pts.forEach(function (q, k) { if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); if (close) ctx.closePath(); }
function xtTextBox(d, x, y, col, rounded) {
  var s = d.text || ""; ctx.font = "600 12px " + css("--font-body"); var w = Math.max(24, ctx.measureText(s).width + 16);
  ctx.fillStyle = col; ctx.globalAlpha = 0.95; if (rounded && ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, 24, 6); ctx.fill(); } else ctx.fillRect(x, y, w, 24); ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, x + 8, y + 12.5); return w;
}
function drawXT2(d, C, a, b, col) {
  var t = d.type, pw = G.pw, ph = G.ph, c3 = d.p3 ? pxOf(d.p3) : null, i;
  function seg(p, q) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  function dot(p) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 6.2832); ctx.fill(); }
  if (t === "flattop" && b) {
    seg(a, b); if (c3) { var ya = c3.y; seg({ x: a.x, y: ya }, { x: b.x, y: ya }); ctx.globalAlpha = 0.08; xtPoly([a, b, { x: b.x, y: ya }, { x: a.x, y: ya }], true); ctx.fill(); ctx.globalAlpha = 1; }
  } else if ((t === "schiff" || t === "mschiff") && b) {
    if (!c3) { seg(a, b); return; }
    var o = t === "schiff" ? { x: a.x, y: (a.y + b.y) / 2 } : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, L3 = pitchLines(o, b, c3);
    ctx.globalAlpha = 0.07; xtPoly([L3[1][0], L3[1][1], L3[2][1], L3[2][0]], true); ctx.fill(); ctx.globalAlpha = 1;
    L3.forEach(function (l, k) { ctx.lineWidth = k === 0 ? (d.w || 1.5) : 1; seg(l[0], l[1]); }); ctx.lineWidth = d.w || 1.5; seg(b, c3); ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1;
  } else if (t === "fibchannel" && b) {
    seg(a, b); if (!c3) return; var off = channelOff(a, b, c3); ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618].forEach(function (r) { ctx.lineWidth = 1; seg({ x: a.x, y: a.y + off * r }, { x: b.x, y: b.y + off * r }); ctx.fillText(String(r), b.x + 4, b.y + off * r - 2); });
    ctx.globalAlpha = 0.06; xtPoly([a, b, { x: b.x, y: b.y + off }, { x: a.x, y: a.y + off }], true); ctx.fill(); ctx.globalAlpha = 1;
  } else if (t === "fibarcs" && b) {
    var th = Math.atan2(a.y - b.y, a.x - b.x), R = Math.hypot(a.x - b.x, a.y - b.y); ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.382, 0.5, 0.618, 1, 1.618].forEach(function (r) { ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(b.x, b.y, R * r, th - Math.PI / 2, th + Math.PI / 2); ctx.stroke(); });
    ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1;
  } else if (t === "gannfan" && b) {
    var dx = b.x - a.x; if (Math.abs(dx) < 2) return; var s1 = (b.y - a.y) / dx; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [[1, 8], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [8, 1]].forEach(function (rt) { var sl = s1 * rt[1] / rt[0], e = extendRay(a, { x: a.x + (dx > 0 ? 100 : -100), y: a.y + sl * (dx > 0 ? 100 : -100) }, pw); ctx.lineWidth = rt[0] === 1 && rt[1] === 1 ? 1.8 : 1; seg(a, e); var lx = Math.max(10, Math.min(pw - 30, e.x)); ctx.fillText(rt[1] + "x" + rt[0], lx - 14, Math.max(10, Math.min(ph - 4, e.y))); });
  } else if (t === "fibspiral" && b) {
    var ang0 = Math.atan2(b.y - a.y, b.x - a.x), RR = Math.hypot(b.x - a.x, b.y - a.y), kk = Math.log(1.618) / (Math.PI / 2), pts = [];
    for (var q = -4 * Math.PI; q <= 0.001; q += 0.08) { var rr = RR * Math.exp(kk * q); pts.push({ x: a.x + rr * Math.cos(ang0 + q), y: a.y + rr * Math.sin(ang0 + q) }); }
    xtPoly(pts, false); ctx.stroke(); ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1;
  } else if (t === "cyclic" && b) {
    var cdx = b.x - a.x; if (Math.abs(cdx) < 4) return; var n0 = Math.ceil((0 - a.x) / cdx), n1 = Math.floor((pw - a.x) / cdx), lo2 = Math.min(n0, n1), hi2 = Math.max(n0, n1);
    for (i = lo2; i <= hi2; i++) { var cx = Math.round(a.x + i * cdx) + 0.5; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, ph); ctx.stroke(); }
  } else if (t === "sine" && b) {
    var sdx = b.x - a.x; if (Math.abs(sdx) < 3) return; var mid = (a.y + b.y) / 2, amp = (a.y - b.y) / 2, sp = [], xx;
    for (xx = 0; xx <= pw; xx += 3) sp.push({ x: xx, y: mid + amp * Math.cos(Math.PI * (xx - a.x) / sdx) }); xtPoly(sp, false); ctx.stroke(); dot(a); dot(b);
  } else if (t === "trishape" && d.pts) {
    var tp = d.pts.map(pxOf); ctx.globalAlpha = 0.12; xtPoly(tp, true); ctx.fill(); ctx.globalAlpha = 1; xtPoly(tp, tp.length > 2); ctx.stroke(); tp.forEach(dot);
  } else if (t === "rotrect" && d.pts) {
    var rp = d.pts.map(pxOf); if (rp.length < 3) { xtPoly(rp, false); ctx.stroke(); return; }
    var ex = rp[1].x - rp[0].x, ey = rp[1].y - rp[0].y, el = Math.hypot(ex, ey) || 1, nx = -ey / el, ny = ex / el, hh = (rp[2].x - rp[0].x) * nx + (rp[2].y - rp[0].y) * ny;
    var poly = [rp[0], rp[1], { x: rp[1].x + nx * hh, y: rp[1].y + ny * hh }, { x: rp[0].x + nx * hh, y: rp[0].y + ny * hh }]; ctx.globalAlpha = 0.12; xtPoly(poly, true); ctx.fill(); ctx.globalAlpha = 1; xtPoly(poly, true); ctx.stroke(); rp.forEach(dot);
  } else if (t === "avwap") {
    var i0 = Math.max(0, Math.min(bars.length - 1, Math.round(tToI(d.p1.t)))), cp = 0, cv = 0, started = false; ctx.lineWidth = d.w || 1.5; ctx.beginPath();
    for (i = i0; i < G.nv; i++) { var bb = bars[i], v = bb.v || 1; cp += (bb.h + bb.l + bb.c) / 3 * v; cv += v; if (i < G.iL) continue; if (i > G.iR) break; var py = G.Yp(cp / cv), px = G.X(i); if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py); }
    ctx.stroke(); dot(a); ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("AVWAP", a.x + 6, a.y - 6);
  } else if (t === "volprofile" && b) {
    var j1 = Math.max(0, Math.round(Math.min(tToI(d.p1.t), tToI(d.p2.t)))), j2 = Math.min(bars.length - 1, Math.round(Math.max(tToI(d.p1.t), tToI(d.p2.t)))); if (j2 <= j1) return;
    var lo = Infinity, hi = -Infinity, N = 24; for (i = j1; i <= j2; i++) { if (bars[i].l < lo) lo = bars[i].l; if (bars[i].h > hi) hi = bars[i].h; }
    var rows = [], stp = (hi - lo) / N || 1; for (i = 0; i < N; i++) rows.push(0);
    for (i = j1; i <= j2; i++) { var bv = bars[i], r0 = Math.max(0, Math.floor((bv.l - lo) / stp)), r1 = Math.min(N - 1, Math.floor((bv.h - lo) / stp - 1e-9)), cntR = Math.max(1, r1 - r0 + 1), k2; for (k2 = r0; k2 <= Math.max(r0, r1); k2++) rows[k2] += (bv.v || 1) / cntR; }
    var mxv = Math.max.apply(null, rows), poc = rows.indexOf(mxv), tot = rows.reduce(function (s, v) { return s + v; }, 0), vaLo = poc, vaHi = poc, acc = rows[poc];
    while (acc < tot * 0.7 && (vaLo > 0 || vaHi < N - 1)) { var dn = vaLo > 0 ? rows[vaLo - 1] : -1, up = vaHi < N - 1 ? rows[vaHi + 1] : -1; if (up >= dn) { vaHi++; acc += rows[vaHi]; } else { vaLo--; acc += rows[vaLo]; } }
    var xL = Math.min(a.x, b.x), xR = Math.max(a.x, b.x), maxW = Math.max(60, (xR - xL) * 0.6);
    ctx.globalAlpha = 0.05; ctx.fillRect(xL, Math.min(G.Yp(hi), G.Yp(lo)), xR - xL, Math.abs(G.Yp(lo) - G.Yp(hi))); ctx.globalAlpha = 1;
    rows.forEach(function (v, k3) { var y0 = G.Yp(lo + (k3 + 1) * stp), y1 = G.Yp(lo + k3 * stp); ctx.globalAlpha = k3 >= vaLo && k3 <= vaHi ? 0.55 : 0.25; ctx.fillStyle = k3 === poc ? C.warn || "#ff9800" : col; ctx.fillRect(xL, y0 + 0.5, v / mxv * maxW, Math.max(1, y1 - y0 - 1)); });
    ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.setLineDash([4, 3]); var py2 = G.Yp(lo + (poc + 0.5) * stp); ctx.strokeStyle = "#ff9800"; ctx.beginPath(); ctx.moveTo(xL, py2); ctx.lineTo(xR, py2); ctx.stroke(); ctx.setLineDash([]);
  } else if (XTXT[t]) {
    var w;
    if (t === "note") { seg(a, { x: a.x + 12, y: a.y - 14 }); dot(a); xtTextBox(d, a.x + 12, a.y - 38, col, true); }
    else if (t === "callout") { var bx = a.x + 34, by = a.y - 46; w = (ctx.font = "600 12px " + css("--font-body"), ctx.measureText(d.text || "").width + 16); seg(a, { x: bx + 10, y: by + 24 }); dot(a); xtTextBox(d, bx, by, col, false); }
    else if (t === "comment") { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + 6, a.y - 10); ctx.lineTo(a.x + 18, a.y - 10); ctx.closePath(); ctx.fill(); xtTextBox(d, a.x, a.y - 34, col, true); }
    else if (t === "pricenote") { ctx.setLineDash([4, 4]); seg(a, { x: pw, y: a.y }); ctx.setLineDash([]); dot(a); xtTextBox({ text: (d.text || "") + "  " + fmtAxis(d.p1.p) }, a.x + 8, a.y - 12, col, true); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
    else if (t === "pin") { ctx.beginPath(); ctx.arc(a.x, a.y - 16, 7, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.moveTo(a.x - 4, a.y - 11); ctx.lineTo(a.x, a.y); ctx.lineTo(a.x + 4, a.y - 11); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(a.x, a.y - 16, 2.5, 0, 6.2832); ctx.fill(); ctx.fillStyle = col; if (d.text) xtTextBox(d, a.x + 12, a.y - 28, col, true); }
  }
}
function hitXT2(d, a, b, x, y) {
  var t = d.type, c3 = d.p3 ? pxOf(d.p3) : null, i;
  if (XTXT[t]) return x >= a.x - 8 && x <= a.x + 220 && y >= a.y - 52 && y <= a.y + 8;
  if (t === "avwap") return Math.hypot(x - a.x, y - a.y) < 14;
  if ((t === "trishape" || t === "rotrect") && d.pts) { var pp = d.pts.map(pxOf), xs = pp.map(function (q) { return q.x; }), ys = pp.map(function (q) { return q.y; }); return x >= Math.min.apply(null, xs) - 5 && x <= Math.max.apply(null, xs) + 5 && y >= Math.min.apply(null, ys) - 5 && y <= Math.max.apply(null, ys) + 5; }
  if (!b) return false;
  if (t === "flattop" || t === "schiff" || t === "mschiff" || t === "fibchannel") { var pts = [a, b].concat(c3 ? [c3] : []), x0 = Math.min.apply(null, pts.map(function (q) { return q.x; })), x1 = Math.max.apply(null, pts.map(function (q) { return q.x; })), y0 = Math.min.apply(null, pts.map(function (q) { return q.y; })), y1 = Math.max.apply(null, pts.map(function (q) { return q.y; })); return dSeg(x, y, a, b) < TOL || (c3 && x >= x0 - 4 && x <= x1 + 4 && y >= y0 - 4 && y <= y1 + 4 && t !== "schiff" && t !== "mschiff"); }
  if (t === "fibarcs") { var R = Math.hypot(a.x - b.x, a.y - b.y), dd = Math.hypot(x - b.x, y - b.y); return [0.382, 0.5, 0.618, 1, 1.618].some(function (r) { return Math.abs(dd - R * r) < TOL; }); }
  if (t === "gannfan") { var dx = b.x - a.x; if (Math.abs(dx) < 2) return false; var s1 = (b.y - a.y) / dx; return [[1, 8], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [8, 1]].some(function (rt) { var sl = s1 * rt[1] / rt[0]; return dSeg(x, y, a, extendRay(a, { x: a.x + (dx > 0 ? 100 : -100), y: a.y + sl * (dx > 0 ? 100 : -100) }, G.pw)) < TOL; }); }
  if (t === "fibspiral") return Math.hypot(x - a.x, y - a.y) <= Math.hypot(b.x - a.x, b.y - a.y) * 1.05 && Math.hypot(x - a.x, y - a.y) > 2;
  if (t === "cyclic") { var cdx = b.x - a.x; if (Math.abs(cdx) < 4) return false; var m = ((x - a.x) % cdx + cdx) % cdx; return Math.min(m, Math.abs(cdx) - m) < TOL; }
  if (t === "sine") { var sdx = b.x - a.x; if (Math.abs(sdx) < 3) return false; return Math.abs(y - ((a.y + b.y) / 2 + (a.y - b.y) / 2 * Math.cos(Math.PI * (x - a.x) / sdx))) < TOL; }
  return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x) + 4 && y >= Math.min(a.y, b.y) - 4 && y <= Math.max(a.y, b.y) + 4;
}
