/* 08-tools-input: toolbar alat, hit-test, pointer, seleksi */
/* ---------- tools rail ---------- */
var ICONS = {
  cursor: "<path d='M5 3l13 7-6 2-2 6z'/>", trend: "<path d='M4 17L17 5'/><circle cx='4' cy='17' r='1.8'/><circle cx='17' cy='5' r='1.8'/>",
  ray: "<path d='M4 16L19 6'/><circle cx='4' cy='16' r='1.8'/><path d='M15 5l4 1-1 4'/>", hline: "<path d='M3 10h14'/><circle cx='10' cy='10' r='1.8'/>",
  vline: "<path d='M10 3v14'/><circle cx='10' cy='10' r='1.8'/>", rect: "<rect x='4' y='5' width='13' height='10' rx='1'/>",
  fib: "<path d='M3 4h15M3 9h15M3 14h15M3 19h15'/><path d='M5 18L16 5' stroke-dasharray='2 2'/>", text: "<path d='M5 5h12M11 5v13'/>",
  measure: "<path d='M4 16L16 4M4 16l3 0M4 16l0-3M16 4l-3 0M16 4l0 3'/>",
  arrow: "<path d='M4 17L17 5M17 5h-6M17 5v6'/>", channel: "<path d='M3 14L17 6M3 19L17 11'/><path d='M3 14v5M17 6v5' stroke-dasharray='2 2'/>",
  pitch: "<path d='M4 17L18 6M4 17L18 12M4 17L12 4'/>", ellipse: "<ellipse cx='11' cy='11' rx='7' ry='5'/>", fibext: "<path d='M3 5h15M3 9h15M3 13h15M3 18h15'/><path d='M4 17L10 9' stroke-dasharray='2 2'/>",
  long: "<rect x='4' y='4' width='13' height='7'/><rect x='4' y='11' width='13' height='6'/><path d='M4 11h13'/>", short: "<rect x='4' y='5' width='13' height='6'/><rect x='4' y='11' width='13' height='7'/><path d='M4 11h13'/>",
  brush: "<path d='M4 17c2-1 2-4 5-4s1 3 4 2 3-8 5-9'/>",
  extended: "<path d='M2 18L20 4'/><circle cx='8' cy='13.4' r='1.8'/><circle cx='14.5' cy='8.3' r='1.8'/>", hray: "<path d='M4 11h15'/><circle cx='4' cy='11' r='1.8'/><path d='M16 8l3 3-3 3'/>",
  cross: "<path d='M3 11h16M11 3v16'/><circle cx='11' cy='11' r='1.8'/>", eraser: "<path d='M7.5 18H17M4.5 13.5l7.5-7.5 4.5 4.5-6 6H7.5z'/><path d='M8.5 9.5l4.5 4.5'/>",
  keep: "<path d='M4 17l1.5-4.5L14 4l3.5 3.5-8.5 8.5z'/><path d='M12 6l3.5 3.5'/><path d='M4 20h14'/>", eye: "<path d='M2 11s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z'/><circle cx='11' cy='11' r='2.5'/>", magnet: "<path d='M5 4v7a5 5 0 0 0 10 0V4M5 7h4M11 7h4'/>", trash: "<path d='M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11'/>",
  lock: "<rect x='5' y='10' width='12' height='9' rx='1.5'/><path d='M8 10V7a3 3 0 0 1 6 0v3'/>",
  emoji: "<circle cx='11' cy='11' r='7.5'/><path d='M8.2 9.6h.01M13.8 9.6h.01M8 13.4c1.8 1.7 4.2 1.7 6 0'/>",
  xabcd: "<path d='M3 16L7.5 5l4.5 8L16 4l3 13'/>", abcd: "<path d='M4 15L9 5l5 9 5-10'/>",
  triangle: "<path d='M4 14L9 6l5 7 5-9'/><path d='M4 18h15' stroke-dasharray='2 2'/>",
  hs: "<path d='M3 16l3-6 3 3 3-7 3 5 3-2 2 3'/>",
  elliott: "<path d='M3 18l3-9 3 4 3-9 3 5 4-5'/><path d='M3 18h16' stroke-dasharray='2 2'/>",
  drives: "<path d='M4 18L8 8l4 6 4-9'/><path d='M8 8l8-3' stroke-dasharray='2 2'/>"
};
var TN = { cursor: "Cross cursor", eraser: "Eraser", trend: "Trend line", ray: "Ray", extended: "Extended line", arrow: "Arrow", hline: "Horizontal line", hray: "Horizontal ray", vline: "Vertical line", cross: "Cross line", channel: "Parallel channel", pitch: "Andrews pitchfork", fib: "Fib retracement", fibext: "Fib extension", rect: "Rectangle", ellipse: "Ellipse", brush: "Brush", long: "Long position", short: "Short position", measure: "Measure", text: "Text note", emoji: "Icon", xabcd: "XABCD pattern", abcd: "ABCD pattern", triangle: "Triangle pattern", hs: "Head and shoulders", elliott: "Elliott impulse wave", drives: "Three drives" };
var TK = { cursor: "Esc", trend: "Alt+T", hline: "Alt+H", vline: "Alt+V", fib: "Alt+F", rect: "Alt+B", cross: "Alt+C", eraser: "Alt+E" };
var EMOJIS = ["\u2B50", "\uD83D\uDE80", "\uD83D\uDCC8", "\uD83D\uDCC9", "\uD83D\uDCB0", "\uD83D\uDC02", "\uD83D\uDC3B", "\u26A0\uFE0F", "\uD83D\uDD25", "\u2764\uFE0F", "\uD83D\uDC4D", "\uD83D\uDC4E", "\uD83C\uDFC6", "\uD83C\uDFAF", "\uD83D\uDC8E", "\u2753"];
var GROUPS = [
  { id: "cur", name: "Cursors", tools: ["cursor", "eraser"] },
  { id: "lines", name: "Trend line tools", tools: ["trend", "ray", "extended", "arrow", "hline", "hray", "vline", "cross", "channel", "pitch"] },
  { id: "fib", name: "Gann and Fibonacci tools", tools: ["fib", "fibext"] },
  { id: "pat", name: "Patterns", tools: ["xabcd", "abcd", "triangle", "hs", "elliott", "drives"] },
  { id: "fore", name: "Forecast and measurement tools", tools: ["long", "short", "measure"] },
  { id: "shape", name: "Geometric shapes", tools: ["rect", "ellipse", "brush"] },
  { id: "note", name: "Annotation tools", tools: ["text"] },
  { id: "icons", name: "Icons", tools: ["emoji"] }
];
function grpById(id) { return GROUPS.filter(function (g) { return g.id === id; })[0]; }
function grpOfTool(t) { return GROUPS.filter(function (g) { return g.tools.indexOf(t) >= 0; })[0]; }
function grpCur(g) { var c = S.gcur[g.id]; return g.tools.indexOf(c) >= 0 ? c : g.tools[0]; }
function svgI(t) { return "<svg viewBox='0 0 22 22' aria-hidden='true'>" + ICONS[t] + "</svg>"; }
var HINTS = { eraser: "Click or tap a drawing to erase it.", extended: "Click the first point, then a second point. The line extends both ways.", hray: "Click to place a horizontal ray that runs to the right.", cross: "Click to place a cross line (horizontal and vertical).", arrow: "Click the tail, then the head.", channel: "Click two points for the trend, then a third to set the channel width.", pitch: "Click the pivot, then the two swing points.", ellipse: "Click one corner, then the opposite corner.", fibext: "Click the swing start, then the swing end.", long: "Click the entry, then the target. Stop is mirrored (1:1).", short: "Click the entry, then the target. Stop is mirrored (1:1).", brush: "Press and drag to draw freehand.", cursor: "Drag to pan, pinch or scroll to zoom, double-click or double-tap a drawing, indicator or candle for its settings (empty area: chart settings). Tap a drawing to select it. Right-click or press and hold for chart actions.", trend: "Click the start point, then click the end point.", ray: "Click the start point, then a second point to set direction.",
  hline: "Click to place a horizontal line.", vline: "Click to place a vertical line.", rect: "Click one corner, then the opposite corner.", fib: "Click the swing start, then the swing end.", text: "Click where the note goes, type, press Enter.", measure: "Click the start, then the end to measure price, bars and time.", emoji: "Click to place the selected icon.", xabcd: "Click the five points: X, A, B, C, D.", abcd: "Click the four points: A, B, C, D.", triangle: "Click the five points: A, B, C, D, E.", hs: "Click the seven points of the head and shoulders.", elliott: "Click the six points: 0 through 5.", drives: "Click the five points: 0 through 4." };
