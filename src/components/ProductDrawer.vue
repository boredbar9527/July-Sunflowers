<script setup>
import { buildWhatsAppLink, buildEmailLink, formatPrice } from "../config.js";

const props = defineProps({
  product: { type: Object, default: null }
});

defineEmits(["close"]);
</script>

<template>
  <div class="product-drawer" :hidden="!product" :aria-hidden="String(!product)">
    <button
      class="product-drawer__backdrop"
      type="button"
      aria-label="Close product details"
      @click="$emit('close')"
    ></button>
    <aside class="product-drawer__panel" aria-labelledby="drawer-title" v-if="product">
      <button
        class="product-drawer__close"
        type="button"
        aria-label="Close product details"
        @click="$emit('close')"
      >
        Close
      </button>
      <div class="product-drawer__media">
        <div class="product-drawer__media-card">
          <img :src="product.heroImage" :alt="product.name" />
        </div>
      </div>
      <div class="product-drawer__copy">
        <p class="eyebrow">{{ product.categoryLabel }} / {{ product.sku }}</p>
        <h2 id="drawer-title">{{ product.name }}</h2>
        <p class="product-drawer__price">
          {{ formatPrice(product.price) ?? "Contact us for pricing" }}
        </p>
        <p class="product-drawer__story">{{ product.story }}</p>
        <p class="product-drawer__description">{{ product.description }}</p>
        <div class="product-drawer__specs">
          <span class="spec-chip" v-for="spec in product.specs" :key="spec">{{ spec }}</span>
        </div>
        <div class="product-drawer__order">
          <a
            class="button button--primary"
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
      </div>
    </aside>
  </div>
</template>
