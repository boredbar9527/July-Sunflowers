import "./styles.css";

// Live catalog fetched from Supabase before this module loads (see index.html),
// with a static build-time snapshot as fallback.
const catalog = window.__CATALOG__;

// Representative thumbnail for each category tile = first item in the group.
const groups = catalog.groups;
const allItems = groups.flatMap((g) =>
  g.items.map((it) => ({ ...it, groupSlug: g.slug, groupName: g.name }))
);
const itemById = new Map(allItems.map((it) => [String(it.no), it]));

// ---- Inline SVG icon set (no external assets) ----
const icons = {
  search:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  cart:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.6"></circle><circle cx="18" cy="21" r="1.6"></circle><path d="M1 1h3l2.6 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 6H6"></path></svg>',
  account:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"></path></svg>',
  chevron:
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
  truck:
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="14" height="12" rx="1"></rect><path d="M15 8h4l3 3v5h-7"></path><circle cx="6" cy="18" r="1.8"></circle><circle cx="18" cy="18" r="1.8"></circle></svg>',
  leaf:
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-8 6-14 16-14 0 10-6 16-14 16-1 0-2-.2-2-.2z"></path><path d="M8 16c3-3 6-4 9-5"></path></svg>',
  shield:
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.43 2.9h-2.3v7A10 10 0 0 0 22 12z"></path></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23 12s0-3.3-.42-4.9a2.56 2.56 0 0 0-1.8-1.8C19.2 4.9 12 4.9 12 4.9s-7.2 0-8.78.42a2.56 2.56 0 0 0-1.8 1.8C1 8.7 1 12 1 12s0 3.3.42 4.9a2.56 2.56 0 0 0 1.8 1.8c1.58.42 8.78.42 8.78.42s7.2 0 8.78-.42a2.56 2.56 0 0 0 1.8-1.8C23 15.3 23 12 23 12zM9.75 15.5v-7l6 3.5z"></path></svg>'
};

const serviceIcons = ["truck", "leaf", "shield"];
const proofPoints = [
  {
    title: "Fast wholesale shipping",
    copy: "Case-packed foodservice and paper goods ready for restaurants, offices, and retail."
  },
  {
    title: "Responsibly sourced",
    copy: "FSC-minded paper, compostable options, and cleaner packaging across the line."
  },
  {
    title: "232 SKUs, one supplier",
    copy: "Tissue, containers, cups, cutlery, bags, and more — stock up in a single order."
  }
];

function priceLabel(price) {
  return price ? `$${price}` : "Call for price";
}

function catalogCard(it) {
  const searchStr = `${it.sku} ${it.name} ${it.pack} ${it.groupName}`.toLowerCase();
  return `
    <article class="product-card" data-product-card data-group="${it.groupSlug}" data-search="${searchStr.replace(/"/g, "")}">
      <button class="product-card__thumb" type="button" data-open-product="${it.no}" aria-label="View ${it.name}">
        <img src="${it.image}" alt="${it.name}" loading="lazy" />
      </button>
      <div class="product-card__info">
        <span class="product-card__sku">Item #${it.sku}</span>
        <a class="product-card__name" href="#" data-open-product="${it.no}">${it.name}</a>
        <div class="product-card__pack">${it.pack || "&nbsp;"}</div>
        <div class="price">
          <span class="price__main ${it.price ? "" : "price__main--call"}">${priceLabel(it.price)}</span>
          ${it.price ? '<span class="price__unit">/ Case</span>' : ""}
        </div>
        <div class="product-card__actions">
          <button class="button button--primary button--block" type="button" data-add-cart="${it.no}">
            Add to Cart
          </button>
        </div>
      </div>
    </article>`;
}