function buildRail() {
  var h = "";
  GROUPS.forEach(function (g, gi) {
    h += "<button type='button' class='grp' data-g='" + g.id + "' data-tool='" + g.tools[0] + "' aria-pressed='false'" + (g.tools.length > 1 ? " aria-haspopup='menu'" : "") + ">" + (g.id === "icons" ? "<span class='em'>" + (S.emojiCh || "\u2B50") + "</span>" : svgI(g.tools[0])) + (g.tools.length > 1 ? "<span class='chev' data-chev='1' aria-hidden='true'></span>" : "") + "</button>";
    if (g.id === "cur" || g.id === "note") h += "<span class='sepv'></span>";
  });
  h += "<span class='sepv'></span>";
  h += "<button type='button' id='zoomIn' title='Perbesar' aria-label='Perbesar'><svg viewBox='0 0 22 22' aria-hidden='true'><circle cx='10' cy='10' r='6.5'/><path d='M15 15l4 4M7.5 10h5M10 7.5v5'/></svg></button>";
  h += "<button type='button' id='zoomOut' title='Perkecil' aria-label='Perkecil'><svg viewBox='0 0 22 22' aria-hidden='true'><circle cx='10' cy='10' r='6.5'/><path d='M15 15l4 4M7.5 10h5'/></svg></button>";
  h += "<button type='button' id='magnet' title='Magnet: snap ke open, high, low, close' aria-label='Magnet' aria-pressed='false'><svg viewBox='0 0 22 22' aria-hidden='true'>" + ICONS.magnet + "</svg></button>";
  h += "<button type='button' id='keepBtn' title='Stay in drawing mode: keep the tool selected after each drawing' aria-label='Stay in drawing mode' aria-pressed='false'>" + svgI("keep") + "</button>";
  h += "<button type='button' id='lockDr' title='Lock all drawings' aria-label='Lock all drawings' aria-pressed='false'><svg viewBox='0 0 22 22' aria-hidden='true'>" + ICONS.lock + "</svg></button>";
  h += "<button type='button' id='hideDr' title='Hide or show all drawings' aria-label='Hide drawings' aria-pressed='false'><svg viewBox='0 0 22 22' aria-hidden='true'>" + ICONS.eye + "</svg></button>";
  h += "<button type='button' id='clearD' title='Remove all drawings on this symbol' aria-label='Remove all drawings'><svg viewBox='0 0 22 22' aria-hidden='true'>" + ICONS.trash + "</svg></button>";
  $("#rail").innerHTML = h;
  var rail = $("#rail"), lpT = null, lpFired = false, lpX = 0, lpY = 0;
  function cancelLp() { clearTimeout(lpT); lpT = null; }
  rail.addEventListener("pointerdown", function (e) {
    lpFired = false; cancelLp(); var b = e.target.closest("button[data-g]"); if (!b) return;
    var g = grpById(b.dataset.g); if (g.tools.length < 2) return; lpX = e.clientX; lpY = e.clientY;
    lpT = setTimeout(function () { lpT = null; lpFired = true; openFly(g, b); }, 420);
  });
  rail.addEventListener("pointermove", function (e) { if (lpT && Math.hypot(e.clientX - lpX, e.clientY - lpY) > 8) cancelLp(); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (n) { rail.addEventListener(n, cancelLp); });
  rail.addEventListener("scroll", cancelLp);
  rail.addEventListener("contextmenu", function (e) { var b = e.target.closest("button[data-g]"); if (!b) return; e.preventDefault(); var g = grpById(b.dataset.g); if (g.tools.length > 1) openFly(g, b); });
  rail.addEventListener("click", function (e) {
    if (lpFired) { lpFired = false; return; }
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.g) {
      var g = grpById(b.dataset.g), c = b.dataset.tool;
      if (g.id === "icons") { openFly(g, b); return; }
      if (g.tools.length > 1 && (e.target.closest("[data-chev]") || (g.id !== "cur" && S.tool === c))) { openFly(g, b); return; }
      hideFly(); setTool(c);
    }
    else if (b.id === "magnet") { S.magnet = !S.magnet; syncUI(); save(); }
    else if (b.id === "zoomIn") { if (G.pw) { zoomAt(G.pw / 2, S.barW * 1.3); draw(); } }
    else if (b.id === "zoomOut") { if (G.pw) { zoomAt(G.pw / 2, S.barW / 1.3); draw(); } }
    else if (b.id === "keepBtn") { S.keep = !S.keep; syncUI(); syncDraw(true); save(); toast(S.keep ? "Stay in drawing mode is on. The tool stays selected after each drawing." : "Stay in drawing mode is off."); }
    else if (b.id === "lockDr") { var dl = S.drawings[S.sym.id] || []; if (!dl.length) { toast("Belum ada gambar di " + S.sym.label + "."); return; } var lk = dl.some(function (d) { return !d.lock; }); dl.forEach(function (d) { d.lock = lk; }); b.setAttribute("aria-pressed", String(lk)); S.sel = null; syncSel(); draw(); save(); toast(lk ? "Semua gambar dikunci." : "Kunci gambar dibuka."); }
    else if (b.id === "hideDr") { S.hideD = !S.hideD; syncUI(); draw(); }
    else if (b.id === "clearD") { snap(); S.drawings[S.sym.id] = []; S.sel = null; S.meas = null; syncSel(); draw(); save(); toast("Removed all drawings on " + S.sym.label); }
  });
  $("#fly").addEventListener("click", function (e) { e.stopPropagation(); var eb = e.target.closest("button[data-e]"); if (eb) { S.emojiCh = eb.dataset.e; setTool("emoji"); save(); return; } var b = e.target.closest("button[data-t]"); if (!b) return; setTool(b.dataset.t); });
  refreshRail();
}
var mqPhone = matchMedia("(max-width: 640px)");
function openFly(g, b) {
  var f = $("#fly"), h = "<h4>" + g.name + "</h4>"; closeAll(); hideCtx();
  if (g.id === "icons") { h += "<div class='emgrid'>" + EMOJIS.map(function (em) { return "<button type='button' role='menuitem' class='embtn' data-e='" + em + "' aria-pressed='" + (S.tool === "emoji" && S.emojiCh === em) + "'>" + em + "</button>"; }).join("") + "</div>"; }
  else g.tools.forEach(function (t) { h += "<button type='button' role='menuitem' data-t='" + t + "' aria-pressed='" + (S.tool === t) + "'>" + svgI(t) + "<span class='nm'>" + TN[t] + "</span>" + (TK[t] ? "<kbd>" + TK[t] + "</kbd>" : "") + "</button>"; });
  f.innerHTML = h; f.hidden = false;
  var r = b.getBoundingClientRect(), fr = f.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight, left, top;
  if (mqPhone.matches) { left = Math.max(8, Math.min(r.left, vw - fr.width - 8)); top = r.bottom + 6; if (top + fr.height > vh - 8) top = Math.max(8, r.top - fr.height - 6); }
  else { left = r.right + 6; top = Math.max(8, Math.min(r.top, vh - fr.height - 8)); }
  f.style.left = left + "px"; f.style.top = top + "px";
}
function hideFly() { var f = $("#fly"); if (f) f.hidden = true; }
function refreshRail() {
  GROUPS.forEach(function (g) {
    var b = $("#rail [data-g='" + g.id + "']"); if (!b) return;
    if (g.id === "icons") { b.dataset.tool = "emoji"; b.title = "Icons: tap to pick a symbol"; b.setAttribute("aria-label", "Icons"); b.setAttribute("aria-pressed", String(S.tool === "emoji")); b.innerHTML = "<span class='em'>" + (S.emojiCh || "\u2B50") + "</span>"; return; }
    var c = g.id === "cur" ? (S.tool === "eraser" ? "eraser" : "cursor") : grpCur(g), on = g.tools.indexOf(S.tool) >= 0, tip = TN[c] + (TK[c] ? " (" + TK[c] + ")" : "") + (g.tools.length > 1 ? ". Tap the corner or press and hold for more " + g.name.toLowerCase() : "");
    b.dataset.tool = c; b.title = tip; b.setAttribute("aria-label", TN[c] + (g.tools.length > 1 ? ", group " + g.name : "")); b.setAttribute("aria-pressed", String(on));
    var sv = b.querySelector("svg"); if (sv) sv.innerHTML = ICONS[c];
  });
}
var dhSig = "";
function syncDraw(force) {
  var el = $("#dhint"), t = S.tool; if (!el) return;
  if (t === "cursor") { el.hidden = true; dhSig = ""; return; }
  var st = !S.pend ? 0 : S.pend.p2 ? 2 : 1, sig = t + "|" + st + "|" + S.keep + "|" + (S.pend && S.pend.pts ? S.pend.pts.length : 0); if (!force && sig === dhSig) return; dhSig = sig;
  var msg = t === "eraser" ? "Tap a drawing to erase it" : t === "brush" ? "Press and drag to draw" : t === "text" ? "Tap where the note goes" : t === "emoji" ? "Tap to place the icon" : NP[t] ? "Tap point " + ((S.pend && S.pend.pts ? S.pend.pts.length : 0) + 1) + " of " + NP[t] : ONE[t] ? "Tap to place it"
    : st === 0 ? "Tap the first point" : THREE[t] ? (st === 1 ? "Tap the second point" : "Tap the third point") : "Tap the second point, or drag";
  el.innerHTML = "<span><b>" + TN[t] + "</b>: " + msg + "</span><button type='button' data-x='keep' aria-pressed='" + S.keep + "' title='Stay in drawing mode'>Keep drawing</button><button type='button' data-x='done'>" + (st ? "Cancel" : "Done") + "</button>";
  el.hidden = false;
}
function setTool(t) {
  S.tool = t; S.pend = null; hideTxt(); hideFly(); var g = grpOfTool(t); if (g && g.id !== "cur") S.gcur[g.id] = t;
  $("#hint").textContent = HINTS[t]; cv.style.cursor = t === "eraser" ? "cell" : "crosshair"; syncUI(); syncDraw(true); draw(); save();
}
function doneTool() { if (S.keep) { S.pend = null; hideTxt(); syncDraw(true); draw(); } else setTool("cursor"); }

