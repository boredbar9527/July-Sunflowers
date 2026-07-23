// Imports data/catalog.csv into the products table (idempotent: replaces all).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseCsv, CATALOG_HEADER } from "../csv-utils.mjs";
import { runSql } from "./mgmt.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const csv = readFileSync(join(root, "data", "catalog.csv"), "utf8");
const rows = parseCsv(csv);
const header = rows.shift().map((h) => h.trim());

const col = (r, name) => {
  const i = header.indexOf(name);
  return i === -1 ? "" : (r[i] ?? "");
};
const q = (v) => `'${String(v ?? "").replace(/'/g, "''")}'`;
const num = (v) => {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const values = rows.map((r, idx) => {
  return `(${q(col(r, "sku"))}, ${q(col(r, "name"))}, ${q(col(r, "category"))}, ` +
    `${q(col(r, "category_label"))}, ${q(col(r, "unit"))}, ${num(col(r, "price"))}, ` +
    `${q(col(r, "image"))}, ${q(col(r, "hero_image"))}, ${q(col(r, "story"))}, ` +
    `${q(col(r, "badge"))}, ${q(col(r, "hover_image"))}, ${idx})`;
});

const sql = `
truncate table public.products;
insert into public.products
  (sku, name, category, category_label, unit, price, image, hero_image, story, badge, hover_image, sort_order)
values
${values.join(",\n")};
select count(*) as count from public.products;
`;

runSql(sql).then(
  (r) => console.log(`Imported ${rows.length} products. DB reports:`, JSON.stringify(r)),
  (e) => {
    console.error(String(e.message || e));
    process.exit(1);
  }
);
