// Small helpers that derive display bits from a product's name/specs.

// A short, scannable size label pulled from the product name so near-identical
// tiles (same photo, same category) read as distinct at a glance.
// Examples: "12 oz", "10–24 oz", "23 cm", "20 lb", "#1", '8"'.
export function sizeBadge(name = "") {
  const ozRange = name.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*oz/i);
  if (ozRange) return `${ozRange[1]}–${ozRange[2]} oz`;

  const oz = name.match(/(\d+(?:\.\d+)?)\s*oz/i);
  if (oz) return `${oz[1]} oz`;

  const mm = name.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (mm) return `${mm[1]} mm`;

  const cm = name.match(/(\d+(?:\.\d+)?)\s*cm/i);
  if (cm) return `${cm[1]} cm`;

  const lb = name.match(/(\d+(?:\.\d+)?)\s*lbs?\b/i);
  if (lb) return `${lb[1]} lb`;

  const pack = name.match(/(\d+)\s*-?\s*pack/i);
  if (pack) return `${pack[1]}-pack`;

  const roll = name.match(/(\d+)\s*-?\s*roll/i);
  if (roll) return `${roll[1]}-roll`;

  const ply = name.match(/(\d+)\s*-?\s*ply/i);
  if (ply) return `${ply[1]}-ply`;

  const hash = name.match(/#(\d+)/);
  if (hash) return `#${hash[1]}`;

  const inch = name.match(/(\d+(?:\.\d+)?)\s*in\b/i);
  if (inch) return `${inch[1]}"`;

  return null;
}

// True when the src is a real product photo rather than the generic category
// illustration fallback — the fallback should get the typographic treatment,
// not be shown as if it were photography.
export function hasPhoto(src = "") {
  return !!src && !src.startsWith("/assets/categories/");
}

// The pack/case descriptor, e.g. "80 pcs" from a "Case: 80 pcs" spec.
export function caseInfo(product) {
  const spec = product?.specs?.[0] ?? "";
  return spec.startsWith("Case: ") ? spec.slice(6) : spec;
}
