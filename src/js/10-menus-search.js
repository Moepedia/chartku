/* 10-menus-search: menu, sinkron kontrol, pencarian simbol */
/* ---------- menus ---------- */
var tfSig = "";
function setTf(t) { if (!t) return; S.tf = t; S.range = null; closeAll(); setReplay(false); loadData(); save(); }
function addTfFromInputs() {
  var n = parseInt($("#tfN").value, 10), u = $("#tfU").value, t = tfOk(n, u) ? addCustomTf(n, u) : null;
  if (!t) { toast("Use a whole number: up to 1439 minutes, 168 hours, 365 days, 52 weeks or 24 months."); return; }
  setTf(t);
}
function buildTfBar(force) {
  var sig = S.ftf.join() + "|" + S.tf.k + "|" + CTF.map(function (t) { return t.k; }).join();
  if (!force && sig === tfSig) return; tfSig = sig;
  var keys = S.ftf.slice(); if (keys.indexOf(S.tf.k) < 0) keys.push(S.tf.k);
  var list = keys.map(tfByKey).filter(Boolean).sort(function (a, b) { return a.s - b.s || (a.mo ? 1 : 0) - (b.mo ? 1 : 0); });
  $("#tfs").innerHTML = list.map(function (t) { return "<button type='button' data-k='" + t.k + "' title='" + tfLabel(t) + "' aria-pressed='" + (t.k === S.tf.k) + "'>" + t.k + "</button>"; }).join("");
  var tc = $("#tfCur"); if (tc) tc.textContent = S.tf.k;
  renderTfPop();
}
function renderTfPop() {
  var pop = $("#tfPop"), pv = $("#tfN") ? $("#tfN").value : "", pu = $("#tfU") ? $("#tfU").value : "m";
  var row = function (t, custom) {
    var fav = S.ftf.indexOf(t.k) >= 0;
    return "<div class='tfrow'><button type='button' class='opt' data-k='" + t.k + "' aria-pressed='" + (t.k === S.tf.k) + "'>" + tfLabel(t) + "</button><button type='button' class='star" + (fav ? " on" : "") + "' data-star='" + t.k + "' aria-label='" + (fav ? "Unpin " : "Pin ") + tfLabel(t) + " " + (fav ? "from" : "to") + " the toolbar' title='" + (fav ? "Unpin from" : "Pin to") + " toolbar'>" + (fav ? "\u2605" : "\u2606") + "</button>" + (custom ? "<button type='button' class='star' data-del='" + t.k + "' aria-label='Delete custom interval " + t.k + "' title='Delete'>&times;</button>" : "") + "</div>";
  };
  var h = "<div class='tfcust'><input id='tfN' type='number' inputmode='numeric' min='1' step='1' placeholder='e.g. 7' aria-label='Custom interval value' value='" + esc(pv) + "'><select id='tfU' aria-label='Custom interval unit'>" +
    [["m", "minutes"], ["H", "hours"], ["D", "days"], ["W", "weeks"], ["M", "months"]].map(function (o) { return "<option value='" + o[0] + "'" + (o[0] === pu ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select><button type='button' class='btn' id='tfAdd'>Add</button></div><small>Type any interval, for example 7 minutes or 3 days. Star one to pin it to the toolbar.</small>";
  if (CTF.length) h += "<h4>Custom</h4>" + CTF.map(function (t) { return row(t, true); }).join("");
  [["Minutes", "m"], ["Hours", "H"], ["Days, weeks, months", "DWM"]].forEach(function (g) {
    h += "<h4>" + g[0] + "</h4>" + TFS.filter(function (t) { return g[1].indexOf(t.u) >= 0; }).map(function (t) { return row(t, false); }).join("");
  });
  pop.innerHTML = h;
}
function closeAll() { $$(".pop").forEach(function (p) { p.hidden = true; fitPop(p); }); $$("[aria-expanded]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); }); }
function fitPop(pop) {
  /* Dropdown memakai position:fixed agar tidak terpotong header (.top overflow-x:auto) atau panel lain. */
  if (pop.hidden) { pop.style.position = pop.style.left = pop.style.top = pop.style.right = pop.style.bottom = pop.style.maxHeight = ""; return; }
  var dd = pop.parentElement, a = dd.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
  pop.style.position = "fixed"; pop.style.right = "auto"; pop.style.bottom = "auto"; pop.style.maxHeight = "";
  var w = pop.offsetWidth, h = pop.offsetHeight, up = pop.id === "gotoPop";
  var left = pop.classList.contains("r") ? a.right - w : a.left;
  left = Math.max(8, Math.min(left, vw - w - 8));
  var room = up ? a.top - 14 : vh - a.bottom - 14;
  if (h > room) { pop.style.maxHeight = Math.max(160, room) + "px"; h = pop.offsetHeight; }
  pop.style.left = left + "px";
  pop.style.top = (up ? Math.max(8, a.top - 6 - h) : a.bottom + 6) + "px";
}
function wireDd(btn, pop) {
  btn.addEventListener("click", function (e) { e.stopPropagation(); hideFly(); var open = !pop.hidden; closeAll(); pop.hidden = open; btn.setAttribute("aria-expanded", String(!open)); fitPop(pop); });
}
window.addEventListener("resize", function () { $$(".pop").forEach(function (p) { if (!p.hidden) fitPop(p); }); });
document.addEventListener("click", function (e) { if (!e.target.closest(".pop")) closeAll(); if (!e.target.closest("#ctxm") && Date.now() - ctxAt > 450) hideCtx(); if (!e.target.closest("#fly") && !e.target.closest("#rail")) hideFly(); });
function buildMenus() {
  var h = ""; TYPES.forEach(function (t) { h += "<label><input type='radio' name='ctype' value='" + t[0] + "'> " + t[1] + "</label>"; });
  $("#typePop").innerHTML = h; wireDd($("#typeBtn"), $("#typePop"));
  $("#typePop").addEventListener("change", function (e) { S.type = e.target.value; syncUI(); draw(); save(); closeAll(); });
  h = ""; INDS.forEach(function (t) { var nm = LNAME[t[0]] || t[1]; h += "<label><input type='checkbox' data-k='" + t[0] + "'> " + nm + (LENK[t[0]] ? " <input type='number' class='len' title='Length' data-len='" + LENK[t[0]] + "' min='2' max='500' value='" + S.len[LENK[t[0]]] + "'>" : "") + "</label>"; });
  var C0 = colors(), cs = "";
  [["i1", "SMA / MACD"], ["i2", "EMA / RSI"], ["i3", "Bollinger / ADX"], ["i4", "VWAP / ATR"]].forEach(function (c) { cs += "<label>" + c[1] + " <input type='color' data-col='" + c[0] + "' value='" + C0[c[0]] + "' style='margin-left:auto;width:34px;height:22px;padding:0;border:0;background:none'></label>"; });
  $("#indPop").innerHTML = "<div style='padding:4px 8px'><input id='indQ' type='search' placeholder='Search indicators' aria-label='Search indicators' style='width:100%;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:5px 8px'></div>" + h + "<div class='sep'></div><small>Indicator colors</small>" + cs + "<button class='opt' type='button' id='colReset'>Reset colors</button>"; $("#indBtn").addEventListener("click", function (e) { e.stopPropagation(); closeAll(); hideFly(); openIndDlg(); });
  $("#indQ").addEventListener("input", function () { var q = this.value.toLowerCase(); $$("#indPop label").forEach(function (l) { if (!l.querySelector("[data-k]")) return; l.style.display = l.textContent.toLowerCase().indexOf(q) < 0 ? "none" : ""; }); });
  $("#indPop").addEventListener("input", function (e) { if (!e.target.dataset.col) return; S.colOv[e.target.dataset.col] = e.target.value; legendHtml = null; draw(); save(); });
  $("#colReset").addEventListener("click", function () { S.colOv = {}; $$("#indPop [data-col]").forEach(function (i) { i.value = colors()[i.dataset.col]; }); draw(); save(); });
  $("#indPop").addEventListener("change", function (e) {
    if (e.target.dataset.len) { S.len[e.target.dataset.len] = Math.max(2, Math.min(500, parseInt(e.target.value, 10) || 14)); e.target.value = S.len[e.target.dataset.len]; recalc(); legendHtml = null; draw(); save(); return; }
    if (!e.target.dataset.k) return; S.ind[e.target.dataset.k] = e.target.checked; syncUI(); draw(); save();
  });
  h = "<label><input type='checkbox' id='gridChk'> Grid lines</label><label><input type='checkbox' id='hiloChk'> High and low price labels</label><label><input type='checkbox' id='wmChk'> Watermark <span style='color:var(--muted)'>(symbol text in the middle of the chart)</span></label><label><input type='checkbox' id='evChk2'> Event markers on chart</label><div class='row'><label for='tzSel' style='padding:0'>Time zone</label></div><div style='padding:0 8px 6px'><select id='tzSel'>";
  TZS.forEach(function (z) { h += "<option value='" + z[0] + "'>" + z[1] + "</option>"; });
  h += "</select></div><div class='row'><label for='srcSel' style='padding:0'>Data source</label></div><div style='padding:0 8px 6px'><select id='srcSel'>" + Object.keys(SRCN).map(function (k) { return "<option value='" + k + "'>" + SRCN[k] + "</option>"; }).join("") + "</select></div><div class='sep'></div><div class='row'><label style='padding:0'>Saved layouts</label></div><div style='padding:0 8px 6px;display:flex;gap:4px'><input id='lyName' placeholder='Layout name' maxlength='30' style='flex:1;min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:4px 6px'><button class='btn' id='lySave' type='button'>Save</button></div><div style='padding:0 8px 6px;display:flex;gap:4px'><select id='lySel' style='flex:1;min-width:0'></select><button class='btn' id='lyLoad' type='button'>Load</button><button class='btn' id='lyDel' type='button'>Del</button></div><div class='sep'></div><button class='danger' type='button' id='resetAll'>Reset layout and account</button><small>Clears drawings, alerts, watchlist and paper trades.</small>";
  $("#setPop").innerHTML = h; wireDd($("#setBtn"), $("#setPop"));
  $("#gridChk").addEventListener("change", function () { S.grid = this.checked; draw(); save(); });
  $("#hiloChk").addEventListener("change", function () { S.hilo = this.checked; draw(); save(); });
  $("#wmChk").addEventListener("change", function () { S.sty.wm = this.checked; draw(); save(); });
  $("#evChk2").addEventListener("change", function () { S.events = this.checked; $("#evChk").checked = S.events; draw(); save(); });
  $("#srcSel").value = srcPref; $("#srcSel").addEventListener("change", function () { srcPref = this.value; save(); loadData(); quoteQueue(true); });
  $("#tzSel").addEventListener("change", function () { S.tz = this.value; draw(); save(); });
  $("#resetAll").addEventListener("click", function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } S.drawings = {}; S.alerts = []; S.acc = { real: 0, pos: {} }; S.watch = ["XAUUSD", "XAGUSD", "EURUSD", "USDJPY", "USDIDR", "WTI", "BTCUSD", "SPX"]; S.cmp = []; S.cmpP = []; S.sel = null; closeAll(); loadData(); buildWatch(); renderAlerts(); renderTrade(); syncSel(); toast("Layout reset."); });
  var LYK = "aurum.layouts";
  var lyGet = function () { try { return JSON.parse(localStorage.getItem(LYK) || "{}") || {}; } catch (e) { return {}; } };
  var lySet = function (o) { try { localStorage.setItem(LYK, JSON.stringify(o)); } catch (e) { toast("Storage is unavailable."); } };
  var lyRender = function () { $("#lySel").innerHTML = Object.keys(lyGet()).map(function (k) { return "<option>" + esc(k) + "</option>"; }).join("") || "<option value=''>No saved layouts</option>"; };
  lyRender();
  $("#lySave").addEventListener("click", function () {
    var n = $("#lyName").value.trim(); if (!n) { toast("Type a layout name first."); return; }
    var o = lyGet(); o[n] = { sym: S.sym.id, tf: S.tf.k, type: S.type, scale: S.scale, invert: S.invert, hilo: S.hilo, events: S.events, ind: S.ind, xi: S.xi, len: S.len, cmp: S.cmp, cmpP: S.cmpP, colOv: S.colOv, pine: S.pine }; lySet(o); $("#lyName").value = ""; lyRender(); $("#lySel").value = n; toast("Layout saved.");
  });
  $("#lyLoad").addEventListener("click", function () {
    var l = lyGet()[$("#lySel").value]; if (!l) return;
    S.sym = N_(l.sym) || S.sym; S.tf = tfByKey(l.tf) || S.tf; S.type = l.type; S.scale = l.scale; S.ind = Object.assign(S.ind, l.ind); S.len = Object.assign(S.len, l.len);
    S.cmp = (l.cmp || []).filter(function (id) { return N_(id) && id !== S.sym.id; }); S.cmpP = (l.cmpP || []).filter(function (id) { return N_(id) && id !== S.sym.id; }); S.colOv = l.colOv || {}; S.range = null; S.sel = null;
    S.xi = (l.xi || []).filter(function (x) { return XIND[x.id]; }).map(function (x) { x.u = ++xUid; return x; }); S.invert = !!l.invert; S.hilo = l.hilo !== false; S.events = l.events !== false; S.pine = l.pine || null;
    if (S.pine) $("#pineCode").value = S.pine.src; recalc();
    $$("#indPop input.len").forEach(function (i) { i.value = S.len[i.dataset.len]; }); $$("#indPop [data-col]").forEach(function (i) { i.value = colors()[i.dataset.col]; });
    closeAll(); setReplay(false); loadData(); header(); watchUpdate(); renderAlerts(); renderTrade(); renderInfo(); $("#qty").value = S.sym.lot; syncSel(); syncUI(); save(); toast("Layout loaded.");
  });
  $("#lyDel").addEventListener("click", function () { var o = lyGet(); delete o[$("#lySel").value]; lySet(o); lyRender(); });
  wireDd($("#tfBtn"), $("#tfPop")); buildTfBar(true);
  $("#tfs").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) setTf(tfByKey(b.dataset.k)); });
  $("#tfPop").addEventListener("click", function (e) {
    e.stopPropagation(); var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.star) { var i = S.ftf.indexOf(b.dataset.star); if (i >= 0) S.ftf.splice(i, 1); else S.ftf.push(b.dataset.star); buildTfBar(true); save(); }
    else if (b.dataset.del) {
      var k = b.dataset.del; CTF = CTF.filter(function (t) { return t.k !== k; }); S.ftf = S.ftf.filter(function (x) { return x !== k; });
      if (S.tf.k === k) setTf(TF_H); else { buildTfBar(true); save(); }
    }
    else if (b.id === "tfAdd") addTfFromInputs();
    else if (b.dataset.k) setTf(tfByKey(b.dataset.k));
  });
  $("#tfPop").addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.id === "tfN") { e.preventDefault(); addTfFromInputs(); } e.stopPropagation(); });
  $("#scales").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.x === "inv") { S.invert = !S.invert; toast(S.invert ? "Scale inverted" : "Scale normal"); }
    else if (b.dataset.x === "lock") { S.lockScale = !S.lockScale; S.lockR = null; toast(S.lockScale ? "Price scale locked" : "Price scale unlocked"); }
    else S.scale = b.dataset.s;
    syncUI(); draw(); save();
  });
  $("#theme").addEventListener("click", function () {
    var root = document.documentElement, cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    root.setAttribute("data-theme", cur === "dark" ? "light" : "dark"); draw(); save();
  });
  $("#fs").addEventListener("click", function () {
    var el = $("#shell"); try { if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen().catch(function () { toast("Fullscreen is not available here."); }); } catch (e) { toast("Fullscreen is not available here."); }
  });
  $$("#rrail button[data-tab]").forEach(function (b) { b.addEventListener("click", function () { openPanel(b.dataset.tab); }); });
  $("#sideClose").addEventListener("click", function () { $("#work").classList.add("panel-closed"); syncPanel(); });
  $("#saveBtn").addEventListener("click", function () { save(); toast("Tata letak tersimpan otomatis di browser ini."); });
  $("#rpBtnB").addEventListener("click", function () { setReplay(!S.replay.on); });
  $("#tradeBtnB").addEventListener("click", function () { openPanel("trade"); });
}
var TABT = { watch: "Daftar Pantau", alerts: "Peringatan", trade: "Trading Panel", info: "Info Simbol", objs: "Objek", events: "Agenda" };
function selectTab(t) {
  S.tab = t;
  ["watch", "alerts", "trade", "info", "objs", "events"].forEach(function (k) { $("#p-" + k).hidden = k !== t; });
  var st2 = $("#sideTitle"); if (st2) st2.textContent = TABT[t] || t;
  syncPanel(); renderObjs(); if (t === "events") renderEvents();
}
function syncPanel() { var closed = $("#work").classList.contains("panel-closed"); $$("#rrail button[data-tab]").forEach(function (b) { b.setAttribute("aria-pressed", String(!closed && b.dataset.tab === S.tab)); }); }
function openPanel(t) { var w = $("#work"); if (S.tab === t && !w.classList.contains("panel-closed")) { w.classList.add("panel-closed"); syncPanel(); return; } w.classList.remove("panel-closed"); selectTab(t); }

