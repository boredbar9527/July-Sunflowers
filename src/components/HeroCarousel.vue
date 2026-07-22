<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  slides: { type: Array, required: true },
  interval: { type: Number, default: 5500 }
});
const emit = defineEmits(["shop"]);

const index = ref(0);
let timer = null;

const current = computed(() => props.slides[index.value] ?? null);

function go(next) {
  const n = props.slides.length;
  index.value = ((next % n) + n) % n;
}
function next() { go(index.value + 1); }
function prev() { go(index.value - 1); }

function start() {
  stop();
  if (props.slides.length > 1) timer = setInterval(next, props.interval);
}
function stop() {
  if (timer) { clearInterval(timer); timer = null; }
}

onMounted(start);
onBeforeUnmount(stop);
</script>

<template>
  <section
    class="promo"
    aria-roledescription="carousel"
    aria-label="Promotions"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <div class="promo__viewport">
      <article
        v-for="(slide, i) in slides"
        :key="slide.key"
        class="promo__slide"
        :class="{ 'is-active': i === index, 'promo__slide--banner': slide.banner }"
        :aria-hidden="String(i !== index)"
      >
        <!-- Ready-made marketing banner (image with baked-in text) + CTA -->
        <div
          v-if="slide.banner"
          class="promo__banner"
          role="button"
          tabindex="0"
          :aria-label="slide.cta"
          @click="emit('shop', slide.filter)"
          @keydown.enter="emit('shop', slide.filter)"
        >
          <img :src="slide.banner" :alt="slide.title" />
          <span class="promo__banner-cta">
            {{ slide.cta || "Shop now" }} <span aria-hidden="true">→</span>
          </span>
        </div>

        <!-- Derived layout: copy + representative product photo -->
        <template v-else>
          <div class="promo__copy">
            <p class="promo__eyebrow">{{ slide.eyebrow }} · {{ slide.itemCount }} items</p>
            <h2 class="promo__title">{{ slide.title }}</h2>
            <p class="promo__text">{{ slide.text }}</p>
            <button class="btn btn--cart btn--lg" type="button" @click="emit('shop', slide.filter)">
              {{ slide.cta }}
            </button>
          </div>
          <div class="promo__art">
            <img v-if="slide.image" :src="slide.image" :alt="slide.eyebrow" />
          </div>
        </template>
      </article>
    </div>

    <button class="promo__arrow promo__arrow--prev" type="button" aria-label="Previous promotion" @click="prev">‹</button>
    <button class="promo__arrow promo__arrow--next" type="button" aria-label="Next promotion" @click="next">›</button>

    <div class="promo__dots" role="tablist">
      <button
        v-for="(slide, i) in slides"
        :key="slide.key"
        class="promo__dot"
        :class="{ 'is-active': i === index }"
        type="button"
        role="tab"
        :aria-selected="String(i === index)"
        :aria-label="`Go to ${slide.eyebrow}`"
        @click="go(i)"
      ></button>
    </div>
  </section>
</template>
