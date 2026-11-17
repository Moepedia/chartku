/* 08c-selbar: toolbar melayang drawing ala TradingView: Templates, warna, warna teks, lebar, style, Settings, Add Alert, Lock, Remove, More */
function sbIcon(p) { return "<svg viewBox='0 0 22 22' width='18' height='18' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>" + p + "</svg>"; }
var SBP = {
  tpl: "<rect x='4' y='4' width='14' height='14' rx='2'/><path d='M4 9h14M9 9v9'/>", ls: "<path d='M3 7h16M3 11h4M9 11h4M15 11h4M3 15h2M8 15h2M13 15h2M18 15h1'/>",
  cfg: "<circle cx='11' cy='11' r='2.6'/><path d='M11 3v2.5M11 16.5V19M3 11h2.5M16.5 11H19M5.4 5.4l1.8 1.8M14.8 14.8l1.8 1.8M5.4 16.6l1.8-1.8M14.8 7.2l1.8-1.8'/>",
  alert: "<path d='M6 15V10a5 5 0 0 1 10 0v5l1.5 1.5h-13z'/><path d='M9.5 18.5a1.8 1.8 0 0 0 3 0'/>", lock: "<rect x='5' y='10' width='12' height='8' rx='1.5'/><path d='M8 10V7.5a3 3 0 0 1 6 0V10'/>",
  unlock: "<rect x='5' y='10' width='12' height='8' rx='1.5'/><path d='M8 10V7.5a3 3 0 0 1 5.6-1.5'/>", del: "<path d='M5 7h12M9 7V5h4v2M7 7l.8 11h6.4L15 7'/>", more: "<circle cx='5' cy='11' r='1.3'/><circle cx='11' cy='11' r='1.3'/><circle cx='17' cy='11' r='1.3'/>"
};
function syncSel() {
  renderObjs();
  var bar = $("#selbar"), d = S.sel ? getD(S.sel) : null;
  if (!d) { bar.hidden = true; selPopHide(); return; }
  var C0 = colors(), col = d.cx || C0[d.c || "acc"], isL = !!LINE_T[d.type], h = "";
  h += "<button type='button' class='sbb' data-act='tpl' title='Templates' aria-label='Templates'>" + sbIcon(SBP.tpl) + "</button>";
  h += "<button type='button' class='sbb' data-act='color' title='Line tool colors' aria-label='Line tool colors'><span class='sbsw' style='background:" + col + "'></span></button>";
  if (isL || d.type === "text") h += "<button type='button' class='sbb' data-act='tcolor' title='Line tool text colors' aria-label='Line tool text colors'><b class='sbT'>T</b><i class='sbul' style='background:" + (d.lc || col) + "'></i></button>";
  h += "<button type='button' class='sbb sbw' data-act='w' title='Line tool width' aria-label='Line tool width'>" + (d.w || 1.5) + "px</button>";
  h += "<button type='button' class='sbb' data-act='ls' title='Style' aria-label='Style'>" + sbIcon(SBP.ls) + "</button>";
  h += "<button type='button' class='sbb' data-act='cfg' title='Settings' aria-label='Settings'>" + sbIcon(SBP.cfg) + "</button>";
  h += "<button type='button' class='sbb' data-act='alert' title='Add Alert' aria-label='Add Alert'>" + sbIcon(SBP.alert) + "</button>";
  h += "<button type='button' class='sbb' data-act='lock' title='" + (d.lock ? "Unlock" : "Lock") + "' aria-label='" + (d.lock ? "Unlock" : "Lock") + "' aria-pressed='" + !!d.lock + "'>" + sbIcon(d.lock ? SBP.lock : SBP.unlock) + "</button>";
  h += "<button type='button' class='sbb' data-act='del' title='Remove' aria-label='Remove'>" + sbIcon(SBP.del) + "</button>";
  h += "<button type='button' class='sbb' data-act='more' title='More' aria-label='More'>" + sbIcon(SBP.more) + "</button>";
  bar.innerHTML = h; bar.hidden = false;
}
var SELPOP = null, selPopKind = "";
function selPopHide() { if (SELPOP) SELPOP.hidden = true; selPopKind = ""; }
function selPopPlace(anchor) {
  var r = anchor.getBoundingClientRect(), w = SELPOP.offsetWidth, h = SELPOP.offsetHeight, vw = document.documentElement.clientWidth;
  SELPOP.style.left = Math.max(6, Math.min(r.left, vw - w - 6)) + "px";
  SELPOP.style.top = (r.bottom + 6 + h > window.innerHeight ? Math.max(6, r.top - h - 6) : r.bottom + 6) + "px";
}
function selPopEl() { if (!SELPOP) { SELPOP = document.createElement("div"); SELPOP.id = "selpop"; SELPOP.className = "selpop"; SELPOP.hidden = true; document.body.appendChild(SELPOP); } return SELPOP; }
function tplMenu(d, anchor, done) {
  var el = selPopEl(), st = tplStore(), list = st[d.type] || {}, names = Object.keys(list), h = "<button type='button' data-pa='tplsave'>Save as\u2026</button>";
  if (names.length) { h += "<div class='sph'>Templates</div>"; names.forEach(function (n) { h += "<div class='sprow'><button type='button' data-pa='tplapply' data-v='" + esc(n) + "'>" + esc(n) + "</button><button type='button' class='spx' data-pa='tpldel' data-v='" + esc(n) + "' aria-label='Hapus " + esc(n) + "'>\u00D7</button></div>"; }); } else h += "<div class='sph'>Belum ada template</div>";
  el.innerHTML = h; el.hidden = false; el.dataset.d = d.id; el._done = done || null; el._anchor = anchor; selPopKind = "tpl"; selPopPlace(anchor);
}
function selPop(kind, anchor) {
  var d = S.sel ? getD(S.sel) : null; if (!d) return; var el = selPopEl();
  if (selPopKind === kind && !el.hidden) { selPopHide(); return; }
  if (kind === "tpl") { tplMenu(d, anchor, null); return; }
  var h = "", C0 = colors();
  if (kind === "color" || kind === "tcolor") {
    h = "<div class='spsw'>" + PALETTE.map(function (c) { return "<button type='button' class='sw' data-pa='" + (kind === "color" ? "pc" : "tc") + "' data-v='" + c + "' aria-label='Color " + c + "' style='background:var(" + SWATCH[c] + ")'></button>"; }).join("") + "</div><label class='splb'>Custom <input type='color' data-pa='" + (kind === "color" ? "cc" : "tcc") + "' value='" + hex(kind === "color" ? (d.cx || C0[d.c || "acc"]) : (d.lc || d.cx || C0[d.c || "acc"])) + "'></label>";
  } else if (kind === "w") h = [1, 1.5, 2, 3, 4].map(function (w) { return "<button type='button' data-pa='w' data-v='" + w + "' aria-pressed='" + ((d.w || 1.5) === w) + "'>" + w + "px</button>"; }).join("");
  else if (kind === "ls") h = ["Solid", "Dashed", "Dotted"].map(function (n, i) { return "<button type='button' data-pa='ls' data-v='" + i + "' aria-pressed='" + ((d.ls || 0) === i) + "'>" + n + "</button>"; }).join("");
  else if (kind === "more") h = "<button type='button' data-pa='dup'>Clone</button><button type='button' data-pa='front'>Bring to front</button><button type='button' data-pa='back'>Send to back</button><button type='button' data-pa='hide'>Hide</button><button type='button' data-pa='only'>" + (d.only ? "Show on all timeframes" : "Show only on " + S.tf.k) + "</button>";
  el.innerHTML = h; el.hidden = false; el.dataset.d = d.id; el._done = null; el._anchor = anchor; selPopKind = kind; selPopPlace(anchor);
}
$("#selbar").addEventListener("click", function (e) {
  var b = e.target.closest("button"), d = S.sel ? getD(S.sel) : null; if (!b || !d) return; var act = b.dataset.act;
  if (act === "cfg") { selPopHide(); openDrawing(S.sel); return; }
  if (act === "del") { selPopHide(); deleteSel(); return; }
  if (act === "lock") { snap(); d.lock = !d.lock; selPopHide(); syncSel(); draw(); save(); return; }
  if (act === "alert") { selPopHide(); openAlertDlg((d.p2 || d.p1).p); return; }
  selPop(act, b);
});
document.addEventListener("pointerdown", function (e) { if (SELPOP && !SELPOP.hidden && !e.target.closest("#selpop") && !e.target.closest("#selbar") && !e.target.closest("[data-f=tpl]")) selPopHide(); }, true);
document.addEventListener("keydown", function (e) { if (e.key === "Escape" && SELPOP && !SELPOP.hidden) { selPopHide(); e.stopPropagation(); e.preventDefault(); } }, true);
function selPopApply(e) {
  var b = e.target.closest("[data-pa]"), el = SELPOP, d = el && getD(el.dataset.d); if (!b || !d) return; var pa = b.dataset.pa, v = b.dataset.v || b.value, st, keep = false, done = el._done;
  if (pa === "tplsave") { var nm = window.prompt("Nama template:", ""); if (!nm) return; nm = nm.trim().slice(0, 30); if (!nm) return; st = tplStore(); (st[d.type] = st[d.type] || {})[nm] = tplCapture(d); tplSave(st); toast("Template disimpan: " + nm); selPopHide(); return; }
  if (pa === "tpldel") { st = tplStore(); if (st[d.type]) { delete st[d.type][v]; tplSave(st); } tplMenu(d, el._anchor || $("#selbar"), done); return; }
  snap();
  if (pa === "tplapply") { st = tplStore(); tplApply(d, (st[d.type] || {})[v]); }
  else if (pa === "pc") { d.c = v; delete d.cx; } else if (pa === "cc") { d.cx = v; keep = true; }
  else if (pa === "tc") d.lc = colors()[v]; else if (pa === "tcc") { d.lc = v; keep = true; }
  else if (pa === "w") d.w = parseFloat(v); else if (pa === "ls") d.ls = parseInt(v, 10);
  else if (pa === "dup") { var n = JSON.parse(JSON.stringify(d)); n.id = "d" + Date.now() + Math.floor(Math.random() * 1000); ["p1", "p2", "p3"].forEach(function (k) { if (n[k]) n[k].p *= 1.002; }); S.drawings[S.sym.id].push(n); S.sel = n.id; }
  else if (pa === "front" || pa === "back") { var l = S.drawings[S.sym.id], i = l.indexOf(d); if (i >= 0) { l.splice(i, 1); if (pa === "front") l.push(d); else l.unshift(d); } }
  else if (pa === "hide") { d.hide = true; S.sel = null; }
  else if (pa === "only") d.only = d.only ? null : S.tf.k;
  if (!keep) selPopHide(); syncSel(); draw(); save(); if (done) done();
}
selPopEl().addEventListener("click", selPopApply); selPopEl().addEventListener("input", function (e) { if (e.target.dataset.pa === "cc" || e.target.dataset.pa === "tcc") selPopApply(e); });
