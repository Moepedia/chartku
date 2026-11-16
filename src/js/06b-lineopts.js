/* 06b-lineopts: opsi garis ala TradingView (ujung panah, extend, middle point, price labels, stats, teks pada garis) + template */
var LINE_T = { trend: 1, ray: 1, extended: 1, arrow: 1 };
var TPL_KEYS = ["c", "cx", "w", "ls", "fo", "ea1", "ea2", "ext", "mid", "pl", "st", "sp", "sa", "lfs", "lb", "li", "lc", "lv", "lh"];
function tplStore() { try { return JSON.parse(localStorage.getItem("aurum.tpl.v1") || "{}"); } catch (e) { return {}; } }
function tplSave(store) { try { localStorage.setItem("aurum.tpl.v1", JSON.stringify(store)); } catch (e) { /* storage penuh */ } }
function tplApply(d, props) { TPL_KEYS.forEach(function (k) { delete d[k]; }); Object.keys(props || {}).forEach(function (k) { d[k] = props[k]; }); }
function tplCapture(d) { var o = {}; TPL_KEYS.forEach(function (k) { if (d[k] !== undefined) o[k] = d[k]; }); return o; }
function arrowHead(p, q, col, size) { var ang = Math.atan2(q.y - p.y, q.x - p.x); ctx.save(); ctx.fillStyle = col; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - size * Math.cos(ang - 0.45), q.y - size * Math.sin(ang - 0.45)); ctx.lineTo(q.x - size * Math.cos(ang + 0.45), q.y - size * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill(); ctx.restore(); }
function drawLineOpts(d, a, b, col, C) {
  if (!b || !LINE_T[d.type]) return;
  var pw = G.pw;
  if (d.type === "trend" && d.ext) {
    ctx.beginPath();
    if (d.ext === 1 || d.ext === 3) { var l = extendRay(b, a, pw); ctx.moveTo(a.x, a.y); ctx.lineTo(l.x, l.y); }
    if (d.ext === 2 || d.ext === 3) { var r = extendRay(a, b, pw); ctx.moveTo(b.x, b.y); ctx.lineTo(r.x, r.y); }
    ctx.stroke();
  }
  var sz = 6 + (d.w || 1.5) * 1.5;
  if (d.ea1) arrowHead(b, a, col, sz);
  if (d.ea2) arrowHead(a, b, col, sz);
  if (d.mid) { ctx.beginPath(); ctx.arc((a.x + b.x) / 2, (a.y + b.y) / 2, 3.2, 0, 6.2832); ctx.fill(); }
  if (d.pl && d.p1 && d.p2) { G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); G.tags.push({ y: b.y, text: fmtAxis(d.p2.p), bg: col, fg: C.bg }); }
  if (d.st && d.p2 && (d.sa || S.sel === d.id)) {
    var dp = d.p2.p - d.p1.p, pc = dp / d.p1.p * 100, nb = Math.round((d.p2.t - d.p1.t) / S.tf.s), txt = (dp >= 0 ? "+" : "") + fmt(dp, S.sym.dec) + " (" + (pc >= 0 ? "+" : "") + pc.toFixed(2) + "%)";
    if (d.st === 2) txt += "  " + Math.abs(nb) + " bars, " + dur(Math.abs(d.p2.t - d.p1.t));
    var base = d.sp === "left" ? a : d.sp === "center" ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : b;
    xtBox(txt, base.x - (d.sp === "left" ? 0 : d.sp === "center" ? 60 : 110), base.y + (b.y <= a.y ? 8 : -26), dp >= 0 ? C.up : C.down);
  }
  if (d.lt) {
    var ang = Math.atan2(b.y - a.y, b.x - a.x); if (ang > Math.PI / 2) ang -= Math.PI; else if (ang < -Math.PI / 2) ang += Math.PI;
    var hx = d.lh === "left" ? 0.12 : d.lh === "center" ? 0.5 : 0.88, ax = a.x + (b.x - a.x) * hx, ay = a.y + (b.y - a.y) * hx;
    ctx.save(); ctx.setLineDash([]); ctx.translate(ax, ay); ctx.rotate(ang); ctx.fillStyle = d.lc || col; ctx.font = (d.li ? "italic " : "") + (d.lb ? "700 " : "500 ") + (d.lfs || 12) + "px " + css("--font-body"); ctx.textAlign = "center"; ctx.textBaseline = d.lv === "bottom" ? "top" : d.lv === "middle" ? "middle" : "bottom"; ctx.fillText(d.lt, 0, d.lv === "bottom" ? 6 : d.lv === "middle" ? 0 : -6); ctx.restore();
  }
}
