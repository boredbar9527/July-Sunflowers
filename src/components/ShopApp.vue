<script setup>
import { computed, onMounted, ref, watch } from "vue";
import ShopSection from "./ShopSection.vue";
import ProductDrawer from "./ProductDrawer.vue";
import CartDrawer from "./CartDrawer.vue";
import { useCart } from "../composables/useCart.js";
import { useCatalog } from "../composables/useCatalog.js";

const { products } = useCatalog();
const { count: cartCount } = useCart();

const filter = ref("all");
const cartOpen = ref(false);
const activeProductId = ref(null);

const activeProduct = computed(
  () => products.value.find((p) => p.id === activeProductId.value) ?? null
);

// Give shared product URLs a meaningful tab/title (client-side).
const BASE_TITLE = document.title;
watch(activeProduct, (product) => {
  document.title = product ? `${product.name} — July Sunflowers` : BASE_TITLE;
});

// Prev/next navigation through the full catalog while the drawer is open.
const activeIndex = computed(() =>
  products.value.findIndex((p) => p.id === activeProductId.value)
);
const canPrev = computed(() => activeIndex.value > 0);
const canNext = computed(
  () => activeIndex.value !== -1 && activeIndex.value < products.value.length - 1
);
function goPrev() {
  if (canPrev.value) openDrawer(products.value[activeIndex.value - 1].id);
}
function goNext() {
  if (canNext.value) openDrawer(products.value[activeIndex.value + 1].id);
}

function getRouteProductId() {
  const match = window.location.pathname.match(/^\/product\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]).toLowerCase() : null;
}

function openDrawer(productId, pushState = true) {
  activeProductId.value = productId;
  document.body.classList.add("drawer-open");
  if (pushState && window.location.pathname !== `/product/${productId}`) {
    window.history.pushState({ product: productId }, "", `/product/${productId}`);
  }
}

function closeDrawer(pushState = true) {
  activeProductId.value = null;
  document.body.classList.remove("drawer-open");
  if (pushState && window.location.pathname.startsWith("/product/")) {
    window.history.pushState({}, "", "/");
  }
}

onMounted(() => {
  window.addEventListener("popstate", () => {
    const productId = getRouteProductId();
    if (productId) {
      openDrawer(productId, false);
    } else {
      closeDrawer(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
      cartOpen.value = false;
    }
    if (activeProductId.value) {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
  });

  const initialProduct = getRouteProductId();
  if (initialProduct) openDrawer(initialProduct, false);
});
</script>

<template>
  <Teleport to="#cart-slot">
    <button class="header-chip header-chip--cart" type="button" @click="cartOpen = true">
      🗒 Order<span v-if="cartCount"> ({{ cartCount }})</span>
    </button>
  </Teleport>

  <ShopSection :products="products" v-model:filter="filter" @open="openDrawer" />

  <ProductDrawer
    :product="activeProduct"
    :can-prev="canPrev"
    :can-next="canNext"
    @close="closeDrawer"
    @prev="goPrev"
    @next="goNext"
  />
  <CartDrawer :open="cartOpen" :products="products" @close="cartOpen = false" />
</template>
