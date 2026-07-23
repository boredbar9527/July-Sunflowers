<script setup>
import { computed } from "vue";
import { useCart } from "../composables/useCart.js";
import { buildWhatsAppLink, priceLabel } from "../config.js";
import { sizeBadge, caseInfo, hasPhoto } from "../utils/product.js";

const props = defineProps({
  product: { type: Object, required: true },
  compareMode: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  selectDisabled: { type: Boolean, default: false }
});

defineEmits(["open", "toggle-select"]);

const { add, setQty, qtyOf } = useCart();

const inCart = computed(() => qtyOf(props.product.id));
const badge = computed(() => sizeBadge(props.product.name));
const packInfo = computed(() => caseInfo(props.product));
const photo = computed(() => hasPhoto(props.product.image));
const hoverPhoto = computed(() => hasPhoto(props.product.hoverImage));
const artTitle = computed(() => badge.value || props.product.categoryLabel);
</script>

<template>
  <article class="pcard" :class="{ 'is-selected': compareMode && selected }">
    <span v-if="product.badge" class="pcard__badge">{{ product.badge }}</span>
    <label
      v-if="compareMode"
      class="pcard__check"
      :class="{ 'is-disabled': selectDisabled && !selected }"
      @click.stop
      :title="selectDisabled && !selected ? 'Compare list is full (4)' : 'Add to compare'"
    >
      <input
        type="checkbox"
        :checked="selected"
        :disabled="selectDisabled && !selected"
        @change="$emit('toggle-select', product.id)"
      />
    </label>
    <button
      class="pcard__media"
      type="button"
      :aria-label="`View details for ${product.name}`"
      @click="$emit('open', product.id)"
    >
      <template v-if="photo">
        <img
          class="pcard__img pcard__img--main"
          :class="{ 'has-hover': hoverPhoto }"
          :src="product.image"
          :alt="product.name"
          loading="lazy"
        />
        <img
          v-if="hoverPhoto"
          class="pcard__img pcard__img--hover"
          :src="product.hoverImage"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </template>
      <span v-else class="pcard__art" aria-hidden="true">
        <span class="pcard__art-brand">July Sunflowers</span>
        <strong class="pcard__art-title" :class="{ 'is-long': artTitle.length > 9 }">
          {{ artTitle }}
        </strong>
        <span class="pcard__art-sub" v-if="packInfo">case · {{ packInfo }}</span>
      </span>
    </button>

    <div class="pcard__body">
      <h3 class="pcard__name">
        <button type="button" @click="$emit('open', product.id)">{{ product.name }}</button>
      </h3>

      <p class="pcard__item">Item #: <span>{{ product.sku }}</span></p>

      <p class="pcard__desc" v-if="product.story">{{ product.story }}</p>

      <p class="pcard__price">
        <strong>{{ priceLabel(product.price) }}</strong>
        <span class="pcard__each" v-if="product.price !== null">/Case</span>
      </p>
      <p class="pcard__case" v-if="packInfo">{{ packInfo }} per case</p>

      <div class="pcard__actions">
        <div v-if="inCart" class="sv-qty">
          <button type="button" @click="setQty(product.id, inCart - 1)" aria-label="Decrease">−</button>
          <span>{{ inCart }}</span>
          <button type="button" @click="setQty(product.id, inCart + 1)" aria-label="Increase">+</button>
        </div>
        <button
          class="sv-btn sv-btn--cart"
          type="button"
          @click="add(product.id)"
        >
          {{ inCart ? "Add another" : "Add to Cart" }}
        </button>
      </div>
      <a
        class="pcard__wa"
        :href="buildWhatsAppLink(product)"
        target="_blank"
        rel="noopener"
      >
        Quick quote via WhatsApp
      </a>
    </div>
  </article>
</template>
