// Merakit src/ menjadi dist/. Tanpa dependensi. Urutan file = urutan nama (01-, 02-, ...).
// Semua bagian JS digabung kembali ke satu IIFE, sehingga hoisting dan urutan eksekusi sama dengan satu file.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
const parts = readdirSync("src/js").filter((f) => f.endsWith(".js")).sort()
  .map((f) => readFileSync(`src/js/${f}`, "utf8").replace(/^\/\* [^\n]*\*\/\n/, ""));
const body = parts.join("").replace(/\n$/, "");
mkdirSync("dist", { recursive: true });
writeFileSync("dist/app.js", '\n(function () {\n"use strict";\n' + body + "})();\n");
writeFileSync("dist/style.css", readFileSync("src/style.css", "utf8"));
writeFileSync("dist/index.html", readFileSync("src/index.html", "utf8"));
console.log(`dist/ siap: ${parts.length} bagian JS`);
