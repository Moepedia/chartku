/* 03b-xind: indikator tambahan gaya TradingView (multi-instance, overlay dan sub-pane) */
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
