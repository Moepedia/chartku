// Uji tingkat dua: untuk setiap kontrol pembuka (tingkat 1) yang menampilkan kontrol baru (menu, dialog, panel),
// klik tiap kontrol baru itu. Pakai:  FROM=0 TO=25 node e2e/smoke-l2.mjs
// Efek = DOM berubah, atau (bila DOM sama) kanvas berubah. GALAT = galat JS. MATI = tanpa efek apa pun.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let pw; try { pw = require("playwright"); } catch { pw = require(process.env.PLAYWRIGHT_PATH || "/opt/npm-tools/node_modules/playwright"); }
const PORT = 4190, DIST = new URL("../dist/", import.meta.url).pathname, MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
createServer((req, res) => { const p = req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0], f = DIST + p.slice(1);
  existsSync(f) ? res.writeHead(200, { "content-type": MIME[f.slice(f.lastIndexOf("."))] || "text/plain" }).end(readFileSync(f)) : res.writeHead(404).end(); }).listen(PORT);
const END = Math.floor(Date.now() / 1000 / 86400) * 86400 + 6 * 3600, STEP = { "1m": 60, "5m": 300, "15m": 900, "30m": 1800, "60m": 3600, "1h": 3600, "1d": 86400, "5d": 432000, "1wk": 604800, "1mo": 2592000 };
function fixture(iv) { const s = STEP[iv] || 86400; let seed = s, p = 3880; const r = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
  const t = [], o = [], h = [], l = [], c = [], v = [];
  for (let i = 0; i < 400; i++) { const a = p, b = a * (1 + (r() - .5) * .012); t.push(END - (399 - i) * s); o.push(a); c.push(b); h.push(Math.max(a, b) * (1 + r() * .004)); l.push(Math.min(a, b) * (1 - r() * .004)); v.push(1000 + Math.floor(r() * 9000)); p = b; }
  return { chart: { result: [{ meta: { currency: "USD", regularMarketPrice: c.at(-1), chartPreviousClose: o[0], gmtoffset: 0, timezone: "UTC", exchangeTimezoneName: "UTC" }, timestamp: t, indicators: { quote: [{ open: o, high: h, low: l, close: c, volume: v }] } }] } }; }
const sha = (b) => createHash("sha1").update(b).digest("hex").slice(0, 10);
const SEL = "button, [role=button], [role=tab], summary, select, input[type=checkbox], input[type=radio], .grp, li button.pick";
const browser = await pw.chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
await ctx.route(/^https?:\/\/(?!localhost)/, (r) => { const u = new URL(r.request().url()); return u.hostname.includes("yahoo") ? r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(fixture(u.searchParams.get("interval"))) }) : r.abort(); });
const SKIP = /^(fs|shot)$/;
async function fresh() { const pg = await ctx.newPage(); pg.errs = []; pg.on("pageerror", (e) => pg.errs.push(e.message)); pg.on("dialog", (d) => d.dismiss().catch(() => {}));
  await pg.addInitScript(() => { try { localStorage.clear(); } catch { /* abaikan */ } });   // keadaan bersih tiap halaman
  await pg.goto(`http://localhost:${PORT}/`); await pg.waitForSelector("#cv"); await pg.waitForTimeout(350); return pg; }
const visible = (pg) => pg.evaluate((sel) => [...document.querySelectorAll(sel)].map((e, i) => ({ i, v: !!(e.offsetParent || e.getClientRects().length) && !e.disabled, id: e.id })).filter((x) => x.v && !/^(fs|shot)$/.test(x.id)).map((x) => x.i), SEL);
const label = (pg, k, only) => pg.evaluate(([sel, k, only]) => { const e = [...document.querySelectorAll(sel)].filter((e) => !only || !e.hasAttribute("data-pre"))[k]; return (e.getAttribute("aria-label") || e.title || e.innerText || e.id || e.value || e.className || "").toString().trim().replace(/\s+/g, " ").slice(0, 38) + (e.id ? " #" + e.id : "") + " [" + e.tagName.toLowerCase() + (e.type ? ":" + e.type : "") + "]"; }, [SEL, k, only]);
async function openUp(i) { const pg = await fresh(); await pg.evaluate(([sel, i]) => { const all = [...document.querySelectorAll(sel)]; all[i].setAttribute("data-opener", "1"); all.forEach((e) => { if (e.offsetParent || e.getClientRects().length) e.setAttribute("data-pre", "1"); }); }, [SEL, i]);
  await pg.locator("[data-opener]").click({ force: true }); await pg.waitForTimeout(450); return pg; }
