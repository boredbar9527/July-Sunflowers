<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useCart } from "../composables/useCart.js";
import { buildWhatsAppLink, buildEmailLink, priceLabel } from "../config.js";
import { sizeBadge, hasPhoto } from "../utils/product.js";

const props = defineProps({
  product: { type: Object, default: null },
  canPrev: { type: Boolean, default: false },
  canNext: { type: Boolean, default: false }
});

defineEmits(["close", "prev", "next"]);

const { add, setQty, qtyOf } = useCart();

const inCart = computed(() => (props.product ? qtyOf(props.product.id) : 0));
const heroPhoto = computed(() => hasPhoto(props.product?.heroImage));
const artTitle = computed(
  () => sizeBadge(props.product?.name ?? "") || props.product?.categoryLabel || ""
);

// Copy a shareable deep link to this product.
const copied = ref(false);
let copyTimer;
async function copyLink() {
  if (!props.product) return;
  const url = `${window.location.origin}/product/${props.product.id}`;
  try {
    await navigator.clipboard.writeText(url);
    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied.value = false), 1800);
  } catch {
    /* clipboard unavailable — ignore */
  }
}

// --- Focus management ------------------------------------------------------
// When the drawer opens we move focus to the close button and trap Tab within
// the panel; on close we restore focus to wherever the user came from.
const panel = ref(null);
const closeBtn = ref(null);
let lastFocused = null;

watch(
  () => props.product,
  async (product, previous) => {
    copied.value = false;
    if (product && !previous) {
      lastFocused = document.activeElement;
      await nextTick();
      closeBtn.value?.focus();
    } else if (!product && previous) {
      lastFocused?.focus?.();
      lastFocused = null;
    }
  }
);

function onKeydown(event) {
  if (event.key !== "Tab" || !panel.value) return;
  const focusable = panel.value.querySelectorAll(
    'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
</script>

<template>
  <div class="product-drawer" :hidden="!product" :aria-hidden="String(!product)">
    <button
      class="product-drawer__backdrop"
      type="button"
      aria-label="Close product details"
      @click="$emit('close')"
    ></button>
    <aside
      class="product-drawer__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      ref="panel"
      v-if="product"
      @keydown="onKeydown"
    >
      <button
        class="product-drawer__close"
        type="button"
        aria-label="Close product details"
        ref="closeBtn"
        @click="$emit('close')"
      >
        Close
      </button>
      <div class="product-drawer__media">
        <div class="product-drawer__media-card">
          <img v-if="heroPhoto" :src="product.heroImage" :alt="product.name" />
          <div v-else class="product-drawer__art" aria-hidden="true">
            <span class="product-tile__art-brand">July Sunflowers</span>
            <strong class="product-drawer__art-title">{{ artTitle }}</strong>
            <span class="product-drawer__art-sub">{{ product.name }}</span>
          </div>
        </div>
      </div>
      <div class="product-drawer__copy">
        <div class="product-drawer__nav">
          <button
            class="drawer-nav-btn"
            type="button"
            :disabled="!canPrev"
            aria-label="Previous product"
            @click="$emit('prev')"
          >
            ‹ Prev
          </button>
          <button
            class="drawer-nav-btn"
            type="button"
            :disabled="!canNext"
            aria-label="Next product"
            @click="$emit('next')"
          >
            Next ›
          </button>
        </div>
        <p class="eyebrow">{{ product.categoryLabel }} / {{ product.sku }}</p>
        <h2 id="drawer-title">{{ product.name }}</h2>
        <p class="product-drawer__price">{{ priceLabel(product.price) }}</p>
        <p class="product-drawer__mood" v-if="product.mood">{{ product.mood }}</p>
        <p class="product-drawer__story" v-if="product.story">{{ product.story }}</p>
        <p class="product-drawer__description" v-if="product.description">
          {{ product.description }}
        </p>
        <div class="product-drawer__specs" v-if="product.specs?.length">
          <span class="spec-chip" v-for="spec in product.specs" :key="spec">{{ spec }}</span>
        </div>

        <div class="product-drawer__cart">
          <button
            v-if="!inCart"
            class="button button--primary"
            type="button"
            @click="add(product.id)"
          >
            Add to order
          </button>
          <div v-else class="qty-stepper">
            <button type="button" @click="setQty(product.id, inCart - 1)" aria-label="Decrease">−</button>
            <span>{{ inCart }} case{{ inCart === 1 ? "" : "s" }}</span>
            <button type="button" @click="setQty(product.id, inCart + 1)" aria-label="Increase">+</button>
          </div>
        </div>

        <div class="product-drawer__order">
          <a
            class="button button--secondary"
            :href="buildWhatsAppLink(product)"
            target="_blank"
            rel="noopener"
          >
            Order via WhatsApp
          </a>
          <a class="button button--secondary" :href="buildEmailLink(product)">
            Order via Email
          </a>
        </div>

        <button class="product-drawer__copy-link" type="button" @click="copyLink">
          {{ copied ? "✓ Link copied" : "🔗 Copy link" }}
        </button>
      </div>
    </aside>
  </div>
</template>
