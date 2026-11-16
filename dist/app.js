
(function () {
"use strict";
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

/* ---------- symbols, timeframes ---------- */
var SYMS = [
  { id: "XAUUSD", label: "XAU/USD", name: "Gold spot / U.S. dollar", unit: "USD per troy ounce", cat: "Metals", base: 4012.35, dec: 2, vol: 0.009, lot: 1, y: "XAUUSD=X", y2: "GC=F", b: "PAXGUSDT" },
  { id: "XAGUSD", label: "XAG/USD", name: "Silver spot / U.S. dollar", unit: "USD per troy ounce", cat: "Metals", base: 48.215, dec: 3, vol: 0.015, lot: 50, y: "XAGUSD=X", y2: "SI=F" },
  { id: "EURUSD", label: "EUR/USD", name: "Euro / U.S. dollar", unit: "USD per euro", cat: "Forex", base: 1.0852, dec: 4, vol: 0.0048, lot: 10000, y: "EURUSD=X" },
  { id: "GBPUSD", label: "GBP/USD", name: "British pound / U.S. dollar", unit: "USD per pound", cat: "Forex", base: 1.2934, dec: 4, vol: 0.005, lot: 10000, y: "GBPUSD=X" },
  { id: "USDJPY", label: "USD/JPY", name: "U.S. dollar / Japanese yen", unit: "JPY per dollar", cat: "Forex", base: 150.42, dec: 3, vol: 0.0062, lot: 10000, y: "JPY=X" },
  { id: "AUDUSD", label: "AUD/USD", name: "Australian dollar / U.S. dollar", unit: "USD per AUD", cat: "Forex", base: 0.6541, dec: 4, vol: 0.0055, lot: 10000, y: "AUDUSD=X" },
  { id: "USDCAD", label: "USD/CAD", name: "U.S. dollar / Canadian dollar", unit: "CAD per dollar", cat: "Forex", base: 1.36, dec: 4, vol: 0.004, lot: 10000, y: "CAD=X" },
  { id: "USDCHF", label: "USD/CHF", name: "U.S. dollar / Swiss franc", unit: "CHF per dollar", cat: "Forex", base: 0.88, dec: 4, vol: 0.004, lot: 10000, y: "CHF=X" },
  { id: "USDIDR", label: "USD/IDR", name: "U.S. dollar / Indonesian rupiah", unit: "IDR per dollar", cat: "Forex", base: 16420, dec: 2, vol: 0.003, lot: 1000, y: "IDR=X" },
  { id: "USDINR", label: "USD/INR", name: "U.S. dollar / Indian rupee", unit: "INR per dollar", cat: "Forex", base: 84.5, dec: 3, vol: 0.002, lot: 1000, y: "INR=X" },
  { id: "WTI", label: "WTI", name: "Crude oil, West Texas", unit: "USD per barrel", cat: "Energy", base: 68.74, dec: 2, vol: 0.017, lot: 100, y: "CL=F" },
  { id: "BRENT", label: "BRENT", name: "Crude oil, Brent", unit: "USD per barrel", cat: "Energy", base: 72.31, dec: 2, vol: 0.016, lot: 100, y: "BZ=F" },
  { id: "BTCUSD", label: "BTC/USD", name: "Bitcoin / U.S. dollar", unit: "USD per coin", cat: "Crypto", base: 97250, dec: 2, vol: 0.028, lot: 0.1, b: "BTCUSDT", cb: "BTC-USD", k: "XBTUSD", cg: "bitcoin", y: "BTC-USD" },
  { id: "ETHUSD", label: "ETH/USD", name: "Ether / U.S. dollar", unit: "USD per coin", cat: "Crypto", base: 3410, dec: 2, vol: 0.034, lot: 1, b: "ETHUSDT", cb: "ETH-USD", k: "ETHUSD", cg: "ethereum", y: "ETH-USD" },
  { id: "SOLUSD", label: "SOL/USD", name: "Solana / U.S. dollar", unit: "USD per coin", cat: "Crypto", base: 190, dec: 2, vol: 0.04, lot: 10, b: "SOLUSDT", cb: "SOL-USD", k: "SOLUSD", cg: "solana", y: "SOL-USD" },
  { id: "XRPUSD", label: "XRP/USD", name: "XRP / U.S. dollar", unit: "USD per coin", cat: "Crypto", base: 2.4, dec: 4, vol: 0.04, lot: 1000, b: "XRPUSDT", cb: "XRP-USD", k: "XRPUSD", cg: "ripple", y: "XRP-USD" },
  { id: "DOGEUSD", label: "DOGE/USD", name: "Dogecoin / U.S. dollar", unit: "USD per coin", cat: "Crypto", base: 0.38, dec: 5, vol: 0.05, lot: 5000, b: "DOGEUSDT", cb: "DOGE-USD", k: "DOGEUSD", cg: "dogecoin", y: "DOGE-USD" },
  { id: "SPX", label: "SPX", name: "S&P 500 index", unit: "index points", cat: "Index", base: 5870.4, dec: 2, vol: 0.0095, lot: 1, y: "^GSPC" },
  { id: "NDX", label: "NDX", name: "Nasdaq 100 index", unit: "index points", cat: "Index", base: 20412.6, dec: 2, vol: 0.012, lot: 1, y: "^NDX" },
  { id: "DXY", label: "DXY", name: "U.S. dollar index", unit: "index points", cat: "Index", base: 104.12, dec: 3, vol: 0.004, lot: 10, y: "DX-Y.NYB" },
  { id: "NIFTY", label: "NIFTY 50", name: "Nifty 50 index, NSE India", unit: "index points", cat: "India", base: 24500, dec: 2, vol: 0.009, lot: 1, u: "NSE_INDEX|Nifty 50", y: "^NSEI" },
  { id: "SENSEX", label: "SENSEX", name: "BSE Sensex index, India", unit: "index points", cat: "India", base: 80500, dec: 2, vol: 0.009, lot: 1, u: "BSE_INDEX|SENSEX", y: "^BSESN" },
  { id: "RELIANCE", label: "RELIANCE", name: "Reliance Industries, NSE", unit: "INR per share", cat: "India", base: 1290, dec: 2, vol: 0.014, lot: 10, u: "NSE_EQ|INE002A01018", y: "RELIANCE.NS" },
  { id: "TCS", label: "TCS", name: "Tata Consultancy Services, NSE", unit: "INR per share", cat: "India", base: 4100, dec: 2, vol: 0.012, lot: 10, u: "NSE_EQ|INE467B01029", y: "TCS.NS" },
  { id: "INFY", label: "INFY", name: "Infosys, NSE", unit: "INR per share", cat: "India", base: 1850, dec: 2, vol: 0.014, lot: 10, u: "NSE_EQ|INE009A01021", y: "INFY.NS" },
  { id: "HDFCBANK", label: "HDFCBANK", name: "HDFC Bank, NSE", unit: "INR per share", cat: "India", base: 1750, dec: 2, vol: 0.012, lot: 10, u: "NSE_EQ|INE040A01034", y: "HDFCBANK.NS" },
  { id: "AAPL", label: "AAPL", name: "Apple Inc.", unit: "USD per share", cat: "Stocks", base: 231.4, dec: 2, vol: 0.014, lot: 10, y: "AAPL" },
  { id: "NVDA", label: "NVDA", name: "NVIDIA Corp.", unit: "USD per share", cat: "Stocks", base: 138.2, dec: 2, vol: 0.026, lot: 10, y: "NVDA" },
  { id: "TSLA", label: "TSLA", name: "Tesla Inc.", unit: "USD per share", cat: "Stocks", base: 248.7, dec: 2, vol: 0.03, lot: 10, y: "TSLA" },
  { id: "MSFT", label: "MSFT", name: "Microsoft Corp.", unit: "USD per share", cat: "Stocks", base: 420, dec: 2, vol: 0.013, lot: 10, y: "MSFT" }
];
var TU = { m: 60, H: 3600, D: 86400, W: 604800, M: 2592000 };
var TUN = { m: ["minute", "minutes"], H: ["hour", "hours"], D: ["day", "days"], W: ["week", "weeks"], M: ["month", "months"] };
function mkTf(n, u) { var t = { k: n + u, s: n * TU[u], n: n, u: u }; if (u === "M") t.mo = n; return t; }
var TFS = [];
[["m", [1, 2, 3, 5, 10, 15, 30, 45]], ["H", [1, 2, 3, 4, 6, 8, 12]], ["D", [1]], ["W", [1]], ["M", [1, 3, 6, 12]]].forEach(function (g) { g[1].forEach(function (n) { TFS.push(mkTf(n, g[0])); }); });
var CTF = [];
function tfOk(n, u) { var mx = { m: 1439, H: 168, D: 365, W: 52, M: 24 }[u]; return !!mx && n === Math.floor(n) && n >= 1 && n <= mx; }
function addCustomTf(n, u) {
  if (!tfOk(n, u)) return null;
  var t = mkTf(n, u), a = TFS.concat(CTF), i;
  for (i = 0; i < a.length; i++) if (a[i].k === t.k || (a[i].s === t.s && !!a[i].mo === !!t.mo)) return a[i];
  CTF.push(t); CTF.sort(function (x, y) { return x.s - y.s; }); return t;
}
function tfByKey(k) {
  var a = TFS.concat(CTF), i, m;
  for (i = 0; i < a.length; i++) if (a[i].k === k) return a[i];
  m = /^(\d{1,4})([mHDWM])$/.exec(k || "");
  return m ? addCustomTf(+m[1], m[2]) : null;
}
function tfLabel(t) { return t.n + " " + TUN[t.u][t.n === 1 ? 0 : 1]; }
var TF_D = tfByKey("1D"), TF_H = tfByKey("1H");
var TYPES = [["candles", "Candles"], ["hollow", "Hollow candles"], ["vcandles", "Volume candles"], ["bars", "OHLC bars"], ["line", "Line"], ["linem", "Line with markers"], ["step", "Step line"], ["area", "Area"], ["hlcarea", "HLC area"], ["baseline", "Baseline"], ["columns", "Columns"], ["highlow", "High-low"], ["ha", "Heikin Ashi"], ["renko", "Renko"], ["lbreak", "Line break"], ["kagi", "Kagi"], ["pnf", "Point & figure"], ["range", "Range"]];
var INDS = [["sma", "SMA 20"], ["ema", "EMA 50"], ["bb", "Bollinger Bands 20, 2"], ["vwap", "VWAP"], ["vol", "Volume"], ["rsi", "RSI 14"], ["macd", "MACD 12 26 9"], ["stoch", "Stochastic"], ["atr", "ATR"], ["adx", "ADX / DMI"], ["st", "Supertrend x3"], ["ichi", "Ichimoku 9 26 52"]];
var LNAME = { sma: "SMA", ema: "EMA", bb: "Bollinger Bands", rsi: "RSI", stoch: "Stochastic", atr: "ATR", adx: "ADX / DMI", st: "Supertrend x3" };
var LENK = { sma: "sma", ema: "ema", bb: "bb", rsi: "rsi", stoch: "stoch", atr: "atr", adx: "adx", st: "st" };
var TZS = [["local", "Browser time", undefined], ["utc", "UTC", "UTC"], ["jkt", "Jakarta", "Asia/Jakarta"], ["ny", "New York", "America/New_York"], ["ldn", "London", "Europe/London"], ["tyo", "Tokyo", "Asia/Tokyo"]];
var PALETTE = ["acc", "i1", "i2", "up", "down", "tag"];
var N = 500, R = 70, B = 24, T = 8;
var N_ = function (id) { return SYMS.filter(function (s) { return s.id === id; })[0]; };

/* ---------- persistence ---------- */
var QP = (function () { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(); } })();
var PANE_ID = QP.get("pane") || "";
var EMBED = QP.get("embed") === "1";
if (EMBED) document.body.classList.add("embed");
var KEY = "aurum.terminal.v1" + (PANE_ID ? "." + PANE_ID : "");
function readSaved() { try { return JSON.parse(localStorage.getItem(KEY) || "null") || {}; } catch (e) { return {}; } }
var saved = readSaved(), saveT = null;
(saved.ctf || []).forEach(function (k) { tfByKey(k); });
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(function () {
    try {
      localStorage.setItem(KEY, JSON.stringify({ sym: S.sym.id, tf: S.tf.k, type: S.type, scale: S.scale, invert: S.invert, lockScale: S.lockScale, hilo: S.hilo, events: S.events, ind: S.ind, xi: S.xi, cmp: S.cmp, cmpP: S.cmpP, cmpT: S.cmpT, colOv: S.colOv, iw: S.iw, ihide: S.ihide, sty: S.sty, magnet: S.magnet, magStr: S.magStr, curType: S.curType, grid: S.grid, tz: S.tz, src: srcPref, len: S.len, ctf: CTF.map(function (t) { return t.k; }), ftf: S.ftf, gcur: S.gcur, keep: S.keep, emojiCh: S.emojiCh,
        drawings: S.drawings, alerts: S.alerts, watch: S.watch, acc: S.acc, pine: S.pine, theme: document.documentElement.getAttribute("data-theme") || "" }));
    } catch (e) { /* storage unavailable */ }
  }, 300);
}

/* ---------- state ---------- */
var S = {
  sym: N_(saved.sym) || SYMS[0],
  tf: tfByKey(saved.tf) || TF_D,
  type: saved.type || "candles", scale: saved.scale || "auto",
  ind: Object.assign({ sma: false, ema: false, bb: false, vwap: false, vol: false, rsi: false, macd: false, stoch: false, atr: false, adx: false, st: false, ichi: false }, saved.ind || {}),
  len: Object.assign({ sma: 20, ema: 50, bb: 20, rsi: 14, stoch: 14, atr: 14, adx: 14, st: 10 }, saved.len || {}), hideD: false,
  cmp: (saved.cmp || []).filter(function (id) { return N_(id); }).slice(0, 3),
  cmpP: (saved.cmpP || []).filter(function (id) { return N_(id); }).slice(0, 4), range: null, cmpT: saved.cmpT || {}, colOv: saved.colOv || {}, magnet: !!saved.magnet, magStr: saved.magStr === "strong" ? "strong" : "weak", curType: ["dot", "arrow"].indexOf(saved.curType) >= 0 ? saved.curType : "cross", grid: saved.grid !== false, tz: saved.tz || "local",
  iw: saved.iw || {}, ihide: saved.ihide || {}, sty: Object.assign({ lastLine: true, lw: 2 }, saved.sty || {}), tool: "cursor", gcur: Object.assign({}, saved.gcur || {}), keep: !!saved.keep, emojiCh: saved.emojiCh || "\u2B50",
  ftf: (saved.ftf || ["1m", "5m", "15m", "1H", "4H", "1D", "1W"]).filter(function (k) { return tfByKey(k); }), barW: 9, off: 6, cx: null, cy: null, yScale: 1, yShift: 0, yMan: false,
  sel: null, pend: null, meas: null,
  invert: !!saved.invert, lockScale: !!saved.lockScale, lockR: null, hilo: saved.hilo !== false, events: saved.events !== false,
  drawings: saved.drawings || {}, alerts: saved.alerts || [],
  watch: (saved.watch || ["XAUUSD", "XAGUSD", "EURUSD", "USDJPY", "USDIDR", "WTI", "BTCUSD", "SPX"]).filter(function (id) { return N_(id); }),
  acc: saved.acc || { real: 0, pos: {} }, tab: "watch", pine: saved.pine || null,
  replay: { on: false, idx: 0, playing: false, speed: 1, pick: false, timer: null }
};
document.documentElement.setAttribute("data-theme", saved.theme || "dark");

var live = {}, ref = {}, spark = {}, ready = {};
var bars = [], ha = [], cmpData = [], panData = [], ind = {};

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

/* ---------- indicators ---------- */
function smaOf(a, p) { var o = [], s = 0, cnt = 0, i; for (i = 0; i < a.length; i++) { s += a[i]; if (i >= p) s -= a[i - p]; o.push(i >= p - 1 ? s / p : null); } return o; }
function emaOf(a, p) {
  var o = [], k = 2 / (p + 1), e = null, cnt = 0;
  a.forEach(function (v) { if (v == null) { o.push(null); return; } cnt++; e = e == null ? v : v * k + e * (1 - k); o.push(cnt >= p ? e : null); });
  return o;
}
function smaN(a, p) { var o = [], i, j, s, ok; for (i = 0; i < a.length; i++) { if (i < p - 1) { o.push(null); continue; } s = 0; ok = true; for (j = i - p + 1; j <= i; j++) { if (a[j] == null) { ok = false; break; } s += a[j]; } o.push(ok ? s / p : null); } return o; }
function atrOf(n) {
  var out = [], i, tr = [0], s = 0;
  for (i = 1; i < bars.length; i++) tr.push(Math.max(bars[i].h - bars[i].l, Math.abs(bars[i].h - bars[i - 1].c), Math.abs(bars[i].l - bars[i - 1].c)));
  for (i = 0; i < bars.length; i++) {
    if (i < n) { out.push(null); if (i > 0) s += tr[i]; continue; }
    if (i === n) { s += tr[i]; out.push(s / n); } else out.push((out[i - 1] * (n - 1) + tr[i]) / n);
  }
  return out;
}
function recalc() {
  var cl = bars.map(function (b) { return b.c; }), nb = cl.length, i, j, L = S.len;
  ind.sma = smaOf(cl, L.sma); ind.ema = emaOf(cl, L.ema);
  var bs = smaOf(cl, L.bb); ind.bbU = []; ind.bbL = [];
  for (i = 0; i < nb; i++) {
    if (bs[i] == null) { ind.bbU.push(null); ind.bbL.push(null); continue; }
    var v = 0; for (j = i - L.bb + 1; j <= i; j++) v += (cl[j] - bs[i]) * (cl[j] - bs[i]);
    var sd = Math.sqrt(v / L.bb); ind.bbU.push(bs[i] + 2 * sd); ind.bbL.push(bs[i] - 2 * sd);
  }
  var cum = 0, cvv = 0, lastDay = null; ind.vwap = [];
  bars.forEach(function (b) {
    var day = S.tf.s < 86400 ? Math.floor(b.t / 86400) : 0;
    if (day !== lastDay) { cum = 0; cvv = 0; lastDay = day; }
    cum += (b.h + b.l + b.c) / 3 * (b.v || 1); cvv += (b.v || 1); ind.vwap.push(cum / cvv);
  });
  ind.rsi = []; var gn = 0, ls = 0, P = L.rsi;
  for (i = 0; i < nb; i++) {
    if (i === 0) { ind.rsi.push(null); continue; }
    var ch = cl[i] - cl[i - 1], up = Math.max(ch, 0), dn = Math.max(-ch, 0);
    if (i <= P) { gn += up; ls += dn; if (i === P) { gn /= P; ls /= P; ind.rsi.push(100 - 100 / (1 + gn / (ls || 1e-9))); } else ind.rsi.push(null); }
    else { gn = (gn * (P - 1) + up) / P; ls = (ls * (P - 1) + dn) / P; ind.rsi.push(100 - 100 / (1 + gn / (ls || 1e-9))); }
  }
  var e12 = emaOf(cl, 12), e26 = emaOf(cl, 26);
  ind.macd = e12.map(function (x, k) { return x != null && e26[k] != null ? x - e26[k] : null; });
  ind.sig = emaOf(ind.macd, 9);
  ind.hist = ind.macd.map(function (x, k) { return x != null && ind.sig[k] != null ? x - ind.sig[k] : null; });
  /* stochastic %K / %D */
  var raw = [], N1 = L.stoch;
  for (i = 0; i < nb; i++) {
    if (i < N1 - 1) { raw.push(null); continue; }
    var hh = -1e18, lo2 = 1e18; for (j = i - N1 + 1; j <= i; j++) { if (bars[j].h > hh) hh = bars[j].h; if (bars[j].l < lo2) lo2 = bars[j].l; }
    raw.push(hh === lo2 ? 50 : (cl[i] - lo2) / (hh - lo2) * 100);
  }
  ind.stK = smaN(raw, 3); ind.stD = smaN(ind.stK, 3);
  /* ATR */
  ind.atr = atrOf(L.atr);
  /* ADX with +DI / -DI */
  var n2 = L.adx, sTR = 0, sP = 0, sM = 0, dx = [], adxv = 0;
  ind.adx = []; ind.pdi = []; ind.mdi = [];
  for (i = 0; i < nb; i++) {
    ind.adx.push(null); ind.pdi.push(null); ind.mdi.push(null); dx.push(null);
    if (i === 0) continue;
    var upm = bars[i].h - bars[i - 1].h, dnm = bars[i - 1].l - bars[i].l;
    var pd = upm > dnm && upm > 0 ? upm : 0, md = dnm > upm && dnm > 0 ? dnm : 0;
    var trr = Math.max(bars[i].h - bars[i].l, Math.abs(bars[i].h - bars[i - 1].c), Math.abs(bars[i].l - bars[i - 1].c));
    if (i <= n2) { sTR += trr; sP += pd; sM += md; if (i < n2) continue; }
    else { sTR = sTR - sTR / n2 + trr; sP = sP - sP / n2 + pd; sM = sM - sM / n2 + md; }
    var pi = 100 * sP / (sTR || 1e-9), mi = 100 * sM / (sTR || 1e-9);
    ind.pdi[i] = pi; ind.mdi[i] = mi; dx[i] = 100 * Math.abs(pi - mi) / ((pi + mi) || 1e-9);
    if (i === 2 * n2 - 1) { var sm = 0; for (j = n2; j <= i; j++) sm += dx[j]; adxv = sm / n2; ind.adx[i] = adxv; }
    else if (i > 2 * n2 - 1) { adxv = (adxv * (n2 - 1) + dx[i]) / n2; ind.adx[i] = adxv; }
  }
  /* Supertrend */
  var at = atrOf(L.st), fu = null, fl = null, dir = 1; ind.st = []; ind.stDir = [];
  for (i = 0; i < nb; i++) {
    if (at[i] == null) { ind.st.push(null); ind.stDir.push(null); continue; }
    var hl = (bars[i].h + bars[i].l) / 2, ub = hl + 3 * at[i], lb = hl - 3 * at[i];
    if (fu === null) { fu = ub; fl = lb; dir = 1; }
    else {
      var pfu = fu, pfl = fl;
      fu = (ub < pfu || cl[i - 1] > pfu) ? ub : pfu; fl = (lb > pfl || cl[i - 1] < pfl) ? lb : pfl;
      if (dir === -1 && cl[i] > fu) dir = 1; else if (dir === 1 && cl[i] < fl) dir = -1;
    }
    ind.st.push(dir === 1 ? fl : fu); ind.stDir.push(dir);
  }
  /* Ichimoku 9 / 26 / 52 */
  function mid(i, n) { if (i < n - 1) return null; var hh = -1e18, ll = 1e18, k; for (k = i - n + 1; k <= i; k++) { if (bars[k].h > hh) hh = bars[k].h; if (bars[k].l < ll) ll = bars[k].l; } return (hh + ll) / 2; }
  ind.tenkan = []; ind.kijun = []; ind.spA = []; ind.spB = [];
  for (i = 0; i < nb; i++) { ind.tenkan.push(mid(i, 9)); ind.kijun.push(mid(i, 26)); }
  for (i = 0; i < nb; i++) {
    var s0 = i - 26, a1 = s0 >= 0 && ind.tenkan[s0] != null && ind.kijun[s0] != null ? (ind.tenkan[s0] + ind.kijun[s0]) / 2 : null;
    ind.spA.push(a1); ind.spB.push(s0 >= 0 ? mid(s0, 52) : null);
  }
  ha = []; bars.forEach(function (b, k) {
    var c = (b.o + b.h + b.l + b.c) / 4, o = k === 0 ? (b.o + b.c) / 2 : (ha[k - 1].o + ha[k - 1].c) / 2;
    ha.push({ t: b.t, o: o, c: c, h: Math.max(b.h, o, c), l: Math.min(b.l, o, c), v: b.v });
  });
  calcAlt();
  calcX();
  pineCompute();
}

var XPAL = ["#2962ff", "#ff6d00", "#e91e63", "#26a69a", "#ab47bc", "#00bcd4"];
var XIND = {}, XORDER = [], XR = {}, xUid = 0;
function xdef(id, name, grp, ov, params, calc, opt) { XIND[id] = { id: id, n: name, g: grp, ov: ov, p: params, calc: calc, o: opt || {} }; XORDER.push(id); }

/* ---- helper numerik (null-aware) ---- */
function xn(f) { var o = [], i; for (i = 0; i < bars.length; i++) o.push(f(bars[i], i, bars)); return o; }
function xsum(a, p) { var o = [], s = 0, c = 0, i; for (i = 0; i < a.length; i++) { var v = a[i]; if (v == null) { o.push(null); s = 0; c = 0; continue; } s += v; c++; if (c > p) s -= a[i - p]; o.push(c >= p ? s : null); } return o; }
function xsma(a, p) { return xsum(a, p).map(function (v) { return v == null ? null : v / p; }); }
function xroll(a, p, mx) { var o = [], i, j, m, ok; for (i = 0; i < a.length; i++) { if (i < p - 1) { o.push(null); continue; } m = mx ? -Infinity : Infinity; ok = true; for (j = i - p + 1; j <= i; j++) { if (a[j] == null) { ok = false; break; } if (mx ? a[j] > m : a[j] < m) m = a[j]; } o.push(ok ? m : null); } return o; }
function xhh(a, p) { return xroll(a, p, true); }
function xll(a, p) { return xroll(a, p, false); }
function xstd(a, p) { var m = xsma(a, p), o = [], i, j, s; for (i = 0; i < a.length; i++) { if (m[i] == null) { o.push(null); continue; } s = 0; for (j = i - p + 1; j <= i; j++) s += (a[j] - m[i]) * (a[j] - m[i]); o.push(Math.sqrt(s / p)); } return o; }
function xrma(a, p) { var o = [], e = null, c = 0, s = 0, i; for (i = 0; i < a.length; i++) { var v = a[i]; if (v == null) { o.push(null); continue; } c++; if (c < p) { s += v; o.push(null); } else if (c === p) { s += v; e = s / p; o.push(e); } else { e = (e * (p - 1) + v) / p; o.push(e); } } return o; }
function xwma(a, p) { var o = [], i, j, s, w, d = p * (p + 1) / 2, ok; for (i = 0; i < a.length; i++) { if (i < p - 1) { o.push(null); continue; } s = 0; ok = true; for (j = 0; j < p; j++) { var v = a[i - p + 1 + j]; if (v == null) { ok = false; break; } s += v * (j + 1); } o.push(ok ? s / d : null); } return o; }
function xsub(a, b) { return a.map(function (v, i) { return v == null || b[i] == null ? null : v - b[i]; }); }
function xadd(a, b) { return a.map(function (v, i) { return v == null || b[i] == null ? null : v + b[i]; }); }
function xmul(a, k) { return a.map(function (v) { return v == null ? null : v * k; }); }
function xlag(a, n) { return a.map(function (v, i) { return i - n >= 0 ? a[i - n] : null; }); }
function xcum(a) { var s = 0; return a.map(function (v) { s += v || 0; return s; }); }
function xrsi(a, p) { var up = [null], dn = [null], i; for (i = 1; i < a.length; i++) { var ch = a[i] - a[i - 1]; up.push(Math.max(ch, 0)); dn.push(Math.max(-ch, 0)); } var u = xrma(up, p), d = xrma(dn, p); return u.map(function (x, i2) { return x == null ? null : 100 - 100 / (1 + x / ((d[i2]) || 1e-9)); }); }
function xtr() { return xn(function (b, i, a) { return i === 0 ? b.h - b.l : Math.max(b.h - b.l, Math.abs(b.h - a[i - 1].c), Math.abs(b.l - a[i - 1].c)); }); }
var XC = function () { return xn(function (b) { return b.c; }); };
var XV = function () { return xn(function (b) { return b.v || 1; }); };
var XTP = function () { return xn(function (b) { return (b.h + b.l + b.c) / 3; }); };
function xl(name, d, i, t) { return { n: name, d: d, c: XPAL[i % XPAL.length], t: t || "line", w: 1.5 }; }

