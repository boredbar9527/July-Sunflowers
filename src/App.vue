<script setup>
import { computed, onMounted, ref, watch } from "vue";
import CartDrawer from "./components/CartDrawer.vue";
import CatalogSection from "./components/CatalogSection.vue";
import HeroCarousel from "./components/HeroCarousel.vue";
import ProductDrawer from "./components/ProductDrawer.vue";
import { useCart } from "./composables/useCart.js";
import { useCatalog } from "./composables/useCatalog.js";
import { groupCategories } from "./utils/categories.js";
import { DEPARTMENTS } from "./data/departments.js";
import { PROMO_COPY } from "./data/promos.js";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, STORE_ADDRESS } from "./config.js";

const { products } = useCatalog();
const { count: cartCount } = useCart();

const filter = ref("all");
const search = ref("");
const navOpen = ref(false);
const cartOpen = ref(false);
const activeProductId = ref(null);

const categoryCards = computed(() => groupCategories(products.value));

// Each functional department paired with the type-category cards it contains,
// for the top-nav mega-menu.
const departmentMenus = computed(() =>
  DEPARTMENTS.map((dept) => ({
    ...dept,
    cats: dept.categories
      .map((key) => categoryCards.value.find((c) => c.key === key))
      .filter(Boolean)
  }))
);

// Promo slides for the hero carousel — one per department.
const heroSlides = computed(() =>
  departmentMenus.value.map((dept) => {
    const copy = PROMO_COPY[dept.key] ?? {};
    return {
      key: dept.key,
      filter: dept.key,
      eyebrow: dept.label,
      title: copy.title ?? `Shop ${dept.label}`,
      text: copy.text ?? "",
      cta: copy.cta ?? `Shop ${dept.label}`,
      banner: copy.banner ?? null,
      image: copy.image ?? dept.cats.find((c) => c.image)?.image ?? null,
      itemCount: dept.cats.reduce((sum, c) => sum + c.items.length, 0)
    };
  })
);

const activeProduct = computed(
  () => products.value.find((p) => p.id === activeProductId.value) ?? null
);

const BASE_TITLE = "July Sunflowers | Wholesale Foodservice Packaging & Supplies";
watch(activeProduct, (product) => {
  document.title = product ? `${product.name} — July Sunflowers` : BASE_TITLE;
});

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

