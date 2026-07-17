import { ref } from "vue";
import products from "../data/products.json";

// The catalog is fully static: scripts/build-catalog.mjs turns
// api/data/catalog.csv into src/data/products.json before dev/build,
// and the JSON is bundled straight into the site.
const catalog = ref(products);

export function useCatalog() {
  return { products: catalog, source: ref("static") };
}
