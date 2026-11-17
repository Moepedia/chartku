/* 11b-panels: Data window (nilai di bawah kursor) dan Screeners (tabel simbol, bisa diurutkan) */
var scrSort = { k: "pc", dir: -1 };
function renderDataWindow(i) {
  var el = $("#dwBody"); if (!el || S.tab !== "data" || $("#p-data").hidden) return; var b = bars[i] || bars[bars.length - 1], d = S.sym.dec; $("#dwSym").textContent = S.sym.label; if (!b) { el.innerHTML = ""; return; }
  var pv = bars[Math.max(0, (bars.indexOf(b)) - 1)], ch = b.c - pv.c, h = "<div><dt>Date</dt><dd>" + fullTime(b.t) + "</dd></div><div><dt>Open</dt><dd>" + fmt(b.o, d) + "</dd></div><div><dt>High</dt><dd>" + fmt(b.h, d) + "</dd></div><div><dt>Low</dt><dd>" + fmt(b.l, d) + "</dd></div><div><dt>Close</dt><dd>" + fmt(b.c, d) + "</dd></div><div><dt>Change</dt><dd class='" + (ch >= 0 ? "up" : "down") + "'>" + (ch >= 0 ? "+" : "") + fmt(ch, d) + " (" + (pv.c ? (ch / pv.c * 100).toFixed(2) : "0.00") + "%)</dd></div><div><dt>Volume</dt><dd>" + fmt(b.v || 0, 0) + "</dd></div>";
  var idx = bars.indexOf(b);
  XBUILT.forEach(function (x) { if (S.ind[x[0]] && IND_VAL[x[0]]) h += "<div><dt>" + x[1] + "</dt><dd>" + IND_VAL[x[0]](idx) + "</dd></div>"; });
  S.xi.forEach(function (x) { var r = XR[x.u]; if (!r) return; r.plots.forEach(function (p) { var v = p.d[idx]; h += "<div><dt>" + xTitle(x) + " \u00B7 " + p.n + "</dt><dd>" + (v == null ? "\u2013" : fmt(v, Math.abs(v) < 10 ? 4 : 2)) + "</dd></div>"; }); });
  el.innerHTML = h;
}
var IND_VAL = {
  sma: function (i) { var v = ind.sma && ind.sma[i]; return v == null ? "\u2013" : fmt(v, S.sym.dec); }, ema: function (i) { var v = ind.ema && ind.ema[i]; return v == null ? "\u2013" : fmt(v, S.sym.dec); },
  rsi: function (i) { var v = ind.rsi && ind.rsi[i]; return v == null ? "\u2013" : v.toFixed(2); }, atr: function (i) { var v = ind.atr && ind.atr[i]; return v == null ? "\u2013" : fmt(v, S.sym.dec); }
};
function renderScreener() {
  var tb = $("#scrTbl tbody"); if (!tb) return;
  var rows = SYMS.map(function (s) { var p = live[s.id], pc = ref[s.id] ? (p / ref[s.id] - 1) * 100 : 0; return { s: s, label: s.label, p: p, pc: pc, cat: s.cat, ok: !!ready[s.id] }; });
  rows.sort(function (a, b) { var x = a[scrSort.k], y = b[scrSort.k]; return (typeof x === "string" ? x.localeCompare(y) : (x - y)) * scrSort.dir; });
  tb.innerHTML = rows.map(function (r) { return "<tr data-id='" + r.s.id + "' class='" + (r.s === S.sym ? "cur" : "") + "'><td><b>" + r.label + "</b></td><td class='r'>" + (r.ok ? fmt(r.p, r.s.dec) : "\u2026") + "</td><td class='r " + (r.pc >= 0 ? "up" : "down") + "'>" + (r.ok ? (r.pc >= 0 ? "+" : "") + r.pc.toFixed(2) + "%" : "") + "</td><td>" + r.cat + "</td></tr>"; }).join("");
  $$("#scrTbl th").forEach(function (th) { th.setAttribute("aria-sort", th.dataset.sc === scrSort.k ? (scrSort.dir > 0 ? "ascending" : "descending") : "none"); });
}
$("#scrTbl").addEventListener("click", function (e) {
  var th = e.target.closest("th[data-sc]"); if (th) { scrSort = { k: th.dataset.sc, dir: scrSort.k === th.dataset.sc ? -scrSort.dir : (th.dataset.sc === "label" || th.dataset.sc === "cat" ? 1 : -1) }; renderScreener(); return; }
  var tr = e.target.closest("tr[data-id]"); if (tr) selectSym(N_(tr.dataset.id));
});
