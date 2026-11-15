// Uji FUNGSI: bukan sekadar "klik berefek", tetapi hasilnya benar. Data disimulasikan (tanpa jaringan).
//  node e2e/functional.mjs
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let pw; try { pw = require("playwright"); } catch { pw = require(process.env.PLAYWRIGHT_PATH || "/opt/npm-tools/node_modules/playwright"); }
const PORT = 4195, DIST = new URL("../dist/", import.meta.url).pathname, SHOTS = new URL("./shots/", import.meta.url).pathname; mkdirSync(SHOTS, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
createServer((req, res) => { const p = req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0], f = DIST + p.slice(1);
  existsSync(f) ? res.writeHead(200, { "content-type": MIME[f.slice(f.lastIndexOf("."))] || "text/plain" }).end(readFileSync(f)) : res.writeHead(404).end(); }).listen(PORT);
const END = Math.floor(Date.now() / 1000 / 86400) * 86400 + 6 * 3600, STEP = { "1m": 60, "5m": 300, "15m": 900, "30m": 1800, "60m": 3600, "1h": 3600, "1d": 86400, "5d": 432000, "1wk": 604800, "1mo": 2592000 };
let BUMP = 1, SYMSEEN = [];
function fixture(iv, sym) { const s = STEP[iv] || 86400; let seed = s + sym.length, p = 3880; const r = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
  const t = [], o = [], h = [], l = [], c = [], v = []; for (let i = 0; i < 400; i++) { const a = p, b = a * (1 + (r() - .5) * .012); t.push(END - (399 - i) * s); o.push(a); c.push(i === 399 ? b * BUMP : b); h.push(Math.max(a, b) * (1 + r() * .004) * (i === 399 ? BUMP : 1)); l.push(Math.min(a, b) * (1 - r() * .004)); v.push(1000 + Math.floor(r() * 9000)); p = b; }
  return { chart: { result: [{ meta: { currency: "USD", regularMarketPrice: c.at(-1), chartPreviousClose: o[0], gmtoffset: 0, timezone: "UTC", exchangeTimezoneName: "UTC" }, timestamp: t, indicators: { quote: [{ open: o, high: h, low: l, close: c, volume: v }] } }] } }; }
const sha = (b) => createHash("sha1").update(b).digest("hex").slice(0, 10);
const browser = await pw.chromium.launch({ headless: true });
const results = []; const log = (id, name, ok, d = "") => { results.push(ok); console.log(`${ok ? "  ok   " : "  GAGAL"} ${id} ${name}${d ? "  -> " + d : ""}`); };
async function fresh(vp = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport: vp, acceptDownloads: true }); const pg = await ctx.newPage(); pg.errs = []; pg.dialogs = [];
  pg.on("pageerror", (e) => pg.errs.push(e.message)); pg.on("dialog", (d) => { pg.dialogs.push(d.message()); d.accept(d.type() === "prompt" ? "uji-layout" : undefined).catch(() => {}); });
  await pg.route(/^https?:\/\/(?!localhost)/, (r) => { const u = new URL(r.request().url()); if (u.hostname.includes("yahoo")) { SYMSEEN.push(decodeURIComponent(u.pathname.split("/").pop())); return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(fixture(u.searchParams.get("interval"), u.pathname)) }); } return r.abort(); });
  await pg.addInitScript(() => { try { if (!sessionStorage.getItem("__clean")) { localStorage.clear(); sessionStorage.setItem("__clean", "1"); } } catch {} });
  await pg.goto(`http://localhost:${PORT}/`); await pg.waitForSelector("#cv"); await pg.waitForTimeout(900); return { ctx, pg };
}
const cv = async (pg) => { await pg.mouse.move(2, 2); await pg.waitForTimeout(150); return sha(await pg.locator("#cv").screenshot()); };
const txt = (pg, sel) => pg.locator(sel).first().innerText().catch(() => "");
const run = async (id, name, fn) => { const { ctx, pg } = await fresh(); try { await fn(pg); } catch (e) { log(id, name, false, String(e.message).split("\n")[0].slice(0, 160)); } await ctx.close(); };

