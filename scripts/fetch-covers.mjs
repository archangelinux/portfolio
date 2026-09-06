// Downloads a front cover for every ISBN in src/data/library.json that doesn't
// already have one in src/assets/library/covers/. Run with `npm run covers`.
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, "src/assets/library/covers");
mkdirSync(outDir, { recursive: true });

const { books } = JSON.parse(readFileSync(resolve(root, "src/data/library.json"), "utf8"));

let fetched = 0, skipped = 0, missing = [];
for (const book of books) {
  const isbn = (book.isbn ?? "").replace(/-/g, "");
  if (!isbn) continue;
  if (book.cover && !book.cover.startsWith("TODO")) { skipped++; continue; }
  const out = resolve(outDir, `${isbn}.jpg`);
  if ([".jpg", ".jpeg", ".png", ".webp"].some((ext) => existsSync(resolve(outDir, `${isbn}${ext}`)))) { skipped++; continue; }

  const res = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`);
  if (!res.ok) { missing.push(`${isbn} ${book.title ?? ""}`); continue; }
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  fetched++;
  console.log(`✓ ${isbn}  ${book.title ?? ""}`);
}
console.log(`\n${fetched} fetched, ${skipped} already present`);
if (missing.length) console.log(`no cover on Open Library:\n  ${missing.join("\n  ")}`);
