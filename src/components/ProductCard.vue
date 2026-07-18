<script setup>
import { computed } from "vue";
import { useCart } from "../composables/useCart.js";
import { buildWhatsAppLink, priceLabel } from "../config.js";

const props = defineProps({
  product: { type: Object, required: true }
});

defineEmits(["open"]);

const { add, setQty, qtyOf } = useCart();

const inCart = computed(() => qtyOf(props.product.id));

const caseInfo = computed(() => {
  const spec = props.product.specs?.[0] ?? "";
  return spec.startsWith("Case: ") ? spec.slice(6) : spec;
});
</script>

<template>
  <article class="product-tile" :class="`product-tile--${product.accent}`">
    <button
      class="product-tile__media"
      type="button"
      :aria-label="`View details for ${product.name}`"
      @click="$emit('open', product.id)"
    >
      <img :src="product.image" :alt="product.name" loading="lazy" />
    </button>

    <div class="product-tile__body">
      <div class="product-tile__meta">
        <span class="pill">{{ product.categoryLabel }}</span>
        <span class="product-tile__sku">{{ product.sku }}</span>
      </div>

      <h3 class="product-tile__name">
        <button type="button" @click="$emit('open', product.id)">{{ product.name }}</button>
      </h3>

      <p class="product-tile__price">
        <strong>{{ priceLabel(product.price) }}</strong>
        <span v-if="caseInfo">/ case · {{ caseInfo }}</span>
      </p>

      <div class="product-tile__actions">
        <button
          v-if="!inCart"
          class="button button--primary product-tile__order"
          type="button"
          @click="add(product.id)"
        >
          Add to order
        </button>
        <div v-else class="qty-stepper qty-stepper--tile">
          <button type="button" @click="setQty(product.id, inCart - 1)" aria-label="Decrease">−</button>
          <span>{{ inCart }} case{{ inCart === 1 ? "" : "s" }}</span>
          <button type="button" @click="setQty(product.id, inCart + 1)" aria-label="Increase">+</button>
        </div>
        <a
          class="inline-button inline-button--wa product-tile__wa"
          :href="buildWhatsAppLink(product)"
          target="_blank"
          rel="noopener"
        >
          or order via WhatsApp
        </a>
      </div>
    </div>
  </article>
</template>
