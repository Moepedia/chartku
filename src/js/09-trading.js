/* 09-trading: event, alert, paper trading, replay */
/* ---------- events: economic / corporate calendar markers ---------- */
var evs = [];
var EVSET = {
  Stocks: [["E", "Earnings report", "h"], ["D", "Dividend", "m"], ["S", "Stock split", "l"]],
  India: [["E", "Earnings report", "h"], ["D", "Dividend", "m"], ["R", "RBI rate decision", "h"]],
  Energy: [["O", "OPEC meeting", "h"], ["I", "Crude inventories", "m"], ["B", "Rig count", "l"]],
  Crypto: [["H", "Halving / upgrade", "h"], ["F", "ETF decision", "m"], ["U", "Network upgrade", "l"]],
  Macro: [["R", "Rate decision", "h"], ["C", "CPI inflation", "h"], ["N", "Nonfarm payrolls", "m"], ["G", "GDP release", "m"], ["P", "PMI survey", "l"]]
};
function genEvents() {
  evs = [];
  if (!bars.length) return;
  var set = EVSET[S.sym.cat] || EVSET.Macro, r = rng(hash(S.sym.id + "ev")), i = 6 + Math.floor(r() * 6);
  while (i < bars.length - 2) {
    var e = set[Math.floor(r() * set.length)];
    evs.push({ i: i, t: bars[i].t, code: e[0], name: e[1], imp: e[2] });
    i += 7 + Math.floor(r() * 14);
  }
}
function renderEvents() {
  $("#evSym").textContent = S.sym.label; $("#evChk").checked = S.events;
  var h = "";
  evs.slice().reverse().forEach(function (ev) {
    h += "<li><span><span class='imp " + ev.imp + "'>" + ev.code + "</span><b>" + ev.name + "</b><br><span class='dim'>" + fullTime(ev.t) + "</span></span></li>";
  });
  $("#evList").innerHTML = h || "<li class='empty'>Tidak ada agenda pada rentang ini.</li>";
}
$("#evChk").addEventListener("change", function () { S.events = this.checked; $("#evChk2").checked = S.events; draw(); save(); });

/* ---------- alerts + paper trading ---------- */
function addAlert(price) {
  if (!isFinite(price) || price <= 0) { toast("Enter a valid alert price."); return; }
  S.alerts.push({ id: "a" + Date.now().toString(36), sym: S.sym.id, price: price, active: true });
  renderAlerts(); draw(); save(); toast("Alert set: " + S.sym.label + " at " + fmt(price, S.sym.dec));
}
function renderAlerts() {
  $("#alSym").textContent = S.sym.label;
  var h = "";
  S.alerts.slice().reverse().forEach(function (a) {
    var s = N_(a.sym); if (!s) return;
    h += "<li><span><b>" + s.label + "</b> <span class='m'>" + fmt(a.price, s.dec) + "</span><br><span class='dim'>" + (a.active ? "Waiting to cross" : "Triggered") + "</span></span><button class='x' type='button' data-id='" + a.id + "' aria-label='Remove alert'>&times;</button></li>";
  });
  $("#alList").innerHTML = h || "<li class='empty'>Belum ada peringatan. Klik kanan chart atau ketik harga di atas.</li>";
}
$("#alList").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; S.alerts = S.alerts.filter(function (a) { return a.id !== b.dataset.id; }); renderAlerts(); draw(); save(); });
$("#alAdd").addEventListener("click", function () { addAlert(parseFloat($("#alPrice").value)); });
$("#alPrice").addEventListener("keydown", function (e) { if (e.key === "Enter") addAlert(parseFloat(this.value)); });
$("#alBtn").addEventListener("click", function () { $("#work").classList.remove("panel-closed"); selectTab("alerts"); $("#alPrice").value = curPrice().toFixed(S.sym.dec); $("#alPrice").focus(); $("#alPrice").select(); });

