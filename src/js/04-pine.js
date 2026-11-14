/* 04-pine: subset Pine Script */
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

