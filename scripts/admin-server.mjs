// Local catalog admin. Run with: npm run admin
// Serves a small web UI (scripts/admin.html) that edits data/catalog.csv:
// add / edit / delete listings and bulk price adjustments by percentage.
// After every write it re-runs build-catalog.mjs, so a running `npm run dev`
// site hot-reloads with the new data. This server is local-only tooling —
// it is never deployed, so it has no auth on purpose.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { CATALOG_HEADER, parseCsv, serializeCsv } from "./csv-utils.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "data", "catalog.csv");
const productImgDir = join(root, "public", "assets", "products");
const promosPath = join(root, "src", "data", "promos.json");
const promoImgDir = join(root, "public", "assets", "promos");
const settingsPath = join(root, "src", "data", "settings.json");
const PORT = Number(process.env.ADMIN_PORT) || 5177;

// Contact/biodata fields the admin is allowed to edit.
const SETTINGS_FIELDS = [
  "contactEmail", "orderEmail", "phoneDisplay", "phoneTel", "whatsappNumber", "address"
];

const execFileAsync = promisify(execFile);
async function git(...args) {
  try {
    const { stdout } = await execFileAsync("git", args, { cwd: root });
    return stdout.trim();
  } catch (err) {
    throw new Error((err.stderr || err.message || "git failed").trim());
  }
}

// Only these paths are ever published by the admin — code changes stay out.
const PUBLISH_PATHS = [
  "data/catalog.csv",
  "public/assets/products",
  "src/data/promos.json",
  "public/assets/promos",
  "src/data/settings.json"
];

// Commits made locally but not yet pushed (e.g. a publish whose push failed).
async function aheadCount() {
  try {
    return Number(await git("rev-list", "--count", "@{u}..HEAD")) || 0;
  } catch {
    return 0; // no upstream configured yet
  }
}

function loadRows() {
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  const header = rows.shift();
  if (header.join(",") !== CATALOG_HEADER.join(",")) {
    throw new Error(`Unexpected CSV header: ${header.join(",")}`);
  }
  return rows;
}

function saveRows(rows) {
  try {
    writeFileSync(csvPath, serializeCsv(CATALOG_HEADER, rows));
  } catch (err) {
    if (err.code === "EBUSY" || err.code === "EPERM") {
      throw new Error(
        "catalog.csv is locked by another program (usually Excel/WPS). " +
        "Close the file there, then try again."
      );
    }
    throw err;
  }
  // Regenerate products.json so a running vite dev server picks it up.
  execFileSync(process.execPath, [join(root, "scripts", "build-catalog.mjs")], {
    stdio: "ignore"
  });
}

function rowToObject(row) {
  const obj = {};
  CATALOG_HEADER.forEach((key, i) => (obj[key] = row[i] ?? ""));
  return obj;
}

function objectToRow(obj) {
  return CATALOG_HEADER.map((key) => String(obj[key] ?? "").trim());
}

function validateProduct(obj, rows, { existingSku = null } = {}) {
  const sku = String(obj.sku ?? "").trim();
  if (!sku) return "SKU is required.";
  if (!String(obj.name ?? "").trim()) return "Name is required.";
  if (!String(obj.category ?? "").trim()) return "Category is required.";
  const price = String(obj.price ?? "").trim();
  if (price !== "" && (Number.isNaN(Number(price)) || Number(price) < 0)) {
    return "Price must be a non-negative number (or empty for 'contact for pricing').";
  }
  const clash = rows.find((r) => r[0] === sku && r[0] !== existingSku);
  if (clash) return `SKU "${sku}" already exists.`;
  return null;
}

