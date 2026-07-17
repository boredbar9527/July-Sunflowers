<script setup>
import { computed, onMounted, ref } from "vue";
import CartDrawer from "./components/CartDrawer.vue";
import CatalogSection from "./components/CatalogSection.vue";
import ProductDrawer from "./components/ProductDrawer.vue";
import { useCart } from "./composables/useCart.js";
import { useCatalog } from "./composables/useCatalog.js";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "./config.js";

const { products, source } = useCatalog();
const { count: cartCount } = useCart();

const filter = ref("all");
const navOpen = ref(false);
const cartOpen = ref(false);
const activeProductId = ref(null);
const heroStage = ref(null);
const pointer = ref({ x: "0px", y: "0px" });

const activeProduct = computed(
  () => products.value.find((p) => p.id === activeProductId.value) ?? null
);

const featuredId = computed(() => products.value[1]?.id ?? products.value[0]?.id);

const proofPoints = [
  {
    title: "Premium daily essentials",
    copy: "A warmer retail identity for the products people touch every day.",
    stat: "Soft touch"
  },
  {
    title: "Responsibly positioned",
    copy: "Built around FSC-minded sourcing, cleaner packaging language, and practical household use.",
    stat: "FSC focus"
  },
  {
    title: "Septic-safe bath tissue",
    copy: "Comfort, strength, and quick-dissolving performance without the hard-sell branding.",
    stat: "Home ready"
  }
];

const storyHighlights = [
  "Inspired by the warmth, brightness, and resilience of midsummer sunflowers.",
  "Designed to feel softer and more elevated than generic tissue aisle packaging.",
  "Balanced for home use, light commercial placement, and bulk-friendly distribution."
];

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

function selectCategory(category) {
  filter.value = category;
  document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
}

function toggleNav() {
  navOpen.value = !navOpen.value;
  document.body.classList.toggle("nav-open", navOpen.value);
}

function closeNav() {
  navOpen.value = false;
  document.body.classList.remove("nav-open");
}

function onStagePointerMove(event) {
  const rect = heroStage.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  pointer.value = { x: `${x * 18}px`, y: `${y * 18}px` };
}

function onStagePointerLeave() {
  pointer.value = { x: "0px", y: "0px" };
}