const newIdx = (pg) => pg.evaluate((sel) => [...document.querySelectorAll(sel)].filter((e) => !e.hasAttribute("data-pre")).map((e, k) => ({ k, v: !!(e.offsetParent || e.getClientRects().length) && !e.disabled })).filter((x) => x.v).map((x) => x.k), SEL);
const domSig = (pg) => pg.evaluate(() => { let s = document.documentElement.outerHTML, h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return h + ":" + JSON.stringify(localStorage).length; });

const probe = await fresh(); const first = await visible(probe); await probe.close();
const FROM = +(process.env.FROM || 0), TO = Math.min(+(process.env.TO || first.length), first.length);
const rep = { openers: 0, tested: 0, ok: 0, galat: [], mati: [] };
for (let oi = FROM; oi < TO; oi++) {
  let pg = await openUp(first[oi]); const ks = await newIdx(pg); const oname = await pg.evaluate(([sel, i]) => { const e = [...document.querySelectorAll(sel)][i]; return (e.getAttribute("aria-label") || e.title || e.innerText || e.id || "").trim().slice(0, 28); }, [SEL, first[oi]]);
  if (!ks.length || /^Remove /.test(oname)) { await pg.close(); continue; }
  rep.openers++; console.log(`[opener ${oi} "${oname}"] ${ks.length} kontrol baru`);
  if (process.env.LIST) { const names = []; for (const k of ks) names.push(await label(pg, k, true)); console.log("   " + names.join(" | ")); await pg.close(); continue; }
  await pg.close();
  for (const k of ks) {
    pg = await openUp(first[oi]);
    try {
      const names = await newIdx(pg); if (!names.includes(k)) { await pg.close(); continue; }
      const lab = await label(pg, k, true);
      await pg.evaluate(([sel, k]) => [...document.querySelectorAll(sel)].filter((e) => !e.hasAttribute("data-pre"))[k].setAttribute("data-k", "1"), [SEL, k]);
      const el = pg.locator("[data-k]").first(); const tag = await el.evaluate((e) => e.tagName);
      const d0 = await domSig(pg), c0 = sha(await pg.locator("#cv").screenshot());
      if (tag === "SELECT") { const n = await el.locator("option").count(); if (n < 2) { await pg.close(); continue; } await el.selectOption({ index: 1 }); } else await el.click({ timeout: 2500, force: true });
      await pg.waitForTimeout(500);
      const d1 = await domSig(pg), c1 = sha(await pg.locator("#cv").screenshot().catch(() => Buffer.from("x")));
      rep.tested++; const L = `${lab} (via "${oname}")`;
      if (pg.errs.length) { rep.galat.push(`${L}: ${pg.errs[0].slice(0, 80)}`); console.log("   !! GALAT", L, pg.errs[0].slice(0, 80)); } else if (d0 === d1 && c0 === c1) { rep.mati.push(L); console.log("   !! TANPA EFEK", L); } else rep.ok++;
    } catch (e) { rep.galat.push(`opener ${oi} k=${k}: ${String(e.message).split("\n")[0].slice(0, 80)}`); }
    await pg.close();
  }
}
console.log(`\nRINGKAS ${FROM}..${TO - 1}: pembuka dengan kontrol baru=${rep.openers}; diuji=${rep.tested}; berfungsi=${rep.ok}; GALAT=${rep.galat.length}; TANPA EFEK=${rep.mati.length}`);
if (rep.galat.length) console.log("GALAT:\n  " + rep.galat.join("\n  ")); if (rep.mati.length) console.log("TANPA EFEK:\n  " + rep.mati.join("\n  "));
await browser.close(); process.exit(0);