var SPREAD = 0.0001;
function trade(side, sym) {
  sym = sym || S.sym; var q = parseFloat($("#qty").value);
  if (!(q > 0)) { toast("Enter a quantity above zero."); return; }
  var mid = sym === S.sym ? curPrice() : live[sym.id], px = side === "buy" ? mid * (1 + SPREAD) : mid * (1 - SPREAD), sq = side === "buy" ? q : -q;
  var pos = S.acc.pos[sym.id] || { q: 0, avg: 0 }, nq = pos.q + sq;
  if (pos.q === 0 || (pos.q > 0) === (sq > 0)) { pos = { q: nq, avg: (pos.avg * Math.abs(pos.q) + px * Math.abs(sq)) / Math.abs(nq) }; }
  else {
    var cq = Math.min(Math.abs(sq), Math.abs(pos.q)); S.acc.real += (px - pos.avg) * cq * (pos.q > 0 ? 1 : -1);
    pos = Math.abs(nq) < 1e-9 ? null : { q: nq, avg: (nq > 0) === (pos.q > 0) ? pos.avg : px };
  }
  if (pos) S.acc.pos[sym.id] = pos; else delete S.acc.pos[sym.id];
  toast((side === "buy" ? "Bought " : "Sold ") + q + " " + sym.label + " at " + fmt(px, sym.dec));
  renderTrade(); draw(); save();
}
function closePos(id) {
  var pos = S.acc.pos[id], s = N_(id); if (!pos) return;
  var px = live[id] * (pos.q > 0 ? 1 - SPREAD : 1 + SPREAD); S.acc.real += (px - pos.avg) * pos.q; delete S.acc.pos[id];
  toast("Closed " + s.label + " at " + fmt(px, s.dec)); renderTrade(); draw(); save();
}
$("#buy").addEventListener("click", function () { trade("buy"); });
$("#sell").addEventListener("click", function () { trade("sell"); });
$("#posList").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) closePos(b.dataset.id); });
function renderTrade() {
  var s = S.sym, p = curPrice(), un = 0, h = "";
  Object.keys(S.acc.pos).forEach(function (id) {
    var ps = S.acc.pos[id], sy = N_(id), pr = id === s.id ? p : live[id], pnl = (pr - ps.avg) * ps.q; un += pnl;
    h += "<li><span><b>" + sy.label + "</b> " + (ps.q > 0 ? "long" : "short") + " <span class='m'>" + Math.abs(ps.q) + "</span><br><span class='dim m'>avg " + fmt(ps.avg, sy.dec) + "</span></span><span style='text-align:right'><span class='m " + (pnl >= 0 ? "up" : "down") + "'>" + (pnl >= 0 ? "+" : "") + fmt(pnl, 2) + "</span><br><button class='btn' type='button' data-id='" + id + "'>Close</button></span></li>";
  });
  $("#posList").innerHTML = h || "<li class='empty'>Tidak ada posisi terbuka.</li>";
  $("#bid").textContent = fmt(p * (1 - SPREAD), s.dec); $("#ask").textContent = fmt(p * (1 + SPREAD), s.dec);
  var bal = 100000 + S.acc.real;
  $("#acct").innerHTML = "<div><dt>Balance</dt><dd>" + fmt(bal, 2) + "</dd></div><div><dt>Unrealized P&amp;L</dt><dd class='" + (un >= 0 ? "up" : "down") + "'>" + (un >= 0 ? "+" : "") + fmt(un, 2) + "</dd></div><div><dt>Equity</dt><dd>" + fmt(bal + un, 2) + "</dd></div><div><dt>Realized P&amp;L</dt><dd>" + fmt(S.acc.real, 2) + "</dd></div>";
}

/* ---------- replay ---------- */
function stopReplayTimer() { clearInterval(S.replay.timer); S.replay.timer = null; S.replay.playing = false; }
function finishPick() { if (!S.replay.pick) return; S.replay.pick = false; S.off = Math.max(6, G.pw / S.barW * 0.35); }
function replayStep(d) { finishPick(); S.replay.idx = Math.max(30, Math.min(bars.length - 1, S.replay.idx + d)); if (S.replay.idx >= bars.length - 1) stopReplayTimer(); syncUI(); draw(); }
function setReplay(on) {
  stopReplayTimer(); S.replay.on = on; S.replay.pick = false;
  if (on && bars.length) {
    var n = bars.length, dflt = (typeof G !== "undefined" && G && G.fiAtX) ? Math.round(G.fiAtX(G.pw * 0.55)) : n - 80;
    S.replay.idx = Math.max(Math.min(30, n - 2), Math.min(n - 2, dflt)); S.replay.pick = true;
  }
  syncUI(); draw();
}
$("#rpBtn").addEventListener("click", function () { setReplay(!S.replay.on); });
$("#rpExit").addEventListener("click", function () { setReplay(false); });
$("#rpPick").addEventListener("click", function () { if (S.replay.pick) finishPick(); else S.replay.pick = true; syncUI(); draw(); });
$("#rpBack").addEventListener("click", function () { replayStep(-1); });
$("#rpFwd").addEventListener("click", function () { replayStep(1); });
$("#rpSpeed").addEventListener("change", function () { S.replay.speed = +this.value; if (S.replay.playing) { stopReplayTimer(); startPlay(); } });
function startPlay() { S.replay.playing = true; S.replay.timer = setInterval(function () { replayStep(1); }, 1000 / S.replay.speed); syncUI(); }
$("#rpPlay").addEventListener("click", function () { finishPick(); if (S.replay.playing) { stopReplayTimer(); syncUI(); } else if (S.replay.idx < bars.length - 1) startPlay(); });