/* ---- OVERLAY ---- */
xdef("wma", "Weighted Moving Average", "trend", true, { len: 20 }, function (P) { return { plots: [xl("WMA", xwma(XC(), P.len), 0)] }; });
xdef("hma", "Hull Moving Average", "trend", true, { len: 20 }, function (P) { var c = XC(), h = Math.max(1, Math.floor(P.len / 2)), s = Math.max(1, Math.round(Math.sqrt(P.len))); return { plots: [xl("HMA", xwma(xsub(xmul(xwma(c, h), 2), xwma(c, P.len)), s), 1)] }; });
xdef("dema", "Double EMA", "trend", true, { len: 20 }, function (P) { var e1 = emaOf(XC(), P.len), e2 = emaOf(e1, P.len); return { plots: [xl("DEMA", xsub(xmul(e1, 2), e2), 2)] }; });
xdef("tema", "Triple EMA", "trend", true, { len: 20 }, function (P) { var e1 = emaOf(XC(), P.len), e2 = emaOf(e1, P.len), e3 = emaOf(e2, P.len); return { plots: [xl("TEMA", xadd(xsub(xmul(e1, 3), xmul(e2, 3)), e3), 3)] }; });
xdef("vwma", "Volume Weighted MA", "trend", true, { len: 20 }, function (P) { var c = XC(), v = XV(), cv = c.map(function (x, i) { return x * v[i]; }), a = xsum(cv, P.len), b = xsum(v, P.len); return { plots: [xl("VWMA", a.map(function (x, i) { return x == null ? null : x / b[i]; }), 4)] }; });
xdef("smma", "Smoothed MA (RMA)", "trend", true, { len: 20 }, function (P) { return { plots: [xl("SMMA", xrma(XC(), P.len), 5)] }; });
xdef("lsma", "Least Squares MA", "trend", true, { len: 25 }, function (P) {
  var c = XC(), n = P.len, o = [], i, j; for (i = 0; i < c.length; i++) { if (i < n - 1) { o.push(null); continue; } var sx = 0, sy = 0, sxy = 0, sxx = 0; for (j = 0; j < n; j++) { var y = c[i - n + 1 + j]; sx += j; sy += y; sxy += j * y; sxx += j * j; } var sl = (n * sxy - sx * sy) / ((n * sxx - sx * sx) || 1), ic = (sy - sl * sx) / n; o.push(ic + sl * (n - 1)); }
  return { plots: [xl("LSMA", o, 0)] };
});
xdef("macross", "Moving Average Cross", "trend", true, { fast: 9, slow: 21 }, function (P) { var c = XC(); return { plots: [xl("Fast", smaOf(c, P.fast), 0), xl("Slow", smaOf(c, P.slow), 1)] }; });
xdef("ribbon", "Moving Average Ribbon", "trend", true, { len: 20 }, function (P) { var c = XC(), o = [], k; for (k = 0; k < 6; k++) o.push(xl("MA" + (P.len + k * 10), emaOf(c, P.len + k * 10), k)); return { plots: o }; });
xdef("donch", "Donchian Channels", "vola", true, { len: 20 }, function (P) { var h = xn(function (b) { return b.h; }), l = xn(function (b) { return b.l; }), u = xhh(h, P.len), d = xll(l, P.len), m = u.map(function (x, i) { return x == null ? null : (x + d[i]) / 2; }); return { plots: [xl("Upper", u, 0), xl("Basis", m, 1), xl("Lower", d, 0)], band: [0, 2] }; });
xdef("keltner", "Keltner Channels", "vola", true, { len: 20, mult: 2 }, function (P) { var m = emaOf(XC(), P.len), a = atrOf(P.len); var u = m.map(function (x, i) { return x == null || a[i] == null ? null : x + P.mult * a[i]; }), d = m.map(function (x, i) { return x == null || a[i] == null ? null : x - P.mult * a[i]; }); return { plots: [xl("Upper", u, 0), xl("Basis", m, 1), xl("Lower", d, 0)], band: [0, 2] }; });
xdef("env", "Envelope", "vola", true, { len: 20, pct: 10 }, function (P) { var m = smaOf(XC(), P.len), k = P.pct / 100; return { plots: [xl("Upper", xmul(m, 1 + k), 0), xl("Basis", m, 1), xl("Lower", xmul(m, 1 - k), 0)], band: [0, 2] }; });
xdef("psar", "Parabolic SAR", "trend", true, { step: 0.02, max: 0.2 }, function (P) {
  var n = bars.length, o = [], i, up = true, af = P.step, ep, sar; if (n < 2) return { plots: [xl("SAR", [], 3, "dots")] };
  sar = bars[0].l; ep = bars[0].h; o.push(null);
  for (i = 1; i < n; i++) {
    var b = bars[i]; sar = sar + af * (ep - sar);
    if (up) { sar = Math.min(sar, bars[i - 1].l, i > 1 ? bars[i - 2].l : bars[i - 1].l); if (b.l < sar) { up = false; sar = ep; ep = b.l; af = P.step; } else if (b.h > ep) { ep = b.h; af = Math.min(af + P.step, P.max); } }
    else { sar = Math.max(sar, bars[i - 1].h, i > 1 ? bars[i - 2].h : bars[i - 1].h); if (b.h > sar) { up = true; sar = ep; ep = b.h; af = P.step; } else if (b.l < ep) { ep = b.l; af = Math.min(af + P.step, P.max); } }
    o.push(sar);
  }
  return { plots: [xl("SAR", o, 3, "dots")] };
});
xdef("alligator", "Williams Alligator", "trend", true, { jaw: 13, teeth: 8, lips: 5 }, function (P) { var hl = xn(function (b) { return (b.h + b.l) / 2; }); return { plots: [{ n: "Jaw", d: xlag(xrma(hl, P.jaw), 8), c: "#2962ff", t: "line", w: 1.5 }, { n: "Teeth", d: xlag(xrma(hl, P.teeth), 5), c: "#e91e63", t: "line", w: 1.5 }, { n: "Lips", d: xlag(xrma(hl, P.lips), 3), c: "#26a69a", t: "line", w: 1.5 }] }; });
xdef("median", "Median Price", "trend", true, {}, function () { return { plots: [xl("Median", xn(function (b) { return (b.h + b.l) / 2; }), 4)] }; });

/* ---- SUB-PANE: momentum / osilator ---- */
xdef("cci", "Commodity Channel Index", "osc", false, { len: 20 }, function (P) { var tp = XTP(), m = xsma(tp, P.len), o = [], i, j, s; for (i = 0; i < tp.length; i++) { if (m[i] == null) { o.push(null); continue; } s = 0; for (j = i - P.len + 1; j <= i; j++) s += Math.abs(tp[j] - m[i]); s /= P.len; o.push(s ? (tp[i] - m[i]) / (0.015 * s) : 0); } return { plots: [xl("CCI", o, 0)], hl: [-100, 0, 100] }; });
xdef("willr", "Williams %R", "osc", false, { len: 14 }, function (P) { var h = xhh(xn(function (b) { return b.h; }), P.len), l = xll(xn(function (b) { return b.l; }), P.len); return { plots: [xl("%R", xn(function (b, i) { return h[i] == null ? null : (h[i] === l[i] ? -50 : (h[i] - b.c) / (h[i] - l[i]) * -100); }), 4)], hl: [-80, -20], rng: [-100, 0] }; });
xdef("mfi", "Money Flow Index", "osc", false, { len: 14 }, function (P) { var tp = XTP(), v = XV(), pos = [], neg = [], i; for (i = 0; i < tp.length; i++) { var f = tp[i] * v[i], up = i > 0 && tp[i] > tp[i - 1], dn = i > 0 && tp[i] < tp[i - 1]; pos.push(up ? f : 0); neg.push(dn ? f : 0); } var a = xsum(pos, P.len), b = xsum(neg, P.len); return { plots: [xl("MFI", a.map(function (x, k) { return x == null ? null : 100 - 100 / (1 + x / (b[k] || 1e-9)); }), 3)], hl: [20, 80], rng: [0, 100] }; });
xdef("roc", "Rate of Change", "osc", false, { len: 9 }, function (P) { var c = XC(); return { plots: [xl("ROC", c.map(function (v, i) { return i >= P.len ? (v / c[i - P.len] - 1) * 100 : null; }), 0)], hl: [0] }; });
xdef("mom", "Momentum", "osc", false, { len: 10 }, function (P) { var c = XC(); return { plots: [xl("MOM", c.map(function (v, i) { return i >= P.len ? v - c[i - P.len] : null; }), 0)], hl: [0] }; });
xdef("aroon", "Aroon", "osc", false, { len: 14 }, function (P) {
  var n = P.len, up = [], dn = [], i, j; for (i = 0; i < bars.length; i++) { if (i < n) { up.push(null); dn.push(null); continue; } var ih = i - n, il = i - n; for (j = i - n; j <= i; j++) { if (bars[j].h >= bars[ih].h) ih = j; if (bars[j].l <= bars[il].l) il = j; } up.push(100 * (ih - (i - n)) / n); dn.push(100 * (il - (i - n)) / n); }
  return { plots: [xl("Up", up, 3), xl("Down", dn, 2)], hl: [50], rng: [0, 100] };
});
xdef("aroonosc", "Aroon Oscillator", "osc", false, { len: 14 }, function (P) { var r = XIND.aroon.calc(P).plots; return { plots: [xl("Aroon Osc", xsub(r[0].d, r[1].d), 0, "hist")], hl: [0] }; });
xdef("ao", "Awesome Oscillator", "osc", false, {}, function () { var hl = xn(function (b) { return (b.h + b.l) / 2; }), d = xsub(xsma(hl, 5), xsma(hl, 34)), cl = d.map(function (v, i) { return v == null ? null : (i > 0 && d[i - 1] != null && v < d[i - 1] ? "#ef5350" : "#26a69a"); }); return { plots: [{ n: "AO", d: d, c: "#26a69a", t: "hist", w: 1, cols: cl }], hl: [0] }; });
xdef("trix", "TRIX", "osc", false, { len: 15 }, function (P) { var l = xn(function (b) { return Math.log(b.c); }), e = emaOf(emaOf(emaOf(l, P.len), P.len), P.len); return { plots: [xl("TRIX", e.map(function (v, i) { return v == null || i < 1 || e[i - 1] == null ? null : (v - e[i - 1]) * 10000; }), 1)], hl: [0] }; });
xdef("cmo", "Chande Momentum Oscillator", "osc", false, { len: 9 }, function (P) { var c = XC(), u = [], d = [], i; for (i = 0; i < c.length; i++) { var ch = i ? c[i] - c[i - 1] : 0; u.push(Math.max(ch, 0)); d.push(Math.max(-ch, 0)); } var a = xsum(u, P.len), b = xsum(d, P.len); return { plots: [xl("CMO", a.map(function (x, k) { return x == null ? null : 100 * (x - b[k]) / ((x + b[k]) || 1e-9); }), 4)], hl: [-50, 0, 50], rng: [-100, 100] }; });
xdef("dpo", "Detrended Price Oscillator", "osc", false, { len: 21 }, function (P) { var c = XC(), m = xsma(c, P.len), sh = Math.floor(P.len / 2) + 1; return { plots: [xl("DPO", c.map(function (v, i) { return m[i] == null || i - sh < 0 ? null : c[i - sh] - m[i]; }), 0)], hl: [0] }; });
xdef("uo", "Ultimate Oscillator", "osc", false, { a: 7, b: 14, c: 28 }, function (P) { var bp = xn(function (b, i, a) { return b.c - Math.min(b.l, i ? a[i - 1].c : b.l); }), tr = xn(function (b, i, a) { return Math.max(b.h, i ? a[i - 1].c : b.h) - Math.min(b.l, i ? a[i - 1].c : b.l); }), k = function (p) { var s = xsum(bp, p), t = xsum(tr, p); return s.map(function (x, i) { return x == null ? null : x / (t[i] || 1e-9); }); }, a = k(P.a), b = k(P.b), c = k(P.c); return { plots: [xl("UO", a.map(function (x, i) { return x == null || b[i] == null || c[i] == null ? null : 100 * (4 * x + 2 * b[i] + c[i]) / 7; }), 2)], hl: [30, 70], rng: [0, 100] }; });
xdef("stochrsi", "Stochastic RSI", "osc", false, { len: 14, k: 3, d: 3 }, function (P) { var r = xrsi(XC(), P.len), h = xhh(r, P.len), l = xll(r, P.len), raw = r.map(function (v, i) { return h[i] == null ? null : (h[i] === l[i] ? 50 : (v - l[i]) / (h[i] - l[i]) * 100); }), k = smaN(raw, P.k), d = smaN(k, P.d); return { plots: [xl("%K", k, 0), xl("%D", d, 1)], hl: [20, 80], rng: [0, 100] }; });
xdef("tsi", "True Strength Index", "osc", false, { a: 25, b: 13 }, function (P) { var c = XC(), m = c.map(function (v, i) { return i ? v - c[i - 1] : 0; }), am = m.map(Math.abs), n = emaOf(emaOf(m, P.a), P.b), d = emaOf(emaOf(am, P.a), P.b); return { plots: [xl("TSI", n.map(function (x, i) { return x == null || d[i] == null ? null : 100 * x / (d[i] || 1e-9); }), 0)], hl: [0] }; });
xdef("coppock", "Coppock Curve", "osc", false, { wma: 10, a: 14, b: 11 }, function (P) { var c = XC(), r = function (n) { return c.map(function (v, i) { return i >= n ? (v / c[i - n] - 1) * 100 : null; }); }; return { plots: [xl("Coppock", xwma(xadd(r(P.a), r(P.b)), P.wma), 1, "hist")], hl: [0] }; });
xdef("kst", "Know Sure Thing", "osc", false, {}, function () { var c = XC(), r = function (n, s) { return smaN(c.map(function (v, i) { return i >= n ? (v / c[i - n] - 1) * 100 : null; }), s); }, k = xadd(xadd(r(10, 10), xmul(r(15, 10), 2)), xadd(xmul(r(20, 10), 3), xmul(r(30, 15), 4))); return { plots: [xl("KST", k, 0), xl("Signal", smaN(k, 9), 1)], hl: [0] }; });
xdef("ppo", "Price Oscillator (PPO)", "osc", false, { fast: 12, slow: 26, sig: 9 }, function (P) { var c = XC(), f = emaOf(c, P.fast), s = emaOf(c, P.slow), p = f.map(function (v, i) { return v == null || s[i] == null ? null : (v - s[i]) / s[i] * 100; }), g = emaOf(p, P.sig); return { plots: [xl("Hist", xsub(p, g), 3, "hist"), xl("PPO", p, 0), xl("Signal", g, 1)], hl: [0] }; });
xdef("bbp", "Bollinger %B", "osc", false, { len: 20, mult: 2 }, function (P) { var c = XC(), m = xsma(c, P.len), s = xstd(c, P.len); return { plots: [xl("%B", c.map(function (v, i) { return m[i] == null ? null : (v - (m[i] - P.mult * s[i])) / ((2 * P.mult * s[i]) || 1e-9); }), 0)], hl: [0, 0.5, 1] }; });
xdef("bbw", "Bollinger BandWidth", "vola", false, { len: 20, mult: 2 }, function (P) { var c = XC(), m = xsma(c, P.len), s = xstd(c, P.len); return { plots: [xl("BBW", c.map(function (v, i) { return m[i] == null ? null : 2 * P.mult * s[i] / m[i]; }), 0)] }; });
xdef("stdev", "Standard Deviation", "vola", false, { len: 20 }, function (P) { return { plots: [xl("StdDev", xstd(XC(), P.len), 2)] }; });
xdef("hv", "Historical Volatility", "vola", false, { len: 10 }, function (P) { var c = XC(), r = c.map(function (v, i) { return i ? Math.log(v / c[i - 1]) : null; }); r[0] = null; var s = []; var i; for (i = 0; i < r.length; i++) { if (i < P.len) { s.push(null); continue; } var m = 0, j; for (j = i - P.len + 1; j <= i; j++) m += r[j]; m /= P.len; var v2 = 0; for (j = i - P.len + 1; j <= i; j++) v2 += (r[j] - m) * (r[j] - m); s.push(Math.sqrt(v2 / (P.len - 1 || 1)) * Math.sqrt(252) * 100); } return { plots: [xl("HV", s, 1)] }; });
xdef("chop", "Choppiness Index", "vola", false, { len: 14 }, function (P) { var tr = xtr(), s = xsum(tr, P.len), h = xhh(xn(function (b) { return b.h; }), P.len), l = xll(xn(function (b) { return b.l; }), P.len); return { plots: [xl("CHOP", s.map(function (x, i) { return x == null || h[i] == null || h[i] === l[i] ? null : 100 * Math.log10(x / (h[i] - l[i])) / Math.log10(P.len); }), 4)], hl: [38.2, 61.8], rng: [0, 100] }; });
xdef("mass", "Mass Index", "vola", false, { len: 25 }, function (P) { var r = xn(function (b) { return b.h - b.l; }), e1 = emaOf(r, 9), e2 = emaOf(e1, 9), q = e1.map(function (x, i) { return x == null || e2[i] == null ? null : x / (e2[i] || 1e-9); }); return { plots: [xl("Mass", xsum(q, P.len), 2)], hl: [27, 26.5] }; });
xdef("vortex", "Vortex Indicator", "osc", false, { len: 14 }, function (P) { var vp = xn(function (b, i, a) { return i ? Math.abs(b.h - a[i - 1].l) : 0; }), vm = xn(function (b, i, a) { return i ? Math.abs(b.l - a[i - 1].h) : 0; }), tr = xsum(xtr(), P.len), p = xsum(vp, P.len), m = xsum(vm, P.len); return { plots: [xl("VI+", p.map(function (x, i) { return x == null ? null : x / (tr[i] || 1e-9); }), 3), xl("VI-", m.map(function (x, i) { return x == null ? null : x / (tr[i] || 1e-9); }), 2)], hl: [1] }; });
xdef("bop", "Balance of Power", "osc", false, {}, function () { return { plots: [xl("BOP", xn(function (b) { return b.h === b.l ? 0 : (b.c - b.o) / (b.h - b.l); }), 4)], hl: [0] }; });
xdef("bbpwr", "Bull Bear Power", "osc", false, { len: 13 }, function (P) { var e = emaOf(XC(), P.len); return { plots: [xl("Bull", xn(function (b, i) { return e[i] == null ? null : b.h - e[i]; }), 3, "hist"), xl("Bear", xn(function (b, i) { return e[i] == null ? null : b.l - e[i]; }), 2, "hist")], hl: [0] }; });

/* ---- SUB-PANE: volume ---- */
xdef("obv", "On Balance Volume", "vol", false, {}, function () { var c = XC(), v = XV(), s = 0; return { plots: [xl("OBV", c.map(function (x, i) { if (i) s += x > c[i - 1] ? v[i] : x < c[i - 1] ? -v[i] : 0; return s; }), 0)] }; });
xdef("adl", "Accumulation/Distribution", "vol", false, {}, function () { return { plots: [xl("A/D", xcum(xn(function (b) { return b.h === b.l ? 0 : ((b.c - b.l) - (b.h - b.c)) / (b.h - b.l) * (b.v || 1); })), 1)] }; });
xdef("cmf", "Chaikin Money Flow", "vol", false, { len: 20 }, function (P) { var m = xn(function (b) { return b.h === b.l ? 0 : ((b.c - b.l) - (b.h - b.c)) / (b.h - b.l) * (b.v || 1); }), a = xsum(m, P.len), v = xsum(XV(), P.len); return { plots: [xl("CMF", a.map(function (x, i) { return x == null ? null : x / (v[i] || 1); }), 3, "hist")], hl: [0] }; });
xdef("chaikinosc", "Chaikin Oscillator", "vol", false, { fast: 3, slow: 10 }, function (P) { var a = xcum(xn(function (b) { return b.h === b.l ? 0 : ((b.c - b.l) - (b.h - b.c)) / (b.h - b.l) * (b.v || 1); })); return { plots: [xl("ChaikinOsc", xsub(emaOf(a, P.fast), emaOf(a, P.slow)), 0)], hl: [0] }; });
xdef("force", "Force Index", "vol", false, { len: 13 }, function (P) { var c = XC(), v = XV(); return { plots: [xl("Force", emaOf(c.map(function (x, i) { return i ? (x - c[i - 1]) * v[i] : 0; }), P.len), 2, "hist")], hl: [0] }; });
xdef("pvt", "Price Volume Trend", "vol", false, {}, function () { var c = XC(), v = XV(), s = 0; return { plots: [xl("PVT", c.map(function (x, i) { if (i) s += (x - c[i - 1]) / c[i - 1] * v[i]; return s; }), 5)] }; });
xdef("volosc", "Volume Oscillator", "vol", false, { fast: 5, slow: 10 }, function (P) { var v = XV(), f = emaOf(v, P.fast), s = emaOf(v, P.slow); return { plots: [xl("VolOsc", f.map(function (x, i) { return x == null || s[i] == null ? null : 100 * (x - s[i]) / (s[i] || 1); }), 4, "hist")], hl: [0] }; });
xdef("eom", "Ease of Movement", "vol", false, { len: 14 }, function (P) { var e = xn(function (b, i, a) { var hl = b.h - b.l; return i && hl ? (((b.h + b.l) / 2 - (a[i - 1].h + a[i - 1].l) / 2) / ((b.v || 1) / 1e4 / hl)) : 0; }); return { plots: [xl("EOM", xsma(e, P.len), 3)], hl: [0] }; });

var XGROUPS = [["all", "Semua"], ["trend", "Tren dan rata-rata"], ["osc", "Osilator dan momentum"], ["vola", "Volatilitas"], ["vol", "Volume"]];
var XBUILT = [["sma", "Moving Average (SMA)", "trend"], ["ema", "Moving Average Exponential (EMA)", "trend"], ["bb", "Bollinger Bands", "vola"], ["vwap", "VWAP", "vol"], ["vol", "Volume", "vol"], ["rsi", "Relative Strength Index (RSI)", "osc"], ["macd", "MACD", "osc"], ["stoch", "Stochastic", "osc"], ["atr", "Average True Range (ATR)", "vola"], ["adx", "Average Directional Index (ADX)", "osc"], ["st", "Supertrend", "trend"], ["ichi", "Ichimoku Cloud", "trend"]];

/* ---- state / hitung ---- */
S.xi = Array.isArray(saved.xi) ? saved.xi : [];
S.xi = S.xi.filter(function (x) { return x && XIND[x.id]; }).map(function (x) { x.u = x.u || ++xUid; xUid = Math.max(xUid, x.u); return x; });
function xParams(x) { return Object.assign({}, XIND[x.id].p, x.p || {}); }
function xTitle(x) { var d = XIND[x.id], ps = Object.keys(d.p).map(function (k) { return xParams(x)[k]; }); return d.n.split(" ").length > 3 ? d.n : d.n + (ps.length ? " " + ps.join(", ") : ""); }
function xAdd(id) { if (!XIND[id].ov && [S.ind.rsi, S.ind.macd, S.ind.stoch, S.ind.atr, S.ind.adx].filter(Boolean).length + S.cmpP.length + xPanes().length >= 8) { toast("Maksimal 8 panel indikator. Hapus salah satu dulu."); return null; } var x = { u: ++xUid, id: id, p: {}, c: {}, h: false }; S.xi.push(x); calcX(); legendHtml = null; draw(); save(); return x; }
function xRemove(u) { S.xi = S.xi.filter(function (x) { return x.u !== u; }); delete XR[u]; legendHtml = null; draw(); save(); }
function calcX() {
  S.xi.forEach(function (x) { try { XR[x.u] = XIND[x.id].calc(xParams(x)); } catch (e) { XR[x.u] = { plots: [] }; } });
}
function xCol(x, p, i) { return (x.c && x.c[i]) || p.c; }
function xPanes() { return S.xi.filter(function (x) { return !XIND[x.id].ov && !x.h && XR[x.u] && XR[x.u].plots.length; }); }

/* overlay: dipanggil dari drawMain (G dan ctx aktif) */
function drawXOverlay(C, lineFn, setLW) {
  S.xi.forEach(function (x) {
    var d = XIND[x.id], r = XR[x.u]; if (!d.ov || x.h || !r) return;
    if (r.band) { var a = r.plots[r.band[0]], b = r.plots[r.band[1]], i, st = false; ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = xCol(x, a, r.band[0]); ctx.beginPath();
      for (i = G.iL; i <= G.iR; i++) if (a.d[i] != null && b.d[i] != null) { var px = G.X(i), py = G.Yp(a.d[i]); if (!st) { ctx.moveTo(px, py); st = true; } else ctx.lineTo(px, py); }
      for (i = G.iR; i >= G.iL; i--) if (a.d[i] != null && b.d[i] != null) ctx.lineTo(G.X(i), G.Yp(b.d[i]));
      ctx.closePath(); ctx.fill(); ctx.restore(); }
    r.plots.forEach(function (p, pi) {
      var col = xCol(x, p, pi);
      if (p.t === "dots") { ctx.fillStyle = col; var i2; for (i2 = G.iL; i2 <= G.iR; i2++) if (p.d[i2] != null) { ctx.beginPath(); ctx.arc(G.X(i2), G.Yp(p.d[i2]), 1.8, 0, 6.3); ctx.fill(); } }
      else { setLW(p.w || 1.5); lineFn(p.d, col); }
    });
  });
}
function xOverlayVals(i, arr) { S.xi.forEach(function (x) { var r = XR[x.u]; if (XIND[x.id].ov && !x.h && r) r.plots.forEach(function (p) { arr.push(p.d[i]); }); }); }

