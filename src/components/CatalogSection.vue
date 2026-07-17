<script setup>
import { computed, ref, watch } from "vue";
import ProductCard from "./ProductCard.vue";
import { useCart } from "../composables/useCart.js";
import { buildWhatsAppLink, formatPrice } from "../config.js";

const { add } = useCart();

const props = defineProps({
  products: { type: Array, required: true },
  filter: { type: String, default: "all" }
});

const emit = defineEmits(["open", "update:filter"]);

const PAGE_SIZE = 24;
const search = ref("");
const page = ref(1);
const view = ref("grid"); // "grid" | "list"

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

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)));
const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return filtered.value.slice(start, start + PAGE_SIZE);
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

function setFilter(value) {
  emit("update:filter", value);
}

function goTo(next) {
  page.value = Math.min(Math.max(1, next), totalPages.value);
  document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
}

function caseInfo(product) {
  const spec = product.specs?.[0] ?? "";
  return spec.startsWith("Case: ") ? spec.slice(6) : spec;
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
      <p class="catalog-count" aria-live="polite">
        {{ filtered.length }} product{{ filtered.length === 1 ? "" : "s" }}
      </p>
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
          :class="{ 'is-active': view === 'list' }"
          type="button"
          :aria-pressed="String(view === 'list')"
          @click="view = 'list'"
        >
          ≡ List
        </button>
      </div>
    </div>

    <template v-if="paged.length">
      <div class="product-tile-grid" v-if="view === 'grid'">
        <ProductCard
          v-for="product in paged"
          :key="product.id"
          :product="product"
          @open="$emit('open', $event)"
        />
      </div>

      <div class="catalog-table-wrap" v-else>
        <table class="catalog-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
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
              <td>{{ caseInfo(product) || "—" }}</td>
              <td class="catalog-table__price">
                {{ formatPrice(product.price) ?? "Ask" }}
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