function groupSection(g) {
  return `
    <section class="cat-group" id="cat-${g.slug}" data-group-section="${g.slug}">
      <div class="row-head">
        <h2>${g.name} <span class="row-head__count">${g.count}</span></h2>
        <a class="row-head__link" href="#catalog-top">↑ Back to top</a>
      </div>
      <div class="product-grid">
        ${g.items.map((it) => catalogCard({ ...it, groupSlug: g.slug, groupName: g.name })).join("")}
      </div>
    </section>`;
}

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="site-shell">
    <header class="site-header" id="top">
      <div class="utility-bar">
        <div class="utility-bar__inner">
          <nav class="utility-links" aria-label="Account">
            <a href="#account">Sign In</a>
            <a href="#account">Create an Account</a>
            <a href="#account">Rewards</a>
          </nav>
          <nav class="utility-links utility-links--right" aria-label="Orders">
            <a href="#contact">Track Your Order</a>
            <a href="#contact">Help</a>
          </nav>
        </div>
      </div>

      <div class="main-header">
        <div class="main-header__inner">
          <a class="brand" href="#top" aria-label="July Sunflowers home">
            <img class="brand__logo" src="/assets/logo-LCTJEtBP.png" alt="July Sunflowers logo" />
            <strong class="brand__name">July Sunflowers</strong>
          </a>

          <form class="search" role="search" data-search-form>
            <input
              class="search__input"
              type="search"
              name="q"
              placeholder="Search 232 products by name or item #…"
              aria-label="Search products"
              data-search-input
            />
            <button class="search__button" type="submit" aria-label="Search">
              ${icons.search}<span>Search</span>
            </button>
          </form>

          <div class="header-actions">
            <a class="header-action" href="#account">
              <span class="header-action__icon">${icons.account}</span>
              <span class="header-action__text">
                <small>Hello, Guest</small>
                <b>Account</b>
              </span>
            </a>
            <button class="header-action header-action--cart" type="button" data-cart-open>
              <span class="header-action__icon">
                ${icons.cart}
                <span class="cart-badge" data-cart-count>0</span>
              </span>
              <span class="header-action__text">
                <small>Your Cart</small>
                <b>$0.00</b>
              </span>
            </button>
          </div>

          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="category-nav">
            Menu
          </button>
        </div>
      </div>

      <nav class="category-nav" id="category-nav" aria-label="Product categories">
        <div class="category-nav__inner">
          <button class="category-nav__all" type="button" data-cat-select="all">
            ${icons.chevron}<span>All Products</span>
          </button>
          ${groups
            .slice(0, 6)
            .map((g) => `<a href="#cat-${g.slug}" data-cat-select="${g.slug}">${g.name}</a>`)
            .join("")}
          <a href="#story">Our Story</a>
          <a href="#contact">Contact</a>
          <a class="category-nav__deal" href="#promo">Wholesale</a>
        </div>
      </nav>
    </header>

    <main>
      <section class="promo" id="promo">
        <div class="promo__banner" data-reveal>
          <div class="promo__copy">
            <span class="promo__eyebrow">Wholesale Foodservice & Paper Goods</span>
            <h1 class="promo__title">232 products. One supplier. Warehouse pricing.</h1>
            <p class="promo__lede">
              Tissue, food containers, cups, cutlery, bags, foil, and more — case-packed and ready for
              restaurants, offices, and retail. Browse the full July Sunflowers line below.
            </p>
            <div class="promo__actions">
              <a class="button button--primary" href="#catalog-top">Shop the Catalog</a>
              <a class="button button--ghost" href="#category-tiles">Shop by Category</a>
            </div>
          </div>
          <div class="promo__visual">
            <img src="/assets/introA-D1LV2l4Y.png" alt="July Sunflowers products" />
          </div>
        </div>
        <div class="promo__dots" role="tablist" aria-label="Banner slides">
          <span class="promo__dot is-active"></span>
          <span class="promo__dot"></span>
          <span class="promo__dot"></span>
        </div>
      </section>

      <section class="cat-tiles section" id="category-tiles">
        <div class="row-head">
          <h2>Shop by Category</h2>
          <a class="row-head__link" href="#catalog-top">View all products →</a>
        </div>
        <div class="cat-tiles__grid">
          ${groups
            .map(
              (g) => `
                <button class="cat-tile" type="button" data-cat-select="${g.slug}">
                  <span class="cat-tile__media">
                    <img src="${g.items[0].image}" alt="${g.name}" loading="lazy" />
                  </span>
                  <span class="cat-tile__label">${g.name}</span>
                  <span class="cat-tile__count">${g.count} items</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="service-strip section">
        <ul class="service-strip__list">
          ${proofPoints
            .map(
              (item, index) => `
                <li class="service-item">
                  <span class="service-item__icon">${icons[serviceIcons[index]] || icons.shield}</span>
                  <div>
                    <strong>${item.title}</strong>
                    <p>${item.copy}</p>
                  </div>
                </li>
              `
            )
            .join("")}
        </ul>
      </section>

      <section class="catalog section" id="catalog-top">
        <div class="catalog__bar">
          <div class="catalog__bar-top">
            <h2>Product Catalog</h2>
            <p class="catalog__result" data-result-count>Showing all ${catalog.total} products</p>
          </div>
          <div class="filters" role="tablist" aria-label="Category filters">
            <button class="filter-pill is-active" type="button" data-cat-select="all">All (${catalog.total})</button>
            ${groups
              .map(
                (g) =>
                  `<button class="filter-pill" type="button" data-cat-select="${g.slug}">${g.name} (${g.count})</button>`
              )
              .join("")}
          </div>
        </div>

        <div class="catalog__body" data-catalog-body>
          ${groups.map((g) => groupSection(g)).join("")}
          <p class="catalog__empty" data-empty hidden>No products match your search.</p>
        </div>
      </section>

      <section class="about section" id="story">
        <div class="about__inner">
          <div class="about__copy">
            <span class="about__eyebrow">About July Sunflowers</span>
            <p>
              July Sunflowers supplies premium tissue and a full line of foodservice and paper goods —
              from facial and bath tissue to food containers, cups, cutlery, bags, and foil. Balanced
              for restaurants, offices, retail, and bulk-friendly wholesale distribution.
            </p>
            <ul class="about__points">
              <li>232 case-packed SKUs across 13 product categories.</li>
              <li>FSC-minded paper, compostable options, and cleaner packaging.</li>
              <li>Warehouse-to-business pricing with a single point of contact.</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="contact section" id="contact">
        <div class="row-head">
          <h2>Contact Us</h2>
        </div>
        <div class="contact-grid">
          <a class="contact-card" href="tel:+19098283565">
            <span class="contact-card__label">Phone</span>
            <strong>+1 (909) 828-3565</strong>
          </a>
          <a class="contact-card" href="mailto:info@jsf2024.com">
            <span class="contact-card__label">Email</span>
            <strong>info@jsf2024.com</strong>
          </a>
          <div class="contact-card">
            <span class="contact-card__label">Address</span>
            <strong>5595 Daniels St STE B<br>Chino, CA 91710<br>United States</strong>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="site-footer__top">
        <div class="footer-col footer-col--brand">
          <img class="footer-logo" src="/assets/logo-LCTJEtBP.png" alt="July Sunflowers logo" />
          <p>Premium tissue and wholesale foodservice & paper goods with a warmer, cleaner brand experience.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook">${icons.facebook}</a>
            <a href="#" aria-label="Instagram">${icons.instagram}</a>
            <a href="#" aria-label="YouTube">${icons.youtube}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#contact">Track Your Order</a></li>
            <li><a href="#contact">Shipping Info</a></li>
            <li><a href="#contact">Returns</a></li>
            <li><a href="#contact">Help Center</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            ${groups
              .slice(0, 5)
              .map((g) => `<li><a href="#cat-${g.slug}" data-cat-select="${g.slug}">${g.name}</a></li>`)
              .join("")}
          </ul>
        </div>
        <div class="footer-col">
          <h4>About Us</h4>
          <ul>
            <li><a href="#story">Our Story</a></li>
            <li><a href="#promo">Wholesale</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+19098283565">+1 (909) 828-3565</a></li>
            <li><a href="mailto:info@jsf2024.com">info@jsf2024.com</a></li>
            <li>5595 Daniels St STE B<br>Chino, CA 91710</li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <p>© 2026 July Sunflowers. All rights reserved.</p>
        <nav class="footer-legal" aria-label="Legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Accessibility</a>
        </nav>
      </div>
    </footer>

    <div class="product-drawer" id="product-drawer" hidden aria-hidden="true">
      <button class="product-drawer__backdrop" type="button" aria-label="Close product details"></button>
      <aside class="product-drawer__panel" aria-labelledby="drawer-title">
        <button class="product-drawer__close" type="button" aria-label="Close product details">&times;</button>
        <div class="product-drawer__media">
          <div class="product-drawer__media-card">
            <img id="drawer-image" src="" alt="" />
          </div>
        </div>
        <div class="product-drawer__copy">
          <p class="product-drawer__eyebrow" id="drawer-category"></p>
          <h2 id="drawer-title"></h2>
          <div class="product-drawer__price">
            <span class="price__main" id="drawer-price"></span>
            <span class="product-drawer__pack" id="drawer-pack"></span>
          </div>
          <div class="product-drawer__meta" id="drawer-meta"></div>
          <div class="product-drawer__buy">
            <div class="qty">
              <button type="button" class="qty__btn" data-qty="-1" aria-label="Decrease quantity">−</button>
              <input class="qty__input" id="drawer-qty" type="number" value="1" min="1" aria-label="Quantity" />
              <button type="button" class="qty__btn" data-qty="1" aria-label="Increase quantity">+</button>
            </div>
            <button class="button button--primary button--lg" type="button" id="drawer-add">
              Add to Cart
            </button>
          </div>
          <p class="product-drawer__note">Prices and pack sizes are wholesale, per case. Contact us for volume quotes and availability.</p>
        </div>
      </aside>
    </div>
  </div>
`;

const drawer = document.querySelector("#product-drawer");
const drawerImage = document.querySelector("#drawer-image");
const drawerCategory = document.querySelector("#drawer-category");
const drawerTitle = document.querySelector("#drawer-title");
const drawerPrice = document.querySelector("#drawer-price");
const drawerPack = document.querySelector("#drawer-pack");
const drawerMeta = document.querySelector("#drawer-meta");
const drawerQty = document.querySelector("#drawer-qty");
const drawerAdd = document.querySelector("#drawer-add");
const catPills = [...document.querySelectorAll("[data-cat-select]")];
const groupSections = [...document.querySelectorAll("[data-group-section]")];
const productCards = [...document.querySelectorAll("[data-product-card]")];
const emptyMsg = document.querySelector("[data-empty]");
const resultCount = document.querySelector("[data-result-count]");
const menuToggle = document.querySelector(".menu-toggle");
const categoryNav = document.querySelector(".category-nav");
const searchForm = document.querySelector("[data-search-form]");
const searchInput = document.querySelector("[data-search-input]");
const cartCountEl = document.querySelector("[data-cart-count]");

let activeDrawerId = null;
let cartCount = 0;
let activeCategory = "all";

function addToCart(quantity = 1) {
  cartCount += quantity;
  cartCountEl.textContent = String(cartCount);
  cartCountEl.classList.remove("is-bump");
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add("is-bump");
}

function applyView() {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;

  productCards.forEach((card) => {
    const matchCat = activeCategory === "all" || card.dataset.group === activeCategory;
    const matchTerm = !term || card.dataset.search.includes(term);
    const show = matchCat && matchTerm;
    card.classList.toggle("is-hidden", !show);
    if (show) visible += 1;
  });

  // hide empty group sections
  groupSections.forEach((sec) => {
    const anyVisible = sec.querySelector('[data-product-card]:not(.is-hidden)');
    sec.classList.toggle("is-hidden", !anyVisible);
  });

  emptyMsg.hidden = visible !== 0;

  // update pills active state
  catPills.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.catSelect === activeCategory && !term);
  });

  if (term) {
    resultCount.textContent = `${visible} result${visible === 1 ? "" : "s"} for “${searchInput.value.trim()}”`;
  } else if (activeCategory === "all") {
    resultCount.textContent = `Showing all ${catalog.total} products`;
  } else {
    const g = groups.find((x) => x.slug === activeCategory);
    resultCount.textContent = `${g ? g.count : visible} products in ${g ? g.name : ""}`;
  }
}

