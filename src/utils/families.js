// Groups catalog products into "families" — the same product in different
// sizes/variants — so the shop can show one editorial card per product type
// instead of a dozen near-identical tiles.
import { FAMILY_COPY } from "../data/families.js";
import { sizeBadge, hasPhoto } from "./product.js";
import { formatPrice, PRICE_FALLBACK } from "../config.js";

// A short label that distinguishes one variant from its siblings on the
// card's size chips. Falls back to the SKU when nothing better exists.
export function variantLabel(product) {
  const name = product.name;

  const badge = sizeBadge(name);
  if (badge) return badge;

  const dims = name.match(
    /(\d+(?:\.\d+)?)\s*(?:in)?\s*x\s*(\d+(?:\.\d+)?)(?:\s*(?:in)?\s*x\s*(\d+(?:\.\d+)?))?/i
  );
  if (dims) return dims.slice(1).filter(Boolean).join("×");

  const sizeWord = name.match(/\b(small|medium|large|x-large|xl)\b/i);
  if (sizeWord) {
    const w = sizeWord[1].toLowerCase();
    return w === "xl" || w === "x-large" ? "XL" : w[0].toUpperCase() + w.slice(1);
  }

  const weight = name.match(/\b(heavy|medium|light)\s*weight\b/i);
  if (weight) return `${weight[1][0].toUpperCase()}${weight[1].slice(1).toLowerCase()} weight`;

  return product.sku;
}

// Fallback title when a family has no curated copy: the most common product
// name in the family with size tokens stripped out.
function autoTitle(items) {
  const counts = new Map();
  for (const p of items) {
    const t = p.name
      .replace(/\d+(?:\.\d+)?\s*oz\s*/gi, "")
      .replace(/\d+(?:\.\d+)?\s*(?:in|inch|")\s*/gi, "")
      .replace(/\d+(?:\.\d+)?\s*(?:mm|cm|lbs?)\s*/gi, "")
      .replace(/\d+(?:\.\d+)?\s*x\s*[\d.]+(?:\s*x\s*[\d.]+)?/gi, "")
      .replace(/\(\s*\)/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/^[\s,\-–]+|[\s,\-–]+$/g, "");
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function priceText(items) {
  const prices = items.map((p) => p.price).filter((v) => v !== null && v !== "");
  if (!prices.length) return PRICE_FALLBACK;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
  return `${range} / case`;
}

// Big display text for families without photography, e.g. "12–38 oz".
function artText(items, categoryLabel) {
  const oz = items
    .map((p) => p.name.match(/(\d+(?:\.\d+)?)\s*oz/i))
    .filter(Boolean)
    .map((m) => Number(m[1]));
  if (oz.length >= 2) return `${Math.min(...oz)}–${Math.max(...oz)} oz`;
  if (oz.length === 1) return `${oz[0]} oz`;
  return categoryLabel;
}

const ACCENTS = ["sky", "leaf", "sand", "sun"];

export function groupFamilies(products) {
  const byKey = new Map();
  for (const p of products) {
    if (!byKey.has(p.family)) byKey.set(p.family, []);
    byKey.get(p.family).push(p);
  }

  return [...byKey.entries()].map(([key, items], index) => {
    const copy = FAMILY_COPY[key];
    const title = copy?.title ?? autoTitle(items);
    // Per-SKU photos are for the small tiles only — the big type cards get
    // their own dedicated imagery later, so skip sku shots here.
    const photo = items.find(
      (p) => hasPhoto(p.image) && !p.image.startsWith("/assets/products/sku/")
    );

    // Chip labels, with the SKU appended when two variants would otherwise
    // read identically (e.g. two different 24 oz lids).
    const labelCounts = new Map();
    for (const p of items) {
      const l = variantLabel(p);
      labelCounts.set(l, (labelCounts.get(l) || 0) + 1);
    }
    const variants = items.map((p) => {
      const label = variantLabel(p);
      return {
        id: p.id,
        name: p.name,
        label: labelCounts.get(label) > 1 ? `${label} · ${p.sku}` : label
      };
    });

    return {
      key,
      title,
      description:
        copy?.description ??
        `Every ${title.toLowerCase()} size in one family — pick a size for details and pricing.`,
      category: items[0].category,
      categoryLabel: items[0].categoryLabel,
      items,
      variants,
      image: photo?.image ?? null,
      priceText: priceText(items),
      artText: artText(items, items[0].categoryLabel),
      accent: ACCENTS[index % ACCENTS.length]
    };
  });
}
