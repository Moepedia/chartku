// Proxy CORS minimal untuk data pasar publik. Hanya GET, hanya host di allowlist (mencegah SSRF), batas waktu dan ukuran.
const ALLOW = new Set([
  "api.binance.com", "data-api.binance.vision", "api.coingecko.com",
  "api.exchange.coinbase.com", "api.kraken.com", "api.upstox.com", "query1.finance.yahoo.com",
]);
module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "hanya GET" });
  let u;
  try { u = new URL(String(req.query.url || "")); } catch { return res.status(400).json({ error: "url tidak valid" }); }
  if (u.protocol !== "https:" || !ALLOW.has(u.hostname)) return res.status(403).json({ error: "host tidak diizinkan" });
  const c = new AbortController(), t = setTimeout(() => c.abort(), 10000);
  try {
    const r = await fetch(u, { signal: c.signal, redirect: "error", headers: { accept: "application/json" } });
    const b = Buffer.from(await r.arrayBuffer());
    if (b.length > 5e6) return res.status(502).json({ error: "respons terlalu besar" });
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=30");
    res.status(r.status).send(b);
  } catch { res.status(502).json({ error: "gagal mengambil data" }); }
  finally { clearTimeout(t); }
};
