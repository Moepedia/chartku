// Uji end-to-end ChartKu dengan Playwright. Jalankan dari folder chartku:  node build.mjs && node e2e/run.mjs
// Semua panggilan data ke luar (Yahoo, Binance, ...) disimulasikan dengan fixture deterministik; tidak ada jaringan.
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let pw; try { pw = require("playwright"); } catch { pw = require(process.env.PLAYWRIGHT_PATH || "/opt/npm-tools/node_modules/playwright"); }
const { chromium } = pw;

const PORT = 4173, DIST = new URL("../dist/", import.meta.url).pathname, SHOTS = new URL("./shots/", import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const server = createServer((req, res) => {
  const p = req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0], f = DIST + p.slice(1);
  if (!existsSync(f)) { res.writeHead(404).end("nf"); return; }
  res.writeHead(200, { "content-type": MIME[f.slice(f.lastIndexOf("."))] || "application/octet-stream" }).end(readFileSync(f));
}).listen(PORT);

// ---- fixture Yahoo (bentuk: chart.result[0].{timestamp, indicators.quote[0]})
const END = Math.floor(Date.now() / 1000 / 86400) * 86400 + 6 * 3600;
const STEP = { "1m": 60, "2m": 120, "5m": 300, "15m": 900, "30m": 1800, "60m": 3600, "90m": 5400, "1h": 3600, "1d": 86400, "5d": 432000, "1wk": 604800, "1mo": 2592000 };
function fixture(interval) {
  const s = STEP[interval] || 86400; let seed = s, p = 3880;
  const r = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
  const ts = [], o = [], h = [], l = [], c = [], v = [];
  for (let i = 0; i < 400; i++) {
    const oo = p, cc = oo * (1 + (r() - 0.5) * 0.012);
    ts.push(END - (399 - i) * s); o.push(oo); c.push(cc);
    h.push(Math.max(oo, cc) * (1 + r() * 0.004)); l.push(Math.min(oo, cc) * (1 - r() * 0.004)); v.push(1000 + Math.floor(r() * 9000)); p = cc;
  }
  return { chart: { result: [{ meta: { symbol: "GC=F", currency: "USD", exchangeName: "CMX", instrumentType: "FUTURE", regularMarketPrice: c.at(-1), chartPreviousClose: o[0], gmtoffset: 0, timezone: "UTC", exchangeTimezoneName: "UTC", regularMarketTime: END, firstTradeDate: 0 },
    timestamp: ts, indicators: { quote: [{ open: o, high: h, low: l, close: c, volume: v }] } }], error: null } };
}

const results = []; const log = (id, name, ok, detail = "") => { results.push({ id, name, ok, detail }); console.log(`${ok ? "  ok   " : "  GAGAL"} ${id} ${name}${detail ? "  -> " + detail : ""}`); };
const sha = (b) => createHash("sha1").update(b).digest("hex").slice(0, 10);

const browser = await chromium.launch({ headless: true });
async function fresh(viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport, acceptDownloads: true });
  const page = await ctx.newPage(); page.errs = []; page.bad = [];
  page.on("pageerror", (e) => page.errs.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) page.errs.push("console: " + m.text()); });
  page.on("response", (r) => { if (r.url().startsWith(`http://localhost:${PORT}`) && r.status() >= 400) page.bad.push(r.status() + " " + r.url()); });
  await page.route(/^https?:\/\/(?!localhost)/, (route) => {
    const u = new URL(route.request().url());
    if (u.hostname.includes("yahoo")) return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(fixture(u.searchParams.get("interval"))) });
    return route.abort();
  });
  await page.goto(`http://localhost:${PORT}/`); await page.waitForSelector("#cv"); await page.waitForTimeout(1200);
  return { ctx, page };
}
const canvasHash = async (page) => sha(await page.locator("#cv").screenshot());
const nonBlank = (buf) => new Set([...buf].filter((_, i) => i % 97 === 0)).size > 8;

// ---------------------------------------------------------------- T01 muat
let { ctx, page } = await fresh();
try {
  const buf = await page.locator("#cv").screenshot(); await page.screenshot({ path: SHOTS + "01-desktop-dark.png" });
  const price = (await page.locator("#price").innerText()).trim();
  log("T01", "halaman termuat, chart tidak kosong, harga tampil", nonBlank(buf) && /[\d.,]{4,}/.test(price), `harga="${price}"`);
  log("T01b", "tanpa galat JS/konsol dan tanpa 4xx/5xx lokal", page.errs.length === 0 && page.bad.length === 0, [...page.errs, ...page.bad].slice(0, 3).join(" | "));
} catch (e) { log("T01", "muat", false, e.message); }

