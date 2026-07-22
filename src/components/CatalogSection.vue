<script setup>
import { computed, ref, watch } from "vue";
import ProductCard from "./ProductCard.vue";
import { categorySet, departmentForKey } from "../data/departments.js";
import { priceLabel } from "../config.js";
import { caseInfo } from "../utils/product.js";
import { useCart } from "../composables/useCart.js";

const { add } = useCart();

const props = defineProps({
  products: { type: Array, required: true },
  filter: { type: String, default: "all" },
  search: { type: String, default: "" }
});

const emit = defineEmits(["open", "update:filter", "update:search"]);

const PAGE_SIZE = 24;
const page = ref(1);
const sort = ref("featured");

// --- Compare products ----------------------------------------------------
const MAX_COMPARE = 4;
const compareOn = ref(false);
const compareIds = ref([]);
const showCompareView = ref(false);

const compareProducts = computed(() =>
  compareIds.value.map((id) => props.products.find((p) => p.id === id)).filter(Boolean)
);
const compareFull = computed(() => compareIds.value.length >= MAX_COMPARE);

function toggleCompareMode() {
  compareOn.value = !compareOn.value;
  if (!compareOn.value) {
    compareIds.value = [];
    showCompareView.value = false;
  }
}
function toggleCompare(id) {
  const idx = compareIds.value.indexOf(id);
  if (idx >= 0) compareIds.value = compareIds.value.filter((x) => x !== id);
  else if (compareIds.value.length < MAX_COMPARE) compareIds.value = [...compareIds.value, id];
}
function removeCompare(id) {
  compareIds.value = compareIds.value.filter((x) => x !== id);
}
function clearCompare() {
  compareIds.value = [];
  showCompareView.value = false;
}

const categories = computed(() => {
  const map = new Map();
  props.products.forEach((p) => {
    const c = map.get(p.category) ?? { value: p.category, label: p.categoryLabel, count: 0 };
    c.count += 1;
    map.set(p.category, c);
  });
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
});

// Multi-select category filter. Empty array = all products. It's seeded from
// the top-nav filter (department → its member categories, single category →
// itself, "all" → empty) and then editable on its own via sidebar checkboxes.
const selectedCats = ref([]);

watch(
  () => props.filter,
  (f) => {
    if (f === "all") selectedCats.value = [];
    else {
      const set = categorySet(f);
      selectedCats.value = set ? [...set] : [f];
    }
  },
  { immediate: true }
);

function toggleCat(cat) {
  const i = selectedCats.value.indexOf(cat);
  if (i >= 0) selectedCats.value = selectedCats.value.filter((c) => c !== cat);
  else selectedCats.value = [...selectedCats.value, cat];
}
function selectAllCats() {
  selectedCats.value = [];
}

const filtered = computed(() => {
  const term = props.search.trim().toLowerCase();
  const cats = selectedCats.value;
  let list = props.products.filter((p) => {
    if (cats.length && !cats.includes(p.category)) return false;
    if (!term) return true;
    return p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
  });
  const priced = (p) => (p.price === null || p.price === "" ? Infinity : Number(p.price));
  if (sort.value === "price-asc") list = [...list].sort((a, b) => priced(a) - priced(b));
  else if (sort.value === "price-desc") list = [...list].sort((a, b) => priced(b) - priced(a));
  else if (sort.value === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)));
const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return filtered.value.slice(start, start + PAGE_SIZE);
});

const activeLabel = computed(() => {
  const cats = selectedCats.value;
  if (!cats.length) return "All Products";
  if (cats.length === 1) return categories.value.find((c) => c.value === cats[0])?.label ?? "Products";
  const dept = departmentForKey(props.filter);
  if (dept && dept.categories.length === cats.length && dept.categories.every((c) => cats.includes(c)))
    return dept.label;
  return `${cats.length} categories selected`;
});