function selectCategory(slug) {
  activeCategory = slug;
  searchInput.value = "";
  applyView();
  document.body.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (slug === "all") {
    document.querySelector("#catalog-top")?.scrollIntoView({ behavior: "smooth" });
  } else {
    document.querySelector(`#cat-${slug}`)?.scrollIntoView({ behavior: "smooth" });
  }
}

function openDrawer(id, pushState = true) {
  const it = itemById.get(String(id));
  if (!it) return;
  activeDrawerId = it.no;
  drawerImage.src = it.image;
  drawerImage.alt = it.name;
  drawerCategory.textContent = `${it.groupName} · Item #${it.sku}`;
  drawerTitle.textContent = it.name;
  drawerPrice.textContent = priceLabel(it.price);
  drawerPrice.classList.toggle("price__main--call", !it.price);
  drawerPack.textContent = it.price ? "/ Case" : "";
  drawerMeta.innerHTML = `
    <div class="drawer-meta-row"><span>Item #</span><strong>${it.sku}</strong></div>
    <div class="drawer-meta-row"><span>Case Pack</span><strong>${it.pack || "—"}</strong></div>
    <div class="drawer-meta-row"><span>Category</span><strong>${it.groupName}</strong></div>
    <div class="drawer-meta-row"><span>Case Price</span><strong>${priceLabel(it.price)}</strong></div>`;
  drawerQty.value = "1";

  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");

  if (pushState && window.location.pathname !== `/product/${it.no}`) {
    window.history.pushState({ product: it.no }, "", `/product/${it.no}`);
  }
}

