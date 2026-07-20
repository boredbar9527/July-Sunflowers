<script setup>
import { computed, ref, watch } from "vue";
import ProductCard from "./ProductCard.vue";
import ProductFamilyCard from "./ProductFamilyCard.vue";
import CategoryCard from "./CategoryCard.vue";
import { useCart } from "../composables/useCart.js";
import { buildWhatsAppLink, priceLabel } from "../config.js";
import { sizeBadge, caseInfo } from "../utils/product.js";
import { groupFamilies } from "../utils/families.js";
import { groupCategories } from "../utils/categories.js";

const { add } = useCart();

const props = defineProps({
  products: { type: Array, required: true },
  filter: { type: String, default: "all" }
});

const emit = defineEmits(["open", "update:filter"]);

const PAGE_SIZE = 24; // list rows per page
const TILE_PAGE_SIZE = 12; // tile grids: 3 rows of 4
const FAMILY_PAGE_SIZE = 12; // family cards per page
const search = ref("");
const page = ref(1);

// Catalog presentations (comparison build):
// "grid"     — the classic small product-tile grid (slicer first: tiles
//              appear once a category is picked)
// "grid2"    — the 5173-style grid: category door cards, then a hero card
//              with tiles once a category is chosen (different imagery later)
// "sections" — every category as a big card + its tiles, in sequence
// "types"    — one editorial card per product family with size chips
// "list"     — SKU table for fast ordering
const view = ref("grid");

const categories = computed(() => {
  const map = new Map();
  props.products.forEach((p) => {
    if (!map.has(p.category)) map.set(p.category, p.categoryLabel);
  });
  return [...map.entries()].map(([value, label]) => ({ value, label }));
});

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase();
  return props.products.filter((p) => {
    if (props.filter !== "all" && p.category !== props.filter) return false;
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term)
    );
  });
});

const families = computed(() => groupFamilies(filtered.value));
const categoryGroups = computed(() => groupCategories(filtered.value));


// The single hero card shown in grid view once a category is chosen.
const activeCategory = computed(() =>
  props.filter === "all"
    ? null
    : categoryGroups.value.find((c) => c.key === props.filter) ?? null
);

const totalPages = computed(() => {
  if (view.value === "types") {
    return Math.max(1, Math.ceil(families.value.length / FAMILY_PAGE_SIZE));
  }
  if (view.value === "sections") return 1;
  if (view.value === "grid2" && props.filter === "all") return 1;
  if (view.value === "list") {
    return Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE));
  }
  return Math.max(1, Math.ceil(filtered.value.length / TILE_PAGE_SIZE));
});

const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return filtered.value.slice(start, start + PAGE_SIZE);
});

const pagedTiles = computed(() => {
  const start = (page.value - 1) * TILE_PAGE_SIZE;
  return filtered.value.slice(start, start + TILE_PAGE_SIZE);
});

const pagedFamilies = computed(() => {
  const start = (page.value - 1) * FAMILY_PAGE_SIZE;
  return families.value.slice(start, start + FAMILY_PAGE_SIZE);
});

const countText = computed(() => {
  const products = `${filtered.value.length} size${filtered.value.length === 1 ? "" : "s"}`;
  if (view.value === "types") {
    return `${families.value.length} product type${families.value.length === 1 ? "" : "s"} · ${products}`;
  }
  if (view.value === "sections" || view.value === "grid2") {
    return `${categoryGroups.value.length} collection${categoryGroups.value.length === 1 ? "" : "s"} · ${products}`;
  }
  return `${filtered.value.length} product${filtered.value.length === 1 ? "" : "s"}`;
});

const pageNumbers = computed(() => {
  // Compact window: 1 … (p-1) p (p+1) … last
  const total = totalPages.value;
  const current = page.value;
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
});

watch([filtered, totalPages], () => {
  if (page.value > totalPages.value) page.value = 1;
});

watch(
  () => props.filter,
  () => {
    page.value = 1;
  }
);

watch(view, () => {
  page.value = 1;
});

function setFilter(value) {
  emit("update:filter", value);
}

