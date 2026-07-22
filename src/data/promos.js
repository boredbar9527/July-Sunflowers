// Hero promo slides, one per department. This data now lives in promos.json so
// the local catalog admin can edit the copy and upload banner images for each
// slide; the frontend just imports the JSON.
//
// Each entry: { label, title, text, cta, banner }.
//  - banner: path to a ready-made marketing image in public/assets/promos/.
//    When set, the whole slide becomes that clickable image (WebstaurantStore
//    style). When empty, the slide falls back to the copy + product-photo
//    layout built from the department's catalog.
import PROMO_COPY_JSON from "./promos.json";

export const PROMO_COPY = PROMO_COPY_JSON;
