import "./styles.css";

const products = [
  {
    id: "f-10",
    sku: "F-10",
    name: "Facial Tissue 10-Pack",
    category: "facial",
    categoryLabel: "Facial Tissue",
    mood: "Daily carry",
    image: "/assets/facial-tissue-10-group-BRAQAcc1.png",
    heroImage: "/assets/introA-D1LV2l4Y.png",
    description:
      "A compact facial tissue format built for desks, cars, hospitality counters, and everyday grab-and-go use.",
    story:
      "Soft 3-ply facial tissue that keeps the brand feeling bright and premium even in a smaller footprint.",
    specs: ["10 packs", "3-ply", "110 sheets each", "174 mm x 175 mm"],
    accent: "sky"
  },
  {
    id: "fb-24",
    sku: "FB-24",
    name: "Facial Tissue 24-Pack",
    category: "facial",
    categoryLabel: "Facial Tissue",
    mood: "High-volume restock",
    image: "/assets/facial-tissue-24-box-CQ2iBBkn.png",
    heroImage: "/assets/facial-tissue-24-C_T9WZKX.png",
    description:
      "A case-sized facial tissue option for offices, retail shelves, and larger home restocks.",
    story:
      "The larger case format keeps the kraft-box feel while giving the category a more confident warehouse-to-home presence.",
    specs: ["24 packs", "3-ply", "110 sheets each", "174 mm x 175 mm"],
    accent: "leaf"
  },
  {
    id: "b-24",
    sku: "B-24",
    name: "Bath Tissue 24-Roll Box",
    category: "bath",
    categoryLabel: "Bath Tissue",
    mood: "Family-size staple",
    image: "/assets/bath-tissue-24-box-group-CognT1FQ.png",
    heroImage: "/assets/bath-tissue-24-group-CzUg8Czx.png",
    description:
      "A strong, absorbent septic-safe bath tissue format designed for pantry shelves, family homes, and recurring stock-up trips.",
    story:
      "This is the lead bath tissue format: soft in use, graphic on shelf, and sturdy enough to feel premium instead of disposable.",
    specs: [
      "24 rolls",
      "4-ply",
      "250 sheets per roll",
      "3.94 in x 4.72 in",
      "Total 774.96 sq ft"
    ],
    accent: "sand"
  },
  {
    id: "b-6",
    sku: "B-6",
    name: "Bath Tissue 6-Roll Pack",
    category: "bath",
    categoryLabel: "Bath Tissue",
    mood: "Compact household pack",
    image: "/assets/bath-tissue-6-group-D-ix8T_C.png",
    heroImage: "/assets/bath-tissue-6-CAS3RIMa.png",
    description:
      "A smaller bath tissue pack for apartments, guest bathrooms, and lighter weekly restocks.",
    story:
      "The compact pack keeps the same softness and septic-safe story while fitting smaller spaces and smaller runs.",
    specs: [
      "6 rolls",
      "4-ply",
      "250 sheets per roll",
      "3.94 in x 4.72 in",
      "Total 193.71 sq ft"
    ],
    accent: "sun"
  },
  {
    id: "bb-24",
    sku: "BB-24",
    name: "Bath Tissue 24-Roll Bundle",
    category: "bath",
    categoryLabel: "Bath Tissue",
    mood: "Bulk transparent pack",
    image: "/assets/bath-tissue-24-box-6EgTFqhB.png",
    heroImage: "/assets/bath-tissue-24-inner-BCsaK-kE.png",
    description:
      "A bulk-forward 24-roll bath tissue presentation for wholesale, backroom stocking, and value-conscious buyers.",
    story:
      "This bundle pushes the brand toward distribution-ready utility without losing the softer July Sunflowers tone.",
    specs: [
      "3 packs, transparent packaging",
      "24 rolls",
      "4-ply",
      "250 sheets per roll",
      "Total 774.96 sq ft"
    ],
    accent: "sky"
  }
];

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
            <button class="button button--secondary" type="button" data-open-product="fb-24">
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

          <div class="filters" role="tablist" aria-label="Product category filters">
            <button class="filter-pill is-active" type="button" data-filter="all" aria-pressed="true">
              All
            </button>
            <button class="filter-pill" type="button" data-filter="facial" aria-pressed="false">
              Facial Tissue
            </button>
            <button class="filter-pill" type="button" data-filter="bath" aria-pressed="false">
              Bath Tissue
            </button>
          </div>
        </div>

        <div class="product-grid">
          ${products
            .map(
              (product, index) => `
                <article
                  class="product-card product-card--${product.accent} ${index === 0 ? "product-card--wide" : ""}"
                  data-category="${product.category}"
                  data-product-card
                  data-reveal
                >
                  <div class="product-card__meta">
                    <span class="pill">${product.categoryLabel}</span>
                    <strong>${product.sku}</strong>
                  </div>
                  <div class="product-card__body">
                    <div class="product-card__copy">
                      <span class="product-card__mood">${product.mood}</span>
                      <h3>${product.name}</h3>
                      <p>${product.description}</p>
                      <ul class="spec-list">
                        ${product.specs
                          .slice(0, 3)
                          .map((spec) => `<li>${spec}</li>`)
                          .join("")}
                      </ul>
                      <button class="inline-button" type="button" data-open-product="${product.id}">
                        View details
                      </button>
                    </div>
                    <div class="product-card__visual">
                      <img src="${product.image}" alt="${product.name}" />
                    </div>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
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

    <div class="product-drawer" id="product-drawer" hidden aria-hidden="true">
      <button class="product-drawer__backdrop" type="button" aria-label="Close product details"></button>
      <aside class="product-drawer__panel" aria-labelledby="drawer-title">
        <button class="product-drawer__close" type="button" aria-label="Close product details">Close</button>
        <div class="product-drawer__media">
          <div class="product-drawer__media-card">
            <img id="drawer-image" src="" alt="" />
          </div>
        </div>
        <div class="product-drawer__copy">
          <p class="eyebrow" id="drawer-category"></p>
          <h2 id="drawer-title"></h2>
          <p class="product-drawer__story" id="drawer-story"></p>
          <p class="product-drawer__description" id="drawer-description"></p>
          <div class="product-drawer__specs" id="drawer-specs"></div>
        </div>
      </aside>
    </div>
  </div>
`;

const drawer = document.querySelector("#product-drawer");
const drawerImage = document.querySelector("#drawer-image");
const drawerCategory = document.querySelector("#drawer-category");
const drawerTitle = document.querySelector("#drawer-title");
const drawerStory = document.querySelector("#drawer-story");
const drawerDescription = document.querySelector("#drawer-description");
const drawerSpecs = document.querySelector("#drawer-specs");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const productCards = [...document.querySelectorAll("[data-product-card]")];
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const heroStage = document.querySelector(".hero__stage");

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function getRouteProductId() {
  const match = window.location.pathname.match(/^\/product\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]).toLowerCase() : null;
}

function setFilter(nextFilter) {
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === nextFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  productCards.forEach((card) => {
    const shouldShow =
      nextFilter === "all" || card.dataset.category === nextFilter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function openDrawer(productId, pushState = true) {
  const product = getProductById(productId);
  if (!product) return;

  drawerImage.src = product.heroImage;
  drawerImage.alt = product.name;
  drawerCategory.textContent = `${product.categoryLabel} / ${product.sku}`;
  drawerTitle.textContent = product.name;
  drawerStory.textContent = product.story;
  drawerDescription.textContent = product.description;
  drawerSpecs.innerHTML = product.specs
    .map((spec) => `<span class="spec-chip">${spec}</span>`)
    .join("");

  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");

  if (pushState && window.location.pathname !== `/product/${product.id}`) {
    window.history.pushState({ product: product.id }, "", `/product/${product.id}`);
  }
}

function closeDrawer(pushState = true) {
  drawer.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");

  if (pushState && window.location.pathname.startsWith("/product/")) {
    window.history.pushState({}, "", "/");
  }
}

function syncDrawerToLocation() {
  const productId = getRouteProductId();
  if (productId) {
    openDrawer(productId, false);
  } else {
    closeDrawer(false);
  }
}

document.addEventListener("click", (event) => {
  const openTrigger = event.target.closest("[data-open-product]");
  if (openTrigger) {
    openDrawer(openTrigger.dataset.openProduct);
    return;
  }

  if (
    event.target.closest(".product-drawer__close") ||
    event.target.closest(".product-drawer__backdrop")
  ) {
    closeDrawer();
    return;
  }

  const filterTrigger = event.target.closest("[data-filter]");
  if (filterTrigger) {
    setFilter(filterTrigger.dataset.filter);
    return;
  }

  const categoryTrigger = event.target.closest("[data-filter-select]");
  if (categoryTrigger) {
    setFilter(categoryTrigger.dataset.filterSelect);
    document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("popstate", syncDrawerToLocation);

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

syncDrawerToLocation();
setFilter("all");