// ---------------------------------------------------------------- T02 jenis chart
try {
  await page.locator("#typeBtn").click();
  const vals = await page.locator("#typePop input[type=radio]").evaluateAll((els) => els.map((e) => [e.value, e.parentElement.innerText.trim()]));
  await page.keyboard.press("Escape");
  const seen = new Map(); let fails = [];
  for (const [val, label] of vals) {
    await page.locator("#typeBtn").click();
    await page.locator(`#typePop input[value="${val}"]`).check({ force: true }); await page.waitForTimeout(250);
    await page.keyboard.press("Escape");
    const buf = await page.locator("#cv").screenshot(), h = sha(buf);
    await page.screenshot({ path: SHOTS + `type-${val}.png` });
    if (!nonBlank(buf)) fails.push(`${label}: kosong`);
    if (seen.has(h)) fails.push(`${label}: sama persis dengan ${seen.get(h)}`);
    seen.set(h, label);
  }
  log("T02", `${vals.length} jenis chart: semua tergambar dan berbeda satu sama lain`, fails.length === 0 && vals.length >= 13, fails.join("; ") || vals.map((v) => v[1]).join(", "));
  log("T02b", "tanpa galat JS setelah semua jenis chart", page.errs.length === 0, page.errs.slice(0, 2).join(" | "));
} catch (e) { log("T02", "jenis chart", false, e.message); }

// ---------------------------------------------------------------- T03 timeframe
try {
  await page.locator("#typeBtn").click(); await page.locator('#typePop input[value="candles"]').check({ force: true }); await page.keyboard.press("Escape");
  const tfs = page.locator("#tfs button"), n = await tfs.count(); const hs = new Set(); let ok = n >= 5;
  for (let i = 0; i < n; i++) { await tfs.nth(i).click(); await page.waitForTimeout(500); hs.add(await canvasHash(page)); }
  log("T03", `${n} tombol timeframe mengganti data`, ok && hs.size >= n - 1 && page.errs.length === 0, `${hs.size} tampilan unik; ${page.errs.slice(0, 2).join(" | ")}`);
  await page.screenshot({ path: SHOTS + "03-timeframe.png" });
} catch (e) { log("T03", "timeframe", false, e.message); }

// ---------------------------------------------------------------- T04 indikator
try {
  await page.locator("#indBtn").click();
  const boxes = page.locator("#indPop input[type=checkbox]"), n = await boxes.count(); let changed = 0; const dead = [];
  await page.keyboard.press("Escape");
  for (let i = 0; i < n; i++) {
    await page.locator("#indBtn").click(); const b = page.locator("#indPop input[type=checkbox]").nth(i);
    const name = (await b.evaluate((e) => e.parentElement.innerText)).trim(), was = await b.isChecked();
    await page.keyboard.press("Escape"); const before = await canvasHash(page);
    await page.locator("#indBtn").click(); await b.setChecked(!was, { force: true }); await page.waitForTimeout(250); await page.keyboard.press("Escape");
    const after = await canvasHash(page); if (after !== before) changed++; else dead.push(name);
    await page.locator("#indBtn").click(); await b.setChecked(was, { force: true }); await page.keyboard.press("Escape");
  }
  log("T04", `${n} indikator: setiap toggle mengubah gambar`, dead.length === 0 && page.errs.length === 0, dead.length ? "tidak berubah: " + dead.join(", ") : page.errs.slice(0, 2).join(" | "));
} catch (e) { log("T04", "indikator", false, e.message); }

// ---------------------------------------------------------------- T05 drawing + undo/redo (klik-klik, seperti pemakaian nyata)
try {
  const grp = page.locator("#rail .grp"), n = await grp.count(); const box = await page.locator("#cv").boundingBox(); const bad = [], okT = [];
  const calm = async () => { await page.mouse.move(2, 2); await page.waitForTimeout(150); return canvasHash(page); };
  const P = [[.30, .55], [.45, .30], [.55, .62], [.68, .35], [.78, .58], [.86, .40]].map(([a, b]) => [box.x + box.width * a, box.y + box.height * b]);
  for (let i = 0; i < n; i++) {
    const g = grp.nth(i), tool = await g.getAttribute("data-tool"); if (["cursor", "eraser"].includes(tool)) continue;
    const before = await calm();            // acuan diambil dalam mode kursor (tanpa petunjuk alat)
    await g.click(); await page.waitForTimeout(100);
    if (tool === "emoji") await page.locator("#fly button").nth(1).click();      // emoji dipilih dari flyout dulu
    const pts = tool === "text" || tool === "emoji" ? P.slice(0, 1) : P;
    for (const [x, y] of pts) { await page.mouse.click(x, y); await page.waitForTimeout(80); }
    if (tool === "text") { await page.locator("#txtIn").waitFor({ state: "visible" }); await page.waitForTimeout(300); await page.keyboard.type("uji"); await page.keyboard.press("Enter"); await page.waitForTimeout(150); }
    await page.keyboard.press("Escape"); const drawn = await calm();
    if (page.errs.length) { bad.push(`${tool}: galat JS`); page.errs.length = 0; }
    const canUndo = await page.locator("#undoBtn").isEnabled();
    if (drawn === before || !canUndo) { bad.push(`${tool}: ${drawn === before ? "tidak menggambar" : "undo tidak aktif"}`); continue; }
    await page.locator("#undoBtn").click(); const undone = await calm();
    await page.locator("#redoBtn").click(); const redone = await calm();
    if (undone !== before) bad.push(`${tool}: undo tidak mengembalikan gambar`);
    else if (redone !== drawn) bad.push(`${tool}: redo tidak mengulang`); else okT.push(tool);
    await page.locator("#undoBtn").click(); await page.waitForTimeout(100);
  }
  await page.screenshot({ path: SHOTS + "05-drawings.png" });
  log("T05", `drawing (alat default tiap grup, ${n} grup): gambar + undo + redo`, bad.length === 0, bad.length ? bad.join("; ") : okT.join(", "));
} catch (e) { log("T05", "drawing", false, e.message.split("\n")[0]); }