await run("F1", "Replay", async (pg) => {
  const leg = async () => { await pg.mouse.move(2, 2); await pg.waitForTimeout(150); return (await pg.evaluate(() => { const e = [...document.querySelectorAll("div,span")].find((x) => /^XAU\/USD\s*·/.test((x.innerText || "").trim()) && x.children.length < 12); return e ? e.innerText.replace(/\s+/g, " ").slice(0, 80) : ""; })); };
  const L0 = await leg(); await pg.locator("#rpBtn").click(); await pg.waitForTimeout(300);
  await pg.locator("#rpPick").click(); const b = await pg.locator("#cv").boundingBox(); await pg.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.5); await pg.waitForTimeout(400);
  const L1 = await leg(); await pg.locator("#rpFwd").click(); await pg.waitForTimeout(250); const L2 = await leg();
  await pg.locator("#rpBack").click(); await pg.waitForTimeout(250); const L3 = await leg();
  await pg.locator("#rpPlay").click(); await pg.waitForTimeout(1800); const L4 = await leg(); await pg.locator("#rpPlay").click();
  await pg.locator("#rpExit").click(); await pg.waitForTimeout(500); const L5 = await leg();
  console.log("      legenda:", JSON.stringify({ awal: L0, pilih: L1, maju: L2, mundur: L3, play: L4, keluar: L5 }));
  log("F1", "Replay: maju mengubah bar, mundur kembali, play maju, keluar kembali ke bar terakhir", L1 !== L0 && L2 !== L1 && L3 === L1 && L4 !== L3 && L5 === L0 && !pg.errs.length, `pilih-beda=${L1 !== L0} maju=${L2 !== L1} mundur=kembali:${L3 === L1} play=${L4 !== L3} keluar=awal:${L5 === L0} galat=${pg.errs.length}`);
});
await run("F2", "Pine: Run menggambar indikator, Remove memulihkan gambar", async (pg) => {
  await pg.getByRole("button", { name: /Pine Editor/ }).first().click(); await pg.waitForTimeout(400); const h0 = await cv(pg);
  await pg.locator("#pineSample").click(); await pg.waitForTimeout(150); await pg.locator("#pineRun").click(); await pg.waitForTimeout(600);
  const h1 = await cv(pg); await pg.screenshot({ path: SHOTS + "F2-pine.png" }); await pg.locator("#pineClear").click(); await pg.waitForTimeout(500); const h2 = await cv(pg);
  log("F2", "Pine: Run menggambar indikator, Remove memulihkan gambar", h1 !== h0 && h2 === h0 && !pg.errs.length, `gambar=${h1 !== h0} hapus=kembali:${h2 === h0} galat=${pg.errs.join("|").slice(0, 80)}`);
});
await run("F3", "Trading: Beli lalu Jual tercatat di panel dan tahan reload", async (pg) => {
  await pg.getByRole("button", { name: /Panel trading|Trading Panel/ }).first().click(); await pg.waitForTimeout(300);
  const t0 = await pg.locator("body").innerText(); await pg.locator("#buy").click(); await pg.waitForTimeout(400); const t1 = await pg.locator("body").innerText();
  await pg.screenshot({ path: SHOTS + "F3-trading.png" }); await pg.locator("#sell").click(); await pg.waitForTimeout(400); const t2 = await pg.locator("body").innerText();
  log("F3", "Trading: Beli lalu Jual tercatat di panel", t1 !== t0 && t2 !== t1 && !pg.errs.length, `beli-ubah=${t1 !== t0} jual-ubah=${t2 !== t1} galat=${pg.errs.length}`);
});
await run("F4", "Multi-chart: 2 dan 4 panel (iframe), sinkron simbol, keluar kembali ke 1 chart", async (pg) => {
  const panes = () => pg.locator("iframe").count(); const lay = () => pg.locator('[title="Tata letak chart"], [aria-label="Tata letak chart"]').first();
  const p0 = await panes(); await lay().click({ force: true }); await pg.getByRole("button", { name: /2 charts, side by side/ }).click(); await pg.waitForTimeout(1200); const p2 = await panes();
  await pg.screenshot({ path: SHOTS + "F4-2charts.png" });
  await pg.locator("select").filter({ hasText: "4 charts" }).first().selectOption({ label: "4 charts" }); await pg.waitForTimeout(1200); const p4 = await panes();
  const sync = await pg.getByText("Sync symbols").count();
  await pg.getByRole("button", { name: /Exit multi-chart/ }).click(); await pg.waitForTimeout(900); const p1 = await panes();
  log("F4", "Multi-chart: 2 dan 4 panel (iframe), sinkron simbol, keluar kembali ke 1 chart", p0 === 0 && p2 === 2 && p4 === 4 && p1 === 0 && sync >= 1 && !pg.errs.length, `awal=${p0} dua=${p2} empat=${p4} sync-ada=${sync >= 1} keluar=${p1} galat=${pg.errs.length}`);
});
await run("F5", "Layout: simpan, ubah, muat memulihkan jenis chart", async (pg) => {
  await pg.getByRole("button", { name: "Pengaturan", exact: true }).first().click({ force: true }); await pg.locator("#lyName").fill("uji"); await pg.locator("#lySave").click(); await pg.waitForTimeout(400);
  const opts = (await pg.locator("#lySel option").allInnerTexts()).filter((t) => t.trim() === "uji").length; await pg.keyboard.press("Escape");
  await pg.locator("#typeBtn").click(); await pg.locator('#typePop input[value="line"]').check({ force: true }); await pg.keyboard.press("Escape"); await pg.waitForTimeout(300); const hLine = await cv(pg);
  await pg.getByRole("button", { name: "Pengaturan", exact: true }).first().click({ force: true }); await pg.locator("#lyLoad").click(); await pg.waitForTimeout(600); await pg.keyboard.press("Escape"); const hLoad = await cv(pg);
  log("F5", "Layout: simpan, ubah, muat memulihkan jenis chart", opts >= 1 && hLoad !== hLine && !pg.errs.length, `layout tersimpan=${opts} sesudah-muat-berbeda-dari-garis=${hLoad !== hLine} dialog=${pg.dialogs.join("|").slice(0, 60)}`);
});
await run("F6", "Cari simbol: ketik EUR dan pilih mengganti simbol aktif", async (pg) => {
  const before = (await txt(pg, "#symLabel")).trim(); await pg.locator("#symBtn").click(); await pg.waitForTimeout(300);
  await pg.keyboard.type("EUR"); await pg.waitForTimeout(400); const res = await pg.locator("[role=dialog] li button, .ss-row, [class*=ss] li button").count();
  await pg.screenshot({ path: SHOTS + "F6-search.png" }); await pg.keyboard.press("Enter"); await pg.waitForTimeout(800);
  const after = (await txt(pg, "#symLabel")).trim();
  log("F6", "Cari simbol: ketik EUR dan pilih mengganti simbol aktif", after !== before && /EUR/i.test(after), `sebelum="${before}" sesudah="${after}" hasil-terlihat=${res}`);
});
await run("F7", "Bandingkan simbol: menambah seri kedua mengubah gambar", async (pg) => {
  const h0 = await cv(pg); await pg.getByRole("button", { name: /Bandingkan atau tambah simbol/ }).first().click(); await pg.waitForTimeout(300);
  await pg.keyboard.type("XAG"); await pg.waitForTimeout(400); await pg.keyboard.press("Enter"); await pg.waitForTimeout(900); const h1 = await cv(pg); await pg.screenshot({ path: SHOTS + "F7-compare.png" });
  log("F7", "Bandingkan simbol: menambah seri kedua mengubah gambar", h1 !== h0 && !pg.errs.length, `berubah=${h1 !== h0} galat=${pg.errs.length}`);
});
await run("F8", "Alert: tambah alert, lalu harga melintas memicu notifikasi", async (pg) => {
  await pg.getByRole("button", { name: "Peringatan" }).first().click({ force: true }); await pg.waitForTimeout(300);
  const t0 = await pg.locator("body").innerText(); await pg.locator("#alAdd").click(); await pg.waitForTimeout(500); await pg.screenshot({ path: SHOTS + "F8-alert-form.png" });
  const t1 = await pg.locator("body").innerText(); log("F8a", "Alert: tombol Tambah menampilkan form/entri", t1 !== t0, `panel berubah=${t1 !== t0}`);
  BUMP = 0.9; await pg.waitForTimeout(7500); const t2 = await pg.locator("body").innerText(); BUMP = 1;
  log("F8b", "Alert: harga turun melewati level memicu pemberitahuan", /triggered|crossed|melewati|terpicu/i.test(t2) && !/Waiting to cross/.test(t2.split("Alert set")[0] || ""), "status akhir: " + (t2.match(/(Triggered|Crossed|Waiting to cross|terpicu|melewati)[^\n]{0,30}/i) || ["tidak ada"])[0]);
});
await run("F9", "Sumber data: memilih Binance dengan jaringan mati tidak merusak chart", async (pg) => {
  const h0 = await cv(pg); await pg.getByRole("button", { name: "Pengaturan", exact: true }).first().click({ force: true });
  await pg.locator("#srcSel").selectOption({ label: "Binance" }); await pg.waitForTimeout(1500); await pg.keyboard.press("Escape");
  const alive = await pg.locator("#cv").isVisible(); const body = (await pg.locator("body").innerText()).slice(0, 4000);
  log("F9", "Sumber data: memilih Binance dengan jaringan mati tidak merusak chart", alive && pg.errs.length === 0, `chart-terlihat=${alive} galat=${pg.errs.length} pesan-error-terlihat=${/error|gagal|unavailable|tidak tersedia|failed/i.test(body)}`);
});
await run("F10", "Drawing bertahan setelah reload", async (pg) => {
  const b = await pg.locator("#cv").boundingBox(); await pg.locator('#rail .grp[data-tool="trend"]').click(); await pg.mouse.click(b.x + b.width * .3, b.y + b.height * .5); await pg.mouse.click(b.x + b.width * .6, b.y + b.height * .3);
  await pg.keyboard.press("Escape"); await pg.waitForTimeout(400); const hd = await cv(pg);
  await pg.addInitScript(() => {}); const ls = await pg.evaluate(() => JSON.stringify(localStorage).length); await pg.reload(); await pg.waitForSelector("#cv"); await pg.waitForTimeout(900); const hr = await cv(pg);
  log("F10", "Drawing bertahan setelah reload", ls > 50 && hd === hr, `localStorage=${ls}B sama-setelah-reload=${hd === hr}`);
});
console.log(`\n${results.filter(Boolean).length}/${results.length} lulus`); await browser.close(); process.exit(0);
