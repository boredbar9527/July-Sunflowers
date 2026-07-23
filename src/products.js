import { supabase } from "./supabase.js";
import { catalog as fallbackCatalog } from "./catalog.js";

// Reshape flat product rows into the grouped shape the storefront renders,
// identical to the build-time src/catalog.js structure.
export function groupProducts(rows) {
  const groups = [];
  const bySlug = new Map();
  let no = 0;
  for (const r of rows) {
    no += 1;
    const slug = r.category || "uncategorized";
    const name = r.category_label || "Uncategorized";
    let g = bySlug.get(slug);
    if (!g) {
      g = { name, slug, items: [], count: 0 };
      bySlug.set(slug, g);
      groups.push(g);
    }
    g.items.push({
      no,
      sku: r.sku,
      name: r.name,
      pack: r.unit || "",
      price: r.price != null && r.price !== "" ? Number(r.price).toFixed(2) : "",
      image: r.image || ""
    });
    g.count += 1;
  }
  return { generatedFrom: "supabase", total: rows.length, groups };
}

// Live catalog from Supabase, with the static snapshot as a safety net.
export async function fetchCatalog() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return fallbackCatalog;
    return groupProducts(data);
  } catch (e) {
    console.error("[catalog] Supabase fetch failed, using static snapshot:", e);
    return fallbackCatalog;
  }
}
