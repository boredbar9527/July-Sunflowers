// Follow-up to whiten-backgrounds.mjs: clear/transparent products (portion
// cups, lids, clear containers) become nearly invisible once their black
// backdrop is replaced with white. For images whose product pixels are very
// light overall, darken the midtones (gamma) so the outlines read again.
//
// Usage: node scripts/boost-faint-products.mjs
import { readdirSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "assets", "products", "sku");

const GAMMA = 2.4;
const lut = new Uint8Array(256);
for (let v = 0; v < 256; v++) lut[v] = Math.round(255 * Math.pow(v / 255, GAMMA));

async function boostIfFaint(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Product pixels = anything meaningfully non-white.
  let sum = 0, count = 0;
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (lum < 243) { sum += lum; count++; }
  }
  const meanLum = count ? sum / count : 255;
  const share = count / (w * h);

  // Faint = what product there is, is barely darker than the page.
  if (meanLum < 205 || share < 0.005) return false;

  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    data[i] = lut[data[i]];
    data[i + 1] = lut[data[i + 1]];
    data[i + 2] = lut[data[i + 2]];
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(file + ".tmp");
  renameSync(file + ".tmp", file);
  return true;
}

const files = readdirSync(dir).filter((f) => f.endsWith(".png"));
const boosted = [];
for (const f of files) {
  if (await boostIfFaint(join(dir, f))) boosted.push(f);
}
console.log(`boosted ${boosted.length} faint images:`);
boosted.forEach((f) => console.log("  -", f));