/* sub-pane generik */
function drawXPane(u, top, h, C) {
  var x = S.xi.filter(function (q) { return String(q.u) === String(u); })[0], r = x && XR[x.u]; if (!r) return;
  var d = XIND[x.id], pw = G.pw, X = G.X, padT = 18, ih = h - padT - 4, i, lo = Infinity, hi = -Infinity;
  r.plots.forEach(function (p) { for (i = G.iL; i <= G.iR; i++) { var v = p.d[i]; if (v != null) { if (v < lo) lo = v; if (v > hi) hi = v; } } });
  (r.hl || []).forEach(function (v) { if (v < lo) lo = v; if (v > hi) hi = v; });
  if (r.rng) { lo = r.rng[0]; hi = r.rng[1]; } else {
    if (!isFinite(lo)) { lo = 0; hi = 1; }
    var hist = r.plots.some(function (p) { return p.t === "hist"; }); if (hist) { if (lo > 0) lo = 0; if (hi < 0) hi = 0; }
    var pad = (hi - lo) * 0.1 || Math.abs(hi) * 0.01 || 1; lo -= pad; hi += pad;
  }
  var Y2 = function (q) { return top + padT + (hi - q) / (hi - lo) * ih; };
  var st = niceStep((hi - lo) / 3), ticks = [], q;
  for (q = Math.ceil(lo / st) * st; q < hi; q += st) ticks.push(q);
  ctx.save(); ctx.beginPath(); ctx.rect(0, top + 1, pw, h - 1); ctx.clip();
  if (S.grid) { ctx.strokeStyle = C.grid; ticks.forEach(function (t) { var y = Math.round(Y2(t)) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }); }
  if (r.hl && r.hl.length > 1 && r.rng) { ctx.globalAlpha = 0.07; ctx.fillStyle = xCol(x, r.plots[0], 0); ctx.fillRect(0, Y2(r.hl[r.hl.length - 1]), pw, Y2(r.hl[0]) - Y2(r.hl[r.hl.length - 1])); ctx.globalAlpha = 1; }
  (r.hl || []).forEach(function (v) { var y = Math.round(Y2(v)) + 0.5; ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; });
  var zy = Y2(Math.max(lo, Math.min(hi, 0)));
  r.plots.forEach(function (p, pi) {
    var col = xCol(x, p, pi);
    if (p.t === "hist") {
      var bw2 = Math.max(1, G.bw * 0.7);
      for (i = G.iL; i <= G.iR; i++) { var v = p.d[i]; if (v == null) continue; ctx.globalAlpha = 0.6; ctx.fillStyle = p.cols && p.cols[i] ? p.cols[i] : (x.c && x.c[pi] ? col : (v >= 0 ? C.up : C.down)); var yy = Y2(v); ctx.fillRect(X(i) - bw2 / 2, Math.min(zy, yy), bw2, Math.max(1, Math.abs(yy - zy))); ctx.globalAlpha = 1; }
    } else {
      ctx.strokeStyle = col; ctx.lineWidth = p.w || 1.5; ctx.beginPath(); var s = false;
      for (i = G.iL; i <= G.iR; i++) { var v2 = p.d[i]; if (v2 == null) continue; var y2 = Y2(v2); if (!s) { ctx.moveTo(X(i), y2); s = true; } else ctx.lineTo(X(i), y2); }
      ctx.stroke(); ctx.lineWidth = 1;
    }
  });
  ctx.restore();
  ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = C.muted; ctx.fillText(xTitle(x), 8, top + 10);
  ctx.font = "11px " + css("--font-mono");
  G.panes.push({ k: "x:" + x.u, top: top, h: h, Y2: Y2, lo: lo, hi: hi, ticks: ticks, padT: padT, ih: ih, dec: 2 });
}
function xLegend(i, item) {
  var h = "";
  S.xi.forEach(function (x) {
    var r = XR[x.u]; if (!r) return; var vals = r.plots.map(function (p) { var v = p.d[i]; return v == null ? "\u2013" : (Math.abs(v) >= 1000 ? v.toFixed(1) : v.toFixed(Math.abs(v) < 1 ? 4 : 2)); }).join(" ");
    var col = xCol(x, r.plots[0] || { c: XPAL[0] }, 0);
    h += "<span class=\"chip\" data-xu=\"" + x.u + "\" style=\"color:" + col + (x.h ? ";opacity:.45" : "") + "\">" + xTitle(x) + " <b style=\"font-weight:500\">" + vals + "</b><span class=\"lt\"><button type=\"button\" data-xa=\"eye\" title=\"Sembunyikan/tampilkan\" aria-label=\"Sembunyikan\">\uD83D\uDC41</button><button type=\"button\" data-xa=\"set\" title=\"Pengaturan\" aria-label=\"Pengaturan\">\u2699</button><button type=\"button\" data-xa=\"del\" title=\"Hapus\" aria-label=\"Hapus\">\u00D7</button></span></span>";
  });
  return h;
}
var ALT = {};
function altBox() { var a = atrOf(14), v = null, i; for (i = a.length - 1; i >= 0; i--) if (a[i] != null) { v = a[i]; break; } if (!v) v = bars[bars.length - 1].c * 0.005; return Math.max(v, 1e-9); }
function altPush(out, b, o, c, h, l, extra) { var r = { t: b.t, o: o, c: c, h: h == null ? Math.max(o, c) : h, l: l == null ? Math.min(o, c) : l, v: b.v }; if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; }); out.push(r); }
function calcAlt() {
  ALT = {}; if (!bars.length) return;
  var B = altBox(), out, lvl, dir, last, n;
  /* Renko */
  out = []; lvl = bars[0].c; dir = 0; last = { o: lvl, c: lvl };
  bars.forEach(function (b) {
    var c = b.c, was = lvl, wd = dir;
    if (dir >= 0 && c >= lvl + B) { n = Math.floor((c - lvl) / B); last = { o: lvl + (n - 1) * B, c: lvl + n * B }; lvl += n * B; dir = 1; }
    else if (dir <= 0 && c <= lvl - B) { n = Math.floor((lvl - c) / B); last = { o: lvl - (n - 1) * B, c: lvl - n * B }; lvl -= n * B; dir = -1; }
    else if (dir === 1 && c <= lvl - 2 * B) { n = Math.floor((lvl - B - c) / B); last = { o: lvl - B - (n - 1) * B, c: lvl - B - n * B }; lvl = lvl - B - n * B; dir = -1; }
    else if (dir === -1 && c >= lvl + 2 * B) { n = Math.floor((c - lvl - B) / B); last = { o: lvl + B + (n - 1) * B, c: lvl + B + n * B }; lvl = lvl + B + n * B; dir = 1; }
    altPush(out, b, last.o, last.c, null, null, { rep: lvl === was && dir === wd });
  });
  ALT.renko = out;
  /* Range */
  out = []; var ro = null, rh = 0, rl = 0;
  bars.forEach(function (b) {
    if (ro == null) { ro = b.o; rh = b.h; rl = b.l; } else { rh = Math.max(rh, b.h); rl = Math.min(rl, b.l); }
    altPush(out, b, ro, b.c, rh, rl);
    if (rh - rl >= B) { ro = b.c; rh = b.c; rl = b.c; }
  });
  ALT.range = out;
  /* Line break (3 line) */
  out = []; var lines = [{ o: bars[0].o, c: bars[0].c }];
  var nl = 0;
  bars.forEach(function (b, i) {
    nl = lines.length;
    if (i) {
      var L = lines[lines.length - 1], up = L.c >= L.o, rec = lines.slice(-3), hi = Math.max.apply(null, rec.map(function (q) { return Math.max(q.o, q.c); })), lo = Math.min.apply(null, rec.map(function (q) { return Math.min(q.o, q.c); }));
      if (up) { if (b.c > L.c) lines.push({ o: L.c, c: b.c }); else if (b.c < lo) lines.push({ o: L.c, c: b.c }); }
      else { if (b.c < L.c) lines.push({ o: L.c, c: b.c }); else if (b.c > hi) lines.push({ o: L.c, c: b.c }); }
    }
    var Q = lines[lines.length - 1]; altPush(out, b, Q.o, Q.c, null, null, { rep: i > 0 && lines.length === nl });
  });
  ALT.lbreak = out;
  /* Kagi */
  out = []; lvl = bars[0].c; dir = 1; var prev = lvl;
  bars.forEach(function (b) {
    var c = b.c; prev = lvl;
    if (dir > 0) { if (c > lvl) lvl = c; else if (c <= lvl - B) { dir = -1; lvl = c; } }
    else { if (c < lvl) lvl = c; else if (c >= lvl + B) { dir = 1; lvl = c; } }
    altPush(out, b, prev, lvl, Math.max(prev, lvl), Math.min(prev, lvl), { d: dir });
  });
  ALT.kagi = out;
  /* Point & figure (reversal 3 kotak) */
  out = []; lvl = Math.floor(bars[0].c / B) * B; dir = 1;
  bars.forEach(function (b) {
    var c = b.c;
    if (dir > 0) { if (c >= lvl + B) lvl = Math.floor(c / B) * B; else if (c <= lvl - 3 * B) { dir = -1; lvl = Math.floor(c / B) * B; } }
    else { if (c <= lvl - B) lvl = Math.floor(c / B) * B; else if (c >= lvl + 3 * B) { dir = 1; lvl = Math.floor(c / B) * B; } }
    altPush(out, b, lvl, lvl, lvl + B, lvl, { d: dir });
  });
  ALT.pnf = out;
}
function altSrc(t) { return ALT[t] && ALT[t].length === bars.length ? ALT[t] : null; }
/* ---------- Pine Script subset ---------- */
var pineOut = null;
var PINE_SAMPLE = '//@version=5\nindicator("Aurum demo bands", overlay=true)\n\nfast = ta.sma(close, 9)\nslow = ta.ema(close, 21)\n\nplot(fast, "SMA 9", color=color.blue, linewidth=2)\nplot(slow, "EMA 21", color=color.orange, linewidth=2)\nplot(ta.highest(high, 20), "Highest 20", color=color.gray)\nplot(ta.lowest(low, 20), "Lowest 20", color=color.gray)\n';
var PINE_SAMPLE2 = '//@version=5\nindicator("RSI bands")\n\nr = ta.rsi(close, 14)\nplot(r, "RSI 14", color=color.purple, linewidth=2)\nhline(70, "Overbought", color=color.red)\nhline(50, "Mid", color=color.gray)\nhline(30, "Oversold", color=color.green)\n';
var PINE_COLORS = { red: "#f23645", orange: "#ff9800", yellow: "#fbc02d", green: "#089981", lime: "#c0ca33", blue: "#2962ff", navy: "#1a237e", purple: "#9c27b0", fuchsia: "#e040fb", aqua: "#00bcd4", teal: "#00897b", gray: "#787b86", grey: "#787b86", black: "#131722", white: "#ffffff", silver: "#b2b5be", maroon: "#880e4f", olive: "#808000" };
function pineTok(src) {
  var toks = [];
  String(src).split(/\r?\n/).forEach(function (ln, li) {
    ln = ln.replace(/\/\/.*$/, "");
    var i = 0, n = ln.length;
    function push(k, v) { toks.push({ k: k, v: v, line: li + 1 }); }
    while (i < n) {
      var c = ln[i], m;
      if (c === " " || c === "\t") { i++; continue; }
      if (/[0-9]/.test(c)) { m = /^\d*\.?\d+/.exec(ln.slice(i)); push("num", parseFloat(m[0])); i += m[0].length; continue; }
      if (c === '"' || c === "'") { var j = i + 1, s = ""; while (j < n && ln[j] !== c) { s += ln[j]; j++; } if (j >= n) throw new Error("line " + (li + 1) + ": unterminated string"); push("str", s); i = j + 1; continue; }
      if (/[A-Za-z_]/.test(c)) { m = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(ln.slice(i)); push("id", m[0]); i += m[0].length; continue; }
      if ("+-*/%(),=[]".indexOf(c) >= 0) { push(c, c); i++; continue; }
      throw new Error("line " + (li + 1) + ": unexpected character '" + c + "'");
    }
    push("nl");
  });
  return toks;
}
function parsePine(src) {
  var toks = pineTok(src), pos = 0;
  function peek() { return toks[pos]; }
  function next() { return toks[pos++]; }
  function err(t, m) { throw new Error("line " + (t ? t.line : "?") + ": " + m); }
  function skipNl() { while (peek() && peek().k === "nl") pos++; }
  function expect(k) { var t = next(); if (!t || t.k !== k) err(t, "expected '" + k + "'"); return t; }
  function args() {
    var out = [];
    if (peek() && peek().k === ")") { next(); return out; }
    for (;;) {
      var name = null;
      if (peek() && peek().k === "id" && toks[pos + 1] && toks[pos + 1].k === "=") { name = next().v; next(); }
      out.push({ name: name, e: expr() });
      var d = next();
      if (!d) err(d, "missing ')'");
      if (d.k === ",") continue;
      if (d.k === ")") break;
      err(d, "expected ',' or ')'");
    }
    return out;
  }
  function expr() { var l = term(); for (;;) { var t = peek(); if (t && (t.k === "+" || t.k === "-")) { next(); l = { t: "bin", op: t.k, l: l, r: term() }; } else return l; } }
  function term() { var l = unary(); for (;;) { var t = peek(); if (t && (t.k === "*" || t.k === "/" || t.k === "%")) { next(); l = { t: "bin", op: t.k, l: l, r: unary() }; } else return l; } }
  function unary() { var t = peek(); if (t && t.k === "-") { next(); return { t: "un", e: unary() }; } return postfix(); }
  function postfix() { var e = primary(); for (;;) { var t = peek(); if (t && t.k === "[") { next(); var n = expect("num"); expect("]"); e = { t: "hist", e: e, n: n.v }; } else return e; } }
  function primary() {
    var t = next();
    if (!t) err(t, "unexpected end of script");
    if (t.k === "num") return { t: "num", v: t.v };
    if (t.k === "str") return { t: "str", v: t.v };
    if (t.k === "(") { var e = expr(); expect(")"); return e; }
    if (t.k === "id") {
      if (peek() && peek().k === "(") { next(); return { t: "call", n: t.v, args: args(), line: t.line }; }
      return { t: "var", n: t.v, line: t.line };
    }
    err(t, "unexpected '" + (t.v != null ? t.v : t.k) + "'");
  }
  var prog = { title: "Pine script", overlay: false, stmts: [] };
  skipNl();
  while (peek()) {
    var t = next();
    if (t.k !== "id") err(t, "expected a statement");
    if (t.v === "indicator" || t.v === "study") {
      expect("(");
      args().forEach(function (g) {
        if (g.e.t === "str" && (g.name === "title" || !g.name)) prog.title = g.e.v;
        if (g.name === "overlay") prog.overlay = g.e.t === "var" && g.e.n === "true";
      });
    } else if (t.v === "plot" || t.v === "hline") {
      expect("("); prog.stmts.push({ t: t.v, args: args(), line: t.line });
    } else if (peek() && peek().k === "=") {
      next(); prog.stmts.push({ t: "set", name: t.v, e: expr(), line: t.line });
    } else err(t, "unsupported statement '" + t.v + "' — this subset supports indicator(), assignments, plot() and hline()");
    skipNl();
  }
  return prog;
}
function pineToArr(v) {
  if (v == null || (typeof v === "object" && !Array.isArray(v))) throw new Error("expected a numeric series");
  if (Array.isArray(v)) return v;
  var o = [], i; for (i = 0; i < bars.length; i++) o.push(v); return o;
}
function pineMap(v, f) {
  if (typeof v === "number") return f(v);
  var a = pineToArr(v), o = [], i; for (i = 0; i < a.length; i++) o.push(a[i] == null ? null : f(a[i])); return o;
}
function pineNumOp(op, a, b) { return op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : op === "/" ? (b === 0 ? NaN : a / b) : a % b; }
function wmaOf(a, p) { var o = [], i, j; for (i = 0; i < a.length; i++) { if (i < p - 1) { o.push(null); continue; } var s = 0, w = 0, ok = true; for (j = 0; j < p; j++) { var v = a[i - j]; if (v == null) { ok = false; break; } s += v * (p - j); w += p - j; } o.push(ok ? s / w : null); } return o; }
function pineRsi(a, p) {
  var o = [], i, gn = 0, ls = 0;
  for (i = 0; i < a.length; i++) {
    if (i === 0 || a[i] == null || a[i - 1] == null) { o.push(null); continue; }
    var ch = a[i] - a[i - 1], up = Math.max(ch, 0), dn = Math.max(-ch, 0);
    if (i <= p) { gn += up; ls += dn; if (i === p) { gn /= p; ls /= p; o.push(100 - 100 / (1 + gn / (ls || 1e-9))); } else o.push(null); }
    else { gn = (gn * (p - 1) + up) / p; ls = (ls * (p - 1) + dn) / p; o.push(100 - 100 / (1 + gn / (ls || 1e-9))); }
  }
  return o;
}
function pineStdev(a, p) { var m = smaOf(a, p), o = [], i, j; for (i = 0; i < a.length; i++) { if (m[i] == null) { o.push(null); continue; } var s = 0; for (j = i - p + 1; j <= i; j++) s += (a[j] - m[i]) * (a[j] - m[i]); o.push(Math.sqrt(s / p)); } return o; }
function pineRoll(a, n, dir) { var o = [], i, j; for (i = 0; i < a.length; i++) { if (i < n - 1) { o.push(null); continue; } var m = null; for (j = i - n + 1; j <= i; j++) { if (a[j] == null) { m = null; break; } if (m === null || (dir > 0 ? a[j] > m : a[j] < m)) m = a[j]; } o.push(m); } return o; }
function pineEval(e, env) {
  var l, r, la, ra, o, k, a, n, i;
  switch (e.t) {
    case "num": return e.v;
    case "str": return e.v;
    case "var":
      if (e.n === "true") return 1; if (e.n === "false") return 0; if (e.n === "na") return null;
      if (e.n.indexOf("color.") === 0) { var cn = e.n.slice(6); if (PINE_COLORS[cn]) return { col: PINE_COLORS[cn] }; throw new Error("unknown color '" + e.n + "'"); }
      if (env[e.n]) return env[e.n];
      throw new Error("unknown identifier '" + e.n + "'");
    case "un": return pineMap(pineEval(e.e, env), function (x) { return -x; });
    case "hist": a = pineToArr(pineEval(e.e, env)); n = Math.max(0, Math.floor(e.n)); o = []; for (i = 0; i < a.length; i++) o.push(i >= n ? a[i - n] : null); return o;
    case "bin":
      l = pineEval(e.l, env); r = pineEval(e.r, env);
      if (typeof l === "number" && typeof r === "number") return pineNumOp(e.op, l, r);
      la = pineToArr(l); ra = pineToArr(r); o = [];
      for (k = 0; k < la.length; k++) o.push(la[k] == null || ra[k] == null ? null : pineNumOp(e.op, la[k], ra[k]));
      return o;
    case "call": return pineCall(e, env);
  }
  throw new Error("bad expression");
}
function pineCall(e, env) {
  var nm = e.n.replace(/^ta\./, "").replace(/^math\./, "");
  var av = e.args.map(function (g) { return { name: g.name, v: pineEval(g.e, env) }; });
  function pos(i) { var p = av.filter(function (g) { return !g.name; })[i]; return p ? p.v : undefined; }
  function arr(v, what) { if (v === undefined) throw new Error(nm + ": missing " + what); return pineToArr(v); }
  function len(v, d) { var n = v === undefined ? d : v; if (typeof n !== "number") throw new Error(nm + ": length must be a number"); n = Math.floor(n); if (!(n >= 1 && n <= 5000)) throw new Error(nm + ": length must be 1..5000"); return n; }
  var a0, n0, o, i, l, r, la, ra;
  switch (nm) {
    case "sma": return smaOf(arr(pos(0), "source"), len(pos(1), 14));
    case "ema": return emaOf(arr(pos(0), "source"), len(pos(1), 14));
    case "wma": return wmaOf(arr(pos(0), "source"), len(pos(1), 14));
    case "rsi": return pineRsi(arr(pos(0), "source"), len(pos(1), 14));
    case "atr": return atrOf(len(pos(0), 14));
    case "stdev": return pineStdev(arr(pos(0), "source"), len(pos(1), 20));
    case "highest": return pineRoll(pos(1) === undefined ? env.high : arr(pos(0), "source"), len(pos(1) === undefined ? pos(0) : pos(1)), 1);
    case "lowest": return pineRoll(pos(1) === undefined ? env.low : arr(pos(0), "source"), len(pos(1) === undefined ? pos(0) : pos(1)), -1);
    case "change": a0 = arr(pos(0), "source"); n0 = len(pos(1), 1); o = []; for (i = 0; i < a0.length; i++) o.push(i >= n0 && a0[i] != null && a0[i - n0] != null ? a0[i] - a0[i - n0] : null); return o;
    case "roc": a0 = arr(pos(0), "source"); n0 = len(pos(1), 1); o = []; for (i = 0; i < a0.length; i++) o.push(i >= n0 && a0[i] != null && a0[i - n0] ? (a0[i] / a0[i - n0] - 1) * 100 : null); return o;
    case "abs": return pineMap(pos(0), Math.abs);
    case "max": l = pineEval(e.args[0].e, env); r = pineEval(e.args[1].e, env); if (typeof l === "number" && typeof r === "number") return Math.max(l, r); la = pineToArr(l); ra = pineToArr(r); o = []; for (i = 0; i < la.length; i++) o.push(la[i] == null || ra[i] == null ? null : Math.max(la[i], ra[i])); return o;
    case "min": l = pineEval(e.args[0].e, env); r = pineEval(e.args[1].e, env); if (typeof l === "number" && typeof r === "number") return Math.min(l, r); la = pineToArr(l); ra = pineToArr(r); o = []; for (i = 0; i < la.length; i++) o.push(la[i] == null || ra[i] == null ? null : Math.min(la[i], ra[i])); return o;
    case "nz": a0 = pineToArr(pos(0) === undefined ? 0 : pos(0)); var rep = pos(1) === undefined ? 0 : pos(1); o = []; for (i = 0; i < a0.length; i++) o.push(a0[i] == null ? rep : a0[i]); return o;
    default: throw new Error("unsupported function '" + e.n + "' — try sma, ema, wma, rsi, atr, stdev, highest, lowest, change, roc, abs, max, min, nz");
  }
}
function execPine(prog) {
  var env = {
    open: bars.map(function (b) { return b.o; }), high: bars.map(function (b) { return b.h; }),
    low: bars.map(function (b) { return b.l; }), close: bars.map(function (b) { return b.c; }),
    volume: bars.map(function (b) { return b.v; }),
    hl2: bars.map(function (b) { return (b.h + b.l) / 2; }), hlc3: bars.map(function (b) { return (b.h + b.l + b.c) / 3; }), ohlc4: bars.map(function (b) { return (b.o + b.h + b.l + b.c) / 4; })
  };
  var out = { title: prog.title, overlay: prog.overlay, plots: [], hlines: [] };
  var pal = ["#2962ff", "#ff9800", "#9c27b0", "#089981", "#f23645", "#00bcd4"];
  prog.stmts.forEach(function (st) {
    try {
      if (st.t === "set") { env[st.name] = pineEval(st.e, env); return; }
      var vals = st.args.map(function (g) { return { name: g.name, v: pineEval(g.e, env) }; });
      function pos(i) { var p = vals.filter(function (g) { return !g.name; })[i]; return p ? p.v : undefined; }
      function named(n2, d) { var g = vals.filter(function (x) { return x.name === n2; })[0]; return g ? g.v : d; }
      function colOf(v, dflt) { if (v && typeof v === "object" && v.col) return v.col; if (typeof v === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v; return dflt; }
      var ttl = named("title", undefined), col = named("color", undefined), lw = named("linewidth", undefined);
      if (st.t === "plot") {
        var name = typeof ttl === "string" ? ttl : (typeof pos(1) === "string" ? pos(1) : "plot " + (out.plots.length + 1));
        out.plots.push({ name: name, color: colOf(col, colOf(pos(2), pal[out.plots.length % pal.length])), width: typeof lw === "number" ? Math.max(1, Math.min(4, lw)) : 1.5, data: pineToArr(pos(0)) });
      } else {
        var v2 = pos(0), hv = typeof v2 === "number" ? v2 : (Array.isArray(v2) ? v2[v2.length - 1] : undefined);
        if (typeof hv !== "number" || !isFinite(hv)) throw new Error("hline needs a numeric level");
        out.hlines.push({ value: hv, color: colOf(col, colOf(pos(2), "#787b86")), title: typeof ttl === "string" ? ttl : "hline" });
      }
    } catch (ex) { throw new Error("line " + st.line + ": " + ex.message); }
  });
  if (!out.plots.length && !out.hlines.length) throw new Error("nothing to draw — add a plot() or hline() call");
  return out;
}
function pineMsg(txt, cls) {
  var el = $("#pineStatus"); if (!el) return;
  el.textContent = txt || "Pine v5 subset — indicator(), plot(), hline(), sma / ema / wma / rsi / atr / stdev / highest / lowest / change / roc / abs / max / min / nz";
  el.className = "pine-sub " + (cls || "");
}
function pineCompute() {
  pineOut = null;
  if (!S.pine || !S.pine.src || !bars.length) { pineMsg(""); return; }
  try {
    pineOut = execPine(parsePine(S.pine.src));
    pineMsg("OK — " + pineOut.plots.length + " plot(s), " + pineOut.hlines.length + " hline(s), " + (pineOut.overlay ? "overlay on price" : "own pane"), "pine-ok");
  } catch (e2) {
    pineOut = { error: e2.message, overlay: true, title: "Pine", plots: [], hlines: [] };
    pineMsg(e2.message, "pine-err");
  }
}

/* ---------- canvas + geometry ---------- */
var wrap = $("#wrap"), cv = $("#cv"), ctx = cv.getContext("2d");
var W = 300, H = 300, dpr = 1, G = {};
function resize() {
  var rc = wrap.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  W = Math.max(200, Math.floor(rc.width)); H = Math.max(200, Math.floor(rc.height));
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
  draw();
}
function colors() {
  var o = {}; ["bg:--chart-bg", "grid:--grid", "ink:--ink", "muted:--muted", "up:--up", "down:--down", "acc:--accent", "line:--line", "tag:--tag", "tagInk:--tag-ink",
    "i1:--i1", "i2:--i2", "i3:--i3", "i4:--i4", "c1:--c1", "c2:--c2", "c3:--c3"].forEach(function (p) { var a = p.split(":"); o[a[0]] = css(a[1]); });
  if (S.colOv) Object.keys(S.colOv).forEach(function (k) { o[k] = S.colOv[k]; });
  return o;
}
function niceStep(raw) { var e = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / e; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * e; }
function curPrice() { return S.replay.on && bars[S.replay.idx] ? bars[S.replay.idx].c : live[S.sym.id]; }

function geom() {
  var n = bars.length, nv = S.replay.on && !S.replay.pick ? Math.min(n, S.replay.idx + 1) : n, bw = S.barW;
  var pw = W - R, ph = H - B, subs = [];
  if (S.ind.rsi) subs.push("rsi"); if (S.ind.macd) subs.push("macd"); if (S.ind.stoch) subs.push("stoch"); if (S.ind.atr) subs.push("atr"); if (S.ind.adx) subs.push("adx"); S.cmpP.forEach(function (id, ci) { subs.push("cmp" + ci); });
  xPanes().forEach(function (x) { subs.push("x:" + x.u); });
  if (pineOut && !pineOut.error && !pineOut.overlay && (pineOut.plots.length || pineOut.hlines.length)) subs.push("pine");
  var subH = subs.length ? Math.max(60, Math.min(150, ph * 0.2, ph * 0.55 / subs.length)) : 0, mainH = ph - subs.length * subH;
  var vis = pw / bw;
  S.off = Math.max(-(nv - 1) + vis * 0.3, Math.min(vis * 0.7, S.off));
  var X = function (fi) { return pw - (nv - 1 - fi + S.off) * bw - bw / 2; };
  var fiAtX = function (x) { return nv - 1 + S.off - (pw - bw / 2 - x) / bw; };
  var iL = Math.max(0, Math.floor(fiAtX(0)) - 1), iR = Math.min(nv - 1, Math.ceil(fiAtX(pw)));
  if (iL > iR) iL = iR;
  var src = S.type === "ha" ? ha : (altSrc(S.type) || bars), mode = cmpData.length ? "pct" : S.scale, ref0 = src[iL].c;
  var vOf = function (p, rf) { return mode === "log" ? Math.log(p) : mode === "pct" ? (p / rf - 1) * 100 : p; };
  var vm = function (p) { return vOf(p, ref0); };
  var lineish = ["line", "linem", "step", "area", "baseline"].indexOf(S.type) >= 0, lo = Infinity, hi = -Infinity, i;
  for (i = iL; i <= iR; i++) {
    var b = src[i], a = vm(lineish ? b.c : b.l), z = vm(lineish ? b.c : b.h);
    if (a < lo) lo = a; if (z > hi) hi = z;
    var arr = [];
    if (S.ind.sma) arr.push(ind.sma[i]); if (S.ind.ema) arr.push(ind.ema[i]); if (S.ind.vwap) arr.push(ind.vwap[i]);
    if (S.ind.bb) { arr.push(ind.bbU[i]); arr.push(ind.bbL[i]); }
    if (S.ind.st) arr.push(ind.st[i]); if (S.ind.ichi) { arr.push(ind.spA[i]); arr.push(ind.spB[i]); arr.push(ind.tenkan[i]); arr.push(ind.kijun[i]); }
    xOverlayVals(i, arr);
    arr.forEach(function (v) { if (v != null) { var q = vm(v); if (q < lo) lo = q; if (q > hi) hi = q; } });
    cmpData.forEach(function (c) { var cb = c.bars[i]; if (cb) { var q = vOf(cb.c, c.bars[iL].c); if (q < lo) lo = q; if (q > hi) hi = q; } });
  }
  if (!isFinite(lo)) { lo = vm(src[nv - 1].l); hi = vm(src[nv - 1].h); }
  var pad = (hi - lo) * 0.08 || Math.abs(hi) * 0.001 || 1; lo -= pad; hi += pad * 1.2;
  if (S.yMan) { var mid = (lo + hi) / 2 + S.yShift * (hi - lo), half = (hi - lo) / 2 * S.yScale; lo = mid - half; hi = mid + half; }
  if (S.lockScale) {
    if (!S.lockR || S.lockR.mode !== mode) S.lockR = { mode: mode, lo: lo, hi: hi };
    lo = S.lockR.lo; hi = S.lockR.hi;
  } else S.lockR = null;
  var priceH = (S.ind.vol ? (mainH - T) * 0.82 : mainH - T - 4);
  var Y = S.invert ? function (v) { return T + (v - lo) / (hi - lo) * priceH; } : function (v) { return T + (hi - v) / (hi - lo) * priceH; };
  G = { n: n, nv: nv, bw: bw, pw: pw, ph: ph, subs: subs, subH: subH, mainH: mainH, X: X, fiAtX: fiAtX, iL: iL, iR: iR, src: src, mode: mode, ref0: ref0, vm: vm, vOf: vOf,
    lo: lo, hi: hi, priceH: priceH, Y: Y, lineish: lineish, panes: [], tags: [] };
  G.Yp = function (p) { return Y(vm(p)); };
  G.Pinv = function (y) { var v = S.invert ? lo + (y - T) / priceH * (hi - lo) : hi - (y - T) / priceH * (hi - lo); return mode === "log" ? Math.exp(v) : mode === "pct" ? ref0 * (1 + v / 100) : v; };
  return G;
}

/* ---------- main pane series + indicators ---------- */
function drawMain(C) {
  var pw = G.pw, mainH = G.mainH, dec = S.sym.dec, bw = G.bw, X = G.X, Y = G.Y, i, b, k;
  var ticks = [], lastLabelX = -1e9;
  if (G.mode === "pct") {
    var st = niceStep((G.hi - G.lo) / 6), v;
    for (v = Math.ceil(G.lo / st) * st; v < G.hi; v += st) ticks.push({ y: Y(v), label: (v >= 0 ? "+" : "") + v.toFixed(2) + "%" });
  } else {
    var loP = G.Pinv(T + G.priceH), hiP = G.Pinv(T), step = niceStep((hiP - loP) / 6), p;
    for (p = Math.ceil(loP / step) * step; p < hiP; p += step) ticks.push({ y: G.Yp(p), label: fmt(p, dec) });
  }
  G.ticks = ticks;

  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pw, G.ph); ctx.clip();
  ctx.lineWidth = 1;
  if (S.grid && S.sty.gh !== false) {
    ctx.strokeStyle = C.grid;
    ticks.forEach(function (t) { var y = Math.round(t.y) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); });
  }
  var kk = Math.max(1, Math.ceil(96 / bw)); G.tlabels = [];
  for (i = G.iL; i <= G.iR; i++) {
    if (i % kk === 0) {
      var gx = Math.round(X(i)) + 0.5;
      if (S.grid && S.sty.gv !== false) { ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, G.ph); ctx.stroke(); }
      G.tlabels.push([gx, axisTime(bars[i].t, i - kk >= 0 ? bars[i - kk].t : null)]);
    }
  }

  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pw, mainH); ctx.clip();
  if (S.ind.vol && !S.ihide.vol) {
    var vmax = 1, volH = (mainH - T) * 0.16, volTop = mainH - volH;
    for (i = G.iL; i <= G.iR; i++) if (bars[i].v > vmax) vmax = bars[i].v;
    ctx.globalAlpha = 0.38;
    for (i = G.iL; i <= G.iR; i++) {
      b = bars[i]; var vh = b.v / vmax * volH, vw = Math.max(1, bw * 0.7);
      ctx.fillStyle = b.c >= b.o ? C.up : C.down; ctx.fillRect(X(i) - vw / 2, volTop + volH - vh, vw, vh);
    }
    ctx.globalAlpha = 1;
  }
  if (S.ind.bb) {
    ctx.beginPath(); var st2 = false;
    for (i = G.iL; i <= G.iR; i++) if (ind.bbU[i] != null) { var yu = G.Yp(ind.bbU[i]); if (!st2) { ctx.moveTo(X(i), yu); st2 = true; } else ctx.lineTo(X(i), yu); }
    for (i = G.iR; i >= G.iL; i--) if (ind.bbL[i] != null) ctx.lineTo(X(i), G.Yp(ind.bbL[i]));
    ctx.closePath(); ctx.globalAlpha = 0.08; ctx.fillStyle = C.i3; ctx.fill(); ctx.globalAlpha = 1;
  }

  var src = G.src, ty = S.type;
  if (ty === "kagi") {
    ctx.lineJoin = "miter"; var kPrev = null;
    for (i = G.iL; i <= G.iR; i++) { b = src[i]; var kx = X(i), ky = G.Yp(b.c); ctx.strokeStyle = b.d > 0 ? C.up : C.down; ctx.lineWidth = b.d > 0 ? 3 : 1.5; ctx.beginPath(); if (kPrev) { ctx.moveTo(kPrev.x, kPrev.y); ctx.lineTo(kx, kPrev.y); ctx.lineTo(kx, ky); } else ctx.moveTo(kx, ky); ctx.stroke(); kPrev = { x: kx, y: ky }; }
    ctx.lineWidth = 1;
  } else if (ty === "pnf") {
    var gs = Math.max(3, Math.min(bw * 0.9, Math.abs(G.Yp(src[G.iL].l) - G.Yp(src[G.iL].h)) * 0.9 || 8));
    ctx.lineWidth = 1.4;
    for (i = G.iL; i <= G.iR; i++) { b = src[i]; var px = X(i), py = (G.Yp(b.l) + G.Yp(b.h)) / 2, hs = gs / 2; ctx.strokeStyle = b.d > 0 ? C.up : C.down; ctx.beginPath(); if (b.d > 0) { ctx.moveTo(px - hs, py - hs); ctx.lineTo(px + hs, py + hs); ctx.moveTo(px + hs, py - hs); ctx.lineTo(px - hs, py + hs); } else ctx.ellipse(px, py, hs, hs, 0, 0, 6.2832); ctx.stroke(); }
    ctx.lineWidth = 1;
  } else if (ty === "candles" || ty === "hollow" || ty === "ha" || ty === "vcandles" || ty === "renko" || ty === "range" || ty === "lbreak") {
    var cw0 = Math.max(1, Math.floor(bw * 0.7)), cw = cw0, vmax = 0;
    if (ty === "vcandles") for (i = G.iL; i <= G.iR; i++) vmax = Math.max(vmax, src[i].v || 0);
    for (i = G.iL; i <= G.iR; i++) {
      b = src[i]; if (b.rep) continue; if (ty === "vcandles") cw = Math.max(1, Math.floor(bw * (0.2 + 0.75 * (vmax ? (b.v || 0) / vmax : 1)))); var x = X(i), Q = S.sty, up = Q.pc && i > 0 ? b.c >= src[i - 1].c : b.c >= b.o;
      var bc = up ? (Q.bu || C.up) : (Q.bd || C.down), oc = up ? (Q.ou || C.up) : (Q.od || C.down), wc = up ? (Q.wu || C.up) : (Q.wd || C.down);
      if (Q.wick !== false) { ctx.strokeStyle = wc; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, G.Yp(b.h)); ctx.lineTo(Math.round(x) + 0.5, G.Yp(b.l)); ctx.stroke(); }
      var yt = G.Yp(Math.max(b.o, b.c)), yb = G.Yp(Math.min(b.o, b.c)), hh = Math.max(1, yb - yt);
      if (Q.body !== false) { ctx.fillStyle = (ty === "hollow" && up) ? C.bg : bc; ctx.fillRect(Math.round(x - cw / 2), yt, cw, hh); }
      if ((Q.border !== false && cw > 2) || (ty === "hollow" && up)) { ctx.strokeStyle = oc; ctx.strokeRect(Math.round(x - cw / 2) + 0.5, yt + 0.5, cw - 1, Math.max(0, hh - 1)); }
    }
  } else if (ty === "columns" || ty === "highlow") {
    var cw2 = Math.max(1, Math.floor(bw * 0.7)), bot = T + G.priceH;
    for (i = G.iL; i <= G.iR; i++) {
      b = bars[i]; var xc = X(i), up2 = b.c >= b.o;
      ctx.fillStyle = ty === "highlow" ? C.acc : (up2 ? C.up : C.down);
      var y0 = ty === "highlow" ? G.Yp(b.h) : G.Yp(b.c), y1 = ty === "highlow" ? G.Yp(b.l) : bot;
      ctx.fillRect(Math.round(xc - cw2 / 2), y0, cw2, Math.max(1, y1 - y0));
    }
  } else if (ty === "bars") {
    var tk = Math.max(2, bw * 0.35);
    for (i = G.iL; i <= G.iR; i++) {
      b = bars[i]; var xb = Math.round(X(i)) + 0.5; ctx.strokeStyle = b.c >= b.o ? C.up : C.down;
      ctx.beginPath(); ctx.moveTo(xb, G.Yp(b.h)); ctx.lineTo(xb, G.Yp(b.l));
      ctx.moveTo(xb - tk, G.Yp(b.o)); ctx.lineTo(xb, G.Yp(b.o)); ctx.moveTo(xb, G.Yp(b.c)); ctx.lineTo(xb + tk, G.Yp(b.c)); ctx.stroke();
    }
  } else {
    if (ty === "hlcarea") {
      ctx.beginPath();
      for (i = G.iL; i <= G.iR; i++) { if (i === G.iL) ctx.moveTo(X(i), G.Yp(bars[i].h)); else ctx.lineTo(X(i), G.Yp(bars[i].h)); }
      for (i = G.iR; i >= G.iL; i--) ctx.lineTo(X(i), G.Yp(bars[i].l));
      ctx.closePath(); ctx.globalAlpha = 0.18; ctx.fillStyle = C.acc; ctx.fill(); ctx.globalAlpha = 1;
    }
    if (ty === "baseline") {
      var by = G.Yp(bars[G.iL].c), pth = function () { ctx.beginPath(); for (i = G.iL; i <= G.iR; i++) { var yb2 = G.Yp(bars[i].c); if (i === G.iL) ctx.moveTo(X(i), yb2); else ctx.lineTo(X(i), yb2); } };
      [[T, by, C.up], [by, T + G.priceH, C.down]].forEach(function (z) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, z[0], pw, Math.max(0, z[1] - z[0])); ctx.clip();
        pth(); ctx.strokeStyle = z[2]; ctx.lineWidth = S.sty.lw || 2; ctx.stroke();
        pth(); ctx.lineTo(X(G.iR), by); ctx.lineTo(X(G.iL), by); ctx.closePath(); ctx.globalAlpha = 0.16; ctx.fillStyle = z[2]; ctx.fill(); ctx.restore();
      });
      ctx.setLineDash([3, 3]); ctx.strokeStyle = C.axT || C.acc; ctx.beginPath(); ctx.moveTo(0, Math.round(by) + 0.5); ctx.lineTo(pw, Math.round(by) + 0.5); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
    } else {
    ctx.beginPath();
    for (i = G.iL; i <= G.iR; i++) {
      var yy = G.Yp(bars[i].c);
      if (i === G.iL) ctx.moveTo(X(i), yy);
      else { if (ty === "step") ctx.lineTo(X(i), G.Yp(bars[i - 1].c)); ctx.lineTo(X(i), yy); }
    }
    if (ty === "area") {
      var gr = ctx.createLinearGradient(0, T, 0, T + G.priceH); gr.addColorStop(0, C.acc + "55"); gr.addColorStop(1, C.acc + "00");
      ctx.save(); ctx.lineTo(X(G.iR), T + G.priceH); ctx.lineTo(X(G.iL), T + G.priceH); ctx.closePath(); ctx.fillStyle = gr; ctx.fill(); ctx.restore();
      ctx.beginPath(); for (i = G.iL; i <= G.iR; i++) { var y2 = G.Yp(bars[i].c); if (i === G.iL) ctx.moveTo(X(i), y2); else ctx.lineTo(X(i), y2); }
    }
    ctx.strokeStyle = C.acc; ctx.lineWidth = S.sty.lw || 2; ctx.lineJoin = "round"; ctx.stroke(); ctx.lineWidth = 1;
    if (ty === "linem" && bw > 5) { ctx.fillStyle = C.acc; for (i = G.iL; i <= G.iR; i++) { ctx.beginPath(); ctx.arc(X(i), G.Yp(bars[i].c), 2.5, 0, 6.2832); ctx.fill(); } }
    }
  }

  var LW = 1.5;
  function line(arr, col, dash) {
    ctx.strokeStyle = col; ctx.lineWidth = LW; if (dash) ctx.setLineDash(dash); ctx.beginPath(); var s = false;
    for (var j = G.iL; j <= G.iR; j++) { if (arr[j] == null) continue; var yy2 = G.Yp(arr[j]); if (!s) { ctx.moveTo(X(j), yy2); s = true; } else ctx.lineTo(X(j), yy2); }
    ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
  }
  if (S.ind.sma && !S.ihide.sma) { LW = iw("sma"); line(ind.sma, C.i1); }
  if (S.ind.ema && !S.ihide.ema) { LW = iw("ema"); line(ind.ema, C.i2); }
  if (S.ind.vwap && !S.ihide.vwap) { LW = iw("vwap"); line(ind.vwap, C.i4); }
  if (S.ind.bb && !S.ihide.bb) { LW = iw("bb"); line(ind.bbU, C.i3); line(ind.bbL, C.i3); }
  if (S.ind.ichi && !S.ihide.ichi) {
    for (i = Math.max(0, G.iL); i < G.iR; i++) {
      var qa = ind.spA[i], qb = ind.spB[i], qc = ind.spA[i + 1], qd = ind.spB[i + 1]; if (qa == null || qb == null || qc == null || qd == null) continue;
      ctx.globalAlpha = 0.13; ctx.fillStyle = qa >= qb ? C.up : C.down; ctx.beginPath(); ctx.moveTo(X(i), G.Yp(qa)); ctx.lineTo(X(i + 1), G.Yp(qc)); ctx.lineTo(X(i + 1), G.Yp(qd)); ctx.lineTo(X(i), G.Yp(qb)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    }
    LW = iw("ichi"); line(ind.spA, C.up); line(ind.spB, C.down); line(ind.tenkan, C.i1); line(ind.kijun, C.i3);
  }
  if (S.ind.st && !S.ihide.st) {
    ctx.lineWidth = 2;
    for (i = Math.max(1, G.iL); i <= G.iR; i++) {
      if (ind.st[i] == null || ind.st[i - 1] == null || ind.stDir[i] !== ind.stDir[i - 1]) continue;
      ctx.strokeStyle = ind.stDir[i] === 1 ? C.up : C.down; ctx.beginPath(); ctx.moveTo(X(i - 1), G.Yp(ind.st[i - 1])); ctx.lineTo(X(i), G.Yp(ind.st[i])); ctx.stroke();
    }
    ctx.lineWidth = 1;
  }
  cmpData.forEach(function (c, ci) {
    var rf = c.bars[G.iL] ? c.bars[G.iL].c : 1;
    drawSeries(S.cmpT[c.sym.id] || "line", c.bars, function (p) { return Y(G.vOf(p, rf)); }, C["c" + (ci + 1)], C, T + G.priceH);
  });

  /* last price line */
  var last = bars[G.nv - 1], lcol = last.c >= last.o ? C.up : C.down, ly = G.Yp(last.c);
  if (S.sty.lastLine !== false) { ctx.setLineDash([4, 4]); ctx.strokeStyle = lcol; ctx.beginPath(); ctx.moveTo(0, Math.round(ly) + 0.5); ctx.lineTo(pw, Math.round(ly) + 0.5); ctx.stroke(); ctx.setLineDash([]); }
  if (S.sty.cd) G.tags.push({ y: ly + 17, text: cdText(), bg: lcol, fg: "#ffffff" });
  G.tags.push({ y: ly, text: S.sty.lastLabel === false ? "" : G.mode === "pct" ? ((last.c / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(last.c, dec), bg: lcol, fg: "#ffffff", last: true });

  /* highest / lowest visible price labels (hi/lo markers) */
  if (S.hilo) {
    var hiV = -Infinity, loV = Infinity, hiI = G.iL, loI = G.iL, srcH = G.src;
    for (i = G.iL; i <= G.iR; i++) {
      var hb = srcH[i], hv = G.lineish ? hb.c : hb.h, lv2 = G.lineish ? hb.c : hb.l;
      if (hv > hiV) { hiV = hv; hiI = i; } if (lv2 < loV) { loV = lv2; loI = i; }
    }
    var hl2f = function (v) { return G.mode === "pct" ? ((v / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(v, dec); };
    [[hiV, hiI, "hi"], [loV, loI, "lo"]].forEach(function (e2) {
      var ey = G.Yp(e2[0]), ex = X(e2[1]);
      G.tags.push({ y: ey, text: hl2f(e2[0]), bg: C.muted, fg: C.bg });
      ctx.strokeStyle = C.muted; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, 6.3); ctx.stroke();
      ctx.font = "10px " + css("--font-mono"); ctx.fillStyle = C.muted; ctx.textAlign = e2[2] === "hi" ? "center" : "center"; ctx.textBaseline = e2[2] === "hi" ? "bottom" : "top";
      ctx.fillText(e2[2], Math.max(10, Math.min(pw - 10, ex)), ey + (e2[2] === "hi" ? -5 : 5));
    });
  }

  drawXOverlay(C, function (a, c) { line(a, c); }, function (w) { LW = w; });

  /* Pine Script overlay plots */
  if (pineOut && pineOut.overlay && !pineOut.error) {
    pineOut.hlines.forEach(function (h2) {
      if (h2.value == null) return; var hy = G.Yp(h2.value);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = h2.color; ctx.beginPath(); ctx.moveTo(0, Math.round(hy) + 0.5); ctx.lineTo(pw, Math.round(hy) + 0.5); ctx.stroke(); ctx.setLineDash([]);
      G.tags.push({ y: hy, text: G.mode === "pct" ? ((h2.value / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(h2.value, dec), bg: h2.color, fg: "#ffffff" });
    });
    pineOut.plots.forEach(function (p2) { LW = p2.width; line(p2.data, p2.color); });
    ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillStyle = C.muted;
    ctx.fillText(pineOut.title, 8, T + 2);
    ctx.font = "11px " + css("--font-mono");
  }
  ctx.restore();
  ctx.restore();
}

function drawSeries(t, arr, Yf, col, C, base) {
  var i, bw = Math.max(1, G.bw * 0.7), b, x, y, s0 = false, fx = 0, lx = 0;
  if (t === "candles" || t === "bars") {
    for (i = G.iL; i <= G.iR; i++) {
      b = arr[i]; if (!b) continue; x = G.X(i); ctx.strokeStyle = ctx.fillStyle = b.c >= b.o ? C.up : C.down;
      ctx.beginPath(); ctx.moveTo(x, Yf(b.h)); ctx.lineTo(x, Yf(b.l)); ctx.stroke();
      if (t === "candles") ctx.fillRect(x - bw / 2, Math.min(Yf(b.o), Yf(b.c)), bw, Math.max(1, Math.abs(Yf(b.c) - Yf(b.o))));
      else { ctx.beginPath(); ctx.moveTo(x - bw / 2, Yf(b.o)); ctx.lineTo(x, Yf(b.o)); ctx.moveTo(x, Yf(b.c)); ctx.lineTo(x + bw / 2, Yf(b.c)); ctx.stroke(); }
    }
    return;
  }
  ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath();
  for (i = G.iL; i <= G.iR; i++) { b = arr[i]; if (!b) continue; x = G.X(i); y = Yf(b.c); if (!s0) { ctx.moveTo(x, y); fx = x; s0 = true; } else ctx.lineTo(x, y); lx = x; }
  ctx.stroke(); ctx.lineWidth = 1;
  if (t === "area" && s0) { ctx.lineTo(lx, base); ctx.lineTo(fx, base); ctx.closePath(); ctx.globalAlpha = 0.12; ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = 1; }
}
/* ---------- drawings ---------- */
var FIB = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
function tToI(t) {
  var n = bars.length, lo = 0, hi = n - 1, m;
  if (t <= bars[0].t) return (t - bars[0].t) / S.tf.s;
  if (t >= bars[n - 1].t) return n - 1 + (t - bars[n - 1].t) / S.tf.s;
  while (hi - lo > 1) { m = (lo + hi) >> 1; if (bars[m].t <= t) lo = m; else hi = m; }
  return lo + (t - bars[lo].t) / ((bars[hi].t - bars[lo].t) || 1);
}
function iToT(fi) {
  var n = bars.length;
  if (fi <= 0) return bars[0].t + fi * S.tf.s;
  if (fi >= n - 1) return bars[n - 1].t + (fi - (n - 1)) * S.tf.s;
  var i = Math.floor(fi); return bars[i].t + (fi - i) * (bars[i + 1].t - bars[i].t);
}
function pxOf(pt) { return { x: G.X(tToI(pt.t)), y: G.Yp(pt.p) }; }
function extendRay(a, b, xmax) {
  var dx = b.x - a.x, dy = b.y - a.y; if (Math.abs(dx) < 0.001) return { x: a.x, y: dy >= 0 ? 1e5 : -1e5 };
  var s = dx > 0 ? (xmax + 2000 - a.x) / dx : (-2000 - a.x) / dx; return { x: a.x + dx * s, y: a.y + dy * s };
}
var TOL = 7, HR = matchMedia("(pointer: coarse)").matches ? 7 : 5, ONE = { hline: 1, vline: 1, hray: 1, cross: 1 };
var EXTRA = { arrow: 1, brush: 1, ellipse: 1, channel: 1, pitch: 1, fibext: 1, long: 1, short: 1, xabcd: 1, abcd: 1, triangle: 1, hs: 1, elliott: 1, drives: 1 };
var NP = { xabcd: 5, abcd: 4, triangle: 5, hs: 7, elliott: 6, drives: 5 };
var PLBL = { xabcd: ["X", "A", "B", "C", "D"], abcd: ["A", "B", "C", "D"], triangle: ["A", "B", "C", "D", "E"], hs: ["L Sh", "Tr 1", "Head", "Tr 2", "R Sh", "Neck", "Neck"], elliott: ["0", "1", "2", "3", "4", "5"], drives: ["0", "1", "2", "3", "4"] };
var TWO = { trend: 1, ray: 1, extended: 1, rect: 1, fib: 1, arrow: 1, fibext: 1, ellipse: 1, long: 1, short: 1 };
var THREE = { channel: 1, pitch: 1 };
var FIBX = [0, 0.618, 1, 1.272, 1.618, 2, 2.618];
function channelOff(a, b, c) { var dx = b.x - a.x, yl = dx ? a.y + (b.y - a.y) * (c.x - a.x) / dx : a.y; return c.y - yl; }
function pitchLines(a, b, c) {
  var mx = (b.x + c.x) / 2, my = (b.y + c.y) / 2, m = { x: mx - a.x, y: my - a.y };
  return [[a, extendRay(a, { x: mx, y: my }, G.pw)], [b, extendRay(b, { x: b.x + m.x, y: b.y + m.y }, G.pw)], [c, extendRay(c, { x: c.x + m.x, y: c.y + m.y }, G.pw)]];
}
function stopOf(d) { return d.p1.p - (d.p2.p - d.p1.p); }
function drawExtra(d, C, pv, a, b) {
  var t = d.type, c3 = d.p3 ? pxOf(d.p3) : null, col = d.cx || C[d.c || "acc"] || C.acc, i, p;
  if (XT[t]) { drawXT(d, C, a, b, col); return; }
  function seg(p0, p1) { ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); }
  if (t === "arrow" && b) {
    seg(a, b); var an = Math.atan2(b.y - a.y, b.x - a.x), hl = 11;
    ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - hl * Math.cos(an - 0.45), b.y - hl * Math.sin(an - 0.45)); ctx.lineTo(b.x - hl * Math.cos(an + 0.45), b.y - hl * Math.sin(an + 0.45)); ctx.closePath(); ctx.fill();
  } else if (t === "brush" && d.pts) {
    ctx.lineJoin = "round"; ctx.beginPath(); d.pts.forEach(function (q, k) { p = pxOf(q); if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
  } else if (t === "ellipse" && b) {
    ctx.beginPath(); ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2 || 1, Math.abs(b.y - a.y) / 2 || 1, 0, 0, 6.2832);
    ctx.globalAlpha = 0.13; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
  } else if (t === "channel" && b) {
    var off = c3 ? channelOff(a, b, c3) : 0, a2 = { x: a.x, y: a.y + off }, b2 = { x: b.x, y: b.y + off };
    if (c3) { ctx.globalAlpha = 0.08; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(b2.x, b2.y); ctx.lineTo(a2.x, a2.y); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    seg(a, b); if (c3) { seg(a2, b2); ctx.setLineDash([4, 4]); ctx.globalAlpha = 0.6; seg({ x: a.x, y: a.y + off / 2 }, { x: b.x, y: b.y + off / 2 }); ctx.globalAlpha = 1; ctx.setLineDash([]); }
  } else if (t === "pitch" && b) {
    if (!c3) { seg(a, b); return; }
    var L3 = pitchLines(a, b, c3);
    ctx.globalAlpha = 0.07; ctx.beginPath(); ctx.moveTo(L3[1][0].x, L3[1][0].y); ctx.lineTo(L3[1][1].x, L3[1][1].y); ctx.lineTo(L3[2][1].x, L3[2][1].y); ctx.lineTo(L3[2][0].x, L3[2][0].y); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    L3.forEach(function (l, k) { ctx.lineWidth = k === 0 ? (d.w || 1.5) : 1; seg(l[0], l[1]); }); ctx.lineWidth = d.w || 1.5; seg(b, c3);
  } else if (t === "fibext" && b) {
    var xl = Math.min(a.x, b.x); ctx.font = "11px " + css("--font-mono"); ctx.textBaseline = "bottom"; ctx.textAlign = "left";
    FIBX.forEach(function (lv) {
      var price = d.p1.p + (d.p2.p - d.p1.p) * lv, y = G.Yp(price); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xl, Math.round(y) + 0.5); ctx.lineTo(G.pw, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillText(lv + "  (" + fmtAxis(price) + ")", xl + 4, y - 2);
    });
    ctx.globalAlpha = 0.6; ctx.setLineDash([3, 4]); seg(a, b); ctx.globalAlpha = 1;
  } else if ((t === "long" || t === "short") && b) {
    var yE = a.y, yT = b.y, yS = G.Yp(stopOf(d)), x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x, x0 + 70);
    ctx.globalAlpha = 0.18; ctx.fillStyle = C.up; ctx.fillRect(x0, Math.min(yE, yT), x1 - x0, Math.abs(yT - yE));
    ctx.fillStyle = C.down; ctx.fillRect(x0, Math.min(yE, yS), x1 - x0, Math.abs(yS - yE)); ctx.globalAlpha = 1;
    ctx.lineWidth = 1; [yE, yT, yS].forEach(function (y, k) { ctx.strokeStyle = k === 0 ? col : k === 1 ? C.up : C.down; ctx.beginPath(); ctx.moveTo(x0, Math.round(y) + 0.5); ctx.lineTo(x1, Math.round(y) + 0.5); ctx.stroke(); });
    var gain = d.p2.p - d.p1.p; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.fillStyle = C.ink; ctx.textBaseline = "middle";
    ctx.fillText((t === "long" ? "Long" : "Short") + "  R:R 1:1", x0 + 6, yE + (yT < yE ? 10 : -10));
    ctx.fillText("Target " + fmt(gain, S.sym.dec) + " (" + (gain / d.p1.p * 100).toFixed(2) + "%)", x0 + 6, yT + (yT < yE ? 10 : -10));
    ctx.fillText("Stop " + fmtAxis(stopOf(d)), x0 + 6, yS + (yS > yE ? -10 : 10));
  } else if (NP[t] && d.pts) {
    var pp = d.pts.map(pxOf), LB = PLBL[t] || [];
    ctx.lineJoin = "round"; ctx.beginPath();
    pp.forEach(function (q, k) { if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); });
    ctx.stroke();
    ctx.globalAlpha = 0.08;
    for (i = 2; i < pp.length; i++) { ctx.beginPath(); ctx.moveTo(pp[i - 2].x, pp[i - 2].y); ctx.lineTo(pp[i - 1].x, pp[i - 1].y); ctx.lineTo(pp[i].x, pp[i].y); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.font = "11px " + css("--font-body"); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    pp.forEach(function (q, k) { ctx.beginPath(); ctx.arc(q.x, q.y, 2.5, 0, 6.2832); ctx.fill(); if (LB[k]) ctx.fillText(LB[k], q.x, q.y - 5); });
  }
}
function hitExtra(d, a, b, x, y) {
  var t = d.type, c3 = d.p3 ? pxOf(d.p3) : null, i;
  if (XT[t]) return hitXT(d, a, b, x, y);
  if (t === "arrow") return dSeg(x, y, a, b) < TOL;
  if (t === "brush") { var pp = (d.pts || []).map(pxOf); for (i = 1; i < pp.length; i++) if (dSeg(x, y, pp[i - 1], pp[i]) < TOL) return true; return false; }
  if (t === "ellipse" || t === "fibext") return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x) + 4 && y >= Math.min(a.y, b.y) - 4 && y <= Math.max(a.y, b.y) + 4;
  if (t === "long" || t === "short") { var ys = [a.y, b.y, G.Yp(stopOf(d))], x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x, x0 + 70); return x >= x0 - 4 && x <= x1 + 4 && y >= Math.min.apply(null, ys) - 4 && y <= Math.max.apply(null, ys) + 4; }
  if (t === "channel" && b) { var off = c3 ? channelOff(a, b, c3) : 0; return dSeg(x, y, a, b) < TOL || (c3 && dSeg(x, y, { x: a.x, y: a.y + off }, { x: b.x, y: b.y + off }) < TOL); }
  if (t === "pitch" && b) { if (!c3) return dSeg(x, y, a, b) < TOL; return pitchLines(a, b, c3).some(function (l) { return dSeg(x, y, l[0], l[1]) < TOL; }) || dSeg(x, y, b, c3) < TOL; }
  if (NP[t]) { var ppts = (d.pts || []).map(pxOf); for (i = 1; i < ppts.length; i++) if (dSeg(x, y, ppts[i - 1], ppts[i]) < TOL) return true; return false; }
  if (t === "emoji") return Math.hypot(x - a.x, y - a.y) < 16;
  return false;
}
/* ---------- undo / redo ---------- */
var undoS = [], redoS = [];
function syncUndo() { $("#undoBtn").disabled = !undoS.length; $("#redoBtn").disabled = !redoS.length; }
function snap() { undoS.push(JSON.stringify(S.drawings)); if (undoS.length > 60) undoS.shift(); redoS = []; syncUndo(); }
function undo() { if (!undoS.length) return; redoS.push(JSON.stringify(S.drawings)); S.drawings = JSON.parse(undoS.pop()); S.sel = null; syncSel(); syncUndo(); draw(); save(); }
function redo() { if (!redoS.length) return; undoS.push(JSON.stringify(S.drawings)); S.drawings = JSON.parse(redoS.pop()); S.sel = null; syncSel(); syncUndo(); draw(); save(); }
function finishBrush() {
  var pts = drag.pts; if (pts.length < 3) return;
  snap(); var d = { id: "d" + Date.now().toString(36) + Math.floor(Math.random() * 1e4), type: "brush", p1: pts[0], pts: pts, c: "acc", w: 1.5 };
  (S.drawings[S.sym.id] = S.drawings[S.sym.id] || []).push(d); save();
}
/* ---------- range bar, clock, extras ---------- */
function wireExtras() {
  $("#undoBtn").addEventListener("click", undo); $("#redoBtn").addEventListener("click", redo); syncUndo();
  $("#goLatest").addEventListener("click", function () { S.off = 6; draw(); });
  $("#resetView").addEventListener("click", function () { resetView(); draw(); });
  wireDd($("#gotoBtn"), $("#gotoPop"));
  $("#gotoPop").addEventListener("click", function (e) { e.stopPropagation(); });
  $("#gotoGo").addEventListener("click", function () {
    var v = $("#gotoDate").value;
    if (!v) { toast("Pilih tanggal dulu."); return; }
    if (!bars.length) { toast("Data chart belum termuat. Coba lagi setelah feed aktif."); return; }
    var ts = Math.floor(new Date(v + "T00:00:00Z").getTime() / 1000), bi = 0;
    for (var gi = 0; gi < bars.length; gi++) { if (bars[gi].t <= ts) bi = gi; else break; }
    S.range = null; S.off = bi - (G.nv - 1) + (G.pw * 0.3) / S.barW - 0.5; closeAll(); syncUI(); draw();
  });
  $("#dhint").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.x === "keep") { S.keep = !S.keep; syncUI(); syncDraw(true); save(); } else { S.pend = null; setTool("cursor"); }
  });
  setInterval(function () {
    $("#goLatest").hidden = !(S.off < -3);
    var z = TZS.filter(function (q) { return q[0] === S.tz; })[0] || TZS[0], tx;
    try { tx = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: z[2] }).format(new Date()); } catch (e) { tx = ""; }
    $("#tzClock").textContent = tx + " (" + z[1] + ")";
  }, 1000);
}