const pageNumbers = computed(() => {
  const total = totalPages.value;
  const cur = page.value;
  const set = new Set([1, total, cur - 1, cur, cur + 1]);
  return [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
});

watch([filtered, totalPages], () => {
  if (page.value > totalPages.value) page.value = 1;
});
watch(selectedCats, () => (page.value = 1));
watch(() => props.search, () => (page.value = 1));
watch(sort, () => (page.value = 1));

function setFilter(value) {
  emit("update:filter", value);
  document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function goTo(next) {
  page.value = Math.min(Math.max(1, next), totalPages.value);
  document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <section class="shop section" id="shop">
    <nav class="shop__crumbs" aria-label="Breadcrumb">
      <button type="button" @click="setFilter('all')">Home</button>
      <span aria-hidden="true">/</span>
      <span>{{ activeLabel }}</span>
    </nav>

    <div class="shop__layout">
      <aside class="shop__sidebar" aria-label="Filters">
        <div class="filter-box">
          <div class="filter-box__head">
            <h2 class="filter-box__title">Categories</h2>
            <button
              v-if="selectedCats.length"
              type="button"
              class="filter-box__clear"
              @click="selectAllCats"
            >Clear</button>
          </div>
          <ul class="cat-list">
            <li>
              <button
                type="button"
                class="cat-list__link cat-list__all"
                :class="{ 'is-active': !selectedCats.length }"
                @click="selectAllCats"
              >
                All Products <span>{{ products.length }}</span>
              </button>
            </li>
            <li v-for="cat in categories" :key="cat.value">
              <label class="cat-list__check" :class="{ 'is-active': selectedCats.includes(cat.value) }">
                <input
                  type="checkbox"
                  :checked="selectedCats.includes(cat.value)"
                  @change="toggleCat(cat.value)"
                />
                <span class="cat-list__label">{{ cat.label }}</span>
                <span class="cat-list__count">{{ cat.count }}</span>
              </label>
            </li>
          </ul>
        </div>

        <div class="filter-box filter-box--help">
          <h2 class="filter-box__title">Need a quote?</h2>
          <p>Ordering by the case. Add items to your list and we'll confirm pricing and freight.</p>
          <a class="btn btn--ghost" href="#contact">Contact sales</a>
        </div>
      </aside>

      <div class="shop__main">
        <div class="shop__toolbar">
          <div class="shop__heading">
            <h1>{{ activeLabel }}</h1>
            <p aria-live="polite">{{ filtered.length }} item{{ filtered.length === 1 ? "" : "s" }}</p>
          </div>
          <div class="shop__tools">
            <input
              class="shop__search"
              type="search"
              placeholder="Search this catalog…"
              :value="search"
              @input="$emit('update:search', $event.target.value)"
              aria-label="Search products"
            />
            <label class="shop__sort">
              Sort
              <select v-model="sort">
                <option value="featured">Featured</option>
                <option value="name">Name (A–Z)</option>
                <option value="price-asc">Price (low to high)</option>
                <option value="price-desc">Price (high to low)</option>
              </select>
            </label>
            <button
              class="compare-toggle"
              type="button"
              role="switch"
              :aria-checked="String(compareOn)"
              @click="toggleCompareMode"
            >
              Compare Products
              <span class="compare-toggle__switch" :class="{ 'is-on': compareOn }">
                <span class="compare-toggle__knob"></span>
              </span>
            </button>
          </div>
        </div>

        <!-- Compare bar (up to 4 slots) -->
        <div class="compare-bar" v-if="compareOn">
          <div class="compare-bar__head">
            <h2>Compare Products</h2>
            <p>Choose up to four products to see a side-by-side comparison.</p>
          </div>
          <div class="compare-bar__slots">
            <div class="compare-slot" v-for="n in 4" :key="n">
              <template v-if="compareProducts[n - 1]">
                <button class="compare-slot__remove" type="button" aria-label="Remove" @click="removeCompare(compareProducts[n - 1].id)">×</button>
                <img
                  :src="compareProducts[n - 1].image"
                  :alt="compareProducts[n - 1].name"
                  v-if="!compareProducts[n - 1].image.startsWith('/assets/categories/')"
                />
                <span class="compare-slot__name">{{ compareProducts[n - 1].name }}</span>
              </template>
              <span class="compare-slot__empty" v-else>Add up to 4 items</span>
            </div>
          </div>
          <div class="compare-bar__actions">
            <button class="btn btn--cart" type="button" :disabled="compareProducts.length < 2" @click="showCompareView = true">
              Compare ({{ compareProducts.length }})
            </button>
            <button class="btn btn--ghost" type="button" :disabled="!compareProducts.length" @click="clearCompare">Clear</button>
          </div>
        </div>

        <div class="pgrid" v-if="paged.length">
          <ProductCard
            v-for="product in paged"
            :key="product.id"
            :product="product"
            :compare-mode="compareOn"
            :selected="compareIds.includes(product.id)"
            :select-disabled="compareFull"
            @open="$emit('open', $event)"
            @toggle-select="toggleCompare"
          />
        </div>
        <p class="shop__empty" v-else>No products match your search.</p>

        <nav class="pagination" v-if="totalPages > 1" aria-label="Catalog pages">
          <button class="page-btn" type="button" :disabled="page === 1" @click="goTo(page - 1)">‹ Prev</button>
          <template v-for="(n, i) in pageNumbers" :key="n">
            <span class="pagination__gap" v-if="i > 0 && n - pageNumbers[i - 1] > 1">…</span>
            <button
              class="page-btn"
              :class="{ 'is-active': n === page }"
              type="button"
              @click="goTo(n)"
            >{{ n }}</button>
          </template>
          <button class="page-btn" type="button" :disabled="page === totalPages" @click="goTo(page + 1)">Next ›</button>
        </nav>
      </div>
    </div>

    <!-- Side-by-side comparison overlay -->
    <div class="compare-view" v-if="showCompareView" @click.self="showCompareView = false">
      <div class="compare-view__panel" role="dialog" aria-label="Product comparison">
        <div class="compare-view__bar">
          <h2>Compare Products</h2>
          <button class="compare-view__close" type="button" @click="showCompareView = false">Close</button>
        </div>
        <div class="compare-view__grid" :style="{ '--cols': compareProducts.length }">
          <div class="compare-col" v-for="p in compareProducts" :key="p.id">
            <div class="compare-col__media">
              <img :src="p.image" :alt="p.name" v-if="!p.image.startsWith('/assets/categories/')" />
            </div>
            <h3 class="compare-col__name">{{ p.name }}</h3>
            <p class="compare-col__sku">Item #: {{ p.sku }}</p>
            <p class="compare-col__price">{{ priceLabel(p.price) }}</p>
            <p class="compare-col__case" v-if="caseInfo(p)">{{ caseInfo(p) }} per case</p>
            <p class="compare-col__cat">{{ p.categoryLabel }}</p>
            <button class="btn btn--cart" type="button" @click="add(p.id)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