function closeDrawer(pushState = true) {
  drawer.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  activeDrawerId = null;
  if (pushState && window.location.pathname.startsWith("/product/")) {
    window.history.pushState({}, "", "/");
  }
}

function getRouteProductId() {
  const match = window.location.pathname.match(/^\/product\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function syncDrawerToLocation() {
  const id = getRouteProductId();
  if (id && itemById.has(String(id))) openDrawer(id, false);
  else closeDrawer(false);
}

document.addEventListener("click", (event) => {
  const openTrigger = event.target.closest("[data-open-product]");
  if (openTrigger) {
    event.preventDefault();
    openDrawer(openTrigger.dataset.openProduct);
    return;
  }

  const addTrigger = event.target.closest("[data-add-cart]");
  if (addTrigger) {
    addToCart(1);
    return;
  }

  if (
    event.target.closest(".product-drawer__close") ||
    event.target.closest(".product-drawer__backdrop")
  ) {
    closeDrawer();
    return;
  }

  const catTrigger = event.target.closest("[data-cat-select]");
  if (catTrigger) {
    event.preventDefault();
    selectCategory(catTrigger.dataset.catSelect);
  }
});

drawer.addEventListener("click", (event) => {
  const stepper = event.target.closest("[data-qty]");
  if (stepper) {
    const delta = Number(stepper.dataset.qty);
    drawerQty.value = String(Math.max(1, (Number(drawerQty.value) || 1) + delta));
  }
});

drawerAdd.addEventListener("click", () => {
  if (!activeDrawerId) return;
  addToCart(Math.max(1, Number(drawerQty.value) || 1));
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyView();
  document.querySelector("#catalog-top")?.scrollIntoView({ behavior: "smooth" });
});

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(applyView, 140);
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

categoryNav.querySelectorAll("a").forEach((link) => {
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
  { threshold: 0.12 }
);
document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));

syncDrawerToLocation();
applyView();
