/* 10b-indlg: dialog "Indikator" (modal, pencarian, kategori, daftar aktif) dan pengaturan indikator tambahan */
var idCat = "all", idQ = "", idEl = null;
function idFavKey(r) { return r.kind === "b" ? "b:" + r.k : "x:" + r.id; }
function closeIndDlg() { if (idEl) idEl.hidden = true; }
document.addEventListener("keydown", function (e) { if (e.key === "Escape" && idEl && !idEl.hidden) { e.stopPropagation(); closeIndDlg(); } }, true);
function idBuiltKey(k) { return $("#indPop [data-k=\"" + k + "\"]"); }
function idRows() {
  var q = idQ.trim().toLowerCase(), rows = [], act = [];
  XBUILT.forEach(function (b) { if (S.ind[b[0]]) act.push({ kind: "b", k: b[0], n: b[1] }); });
  S.xi.forEach(function (x) { act.push({ kind: "x", u: x.u, n: xTitle(x) }); });
  if (idCat === "active") return act.map(function (a) { a.active = true; return a; });
  var fv = idCat === "fav";
  XBUILT.forEach(function (b) { if ((idCat === "all" || fv || idCat === b[2]) && (!fv || S.favInd.indexOf("b:" + b[0]) >= 0) && (!q || b[1].toLowerCase().indexOf(q) >= 0)) rows.push({ kind: "b", k: b[0], n: b[1], g: b[2], on: !!S.ind[b[0]] }); });
  XORDER.forEach(function (id) { var d = XIND[id]; if ((idCat === "all" || fv || idCat === d.g) && (!fv || S.favInd.indexOf("x:" + id) >= 0) && (!q || d.n.toLowerCase().indexOf(q) >= 0)) rows.push({ kind: "x", id: id, n: d.n, g: d.g, ov: d.ov }); });
  rows.sort(function (a, b) { return a.n.localeCompare(b.n); });
  return rows;
}
function idRender() {
  var act = XBUILT.filter(function (b) { return S.ind[b[0]]; }).length + S.xi.length, h = "";
  var nb = function (n) { return "<button type=\"button\" data-cat=\"" + n[0] + "\" aria-pressed=\"" + (idCat === n[0]) + "\">" + n[1] + "</button>"; };
  $(".idl", idEl).innerHTML = "<div class=\"idh\">PERSONAL</div>" + nb(["fav", "Favorites"]) + nb(["active", "Active (" + act + ")"]) + "<div class=\"idh\">BUILT-IN</div>" + XGROUPS.map(function (g, k) { return nb(k ? g : ["all", "Technicals"]); }).join("");
  var rows = idRows(), gl = { trend: "Tren", osc: "Osilator", vola: "Volatilitas", vol: "Volume" };
  if (!rows.length) h = "<li class=\"idnone\">" + (idCat === "active" ? "No active indicators. Pick one from the list." : idCat === "fav" ? "No favorites yet. Click the star next to an indicator." : "No results.") + "</li>";
  rows.forEach(function (r) {
    if (r.active) h += "<li class=\"idrow act\"><span class=\"nm\">" + r.n + "</span><span class=\"idacts\"><button type=\"button\" data-ia=\"cfg\" data-kind=\"" + r.kind + "\" data-key=\"" + (r.kind === "b" ? r.k : r.u) + "\" aria-label=\"Pengaturan " + r.n + "\">\u2699</button><button type=\"button\" data-ia=\"del\" data-kind=\"" + r.kind + "\" data-key=\"" + (r.kind === "b" ? r.k : r.u) + "\" aria-label=\"Hapus " + r.n + "\">\u00D7</button></span></li>";
    else h += "<li class=\"idrow\"><button type=\"button\" class=\"idstar\" data-ia=\"fav\" data-kind=\"" + r.kind + "\" data-key=\"" + (r.kind === "b" ? r.k : r.id) + "\" aria-label=\"Favorite\" aria-pressed=\"" + (S.favInd.indexOf(idFavKey(r)) >= 0) + "\">" + (S.favInd.indexOf(idFavKey(r)) >= 0 ? "\u2605" : "\u2606") + "</button><button type=\"button\" class=\"idpick\" data-ia=\"add\" data-kind=\"" + r.kind + "\" data-key=\"" + (r.kind === "b" ? r.k : r.id) + "\"><span class=\"nm\">" + r.n + "</span><span class=\"tg\">" + (gl[r.g] || "") + (r.ov === false ? " \u00B7 panel" : r.ov ? " \u00B7 overlay" : "") + "</span>" + (r.on ? "<span class=\"on\">Aktif</span>" : "") + "</button></li>";
  });
  $(".idlist", idEl).innerHTML = h;
}
function openIndDlg(cat) {
  if (!idEl) {
    idEl = document.createElement("div"); idEl.id = "indDlg"; idEl.className = "modal"; idEl.hidden = true; idEl.setAttribute("role", "dialog"); idEl.setAttribute("aria-modal", "true"); idEl.setAttribute("aria-label", "Indikator");
    idEl.innerHTML = "<div class=\"box idbox\"><div class=\"hd\"><b>Indikator, metrik, dan strategi</b><span class=\"spacer\" style=\"flex:1\"></span><button type=\"button\" class=\"btn ic\" data-ia=\"close\" aria-label=\"Tutup\">\u00D7</button></div><div class=\"hd\"><input id=\"idq\" type=\"search\" placeholder=\"Cari\" aria-label=\"Cari indikator\" autocomplete=\"off\"></div><div class=\"idbd\"><nav class=\"idl\" aria-label=\"Kategori\"></nav><ul class=\"idlist\"></ul></div></div>";
    document.body.appendChild(idEl);
    idEl.addEventListener("click", function (e) {
      if (e.target === idEl) { closeIndDlg(); return; }
      var c = e.target.closest("[data-cat]"); if (c) { idCat = c.dataset.cat; idRender(); return; }
      var b = e.target.closest("[data-ia]"); if (!b) return; var a = b.dataset.ia, key = b.dataset.key;
      if (a === "close") closeIndDlg();
      else if (a === "fav") { var fk = (b.dataset.kind === "b" ? "b:" : "x:") + key, fi = S.favInd.indexOf(fk); if (fi >= 0) S.favInd.splice(fi, 1); else S.favInd.push(fk); save(); idRender(); }
      else if (a === "add") {
        if (b.dataset.kind === "b") { var cb = idBuiltKey(key); if (cb) { if (cb.checked) { toast("Indikator sudah aktif"); } else cb.click(); } }
        else { xAdd(key); toast(XIND[key].n + " ditambahkan"); }
        idRender();
      } else if (a === "del") {
        if (b.dataset.kind === "b") { var cb2 = idBuiltKey(key); if (cb2 && cb2.checked) cb2.click(); } else xRemove(+key);
        idRender();
      } else if (a === "cfg") { closeIndDlg(); if (b.dataset.kind === "b") openInd(key); else openXSet(+key); }
    });
    idEl.addEventListener("input", function (e) { if (e.target.id === "idq") { idQ = e.target.value; idRender(); } });
    idEl.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); closeIndDlg(); } });
  }
  idCat = cat || (S.favInd.length ? "fav" : "all"); idQ = ""; $("#idq", idEl).value = ""; idEl.hidden = false; idRender(); $("#idq", idEl).focus();
}

