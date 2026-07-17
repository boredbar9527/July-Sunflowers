# July Sunflowers

Static catalog storefront for July Sunflowers (originally a local mirror of
`https://jsf2024.com/`).

- **Frontend:** Vue 3 + Vite (`src/`) — fully static, no backend required
- **Product data:** `data/catalog.csv` (186 items) → converted to
  `src/data/products.json` automatically before dev/build
- Ordering happens via WhatsApp/email links per product (no cart/checkout)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173/. That's it — no database or PHP needed.

## Editing products

1. Edit `data/catalog.csv` (columns: sku, name, category, category_label,
   unit, price, image, hero_image, story).
2. Restart `npm run dev` (or run `npm run catalog`) — the JSON regenerates.

Products without an `image` value automatically use their category
illustration from `public/assets/categories/<category>.svg`.

Product photo workspace: `image-sources/`
- `option-1-pdf/` — photos extracted from the client's `JSF May.pdf`
  (low resolution; needs manual matching to SKUs)
- `option-4-generated/` — branded category illustration set (source of
  `public/assets/categories/`)
- `preview.html` — side-by-side preview of both sets

## Build & deploy

```bash
npm run build    # outputs dist/
npm run preview  # serve the build locally
```

The site is fully static: deploy `dist/` to any static host (Vercel, Netlify,
GitHub Pages, or plain file hosting).

## Contact / ordering settings

WhatsApp number, email address, and message templates live in one place:
`src/config.js`.

## Project layout

```
index.html              Vite entry
scripts/build-catalog.mjs  CSV → products.json generator
src/main.js             Vue bootstrap
src/App.vue             Page layout & sections
src/components/         Catalog, product card, product drawer
src/composables/        useCatalog (loads bundled products.json)
src/config.js           Contact/WhatsApp settings & helpers
src/styles.css          Global styles
data/catalog.csv        Product data (source of truth)
public/                 Static assets (images, fonts, favicons)
```
