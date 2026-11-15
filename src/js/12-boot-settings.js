/* 12-boot-settings: range bar, keyboard, boot, dialog setelan, Pine panel, multi-chart */
/* ---------- range bar and screenshot ---------- */
var RANGES = { "1D": [86400, 60], "5D": [5 * 86400, 300], "1M": [30 * 86400, 3600], "3M": [91 * 86400, 14400], "6M": [182 * 86400, 86400], "YTD": [0, 86400], "1Y": [365 * 86400, 86400], "5Y": [5 * 365 * 86400, 604800], "ALL": [10 * 365 * 86400, 604800] };
function rangeSpan(k) { var r = RANGES[k]; return r[0] || (Date.now() / 1000 - new Date(new Date().getFullYear(), 0, 1) / 1000); }
$("#rangeBar").addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b || !RANGES[b.dataset.r]) return;
  var r = RANGES[b.dataset.r];
  setReplay(false); S.range = b.dataset.r; S.tf = TFS.filter(function (t) { return t.s === r[1]; })[0]; pendSpan = rangeSpan(S.range); loadData(); save();
});
$("#shot").addEventListener("click", function () {
  cv.toBlob(function (bl) { if (!bl) { toast("Screenshot failed."); return; } var a = document.createElement("a"); a.href = URL.createObjectURL(bl); a.download = S.sym.id + "_" + S.tf.k + ".png"; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); toast("Chart saved as PNG."); });
});
/* ---------- keyboard ---------- */
document.addEventListener("keydown", function (e) {
  var tg = e.target, typing = tg && (tg.tagName === "INPUT" || tg.tagName === "SELECT" || tg.tagName === "TEXTAREA");
  if (e.key === "Escape") { if (!$("#srch").hidden) closeSearch(); closeAll(); hideCtx(); hideFly(); if (!typing) { S.sel = null; S.meas = null; finishPick(); if (S.tool !== "cursor") setTool("cursor"); syncSel(); syncUI(); draw(); } return; }
  if (typing || !$("#srch").hidden) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { if (e.shiftKey) redo(); else undo(); e.preventDefault(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { redo(); e.preventDefault(); return; }
  if ((e.key === "Delete" || e.key === "Backspace") && S.sel) { deleteSel(); e.preventDefault(); return; }
  if (e.altKey) {
    var m = { t: "trend", h: "hline", v: "vline", f: "fib", b: "rect", c: "cross", e: "eraser" }[e.key.toLowerCase()];
    if (m) { setTool(m); e.preventDefault(); } else if (e.key.toLowerCase() === "r") { resetView(); draw(); e.preventDefault(); }
    return;
  }
  if (!e.ctrlKey && !e.metaKey && e.key.length === 1 && /[a-z0-9]/i.test(e.key)) { openSearch("sym", e.key); e.preventDefault(); }
});

/* ---------- boot ---------- */
SYMS.forEach(function (s) {
  live[s.id] = s.base; var d = gen(s, TF_D, s.base); ref[s.id] = d[d.length - 2].c; spark[s.id] = gen(s, TF_H, s.base).slice(-40).map(function (x) { return x.c; });
});
buildRail(); buildMenus(); wireExtras(); buildWatch(); renderAlerts();
$("#qty").value = S.sym.lot; renderTrade(); selectTab("watch");
if (matchMedia("(max-width: 640px)").matches) { $("#work").classList.add("panel-closed"); syncPanel(); }
new ResizeObserver(resize).observe(wrap);
resize(); loadData(); header(); renderInfo(); watchUpdate(); quoteQueue(true); $("#hint").textContent = HINTS.cursor;
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { draw(); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
setInterval(poll, 5000); setInterval(function () { if (!document.hidden) { header(); watchUpdate(); } }, 1000);
/* ---------- settings dialogs (double-click / double-tap) ---------- */
var SLOT = { sma: [["i1", "Line"]], ema: [["i2", "Line"]], bb: [["i3", "Bands"]], vwap: [["i4", "Line"]], vol: [["up", "Up volume"], ["down", "Down volume"]], rsi: [["i2", "Line"]], macd: [["i1", "MACD"], ["i2", "Signal"]], stoch: [["i1", "%K"], ["i3", "%D"]], atr: [["i4", "Line"]], adx: [["i3", "ADX"], ["up", "+DI"], ["down", "-DI"]], st: [["up", "Up trend"], ["down", "Down trend"]], ichi: [["i1", "Tenkan"], ["i3", "Kijun"], ["up", "Cloud up"], ["down", "Cloud down"]] };
var MAINW = { sma: 1, ema: 1, vwap: 1, bb: 1, ichi: 1 };
var LKEY = [["SMA", "sma"], ["EMA", "ema"], ["BB", "bb"], ["VWAP", "vwap"], ["RSI", "rsi"], ["Stoch", "stoch"], ["ATR", "atr"], ["ADX", "adx"], ["Supertrend", "st"], ["Ichimoku", "ichi"], ["MACD", "macd"]];
function iw(k) { return S.iw[k] || 1.5; }
function hex(c) {
  if (/^#[0-9a-f]{6}$/i.test(c)) return c;
  var m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(c); if (m) return "#" + m[1] + m[1] + m[2] + m[2] + m[3] + m[3];
  var e = document.createElement("canvas").getContext("2d"); e.fillStyle = c; return e.fillStyle.charAt(0) === "#" ? e.fillStyle : "#888888";
}
function lname(k) { var r = INDS.filter(function (a) { return a[0] === k; })[0]; return LNAME[k] || (r ? r[1] : k); }
function toLocal(t) { return new Date(t * 1000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
function fromLocal(v) { var q = new Date(v); return isNaN(q) ? null : Math.floor(q.getTime() / 1000); }
function syncPops() {
  var C0 = colors();
  $$("#indPop [data-col]").forEach(function (i) { i.value = hex(C0[i.dataset.col]); });
  $$("#indPop input.len").forEach(function (i) { i.value = S.len[i.dataset.len]; });
}
(function () {
  var st = document.createElement("style");
  st.textContent = ".sdlg{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:12px;background:rgba(8,10,12,.28)}" +
    ".sd-box{width:min(440px,100%);max-height:88vh;display:flex;flex-direction:column;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:12px;box-shadow:0 24px 60px rgba(0,0,0,.45);overflow:hidden}" +
    ".sd-hd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:move;touch-action:none;font-family:var(--font-display);font-size:16px}" +
    ".sd-x{background:none;border:0;font-size:22px;line-height:1;color:var(--muted);cursor:pointer;padding:0 4px}" +
    ".sd-tabs{display:flex;gap:2px;padding:0 10px;border-bottom:1px solid var(--line);overflow-x:auto}" +
    ".sd-tabs button{background:none;border:0;border-bottom:2px solid transparent;padding:8px 10px;color:var(--muted);cursor:pointer}" +
    ".sd-tabs button[aria-selected=true]{color:var(--ink);border-bottom-color:var(--accent)}" +
    ".sd-body{padding:6px 14px 10px;overflow:auto;min-height:130px}" +
    ".sd-r{display:grid;grid-template-columns:120px 1fr;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid var(--grid)}" +
    ".sd-r>div{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.sd-r>label{color:var(--muted)}" +
    ".sd-r input[type=text],.sd-r input[type=number],.sd-r input[type=datetime-local],.sd-r select{background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:5px 8px;min-width:0;max-width:100%}" +
    ".sd-r input[type=color]{width:34px;height:26px;padding:0;border:1px solid var(--line);background:none}" +
    ".sd-c{display:flex;gap:6px;align-items:center;width:100%}.sd-n{color:var(--muted);font-size:12px;margin:10px 0 2px}" +
    ".sd-ft{display:flex;gap:8px;align-items:center;padding:10px 14px;border-top:1px solid var(--line)}.sd-l{display:flex;gap:6px;margin-right:auto}" +
    ".sd-ok{background:var(--accent)!important;color:var(--accent-ink)!important;border-color:var(--accent)!important}" +
    ".sdlg .btn[aria-pressed=true]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}" +
    ".sdlg .sw{width:22px;height:22px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0}.sdlg .sw[aria-pressed=true]{border-color:var(--ink)}" +
    "@media(max-width:480px){.sd-r{grid-template-columns:1fr;gap:4px}}";
  document.head.appendChild(st);
})();

var DLG = null;
function dlgClose() { if (DLG) { DLG.remove(); DLG = null; } }
function rowH(label, inner) { return "<div class='sd-r'><label>" + label + "</label><div>" + inner + "</div></div>"; }
function colH(f, c) { return "<input type='color' data-f='" + f + "' value='" + hex(c) + "'>"; }
function btnsH(f, vals, cur, labels) { return vals.map(function (v, i) { return "<button type='button' class='btn' data-f='" + f + "' data-v='" + v + "' aria-pressed='" + (String(cur) === String(v)) + "'>" + (labels ? labels[i] : v) + "</button>"; }).join(""); }
function chkH(f, on, label) { return "<label class='sd-c'><input type='checkbox' data-f='" + f + "'" + (on ? " checked" : "") + "> " + label + "</label>"; }
function selH(f, opts, cur) { return "<select data-f='" + f + "'>" + opts.map(function (o) { return "<option value='" + o[0] + "'" + (String(cur) === String(o[0]) ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select>"; }

function dlgOpen(o) {
  dlgClose(); closeAll(); hideCtx(); hideFly();
  var el = document.createElement("div"); el.className = "sdlg";
  el.innerHTML = "<div class='sd-box' role='dialog' aria-modal='true' aria-label='" + esc(o.title) + "'><div class='sd-hd'><b>" + esc(o.title) + "</b><button type='button' class='sd-x' data-a='cancel' aria-label='Close'>&times;</button></div><div class='sd-tabs' role='tablist'></div><div class='sd-body'></div><div class='sd-ft'><span class='sd-l'></span><button type='button' class='btn' data-a='cancel'>Cancel</button><button type='button' class='btn sd-ok' data-a='ok'>Ok</button></div></div>";
  $("#shell").appendChild(el); DLG = el;
  var box = $(".sd-box", el), body = $(".sd-body", el), tabs = $(".sd-tabs", el), cur = Math.max(0, o.tab || 0);
  function paint() {
    tabs.innerHTML = o.tabs.map(function (t, i) { return "<button type='button' role='tab' data-t='" + i + "' aria-selected='" + (i === cur) + "'>" + t[0] + "</button>"; }).join("");
    body.innerHTML = o.tabs[cur][1](); $(".sd-l", el).innerHTML = o.foot ? o.foot() : "";
  }
  function apply(f, v, again) { o.set(f, v); legendHtml = null; syncUI(); draw(); if (again) paint(); }
  el.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.t) { cur = +b.dataset.t; paint(); }
    else if (b.dataset.a === "ok") { save(); dlgClose(); }
    else if (b.dataset.a === "cancel") { o.revert(); legendHtml = null; syncUI(); renderObjs(); syncSel(); draw(); dlgClose(); }
    else if (b.dataset.f) apply(b.dataset.f, b.dataset.v, true);
  });
  function field(e) {
    var t = e.target; if (!t.dataset || !t.dataset.f || t.tagName === "BUTTON") return;
    var v = t.type === "checkbox" ? t.checked : (t.type === "number" || t.type === "range") ? parseFloat(t.value) : t.type === "datetime-local" ? fromLocal(t.value) : t.value;
    if (v === null || v !== v) return;
    apply(t.dataset.f, v, e.type === "change" && (t.type === "checkbox" || t.tagName === "SELECT"));
  }
  el.addEventListener("input", field); el.addEventListener("change", field);
  el.addEventListener("keydown", function (e) {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); $("[data-a=cancel]", el).click(); }
    else if (e.key === "Enter" && e.target.tagName !== "BUTTON") { e.preventDefault(); $("[data-a=ok]", el).click(); }
  });
  var dx = 0, dy = 0, hd = $(".sd-hd", el);
  hd.addEventListener("pointerdown", function (e) {
    if (e.target.closest("button")) return; var sx = e.clientX - dx, sy = e.clientY - dy; try { hd.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    function mv(ev) { dx = ev.clientX - sx; dy = ev.clientY - sy; box.style.transform = "translate(" + dx + "px," + dy + "px)"; }
    function up() { hd.removeEventListener("pointermove", mv); hd.removeEventListener("pointerup", up); }
    hd.addEventListener("pointermove", mv); hd.addEventListener("pointerup", up);
  });
  paint(); setTimeout(function () { $(".sd-ok", el).focus(); }, 0);
}

function openDrawing(id) {
  var d = getD(id); if (!d) return; S.sel = id; syncSel(); draw();
  var orig = JSON.stringify(d), snapped = false, nm = TN[d.type] || DN[d.type] || d.type, pts = ["p1", "p2", "p3"].filter(function (k) { return d[k]; }), fill = d.type === "rect" || d.type === "fib";
  dlgOpen({
    title: nm, tab: 0,
    tabs: [
      ["Style", function () {
        var C0 = colors(), sw = PALETTE.map(function (c) { return "<button type='button' class='sw' data-f='c' data-v='" + c + "' aria-label='Color " + c + "' aria-pressed='" + (!d.cx && (d.c || "acc") === c) + "' style='background:var(" + SWATCH[c] + ")'></button>"; }).join("");
        var h = rowH("Color", sw + colH("cx", d.cx || C0[d.c || "acc"])) + rowH("Thickness", btnsH("w", [1, 1.5, 2, 3, 4], d.w || 1.5)) + rowH("Line style", btnsH("ls", [0, 1, 2], d.ls || 0, ["Solid", "Dashed", "Dotted"]));
        if (fill) h += rowH("Fill opacity", "<input type='range' min='0' max='60' data-f='fo' value='" + Math.round((d.fo != null ? d.fo : 0.13) * 100) + "'>");
        if (d.type === "text") h += rowH("Text", "<input type='text' maxlength='60' data-f='text' value='" + esc(d.text || "") + "'>") + rowH("Font size", selH("fs", [10, 12, 13, 14, 16, 20, 24, 32].map(function (n) { return [n, n]; }), d.fs || 13));
        return h;
      }],
      ["Coordinates", function () {
        return pts.map(function (k, i) { return rowH("Point " + (i + 1) + " price", "<input type='number' step='any' data-f='" + k + ".p' value='" + d[k].p + "'>") + rowH("Point " + (i + 1) + " time", "<input type='datetime-local' data-f='" + k + ".t' value='" + toLocal(d[k].t) + "'>"); }).join("") || "<p class='sd-n'>No coordinates.</p>";
      }],
      ["Visibility", function () { return rowH("Display", chkH("hide", d.hide, "Hide this drawing") + chkH("only", !!d.only, "Show only on the " + S.tf.k + " timeframe") + chkH("lock", d.lock, "Lock (no move or resize)")); }]
    ],
    foot: function () { return "<button type='button' class='btn' data-f='clone'>Clone</button><button type='button' class='btn' data-f='del'>Delete</button>"; },
    set: function (f, v) {
      if (f === "del") { dlgClose(); deleteSel(); return; }
      if (f === "clone") { dlgClose(); snap(); var n = JSON.parse(JSON.stringify(d)); n.id = "d" + Date.now() + Math.floor(Math.random() * 1000); pts.forEach(function (k) { n[k].p *= 1.002; }); S.drawings[S.sym.id].push(n); S.sel = n.id; syncSel(); save(); return; }
      if (!snapped) { snap(); snapped = true; }
      if (f === "c") { d.c = v; delete d.cx; } else if (f === "cx") d.cx = v; else if (f === "w") d.w = parseFloat(v); else if (f === "ls") d.ls = parseInt(v, 10);
      else if (f === "fo") d.fo = v / 100; else if (f === "text") d.text = v; else if (f === "fs") d.fs = parseInt(v, 10);
      else if (f === "hide") d.hide = !!v; else if (f === "lock") d.lock = !!v; else if (f === "only") d.only = v ? S.tf.k : null;
      else if (f.indexOf(".") > 0) { var q = f.split("."); d[q[0]][q[1]] = v; }
      syncSel();
    },
    revert: function () { var l = S.drawings[S.sym.id] || [], i = l.indexOf(d); if (i >= 0) l[i] = JSON.parse(orig); if (snapped) { undoS.pop(); syncUndo(); } }
  });
}

function openInd(k) {
  var ln = LENK[k], o0 = JSON.stringify({ ind: S.ind, len: S.len, iw: S.iw, col: S.colOv });
  dlgOpen({
    title: lname(k),
    tabs: [
      ["Inputs", function () { return ln ? rowH("Length", "<input type='number' min='2' max='500' data-f='len' value='" + S.len[ln] + "'>") : "<p class='sd-n'>This indicator uses fixed inputs.</p>"; }],
      ["Style", function () {
        var C0 = colors(), h = (SLOT[k] || []).map(function (s) { return rowH(s[1], colH("c:" + s[0], C0[s[0]])); }).join("");
        if (MAINW[k]) h += rowH("Thickness", btnsH("w", [1, 1.5, 2, 3, 4], iw(k)));
        return h + "<p class='sd-n'>Color slots are shared by indicators that use the same slot.</p>";
      }],
      ["Visibility", function () { return rowH("Display", chkH("show", S.ind[k], "Show on chart")); }]
    ],
    foot: function () { return "<button type='button' class='btn' data-f='remove'>Remove</button>"; },
    set: function (f, v) {
      if (f === "len") { S.len[ln] = Math.max(2, Math.min(500, Math.round(v))); recalc(); }
      else if (f === "w") S.iw[k] = parseFloat(v); else if (f === "show") S.ind[k] = !!v;
      else if (f.indexOf("c:") === 0) S.colOv[f.slice(2)] = v;
      else if (f === "remove") { S.ind[k] = false; dlgClose(); save(); }
      syncPops();
    },
    revert: function () { var o = JSON.parse(o0); Object.assign(S.ind, o.ind); Object.assign(S.len, o.len); S.iw = o.iw; S.colOv = o.col; recalc(); syncPops(); }
  });
}

var BOOLS = { pc: 1, body: 1, border: 1, wick: 1, lastLine: 1, lastLabel: 1, cd: 1, gh: 1, gv: 1, sSym: 1, sOhlc: 1, sChg: 1, sVol: 1, sInd: 1, wm: 1, tPos: 1, tBuy: 1, aLn: 1, aSnd: 1 };
function applyStatus() {
  var od0 = $(".order"); if (od0) od0.style.display = S.sty.tBuy === false ? "none" : "";
  var q = S.sty, r = $("#readout"), l = $("#legend");
  r.classList.toggle("no-sym", q.sSym === false); r.classList.toggle("no-ohlc", q.sOhlc === false); r.classList.toggle("no-chg", q.sChg === false); r.classList.toggle("no-vol", q.sVol === false); l.classList.toggle("no-ind", q.sInd === false);
}
function applyPrec() { var p = S.sty.prec || {}; SYMS.forEach(function (s) { if (s.dec0 == null) s.dec0 = s.dec; s.dec = p[s.id] != null ? p[s.id] : s.dec0; }); }
function hidSt(name) { var m = LKEY && LKEY.filter(function (a) { return name.indexOf(a[0]) === 0; })[0]; return m && S.ihide[m[1]] ? ";opacity:.45" : ""; }
function ltools(name) {
  if (!LKEY) return "";
  var m = LKEY.filter(function (a) { return name.indexOf(a[0]) === 0; })[0]; if (!m) return "";
  return "<button type='button' data-lt='eye' data-k='" + m[1] + "' title='" + (S.ihide[m[1]] ? "Show" : "Hide") + "' aria-label='Toggle visibility' aria-pressed='" + !!S.ihide[m[1]] + "'>" + (S.ihide[m[1]] ? "&#9676;" : "&#9673;") + "</button><button type='button' data-lt='cfg' data-k='" + m[1] + "' title='Settings' aria-label='Settings'>&#9881;</button><button type='button' data-lt='rm' data-k='" + m[1] + "' title='Remove' aria-label='Remove'>&times;</button>";
}
function cdText() {
  var r = Math.max(0, Math.floor(bars[bars.length - 1].t + S.tf.s - Date.now() / 1000)), d = Math.floor(r / 86400), h = Math.floor(r % 86400 / 3600), m = Math.floor(r % 3600 / 60);
  return (d ? d + "d " : "") + (d || h ? two(h) + ":" : "") + two(m) + ":" + two(r % 60);
}
function cRow(lbl, on, key, ku, kd) { var C0 = colors(); return rowH(lbl, chkH(key, S.sty[key] !== false, "") + colH("q:" + ku, S.sty[ku] || C0.up) + colH("q:" + kd, S.sty[kd] || C0.down)); }
function openChart(tn) {
  var th0 = document.documentElement.getAttribute("data-theme"), o0 = JSON.stringify({ type: S.type, sty: S.sty, scale: S.scale, tz: S.tz, grid: S.grid, col: S.colOv, invert: S.invert, lockScale: S.lockScale, hilo: S.hilo, events: S.events }), Q = S.sty;
  var prec = [["", "Default"]].concat([0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return [n, n]; }));
  dlgOpen({
    title: "Settings \u2013 " + S.sym.label, tab: Math.max(0, ["Symbol", "Status line", "Scales and lines", "Canvas", "Trading", "Alerts", "Events"].indexOf(tn)),
    tabs: [
      ["Symbol", function () {
        var C0 = colors();
        return rowH("Chart type", selH("type", TYPES, S.type)) + rowH("Color by previous close", chkH("pc", Q.pc, "Color bars based on previous close")) +
          cRow("Body", 0, "body", "bu", "bd") + cRow("Borders", 0, "border", "ou", "od") + cRow("Wick", 0, "wick", "wu", "wd") +
          rowH("Line / area", colH("c:acc", C0.acc) + btnsH("lw", [1, 2, 3, 4], Q.lw || 2)) +
          rowH("Precision", selH("prec", prec, (Q.prec || {})[S.sym.id] != null ? Q.prec[S.sym.id] : "")) + rowH("Time zone", selH("tz", TZS.map(function (z) { return [z[0], z[1]]; }), S.tz));
      }],
      ["Status line", function () {
        return rowH("Show", chkH("sSym", Q.sSym !== false, "Symbol, interval and time") + chkH("sOhlc", Q.sOhlc !== false, "OHLC values") + chkH("sChg", Q.sChg !== false, "Bar change values") + chkH("sVol", Q.sVol !== false, "Volume") + chkH("sInd", Q.sInd !== false, "Indicator titles and values"));
      }],
      ["Scales and lines", function () {
        return rowH("Price scale", btnsH("scale", ["auto", "log", "pct"], S.scale, ["Auto", "Log", "%"])) +
          rowH("Scale options", chkH("invert", S.invert, "Invert scale") + chkH("lockScale", S.lockScale, "Lock price scale")) +
          rowH("Labels", chkH("lastLabel", Q.lastLabel !== false, "Last price label on scale") + chkH("lastLine", Q.lastLine !== false, "Last price line") + chkH("cd", !!Q.cd, "Countdown to bar close") + chkH("hilo", S.hilo, "High and low price labels")) +
          rowH("Events", chkH("evm", S.events, "Event markers on the time axis")) +
          rowH("View", "<button type='button' class='btn' data-f='rsty'>Reset price scale</button><button type='button' class='btn' data-f='rview'>Reset chart view</button>");
      }],
      ["Canvas", function () {
        var C0 = colors();
        return rowH("Theme", btnsH("theme", ["dark", "light"], document.documentElement.getAttribute("data-theme"), ["Dark", "Light"])) + rowH("Background", colH("c:bg", C0.bg)) +
          rowH("Watermark", chkH("wm", Q.wm !== false, "Symbol watermark in the middle of the chart")) +
          rowH("Grid lines", chkH("gh", Q.gh !== false && S.grid, "Horizontal") + chkH("gv", Q.gv !== false && S.grid, "Vertical") + colH("c:grid", C0.grid)) +
          rowH("Crosshair", colH("c:cross", C0.cross || C0.muted) + btnsH("cls", [0, 1, 2], Q.cls || 0, ["Dashed", "Solid", "Dotted"])) + rowH("Scale text", colH("c:muted", C0.muted)) +
          rowH("Defaults", "<button type='button' class='btn' data-f='rcan'>Reset canvas</button>");
      }],
      ["Trading", function () {
        return rowH("Paper trading", chkH("tPos", Q.tPos !== false, "Show open position line on chart") + chkH("tBuy", Q.tBuy !== false, "Show the order ticket (Buy / Sell)"));
      }],
      ["Alerts", function () {
        return rowH("Alerts", chkH("aLn", Q.aLn !== false, "Show alert lines on chart") + chkH("aSnd", Q.aSnd !== false, "Play a sound when an alert triggers"));
      }],
      ["Events", function () {
        return rowH("Events", chkH("evm", S.events, "Show economic events on the time axis"));
      }]
    ],
    set: function (f, v) {
      if (f === "invert") S.invert = !!v;
      else if (f === "lockScale") { S.lockScale = !!v; S.lockR = null; }
      else if (f === "hilo") S.hilo = !!v;
      else if (f === "evm") { S.events = !!v; $("#evChk").checked = S.events; }
      else if (BOOLS[f]) { Q = S.sty; S.sty[f] = !!v; if (f === "gh" || f === "gv") S.grid = !!(S.sty.gh !== false || S.sty.gv !== false); }
      else if (f === "type") S.type = v; else if (f.indexOf("c:") === 0) S.colOv[f.slice(2)] = v; else if (f.indexOf("q:") === 0) S.sty[f.slice(2)] = v;
      else if (f === "lw" || f === "cls") S.sty[f] = parseFloat(v);
      else if (f === "prec") { S.sty.prec = S.sty.prec || {}; if (v === "") delete S.sty.prec[S.sym.id]; else S.sty.prec[S.sym.id] = parseInt(v, 10); applyPrec(); header(); renderInfo(); }
      else if (f === "scale") S.scale = v; else if (f === "tz") S.tz = v;
      else if (f === "theme") document.documentElement.setAttribute("data-theme", v);
      else if (f === "rsty") { S.yMan = false; S.yScale = 1; S.yShift = 0; } else if (f === "rview") resetView();
      else if (f === "rcan") { delete S.colOv.bg; delete S.colOv.grid; delete S.colOv.muted; delete S.colOv.cross; S.sty.gh = S.sty.gv = true; S.sty.cls = 0; S.sty.wm = true; S.grid = true; }
      applyStatus(); syncPops(); var od = $(".order"); if (od) od.style.display = S.sty.tBuy === false ? "none" : "";
    },
    revert: function () { var o = JSON.parse(o0); S.type = o.type; S.sty = o.sty; S.scale = o.scale; S.tz = o.tz; S.grid = o.grid; S.colOv = o.col; S.invert = o.invert; S.lockScale = o.lockScale; S.lockR = null; S.hilo = o.hilo; S.events = o.events; document.documentElement.setAttribute("data-theme", th0); applyPrec(); applyStatus(); header(); renderInfo(); syncPops(); }
  });
}
/* hit-testing for indicators and candles, and the double-click / double-tap dispatcher */
function hitInd(x, y) {
  if (x >= G.pw) return null;
  if (y < G.mainH) {
    var fi = Math.max(0, Math.min(bars.length - 1, Math.round(G.fiAtX(x)))), L = { sma: ["sma"], ema: ["ema"], vwap: ["vwap"], bb: ["bbU", "bbL"], ichi: ["spA", "spB", "tenkan", "kijun"], st: ["st"] }, k, j, a;
    var xh = null; S.xi.forEach(function (x) { var r = XR[x.u]; if (xh || !r || x.h || !XIND[x.id].ov) return; r.plots.forEach(function (p) { if (!xh && p.d[fi] != null && Math.abs(G.Yp(p.d[fi]) - y) < 8) xh = "x:" + x.u; }); }); if (xh) return xh;
    for (k in L) if (S.ind[k]) for (j = 0; j < L[k].length; j++) { a = ind[L[k][j]]; if (a && a[fi] != null && Math.abs(G.Yp(a[fi]) - y) < 8) return k; }
    return null;
  }
  var s = G.subs[Math.floor((y - G.mainH) / G.subH)];
  return s && s.indexOf("cmp") !== 0 ? s : null;
}
function candleHit(x, y) {
  if (y > G.mainH) return false;
  var fi = Math.round(G.fiAtX(x)), b = bars[fi]; if (!b) return false;
  return Math.abs(G.X(fi) - x) <= Math.max(G.bw * 0.6, 4) && y >= G.Yp(b.h) - 4 && y <= G.Yp(b.l) + 4;
}
var dblT = 0;
function dbl(x, y) {
  if (S.tool !== "cursor" || S.pend || S.replay.pick || Date.now() - dblT < 350) return; dblT = Date.now();
  if (x > G.pw) { if (y < G.ph) { S.yMan = false; S.yScale = 1; S.yShift = 0; draw(); toast("Price scale reset"); } return; }
  if (y > G.ph) { resetView(); draw(); toast("Chart view reset"); return; }
  var h = hitTest(x, y); if (h) { openDrawing(h.id); return; }
  var k = hitInd(x, y); if (k) { if (k === "pine") togglePine(true); else if (k.indexOf("x:") === 0) openXSet(+k.slice(2)); else openInd(k); return; }
  if (candleHit(x, y)) { openChart("Symbol"); return; }
  if (S.ind.vol && y > G.mainH * 0.8 && y < G.mainH) { openInd("vol"); return; }
  openChart("Canvas");
}
cv.addEventListener("dblclick", function (e) { var xy = pos(e); dbl(xy[0], xy[1]); });
$("#legend").addEventListener("dblclick", function (e) { var c = e.target.closest(".chip"); if (!c) return; var t = c.textContent, m = LKEY.filter(function (a) { return t.indexOf(a[0]) === 0; })[0]; if (m) openInd(m[1]); });
$("#readout").addEventListener("dblclick", function (e) { if (e.target.closest(".when")) openChart("Symbol"); });
$("#symLabel").addEventListener("dblclick", function () { openChart("Symbol"); });
$("#objList").addEventListener("dblclick", function (e) { var b = e.target.closest("[data-sel]"); if (b) openDrawing(b.dataset.sel); });
setTimeout(function () {
  var sp = $("#setPop"), b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.textContent = "Pengaturan chart\u2026";
  b.addEventListener("click", function () { closeAll(); openChart("Symbol"); }); sp.insertBefore(b, sp.firstChild);
  var mb = $("#menuBtn"); if (mb) mb.addEventListener("click", function () { openChart("Symbol"); });
}, 0);

$("#legend").addEventListener("click", function (e) {
  var b = e.target.closest("[data-lt]"); if (!b) return;
  if (b.dataset.lt === "eye") { S.ihide[b.dataset.k] = !S.ihide[b.dataset.k]; legendHtml = null; draw(); save(); } else if (b.dataset.lt === "cfg") openInd(b.dataset.k); else { S.ind[b.dataset.k] = false; legendHtml = null; syncUI(); draw(); save(); }
});
/* legend chip tool styles live in the main stylesheet */
/* ---------- Pine editor panel wiring ---------- */
function togglePine(show) {
  var p = $("#pine"), on = show == null ? p.hidden : !!show;
  p.hidden = !on; $("#pineBtn").setAttribute("aria-pressed", String(on));
  if (on) setTimeout(function () { $("#pineCode").focus(); }, 0);
}
$("#pineBtn").addEventListener("click", function () { togglePine(); });
$("#pineClose").addEventListener("click", function () { togglePine(false); });
$("#pineRun").addEventListener("click", function () { S.pine = { src: $("#pineCode").value }; recalc(); legendHtml = null; draw(); save(); });
$("#pineClear").addEventListener("click", function () { S.pine = null; recalc(); draw(); save(); });
$("#pineSample").addEventListener("click", function () { var el = $("#pineCode"); el.value = el.value === PINE_SAMPLE ? PINE_SAMPLE2 : PINE_SAMPLE; });
$("#pineCode").value = S.pine && S.pine.src ? S.pine.src : PINE_SAMPLE;
pineMsg("");

/* ---------- multi-chart layout ---------- */
var MC = null, MCK = "aurum.multichart";
function mcGet() { try { var o = JSON.parse(localStorage.getItem(MCK) || "null"); return o && o.layout ? o : { layout: "1", sync: true }; } catch (e) { return { layout: "1", sync: true }; } }
function mcSet(o) { try { localStorage.setItem(MCK, JSON.stringify(o)); } catch (e) { /* ignore */ } }
var LAYOUTS = [["1", "Single chart"], ["2h", "2 charts, side by side"], ["2v", "2 charts, stacked"], ["4", "4 charts"]];
function layIcon(l) {
  var r = l === "1" ? "<rect x='2' y='2' width='14' height='14' rx='1.5'/>" : l === "2h" ? "<rect x='2' y='2' width='6.5' height='14' rx='1'/><rect x='9.5' y='2' width='6.5' height='14' rx='1'/>" : l === "2v" ? "<rect x='2' y='2' width='14' height='6.5' rx='1'/><rect x='2' y='9.5' width='14' height='6.5' rx='1'/>" : "<rect x='2' y='2' width='6.5' height='6.5' rx='1'/><rect x='9.5' y='2' width='6.5' height='6.5' rx='1'/><rect x='2' y='9.5' width='6.5' height='6.5' rx='1'/><rect x='9.5' y='9.5' width='6.5' height='6.5' rx='1'/>";
  return "<svg viewBox='0 0 18 18' width='18' height='18' fill='none' stroke='currentColor' stroke-width='1.4' aria-hidden='true'>" + r + "</svg>";
}
function mcEnter(layout) {
  mcExit(); if (EMBED) return;
  var n = layout === "4" ? 4 : 2, mc = mcGet(), el = document.createElement("div"), i;
  el.className = "mc l" + layout;
  el.innerHTML = "<div class='mc-bar'><span class='brand'><span class='brand-mark' aria-hidden='true'></span>Charts</span><span class='dim'>multi-chart</span><span class='spacer'></span>" +
    "<label style='display:flex;align-items:center;gap:5px;font-size:12px'><input type='checkbox' id='mcSync2'" + (mc.sync ? " checked" : "") + "> Sync symbols</label>" +
    "<select id='mcLay' aria-label='Chart layout'>" + LAYOUTS.map(function (l) { return "<option value='" + l[0] + "'" + (l[0] === layout ? " selected" : "") + ">" + l[1] + "</option>"; }).join("") + "</select>" +
    "<button class='btn' id='mcExit' type='button'>Exit multi-chart</button></div><div class='mc-grid'></div>";
  document.body.appendChild(el); MC = el;
  var grid = $(".mc-grid", el), base = location.href.split(/[?#]/)[0];
  for (i = 0; i < n; i++) { var f = document.createElement("iframe"); f.src = base + "?embed=1&pane=p" + (i + 1); f.title = "Chart pane " + (i + 1); grid.appendChild(f); }
  $("#mcExit", el).addEventListener("click", function () { var o = mcGet(); o.layout = "1"; mcSet(o); mcExit(); });
  $("#mcLay", el).addEventListener("change", function () { var o = mcGet(); o.layout = this.value; mcSet(o); mcEnter(o.layout); });
  $("#mcSync2", el).addEventListener("change", function () { var o = mcGet(); o.sync = this.checked; mcSet(o); });
}
function mcExit() { if (MC) { MC.remove(); MC = null; } }
(function () {
  var mc = mcGet();
  $("#layPop").innerHTML = LAYOUTS.map(function (l) { return "<button type='button' class='opt lay' data-l='" + l[0] + "' aria-pressed='" + (mc.layout === l[0]) + "'>" + layIcon(l[0]) + "<span class='nm'>" + l[1] + "</span></button>"; }).join("") + "<div class='sep'></div><label><input type='checkbox' id='mcSync'" + (mc.sync ? " checked" : "") + "> Sync symbols across panes</label>";
  wireDd($("#layBtn"), $("#layPop"));
  $("#layPop").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-l]"); if (!b) return;
    var o = mcGet(); o.layout = b.dataset.l; mcSet(o);
    $$("#layPop button[data-l]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    closeAll(); if (o.layout === "1") mcExit(); else mcEnter(o.layout);
  });
  $("#mcSync").addEventListener("change", function () { var o = mcGet(); o.sync = this.checked; mcSet(o); });
  if (!EMBED && mc.layout !== "1") mcEnter(mc.layout);
})();

/* multi-chart symbol sync (parent broadcasts, panes apply) */
var suppressMc = false;
window.addEventListener("message", function (e) {
  var d = e.data || {};
  if (d.t === "aurum-mc-set" && EMBED) {
    var s2 = N_(d.sym);
    if (s2 && s2.id !== S.sym.id) { suppressMc = true; try { selectSym(s2); } catch (er) { /* ignore */ } suppressMc = false; }
  } else if (d.t === "aurum-mc" && MC && mcGet().sync) {
    $$("iframe", MC).forEach(function (f) { if (f.contentWindow && f.contentWindow !== e.source) { try { f.contentWindow.postMessage({ t: "aurum-mc-set", sym: d.sym }, "*"); } catch (er) { /* ignore */ } } });
  }
});

applyPrec(); applyStatus(); setInterval(function () { if (S.sty.cd) draw(); }, 1000);


