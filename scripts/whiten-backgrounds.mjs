// One-off tool: normalize every per-SKU product photo to a clean white
// background. Photos come from mixed sources (white, gray, and black studio
// backdrops); this flood-fills the background from the image borders and
// repaints it pure white, leaving the product itself untouched.
//
// Usage: node scripts/whiten-backgrounds.mjs
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "assets", "products", "sku");

function colorDist(data, i, r, g, b) {
  const dr = data[i] - r;
  const dg = data[i + 1] - g;
  const db = data[i + 2] - b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function whiten(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Background color = median of the border pixels.
  const rs = [], gs = [], bs = [];
  const push = (x, y) => {
    const i = (y * w + x) * 4;
    rs.push(data[i]); gs.push(data[i + 1]); bs.push(data[i + 2]);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  const med = (a) => a.sort((m, n) => m - n)[Math.floor(a.length / 2)];
  const bg = [med(rs), med(gs), med(bs)];
  const lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];

  // Dark backdrops need a wider tolerance (vignettes, soft shadows).
  const tol = lum < 90 ? 95 : 60;

  // Flood fill from every border pixel that matches the backdrop.
  const visited = new Uint8Array(w * h);
  const queue = [];
  const trySeed = (x, y) => {
    const p = y * w + x;
    if (!visited[p] && (data[p * 4 + 3] < 10 || colorDist(data, p * 4, ...bg) <= tol)) {
      visited[p] = 1;
      queue.push(p);
    }
  };
  for (let x = 0; x < w; x++) { trySeed(x, 0); trySeed(x, h - 1); }
  for (let y = 0; y < h; y++) { trySeed(0, y); trySeed(w - 1, y); }

  while (queue.length) {
    const p = queue.pop();
    const x = p % w, y = (p / w) | 0;
    const neighbors = [];
    if (x > 0) neighbors.push(p - 1);
    if (x < w - 1) neighbors.push(p + 1);
    if (y > 0) neighbors.push(p - w);
    if (y < h - 1) neighbors.push(p + w);
    for (const n of neighbors) {
      if (visited[n]) continue;
      const i = n * 4;
      if (data[i + 3] < 10 || colorDist(data, i, ...bg) <= tol) {
        visited[n] = 1;
        queue.push(n);
      }
    }
  }

  // Repaint the background white; soften the 1px halo left at the product
  // edge by pulling near-boundary pixels toward white.
  let filled = 0;
  for (let p = 0; p < w * h; p++) {
    if (visited[p]) {
      const i = p * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = 255;
      filled++;
    }
  }
  for (let p = 0; p < w * h; p++) {
    if (visited[p]) continue;
    const x = p % w, y = (p / w) | 0;
    const touchesBg =
      (x > 0 && visited[p - 1]) || (x < w - 1 && visited[p + 1]) ||
      (y > 0 && visited[p - w]) || (y < h - 1 && visited[p + w]);
    if (touchesBg && colorDist(data, p * 4, ...bg) <= tol * 1.5) {
      const i = p * 4;
      data[i] = (data[i] + 255 * 2) / 3;
      data[i + 1] = (data[i + 1] + 255 * 2) / 3;
      data[i + 2] = (data[i + 2] + 255 * 2) / 3;
      data[i + 3] = 255;
    }
  }

  const share = filled / (w * h);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(file + ".tmp.png");
  const { renameSync } = await import("node:fs");
  renameSync(file + ".tmp.png", file.replace(/\.(jpe?g|webp)$/i, ".png"));
  if (/\.(jpe?g|webp)$/i.test(file)) {
    const { unlinkSync } = await import("node:fs");
    unlinkSync(file);
  }
  return { bg, share };
}

const files = readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
let dark = 0, light = 0, suspicious = [];
for (const f of files) {
  const { bg, share } = await whiten(join(dir, f));
  const lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];
  lum < 90 ? dark++ : light++;
  if (share < 0.15 || share > 0.97) suspicious.push(`${f} (bg ${bg.join(",")}, filled ${(share * 100).toFixed(0)}%)`);
}
console.log(`done: ${files.length} images | dark backdrops: ${dark} | light: ${light}`);
if (suspicious.length) {
  console.log("check these (very small/large filled area):");
  suspicious.forEach((s) => console.log("  -", s));
}
