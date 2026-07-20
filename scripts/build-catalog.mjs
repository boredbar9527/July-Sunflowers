// Generates src/data/products.json from data/catalog.csv.
// Runs automatically before `npm run dev` and `npm run build`, so the CSV
// is the single source of truth for product data — no database needed.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./csv-utils.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "data", "catalog.csv");
const outPath = join(root, "src", "data", "products.json");
const productImgDir = join(root, "public", "assets", "products");

// A "visual family" is a group of products that look the same and differ only
// by size (e.g. 12/16/24 oz of the same container). Dropping ONE photo named
// <family>.jpg|png|webp into public/assets/products/ makes every product in
// that family use it — no CSV edits, and it rolls out progressively.
function familySlug(category, name) {
  const s = name.toLowerCase();
  let mat = "plastic";
  if (s.includes("kraft")) mat = "kraft";
  else if (s.includes("bamboo")) mat = "bamboo";
  else if (s.includes("foam")) mat = "foam";
  else if (s.includes("aluminum") || s.includes("foil")) mat = "foil";
  else if (s.includes("paper") || s.includes("tissue")) mat = "paper";

  let type = "item";
  for (const k of [
    "hinged", "clamshell", "container", "sleeve", "carrier", "t-shirt", "bag",
    "cup", "lid", "tray", "chopstick", "fork", "spoon", "knife", "straw",
    "napkin", "plate", "glove", "wrap", "foil", "tissue", "portion", "boat"
  ]) {
    if (s.includes(k)) { type = k === "t-shirt" ? "tshirt" : k; break; }
  }

  let shape = "";
  if (s.includes("rectangular")) shape = "rect";
  else if (s.includes("round")) shape = "round";
  else if (s.includes("square")) shape = "square";

  return [category, mat, type, shape].filter(Boolean).join("-");
}

// Return the web path to a family image if a file exists on disk, else null.
function familyImage(category, name) {
  const slug = familySlug(category, name);
  for (const ext of ["jpg", "jpeg", "png", "webp", "svg"]) {
    if (existsSync(join(productImgDir, `${slug}.${ext}`))) {
      return `/assets/products/${slug}.${ext}`;
    }
  }
  return null;
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

  // Image priority: explicit CSV value → per-SKU photo (dropped into
  // public/assets/products/sku/<slug>.<ext>) → shared family photo →
  // category illustration as the last-resort fallback.
  let skuImg = null;
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    if (existsSync(join(productImgDir, "sku", `${slug}.${ext}`))) {
      skuImg = `/assets/products/sku/${slug}.${ext}`;
      break;
    }
  }
  const familyImg = familyImage(category, name);
  const fallback = skuImg || familyImg || `/assets/categories/${category}.svg`;
  return {
    id: slug,
    sku,
    name,
    category,
    categoryLabel,
    family: familySlug(category, name),
    mood: unit ? `Sold per case of ${unit}` : "",
    price: price ? Number(price) : null,
    image: image || fallback,
    heroImage: heroImage || image || skuImg || familyImg || `/assets/categories/${category}.svg`,
    description: "",
    story,
    specs: unit ? [`Case: ${unit}`] : [],
    accent: accents[index % accents.length]
  };
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(products, null, 2) + "\n");
console.log(`Wrote ${products.length} products to src/data/products.json`);
