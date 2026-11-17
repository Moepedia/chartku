/* 09b-alertdlg: dialog "Create alert on <simbol>" ala TradingView: Condition, Trigger, Expiration, Message, Notifications */
var AL_OPS = [["cross", "Crossing"], ["up", "Crossing up"], ["down", "Crossing down"], ["gt", "Greater than"], ["lt", "Less than"]];
var AL_TRIG = [["once", "Only once"], ["bar", "Once per bar"], ["barclose", "Once per bar close"], ["minute", "Once per minute"]];
function alConds(a) { return a.conds && a.conds.length ? a.conds : [{ op: "cross", val: a.price }]; }
function alOpName(op) { return (AL_OPS.filter(function (o) { return o[0] === op; })[0] || AL_OPS[0])[1]; }
function alDesc(a) {
  var s = N_(a.sym) || S.sym, t = (AL_TRIG.filter(function (o) { return o[0] === (a.trig || "once"); })[0] || AL_TRIG[0])[1];
  return "Price " + alConds(a).map(function (c) { return alOpName(c.op) + " " + fmt(c.val, s.dec); }).join(" and ") + " \u00B7 " + t + (a.exp ? " \u00B7 until " + new Date(a.exp).toLocaleDateString() : "") + (a.active ? "" : " \u00B7 inactive");
}
function alTest(c, prev, p) {
  if (c.op === "cross") return prev != null && ((prev < c.val && p >= c.val) || (prev > c.val && p <= c.val));
  if (c.op === "up") return prev != null && prev < c.val && p >= c.val;
  if (c.op === "down") return prev != null && prev > c.val && p <= c.val;
  if (c.op === "gt") return p > c.val; return p < c.val;
}
function alFire(a, s, p) {
  var msg = a.msg || (s.label + " " + alOpName(alConds(a)[0].op) + " " + fmt(alConds(a)[0].val, s.dec));
  if (!a.nt || a.nt.toast !== false) toast("Alert: " + msg);
  if (a.nt && a.nt.app && window.Notification && Notification.permission === "granted") { try { new Notification("Alert " + s.label, { body: msg }); } catch (e) { /* notifikasi tidak tersedia */ } }
  if (S.sty.aSnd !== false) { try { var ac = new (window.AudioContext || window.webkitAudioContext)(), os = ac.createOscillator(), gn = ac.createGain(); os.frequency.value = 880; gn.gain.value = 0.05; os.connect(gn); gn.connect(ac.destination); os.start(); os.stop(ac.currentTime + 0.25); } catch (e) { /* audio tidak tersedia */ } }
}
function alertTick(s, prev, p) {
  var now = Date.now(), changed = false;
  S.alerts.forEach(function (a) {
    if (a.sym !== s.id || !a.active) return;
    if (a.exp && now > a.exp) { a.active = false; changed = true; toast("Alert expired: " + s.label); return; }
    if (!alConds(a).every(function (c) { return alTest(c, prev, p); })) return;
    var trig = a.trig || "once", bk = Math.floor(now / 1000 / Math.max(S.tf.s, 1)), mk = Math.floor(now / 60000);
    if (trig === "bar" && a.lb === bk) return; if (trig === "barclose" && a.lb === bk) return; if (trig === "minute" && a.lm === mk) return;
    a.lb = bk; a.lm = mk; if (trig === "once") a.active = false; changed = true; alFire(a, s, p);
  });
  if (changed) { renderAlerts(); draw(); save(); }
}
function openAlertDlg(price) {
  var el = document.createElement("div"), sym = S.sym, val = isFinite(price) ? price : curPrice(), exp = new Date(Date.now() + 30 * 86400000);
  function lt(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
  function opSel(sel) { return "<select data-k='op'>" + AL_OPS.map(function (o) { return "<option value='" + o[0] + "'" + (o[0] === sel ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select>"; }
  el.className = "modal"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Create alert");
  el.innerHTML = "<div class='box albox'><div class='hd'><b>Create alert on " + esc(sym.label) + "</b></div><div class='alb'>" +
    "<div class='alr'><span class='all'>Condition</span><div class='alcs'><div class='alc'><span class='alp'>Price</span>" + opSel("cross") + "<input type='number' step='any' data-k='val' value='" + (+val).toFixed(sym.dec) + "'></div></div></div>" +
    "<div class='alr'><span class='all'></span><button type='button' class='btn' data-ac='addc'>Add condition</button></div>" +
    "<div class='alr'><span class='all'>Trigger</span><select data-k='trig'>" + AL_TRIG.map(function (o) { return "<option value='" + o[0] + "'>" + o[1] + "</option>"; }).join("") + "</select></div>" +
    "<div class='alr'><span class='all'>Expiration</span><input type='datetime-local' data-k='exp' value='" + lt(exp) + "'></div>" +
    "<div class='alr'><span class='all'>Message</span><textarea data-k='msg' rows='2'></textarea></div>" +
    "<div class='alr'><span class='all'>Notifications</span><span class='alnt'><label><input type='checkbox' data-k='app' checked> App</label><label><input type='checkbox' data-k='toast' checked> Toasts</label></span></div>" +
    "</div><div class='hd alft'><span style='flex:1'></span><button type='button' class='btn' data-ac='cancel'>Cancel</button><button type='button' class='btn sd-ok' data-ac='ok'>Create</button></div></div>";
  document.body.appendChild(el);
  var msgEl = $("[data-k=msg]", el), touched = false;
  function conds() { return $$(".alc", el).map(function (r) { return { op: $("[data-k=op]", r).value, val: parseFloat($("[data-k=val]", r).value) }; }); }
  function autoMsg() { if (touched) return; var c = conds(); msgEl.value = sym.label + " " + c.map(function (x) { return alOpName(x.op) + " " + fmt(x.val || 0, sym.dec); }).join(" and "); }
  autoMsg(); msgEl.addEventListener("input", function () { touched = true; }); el.addEventListener("input", autoMsg); el.addEventListener("change", autoMsg);
  function done() { el.remove(); }
  el.addEventListener("click", function (e) {
    if (e.target === el) { done(); return; } var b = e.target.closest("[data-ac]"); if (!b) return;
    if (b.dataset.ac === "cancel") done();
    else if (b.dataset.ac === "addc") { if ($$(".alc", el).length >= 2) { toast("Maksimal 2 kondisi"); return; } var d = document.createElement("div"); d.className = "alc"; d.innerHTML = "<span class='alp'>Price</span>" + opSel("gt") + "<input type='number' step='any' data-k='val' value='" + (+val).toFixed(sym.dec) + "'>"; $(".alcs", el).appendChild(d); b.hidden = true; autoMsg(); }
    else if (b.dataset.ac === "ok") {
      var cs = conds(); if (!cs.every(function (c) { return isFinite(c.val) && c.val > 0; })) { toast("Masukkan nilai harga yang valid."); return; }
      var ex = Date.parse($("[data-k=exp]", el).value), app = $("[data-k=app]", el).checked;
      if (app && window.Notification && Notification.permission === "default") { try { Notification.requestPermission(); } catch (er) { /* diabaikan */ } }
      S.alerts.push({ id: "a" + Date.now().toString(36), sym: sym.id, price: cs[0].val, conds: cs, trig: $("[data-k=trig]", el).value, exp: isFinite(ex) ? ex : 0, msg: msgEl.value.trim(), nt: { app: app, toast: $("[data-k=toast]", el).checked }, active: true });
      renderAlerts(); draw(); save(); toast("Alert dibuat: " + sym.label); done();
    }
  });
  el.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); done(); } });
  $("[data-k=val]", el).focus(); $("[data-k=val]", el).select();
}
