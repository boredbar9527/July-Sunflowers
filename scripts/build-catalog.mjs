// Generates src/data/products.json from data/catalog.csv.
// Runs automatically before `npm run dev` and `npm run build`, so the CSV
// is the single source of truth for product data — no database needed.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "data", "catalog.csv");
const outPath = join(root, "src", "data", "products.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }
  return rows;
}

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const header = rows.shift();
const expected = "sku,name,category,category_label,unit,price,image,hero_image,story";
if (header.join(",") !== expected) {
  throw new Error(`Unexpected CSV header: ${header.join(",")}`);
}

const accents = ["sky", "leaf", "sand", "sun"];
const slugs = new Set();

const products = rows.map((cols, index) => {
  const [sku, name, category, categoryLabel, unit, price, image, heroImage, story] = cols;

  let slug = sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "item";
  const base = slug;
  for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;
  slugs.add(slug);

  const fallback = `/assets/categories/${category}.svg`;
  return {
    id: slug,
    sku,
    name,
    category,
    categoryLabel,
    mood: unit ? `Sold per case of ${unit}` : "",
    price: price ? Number(price) : null,
    image: image || fallback,
    heroImage: heroImage || image || fallback,
    description: "",
    story,
    specs: unit ? [`Case: ${unit}`] : [],
    accent: accents[index % accents.length]
  };
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(products, null, 2) + "\n");
console.log(`Wrote ${products.length} products to src/data/products.json`);