function drawOne(d, C, preview) {
  if (d.hide || (d.only && d.only !== S.tf.k)) return;
  drawOne0(d, C, preview);
  if (LINE_T[d.type] && d.p2) { var lc = d.cx || C[d.c || "acc"] || C.acc; ctx.strokeStyle = lc; ctx.fillStyle = lc; ctx.lineWidth = d.w || 1.5; ctx.setLineDash(preview ? [5, 4] : d.ls === 1 ? [7, 5] : d.ls === 2 ? [2, 4] : []); drawLineOpts(d, pxOf(d.p1), pxOf(d.p2), lc, C); ctx.setLineDash([]); }
}
function drawOne0(d, C, preview) {
  var col = d.cx || C[d.c || "acc"] || C.acc, a = pxOf(d.p1), b = d.p2 ? pxOf(d.p2) : null, pw = G.pw;
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = d.w || 1.5; ctx.setLineDash(preview ? [5, 4] : d.ls === 1 ? [7, 5] : d.ls === 2 ? [2, 4] : []);
  if (d.type === "trend" && b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  else if (d.type === "ray" && b) { var e = extendRay(a, b, pw); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(e.x, e.y); ctx.stroke(); }
  else if (d.type === "hline") { ctx.beginPath(); ctx.moveTo(0, a.y); ctx.lineTo(pw, a.y); ctx.stroke(); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
  else if (d.type === "vline") { ctx.beginPath(); ctx.moveTo(a.x, 0); ctx.lineTo(a.x, G.ph); ctx.stroke(); }
  else if (d.type === "hray") { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pw, a.y); ctx.stroke(); ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, 6.3); ctx.fill(); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
  else if (d.type === "cross") { ctx.beginPath(); ctx.moveTo(0, a.y); ctx.lineTo(pw, a.y); ctx.moveTo(a.x, 0); ctx.lineTo(a.x, G.ph); ctx.stroke(); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
  else if (d.type === "extended" && b) { var x0e = extendRay(b, a, pw), x1e = extendRay(a, b, pw); ctx.beginPath(); ctx.moveTo(x0e.x, x0e.y); ctx.lineTo(x1e.x, x1e.y); ctx.stroke(); }
  else if (d.type === "rect" && b) {
    ctx.globalAlpha = d.fo != null ? d.fo : 0.13; ctx.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)); ctx.globalAlpha = 1;
    ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  } else if (d.type === "fib" && b) {
    var xl = Math.min(a.x, b.x), xr = Math.max(a.x, b.x, xl + 90), prevY = null;
    ctx.font = "11px " + css("--font-mono"); ctx.textBaseline = "bottom"; ctx.textAlign = "left";
    FIB.forEach(function (lv, li) {
      var price = d.p2.p + (d.p1.p - d.p2.p) * lv, y = G.Yp(price);
      if (prevY !== null && li % 2 === 1) { ctx.globalAlpha = d.fo != null ? d.fo * 0.55 : 0.07; ctx.fillRect(xl, Math.min(y, prevY), xr - xl, Math.abs(y - prevY)); ctx.globalAlpha = 1; }
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xl, Math.round(y) + 0.5); ctx.lineTo(xr, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillText(lv + "  (" + fmtAxis(price) + ")", xl + 4, y - 2); prevY = y;
    });
    ctx.globalAlpha = 0.6; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.globalAlpha = 1;
  } else if (EXTRA[d.type]) { drawExtra(d, C, preview, a, b);
  } else if (d.type === "emoji") {
    ctx.font = (d.fs || 22) + "px " + css("--font-body"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(d.ch || "\u2B50", a.x, a.y);
  } else if (d.type === "text") {
    ctx.font = "600 " + (d.fs || 13) + "px " + css("--font-body"); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, 6.3); ctx.fill(); ctx.fillText(d.text || "", a.x + 7, a.y + 4);
  }
  ctx.setLineDash([]); ctx.lineWidth = 1;
}
function fmtAxis(p) { return G.mode === "pct" ? ((p / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(p, S.sym.dec); }
function drawMeasure(m, C) {
  var a = pxOf(m.p1), b = pxOf(m.p2), up = m.p2.p >= m.p1.p, col = up ? C.up : C.down;
  ctx.globalAlpha = 0.14; ctx.fillStyle = col; ctx.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)); ctx.globalAlpha = 1;
  ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  var dp = m.p2.p - m.p1.p, nb = Math.round((m.p2.t - m.p1.t) / S.tf.s);
  var l1 = (dp >= 0 ? "+" : "") + fmt(dp, S.sym.dec) + " (" + (dp >= 0 ? "+" : "") + (dp / m.p1.p * 100).toFixed(2) + "%)", l2 = nb + " bars, " + dur(m.p2.t - m.p1.t);
  ctx.font = "12px " + css("--font-mono"); var w = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 16;
  var cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - 38; if (cy < 4) cy = Math.max(a.y, b.y) + 8;
  cx = Math.max(w / 2 + 2, Math.min(G.pw - w / 2 - 2, cx));
  ctx.fillStyle = col; ctx.fillRect(cx - w / 2, cy, w, 34);
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(l1, cx, cy + 10); ctx.fillText(l2, cx, cy + 25);
}
function handlesOf(d) {
  if (THREE[d.type] && d.p3) return [["p1", pxOf(d.p1)], ["p2", pxOf(d.p2)], ["p3", pxOf(d.p3)]];
  if (TWO[d.type] || THREE[d.type]) return [["p1", pxOf(d.p1)], ["p2", pxOf(d.p2)]];
  if (d.type === "hline") return [["body", { x: 18, y: pxOf(d.p1).y }]];
  if (d.type === "hray" || d.type === "cross") return [["p1", pxOf(d.p1)]];
  return [];
}
function drawDrawings(C) {
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, G.pw, G.ph); ctx.clip();
  var list = S.hideD ? [] : (S.drawings[S.sym.id] || []);
  list.forEach(function (d) { drawOne(d, C, false); });
  if (drag && drag.kind === "brush") drawOne({ type: "brush", pts: drag.pts, p1: drag.pts[0], c: "acc", w: 1.5 }, C, true);
  if (S.pend && S.cx !== null && S.cx < G.pw && S.tool !== "text") {
    var p2 = toPt(S.cx, S.cy);
    if (S.pend.type === "measure") drawMeasure({ p1: S.pend.p1, p2: p2 }, C); else if (S.pend.pts) { drawOne({ type: S.pend.type, p1: S.pend.pts[0], pts: S.pend.pts.concat([p2]), c: "acc", w: 1.5 }, C, true); } else { var pdv = S.pend, pv; if (THREE[pdv.type]) pv = pdv.p2 ? { type: pdv.type, p1: pdv.p1, p2: pdv.p2, p3: p2 } : { type: "trend", p1: pdv.p1, p2: p2 }; else pv = { type: pdv.type, p1: pdv.p1, p2: p2 }; pv.c = "acc"; pv.w = 1.5; drawOne(pv, C, true); }
  }
  if (S.meas) drawMeasure(S.meas, C);
  var sel = list.filter(function (d) { return d.id === S.sel; })[0];
  if (sel && !sel.lock) handlesOf(sel).forEach(function (h) { ctx.fillStyle = C.bg; ctx.strokeStyle = sel.cx || C[sel.c || "acc"]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(h[1].x, h[1].y, HR, 0, 6.3); ctx.fill(); ctx.stroke(); });
  ctx.lineWidth = 1;

  /* alerts + position */
  S.alerts.forEach(function (al) {
    if (al.sym !== S.sym.id || !al.active || S.sty.aLn === false) return;
    var y = G.Yp(al.price); ctx.strokeStyle = C.acc; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(G.pw, Math.round(y) + 0.5); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = "11px " + css("--font-mono"); ctx.fillStyle = C.acc; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("Alert", 8, y - 3);
    G.tags.push({ y: y, text: fmtAxis(al.price), bg: C.acc, fg: C.bg });
  });
  var pos = S.acc.pos[S.sym.id];
  if (pos && pos.q) {
    var py = G.Yp(pos.avg), pnl = (curPrice() - pos.avg) * pos.q, pc = pnl >= 0 ? C.up : C.down;
    ctx.strokeStyle = pc; ctx.beginPath(); ctx.moveTo(0, Math.round(py) + 0.5); ctx.lineTo(G.pw, Math.round(py) + 0.5); ctx.stroke();
    var txt = (pos.q > 0 ? "LONG " : "SHORT ") + Math.abs(pos.q) + "  " + (pnl >= 0 ? "+" : "") + fmt(pnl, 2) + " USD";
    ctx.font = "11px " + css("--font-mono"); var tw = ctx.measureText(txt).width + 12;
    ctx.fillStyle = pc; ctx.fillRect(8, py - 17, tw, 16); ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, 14, py - 8.5);
    G.tags.push({ y: py, text: fmtAxis(pos.avg), bg: pc, fg: "#ffffff" });
  }
  ctx.restore();
}

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
/* ---------- sub panes ---------- */
function drawSubs(C) {
  var pw = G.pw, X = G.X, i, v;
  G.subs.forEach(function (k, si) {
    var top = G.mainH + si * G.subH, h = G.subH, padT = 18, ih = h - padT - 4, lo, hi;
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(0, top + 0.5); ctx.lineTo(W, top + 0.5); ctx.stroke();
    if (k.indexOf("cmp") === 0) { drawCmpPane(+k.slice(3), top, h, C); return; }
    if (k.indexOf("x:") === 0) { drawXPane(k.slice(2), top, h, C); return; }
    if (k === "pine") { drawPinePane(top, h, C); return; }
    if (k === "rsi" || k === "stoch") { lo = 0; hi = 100; }
    else if (k === "atr") { var mxa = 1e-9; for (i = G.iL; i <= G.iR; i++) if (ind.atr[i] != null && ind.atr[i] > mxa) mxa = ind.atr[i]; lo = 0; hi = mxa * 1.15; }
    else if (k === "adx") { var mxd = 40; for (i = G.iL; i <= G.iR; i++) [ind.adx[i], ind.pdi[i], ind.mdi[i]].forEach(function (q) { if (q != null && q > mxd) mxd = q; }); lo = 0; hi = mxd * 1.1; }
    else { var m = 1e-9; for (i = G.iL; i <= G.iR; i++) [ind.macd[i], ind.sig[i], ind.hist[i]].forEach(function (q) { if (q != null && Math.abs(q) > m) m = Math.abs(q); }); lo = -m * 1.15; hi = m * 1.15; }
    var Y2 = function (q) { return top + padT + (hi - q) / (hi - lo) * ih; };
    var ticks = k === "rsi" ? [30, 50, 70] : k === "stoch" ? [20, 50, 80] : (function () { var st = niceStep((hi - lo) / 3), o = [], q; for (q = Math.ceil(lo / st) * st; q < hi; q += st) o.push(q); return o; })();
    ctx.save(); ctx.beginPath(); ctx.rect(0, top + 1, pw, h - 1); ctx.clip();
    if (S.grid) { ctx.strokeStyle = C.grid; ticks.forEach(function (t) { var y = Math.round(Y2(t)) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }); }
    if (k === "stoch" || k === "atr" || k === "adx") {
      var sets = k === "stoch" ? [[ind.stK, C.i1], [ind.stD, C.i3]] : k === "atr" ? [[ind.atr, C.i4]] : [[ind.adx, C.i3], [ind.pdi, C.up], [ind.mdi, C.down]];
      if (k === "stoch") { ctx.globalAlpha = 0.07; ctx.fillStyle = C.i1; ctx.fillRect(0, Y2(80), pw, Y2(20) - Y2(80)); ctx.globalAlpha = 1; }
      sets.forEach(function (pr) {
        ctx.strokeStyle = pr[1]; ctx.lineWidth = 1.5; ctx.beginPath(); var st5 = false;
        for (i = G.iL; i <= G.iR; i++) { if (pr[0][i] == null) continue; var y5 = Y2(pr[0][i]); if (!st5) { ctx.moveTo(X(i), y5); st5 = true; } else ctx.lineTo(X(i), y5); }
        ctx.stroke(); ctx.lineWidth = 1;
      });
    } else if (k === "rsi") {
      ctx.globalAlpha = 0.07; ctx.fillStyle = C.i2; ctx.fillRect(0, Y2(70), pw, Y2(30) - Y2(70)); ctx.globalAlpha = 1;
      ctx.strokeStyle = C.i2; ctx.lineWidth = 1.5; ctx.beginPath(); var s = false;
      for (i = G.iL; i <= G.iR; i++) { if (ind.rsi[i] == null) continue; var yy = Y2(ind.rsi[i]); if (!s) { ctx.moveTo(X(i), yy); s = true; } else ctx.lineTo(X(i), yy); }
      ctx.stroke(); ctx.lineWidth = 1;
    } else {
      var zy = Y2(0); ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(0, zy); ctx.lineTo(pw, zy); ctx.stroke(); ctx.globalAlpha = 1;
      for (i = G.iL; i <= G.iR; i++) {
        v = ind.hist[i]; if (v == null) continue; var prev = ind.hist[i - 1];
        ctx.globalAlpha = 0.55; ctx.fillStyle = v >= 0 ? C.up : C.down; var bwid = Math.max(1, G.bw * 0.7);
        ctx.fillRect(X(i) - bwid / 2, Math.min(zy, Y2(v)), bwid, Math.max(1, Math.abs(Y2(v) - zy))); ctx.globalAlpha = 1;
      }
      [[ind.macd, C.i1], [ind.sig, C.i3]].forEach(function (pr) {
        ctx.strokeStyle = pr[1]; ctx.lineWidth = 1.5; ctx.beginPath(); var st = false;
        for (i = G.iL; i <= G.iR; i++) { if (pr[0][i] == null) continue; var y3 = Y2(pr[0][i]); if (!st) { ctx.moveTo(X(i), y3); st = true; } else ctx.lineTo(X(i), y3); }
        ctx.stroke(); ctx.lineWidth = 1;
      });
    }
    ctx.restore();
    G.panes.push({ k: k, top: top, h: h, Y2: Y2, lo: lo, hi: hi, ticks: ticks, padT: padT, ih: ih });
  });
}

