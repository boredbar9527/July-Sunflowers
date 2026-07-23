import "./styles.css";
import { createApp } from "vue";
import ShopApp from "./components/ShopApp.vue";

const proofPoints = [
  {
    title: "Premium daily essentials",
    copy:
      "A warmer retail identity for the products people touch every day.",
    stat: "Soft touch"
  },
  {
    title: "Responsibly positioned",
    copy:
      "Built around FSC-minded sourcing, cleaner packaging language, and practical household use.",
    stat: "FSC focus"
  },
  {
    title: "Septic-safe bath tissue",
    copy:
      "Comfort, strength, and quick-dissolving performance without the hard-sell branding.",
    stat: "Home ready"
  }
];

const storyHighlights = [
  "Inspired by the warmth, brightness, and resilience of midsummer sunflowers.",
  "Designed to feel softer and more elevated than generic tissue aisle packaging.",
  "Balanced for home use, light commercial placement, and bulk-friendly distribution."
];

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="July Sunflowers home">
        <img class="brand__logo" src="/assets/logo-LCTJEtBP.png" alt="July Sunflowers logo" />
        <div class="brand__text">
          <span class="brand__eyebrow">Sunny softness</span>
          <strong>July Sunflowers</strong>
        </div>
      </a>

      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        Menu
      </button>

      <div class="site-header__right">
        <nav id="site-nav" class="site-nav" aria-label="Primary">
          <a href="#top">Home</a>
          <a href="#collections">Collections</a>
          <a href="#story">Story</a>
          <a href="#contact">Contact</a>
        </nav>

        <a class="header-chip" href="mailto:info@jsf2024.com">info@jsf2024.com</a>
        <span id="cart-slot"></span>
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
            <a class="button button--secondary" href="#collections">Browse the catalog</a>
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

        <div class="hero__stage" data-reveal>
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
          ${proofPoints
            .map(
              (item) => `
                <article class="proof-card" data-reveal>
                  <span class="proof-card__stat">${item.stat}</span>
                  <h3>${item.title}</h3>
                  <p>${item.copy}</p>
                </article>
              `
            )
            .join("")}
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
            <button class="inline-button" type="button" data-filter-select="facial">
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
            <button class="inline-button" type="button" data-filter-select="bath">
              Filter bath tissue
            </button>
          </div>
          <div class="category-card__visual">
            <img src="/assets/bath-tissue-24-box-group-CognT1FQ.png" alt="Bath tissue packaging" />
          </div>
        </article>
      </section>

      <section class="products section" id="collections">
        <div class="section-head" data-reveal>
          <div>
            <p class="eyebrow">Collection explorer</p>
            <h2>Choose the format that fits the room, routine, or run size.</h2>
          </div>
        </div>

        <div id="shop-root"></div>
      </section>

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
            ${storyHighlights
              .map(
                (line) => `
                  <div class="story-list__item">
                    <span></span>
                    <p>${line}</p>
                  </div>
                `
              )
              .join("")}
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
            <strong>+1 (909) 828-3565</strong>
          </a>
          <a class="contact-card" href="mailto:info@jsf2024.com" data-reveal>
            <span class="contact-card__label">Email</span>
            <strong>info@jsf2024.com</strong>
          </a>
          <div class="contact-card" data-reveal>
            <span class="contact-card__label">Address</span>
            <strong>5595 Daniels St STE B<br>Chino, CA 91710<br>United States</strong>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© 2026 July Sunflowers</p>
      <p>Sunny softness. Pure joy.</p>
    </footer>

  </div>
`;

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const heroStage = document.querySelector(".hero__stage");

// The category cards' "Filter facial/bath" buttons now simply lead to the
// full catalog — the shop section owns its own category filtering.
document.addEventListener("click", (event) => {
  const categoryTrigger = event.target.closest("[data-filter-select]");
  if (categoryTrigger) {
    document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

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

document.querySelectorAll("[data-reveal]").forEach((node) => {
  revealObserver.observe(node);
});

heroStage.addEventListener("pointermove", (event) => {
  const rect = heroStage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  heroStage.style.setProperty("--pointer-x", `${x * 18}px`);
  heroStage.style.setProperty("--pointer-y", `${y * 18}px`);
});

heroStage.addEventListener("pointerleave", () => {
  heroStage.style.setProperty("--pointer-x", "0px");
  heroStage.style.setProperty("--pointer-y", "0px");
});

// Vue island: the shop section (catalog, product drawer, cart) mounts after
// the static page markup above exists, so the #cart-slot Teleport target is
// already in the DOM.
createApp(ShopApp).mount("#shop-root");