function goTo(next) {
  page.value = Math.min(Math.max(1, next), totalPages.value);
  document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <section class="products section" id="collections">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Collection explorer</p>
        <h2>Choose the format that fits the room, routine, or run size.</h2>
      </div>

      <div class="catalog-controls">
        <input
          class="catalog-search"
          type="search"
          placeholder="Search by name or SKU…"
          v-model="search"
          aria-label="Search products"
        />
        <div class="filters" role="tablist" aria-label="Product category filters">
          <button
            class="filter-pill"
            :class="{ 'is-active': filter === 'all' }"
            type="button"
            :aria-pressed="String(filter === 'all')"
            @click="setFilter('all')"
          >
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="filter-pill"
            :class="{ 'is-active': filter === cat.value }"
            type="button"
            :aria-pressed="String(filter === cat.value)"
            @click="setFilter(cat.value)"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="catalog-bar">
      <p class="catalog-count" aria-live="polite">{{ countText }}</p>
      <div class="view-toggle" role="tablist" aria-label="Catalog view">
        <button
          class="filter-pill"
          :class="{ 'is-active': view === 'grid' }"
          type="button"
          :aria-pressed="String(view === 'grid')"
          @click="view = 'grid'"
        >
          ▦ Grid
        </button>
        <button
          class="filter-pill"
          :class="{ 'is-active': view === 'grid2' }"
          type="button"
          :aria-pressed="String(view === 'grid2')"
          @click="view = 'grid2'"
        >
          ▣ Grid 2
        </button>
        <button
          class="filter-pill"
          :class="{ 'is-active': view === 'sections' }"
          type="button"
          :aria-pressed="String(view === 'sections')"
          @click="view = 'sections'"
        >
          ◫ Sections
        </button>
        <button
          class="filter-pill"
          :class="{ 'is-active': view === 'types' }"
          type="button"
          :aria-pressed="String(view === 'types')"
          @click="view = 'types'"
        >
          ✦ Types
        </button>
        <button
          class="filter-pill"
          :class="{ 'is-active': view === 'list' }"
          type="button"
          :aria-pressed="String(view === 'list')"
          @click="view = 'list'"
        >
          ≡ List
        </button>
      </div>
    </div>

    <template v-if="filtered.length">
      <!-- The classic small product-tile grid: 3 rows per page -->
      <div class="product-tile-grid" v-if="view === 'grid'">
        <ProductCard
          v-for="product in pagedTiles"
          :key="product.id"
          :product="product"
          @open="$emit('open', $event)"
        />
      </div>

      <!-- Grid 2 (5173 style): category doors when "All"; hero + tiles once
           a category is chosen. Gets its own imagery later. -->
      <template v-else-if="view === 'grid2'">
        <div class="category-door-grid" v-if="!activeCategory">
          <CategoryCard
            v-for="cat in categoryGroups"
            :key="cat.key"
            :category="cat"
            interactive
            @select="setFilter($event)"
          />
        </div>
        <template v-else>
          <div class="category-hero">
            <CategoryCard :category="activeCategory" />
          </div>
          <div class="product-tile-grid">
            <ProductCard
              v-for="product in pagedTiles"
              :key="product.id"
              :product="product"
              @open="$emit('open', $event)"
            />
          </div>
        </template>
      </template>

      <!-- B2: every category as a big card followed by its tiles -->
      <div class="category-sections" v-else-if="view === 'sections'">
        <div class="category-section" v-for="cat in categoryGroups" :key="cat.key">
          <CategoryCard :category="cat" />
          <div class="product-tile-grid">
            <ProductCard
              v-for="product in cat.items"
              :key="product.id"
              :product="product"
              @open="$emit('open', $event)"
            />
          </div>
        </div>
      </div>

      <!-- A: one editorial card per product family -->
      <div class="product-grid product-grid--families" v-else-if="view === 'types'">
        <ProductFamilyCard
          v-for="fam in pagedFamilies"
          :key="fam.key"
          :family="fam"
          @open="$emit('open', $event)"
        />
      </div>

      <div class="catalog-table-wrap" v-else>
        <table class="catalog-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Size</th>
              <th>Case</th>
              <th>Price</th>
              <th><span class="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paged" :key="product.id">
              <td class="catalog-table__sku">{{ product.sku }}</td>
              <td>
                <button
                  class="catalog-table__name"
                  type="button"
                  @click="$emit('open', product.id)"
                >
                  {{ product.name }}
                </button>
              </td>
              <td class="catalog-table__size">{{ sizeBadge(product.name) || "—" }}</td>
              <td>{{ caseInfo(product) || "—" }}</td>
              <td class="catalog-table__price">
                {{ priceLabel(product.price) }}
              </td>
              <td class="catalog-table__actions">
                <button class="inline-button" type="button" @click="add(product.id)">
                  Add
                </button>
                <a
                  class="inline-button inline-button--wa"
                  :href="buildWhatsAppLink(product)"
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <p class="catalog-empty" v-else>No products match your search.</p>

    <nav class="pagination" v-if="totalPages > 1" aria-label="Catalog pages">
      <button class="filter-pill" type="button" :disabled="page === 1" @click="goTo(page - 1)">
        Previous
      </button>
      <template v-for="(n, i) in pageNumbers" :key="n">
        <span class="pagination__gap" v-if="i > 0 && n - pageNumbers[i - 1] > 1">…</span>
        <button
          class="filter-pill"
          :class="{ 'is-active': n === page }"
          type="button"
          @click="goTo(n)"
        >
          {{ n }}
        </button>
      </template>
      <button
        class="filter-pill"
        type="button"
        :disabled="page === totalPages"
        @click="goTo(page + 1)"
      >
        Next
      </button>
    </nav>
  </section>
</template>