onMounted(() => {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));

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
      closeNav();
      cartOpen.value = false;
    }
  });

  const initialProduct = getRouteProductId();
  if (initialProduct) openDrawer(initialProduct, false);
});
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="July Sunflowers home">
        <img class="brand__logo" src="/assets/logo-LCTJEtBP.png" alt="July Sunflowers logo" />
        <div class="brand__text">
          <span class="brand__eyebrow">Sunny softness</span>
          <strong>July Sunflowers</strong>
        </div>
      </a>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="String(navOpen)"
        aria-controls="site-nav"
        @click="toggleNav"
      >
        Menu
      </button>

      <div class="site-header__right">
        <nav id="site-nav" class="site-nav" aria-label="Primary">
          <a href="#top" @click="closeNav">Home</a>
          <a href="#collections" @click="closeNav">Collections</a>
          <a href="#story" @click="closeNav">Story</a>
          <a href="#contact" @click="closeNav">Contact</a>
        </nav>

        <a class="header-chip" :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
        <button class="header-chip header-chip--cart" type="button" @click="cartOpen = true">
          🗒 Order<span v-if="cartCount"> ({{ cartCount }})</span>
        </button>
      </div>
    </header>

    <main>
      <section class="hero section" id="top">
        <div class="hero__copy" data-reveal>
          <p class="eyebrow">Brand refresh concept</p>
          <h1 class="hero__title">
            Paper essentials that feel
            <span>brighter than the aisle</span>
          </h1>
          <p class="hero__lede">
            July Sunflowers already had a clear product story. This redesign turns it into a warmer,
            more premium experience with stronger packaging presence, cleaner hierarchy, and a more
            intentional sense of atmosphere.
          </p>

          <div class="hero__actions">
            <a class="button button--primary" href="#collections">Explore collections</a>
            <button
              class="button button--secondary"
              type="button"
              :disabled="!featuredId"
              @click="openDrawer(featuredId)"
            >
              Open featured case
            </button>
          </div>

          <div class="hero__facts">
            <div class="metric-card">
              <span class="metric-card__label">Facial tissue</span>
              <strong>3-ply softness</strong>
            </div>
            <div class="metric-card">
              <span class="metric-card__label">Bath tissue</span>
              <strong>4-ply comfort</strong>
            </div>
            <div class="metric-card metric-card--icon">
              <img src="/assets/fsc-itqMhG3J.png" alt="FSC icon" />
              <strong>Responsible positioning</strong>
            </div>
          </div>
        </div>

        <div
          class="hero__stage"
          data-reveal
          ref="heroStage"
          :style="{ '--pointer-x': pointer.x, '--pointer-y': pointer.y }"
          @pointermove="onStagePointerMove"
          @pointerleave="onStagePointerLeave"
        >
          <div class="hero-glow hero-glow--sun"></div>
          <div class="hero-glow hero-glow--leaf"></div>
          <img class="hero-ring hero-ring--one" src="/assets/Ring_green-CB9I9mGj.png" alt="" />
          <img class="hero-ring hero-ring--two" src="/assets/Ring_blue-Dgr3Qvs1.png" alt="" />

          <div class="hero-card hero-card--primary">
            <div class="hero-card__content">
              <span class="hero-card__tag">Facial Tissue</span>
              <h2>Soft geometry, brighter packaging, cleaner shelf presence.</h2>
            </div>
            <img src="/assets/introA-D1LV2l4Y.png" alt="Facial tissue packs" />
          </div>

          <div class="hero-card hero-card--secondary">
            <div class="hero-card__content">
              <span class="hero-card__tag">Bath Tissue</span>
              <p>Comfort-led packs with a warmer retail tone.</p>
            </div>
            <img src="/assets/bath-tissue-24-group-CzUg8Czx.png" alt="Bath tissue box and rolls" />
          </div>
        </div>
      </section>

      <div class="wave-band" aria-hidden="true">
        <img src="/assets/Blue_Sharp-BfeH3kMk.png" alt="" />
      </div>

      <section class="proof section">
        <div class="section-head" data-reveal>
          <div>
            <p class="eyebrow">What changed</p>
            <h2>Less generic catalog page, more real brand world.</h2>
          </div>
          <p class="section-head__copy">
            The previous version functioned as a mirror. This version treats the product line like a
            brand people could actually remember.
          </p>
        </div>

        <div class="proof-grid">
          <article class="proof-card" data-reveal v-for="item in proofPoints" :key="item.title">
            <span class="proof-card__stat">{{ item.stat }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.copy }}</p>
          </article>
        </div>
      </section>

      <section class="categories section">
        <article class="category-card category-card--facial" data-reveal>
          <div class="category-card__copy">
            <p class="eyebrow">Collection 01</p>
            <h2>Facial tissue that feels light, clean, and giftable.</h2>
            <p>
              A softer brand expression for bedrooms, cars, cafes, front desks, and compact shelf
              moments.
            </p>
            <button class="inline-button" type="button" @click="selectCategory('facial')">
              Filter facial tissue
            </button>
          </div>
          <div class="category-card__visual">
            <img src="/assets/introA-D1LV2l4Y.png" alt="Facial tissue display" />
          </div>
        </article>

        <article class="category-card category-card--bath" data-reveal>
          <div class="category-card__copy">
            <p class="eyebrow">Collection 02</p>
            <h2>Bath tissue with a stronger, warmer household presence.</h2>
            <p>
              Built for stock-up behavior, pantry shelves, and septic-safe everyday comfort without
              the usual warehouse aesthetic.
            </p>
            <button class="inline-button" type="button" @click="selectCategory('bath')">
              Filter bath tissue
            </button>
          </div>
          <div class="category-card__visual">
            <img src="/assets/bath-tissue-24-box-group-CognT1FQ.png" alt="Bath tissue packaging" />
          </div>
        </article>
      </section>

      <CatalogSection
        :products="products"
        v-model:filter="filter"
        @open="openDrawer"
      />

      <section class="story section" id="story">
        <div class="story__copy" data-reveal>
          <p class="eyebrow">Story and tone</p>
          <h2>Warm, resilient, and a little more joyful than standard tissue branding.</h2>
          <p>
            July Sunflowers started with the right emotional idea: warmth, brightness, comfort, and
            clean daily use. The redesign pushes that idea further with richer spacing, a warmer paper
            palette, stronger product framing, and a more editorial presentation of the people and
            atmosphere around the brand.
          </p>

          <div class="story-list">
            <div class="story-list__item" v-for="line in storyHighlights" :key="line">
              <span></span>
              <p>{{ line }}</p>
            </div>
          </div>
        </div>

        <div class="story__visual" data-reveal>
          <div class="collage collage--large">
            <img src="/assets/founder-2-DetXMqVk.jpg" alt="Brand story moment" />
          </div>
          <div class="collage collage--small collage--product">
            <img src="/assets/bath-tissue-24-box-6EgTFqhB.png" alt="Bath tissue box" />
          </div>
          <div class="collage collage--small">
            <img src="/assets/founder-3-DTGoNZbi.jpg" alt="Founder portrait" />
          </div>
          <div class="collage collage--wide">
            <img src="/assets/founder-1-tzXmZdUA.jpg" alt="Performance portrait" />
          </div>
        </div>
      </section>

      <section class="contact section" id="contact">
        <div class="contact__intro" data-reveal>
          <p class="eyebrow">Contact</p>
          <h2>Ready for retail, wholesale, and direct conversations.</h2>
          <p>
            The product line already exists. This redesign simply gives it a sharper front door.
          </p>
        </div>

        <div class="contact-grid">
          <a class="contact-card" href="tel:+19098283565" data-reveal>
            <span class="contact-card__label">Phone</span>
            <strong>{{ CONTACT_PHONE_DISPLAY }}</strong>
          </a>
          <a class="contact-card" :href="`mailto:${CONTACT_EMAIL}`" data-reveal>
            <span class="contact-card__label">Email</span>
            <strong>{{ CONTACT_EMAIL }}</strong>
          </a>
          <div class="contact-card" data-reveal>
            <span class="contact-card__label">Address</span>
            <strong>5595 Daniels St STE B<br />Chino, CA 91710<br />United States</strong>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© 2026 July Sunflowers</p>
      <p>Sunny softness. Pure joy.</p>
    </footer>

    <ProductDrawer :product="activeProduct" @close="closeDrawer" />
    <CartDrawer :open="cartOpen" :products="products" @close="cartOpen = false" />
  </div>
</template>