function drawCmpPane(ci, top, h, C) {
  var pw = G.pw, padT = 18, ih = h - padT - 4, d = panData[ci], sym = N_(S.cmpP[ci]), col = C["c" + (ci % 3 + 1)], ty = S.cmpT[sym.id] || "line", i, lo = Infinity, hi = -Infinity, lastV = null;
  var ohlc = ty === "candles" || ty === "bars";
  if (d) for (i = G.iL; i <= G.iR; i++) { var cb = d.bars[i]; if (!cb) continue; lastV = cb.c; var a1 = ohlc ? cb.l : cb.c, z1 = ohlc ? cb.h : cb.c; if (a1 < lo) lo = a1; if (z1 > hi) hi = z1; }
  if (!isFinite(lo)) { lo = 0; hi = 1; }
  var pad = (hi - lo) * 0.12 || Math.abs(hi) * 0.001 || 1; lo -= pad; hi += pad;
  var Y2 = function (q) { return top + padT + (hi - q) / (hi - lo) * ih; };
  var st = niceStep((hi - lo) / 3), ticks = [], q;
  for (q = Math.ceil(lo / st) * st; q < hi; q += st) ticks.push(q);
  ctx.save(); ctx.beginPath(); ctx.rect(0, top + 1, pw, h - 1); ctx.clip();
  if (S.grid) { ctx.strokeStyle = C.grid; ticks.forEach(function (t) { var y = Math.round(Y2(t)) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }); }
  if (d) drawSeries(ty, d.bars, Y2, col, C, top + h);
  ctx.restore();
  ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = col;
  ctx.fillText(sym.label + (lastV != null ? "  " + fmt(lastV, sym.dec) : "  loading"), 8, top + 10);
  ctx.font = "11px " + css("--font-mono");
  G.panes.push({ k: "cmp" + ci, top: top, h: h, Y2: Y2, lo: lo, hi: hi, ticks: ticks, padT: padT, ih: ih, dec: sym.dec });
}
function drawPinePane(top, h, C) {
  var pw = G.pw, X = G.X, padT = 18, ih = h - padT - 4, i, lo = Infinity, hi = -Infinity;
  for (i = G.iL; i <= G.iR; i++) pineOut.plots.forEach(function (p) { var v = p.data[i]; if (v != null) { if (v < lo) lo = v; if (v > hi) hi = v; } });
  pineOut.hlines.forEach(function (hl) { if (hl.value != null) { if (hl.value < lo) lo = hl.value; if (hl.value > hi) hi = hl.value; } });
  if (!isFinite(lo)) { lo = 0; hi = 1; }
  var pad = (hi - lo) * 0.12 || Math.abs(hi) * 0.001 || 1; lo -= pad; hi += pad;
  var Y2 = function (q) { return top + padT + (hi - q) / (hi - lo) * ih; };
  var st = niceStep((hi - lo) / 3), ticks = [], q;
  for (q = Math.ceil(lo / st) * st; q < hi; q += st) ticks.push(q);
  ctx.save(); ctx.beginPath(); ctx.rect(0, top + 1, pw, h - 1); ctx.clip();
  if (S.grid) { ctx.strokeStyle = C.grid; ticks.forEach(function (t) { var y = Math.round(Y2(t)) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); }); }
  pineOut.hlines.forEach(function (hl) {
    if (hl.value == null) return; var y = Math.round(Y2(hl.value)) + 0.5;
    ctx.setLineDash([5, 4]); ctx.strokeStyle = hl.color; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pw, y); ctx.stroke(); ctx.setLineDash([]);
  });
  pineOut.plots.forEach(function (p) {
    ctx.strokeStyle = p.color; ctx.lineWidth = p.width; ctx.beginPath(); var s = false;
    for (i = G.iL; i <= G.iR; i++) { var v = p.data[i]; if (v == null) continue; var y2 = Y2(v); if (!s) { ctx.moveTo(X(i), y2); s = true; } else ctx.lineTo(X(i), y2); }
    ctx.stroke(); ctx.lineWidth = 1;
  });
  ctx.restore();
  ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
  var tx = 8, names = pineOut.plots.map(function (p) { return p.name; }).join("  ·  ");
  ctx.fillStyle = C.muted; ctx.fillText(pineOut.title + (names ? "   " + names : ""), tx, top + 10);
  ctx.font = "11px " + css("--font-mono");
  G.panes.push({ k: "pine", top: top, h: h, Y2: Y2, lo: lo, hi: hi, ticks: ticks, padT: padT, ih: ih, dec: 2 });
}