// ---------------------------------------------------------------- T06 tema, T07 persistensi
try {
  const t0 = await page.locator("html").getAttribute("data-theme"); await page.locator("#theme").click(); await page.waitForTimeout(250);
  const t1 = await page.locator("html").getAttribute("data-theme"); await page.screenshot({ path: SHOTS + "06-theme-alt.png" });
  log("T06", "tombol tema mengganti tema", t0 !== t1, `${t0} -> ${t1}`);
  await page.locator("#theme").click();
} catch (e) { log("T06", "tema", false, e.message); }
try {
  await page.locator("#typeBtn").click(); await page.locator('#typePop input[value="baseline"]').check({ force: true }); await page.keyboard.press("Escape"); await page.waitForTimeout(300);
  await page.reload(); await page.waitForSelector("#cv"); await page.waitForTimeout(1000);
  await page.locator("#typeBtn").click(); const kept = await page.locator('#typePop input[value="baseline"]').isChecked(); await page.keyboard.press("Escape");
  log("T07", "jenis chart tersimpan setelah reload", kept);
} catch (e) { log("T07", "persistensi", false, e.message); }

// ---------------------------------------------------------------- T08 watchlist, T09 replay, T10 PNG
try {
  const rows = page.locator("#wl button.pick"), n = await rows.count(); const before = (await page.locator("#symLabel").innerText()).trim();
  let changed = false;
  for (let i = 0; i < Math.min(n, 6) && !changed; i++) { await rows.nth(i).click().catch(() => {}); await page.waitForTimeout(600); changed = (await page.locator("#symLabel").innerText()).trim() !== before; }
  log("T08", "klik simbol di watchlist mengganti simbol", changed, `${n} elemen simbol; awal="${before}"`);
} catch (e) { log("T08", "watchlist", false, e.message); }
try {
  await page.locator("#rpBtn").click(); await page.waitForTimeout(400); const vis = await page.locator("#rp").isVisible();
  log("T09", "tombol Replay membuka bar replay", vis);
  if (vis) { await page.screenshot({ path: SHOTS + "09-replay.png" }); await page.locator("#rpExit").click().catch(() => {}); }
} catch (e) { log("T09", "replay", false, e.message); }
try {
  const [dl] = await Promise.all([page.waitForEvent("download", { timeout: 5000 }), page.locator("#shot").click()]);
  log("T10", "tombol PNG mengunduh file gambar", /\.png$/i.test(dl.suggestedFilename()), dl.suggestedFilename());
} catch (e) { log("T10", "unduh PNG", false, e.message); }

// ---------------------------------------------------------------- T11 aksesibilitas (nama kontrol)
try {
  const unnamed = await page.evaluate(() => [...document.querySelectorAll("button, input, select, [role=button]")].filter((e) => e.offsetParent !== null || e.getClientRects().length)
    .filter((e) => !((e.getAttribute("aria-label") || e.getAttribute("title") || e.innerText || e.textContent || "").trim() || (e.labels && e.labels.length && e.labels[0].innerText.trim()) || e.getAttribute("aria-labelledby")))
    .map((e) => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : "")));
  log("T11", "semua kontrol punya nama aksesibel", unnamed.length === 0, unnamed.slice(0, 12).join(", "));
} catch (e) { log("T11", "aksesibilitas", false, e.message); }
await ctx.close();

// ---------------------------------------------------------------- T12 mobile
try {
  ({ ctx, page } = await fresh({ width: 390, height: 844 }));
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, cv: document.querySelector("#cv").getBoundingClientRect().toJSON() }));
  await page.screenshot({ path: SHOTS + "12-mobile.png" });
  log("T12", "mobile 390px: tanpa scroll horizontal, chart terlihat", m.sw <= m.iw + 1 && m.cv.width > 200 && m.cv.height > 150, `scrollWidth=${m.sw} innerWidth=${m.iw} chart=${Math.round(m.cv.width)}x${Math.round(m.cv.height)}; galat: ${page.errs.length}`);
  await ctx.close();
} catch (e) { log("T12", "mobile", false, e.message); }

const pass = results.filter((r) => r.ok).length;
console.log(`\n${pass}/${results.length} lulus`); writeFileSync(new URL("./results.json", import.meta.url).pathname, JSON.stringify(results, null, 2));
await browser.close(); server.close(); process.exit(pass === results.length ? 0 : 1);
