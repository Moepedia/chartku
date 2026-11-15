/* 03-indicators: indikator */
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