/* ---------- syncing controls ---------- */
function syncUI() {
  buildTfBar(); $$("#tfs button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.k === S.tf.k)); });
  var tn = TYPES.filter(function (t) { return t[0] === S.type; })[0][1]; $("#typeBtn").title = "Chart type: " + tn; $("#typeBtn").setAttribute("aria-label", "Chart type: " + tn);
  $$("#typePop input").forEach(function (i) { i.checked = i.value === S.type; });
  $$("#indPop input").forEach(function (i) { i.checked = !!S.ind[i.dataset.k]; });
  var eff = S.cmp.length ? "pct" : S.scale;
  $$("#scales button").forEach(function (b) {
    if (b.dataset.x === "inv") { b.setAttribute("aria-pressed", String(S.invert)); return; }
    if (b.dataset.x === "lock") { b.setAttribute("aria-pressed", String(S.lockScale)); return; }
    b.setAttribute("aria-pressed", String(b.dataset.s === eff)); b.disabled = S.cmp.length > 0 && b.dataset.s !== "pct";
  });
  refreshRail(); $("#keepBtn").setAttribute("aria-pressed", String(S.keep));
  $("#magnet").setAttribute("aria-pressed", String(S.magnet)); $("#hideDr").setAttribute("aria-pressed", String(S.hideD)); syncUndo();
  $("#gridChk").checked = S.grid; $("#hiloChk").checked = S.hilo; $("#wmChk").checked = S.sty.wm !== false; $("#evChk2").checked = S.events; $("#tzSel").value = S.tz;
  var rp = S.replay; $("#rpBtn").setAttribute("aria-pressed", String(rp.on)); var rb2 = $("#rpBtnB"); if (rb2) rb2.setAttribute("aria-pressed", String(rp.on)); $("#rp").hidden = !rp.on;
  $("#rpPick").setAttribute("aria-pressed", String(rp.pick)); $("#rpPick").textContent = rp.pick ? "Start here" : "Pick start bar"; $("#rpPlay").textContent = rp.playing ? "Pause" : "Play";
  $("#rpInfo").textContent = "bar " + (rp.idx + 1) + " of " + bars.length + (rp.pick ? ". Tap or drag on the chart to place the start line, then press Start here" : "");
  var h = ""; var ctSel = function (id) { return "<select class='ct' data-ct='" + id + "' aria-label='Chart type'>" + [["line", "Line"], ["area", "Area"], ["candles", "Candles"], ["bars", "OHLC"]].map(function (o) { return "<option value='" + o[0] + "'" + ((S.cmpT[id] || "line") === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select>"; };
  S.cmp.forEach(function (id, i) { var s = N_(id); h += "<span class='chip' style='color:var(--c" + (i + 1) + ")'>vs " + s.label + ctSel(id) + "<button type='button' data-id='" + id + "' aria-label='Remove " + s.label + "'>&times;</button></span>"; });
  S.cmpP.forEach(function (id, i) { var s = N_(id); h += "<span class='chip' style='color:var(--c" + (i % 3 + 1) + ")'>" + s.label + " panel" + ctSel(id) + "<button type='button' data-pid='" + id + "' aria-label='Remove " + s.label + " panel'>&times;</button></span>"; });
  $("#chips").innerHTML = h; wrap.style.setProperty("--extra", (S.cmpP.length * 130) + "px");
  $$("#rangeBar button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.r === S.range)); });
}
$("#chips").addEventListener("change", function (e) { var id = e.target.dataset.ct; if (!id) return; S.cmpT[id] = e.target.value; draw(); save(); });
$("#chips").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.pid) S.cmpP = S.cmpP.filter(function (id) { return id !== b.dataset.pid; }); else S.cmp = S.cmp.filter(function (id) { return id !== b.dataset.id; }); buildCmp(); syncUI(); draw(); save(); });

/* ---------- symbol search ---------- */
var sMode = "sym", sIdx = 0, sList = [], lastFocus = null;
function openSearch(mode, pre) {
  sMode = mode; lastFocus = document.activeElement; $("#sMode").textContent = mode === "cmp" ? "Bandingkan (overlay)" : mode === "cmpP" ? "Bandingkan di panel baru" : mode === "watch" ? "Tambah ke daftar pantau" : "Simbol";
  $("#srch").hidden = false; var q = $("#sq"); q.value = pre || ""; renderSearch(); q.focus();
}
function closeSearch() { $("#srch").hidden = true; if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) { /* ignore */ } }
function renderSearch() {
  var q = $("#sq").value.trim().toLowerCase();
  sList = SYMS.filter(function (s) { return !q || s.label.toLowerCase().indexOf(q) >= 0 || s.id.toLowerCase().indexOf(q) >= 0 || s.name.toLowerCase().indexOf(q) >= 0 || s.cat.toLowerCase().indexOf(q) >= 0; });
  sIdx = Math.min(sIdx, Math.max(0, sList.length - 1));
  var h = ""; sList.forEach(function (s, i) { h += "<li><button type='button' data-i='" + i + "' class='" + (i === sIdx ? "hl" : "") + "'><span class='a'>" + s.label + "</span><span class='b'>" + s.name + "</span><span class='c'>" + s.cat + "</span></button></li>"; });
  $("#sl").innerHTML = h || "<li class='empty'>Tidak ada hasil. Coba nama seperti gold, euro, atau bitcoin.</li>";
}
function chooseSym(s) {
  closeSearch();
  if (sMode === "watch") { if (S.watch.indexOf(s.id) < 0) S.watch.push(s.id); buildWatch(); save(); }
  else if (sMode === "cmp") { if (s.id !== S.sym.id && S.cmp.indexOf(s.id) < 0 && S.cmp.length < 3) S.cmp.push(s.id); buildCmp(); syncUI(); draw(); save(); }
  else if (sMode === "cmpP") { if (s.id === S.sym.id || S.cmpP.indexOf(s.id) >= 0) toast("That symbol is already on the chart."); else if (S.cmpP.length < 4) S.cmpP.push(s.id); buildCmp(); syncUI(); draw(); save(); }
  else { selectSym(s); }
}
function selectSym(s) { S.sym = s; S.cmp = S.cmp.filter(function (id) { return id !== s.id; }); S.cmpP = S.cmpP.filter(function (id) { return id !== s.id; }); S.sel = null; S.pend = null; S.meas = null; setReplay(false); loadData(); header(); watchUpdate(); renderAlerts(); renderTrade(); renderInfo(); $("#qty").value = s.lot; syncSel(); quoteOne(s, true); save(); if (EMBED && !suppressMc && window.parent !== window) { try { window.parent.postMessage({ t: "aurum-mc", sym: s.id, from: PANE_ID }, "*"); } catch (e) { /* ignore */ } } }
$("#sq").addEventListener("input", function () { sIdx = 0; renderSearch(); });
$("#sq").addEventListener("keydown", function (e) {
  if (e.key === "ArrowDown") { sIdx = Math.min(sList.length - 1, sIdx + 1); renderSearch(); e.preventDefault(); }
  else if (e.key === "ArrowUp") { sIdx = Math.max(0, sIdx - 1); renderSearch(); e.preventDefault(); }
  else if (e.key === "Enter") { e.preventDefault(); if (sList[sIdx]) chooseSym(sList[sIdx]); }
  else if (e.key === "Escape") closeSearch();
});
$("#sl").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) chooseSym(sList[+b.dataset.i]); });
$("#srch").addEventListener("click", function (e) { if (e.target === this) closeSearch(); });
$("#symBtn").addEventListener("click", function () { openSearch("sym"); });
(function () {
  var pop = $("#cmpPop");
  pop.innerHTML = "<button type='button' class='opt' data-m='cmpP'>Add symbol in a new panel</button><button type='button' class='opt' data-m='cmp'>Overlay on the price chart (% scale)</button><small>Panels stack under the chart, up to 4. Overlays share one % scale, up to 3.</small>";
  wireDd($("#cmpBtn"), pop);
  pop.addEventListener("click", function (e) {
    var b = e.target.closest("button.opt"); if (!b) return; closeAll();
    if (b.dataset.m === "cmp" && S.cmp.length >= 3) toast("You can overlay up to three symbols."); else if (b.dataset.m === "cmpP" && S.cmpP.length >= 4) toast("You can add up to four compare panels."); else openSearch(b.dataset.m);
  });
})();
$("#wlAdd").addEventListener("click", function () { openSearch("watch"); });