/* ---------- axes, crosshair, orchestrator ---------- */
function tagBox(text, x, y, w, bg, fg) {
  ctx.fillStyle = bg; ctx.fillRect(x, y - 9, w, 18);
  ctx.fillStyle = fg; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x + 6, y + 0.5);
}
function drawPos(C) {
  var ps = S.acc.pos[S.sym.id]; if (!ps || S.sty.tPos === false) return;
  var y = G.Yp(ps.avg); if (!(y > T && y < G.mainH)) return;
  var pnl = (curPrice() - ps.avg) * ps.q, col = pnl >= 0 ? C.up : C.down, txt = (ps.q > 0 ? "LONG " : "SHORT ") + Math.abs(ps.q) + "  " + (pnl >= 0 ? "+" : "") + fmt(pnl, 2);
  ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(G.pw, Math.round(y) + 0.5); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = "600 11px " + css("--font-mono"); var w = ctx.measureText(txt).width + 14; ctx.fillStyle = col; ctx.fillRect(10, y - 9, w, 18);
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, 17, y + 0.5); ctx.restore();
  G.tags.push({ y: y, text: fmt(ps.avg, S.sym.dec), bg: col, fg: "#ffffff" });
}
function draw() {
  if (!bars.length || !ctx) return;
  var C = colors(); geom();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  if (S.sty.wm !== false && G.pw > 200) {
    ctx.save(); ctx.globalAlpha = 0.055; ctx.fillStyle = C.muted; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "700 " + Math.max(26, Math.min(64, G.pw / 11)) + "px " + css("--font-body");
    ctx.fillText(S.sym.label, G.pw / 2, T + G.mainH / 2); ctx.restore();
  }
  ctx.font = "11px " + css("--font-mono");
  var pw = G.pw, ph = G.ph, i;
  drawMain(C); drawDrawings(C); drawPos(C); drawSubs(C);
  if (S.replay.on && S.replay.pick) {
    var pi = S.replay.idx, px = Math.round(G.X(pi)) + 0.5;
    if (px < pw) { ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = C.bg; ctx.fillRect(px, 0, pw - px, ph); ctx.restore(); }
    ctx.strokeStyle = C.acc; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, ph); ctx.stroke(); ctx.lineWidth = 1;
    ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
    tagBox("Replay starts here. Tap or drag to move", Math.max(4, Math.min(pw - 176, px - 88)), 16, 172, C.acc, "#ffffff");
  }

  /* axis column + time row */
  ctx.fillStyle = C.bg; ctx.fillRect(pw, 0, R, H); ctx.fillRect(0, ph, W, B);
  ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(pw + 0.5, 0); ctx.lineTo(pw + 0.5, ph + 0.5); ctx.lineTo(0, ph + 0.5); ctx.stroke();
  ctx.font = "11px " + css("--font-mono"); ctx.fillStyle = C.muted; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  G.ticks.forEach(function (t) { if (t.y > T + 4 && t.y < G.mainH - 6) ctx.fillText(t.label, pw + 7, t.y); });
  G.panes.forEach(function (p) {
    ctx.fillStyle = C.muted; ctx.textAlign = "left";
    p.ticks.forEach(function (t) { var y = p.Y2(t); if (y > p.top + 14 && y < p.top + p.h - 4) ctx.fillText(p.dec != null ? fmt(t, p.dec) : p.k === "rsi" ? String(t) : t.toFixed(2), pw + 7, y); });
  });
  ctx.fillStyle = C.muted; ctx.textAlign = "center";
  G.tlabels.forEach(function (t) { if (t[0] > 24 && t[0] < pw - 24) ctx.fillText(t[1], t[0], ph + B / 2 + 1); });
  /* economic / corporate event markers on the time axis */
  if (S.events && evs.length) {
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "600 9px " + css("--font-body");
    evs.forEach(function (ev) {
      var x = G.X(ev.i); if (x < 12 || x > pw - 12) return;
      ctx.fillStyle = ev.imp === "h" ? C.down : ev.imp === "m" ? C.i3 : C.muted;
      ctx.beginPath(); ctx.arc(x, ph + B / 2 + 1, 7, 0, 6.3); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.fillText(ev.code, x, ph + B / 2 + 1.5);
    });
  }
  G.tags.forEach(function (t) { if (t.text) tagBox(t.text, pw + 1, Math.max(T + 9, Math.min(G.mainH - 9, t.y)), R - 1, t.bg, t.fg); });

  /* crosshair */
  var hovIdx = G.nv - 1;
  if (S.cx !== null && S.cx < pw && S.cy !== null && S.cy < ph && !(S.pend && S.pend.down)) {
    var fi = G.fiAtX(S.cx), idx = Math.round(fi); hovIdx = Math.max(0, Math.min(G.nv - 1, idx));
    var sx = Math.round(G.X(idx)) + 0.5;
    ctx.setLineDash(S.sty.cls === 1 ? [] : S.sty.cls === 2 ? [1, 3] : [3, 4]); ctx.strokeStyle = C.cross || C.muted;
    var ct0 = S.tool === "cursor" ? S.curType : "cross";
    if (ct0 === "dot") { ctx.setLineDash([]); ctx.fillStyle = C.cross || C.muted; ctx.beginPath(); ctx.arc(sx, Math.round(S.cy) + 0.5, 3.5, 0, 6.2832); ctx.fill(); }
    else if (ct0 !== "arrow") { ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, ph); ctx.moveTo(0, Math.round(S.cy) + 0.5); ctx.lineTo(pw, Math.round(S.cy) + 0.5); ctx.stroke(); }
    ctx.setLineDash([]);
    var label = null;
    if (S.cy < G.mainH) { var pr = G.Pinv(S.cy); label = G.mode === "pct" ? ((pr / G.ref0 - 1) * 100).toFixed(2) + "%" : fmt(pr, S.sym.dec); }
    else G.panes.forEach(function (p) { if (S.cy >= p.top && S.cy < p.top + p.h) { var vv = p.hi - (S.cy - p.top - p.padT) / p.ih * (p.hi - p.lo); label = p.dec != null ? fmt(vv, p.dec) : vv.toFixed(2); } });
    ctx.font = "11px " + css("--font-mono");
    if (label) tagBox(label, pw + 1, S.cy, R - 1, C.tag, C.tagInk);
    var tl = fullTime(iToT(idx)), tw = ctx.measureText(tl).width + 14, tx = Math.max(0, Math.min(pw - tw, sx - tw / 2));
    ctx.fillStyle = C.tag; ctx.fillRect(tx, ph + 2, tw, 20); ctx.fillStyle = C.tagInk; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tl, tx + 7, ph + 12);
  }
  G.hovIdx = hovIdx; paintReadout(hovIdx, C);
}
var legendHtml = null;
function paintReadout(i, C) {
  var b = bars[i], d = S.sym.dec, up = b.c >= b.o, cls = up ? "up" : "down", ch = b.c - b.o;
  $("#readout").innerHTML = "<span>O<b>" + fmt(b.o, d) + "</b></span><span>H<b>" + fmt(b.h, d) + "</b></span><span>L<b>" + fmt(b.l, d) + "</b></span><span>C<b class=\"" + cls + "\">" + fmt(b.c, d) + "</b></span>" +
    "<span>Chg<b class=\"" + cls + "\">" + (ch >= 0 ? "+" : "") + fmt(ch, d) + " (" + (ch >= 0 ? "+" : "") + (ch / b.o * 100).toFixed(2) + "%)</b></span><span>Vol<b>" + b.v.toLocaleString("en-US") + "</b></span>" +
    "<span class=\"when\">" + S.sym.label + " &middot; " + S.tf.k + " &middot; " + fullTime(b.t) + "</span>";
  var h = "", v = function (a, dd) { return a[i] == null ? "&ndash;" : a[i].toFixed(dd == null ? d : dd); };
  var item = function (col, name, val) { return "<span class=\"chip\" style=\"color:" + col + hidSt(name) + "\">" + name + " <b style=\"font-weight:500\">" + val + "</b><span class=\"lt\">" + ltools(name) + "</span></span>"; };
  if (S.ind.sma) h += item(C.i1, "SMA " + S.len.sma, v(ind.sma)); if (S.ind.ema) h += item(C.i2, "EMA " + S.len.ema, v(ind.ema));
  if (S.ind.bb) h += item(C.i3, "BB", v(ind.bbL) + " / " + v(ind.bbU)); if (S.ind.vwap) h += item(C.i4, "VWAP", v(ind.vwap));
  if (S.ind.rsi) h += item(C.i2, "RSI " + S.len.rsi, v(ind.rsi, 1));
  if (S.ind.stoch) h += item(C.i1, "Stoch " + S.len.stoch, v(ind.stK, 1) + " / " + v(ind.stD, 1)); if (S.ind.atr) h += item(C.i4, "ATR " + S.len.atr, v(ind.atr));
  if (S.ind.adx) h += item(C.i3, "ADX " + S.len.adx, v(ind.adx, 1)); if (S.ind.st) h += item(C.i3, "Supertrend", v(ind.st)); if (S.ind.ichi) h += item(C.i1, "Ichimoku", v(ind.tenkan) + " / " + v(ind.kijun));
  if (S.ind.macd) h += item(C.i1, "MACD", v(ind.macd, 2) + " / " + v(ind.sig, 2));
  h += xLegend(i);
  cmpData.forEach(function (c, ci) { var cb = c.bars[i]; if (cb) h += item(C["c" + (ci + 1)], c.sym.label, fmt(cb.c, c.sym.dec)); });
  if (h !== legendHtml) { $("#legend").innerHTML = h; legendHtml = h; }
}

/* ---------- tools rail ---------- */
var ICONS = {
  dotcur: "<circle cx='11' cy='11' r='2.6' fill='currentColor'/>", arrowcur: "<path d='M6 4l10 7-4.5 1.2L9.5 17z'/>",
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
var TN = { dotcur: "Dot", arrowcur: "Arrow", cursor: "Cross cursor", eraser: "Eraser", trend: "Trend line", ray: "Ray", extended: "Extended line", arrow: "Arrow", hline: "Horizontal line", hray: "Horizontal ray", vline: "Vertical line", cross: "Cross line", channel: "Parallel channel", pitch: "Andrews pitchfork", fib: "Fib retracement", fibext: "Fib extension", rect: "Rectangle", ellipse: "Ellipse", brush: "Brush", long: "Long position", short: "Short position", measure: "Measure", text: "Text note", emoji: "Icon", xabcd: "XABCD pattern", abcd: "ABCD pattern", triangle: "Triangle pattern", hs: "Head and shoulders", elliott: "Elliott impulse wave", drives: "Three drives" };
var TK = { cursor: "Esc", trend: "Alt+T", hline: "Alt+H", vline: "Alt+V", hray: "Alt+J", fib: "Alt+F", rect: "Alt+Shift+R", cross: "Alt+C", eraser: "Alt+E" };
var EMOJIS = ["\u2B50", "\uD83D\uDE80", "\uD83D\uDCC8", "\uD83D\uDCC9", "\uD83D\uDCB0", "\uD83D\uDC02", "\uD83D\uDC3B", "\u26A0\uFE0F", "\uD83D\uDD25", "\u2764\uFE0F", "\uD83D\uDC4D", "\uD83D\uDC4E", "\uD83C\uDFC6", "\uD83C\uDFAF", "\uD83D\uDC8E", "\u2753"];
var GROUPS = [
  { id: "cur", name: "Cursors", tools: ["cursor", "dotcur", "arrowcur", "eraser"] },
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
var HINTS = { dotcur: "Dot cursor: selects and moves drawings.", arrowcur: "Arrow cursor: selects and moves drawings.", eraser: "Click or tap a drawing to erase it.", extended: "Click the first point, then a second point. The line extends both ways.", hray: "Click to place a horizontal ray that runs to the right.", cross: "Click to place a cross line (horizontal and vertical).", arrow: "Click the tail, then the head.", channel: "Click two points for the trend, then a third to set the channel width.", pitch: "Click the pivot, then the two swing points.", ellipse: "Click one corner, then the opposite corner.", fibext: "Click the swing start, then the swing end.", long: "Click the entry, then the target. Stop is mirrored (1:1).", short: "Click the entry, then the target. Stop is mirrored (1:1).", brush: "Press and drag to draw freehand.", cursor: "Drag to pan, pinch or scroll to zoom, double-click or double-tap a drawing, indicator or candle for its settings (empty area: chart settings). Tap a drawing to select it. Right-click or press and hold for chart actions.", trend: "Click the start point, then click the end point.", ray: "Click the start point, then a second point to set direction.",
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
    else if (b.id === "magnet") { if (!S.magnet) { S.magnet = true; S.magStr = "weak"; } else if (S.magStr !== "strong") S.magStr = "strong"; else S.magnet = false; toast(S.magnet ? "Magnet: " + (S.magStr === "strong" ? "kuat (selalu snap ke OHLC)" : "lemah (snap bila dekat OHLC)") : "Magnet mati"); syncUI(); save(); }
    else if (b.id === "zoomIn") { if (G.pw) { zoomAt(G.pw / 2, S.barW * 1.3); draw(); } }
    else if (b.id === "zoomOut") { if (G.pw) { zoomAt(G.pw / 2, S.barW / 1.3); draw(); } }
    else if (b.id === "keepBtn") { S.keep = !S.keep; syncUI(); syncDraw(true); save(); toast(S.keep ? "Stay in drawing mode is on. The tool stays selected after each drawing." : "Stay in drawing mode is off."); }
    else if (b.id === "lockDr") { var dl = S.drawings[S.sym.id] || []; if (!dl.length) { toast("Belum ada gambar di " + S.sym.label + "."); return; } var lk = dl.some(function (d) { return !d.lock; }); dl.forEach(function (d) { d.lock = lk; }); b.setAttribute("aria-pressed", String(lk)); S.sel = null; syncSel(); draw(); save(); toast(lk ? "Semua gambar dikunci." : "Kunci gambar dibuka."); }
    else if (b.id === "hideDr") { S.hideD = !S.hideD; syncUI(); draw(); }
    else if (b.id === "clearD") { snap(); S.drawings[S.sym.id] = []; S.sel = null; S.meas = null; syncSel(); draw(); save(); toast("Removed all drawings on " + S.sym.label); }
  });
  $("#fly").addEventListener("click", function (e) { e.stopPropagation(); var eb = e.target.closest("button[data-e]"); if (eb) { S.emojiCh = eb.dataset.e; setTool("emoji"); save(); return; } var b = e.target.closest("button[data-t]"); if (!b) return; if (b.dataset.t === "cursor") S.curType = "cross"; setTool(b.dataset.t); });
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
    var c = g.id === "cur" ? (S.tool === "eraser" ? "eraser" : S.curType === "dot" ? "dotcur" : S.curType === "arrow" ? "arrowcur" : "cursor") : grpCur(g), on = g.tools.indexOf(S.tool) >= 0, tip = TN[c] + (TK[c] ? " (" + TK[c] + ")" : "") + (g.tools.length > 1 ? ". Tap the corner or press and hold for more " + g.name.toLowerCase() : "");
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
  if (t === "dotcur" || t === "arrowcur") { S.curType = t === "dotcur" ? "dot" : "arrow"; t = "cursor"; }
  S.tool = t; S.pend = null; hideTxt(); hideFly(); var g = grpOfTool(t); if (g && g.id !== "cur") S.gcur[g.id] = t;
  $("#hint").textContent = HINTS[t]; cv.style.cursor = t === "eraser" ? "cell" : (t === "cursor" && S.curType && S.curType !== "cross") ? "default" : "crosshair"; syncUI(); syncDraw(true); draw(); save();
}
function doneTool() { if (S.keep) { S.pend = null; hideTxt(); syncDraw(true); draw(); } else setTool("cursor"); }

/* ---------- coordinate helpers + hit testing ---------- */
function pos(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function toPt(x, y) {
  var fi = G.fiAtX(x), p = G.Pinv(Math.min(y, G.mainH));
  if (S.magnet) {
    var i = Math.max(0, Math.min(bars.length - 1, Math.round(fi))), b = bars[i], best = b.c, bd = 1e18; fi = i;
    [b.o, b.h, b.l, b.c].forEach(function (v) { var d = Math.abs(G.Yp(v) - y); if (d < bd) { bd = d; best = v; } }); if (S.magStr === "strong" || bd <= 24) p = best;
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
    if (S.tool === "text" || XTXT[S.tool]) { showTxt(x, y, pt); return; }
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
function deleteSel() { if (!S.sel) return; snap(); S.drawings[S.sym.id] = (S.drawings[S.sym.id] || []).filter(function (d) { return d.id !== S.sel; }); S.sel = null; syncSel(); draw(); save(); }
var txtPt = null;
function showTxt(x, y, pt) { var el = $("#txtIn"); txtPt = pt; el.value = ""; el.style.left = Math.min(x, W - 180) + "px"; el.style.top = y + "px"; el.hidden = false; setTimeout(function () { el.focus(); }, 0); }
function hideTxt() { $("#txtIn").hidden = true; txtPt = null; }
$("#txtIn").addEventListener("keydown", function (e) {
  if (e.key === "Enter") { var v = this.value.trim(), p = txtPt; hideTxt(); if (v && p) { var d = { id: "d" + Date.now().toString(36), type: XTXT[S.tool] ? S.tool : "text", p1: p, text: v, c: "acc", w: 1.5 }; snap(); (S.drawings[S.sym.id] = S.drawings[S.sym.id] || []).push(d); S.sel = d.id; doneTool(); syncSel(); save(); } else setTool("cursor"); }
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

var XT = { angle: 1, infoline: 1, regr: 1, fibtz: 1, fibfan: 1, fibcirc: 1, gannbox: 1, daterange: 1, pricerange: 1, dprange: 1, circle: 1, pricelabel: 1, flag: 1, arrowup: 1, arrowdown: 1 };
var XT1 = { pricelabel: 1, flag: 1, arrowup: 1, arrowdown: 1 };
Object.keys(XT).forEach(function (k) { EXTRA[k] = 1; if (XT1[k]) ONE[k] = 1; else TWO[k] = 1; });
Object.assign(ICONS, {
  angle: "<path d='M4 17h14M4 17L16 6'/><path d='M10 17a6 6 0 0 0-2-4.5' />", infoline: "<path d='M4 17L17 6'/><rect x='9' y='11' width='9' height='6' rx='1'/>",
  regr: "<path d='M3 15L19 7'/><path d='M3 11L19 3M3 19L19 11' stroke-dasharray='2 2'/>", fibtz: "<path d='M4 4v14M7 4v14M11 4v14M18 4v14'/>",
  fibfan: "<path d='M4 18L19 4M4 18L19 9M4 18L19 14'/>", fibcirc: "<circle cx='11' cy='11' r='3'/><circle cx='11' cy='11' r='6'/><circle cx='11' cy='11' r='9'/>",
  gannbox: "<rect x='4' y='4' width='14' height='14'/><path d='M4 18L18 4M4 11h14M11 4v14'/>", daterange: "<path d='M5 4v14M17 4v14M5 11h12M8 8l-3 3 3 3M14 8l3 3-3 3'/>",
  pricerange: "<path d='M4 5h14M4 17h14M11 5v12M8 8l3-3 3 3M8 14l3 3 3-3'/>", dprange: "<rect x='4' y='5' width='14' height='12'/><path d='M11 5v12M4 11h14'/>",
  circle: "<circle cx='11' cy='11' r='7'/>", pricelabel: "<path d='M3 11l4-4h12v8H7z'/>", flag: "<path d='M6 19V4M6 5h11l-3 3.5 3 3.5H6'/>",
  arrowup: "<path d='M11 19V6M5 12l6-6 6 6'/>", arrowdown: "<path d='M11 3v13M5 10l6 6 6-6'/>"
});
Object.assign(TN, { angle: "Trend angle", infoline: "Info line", regr: "Regression trend", fibtz: "Fib time zones", fibfan: "Fib speed resistance fan", fibcirc: "Fib circles", gannbox: "Gann box",
  daterange: "Date range", pricerange: "Price range", dprange: "Date and price range", circle: "Circle", pricelabel: "Price label", flag: "Flag mark", arrowup: "Arrow mark up", arrowdown: "Arrow mark down" });
function addTools(gid, list) { var g = grpById(gid); list.forEach(function (t) { if (g.tools.indexOf(t) < 0) g.tools.push(t); }); }
addTools("lines", ["angle", "infoline", "regr"]); addTools("fib", ["fibtz", "fibfan", "fibcirc", "gannbox"]);
addTools("fore", ["daterange", "pricerange", "dprange"]); addTools("shape", ["circle"]); addTools("note", ["pricelabel", "flag", "arrowup", "arrowdown"]);

function xtBox(txt, x, y, col) { ctx.font = "11px " + css("--font-mono"); var w = ctx.measureText(txt).width + 12; x = Math.max(2, Math.min(G.pw - w - 2, x)); ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillRect(x, y, w, 18); ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, x + 6, y + 9.5); ctx.restore(); }
function xtDelta(d) { var dp = d.p2.p - d.p1.p, nb = Math.round((d.p2.t - d.p1.t) / S.tf.s); return { dp: dp, pc: dp / d.p1.p * 100, nb: nb, dt: d.p2.t - d.p1.t }; }
function drawXT(d, C, a, b, col) {
  if (XT2[d.type]) { drawXT2(d, C, a, b, col); return; }
  var t = d.type, pw = G.pw, ph = G.ph, dd = b ? xtDelta(d) : null, i, up = dd ? dd.dp >= 0 : true, sc = up ? C.up : C.down;
  function seg(p, q) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  function dot(p) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 6.2832); ctx.fill(); }
  if (t === "angle" && b) {
    seg(a, b); dot(a); ctx.setLineDash([3, 4]); seg(a, { x: Math.max(a.x, b.x) + 40, y: a.y }); ctx.setLineDash([]);
    var ang = -Math.atan2(b.y - a.y, b.x - a.x), deg = ang * 180 / Math.PI, dir = b.x >= a.x;
    ctx.beginPath(); ctx.arc(a.x, a.y, 28, dir ? 0 : Math.PI, dir ? -ang : Math.PI - ang, (dir ? ang > 0 : ang < 0) !== !dir); ctx.stroke();
    xtBox(Math.abs(deg).toFixed(1) + "\u00B0", b.x + 8, b.y - 9, col);
  } else if (t === "infoline" && b) {
    seg(a, b); dot(a); dot(b);
    xtBox((dd.dp >= 0 ? "+" : "") + fmt(dd.dp, S.sym.dec) + " (" + (dd.pc >= 0 ? "+" : "") + dd.pc.toFixed(2) + "%)  " + dd.nb + " bars, " + dur(dd.dt), (a.x + b.x) / 2 - 60, Math.min(a.y, b.y) - 26, sc);
  } else if (t === "regr" && b) {
    var i1 = Math.max(0, Math.round(Math.min(tToI(d.p1.t), tToI(d.p2.t)))), i2 = Math.min(bars.length - 1, Math.round(Math.max(tToI(d.p1.t), tToI(d.p2.t)))), n = i2 - i1 + 1;
    if (n < 3) { seg(a, b); return; }
    var sx = 0, sy = 0, sxy = 0, sxx = 0; for (i = 0; i < n; i++) { var y = bars[i1 + i].c; sx += i; sy += y; sxy += i * y; sxx += i * i; }
    var sl = (n * sxy - sx * sy) / ((n * sxx - sx * sx) || 1), ic = (sy - sl * sx) / n, sd = 0; for (i = 0; i < n; i++) { var r = bars[i1 + i].c - (ic + sl * i); sd += r * r; } sd = Math.sqrt(sd / n);
    var P = function (k, off) { return { x: G.X(i1 + k), y: G.Yp(ic + sl * k + off) }; };
    ctx.globalAlpha = 0.08; ctx.beginPath(); ctx.moveTo(P(0, 2 * sd).x, P(0, 2 * sd).y); ctx.lineTo(P(n - 1, 2 * sd).x, P(n - 1, 2 * sd).y); ctx.lineTo(P(n - 1, -2 * sd).x, P(n - 1, -2 * sd).y); ctx.lineTo(P(0, -2 * sd).x, P(0, -2 * sd).y); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    seg(P(0, 0), P(n - 1, 0)); ctx.setLineDash([5, 4]); seg(P(0, 2 * sd), P(n - 1, 2 * sd)); seg(P(0, -2 * sd), P(n - 1, -2 * sd)); ctx.setLineDash([]);
  } else if (t === "fibtz" && b) {
    var dx = b.x - a.x, L = [0, 1, 2, 3, 5, 8, 13, 21, 34]; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "top";
    L.forEach(function (f) { var x = a.x + dx * f; if (x < -10 || x > pw + 10) return; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, ph); ctx.stroke(); ctx.fillText(String(f), x + 3, 4); });
    ctx.globalAlpha = 0.6; ctx.setLineDash([3, 4]); seg(a, { x: b.x, y: a.y }); ctx.globalAlpha = 1; ctx.setLineDash([]);
  } else if (t === "fibfan" && b) {
    ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.25, 0.382, 0.5, 0.618, 0.75, 1].forEach(function (r) { var tp = { x: b.x, y: a.y + (b.y - a.y) * r }, e = extendRay(a, tp, pw); ctx.lineWidth = r === 1 ? 1.5 : 1; seg(a, e); ctx.fillText(String(r), Math.min(pw - 28, b.x + 4), tp.y - 2); });
    ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg({ x: b.x, y: a.y }, b); ctx.globalAlpha = 1; ctx.setLineDash([]);
  } else if (t === "fibcirc" && b) {
    var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2, R0 = Math.hypot(b.x - a.x, b.y - a.y) / 2; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.382, 0.5, 0.618, 1, 1.618].forEach(function (r) { ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R0 * r, 0, 6.2832); ctx.stroke(); ctx.fillText(String(r), cx + R0 * r + 3, cy - 2); });
    ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.globalAlpha = 1; ctx.setLineDash([]);
  } else if (t === "gannbox" && b) {
    var gx = Math.min(a.x, b.x), gy = Math.min(a.y, b.y), gw = Math.abs(b.x - a.x), gh = Math.abs(b.y - a.y);
    ctx.globalAlpha = 0.06; ctx.fillRect(gx, gy, gw, gh); ctx.globalAlpha = 1; ctx.strokeRect(gx, gy, gw, gh); ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(function (r) { ctx.beginPath(); ctx.moveTo(gx + gw * r, gy); ctx.lineTo(gx + gw * r, gy + gh); ctx.moveTo(gx, gy + gh * r); ctx.lineTo(gx + gw, gy + gh * r); ctx.stroke(); });
    ctx.globalAlpha = 0.7; seg({ x: gx, y: gy }, { x: gx + gw, y: gy + gh }); seg({ x: gx, y: gy + gh }, { x: gx + gw, y: gy }); ctx.globalAlpha = 1;
  } else if (t === "daterange" && b) {
    var x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), my = (a.y + b.y) / 2;
    ctx.globalAlpha = 0.09; ctx.fillRect(x0, 0, x1 - x0, ph); ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(Math.round(x0) + 0.5, 0); ctx.lineTo(Math.round(x0) + 0.5, ph); ctx.moveTo(Math.round(x1) + 0.5, 0); ctx.lineTo(Math.round(x1) + 0.5, ph); ctx.stroke();
    seg({ x: x0, y: my }, { x: x1, y: my }); ctx.beginPath(); ctx.moveTo(x1 - 6, my - 4); ctx.lineTo(x1, my); ctx.lineTo(x1 - 6, my + 4); ctx.stroke();
    xtBox(Math.abs(dd.nb) + " bars, " + dur(Math.abs(dd.dt)), (x0 + x1) / 2 - 50, my - 26, col);
  } else if (t === "pricerange" && b) {
    var y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y), xa = Math.min(a.x, b.x), xb = Math.max(a.x, b.x, xa + 80), mx = (xa + xb) / 2;
    ctx.globalAlpha = 0.09; ctx.fillRect(xa, y0, xb - xa, y1 - y0); ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(xa, Math.round(y0) + 0.5); ctx.lineTo(xb, Math.round(y0) + 0.5); ctx.moveTo(xa, Math.round(y1) + 0.5); ctx.lineTo(xb, Math.round(y1) + 0.5); ctx.stroke();
    seg({ x: mx, y: y1 }, { x: mx, y: y0 }); ctx.beginPath(); ctx.moveTo(mx - 4, y0 + 6); ctx.lineTo(mx, y0); ctx.lineTo(mx + 4, y0 + 6); ctx.stroke();
    xtBox((dd.dp >= 0 ? "+" : "") + fmt(dd.dp, S.sym.dec) + " (" + (dd.pc >= 0 ? "+" : "") + dd.pc.toFixed(2) + "%)", mx - 50, (y0 + y1) / 2 - 9, col);
  } else if (t === "dprange" && b) {
    var rx = Math.min(a.x, b.x), ry = Math.min(a.y, b.y), rw = Math.abs(b.x - a.x), rh = Math.abs(b.y - a.y);
    ctx.globalAlpha = 0.1; ctx.fillStyle = sc; ctx.fillRect(rx, ry, rw, rh); ctx.globalAlpha = 1; ctx.strokeStyle = sc; ctx.strokeRect(rx, ry, rw, rh);
    xtBox((dd.dp >= 0 ? "+" : "") + fmt(dd.dp, S.sym.dec) + " (" + (dd.pc >= 0 ? "+" : "") + dd.pc.toFixed(2) + "%), " + Math.abs(dd.nb) + " bars, " + dur(Math.abs(dd.dt)), rx + rw / 2 - 90, ry - 22 < 2 ? ry + rh + 4 : ry - 22, sc);
  } else if (t === "circle" && b) {
    var rr = Math.hypot(b.x - a.x, b.y - a.y); ctx.beginPath(); ctx.arc(a.x, a.y, rr, 0, 6.2832); ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); dot(a);
  } else if (t === "pricelabel") {
    var txt = fmtAxis(d.p1.p); ctx.font = "600 11px " + css("--font-mono"); var tw = ctx.measureText(txt).width + 14;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + 7, a.y - 9); ctx.lineTo(a.x + 7 + tw, a.y - 9); ctx.lineTo(a.x + 7 + tw, a.y + 9); ctx.lineTo(a.x + 7, a.y + 9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(txt, a.x + 14, a.y + 0.5);
  } else if (t === "flag") {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, a.y - 30); ctx.stroke(); ctx.beginPath(); ctx.moveTo(a.x, a.y - 30); ctx.lineTo(a.x + 20, a.y - 30); ctx.lineTo(a.x + 14, a.y - 23); ctx.lineTo(a.x + 20, a.y - 16); ctx.lineTo(a.x, a.y - 16); ctx.closePath(); ctx.fill(); dot(a);
  } else if (t === "arrowup" || t === "arrowdown") {
    var s = t === "arrowup" ? 1 : -1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x - 9, a.y + 11 * s); ctx.lineTo(a.x - 3.5, a.y + 11 * s); ctx.lineTo(a.x - 3.5, a.y + 24 * s); ctx.lineTo(a.x + 3.5, a.y + 24 * s); ctx.lineTo(a.x + 3.5, a.y + 11 * s); ctx.lineTo(a.x + 9, a.y + 11 * s); ctx.closePath(); ctx.fill();
  }
}
function hitXT(d, a, b, x, y) {
  if (XT2[d.type]) return hitXT2(d, a, b, x, y);
  var t = d.type;
  if (XT1[t]) { if (t === "pricelabel") return x >= a.x - 4 && x <= a.x + 90 && y >= a.y - 11 && y <= a.y + 11; if (t === "flag") return x >= a.x - 6 && x <= a.x + 24 && y >= a.y - 34 && y <= a.y + 4; return Math.abs(x - a.x) < 12 && y >= Math.min(a.y, a.y + (t === "arrowup" ? 26 : -26)) - 2 && y <= Math.max(a.y, a.y + (t === "arrowup" ? 26 : -26)) + 2; }
  if (!b) return false;
  if (t === "angle" || t === "infoline" || t === "regr") return dSeg(x, y, a, b) < TOL;
  if (t === "circle") return Math.hypot(x - a.x, y - a.y) <= Math.hypot(b.x - a.x, b.y - a.y) + 4;
  if (t === "fibtz") { var dx = b.x - a.x; return [0, 1, 2, 3, 5, 8, 13, 21, 34].some(function (f) { return Math.abs(x - (a.x + dx * f)) < TOL; }); }
  if (t === "fibfan") return [0.25, 0.382, 0.5, 0.618, 0.75, 1].some(function (r) { return dSeg(x, y, a, extendRay(a, { x: b.x, y: a.y + (b.y - a.y) * r }, G.pw)) < TOL; });
  if (t === "fibcirc") { var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2, R0 = Math.hypot(b.x - a.x, b.y - a.y) / 2, dd = Math.hypot(x - cx, y - cy); return [0.382, 0.5, 0.618, 1, 1.618].some(function (r) { return Math.abs(dd - R0 * r) < TOL; }); }
  if (t === "daterange") return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x) + 4;
  return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x, Math.min(a.x, b.x) + 80) + 4 && y >= Math.min(a.y, b.y) - 4 && y <= Math.max(a.y, b.y) + 4;
}

