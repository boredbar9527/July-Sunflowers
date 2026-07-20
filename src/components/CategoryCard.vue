<script setup>
defineProps({
  category: { type: Object, required: true },
  // Interactive cards act as a door: the whole card is clickable and
  // narrows the shop to this category. Static cards are section headers.
  interactive: { type: Boolean, default: false }
});

defineEmits(["select"]);
</script>

<template>
  <component
    :is="interactive ? 'button' : 'article'"
    :type="interactive ? 'button' : undefined"
    class="product-card collection-card"
    :class="[`product-card--${category.accent}`, { 'collection-card--clickable': interactive }]"
    @click="interactive && $emit('select', category.key)"
  >
    <div class="product-card__meta">
      <span class="pill">Collection</span>
      <strong>
        {{ category.familyCount }} type{{ category.familyCount === 1 ? "" : "s" }} ·
        {{ category.items.length }} size{{ category.items.length === 1 ? "" : "s" }}
      </strong>
    </div>

    <div class="product-card__body">
      <div>
        <h3>{{ category.label }}</h3>
        <p class="product-card__price">{{ category.priceText }}</p>
        <p>{{ category.description }}</p>
        <span class="inline-button collection-card__cta" v-if="interactive">
          Browse {{ category.label }} →
        </span>
      </div>

      <div class="product-card__visual" v-if="category.image">
        <img :src="category.image" :alt="category.label" loading="lazy" />
      </div>
      <div class="product-card__visual family-card__art" v-else aria-hidden="true">
        <span class="product-tile__art-brand">July Sunflowers</span>
        <strong class="family-card__art-title family-card__art-title--label">{{ category.label }}</strong>
      </div>
    </div>
  </component>
</template>
