// Syncs per-SKU product photos from the master folder into the site.
// Source of truth: D:\Fega\extra_pic\asset_new (files named "SKU - DETAILS.ext").
// Matching: by SKU prefix first, then by the details part vs product name.
// Copies into public/assets/products/sku/<product-slug>.<ext>, then you run
// `npm run catalog` (or just `npm run dev`) to pick the changes up.
//
// Usage: node scripts/sync-sku-images.mjs
import { readdirSync, rmSync, mkdirSync, copyFileSync, readFileSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE = "D:/Fega/extra_pic/asset_new";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(readFileSync(join(root, "src", "data", "products.json"), "utf8"));
const outDir = join(root, "public", "assets", "products", "sku");

const norm = (s) => s.toLowerCase().replace(/\s+/g, "");
const alnum = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const skuMap = new Map();
const detailMap = new Map();
for (const f of readdirSync(SOURCE)) {
  if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
  const full = join(SOURCE, f);
  const stem = f.replace(/\.[^.]+$/, "");
  const sku = norm(stem.split(" - ")[0]);
  if (!skuMap.has(sku)) skuMap.set(sku, full);
  const detail = stem.split(" - ").slice(1).join(" - ");
  if (detail && !detailMap.has(alnum(detail))) detailMap.set(alnum(detail), full);
  if (!detailMap.has(alnum(stem))) detailMap.set(alnum(stem), full);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// Pass 1: exact matches (by SKU, then by the details part of the filename).
let copied = 0;
const matchedSource = new Map(); // product id -> source file
const missing = [];
for (const p of products) {
  const src = skuMap.get(norm(p.sku)) || detailMap.get(alnum(p.name)) || null;
  if (!src) {
    missing.push(p);
    continue;
  }
  matchedSource.set(p.id, src);
  const ext = extname(src).toLowerCase().replace("jpeg", "jpg");
  copyFileSync(src, join(outDir, p.id + ext));
  copied++;
}

// Pass 2: products with no file of their own borrow the photo of their
// closest sibling — same product line, usually just a different size.

// Name with sizes/dimensions stripped, e.g. "12 oz Plastic Food Container
// with Lid (Rectangular)" -> "plasticfoodcontainerwithlidrectangular".
const sizeless = (name) =>
  alnum(
    name
      .replace(/\d+(?:\.\d+)?\s*(?:oz|in(?:ch)?|"|mm|cm|lbs?|mic|mil|ply|gallons?|ft)\b/gi, "")
      .replace(/\d+(?:\.\d+)?/g, "")
  );

const tokens = (name) => new Set(name.toLowerCase().match(/[a-z]+/g) ?? []);
function tokenOverlap(a, b) {
  const ta = tokens(a), tb = tokens(b);
  let hit = 0;
  for (const t of ta) if (tb.has(t)) hit++;
  return hit / Math.max(ta.size, tb.size);
}

let borrowed = 0;
const stillMissing = [];
for (const p of missing) {
  // Products with their own curated CSV image (e.g. tissue) need no borrow.
  if (p.image && !p.image.startsWith("/assets/categories/")) continue;

  const donors = products.filter((d) => matchedSource.has(d.id));
  // Best donor: identical sizeless name, then same family, then closest name.
  let donor =
    donors.find((d) => d.family === p.family && sizeless(d.name) === sizeless(p.name)) ??
    donors.find((d) => sizeless(d.name) === sizeless(p.name)) ??
    donors
      .filter((d) => d.family === p.family)
      .sort((a, b) => tokenOverlap(b.name, p.name) - tokenOverlap(a.name, p.name))[0];

  if (!donor) {
    // Last resort: best overall name similarity, if reasonably close.
    const best = donors
      .map((d) => ({ d, score: tokenOverlap(d.name, p.name) }))
      .sort((a, b) => b.score - a.score)[0];
    if (best && best.score >= 0.5) donor = best.d;
  }

  if (!donor) {
    stillMissing.push(`${p.sku} | ${p.name}`);
    continue;
  }
  const src = matchedSource.get(donor.id);
  const ext = extname(src).toLowerCase().replace("jpeg", "jpg");
  copyFileSync(src, join(outDir, p.id + ext));
  borrowed++;
  console.log(`borrowed: ${p.sku} (${p.name})`);
  console.log(`       <- ${donor.sku} (${donor.name})`);
}

console.log(`\ncopied ${copied} exact + ${borrowed} borrowed / ${products.length}`);
if (stillMissing.length) {
  console.log(`still without image (${stillMissing.length}):`);
  stillMissing.forEach((m) => console.log("  -", m));
}
console.log("Now run: npm run catalog");