/* ===== gelombang 2 ===== */
var XT2 = { flattop: 1, schiff: 1, mschiff: 1, fibchannel: 1, fibarcs: 1, gannfan: 1, fibspiral: 1, cyclic: 1, sine: 1, trishape: 1, rotrect: 1, avwap: 1, volprofile: 1, note: 1, callout: 1, comment: 1, pricenote: 1, pin: 1 };
var XTXT = { note: 1, callout: 1, comment: 1, pricenote: 1, pin: 1 };
Object.keys(XT2).forEach(function (k) { XT[k] = 1; EXTRA[k] = 1; });
["flattop", "schiff", "mschiff", "fibchannel"].forEach(function (k) { THREE[k] = 1; });
["fibarcs", "gannfan", "fibspiral", "cyclic", "sine", "volprofile"].forEach(function (k) { TWO[k] = 1; });
ONE.avwap = 1; NP.trishape = 3; NP.rotrect = 3; NP.cypher = 5; EXTRA.cypher = 1; PLBL.cypher = ["X", "A", "B", "C", "D"];
Object.assign(ICONS, {
  flattop: "<path d='M4 16L15 9M5 5h13'/><path d='M4 16L5 5' stroke-dasharray='2 2'/>", schiff: "<path d='M4 17L18 8M4 12L18 5M8 19L19 12' />", mschiff: "<path d='M5 15L18 9M5 10L18 4M9 19L19 13'/>",
  fibchannel: "<path d='M3 15L18 8M3 12L18 5M3 9L18 2' /><path d='M3 18L18 11' stroke-dasharray='2 2'/>", fibarcs: "<path d='M5 18a13 13 0 0 1 13-13M5 18a8 8 0 0 1 8-8'/>",
  gannfan: "<path d='M4 18L19 3M4 18L19 8M4 18L19 13M4 18L13 3M4 18L8 3'/>", fibspiral: "<path d='M11 11a2 2 0 0 1 2 2 4 4 0 0 1-4 4 7 7 0 0 1-7-7 11 11 0 0 1 11-9'/>",
  cypher: "<path d='M3 15L7 6l5 8 4-11 3 14'/>", cyclic: "<path d='M4 4v14M9 4v14M14 4v14M19 4v14'/>", sine: "<path d='M2 11c2-8 4-8 6 0s4 8 6 0 4-8 6 0'/>",
  trishape: "<path d='M11 4L4 17h14z'/>", rotrect: "<path d='M4 9l9-5 5 9-9 5z'/>", avwap: "<path d='M3 15c4 0 4-7 8-5s5-4 8-2'/><circle cx='3' cy='15' r='1.8'/>",
  volprofile: "<path d='M4 4v14M4 6h8M4 9h12M4 12h7M4 15h5'/>", note: "<path d='M4 4h14v11H10l-4 4v-4H4z'/>", callout: "<path d='M3 5h12v8H9l-5 5v-5H3z'/>",
  comment: "<path d='M4 4h14v10H11l-4 4v-4H4z'/><path d='M7 8h8M7 11h5'/>", pricenote: "<path d='M3 11h16M5 6h9v5H5z'/>", pin: "<path d='M11 3a5 5 0 0 1 5 5c0 4-5 10-5 10S6 12 6 8a5 5 0 0 1 5-5z'/><circle cx='11' cy='8' r='1.8'/>"
});
Object.assign(TN, { flattop: "Flat top/bottom", schiff: "Schiff pitchfork", mschiff: "Modified Schiff pitchfork", fibchannel: "Fib channel", fibarcs: "Fib speed resistance arcs", gannfan: "Gann fan", fibspiral: "Fib spiral",
  cypher: "Cypher pattern", cyclic: "Cyclic lines", sine: "Sine line", trishape: "Triangle", rotrect: "Rotated rectangle", avwap: "Anchored VWAP", volprofile: "Fixed range volume profile",
  note: "Note", callout: "Callout", comment: "Comment", pricenote: "Price note", pin: "Pin" });
addTools("lines", ["flattop", "schiff", "mschiff"]); addTools("fib", ["fibchannel", "fibarcs", "gannfan", "fibspiral"]); addTools("pat", ["cypher", "cyclic", "sine"]);
addTools("fore", ["avwap", "volprofile"]); addTools("shape", ["trishape", "rotrect"]); addTools("note", ["note", "pricenote", "callout", "comment", "pin"]);

function xtPoly(pts, close) { ctx.beginPath(); pts.forEach(function (q, k) { if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); if (close) ctx.closePath(); }
function xtTextBox(d, x, y, col, rounded) {
  var s = d.text || ""; ctx.font = "600 12px " + css("--font-body"); var w = Math.max(24, ctx.measureText(s).width + 16);
  ctx.fillStyle = col; ctx.globalAlpha = 0.95; if (rounded && ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, 24, 6); ctx.fill(); } else ctx.fillRect(x, y, w, 24); ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, x + 8, y + 12.5); return w;
}
function drawXT2(d, C, a, b, col) {
  var t = d.type, pw = G.pw, ph = G.ph, c3 = d.p3 ? pxOf(d.p3) : null, i;
  function seg(p, q) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  function dot(p) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 6.2832); ctx.fill(); }
  if (t === "flattop" && b) {
    seg(a, b); if (c3) { var ya = c3.y; seg({ x: a.x, y: ya }, { x: b.x, y: ya }); ctx.globalAlpha = 0.08; xtPoly([a, b, { x: b.x, y: ya }, { x: a.x, y: ya }], true); ctx.fill(); ctx.globalAlpha = 1; }
  } else if ((t === "schiff" || t === "mschiff") && b) {
    if (!c3) { seg(a, b); return; }
    var o = t === "schiff" ? { x: a.x, y: (a.y + b.y) / 2 } : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, L3 = pitchLines(o, b, c3);
    ctx.globalAlpha = 0.07; xtPoly([L3[1][0], L3[1][1], L3[2][1], L3[2][0]], true); ctx.fill(); ctx.globalAlpha = 1;
    L3.forEach(function (l, k) { ctx.lineWidth = k === 0 ? (d.w || 1.5) : 1; seg(l[0], l[1]); }); ctx.lineWidth = d.w || 1.5; seg(b, c3); ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1;
  } else if (t === "fibchannel" && b) {
    seg(a, b); if (!c3) return; var off = channelOff(a, b, c3); ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618].forEach(function (r) { ctx.lineWidth = 1; seg({ x: a.x, y: a.y + off * r }, { x: b.x, y: b.y + off * r }); ctx.fillText(String(r), b.x + 4, b.y + off * r - 2); });
    ctx.globalAlpha = 0.06; xtPoly([a, b, { x: b.x, y: b.y + off }, { x: a.x, y: a.y + off }], true); ctx.fill(); ctx.globalAlpha = 1;
  } else if (t === "fibarcs" && b) {
    var th = Math.atan2(a.y - b.y, a.x - b.x), R = Math.hypot(a.x - b.x, a.y - b.y); ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [0.382, 0.5, 0.618, 1, 1.618].forEach(function (r) { ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(b.x, b.y, R * r, th - Math.PI / 2, th + Math.PI / 2); ctx.stroke(); });
    ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1;
  } else if (t === "gannfan" && b) {
    var dx = b.x - a.x; if (Math.abs(dx) < 2) return; var s1 = (b.y - a.y) / dx; ctx.font = "11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    [[1, 8], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [8, 1]].forEach(function (rt) { var sl = s1 * rt[1] / rt[0], e = extendRay(a, { x: a.x + (dx > 0 ? 100 : -100), y: a.y + sl * (dx > 0 ? 100 : -100) }, pw); ctx.lineWidth = rt[0] === 1 && rt[1] === 1 ? 1.8 : 1; seg(a, e); var lx = Math.max(10, Math.min(pw - 30, e.x)); ctx.fillText(rt[1] + "x" + rt[0], lx - 14, Math.max(10, Math.min(ph - 4, e.y))); });
  } else if (t === "fibspiral" && b) {
    var ang0 = Math.atan2(b.y - a.y, b.x - a.x), RR = Math.hypot(b.x - a.x, b.y - a.y), kk = Math.log(1.618) / (Math.PI / 2), pts = [];
    for (var q = -4 * Math.PI; q <= 0.001; q += 0.08) { var rr = RR * Math.exp(kk * q); pts.push({ x: a.x + rr * Math.cos(ang0 + q), y: a.y + rr * Math.sin(ang0 + q) }); }
    xtPoly(pts, false); ctx.stroke(); ctx.globalAlpha = 0.5; ctx.setLineDash([3, 4]); seg(a, b); ctx.setLineDash([]); ctx.globalAlpha = 1;
  } else if (t === "cyclic" && b) {
    var cdx = b.x - a.x; if (Math.abs(cdx) < 4) return; var n0 = Math.ceil((0 - a.x) / cdx), n1 = Math.floor((pw - a.x) / cdx), lo2 = Math.min(n0, n1), hi2 = Math.max(n0, n1);
    for (i = lo2; i <= hi2; i++) { var cx = Math.round(a.x + i * cdx) + 0.5; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, ph); ctx.stroke(); }
  } else if (t === "sine" && b) {
    var sdx = b.x - a.x; if (Math.abs(sdx) < 3) return; var mid = (a.y + b.y) / 2, amp = (a.y - b.y) / 2, sp = [], xx;
    for (xx = 0; xx <= pw; xx += 3) sp.push({ x: xx, y: mid + amp * Math.cos(Math.PI * (xx - a.x) / sdx) }); xtPoly(sp, false); ctx.stroke(); dot(a); dot(b);
  } else if (t === "trishape" && d.pts) {
    var tp = d.pts.map(pxOf); ctx.globalAlpha = 0.12; xtPoly(tp, true); ctx.fill(); ctx.globalAlpha = 1; xtPoly(tp, tp.length > 2); ctx.stroke(); tp.forEach(dot);
  } else if (t === "rotrect" && d.pts) {
    var rp = d.pts.map(pxOf); if (rp.length < 3) { xtPoly(rp, false); ctx.stroke(); return; }
    var ex = rp[1].x - rp[0].x, ey = rp[1].y - rp[0].y, el = Math.hypot(ex, ey) || 1, nx = -ey / el, ny = ex / el, hh = (rp[2].x - rp[0].x) * nx + (rp[2].y - rp[0].y) * ny;
    var poly = [rp[0], rp[1], { x: rp[1].x + nx * hh, y: rp[1].y + ny * hh }, { x: rp[0].x + nx * hh, y: rp[0].y + ny * hh }]; ctx.globalAlpha = 0.12; xtPoly(poly, true); ctx.fill(); ctx.globalAlpha = 1; xtPoly(poly, true); ctx.stroke(); rp.forEach(dot);
  } else if (t === "avwap") {
    var i0 = Math.max(0, Math.min(bars.length - 1, Math.round(tToI(d.p1.t)))), cp = 0, cv = 0, started = false; ctx.lineWidth = d.w || 1.5; ctx.beginPath();
    for (i = i0; i < G.nv; i++) { var bb = bars[i], v = bb.v || 1; cp += (bb.h + bb.l + bb.c) / 3 * v; cv += v; if (i < G.iL) continue; if (i > G.iR) break; var py = G.Yp(cp / cv), px = G.X(i); if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py); }
    ctx.stroke(); dot(a); ctx.font = "600 11px " + css("--font-mono"); ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("AVWAP", a.x + 6, a.y - 6);
  } else if (t === "volprofile" && b) {
    var j1 = Math.max(0, Math.round(Math.min(tToI(d.p1.t), tToI(d.p2.t)))), j2 = Math.min(bars.length - 1, Math.round(Math.max(tToI(d.p1.t), tToI(d.p2.t)))); if (j2 <= j1) return;
    var lo = Infinity, hi = -Infinity, N = 24; for (i = j1; i <= j2; i++) { if (bars[i].l < lo) lo = bars[i].l; if (bars[i].h > hi) hi = bars[i].h; }
    var rows = [], stp = (hi - lo) / N || 1; for (i = 0; i < N; i++) rows.push(0);
    for (i = j1; i <= j2; i++) { var bv = bars[i], r0 = Math.max(0, Math.floor((bv.l - lo) / stp)), r1 = Math.min(N - 1, Math.floor((bv.h - lo) / stp - 1e-9)), cntR = Math.max(1, r1 - r0 + 1), k2; for (k2 = r0; k2 <= Math.max(r0, r1); k2++) rows[k2] += (bv.v || 1) / cntR; }
    var mxv = Math.max.apply(null, rows), poc = rows.indexOf(mxv), tot = rows.reduce(function (s, v) { return s + v; }, 0), vaLo = poc, vaHi = poc, acc = rows[poc];
    while (acc < tot * 0.7 && (vaLo > 0 || vaHi < N - 1)) { var dn = vaLo > 0 ? rows[vaLo - 1] : -1, up = vaHi < N - 1 ? rows[vaHi + 1] : -1; if (up >= dn) { vaHi++; acc += rows[vaHi]; } else { vaLo--; acc += rows[vaLo]; } }
    var xL = Math.min(a.x, b.x), xR = Math.max(a.x, b.x), maxW = Math.max(60, (xR - xL) * 0.6);
    ctx.globalAlpha = 0.05; ctx.fillRect(xL, Math.min(G.Yp(hi), G.Yp(lo)), xR - xL, Math.abs(G.Yp(lo) - G.Yp(hi))); ctx.globalAlpha = 1;
    rows.forEach(function (v, k3) { var y0 = G.Yp(lo + (k3 + 1) * stp), y1 = G.Yp(lo + k3 * stp); ctx.globalAlpha = k3 >= vaLo && k3 <= vaHi ? 0.55 : 0.25; ctx.fillStyle = k3 === poc ? C.warn || "#ff9800" : col; ctx.fillRect(xL, y0 + 0.5, v / mxv * maxW, Math.max(1, y1 - y0 - 1)); });
    ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.setLineDash([4, 3]); var py2 = G.Yp(lo + (poc + 0.5) * stp); ctx.strokeStyle = "#ff9800"; ctx.beginPath(); ctx.moveTo(xL, py2); ctx.lineTo(xR, py2); ctx.stroke(); ctx.setLineDash([]);
  } else if (XTXT[t]) {
    var w;
    if (t === "note") { seg(a, { x: a.x + 12, y: a.y - 14 }); dot(a); xtTextBox(d, a.x + 12, a.y - 38, col, true); }
    else if (t === "callout") { var bx = a.x + 34, by = a.y - 46; w = (ctx.font = "600 12px " + css("--font-body"), ctx.measureText(d.text || "").width + 16); seg(a, { x: bx + 10, y: by + 24 }); dot(a); xtTextBox(d, bx, by, col, false); }
    else if (t === "comment") { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + 6, a.y - 10); ctx.lineTo(a.x + 18, a.y - 10); ctx.closePath(); ctx.fill(); xtTextBox(d, a.x, a.y - 34, col, true); }
    else if (t === "pricenote") { ctx.setLineDash([4, 4]); seg(a, { x: pw, y: a.y }); ctx.setLineDash([]); dot(a); xtTextBox({ text: (d.text || "") + "  " + fmtAxis(d.p1.p) }, a.x + 8, a.y - 12, col, true); G.tags.push({ y: a.y, text: fmtAxis(d.p1.p), bg: col, fg: C.bg }); }
    else if (t === "pin") { ctx.beginPath(); ctx.arc(a.x, a.y - 16, 7, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.moveTo(a.x - 4, a.y - 11); ctx.lineTo(a.x, a.y); ctx.lineTo(a.x + 4, a.y - 11); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(a.x, a.y - 16, 2.5, 0, 6.2832); ctx.fill(); ctx.fillStyle = col; if (d.text) xtTextBox(d, a.x + 12, a.y - 28, col, true); }
  }
}
function hitXT2(d, a, b, x, y) {
  var t = d.type, c3 = d.p3 ? pxOf(d.p3) : null, i;
  if (XTXT[t]) return x >= a.x - 8 && x <= a.x + 220 && y >= a.y - 52 && y <= a.y + 8;
  if (t === "avwap") return Math.hypot(x - a.x, y - a.y) < 14;
  if ((t === "trishape" || t === "rotrect") && d.pts) { var pp = d.pts.map(pxOf), xs = pp.map(function (q) { return q.x; }), ys = pp.map(function (q) { return q.y; }); return x >= Math.min.apply(null, xs) - 5 && x <= Math.max.apply(null, xs) + 5 && y >= Math.min.apply(null, ys) - 5 && y <= Math.max.apply(null, ys) + 5; }
  if (!b) return false;
  if (t === "flattop" || t === "schiff" || t === "mschiff" || t === "fibchannel") { var pts = [a, b].concat(c3 ? [c3] : []), x0 = Math.min.apply(null, pts.map(function (q) { return q.x; })), x1 = Math.max.apply(null, pts.map(function (q) { return q.x; })), y0 = Math.min.apply(null, pts.map(function (q) { return q.y; })), y1 = Math.max.apply(null, pts.map(function (q) { return q.y; })); return dSeg(x, y, a, b) < TOL || (c3 && x >= x0 - 4 && x <= x1 + 4 && y >= y0 - 4 && y <= y1 + 4 && t !== "schiff" && t !== "mschiff"); }
  if (t === "fibarcs") { var R = Math.hypot(a.x - b.x, a.y - b.y), dd = Math.hypot(x - b.x, y - b.y); return [0.382, 0.5, 0.618, 1, 1.618].some(function (r) { return Math.abs(dd - R * r) < TOL; }); }
  if (t === "gannfan") { var dx = b.x - a.x; if (Math.abs(dx) < 2) return false; var s1 = (b.y - a.y) / dx; return [[1, 8], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [8, 1]].some(function (rt) { var sl = s1 * rt[1] / rt[0]; return dSeg(x, y, a, extendRay(a, { x: a.x + (dx > 0 ? 100 : -100), y: a.y + sl * (dx > 0 ? 100 : -100) }, G.pw)) < TOL; }); }
  if (t === "fibspiral") return Math.hypot(x - a.x, y - a.y) <= Math.hypot(b.x - a.x, b.y - a.y) * 1.05 && Math.hypot(x - a.x, y - a.y) > 2;
  if (t === "cyclic") { var cdx = b.x - a.x; if (Math.abs(cdx) < 4) return false; var m = ((x - a.x) % cdx + cdx) % cdx; return Math.min(m, Math.abs(cdx) - m) < TOL; }
  if (t === "sine") { var sdx = b.x - a.x; if (Math.abs(sdx) < 3) return false; return Math.abs(y - ((a.y + b.y) / 2 + (a.y - b.y) / 2 * Math.cos(Math.PI * (x - a.x) / sdx))) < TOL; }
  return x >= Math.min(a.x, b.x) - 4 && x <= Math.max(a.x, b.x) + 4 && y >= Math.min(a.y, b.y) - 4 && y <= Math.max(a.y, b.y) + 4;
}
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
  if (act === "alert") { addAlert((d.p2 || d.p1).p); return; }
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

