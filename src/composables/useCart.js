import { computed, ref, watch } from "vue";

const STORAGE_KEY = "jsf-order-cart";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i.id && i.qty > 0) : [];
  } catch {
    return [];
  }
}

// Module-level singleton: every component shares the same cart state.
const items = ref(load());

watch(
  items,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  { deep: true }
);

const count = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0));

function add(id, qty = 1) {
  const existing = items.value.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    items.value.push({ id, qty });
  }
}

function setQty(id, qty) {
  const existing = items.value.find((item) => item.id === id);
  if (!existing) return;
  if (qty <= 0) {
    items.value = items.value.filter((item) => item.id !== id);
  } else {
    existing.qty = qty;
  }
}

function qtyOf(id) {
  return items.value.find((item) => item.id === id)?.qty ?? 0;
}

function clear() {
  items.value = [];
}

export function useCart() {
  return { items, count, add, setQty, qtyOf, clear };
}