/* ---------- coordinate helpers + hit testing ---------- */
function pos(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function toPt(x, y) {
  var fi = G.fiAtX(x), p = G.Pinv(Math.min(y, G.mainH));
  if (S.magnet) {
    var i = Math.max(0, Math.min(bars.length - 1, Math.round(fi))), b = bars[i], best = b.c, bd = 1e18; fi = i;
    [b.o, b.h, b.l, b.c].forEach(function (v) { var d = Math.abs(G.Yp(v) - y); if (d < bd) { bd = d; best = v; } }); p = best;
  }
  return { t: iToT(fi), p: p };
}
function dSeg(px, py, a, b) {
  var dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy, t = l ? ((px - a.x) * dx + (py - a.y) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}
function hitTest(x, y) {
  var list = S.drawings[S.sym.id] || [], i, d;
  var sel = list.filter(function (q) { return q.id === S.sel; })[0];
  if (sel && !sel.lock) { var hs = handlesOf(sel); for (i = 0; i < hs.length; i++) if (Math.hypot(x - hs[i][1].x, y - hs[i][1].y) < TOL + 4) return { id: sel.id, handle: hs[i][0] }; }
  for (i = list.length - 1; i >= 0; i--) {
    d = list[i]; if (d.hide || (d.only && d.only !== S.tf.k)) continue; var a = pxOf(d.p1), b = d.p2 ? pxOf(d.p2) : null, hit = false;
    if (d.type === "trend") hit = dSeg(x, y, a, b) < TOL;
    else if (d.type === "ray") hit = dSeg(x, y, a, extendRay(a, b, G.pw)) < TOL;
    else if (d.type === "hline") hit = Math.abs(y - a.y) < TOL;
    else if (d.type === "vline") hit = Math.abs(x - a.x) < TOL;
    else if (d.type === "hray") hit = Math.abs(y - a.y) < TOL && x >= a.x - TOL;
    else if (d.type === "cross") hit = Math.abs(y - a.y) < TOL || Math.abs(x - a.x) < TOL;
    else if (d.type === "extended") hit = dSeg(x, y, extendRay(b, a, G.pw), extendRay(a, b, G.pw)) < TOL;
    else if (d.type === "rect" || d.type === "fib") hit = x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x) + 4 && y >= Math.min(a.y, b.y) - 4 && y <= Math.max(a.y, b.y) + 4;
    else if (d.type === "text") hit = x >= a.x - 5 && x <= a.x + (d.text || "").length * 7.5 + 12 && y >= a.y - 16 && y <= a.y + 6;
    else hit = hitExtra(d, a, b, x, y);
    if (hit) return { id: d.id, handle: "body" };
  }
  return null;
}
function getD(id) { return (S.drawings[S.sym.id] || []).filter(function (d) { return d.id === id; })[0]; }
function commit(type, p1, p2, p3) {
  if (type === "measure") { S.meas = { p1: p1, p2: p2 }; doneTool(); return; }
  var d = { id: "d" + Date.now().toString(36) + Math.floor(Math.random() * 1e4), type: type, p1: p1, c: "acc", w: 1.5 };
  if (type === "emoji") d.ch = S.emojiCh || "\u2B50";
  if (p2) d.p2 = p2; if (p3) d.p3 = p3; snap(); (S.drawings[S.sym.id] = S.drawings[S.sym.id] || []).push(d); S.sel = d.id; doneTool(); syncSel(); save();
}
function commitPat(type, pts) {
  snap(); var d = { id: "d" + Date.now().toString(36) + Math.floor(Math.random() * 1e4), type: type, p1: pts[0], pts: pts, c: "acc", w: 1.5 };
  (S.drawings[S.sym.id] = S.drawings[S.sym.id] || []).push(d); S.sel = d.id; doneTool(); syncSel(); save();
}

/* ---------- pointer interaction ---------- */
var ptrs = new Map(), pinch0 = null, drag = null, lastTap = null, lpTimer = null, ctxAt = 0, lpShown = false;
function startLp(e, x, y) {
  clearTimeout(lpTimer); if (e.pointerType === "mouse") return;
  lpTimer = setTimeout(function () {
    if (drag && drag.kind === "pan" && ptrs.size === 1 && Math.hypot(drag.x - drag.sx, drag.y - drag.sy) < 8) { drag = null; lpShown = true; showCtxAt(x, y); }
  }, 520);
}
function zoomAt(mx, nb) {
  var bw = S.barW, fi = G.fiAtX(mx); S.barW = Math.max(2.5, Math.min(48, nb));
  S.off = fi - (G.nv - 1) + (G.pw - S.barW / 2 - mx) / S.barW; if (bw === S.barW) return;
}
cv.addEventListener("pointerdown", function (e) {
  if (e.button === 2) return;
  hideCtx();
  var xy = pos(e); ptrs.set(e.pointerId, { x: xy[0], y: xy[1] }); try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
  if (ptrs.size === 2) { clearTimeout(lpTimer); var a = Array.from(ptrs.values()); pinch0 = { d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y), bw: S.barW }; drag = null; return; }
  var x = xy[0], y = xy[1]; TOL = e.pointerType === "mouse" ? 7 : 14; hideFly();
  if (e.pointerType !== "mouse") { S.cx = x; S.cy = y; }
  if (S.replay.pick && x < G.pw && y < G.mainH) { S.replay.idx = Math.max(30, Math.min(bars.length - 2, Math.round(G.fiAtX(x)))); syncUI(); draw(); return; }
  if (x > G.pw && y < G.ph) { drag = { kind: "yaxis", y0: y, s0: S.yScale, sx: x, sy: y, x: x, y: y }; return; }
  if (S.tool === "eraser") {
    var eh = x < G.pw ? hitTest(x, y) : null;
    if (eh) { S.sel = eh.id; deleteSel(); } else { drag = { kind: "pan", x: x, y: y, sx: x, sy: y }; }
    return;
  }
  if (S.tool !== "cursor" && x < G.pw && y < G.mainH) {
    var pt = toPt(x, y);
    if (ONE[S.tool]) { commit(S.tool, pt); return; }
    if (S.tool === "text") { showTxt(x, y, pt); return; }
    if (S.tool === "brush") { drag = { kind: "brush", pts: [pt] }; return; }
    if (S.tool === "emoji") { commit(S.tool, pt); return; }
    if (NP[S.tool]) {
      if (S.pend && S.pend.pts) { S.pend.pts.push(pt); if (S.pend.pts.length >= NP[S.tool]) { var pq = S.pend; S.pend = null; commitPat(pq.type, pq.pts); } }
      else S.pend = { type: S.tool, pts: [pt] };
      syncDraw(); draw(); return;
    }
    if (S.pend && !S.pend.down) {
      if (THREE[S.pend.type] && !S.pend.p2) S.pend.p2 = pt;
      else { var pd = S.pend; S.pend = null; commit(pd.type, pd.p1, pd.p2 || pt, pd.p2 ? pt : null); }
    }
    else S.pend = { type: S.tool, p1: pt, down: [x, y] };
    syncDraw(); draw(); return;
  }
  var hit = x < G.pw ? hitTest(x, y) : null;
  S.meas = null;
  if (hit) {
    S.sel = hit.id; var d = getD(hit.id), orig = JSON.parse(JSON.stringify(d)), s0 = toPt(x, y);
    if (d.lock) drag = { kind: "pan", x: x, y: y, sx: x, sy: y };
    else drag = { kind: hit.handle === "body" ? "move" : "handle", id: hit.id, h: hit.handle, orig: orig, s0: s0, fi0: G.fiAtX(x), pr0: G.Pinv(y) };
  } else { S.sel = null; drag = { kind: "pan", x: x, y: y, sx: x, sy: y }; startLp(e, x, y); }
  syncSel(); draw();
});
cv.addEventListener("pointermove", function (e) {
  var xy = pos(e), x = xy[0], y = xy[1], p = ptrs.get(e.pointerId);
  if (p && ptrs.size === 2 && pinch0) {
    p.x = x; p.y = y; var a = Array.from(ptrs.values()), dd = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); zoomAt((a[0].x + a[1].x) / 2, pinch0.bw * dd / pinch0.d); draw(); return;
  }
  if (e.pointerType === "mouse" || p) { S.cx = x; S.cy = y; }
  if (S.replay.pick && p && x < G.pw && y < G.mainH) { S.replay.idx = Math.max(30, Math.min(bars.length - 2, Math.round(G.fiAtX(x)))); syncUI(); draw(); return; }
  if (drag) {
    if ((drag.kind === "move" || drag.kind === "handle") && !drag.snapped) { snap(); drag.snapped = true; }
    if (drag.kind === "brush") { if (x < G.pw) drag.pts.push(toPt(x, y)); }
    else if (drag.kind === "pan") { S.off -= (x - drag.x) / S.barW; if (S.yMan) S.yShift += (y - drag.y) / G.priceH * S.yScale; drag.x = x; drag.y = y; }
    else if (drag.kind === "yaxis") { if (Math.abs(y - drag.y0) > 2) S.yMan = true; S.yScale = Math.max(0.05, Math.min(20, drag.s0 * Math.exp((y - drag.y0) * 0.006))); }
    else if (drag.kind === "move") {
      var d = getD(drag.id); if (d) { var dt = (G.fiAtX(x) - drag.fi0) * S.tf.s, dp = G.Pinv(y) - drag.pr0;
        d.p1 = { t: drag.orig.p1.t + dt, p: drag.orig.p1.p + dp }; if (drag.orig.p2) d.p2 = { t: drag.orig.p2.t + dt, p: drag.orig.p2.p + dp };
        if (drag.orig.p3) d.p3 = { t: drag.orig.p3.t + dt, p: drag.orig.p3.p + dp };
        if (drag.orig.pts) d.pts = drag.orig.pts.map(function (q) { return { t: q.t + dt, p: q.p + dp }; }); }
    } else if (drag.kind === "handle") { var d2 = getD(drag.id); if (d2) d2[drag.h] = toPt(x, y); }
  } else if (e.pointerType === "mouse") {
    var cur = S.tool === "eraser" ? "cell" : "crosshair"; TOL = 7;
    if (x > G.pw && y < G.ph) cur = "ns-resize"; else if ((S.tool === "cursor" || S.tool === "eraser") && x < G.pw && hitTest(x, y)) cur = "pointer"; else if (S.replay.pick) cur = "cell";
    cv.style.cursor = cur;
  }
  draw();
});
function endPtr(e) {
  var xy = pos(e);
  if (drag && drag.kind === "brush") finishBrush();
  if (S.pend && S.pend.down && ptrs.size === 1) {
    if (Math.hypot(xy[0] - S.pend.down[0], xy[1] - S.pend.down[1]) > 8 && xy[0] < G.pw) { var pe = S.pend, pe2 = toPt(xy[0], xy[1]); if (THREE[pe.type]) { pe.p2 = pe2; pe.down = null; } else { S.pend = null; commit(pe.type, pe.p1, pe2); } }
    else S.pend.down = null;
  }
  if (drag && (drag.kind === "move" || drag.kind === "handle")) save();
  clearTimeout(lpTimer); if (lpShown) { lpShown = false; ctxAt = Date.now(); }
  if (e.type === "pointerup" && e.pointerType !== "mouse" && drag && (drag.kind === "pan" || drag.kind === "yaxis") && ptrs.size === 1 && Math.hypot(xy[0] - drag.sx, xy[1] - drag.sy) < 10) {
    var nowT = Date.now();
    if (lastTap && nowT - lastTap.t < 340 && Math.hypot(xy[0] - lastTap.x, xy[1] - lastTap.y) < 32) {
      lastTap = null;
      dbl(xy[0], xy[1]);
    } else lastTap = { t: nowT, x: xy[0], y: xy[1] };
  }
  ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null; if (!ptrs.size) drag = null; draw();
}
cv.addEventListener("pointerup", endPtr);
cv.addEventListener("pointercancel", endPtr);
cv.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" && !ptrs.size) { S.cx = S.cy = null; draw(); } });
cv.addEventListener("wheel", function (e) {
  e.preventDefault(); var xy = pos(e);
  if (xy[0] > G.pw) { S.yMan = true; S.yScale = Math.max(0.05, Math.min(20, S.yScale * Math.exp(e.deltaY * 0.0015))); }
  else if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) S.off -= (e.deltaX || e.deltaY) / S.barW;
  else zoomAt(xy[0], S.barW * Math.exp(-e.deltaY * 0.0015));
  draw();
}, { passive: false });
function resetView() { S.barW = window.innerWidth < 520 ? 7 : 9; S.off = 6; S.yMan = false; S.yScale = 1; S.yShift = 0; }

