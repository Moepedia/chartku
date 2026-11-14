/* 02-util-data: format, waktu, generator data */
/* ---------- formatting, time ---------- */
function fmt(p, d) { return p.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
function css(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function two(n) { return (n < 10 ? "0" : "") + n; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var fmtCache = {};
function tparts(t) {
  var z = TZS.filter(function (x) { return x[0] === S.tz; })[0] || TZS[0];
  var f = fmtCache[z[0]] || (fmtCache[z[0]] = new Intl.DateTimeFormat("en-US", { timeZone: z[2], hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", weekday: "short" }));
  var o = {}; f.formatToParts(new Date(t * 1000)).forEach(function (p) { o[p.type] = p.value; });
  return { y: +o.year, mo: +o.month - 1, d: +o.day, h: (+o.hour) % 24, mi: +o.minute, dow: o.weekday };
}
function axisTime(t, prevT) {
  var p = tparts(t);
  if (S.tf.s >= 604800) return MON[p.mo] + " " + String(p.y).slice(2);
  if (S.tf.s >= 86400) return p.d + " " + MON[p.mo];
  if (prevT && tparts(prevT).d !== p.d) return p.d + " " + MON[p.mo];
  return two(p.h) + ":" + two(p.mi);
}
function fullTime(t) {
  var p = tparts(t), s = p.dow + " " + p.d + " " + MON[p.mo] + " " + p.y;
  return S.tf.s >= 86400 ? s : s + " " + two(p.h) + ":" + two(p.mi);
}
function dur(sec) {
  sec = Math.abs(sec); var d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60);
  return (d ? d + "d " : "") + (h ? h + "h " : "") + (!d && m ? m + "m" : "") || "0m";
}
function toast(msg) {
  var el = document.createElement("div"); el.className = "toast"; el.textContent = msg; $("#toasts").appendChild(el);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 6500);
}

/* ---------- data generation ---------- */
function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gen(sym, tf, anchor) {
  var r = rng(hash(sym.id + tf.k));
  function g() { var u = 0; while (!u) u = r(); var v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  var sigma = sym.vol * Math.sqrt(tf.s / 86400), lv = 1, drift = 0, c = [0], i;
  for (i = 1; i <= N; i++) {
    lv = Math.max(0.5, Math.min(2, lv + (r() - 0.5) * 0.18));
    drift = drift * 0.97 + (r() - 0.5) * sigma * 0.12;
    c.push(c[i - 1] + g() * sigma * lv + drift);
  }
  var scale = anchor / Math.exp(c[N]), end = Math.floor(Date.now() / 1000 / tf.s) * tf.s, out = [];
  for (i = 1; i <= N; i++) {
    var o = Math.exp(c[i - 1]) * scale, cl = Math.exp(c[i]) * scale;
    var h = Math.max(o, cl) * (1 + Math.abs(g()) * sigma * 0.5), l = Math.min(o, cl) * (1 - Math.abs(g()) * sigma * 0.5);
    var v = Math.round((800 + r() * 1200) * (1 + Math.abs(cl / o - 1) / sigma * 0.6));
    out.push({ t: end - (N - i) * tf.s, o: o, h: h, l: l, c: cl, v: v });
  }
  return out;
}

