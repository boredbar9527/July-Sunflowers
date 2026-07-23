// Generates src/catalog.js from data/catalog.csv.
// Runs automatically before `npm run dev` and `npm run build`, and after every
// admin edit, so the CSV is the single source of truth for product data —
// no database needed. The output shape is exactly what src/main.js consumes:
//
//   export const catalog = {
//     generatedFrom, total,
//     groups: [ { name, slug, count, items: [ { no, sku, name, pack, price, image } ] } ]
//   }
//
// Products are grouped by their CSV `category`; the group heading is the
// `category_label`. Group order and item order follow the CSV row order.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./csv-utils.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "data", "catalog.csv");
const outPath = join(root, "src", "catalog.js");

// Neutral inline placeholder for listings added without an image yet.
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">' +
      '<rect width="400" height="400" fill="#f2efe6"/>' +
      '<text x="50%" y="50%" fill="#b7ad97" font-family="sans-serif" font-size="22" ' +
      'text-anchor="middle" dominant-baseline="middle">No image</text></svg>'
  );

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const header = rows.shift();
const expected = "sku,name,category,category_label,unit,price,image,hero_image,story,badge,hover_image";
if (header.join(",") !== expected) {
  throw new Error(`Unexpected CSV header: ${header.join(",")}`);
}

const groupsBySlug = new Map(); // slug -> { name, slug, items: [] }
let no = 0;

for (const cols of rows) {
  const [sku, name, category, categoryLabel, unit, price] = cols;
  const image = cols[6];
  const slug = String(category || "").trim() || "uncategorized";
  if (!groupsBySlug.has(slug)) {
    groupsBySlug.set(slug, {
      name: String(categoryLabel || "").trim() || slug,
      slug,
      items: []
    });
  }
  const priceStr = String(price || "").trim();
  groupsBySlug.get(slug).items.push({
    no: ++no,
    sku: String(sku || "").trim(),
    name: String(name || "").trim(),
    pack: String(unit || "").trim(),
    price: priceStr === "" ? "" : Number(priceStr).toFixed(2),
    image: String(image || "").trim() || PLACEHOLDER
  });
}

const groups = [...groupsBySlug.values()].map((g) => ({ ...g, count: g.items.length }));
const catalog = {
  generatedFrom: "data/catalog.csv",
  total: no,
  groups
};

const banner =
  "// Auto-generated from data/catalog.csv by scripts/build-catalog.mjs.\n" +
  "// Do not edit by hand — edit the catalog through `npm run admin` instead.\n";

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${banner}export const catalog = ${JSON.stringify(catalog, null, 2)};\n`);
console.log(`Wrote ${no} products in ${groups.length} categories to src/catalog.js`);
