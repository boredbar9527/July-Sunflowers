<script setup>
defineProps({
  family: { type: Object, required: true }
});

defineEmits(["open"]);
</script>

<template>
  <article
    class="product-card family-card"
    :class="[
      `product-card--${family.accent}`,
      { 'product-card--wide': family.items.length >= 6 }
    ]"
  >
    <div class="product-card__meta">
      <span class="pill">{{ family.categoryLabel }}</span>
      <strong>{{ family.items.length }} {{ family.items.length === 1 ? "option" : "sizes" }}</strong>
    </div>

    <div class="product-card__body">
      <div>
        <h3>{{ family.title }}</h3>
        <p class="product-card__price">{{ family.priceText }}</p>
        <p>{{ family.description }}</p>
      </div>

      <div class="product-card__visual" v-if="family.image">
        <img :src="family.image" :alt="family.title" loading="lazy" />
      </div>
      <div class="product-card__visual family-card__art" v-else aria-hidden="true">
        <span class="product-tile__art-brand">July Sunflowers</span>
        <strong class="family-card__art-title">{{ family.artText }}</strong>
      </div>
    </div>

    <div class="family-card__sizes" role="group" :aria-label="`${family.title} sizes`">
      <button
        v-for="v in family.variants"
        :key="v.id"
        class="spec-chip family-card__chip"
        type="button"
        :title="v.name"
        @click="$emit('open', v.id)"
      >
        {{ v.label }}
      </button>
    </div>
  </article>
</template>
