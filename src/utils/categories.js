// Groups products by category for the big category cards (shop options
// "Grid" and "Sections").
import { CATEGORY_COPY } from "../data/categories.js";
import { hasPhoto } from "./product.js";
import { formatPrice, PRICE_FALLBACK } from "../config.js";

const ACCENTS = ["sky", "leaf", "sand", "sun"];

function priceText(items) {
  const prices = items.map((p) => p.price).filter((v) => v !== null && v !== "");
  if (!prices.length) return PRICE_FALLBACK;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
  return `${range} / case`;
}

export function groupCategories(products) {
  const byKey = new Map();
  for (const p of products) {
    if (!byKey.has(p.category)) byKey.set(p.category, []);
    byKey.get(p.category).push(p);
  }

  return [...byKey.entries()].map(([key, items], index) => {
    const photo = items.find((p) => hasPhoto(p.image));
    const familyCount = new Set(items.map((p) => p.family)).size;
    return {
      key,
      label: items[0].categoryLabel,
      description:
        CATEGORY_COPY[key]?.description ??
        `The full ${items[0].categoryLabel.toLowerCase()} range in one place.`,
      items,
      familyCount,
      image: photo?.image ?? null,
      priceText: priceText(items),
      accent: ACCENTS[index % ACCENTS.length]
    };
  });
}