function shopCategory(category) {
  filter.value = category;
  document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
  closeNav();
}
function submitSearch() {
  filter.value = "all";
  document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleNav() {
  navOpen.value = !navOpen.value;
  document.body.classList.toggle("nav-open", navOpen.value);
}
function closeNav() {
  navOpen.value = false;
  document.body.classList.remove("nav-open");
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
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));

  window.addEventListener("popstate", () => {
    const productId = getRouteProductId();
    if (productId) openDrawer(productId, false);
    else closeDrawer(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
      closeNav();
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
  <div class="site-shell">
    <!-- Utility bar -->
    <div class="utility-bar">
      <div class="utility-bar__inner">
        <span class="utility-bar__tag">Wholesale foodservice packaging &amp; disposables — shipped by the case</span>
        <div class="utility-bar__links">
          <a :href="`tel:${CONTACT_PHONE_TEL}`">📞 {{ CONTACT_PHONE_DISPLAY }}</a>
          <a :href="`mailto:${CONTACT_EMAIL}`">✉ {{ CONTACT_EMAIL }}</a>
        </div>
      </div>
    </div>

    <!-- Main header -->
    <header class="masthead">
      <div class="masthead__inner">
        <a class="brand" href="/" aria-label="July Sunflowers home">
          <img class="brand__logo" src="/assets/logo-LCTJEtBP.png" alt="July Sunflowers logo" />
          <span class="brand__text">
            <strong>July Sunflowers</strong>
            <span class="brand__sub">Foodservice Supply</span>
          </span>
        </a>

        <form class="searchbar" role="search" @submit.prevent="submitSearch">
          <input
            v-model="search"
            type="search"
            class="searchbar__input"
            placeholder="Search 230+ products by name or item #…"
            aria-label="Search products"
          />
          <button class="searchbar__btn" type="submit" aria-label="Search">
            <span aria-hidden="true">🔍</span>
            <span class="searchbar__btn-label">Search</span>
          </button>
        </form>

        <div class="masthead__actions">
          <a class="acct-chip" :href="`mailto:${CONTACT_EMAIL}`">
            <span class="acct-chip__icon" aria-hidden="true">👤</span>
            <span class="acct-chip__text"><small>Wholesale</small>Account</span>
          </a>
          <button class="acct-chip acct-chip--cart" type="button" @click="cartOpen = true">
            <span class="acct-chip__icon" aria-hidden="true">🛒</span>
            <span class="acct-chip__text"><small>Your list</small>Cart<em v-if="cartCount">{{ cartCount }}</em></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Department nav with mega-menu -->
    <nav class="catnav" aria-label="Shop departments">
      <div class="catnav__inner">
        <button class="catnav__all" type="button" @click="shopCategory('all')">
          <span aria-hidden="true">☰</span> All Products
        </button>
        <button class="catnav__toggle" type="button" @click="toggleNav" :aria-expanded="String(navOpen)">
          Departments ▾
        </button>
        <div class="catnav__links" :class="{ 'is-open': navOpen }">
          <div class="megawrap" v-for="dept in departmentMenus" :key="dept.key">
            <button class="megawrap__label" type="button" @click="shopCategory(dept.key)">
              {{ dept.label }} <span class="megawrap__caret" aria-hidden="true">▾</span>
            </button>
            <div class="megamenu">
              <div class="megamenu__inner">
                <div class="megamenu__head">
                  <span>{{ dept.label }}</span>
                  <button type="button" @click="shopCategory(dept.key)">Shop all ›</button>
                </div>
                <div class="megamenu__grid">
                  <button
                    v-for="cat in dept.cats"
                    :key="cat.key"
                    class="megamenu__item"
                    type="button"
                    @click="shopCategory(cat.key)"
                  >
                    <img :src="cat.image || `/assets/categories/${cat.key}.svg`" :alt="cat.label" />
                    <span class="megamenu__item-text">
                      {{ cat.label }}<em>{{ cat.items.length }} items</em>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <!-- Hero promo carousel (covered by the department mega-menu on hover) -->
      <section class="hero" id="top">
        <HeroCarousel :slides="heroSlides" @shop="shopCategory" />
        <ul class="hero__badges">
          <li><strong>230+</strong> case-ready SKUs</li>
          <li><strong>17</strong> categories</li>
          <li><strong>Same-day</strong> quotes</li>
          <li><strong>Chino, CA</strong> warehouse</li>
        </ul>
      </section>

      <!-- Shop by category -->
      <section class="cats section" id="categories">
        <div class="cats__head">
          <h2>Shop by Category</h2>
          <p>Every case format in one place — pick a department to jump in.</p>
        </div>
        <div class="cats__grid">
          <button
            v-for="cat in categoryCards"
            :key="cat.key"
            class="cat-tile"
            type="button"
            data-reveal
            @click="shopCategory(cat.key)"
          >
            <span class="cat-tile__art" :class="{ 'is-photo': cat.image }">
              <img :src="cat.image || `/assets/categories/${cat.key}.svg`" :alt="cat.label" />
            </span>
            <span class="cat-tile__label">{{ cat.label }}</span>
            <span class="cat-tile__count">{{ cat.items.length }} items · from {{ cat.priceText.split(" ")[0] }}</span>
          </button>
        </div>
      </section>

      <CatalogSection
        :products="products"
        v-model:filter="filter"
        v-model:search="search"
        @open="openDrawer"
      />

      <!-- Contact -->
      <section class="contact section" id="contact">
        <div class="contact__inner">
          <div class="contact__intro">
            <h2>Ready to place a wholesale order?</h2>
            <p>Build your list, then send it over — we confirm availability, case pricing, and freight the same business day.</p>
          </div>
          <div class="contact__cards">
            <a class="contact-card" :href="`tel:${CONTACT_PHONE_TEL}`">
              <span>Phone</span><strong>{{ CONTACT_PHONE_DISPLAY }}</strong>
            </a>
            <a class="contact-card" :href="`mailto:${CONTACT_EMAIL}`">
              <span>Email</span><strong>{{ CONTACT_EMAIL }}</strong>
            </a>
            <div class="contact-card">
              <span>Warehouse</span><strong>{{ STORE_ADDRESS }}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__brand">
          <img src="/assets/logo-LCTJEtBP.png" alt="July Sunflowers" />
          <p>Wholesale foodservice packaging &amp; disposables, shipped by the case from Chino, California.</p>
        </div>
        <div class="site-footer__col">
          <h3>Shop</h3>
          <button v-for="dept in DEPARTMENTS" :key="dept.key" type="button" @click="shopCategory(dept.key)">{{ dept.label }}</button>
        </div>
        <div class="site-footer__col">
          <h3>Company</h3>
          <a href="#top">Home</a>
          <a href="#categories">Categories</a>
          <a href="#contact">Contact</a>
        </div>
        <div class="site-footer__col">
          <h3>Contact</h3>
          <a :href="`tel:${CONTACT_PHONE_TEL}`">{{ CONTACT_PHONE_DISPLAY }}</a>
          <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
          <span>{{ STORE_ADDRESS }}</span>
        </div>
      </div>
      <div class="site-footer__bar">
        <p>© 2026 July Sunflowers</p>
        <p>Sunny softness. Serious supply.</p>
      </div>
    </footer>

    <ProductDrawer
      :product="activeProduct"
      :can-prev="canPrev"
      :can-next="canNext"
      @close="closeDrawer"
      @prev="goPrev"
      @next="goNext"
    />
    <CartDrawer :open="cartOpen" :products="products" @close="cartOpen = false" />
  </div>
</template>
