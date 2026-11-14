/* 11-data-providers: penyedia data pasar, live update */
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
function afterLoad() { recalc(); genEvents(); renderEvents(); buildCmp(); resetView(); if (pendSpan && bars.length) { applySpan(pendSpan); pendSpan = 0; } legendHtml = ""; wrap.style.opacity = ""; syncUI(); header(); renderInfo(); draw(); }
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
      a.active = false; toast("Alert: " + s.label + " crossed " + fmt(a.price, s.dec)); renderAlerts(); save();
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

