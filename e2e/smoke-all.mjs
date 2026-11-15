// Mengklik SETIAP kontrol yang terlihat (halaman dimuat ulang untuk tiap kontrol) dan melaporkan:
//  - GALAT : klik memicu galat JavaScript
//  - MATI  : klik tidak mengubah DOM, kanvas, maupun penyimpanan (kandidat fitur yang tidak bisa dipakai)
// Pakai:  START=0 END=60 node e2e/smoke-all.mjs   (tanpa env = semua)
import { createServer } from "node:http";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let pw; try { pw = require("playwright"); } catch { pw = require(process.env.PLAYWRIGHT_PATH || "/opt/npm-tools/node_modules/playwright"); }
const PORT = 4180, DIST = new URL("../dist/", import.meta.url).pathname;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
createServer((req, res) => { const p = req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0], f = DIST + p.slice(1);
  existsSync(f) ? res.writeHead(200, { "content-type": MIME[f.slice(f.lastIndexOf("."))] || "text/plain" }).end(readFileSync(f)) : res.writeHead(404).end(); }).listen(PORT);
const END = Math.floor(Date.now() / 1000 / 86400) * 86400 + 6 * 3600, STEP = { "1m": 60, "5m": 300, "15m": 900, "30m": 1800, "60m": 3600, "1h": 3600, "1d": 86400, "5d": 432000, "1wk": 604800, "1mo": 2592000 };
function fixture(iv) { const s = STEP[iv] || 86400; let seed = s, p = 3880; const r = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
  const t = [], o = [], h = [], l = [], c = [], v = [];
  for (let i = 0; i < 400; i++) { const a = p, b = a * (1 + (r() - .5) * .012); t.push(END - (399 - i) * s); o.push(a); c.push(b); h.push(Math.max(a, b) * (1 + r() * .004)); l.push(Math.min(a, b) * (1 - r() * .004)); v.push(1000 + Math.floor(r() * 9000)); p = b; }
  return { chart: { result: [{ meta: { currency: "USD", regularMarketPrice: c.at(-1), chartPreviousClose: o[0], gmtoffset: 0, timezone: "UTC", exchangeTimezoneName: "UTC" }, timestamp: t, indicators: { quote: [{ open: o, high: h, low: l, close: c, volume: v }] } }] } }; }
const sha = (b) => createHash("sha1").update(b).digest("hex").slice(0, 12);
const browser = await pw.chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
await ctx.route(/^https?:\/\/(?!localhost)/, (r) => { const u = new URL(r.request().url()); return u.hostname.includes("yahoo") ? r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(fixture(u.searchParams.get("interval"))) }) : r.abort(); });
const SEL = "button, [role=button], [role=tab], summary, select, input[type=checkbox], input[type=radio], .grp, li button.pick";
const open = async () => { const pg = await ctx.newPage(); pg.errs = []; pg.on("pageerror", (e) => pg.errs.push(e.message)); pg.on("dialog", (d) => d.dismiss().catch(() => {}));
  await pg.goto(`http://localhost:${PORT}/`); await pg.waitForSelector("#cv"); await pg.waitForTimeout(700); return pg; };
const OPEN_I = process.env.OPEN_I; const OPEN = process.env.OPEN || (OPEN_I !== undefined ? "[data-opener]" : "");
const openWith = async () => { const pg = await open(); if (OPEN) { await pg.evaluate((s) => document.querySelectorAll(s).forEach((e) => e.setAttribute("data-pre", "1")), SEL); if (OPEN_I !== undefined) { await pg.evaluate(([sel, k]) => { const vis = [...document.querySelectorAll(sel)].filter((e) => (e.offsetParent || e.getClientRects().length) && !e.disabled); vis[k].setAttribute("data-opener", "1"); }, [SEL, +OPEN_I]); }
    await pg.locator(OPEN).first().click({ force: true }); await pg.waitForTimeout(700); } return pg; };
const list = async (pg) => pg.evaluate(([sel, only]) => [...document.querySelectorAll(sel)].filter((e) => !only || !e.hasAttribute("data-pre")).map((e, i) => ({ i, vis: !!(e.offsetParent || e.getClientRects().length) && getComputedStyle(e).visibility !== "hidden", dis: !!e.disabled,
  name: (e.getAttribute("aria-label") || e.title || e.innerText || e.id || e.value || e.className || "").toString().trim().replace(/\s+/g, " ").slice(0, 40), id: e.id || "" })), [SEL, !!OPEN]);
const sig = async (pg) => { const cv = await pg.locator("#cv").screenshot().then(sha).catch(() => "-"); return cv + ":" + (await pg.evaluate(() => { let s = document.documentElement.outerHTML; let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return h + ":" + JSON.stringify(localStorage).length; })); };

const probe = await openWith(); const all = (await list(probe)).filter((c) => c.vis && !c.dis); await probe.close();
const S0 = +(process.env.START || 0), E0 = Math.min(+(process.env.END || all.length), all.length);
console.log(`[${OPEN || "awal"}] kontrol baru terlihat: ${all.length}; menguji ${S0}..${E0 - 1}`);
const out = { galat: [], mati: [], ok: 0 };
const SKIP = /^(fs|shot)$/; // layar penuh dan unduh: sudah diuji terpisah
for (const c of all.slice(S0, E0)) {
  if (SKIP.test(c.id)) continue;
  const pg = await openWith();
  try {
    await pg.evaluate(([sel, only, k]) => { [...document.querySelectorAll(sel)].filter((e) => !only || !e.hasAttribute("data-pre"))[k].setAttribute("data-k", "1"); }, [SEL, !!OPEN, c.i]);
    const el = pg.locator("[data-k]").first();
    if (!(await el.isVisible())) { await pg.close(); continue; }
    const tag = await el.evaluate((e) => e.tagName + (e.type ? ":" + e.type : ""));
    const before = await sig(pg);
    if (tag.startsWith("SELECT")) { const n = await el.locator("option").count(); if (n > 1) await el.selectOption({ index: 1 }); else { await pg.close(); continue; } }
    else await el.click({ timeout: 3000, force: true });
    await pg.waitForTimeout(700);
    const after = await sig(pg);
    if (process.env.DEBUG) console.log("DBG", c.name, "| vis:", await el.isVisible().catch(() => "?"), "| before:", before, "| after:", after);
    const label = `${c.name || "(tanpa nama)"}${c.id ? " #" + c.id : ""} [${tag}]`;
    if (pg.errs.length) out.galat.push(`${label}: ${pg.errs[0].slice(0, 90)}`);
    else if (before === after) out.mati.push(label); else out.ok++;
  } catch (e) { out.galat.push(`${c.name} #${c.id}: ${String(e.message).split("\n")[0].slice(0, 90)}`); }
  await pg.close();
}
console.log(`BERFUNGSI (ada efek): ${out.ok}\nGALAT JS (${out.galat.length}):\n  ${out.galat.join("\n  ") || "-"}\nTANPA EFEK (${out.mati.length}):\n  ${out.mati.join("\n  ") || "-"}`);
writeFileSync(new URL(`./smoke-${(OPEN || "awal").replace(/\W/g, "")}-${S0}.json`, import.meta.url).pathname, JSON.stringify(out, null, 2));
await browser.close(); process.exit(0);
