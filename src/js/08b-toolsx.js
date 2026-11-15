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