/* ---------- selection bar, text note, context menu ---------- */
var SWATCH = { acc: "--accent", i1: "--i1", i2: "--i2", up: "--up", down: "--down", tag: "--ink" };
var DN = { trend: "Trend line", ray: "Ray", hline: "Horizontal line", vline: "Vertical line", rect: "Rectangle", fib: "Fib retracement" };
function renderObjs() {
  if (S.tab !== "objs") return;
  var l = S.drawings[S.sym.id] || [], h = ""; $("#objSym").textContent = S.sym.label;
  l.forEach(function (d) { h += "<li><span><button type='button' class='btn' data-sel='" + d.id + "' aria-pressed='" + (S.sel === d.id) + "'>" + (TN[d.type] || DN[d.type] || d.type) + (d.lock ? " (locked)" : "") + "</button></span><button type='button' class='btn' data-rm='" + d.id + "' aria-label='Delete'>&times;</button></li>"; });
  $("#objList").innerHTML = h || "<li class='empty'>Belum ada gambar pada simbol ini.</li>";
}
$("#objList").addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b) return;
  if (b.dataset.sel) { S.sel = b.dataset.sel; syncSel(); draw(); } else if (b.dataset.rm) { S.sel = b.dataset.rm; deleteSel(); }
});
function syncSel() {
  renderObjs();
  var bar = $("#selbar"), d = S.sel ? getD(S.sel) : null;
  if (!d) { bar.hidden = true; return; }
  var h = ""; PALETTE.forEach(function (c) { h += "<button type='button' class='sw' data-c='" + c + "' aria-label='Color " + c + "' aria-pressed='" + (d.c === c) + "' style='background:var(" + SWATCH[c] + ")'></button>"; });
  h += "<button type='button' class='btn' data-act='cfg'>Settings</button><button type='button' class='btn' data-act='ls'>" + ["Solid", "Dashed", "Dotted"][d.ls || 0] + "</button><button type='button' class='btn' data-act='dup'>Clone</button><button type='button' class='btn' data-act='w'>Width " + (d.w || 1.5) + "</button><button type='button' class='btn' data-act='lock' aria-pressed='" + !!d.lock + "'>" + (d.lock ? "Unlock" : "Lock") + "</button><button type='button' class='btn' data-act='del'>Delete</button>";
  bar.innerHTML = h; bar.hidden = false;
}
$("#selbar").addEventListener("click", function (e) {
  var b = e.target.closest("button"), d = S.sel ? getD(S.sel) : null; if (!b || !d) return;
  if (b.dataset.act === "cfg") { openDrawing(S.sel); return; }
  if (b.dataset.act !== "del") snap();
  if (b.dataset.c) d.c = b.dataset.c;
  else if (b.dataset.act === "w") d.w = d.w === 1.5 ? 3 : d.w === 3 ? 1 : 1.5;
  else if (b.dataset.act === "ls") d.ls = ((d.ls || 0) + 1) % 3;
  else if (b.dataset.act === "lock") d.lock = !d.lock;
  else if (b.dataset.act === "dup") { var n = JSON.parse(JSON.stringify(d)); n.id = "d" + Date.now() + Math.floor(Math.random() * 1000); ["p1", "p2", "p3"].forEach(function (k) { if (n[k]) n[k].p *= 1.002; }); S.drawings[S.sym.id].push(n); S.sel = n.id; }
  else if (b.dataset.act === "del") deleteSel();
  syncSel(); draw(); save();
});
function deleteSel() { if (!S.sel) return; snap(); S.drawings[S.sym.id] = (S.drawings[S.sym.id] || []).filter(function (d) { return d.id !== S.sel; }); S.sel = null; syncSel(); draw(); save(); }
var txtPt = null;
function showTxt(x, y, pt) { var el = $("#txtIn"); txtPt = pt; el.value = ""; el.style.left = Math.min(x, W - 180) + "px"; el.style.top = y + "px"; el.hidden = false; setTimeout(function () { el.focus(); }, 0); }
function hideTxt() { $("#txtIn").hidden = true; txtPt = null; }
$("#txtIn").addEventListener("keydown", function (e) {
  if (e.key === "Enter") { var v = this.value.trim(), p = txtPt; hideTxt(); if (v && p) { var d = { id: "d" + Date.now().toString(36), type: "text", p1: p, text: v, c: "acc", w: 1.5 }; (S.drawings[S.sym.id] = S.drawings[S.sym.id] || []).push(d); S.sel = d.id; doneTool(); syncSel(); save(); } else setTool("cursor"); }
  else if (e.key === "Escape") { hideTxt(); setTool("cursor"); }
});
function hideCtx() { $("#ctxm").hidden = true; }
cv.addEventListener("contextmenu", function (e) { e.preventDefault(); var xy = pos(e); showCtxAt(xy[0], xy[1]); });
function showCtxAt(x, y) {
  if (x > G.pw || y > G.mainH) return; ctxAt = Date.now(); closeAll(); hideFly();
  var xy = [x, y], price = G.Pinv(xy[1]), pt = toPt(xy[0], xy[1]), m = $("#ctxm");
  var hh = hitTest(x, y); m.innerHTML = (hh ? "<button type='button' data-a='cfg' data-id='" + hh.id + "'>Settings&hellip;</button>" : "<button type='button' data-a='cset'>Chart settings&hellip;</button>") + "<button type='button' data-a='alert'>Add alert at " + fmt(price, S.sym.dec) + "</button><button type='button' data-a='hline'>Add horizontal line at " + fmt(price, S.sym.dec) + "</button>" +
    "<button type='button' data-a='buy'>Buy at market</button><button type='button' data-a='sell'>Sell at market</button><button type='button' data-a='inv'>" + (S.invert ? "\u2713 " : "") + "Invert scale</button><button type='button' data-a='lock'>" + (S.lockScale ? "\u2713 " : "") + "Lock price scale</button><button type='button' data-a='reset'>Reset chart view</button>";
  m.style.left = Math.min(xy[0], W - 220) + "px"; m.style.top = Math.min(xy[1], H - 190) + "px"; m.hidden = false; m._p = price; m._pt = pt;
}
$("#ctxm").addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b) return; var a = b.dataset.a, m = this; hideCtx();
  if (a === "cfg") openDrawing(b.dataset.id); else if (a === "cset") openChart("Symbol"); else if (a === "alert") addAlert(m._p); else if (a === "hline") commit("hline", { t: m._pt.t, p: m._p });
  else if (a === "buy") trade("buy"); else if (a === "sell") trade("sell"); else if (a === "inv") { S.invert = !S.invert; syncUI(); draw(); save(); }
  else if (a === "lock") { S.lockScale = !S.lockScale; S.lockR = null; syncUI(); draw(); save(); toast(S.lockScale ? "Price scale locked" : "Price scale unlocked"); }
  else if (a === "reset") { resetView(); draw(); }
});

