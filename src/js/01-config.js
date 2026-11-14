/* 01-config: simbol, timeframe, persistensi, state */
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
var TYPES = [["candles", "Candles"], ["hollow", "Hollow candles"], ["bars", "OHLC bars"], ["ha", "Heikin Ashi"], ["line", "Line"], ["area", "Area"]];
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
      localStorage.setItem(KEY, JSON.stringify({ sym: S.sym.id, tf: S.tf.k, type: S.type, scale: S.scale, invert: S.invert, lockScale: S.lockScale, hilo: S.hilo, events: S.events, ind: S.ind, cmp: S.cmp, cmpP: S.cmpP, cmpT: S.cmpT, colOv: S.colOv, iw: S.iw, ihide: S.ihide, sty: S.sty, magnet: S.magnet, grid: S.grid, tz: S.tz, src: srcPref, len: S.len, ctf: CTF.map(function (t) { return t.k; }), ftf: S.ftf, gcur: S.gcur, keep: S.keep, emojiCh: S.emojiCh,
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
  cmpP: (saved.cmpP || []).filter(function (id) { return N_(id); }).slice(0, 4), range: null, cmpT: saved.cmpT || {}, colOv: saved.colOv || {}, magnet: !!saved.magnet, grid: saved.grid !== false, tz: saved.tz || "local",
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