var idCat = "all", idQ = "", idEl = null;
function closeIndDlg() { if (idEl) idEl.hidden = true; }
document.addEventListener("keydown", function (e) { if (e.key === "Escape" && idEl && !idEl.hidden) { e.stopPropagation(); closeIndDlg(); } }, true);
function idBuiltKey(k) { return $("#indPop [data-k=\"" + k + "\"]"); }
function idRows() {
  var q = idQ.trim().toLowerCase(), rows = [], act = [];
  XBUILT.forEach(function (b) { if (S.ind[b[0]]) act.push({ kind: "b", k: b[0], n: b[1] }); });
  S.xi.forEach(function (x) { act.push({ kind: "x", u: x.u, n: xTitle(x) }); });
  if (idCat === "active") return act.map(function (a) { a.active = true; return a; });
  XBUILT.forEach(function (b) { if ((idCat === "all" || idCat === b[2]) && (!q || b[1].toLowerCase().indexOf(q) >= 0)) rows.push({ kind: "b", k: b[0], n: b[1], g: b[2], on: !!S.ind[b[0]] }); });
  XORDER.forEach(function (id) { var d = XIND[id]; if ((idCat === "all" || idCat === d.g) && (!q || d.n.toLowerCase().indexOf(q) >= 0)) rows.push({ kind: "x", id: id, n: d.n, g: d.g, ov: d.ov }); });
  rows.sort(function (a, b) { return a.n.localeCompare(b.n); });
  return rows;
}
function idRender() {
  var act = XBUILT.filter(function (b) { return S.ind[b[0]]; }).length + S.xi.length, h = "";
  var nav = [["active", "Aktif (" + act + ")"]].concat(XGROUPS);
  $(".idl", idEl).innerHTML = nav.map(function (n) { return "<button type=\"button\" data-cat=\"" + n[0] + "\" aria-pressed=\"" + (idCat === n[0]) + "\">" + n[1] + "</button>"; }).join("");
  var rows = idRows(), gl = { trend: "Tren", osc: "Osilator", vola: "Volatilitas", vol: "Volume" };
  if (!rows.length) h = "<li class=\"idnone\">" + (idCat === "active" ? "Belum ada indikator aktif. Pilih dari daftar." : "Tidak ada hasil.") + "</li>";
  rows.forEach(function (r) {
    if (r.active) h += "<li class=\"idrow act\"><span class=\"nm\">" + r.n + "</span><span class=\"idacts\"><button type=\"button\" data-ia=\"cfg\" data-kind=\"" + r.kind + "\" data-key=\"" + (r.kind === "b" ? r.k : r.u) + "\" aria-label=\"Pengaturan " + r.n + "\">\u2699</button><button type=\"button\" data-ia=\"del\" data-kind=\"" + r.kind + "\" data-key=\"" + (r.kind === "b" ? r.k : r.u) + "\" aria-label=\"Hapus " + r.n + "\">\u00D7</button></span></li>";
    else h += "<li class=\"idrow\"><button type=\"button\" class=\"idpick\" data-ia=\"add\" data-kind=\"" + r.kind + "\" data-key=\"" + (r.kind === "b" ? r.k : r.id) + "\"><span class=\"nm\">" + r.n + "</span><span class=\"tg\">" + (gl[r.g] || "") + (r.ov === false ? " \u00B7 panel" : r.ov ? " \u00B7 overlay" : "") + "</span>" + (r.on ? "<span class=\"on\">Aktif</span>" : "") + "</button></li>";
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
  idCat = cat || "all"; idQ = ""; $("#idq", idEl).value = ""; idEl.hidden = false; idRender(); $("#idq", idEl).focus();
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
/* ---------- real market data: free providers, no API keys ---------- */
var SRCN = { auto: "Auto (best available)", binance: "Binance", coinbase: "Coinbase Exchange", kraken: "Kraken", upstox: "Upstox (India)", coingecko: "CoinGecko", yahoo: "Yahoo Finance" };
var FLD = { yahoo: "y", binance: "b", coinbase: "cb", kraken: "k", upstox: "u", coingecko: "cg" };
var srcPref = saved.src || "auto", curSrc = "", demo = false, wsLive = false, ws = null, loadSeq = 0, rafP = false, pollN = 0;
function order(sym) {
  var pri = sym.cat === "Crypto" ? ["binance", "coinbase", "kraken", "yahoo", "coingecko"] : sym.cat === "India" ? ["upstox", "yahoo"] : ["yahoo", "binance"];
  pri = pri.filter(function (k) { return sym[FLD[k]]; });
  if (srcPref !== "auto" && pri.indexOf(srcPref) >= 0) pri = [srcPref].concat(pri.filter(function (k) { return k !== srcPref; }));
  return pri;
}
function srcLabel(k, sym) { return k === "binance" && sym.id === "XAUUSD" ? "Binance PAXG (gold token)" : SRCN[k]; }
function getJSON(url, proxy) {
  var tries = proxy ? ["", "/api/proxy?url="] : [""], p = Promise.reject(new Error("start"));
  tries.forEach(function (px) {
    p = p.catch(function () {
      var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 12000);
      return fetch(px ? px + encodeURIComponent(url) : url, ctl ? { signal: ctl.signal } : undefined).then(function (r) { clearTimeout(to); if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
    });
  });
  return p;
}
function agg(a, sec, o) {
  o = o || 0; var out = [], cur = null;
  a.forEach(function (x) {
    var t = Math.floor((x.t - o) / sec) * sec + o;
    if (cur && cur.t === t) { if (x.h > cur.h) cur.h = x.h; if (x.l < cur.l) cur.l = x.l; cur.c = x.c; cur.v += x.v; }
    else { cur = { t: t, o: x.o, h: x.h, l: x.l, c: x.c, v: x.v }; out.push(cur); }
  });
  return out;
}
function ymd(d) { return d.toISOString().slice(0, 10); }
/* Any interval is built from the closest native interval the feed offers, then aggregated here. */
var PB = { yahoo: [60, 300, 900, 1800, 3600, 86400, 604800], binance: [60, 300, 900, 1800, 3600, 14400, 86400, 604800], coinbase: [60, 300, 900, 3600, 86400], kraken: [60, 300, 900, 1800, 3600, 14400, 86400, 604800], upstox: [60, 86400, 604800], coingecko: [1800, 14400, 86400] };
function planFor(k, tf) {
  var L = PB[k], b = 0, i;
  if (tf.mo) return { base: 86400, mo: tf.mo, direct: false };
  for (i = 0; i < L.length; i++) if (L[i] <= tf.s && tf.s % L[i] === 0) b = L[i];
  return b ? { base: b, mo: 0, direct: b === tf.s } : null;
}
function aggMonth(a, n) {
  var out = [], cur = null;
  a.forEach(function (x) {
    var d = new Date(x.t * 1000), g = Math.floor((d.getUTCFullYear() * 12 + d.getUTCMonth()) / n) * n, t = Date.UTC(Math.floor(g / 12), g % 12, 1) / 1000;
    if (cur && cur.t === t) { if (x.h > cur.h) cur.h = x.h; if (x.l < cur.l) cur.l = x.l; cur.c = x.c; cur.v += x.v; }
    else { cur = { t: t, o: x.o, h: x.h, l: x.l, c: x.c, v: x.v }; out.push(cur); }
  });
  return out;
}
var YR = [["5d", 5 * 86400], ["1mo", 31 * 86400], ["3mo", 92 * 86400], ["6mo", 183 * 86400], ["1y", 366 * 86400], ["2y", 731 * 86400], ["5y", 1826 * 86400], ["10y", 3653 * 86400]];
function yrSec(r) { var i; for (i = 0; i < YR.length; i++) if (YR[i][0] === r) return YR[i][1]; return 86400; }
function yShort(tgt, m) {
  var need = Math.max(tgt * 1.5, yrSec(m[2])), cap = yrSec(m[1]), i;
  for (i = 0; i < YR.length; i++) if (YR[i][1] >= need) return YR[i][1] > cap ? m[1] : YR[i][0];
  return m[1];
}
var YI = { 1800: ["30m", "1mo", "5d"], 60: ["1m", "5d", "1d"], 300: ["5m", "1mo", "1d"], 900: ["15m", "1mo", "1d"], 3600: ["60m", "1y", "5d"], 14400: ["60m", "1y", "5d"], 86400: ["1d", "5y", "5d"], 604800: ["1wk", "10y", "1mo"] };
var BI = { 1800: "30m", 60: "1m", 300: "5m", 900: "15m", 3600: "1h", 14400: "4h", 86400: "1d", 604800: "1w" };
var CBG = { 60: 60, 300: 300, 900: 900, 3600: 3600, 14400: 3600, 86400: 86400, 604800: 86400 };
var KI = { 1800: 30, 60: 1, 300: 5, 900: 15, 3600: 60, 14400: 240, 86400: 1440, 604800: 10080 };
var PROV = {
  yahoo: function (sym, tf, short, tgt) {
    var tk = [sym.y].concat(sym.y2 ? [sym.y2] : []), m = YI[tf.s], p = Promise.reject(new Error("start"));
    var rg = short ? (tgt && tgt > tf.s ? yShort(tgt, m) : m[2]) : m[1];
    tk.forEach(function (t) {
      p = p.catch(function () {
        var u = "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(t) + "?interval=" + m[0] + "&range=" + rg;
        return getJSON(u, true).then(function (j) {
          var r = j.chart.result[0], q = r.indicators.quote[0], out = [];
          (r.timestamp || []).forEach(function (ts, i) { if (q.close[i] == null || q.open[i] == null) return; out.push({ t: ts, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i], v: (q.volume && q.volume[i]) || 0 }); });
          if (!out.length) throw new Error("empty");
          return tf.s === 14400 ? agg(out, 14400) : out;
        });
      });
    });
    return p;
  },
  binance: function (sym, tf, short, tgt) {
    var q = "/api/v3/klines?symbol=" + sym.b + "&interval=" + BI[tf.s] + "&limit=" + (short ? Math.min(1000, Math.max(5, Math.ceil((tgt || tf.s) / tf.s) * 2 + 3)) : 1000);
    return getJSON("https://api.binance.com" + q).catch(function () { return getJSON("https://data-api.binance.vision" + q); })
      .then(function (a) { return a.map(function (x) { return { t: x[0] / 1000, o: +x[1], h: +x[2], l: +x[3], c: +x[4], v: +x[5] }; }); });
  },
  coinbase: function (sym, tf) {
    return getJSON("https://api.exchange.coinbase.com/products/" + sym.cb + "/candles?granularity=" + CBG[tf.s]).then(function (a) {
      var out = a.map(function (x) { return { t: x[0], o: x[3], h: x[2], l: x[1], c: x[4], v: x[5] }; }).reverse();
      return tf.s === 14400 ? agg(out, 14400) : tf.s === 604800 ? agg(out, 604800, 345600) : out;
    });
  },
  kraken: function (sym, tf) {
    return getJSON("https://api.kraken.com/0/public/OHLC?pair=" + sym.k + "&interval=" + KI[tf.s]).then(function (j) {
      if (j.error && j.error.length) throw new Error(j.error[0]);
      var key = Object.keys(j.result).filter(function (k) { return k !== "last"; })[0];
      return j.result[key].map(function (x) { return { t: x[0], o: +x[1], h: +x[2], l: +x[3], c: +x[4], v: +x[6] }; });
    });
  },
  upstox: function (sym, tf, short) {
    var base = "https://api.upstox.com/v2/historical-candle/", key = encodeURIComponent(sym.u), now = new Date();
    function cv(j) { return ((j.data && j.data.candles) || []).map(function (x) { return { t: Math.floor(Date.parse(x[0]) / 1000), o: x[1], h: x[2], l: x[3], c: x[4], v: x[5] || 0 }; }); }
    function asc(a) { return a.sort(function (x, y) { return x.t - y.t; }); }
    if (tf.s >= 86400) {
      var from = new Date(now.getTime() - (short ? 10 : 365 * 5) * 864e5);
      return getJSON(base + key + "/" + (tf.s === 86400 ? "day" : "week") + "/" + ymd(now) + "/" + ymd(from), true).then(function (j) { return asc(cv(j)); });
    }
    var intra = getJSON(base + "intraday/" + key + "/1minute", true).then(cv).catch(function () { return []; });
    var hist = short ? Promise.resolve([]) : getJSON(base + key + "/1minute/" + ymd(now) + "/" + ymd(new Date(now.getTime() - 28 * 864e5)), true).then(cv).catch(function () { return []; });
    return Promise.all([hist, intra]).then(function (r) {
      var m = {}; r[0].concat(r[1]).forEach(function (x) { m[x.t] = x; });
      var all = asc(Object.keys(m).map(function (k) { return m[k]; }));
      if (!all.length) throw new Error("empty");
      return tf.s === 60 ? all : agg(all, tf.s, 13500);
    });
  },
  coingecko: function (sym, tf, short) {
    var b = "https://api.coingecko.com/api/v3/coins/" + sym.cg;
    if (tf.s < 1800) return Promise.reject(new Error("unsupported"));
    if (tf.s <= 14400) {
      return getJSON(b + "/ohlc?vs_currency=usd&days=" + (tf.s <= 3600 ? 2 : 30)).then(function (a) {
        return agg(a.map(function (x) { return { t: x[0] / 1000, o: x[1], h: x[2], l: x[3], c: x[4], v: 0 }; }), tf.s);
      });
    }
    return getJSON(b + "/market_chart?vs_currency=usd&days=" + (short ? 10 : 365) + "&interval=daily").then(function (j) {
      var p = j.prices, out = [], i;
      for (i = 1; i < p.length; i++) { var o = p[i - 1][1], c = p[i][1]; out.push({ t: Math.floor(p[i][0] / 1000 / 86400) * 86400, o: o, h: Math.max(o, c), l: Math.min(o, c), c: c, v: 0 }); }
      return tf.s === 604800 ? agg(out, 604800, 345600) : out;
    });
  }
};
function loadHist(sym, tf, short) {
  var p = Promise.reject(new Error("start"));
  order(sym).forEach(function (k) {
    p = p.catch(function () {
      var pl = planFor(k, tf); if (!pl) throw new Error("unsupported interval");
      return PROV[k](sym, { k: tf.k, s: pl.base }, short, tf.s).then(function (b) {
        if (!b || b.length < (short ? 1 : 5)) throw new Error("empty");
        b.sort(function (x, y) { return x.t - y.t; });
        if (!pl.direct) b = pl.mo ? aggMonth(b, pl.mo) : agg(b, tf.s, k === "upstox" && tf.s < 86400 ? 13500 : tf.s % 604800 === 0 ? 345600 : 0);
        return { bars: b, src: k, direct: pl.direct };
      });
    });
  });
  return p;
}
function setFeed(txt, cls) { $("#feedTxt").textContent = txt; $("#feed").className = "feed " + (cls || ""); var fb = $("#feedTxtB"); if (fb) { fb.textContent = txt; $("#feedB").className = "feedB " + (cls || ""); } }
function closeWS() { if (ws) { ws.onclose = null; try { ws.close(); } catch (e) { /* ignore */ } ws = null; } wsLive = false; }
function openWS(sym, tf, src) {
  if (src !== "binance" || !window.WebSocket) return;
  try {
    var w = new WebSocket("wss://stream.binance.com:9443/ws/" + sym.b.toLowerCase() + "@kline_" + BI[tf.s]); ws = w;
    w.onopen = function () { wsLive = true; };
    w.onmessage = function (ev) { var k = JSON.parse(ev.data).k; if (k) onBar(sym, { t: k.t / 1000, o: +k.o, h: +k.h, l: +k.l, c: +k.c, v: +k.v }); };
    w.onclose = function () { wsLive = false; if (ws === w) setTimeout(function () { if (ws === w && S.sym === sym) openWS(sym, tf, src); }, 3000); };
  } catch (e) { wsLive = false; }
}
function alignTo(cb) { var out = [], j = 0, last = cb[0], i; for (i = 0; i < bars.length; i++) { while (j < cb.length && cb[j].t <= bars[i].t) { last = cb[j]; j++; } out.push(last); } return out; }
function buildCmp() {
  var a = S.cmp.slice(), p = S.cmpP.slice(), seq = loadSeq, all = a.concat(p.filter(function (id) { return a.indexOf(id) < 0; }));
  cmpData = []; panData = [];
  Promise.all(all.map(function (id) {
    var s = N_(id);
    return loadHist(s, S.tf, false).then(function (r) { return { sym: s, bars: r.bars }; }, function () { return { sym: s, bars: gen(s, S.tf, live[id]) }; });
  })).then(function (list) {
    if (seq !== loadSeq || a.join() !== S.cmp.join() || p.join() !== S.cmpP.join()) return;
    var m = {}; list.forEach(function (c) { m[c.sym.id] = { sym: c.sym, bars: alignTo(c.bars) }; });
    cmpData = a.map(function (id) { return m[id]; }); panData = p.map(function (id) { return m[id]; }); draw();
  });
}
var pendSpan = 0;
function applySpan(sec) { var last = bars[bars.length - 1].t, i0 = bars.length - 1; while (i0 > 0 && bars[i0 - 1].t >= last - sec) i0--; S.barW = Math.max(1.5, Math.min(40, (W - R - 12) / (bars.length - i0 + 3))); S.off = 3; }
function afterLoad() { recalc(); genEvents(); renderEvents(); buildCmp(); resetView(); if (pendSpan && bars.length) { applySpan(pendSpan); pendSpan = 0; } legendHtml = null; wrap.style.opacity = ""; syncUI(); header(); renderInfo(); draw(); }
function loadData() {
  var seq = ++loadSeq, sym = S.sym, tf = S.tf;
  closeWS(); setFeed("Loading " + sym.label, "wait");
  bars = gen(sym, tf, live[sym.id] || sym.base); recalc(); cmpData = []; panData = []; if (S.range && !pendSpan) pendSpan = rangeSpan(S.range); wrap.style.opacity = "0.35"; draw();
  loadHist(sym, tf, false).then(function (r) {
    if (seq !== loadSeq) return;
    bars = r.bars.slice(-1500); curSrc = r.src; demo = false; setLive(sym, bars[bars.length - 1].c);
    setFeed(srcLabel(r.src, sym) + (r.src === "binance" ? " · real-time" : " · refreshing every 5s"), "on");
    $("#footSrc").textContent = "Data: " + srcLabel(r.src, sym) + ". Free public feed, may be delayed. Not investment advice.";
    afterLoad(); if (r.direct) openWS(sym, tf, r.src);
  }, function () {
    if (seq !== loadSeq) return;
    demo = true; curSrc = "demo"; setFeed("Offline demo data, feeds unreachable", "off");
    $("#footSrc").textContent = "Could not reach any data source. Showing simulated prices. Retrying every 30s.";
    afterLoad();
  });
}
/* daily quote: previous close, last price, sparkline */
function quoteOne(sym, first) {
  return loadHist(sym, TF_D, !first).then(function (r) {
    var b = r.bars, n = b.length; if (n < 2) return;
    if (sym !== S.sym || !ready[sym.id]) setLive(sym, b[n - 1].c);
    ref[sym.id] = b[n - 2].c; ready[sym.id] = true;
    if (first) spark[sym.id] = b.slice(-30).map(function (x) { return x.c; });
  }).catch(function () {
    if (!ready[sym.id]) { /* offline: fall back to demo series so the row is honest */ var b = gen(sym, TF_D, sym.base), n = b.length; setLive(sym, b[n - 1].c); ref[sym.id] = b[n - 2].c; ready[sym.id] = true; }
  });
}
function quoteQueue(first) {
  var ids = S.watch.concat([S.sym.id]).filter(function (id, i, a) { return a.indexOf(id) === i; }), i = 0;
  function next() {
    if (i >= ids.length) { if (first) buildWatch(); return; }
    var s = N_(ids[i++]);
    quoteOne(s, first).then(function () { header(); watchUpdate(); next(); });
  }
  next(); next();
}
function header() {
  var s = S.sym, p = live[s.id], ch = p - ref[s.id], pc = ch / ref[s.id] * 100, cls = ch >= 0 ? "up" : "down";
  $("#symBtn").textContent = s.label; $("#symLabel").textContent = s.label; $("#symName").textContent = s.name + ", " + s.unit;
  $("#price").textContent = fmt(p, s.dec);
  var c = $("#chg"); c.textContent = (ch >= 0 ? "+" : "") + fmt(ch, s.dec) + " (" + (ch >= 0 ? "+" : "") + pc.toFixed(2) + "%)"; c.className = "chg " + cls;
  if (!ready[s.id]) { $("#price").textContent = "…"; c.textContent = ""; }
  document.title = fmt(p, s.dec) + " " + s.label;
}
function sparkSvg(arr) {
  var lo = Math.min.apply(null, arr), hi = Math.max.apply(null, arr), up = arr[arr.length - 1] >= arr[0];
  var pts = arr.map(function (v, i) { return (i / (arr.length - 1) * 60).toFixed(1) + "," + (24 - (v - lo) / (hi - lo || 1) * 22).toFixed(1); }).join(" ");
  return "<svg viewBox='0 0 60 26' aria-hidden='true'><polyline points='" + pts + "' fill='none' stroke-width='1.5' stroke-linejoin='round' class='" + (up ? "up" : "down") + "' stroke='currentColor'/></svg>";
}
function wlColor(id) { var cols = ["#f7a600", "#2962ff", "#089981", "#9c27b0", "#ff9800", "#00bcd4", "#e91e63", "#5c6bc0"]; return cols[hash(id) % cols.length]; }
function buildWatch() {
  var h = "", lastCat = null;
  S.watch.forEach(function (id) {
    var s = N_(id);
    if (s.cat !== lastCat) { lastCat = s.cat; h += "<li class='wlcat' aria-hidden='true'>" + s.cat + "</li>"; }
    h += "<li data-id='" + id + "'><button type='button' class='pick' data-id='" + id + "'><span class='wl-logo' style='background:" + wlColor(id) + "' aria-hidden='true'>" + s.label.charAt(0) + "</span><span class='wl-sym'><span class='l'>" + s.label + "</span><span class='n'>" + s.name + "</span></span><span class='wl-num v' data-v></span><span class='wl-num v' data-c></span></button><button type='button' class='x' data-rm='" + id + "' aria-label='Remove " + s.label + " from watchlist'>&times;</button></li>";
  });
  $("#wl").innerHTML = h || "<li class='empty'>Daftar pantau kosong. Gunakan tombol + Tambah untuk memilih simbol.</li>"; watchUpdate();
}
$("#wl").addEventListener("click", function (e) {
  var rm = e.target.closest("[data-rm]"), pk = e.target.closest(".pick");
  if (rm) { S.watch = S.watch.filter(function (id) { return id !== rm.dataset.rm; }); buildWatch(); save(); } else if (pk) selectSym(N_(pk.dataset.id));
});
function watchUpdate() {
  $$("#wl li[data-id]").forEach(function (li) {
    var s = N_(li.dataset.id), p = live[s.id], pc = (p / ref[s.id] - 1) * 100;
    li.querySelector("[data-v]").textContent = fmt(p, s.dec);
    var c = li.querySelector("[data-c]"); c.textContent = (pc >= 0 ? "+" : "") + pc.toFixed(2) + "%"; c.className = "v " + (pc >= 0 ? "up" : "down");
    if (!ready[s.id]) { li.querySelector("[data-v]").textContent = "…"; li.querySelector("[data-c]").textContent = ""; }
    li.classList.toggle("cur", s === S.sym);
  });
  var au = live.XAUUSD, ag = live.XAGUSD;
  $("#ref").innerHTML = "<div><dt>XAU/USD per gram</dt><dd>" + fmt(au / 31.1034768, 2) + "</dd></div><div><dt>XAU/USD per kilogram</dt><dd>" + fmt(au / 31.1034768 * 1000, 0) + "</dd></div><div><dt>Gold / silver ratio</dt><dd>" + (au / ag).toFixed(2) + "</dd></div><div><dt>Troy ounce</dt><dd>31.1035 g</dd></div>";
}
function renderInfo() {
  var s = S.sym; $("#infoSym").textContent = s.label;
  var lo = Math.min.apply(null, bars.map(function (b) { return b.l; })), hi = Math.max.apply(null, bars.map(function (b) { return b.h; }));
  $("#info").innerHTML = "<div><dt>Name</dt><dd>" + s.name + "</dd></div><div><dt>Category</dt><dd>" + s.cat + "</dd></div><div><dt>Quoted as</dt><dd>" + s.unit + "</dd></div><div><dt>Range, " + bars.length + " bars</dt><dd>" + fmt(lo, s.dec) + " to " + fmt(hi, s.dec) + "</dd></div><div><dt>Data</dt><dd>Simulated</dd></div>";
}

/* ---------- live updates ---------- */
function setLive(s, p) {
  var prev = live[s.id]; live[s.id] = p; ready[s.id] = true;
  S.alerts.forEach(function (a) {
    if (a.sym === s.id && a.active && prev != null && ((prev < a.price && p >= a.price) || (prev > a.price && p <= a.price))) {
      a.active = false; toast("Alert: " + s.label + " crossed " + fmt(a.price, s.dec)); if (S.sty.aSnd !== false) { try { var ac = new (window.AudioContext || window.webkitAudioContext)(), os = ac.createOscillator(), gn = ac.createGain(); os.frequency.value = 880; gn.gain.value = 0.05; os.connect(gn); gn.connect(ac.destination); os.start(); os.stop(ac.currentTime + 0.25); } catch (e) { /* audio unavailable */ } } renderAlerts(); save();
    }
  });
}
function merge(arr, nb) {
  nb.forEach(function (x) { var l = arr[arr.length - 1]; if (!l || x.t > l.t) arr.push(x); else if (x.t === l.t) arr[arr.length - 1] = x; });
}
function onBar(sym, x) {
  if (sym !== S.sym) return;
  setLive(sym, x.c); if (S.replay.on) return;
  merge(bars, [x]);
  if (!rafP) { rafP = true; requestAnimationFrame(function () { rafP = false; recalc(); header(); watchUpdate(); if (S.tab === "trade") renderTrade(); draw(); }); }
}
function poll() {
  if (document.hidden) return;
  pollN++;
  if (demo) { if (pollN % 6 === 0) { loadData(); quoteQueue(true); } return; }
  var sym = S.sym, tf = S.tf, seq = loadSeq;
  if (!wsLive && !S.replay.on && bars.length) {
    loadHist(sym, tf, true).then(function (r) {
      if (seq !== loadSeq || S.replay.on) return;
      var t0 = bars[bars.length - 1].t; merge(bars, r.bars.filter(function (x) { return x.t >= t0; }));
      setLive(sym, r.bars[r.bars.length - 1].c); recalc(); header(); watchUpdate(); if (S.tab === "trade") renderTrade(); draw();
    }, function () { /* try again next cycle */ });
  }
  if (pollN % 4 === 0) { quoteQueue(false); if (S.cmp.length && pollN % 12 === 0) buildCmp(); }
}

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
    var kk = e.key.toLowerCase(), m = { t: "trend", h: "hline", v: "vline", j: "hray", f: "fib", b: "rect", c: "cross", e: "eraser" }[kk];
    if (kk === "r" && e.shiftKey) { setTool("rect"); e.preventDefault(); } else if (m) { setTool(m); e.preventDefault(); } else if (kk === "r") { resetView(); draw(); e.preventDefault(); }
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
        if (LINE_T[d.type]) {
          h += rowH("Left end", selH("ea1", [[0, "Normal"], [1, "Arrow"]], d.ea1 ? 1 : 0)) + rowH("Right end", selH("ea2", [[0, "Normal"], [1, "Arrow"]], d.ea2 ? 1 : 0));
          if (d.type === "trend") h += rowH("Extend", selH("ext", [[0, "Don't extend"], [1, "Left"], [2, "Right"], [3, "Both"]], d.ext || 0));
          h += rowH("Display", chkH("mid", d.mid, "Middle point") + chkH("pl", d.pl, "Price labels"));
          h += rowH("Stats", selH("st", [[0, "Hidden"], [1, "Compact"], [2, "Values"]], d.st || 0)) + rowH("Stats position", selH("sp", [["left", "Left"], ["center", "Center"], ["right", "Right"]], d.sp || "right")) + rowH("", chkH("sa", d.sa, "Always show stats"));
        }
        if (d.type === "text") h += rowH("Text", "<input type='text' maxlength='60' data-f='text' value='" + esc(d.text || "") + "'>") + rowH("Font size", selH("fs", [10, 12, 13, 14, 16, 20, 24, 32].map(function (n) { return [n, n]; }), d.fs || 13));
        return h;
      }],
      ["Text", function () {
        if (!LINE_T[d.type]) return "<p class='sd-n'>Text tidak tersedia untuk tool ini.</p>";
        var C1 = colors();
        return rowH("Text", "<input type='text' maxlength='80' data-f='lt' value='" + esc(d.lt || "") + "' placeholder='Add text'>") + rowH("Font size", selH("lfs", [8, 10, 12, 14, 16, 20, 24].map(function (n) { return [n, n]; }), d.lfs || 12)) +
          rowH("Style", chkH("lb", d.lb, "Bold") + chkH("li", d.li, "Italic")) + rowH("Text color", colH("lc", d.lc || d.cx || C1[d.c || "acc"])) +
          rowH("Vertical alignment", selH("lv", [["top", "Top"], ["middle", "Middle"], ["bottom", "Bottom"]], d.lv || "top")) + rowH("Horizontal alignment", selH("lh", [["left", "Left"], ["center", "Center"], ["right", "Right"]], d.lh || "right"));
      }],
      ["Coordinates", function () {
        return pts.map(function (k, i) { return rowH("Point " + (i + 1) + " price", "<input type='number' step='any' data-f='" + k + ".p' value='" + d[k].p + "'>") + rowH("Point " + (i + 1) + " time", "<input type='datetime-local' data-f='" + k + ".t' value='" + toLocal(d[k].t) + "'>"); }).join("") || "<p class='sd-n'>No coordinates.</p>";
      }],
      ["Visibility", function () { return rowH("Display", chkH("hide", d.hide, "Hide this drawing") + chkH("only", !!d.only, "Show only on the " + S.tf.k + " timeframe") + chkH("lock", d.lock, "Lock (no move or resize)")); }]
    ],
    foot: function () { return "<button type='button' class='btn' data-f='tpl'>Template &#9662;</button><button type='button' class='btn' data-f='clone'>Clone</button><button type='button' class='btn' data-f='del'>Delete</button>"; },
    set: function (f, v) {
      if (f === "del") { dlgClose(); deleteSel(); return; }
      if (f === "tpl") { var tb = $("[data-f=tpl]", DLG); tplMenu(d, tb, function () { syncSel(); draw(); }); return; }
      if (f === "clone") { dlgClose(); snap(); var n = JSON.parse(JSON.stringify(d)); n.id = "d" + Date.now() + Math.floor(Math.random() * 1000); pts.forEach(function (k) { n[k].p *= 1.002; }); S.drawings[S.sym.id].push(n); S.sel = n.id; syncSel(); save(); return; }
      if (!snapped) { snap(); snapped = true; }
      if (f === "c") { d.c = v; delete d.cx; } else if (f === "cx") d.cx = v; else if (f === "w") d.w = parseFloat(v); else if (f === "ls") d.ls = parseInt(v, 10);
      else if (f === "fo") d.fo = v / 100; else if (f === "text") d.text = v; else if (f === "fs") d.fs = parseInt(v, 10);
      else if (f === "ea1" || f === "ea2" || f === "ext" || f === "st") d[f] = f === "ea1" || f === "ea2" ? (parseInt(v, 10) === 1) : parseInt(v, 10);
      else if (f === "mid" || f === "pl" || f === "sa" || f === "lb" || f === "li") d[f] = !!v;
      else if (f === "lt" || f === "lc" || f === "sp" || f === "lv" || f === "lh") d[f] = v;
      else if (f === "lfs") d.lfs = parseInt(v, 10);
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

})();