function normalizePrice(obj) {
  const price = String(obj.price ?? "").trim();
  if (price !== "") obj.price = Number(price).toFixed(2);
  return obj;
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 15e6) reject(new Error("Body too large"));
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(readFileSync(join(root, "scripts", "admin.html"), "utf8"));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/products") {
      json(res, 200, { products: loadRows().map(rowToObject) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/products") {
      const body = await readBody(req);
      const rows = loadRows();
      const error = validateProduct(body, rows);
      if (error) return json(res, 400, { error });
      rows.push(objectToRow(normalizePrice(body)));
      saveRows(rows);
      json(res, 200, { ok: true });
      return;
    }

    const productMatch = url.pathname.match(/^\/api\/products\/(.+)$/);
    if (productMatch) {
      const sku = decodeURIComponent(productMatch[1]);
      const rows = loadRows();
      const index = rows.findIndex((r) => r[0] === sku);
      if (index === -1) return json(res, 404, { error: `SKU "${sku}" not found.` });

      if (req.method === "PUT") {
        const body = await readBody(req);
        const error = validateProduct(body, rows, { existingSku: sku });
        if (error) return json(res, 400, { error });
        rows[index] = objectToRow(normalizePrice(body));
        saveRows(rows);
        json(res, 200, { ok: true });
        return;
      }
      if (req.method === "DELETE") {
        rows.splice(index, 1);
        saveRows(rows);
        json(res, 200, { ok: true });
        return;
      }
    }

    if (req.method === "POST" && url.pathname === "/api/price-adjust") {
      // body: { percent: number, category?: string, skus?: string[] }
      // percent > 0 raises, < 0 drops. Products with an empty price are
      // skipped — they stay "contact for pricing".
      const body = await readBody(req);
      const percent = Number(body.percent);
      if (!Number.isFinite(percent) || percent === 0) {
        return json(res, 400, { error: "Percent must be a non-zero number." });
      }
      if (percent <= -100) {
        return json(res, 400, { error: "A drop of 100% or more is not allowed." });
      }
      const skuSet = Array.isArray(body.skus) && body.skus.length ? new Set(body.skus) : null;
      const category = body.category || null;

      const rows = loadRows();
      let changed = 0;
      let skippedNoPrice = 0;
      const priceIdx = CATALOG_HEADER.indexOf("price");
      const catIdx = CATALOG_HEADER.indexOf("category");
      for (const row of rows) {
        if (category && row[catIdx] !== category) continue;
        if (skuSet && !skuSet.has(row[0])) continue;
        if (String(row[priceIdx]).trim() === "") {
          skippedNoPrice++;
          continue;
        }
        const next = Number(row[priceIdx]) * (1 + percent / 100);
        row[priceIdx] = (Math.round(next * 100) / 100).toFixed(2);
        changed++;
      }
      if (changed === 0) {
        return json(res, 400, {
          error: "No products matched (or all matched products have no price)."
        });
      }
      saveRows(rows);
      json(res, 200, { ok: true, changed, skippedNoPrice });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/upload") {
      // body: { filename, data, folder? } — data is base64. folder "promos"
      // stores banner images; anything else stores product photos.
      const body = await readBody(req);
      const extMatch = /\.(jpe?g|png|webp)$/i.exec(body.filename || "");
      if (!extMatch) {
        return json(res, 400, { error: "Image must be a .jpg, .png, or .webp file." });
      }
      const folder = body.folder === "promos" ? "promos" : "products";
      const targetDir = folder === "promos" ? promoImgDir : productImgDir;
      const ext = extMatch[1].toLowerCase() === "jpeg" ? "jpg" : extMatch[1].toLowerCase();
      const base = String(body.filename)
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "image";
      const buf = Buffer.from(String(body.data || ""), "base64");
      if (!buf.length) return json(res, 400, { error: "Empty file." });
      if (buf.length > 8 * 1024 * 1024) {
        return json(res, 400, { error: "Image is larger than 8 MB — please resize it first." });
      }
      mkdirSync(targetDir, { recursive: true });
      let name = `${base}.${ext}`;
      for (let n = 2; existsSync(join(targetDir, name)); n++) name = `${base}-${n}.${ext}`;
      writeFileSync(join(targetDir, name), buf);
      json(res, 200, { ok: true, path: `/assets/${folder}/${name}` });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/promos") {
      json(res, 200, JSON.parse(readFileSync(promosPath, "utf8")));
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/promos") {
      // body: full promos object keyed by department. Only known text/banner
      // fields are persisted per slide.
      const body = await readBody(req);
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json(res, 400, { error: "Invalid promos payload." });
      }
      const current = JSON.parse(readFileSync(promosPath, "utf8"));
      for (const [key, slide] of Object.entries(body)) {
        if (!current[key] || typeof slide !== "object") continue;
        for (const field of ["label", "title", "text", "cta", "banner"]) {
          if (typeof slide[field] === "string") current[key][field] = slide[field];
        }
      }
      writeFileSync(promosPath, JSON.stringify(current, null, 2) + "\n");
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/settings") {
      json(res, 200, JSON.parse(readFileSync(settingsPath, "utf8")));
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/settings") {
      // body: contact/biodata object. Only known string fields are persisted.
      const body = await readBody(req);
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json(res, 400, { error: "Invalid settings payload." });
      }
      const current = JSON.parse(readFileSync(settingsPath, "utf8"));
      for (const field of SETTINGS_FIELDS) {
        if (typeof body[field] === "string") current[field] = body[field].trim();
      }
      writeFileSync(settingsPath, JSON.stringify(current, null, 2) + "\n");
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/publish-status") {
      const out = await git("status", "--porcelain", "--", ...PUBLISH_PATHS);
      json(res, 200, {
        branch: await git("rev-parse", "--abbrev-ref", "HEAD"),
        changes: out ? out.split("\n") : [],
        ahead: await aheadCount()
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/publish") {
      const body = await readBody(req);
      await git("add", "--", ...PUBLISH_PATHS);
      const staged = await git("status", "--porcelain", "--", ...PUBLISH_PATHS);
      const ahead = await aheadCount();
      if (!staged && ahead === 0) {
        return json(res, 400, { error: "No catalog changes to publish." });
      }
      if (staged) {
        const message = String(body.message || "").trim() || "Catalog update via admin";
        try {
          await git("commit", "-m", message, "--", ...PUBLISH_PATHS);
        } catch (err) {
          if (/user\.(name|email)/.test(err.message)) {
            return json(res, 500, {
              error: "Git doesn't know who you are yet. Run once in a terminal: " +
                'git config --global user.name "Your Name" && git config --global user.email "you@example.com"'
            });
          }
          throw err;
        }
      }
      try {
        await git("push", "origin", "HEAD");
      } catch (err) {
        return json(res, 500, {
          error: "Saved locally, but pushing to GitHub failed (" + err.message +
            "). Check your internet/GitHub access and click Publish again."
        });
      }
      json(res, 200, { ok: true });
      return;
    }

    // Serve assets from public/ (site font, logo, product images) so the
    // admin page can share the storefront's look.
    if (req.method === "GET") {
      const publicDir = join(root, "public");
      const parts = url.pathname.split("/").filter((p) => p && p !== ".." && p !== ".");
      const filePath = join(publicDir, ...parts);
      if (filePath.startsWith(publicDir) && existsSync(filePath) && statSync(filePath).isFile()) {
        const types = {
          ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
          ".webp": "image/webp", ".svg": "image/svg+xml", ".ttf": "font/ttf",
          ".ico": "image/x-icon"
        };
        res.writeHead(200, { "Content-Type": types[extname(filePath).toLowerCase()] || "application/octet-stream" });
        res.end(readFileSync(filePath));
        return;
      }
    }

    json(res, 404, { error: "Not found" });
  } catch (err) {
    json(res, 500, { error: err.message });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const addr = `http://localhost:${PORT}/`;
  console.log(`Catalog admin running at ${addr}`);
  console.log(`Editing ${csvPath}`);
  if (process.argv.includes("--open")) {
    const opener = process.platform === "win32"
      ? ["cmd", ["/c", "start", "", addr]]
      : process.platform === "darwin" ? ["open", [addr]] : ["xdg-open", [addr]];
    execFile(opener[0], opener[1], () => {});
  }
});
