// Generates src/data/products.json from data/catalog.csv.
// Runs automatically before `npm run dev` and `npm run build`, so the CSV
// is the single source of truth for product data — no database needed.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

  // Image priority: explicit CSV value → shared family photo (if dropped in) →
  // category illustration as the last-resort fallback.
  const familyImg = familyImage(category, name);
  const fallback = familyImg || `/assets/categories/${category}.svg`;
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
    heroImage: heroImage || image || familyImg || `/assets/categories/${category}.svg`,
    description: "",
    story,
    specs: unit ? [`Case: ${unit}`] : [],
    accent: accents[index % accents.length]
  };
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(products, null, 2) + "\n");
console.log(`Wrote ${products.length} products to src/data/products.json`);