/* pengaturan satu indikator tambahan */
function openXSet(u) {
  var x = S.xi.filter(function (q) { return q.u === u; })[0]; if (!x) return;
  var d = XIND[x.id], P = xParams(x), r = XR[x.u] || { plots: [] }, el = document.createElement("div");
  el.className = "modal"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Pengaturan " + d.n);
  var body = Object.keys(d.p).map(function (k) { return "<label class=\"xs\">" + k + "<input type=\"number\" step=\"any\" data-p=\"" + k + "\" value=\"" + P[k] + "\"></label>"; }).join("");
  body += r.plots.map(function (p, i) { return "<label class=\"xs\">Warna: " + p.n + "<input type=\"color\" data-c=\"" + i + "\" value=\"" + xCol(x, p, i) + "\"></label>"; }).join("");
  if (!body) body = "<p class=\"idnone\">Indikator ini tidak punya parameter.</p>";
  el.innerHTML = "<div class=\"box xsbox\"><div class=\"hd\"><b>" + d.n + "</b></div><div class=\"xsb\">" + body + "</div><div class=\"hd xsft\"><button type=\"button\" class=\"btn\" data-xs=\"del\">Hapus</button><span style=\"flex:1\"></span><button type=\"button\" class=\"btn\" data-xs=\"cancel\">Batal</button><button type=\"button\" class=\"btn sd-ok\" data-xs=\"ok\">Ok</button></div></div>";
  document.body.appendChild(el);
  function done() { el.remove(); }
  el.addEventListener("click", function (e) {
    if (e.target === el) { done(); return; }
    var b = e.target.closest("[data-xs]"); if (!b) return;
    if (b.dataset.xs === "ok") {
      x.p = {}; x.c = x.c || {};
      $$("[data-p]", el).forEach(function (i) { var v = parseFloat(i.value); if (isFinite(v) && v > 0) x.p[i.dataset.p] = v; });
      $$("[data-c]", el).forEach(function (i) { x.c[i.dataset.c] = i.value; });
      calcX(); legendHtml = null; draw(); save(); done();
    } else if (b.dataset.xs === "del") { xRemove(x.u); done(); } else done();
  });
  el.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); done(); } else if (e.key === "Enter" && e.target.tagName === "INPUT") $("[data-xs=ok]", el).click(); });
  var f = $("input", el); if (f) f.focus();
}

/* klik pada chip legenda indikator tambahan */
$("#legend").addEventListener("click", function (e) {
  var b = e.target.closest("[data-xa]"); if (!b) return; var chip = b.closest("[data-xu]"), u = +chip.dataset.xu, x = S.xi.filter(function (q) { return q.u === u; })[0]; if (!x) return;
  if (b.dataset.xa === "eye") { x.h = !x.h; legendHtml = null; draw(); save(); } else if (b.dataset.xa === "set") openXSet(u); else xRemove(u);
});
$("#legend").addEventListener("dblclick", function (e) { var c = e.target.closest("[data-xu]"); if (c) openXSet(+c.dataset.xu); });

$("#qsBtn").addEventListener("click", function () { openSearch("sym"); });
