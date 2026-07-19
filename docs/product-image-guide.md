# Panduan Gambar Produk — July Sunflowers

**186 produk → hanya 43 gambar unik yang perlu dibuat.**

Setiap gambar mewakili satu "keluarga visual" (produk yang bentuknya sama, beda ukuran saja).

## Cara pakai
1. Buat gambar (foto asli atau AI) untuk tiap baris di bawah.
2. Simpan **1:1 (persegi)**, format `.jpg`, `.png`, atau `.webp`.
3. Beri nama **persis** sesuai kolom `Nama file` dan taruh di:
   `public/assets/products/`
4. Jalankan `npm run catalog` (atau `npm run dev`) — semua produk di keluarga itu langsung memakainya.

Belum sempat semua? Tidak apa-apa — yang belum ada gambarnya tetap memakai ilustrasi kategori. Bisa bertahap.

## Resep konsistensi (WAJIB sama untuk semua)
Tempelkan blok gaya ini di **setiap** prompt agar 43 gambar terlihat satu set:

> `clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1`

**Tips tool:** untuk konsistensi, buat 1 gambar terbaik dulu, lalu jadikan **reference image** saat generate sisanya (fitur ini ada di Gemini "Nano Banana", GPT-Image, dan Flux). Pertahankan latar & sudut yang sama.

---

## Daftar 43 gambar + prompt AI

| # | Nama file | Produk (jml) | Contoh SKU |
|---|-----------|--------------|------------|
| 1 | `togo-hinged-plastic-hinged` | To-Go Containers (19) | PP51, PP661 |
| 2 | `plastic-containers-plastic-container` | Plastic Containers (13) | JS-2030, 9288 |
| 3 | `hot-cups-paper-cup` | Hot Cups & Accessories (11) | 4 OZ HOT CUP, 6 OZ HOT CUP |
| 4 | `portion-cups-plastic-cup` | Portion Cups (10) | 0.75 OZ CUP, 1 OZ CUP |
| 5 | `cold-cups-plastic-cup` | Cold Cups & Lids (10) | 9 OZ-90MM, 12 OZ-98MM |
| 6 | `bags-plastic-bag` | Bags & Liners (8) | B01, B02 |
| 7 | `plastic-containers-plastic-container-round` | Plastic Containers (7) | R-16, R-24 |
| 8 | `bags-kraft-bag` | Bags & Liners (7) | CY-SB10, CY-SB16 |
| 9 | `plastic-containers-plastic-container-rect` | Plastic Containers (6) | T-12, 9168 |
| 10 | `sushi-plastic-tray` | Sushi Packaging (6) | SZ-306, SZ-307 |
| 11 | `sushi-plastic-container` | Sushi Packaging (6) | SZ-01, SZ-02 |
| 12 | `tissue-paper-tissue` | Tissue (5) | F-10, B-24 |
| 13 | `paper-togo-kraft-item` | Paper To-Go (5) | Carton 1#, Carton 2# |
| 14 | `cold-cups-plastic-lid` | Cold Cups & Lids (5) | 90FLAT, 98FLAT |
| 15 | `cutlery-plastic-fork` | Cutlery & Chopsticks (5) | 2.5G FORK, 5G FORK |
| 16 | `paper-containers-paper-cup` | Paper Food Containers (5) | CDA05, CDA08 |
| 17 | `paper-containers-paper-container` | Paper Food Containers (5) | PFC600-21, PFC600-25 |
| 18 | `paper-togo-paper-item` | Paper To-Go (4) | 8 OZ PAPER FOOD, 16 OZ PAPER FOOD |
| 19 | `paper-togo-plastic-tray` | Paper To-Go (4) | 1LB, 2LB |
| 20 | `plates-paper-plate` | Plates (4) | PLATE6, YP070 |
| 21 | `gloves-plastic-glove` | Gloves (4) | #6342, #6343 |
| 22 | `straws-plastic-straw` | Straws (3) | PSS-6229, STRAWB1 |
| 23 | `cutlery-plastic-spoon` | Cutlery & Chopsticks (3) | 2.5G SPOON, 5G SPOON |
| 24 | `napkins-plastic-napkin` | Napkins & Towels (3) | #1517, CP-TFN10000 |
| 25 | `bags-plastic-tshirt` | Bags & Liners (3) | #1BAG, #3BAG |
| 26 | `hot-cups-plastic-carrier` | Hot Cups & Accessories (2) | EP-2C-02, EP-4C-02 |
| 27 | `hot-cups-kraft-cup` | Hot Cups & Accessories (2) | PRKC-12, PRKC-16 |
| 28 | `straws-paper-straw` | Straws (2) | STRAWS, PSS-74260 |
| 29 | `napkins-paper-item` | Napkins & Towels (2) | #4700, MFT-4000 |
| 30 | `wrap-foil-plastic-wrap` | Wrap, Foil & Pans (2) | CL-182000, CL-242000 |
| 31 | `wrap-foil-foil-foil` | Wrap, Foil & Pans (2) | 18500HD, 121000S |
| 32 | `wrap-foil-foil-item` | Wrap, Foil & Pans (2) | HALF-M, HALF-L |
| 33 | `plastic-containers-plastic-tray` | Plastic Containers (1) | FN-50 |
| 34 | `sushi-plastic-lid-round` | Sushi Packaging (1) | SZ-64 |
| 35 | `hot-cups-kraft-sleeve` | Hot Cups & Accessories (1) | CSL-90 |
| 36 | `cutlery-bamboo-chopstick-round` | Cutlery & Chopsticks (1) | A1600 |
| 37 | `cutlery-bamboo-chopstick` | Cutlery & Chopsticks (1) | BC-4823T |
| 38 | `supplies-paper-item` | Register Supplies (1) | THERMAL PAPER |
| 39 | `napkins-paper-napkin` | Napkins & Towels (1) | #4832 |
| 40 | `napkins-plastic-item` | Napkins & Towels (1) | #4786 |
| 41 | `napkins-paper-tissue` | Napkins & Towels (1) | #4610 |
| 42 | `paper-containers-plastic-lid` | Paper Food Containers (1) | CDA98PP |
| 43 | `wrap-foil-foil-lid` | Wrap, Foil & Pans (1) | HALF-LID |

---

## Prompt lengkap per gambar

### 1. `togo-hinged-plastic-hinged.jpg`  —  To-Go Containers · 19 produk
Contoh produk: _5in Hinged Lid To-Go Container_ · _6in Hinged Lid To-Go Container (Large)_ · _7in Hinged Lid To-Go Container (1 Compartment)_

**Prompt:**
> a clear plastic hinged clamshell takeout container, closed. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 2. `plastic-containers-plastic-container.jpg`  —  Plastic Containers · 13 produk
Contoh produk: _30 oz Plastic Food Container with Lid (2 Compartment)_ · _32 oz Plastic Food Container with Lid (2 Compartment)_ · _36 oz Plastic Food Container with Lid (3 Compartment)_

**Prompt:**
> a clear plastic food takeout container with a matching lid, closed. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 3. `hot-cups-paper-cup.jpg`  —  Hot Cups & Accessories · 11 produk
Contoh produk: _4 oz White Paper Hot Cup_ · _6 oz White Paper Hot Cup_ · _8 oz White Paper Hot Cup_

**Prompt:**
> an empty white paper drink cup. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 4. `portion-cups-plastic-cup.jpg`  —  Portion Cups · 10 produk
Contoh produk: _0.75 oz Clear Portion Cup_ · _1 oz Clear Portion Cup_ · _1.5 oz Clear Portion Cup_

**Prompt:**
> an empty clear plastic drink cup. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 5. `cold-cups-plastic-cup.jpg`  —  Cold Cups & Lids · 10 produk
Contoh produk: _9 oz Clear PET Cup (90 mm)_ · _12 oz Clear PET Cup (98 mm)_ · _16 oz Clear PET Cup (98 mm)_

**Prompt:**
> an empty clear plastic drink cup. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 6. `bags-plastic-bag.jpg`  —  Bags & Liners · 8 produk
Contoh produk: _B01 LD Clear Bag 11 x 19, 1.25 Mil_ · _B02 LD Clear Bag 11 x 14, 1.25 Mil_ · _B05 HD Clear Bag 11 x 14, 12 Mic_

**Prompt:**
> a clear plastic shopping/grocery bag, standing upright with folded top. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 7. `plastic-containers-plastic-container-round.jpg`  —  Plastic Containers · 7 produk
Contoh produk: _16 oz Plastic Food Container with Lid (Round)_ · _24 oz Plastic Food Container with Lid (Round)_ · _32 oz Plastic Food Container with Lid (Round)_

**Prompt:**
> a clear plastic round food takeout container with a matching lid, closed. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 8. `bags-kraft-bag.jpg`  —  Bags & Liners · 7 produk
Contoh produk: _10 lbs Kraft Paper Bag 6.3in x 4.2in x 13.4in_ · _16 lbs Kraft Paper Bag 7.7in x 4.7in x 16in_ · _20 lbs Kraft Paper Bag 8.2in x 5.3in x 16.1in_

**Prompt:**
> a brown kraft paper shopping/grocery bag, standing upright with folded top. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 9. `plastic-containers-plastic-container-rect.jpg`  —  Plastic Containers · 6 produk
Contoh produk: _12 oz Plastic Food Container with Lid (Rectangular)_ · _16 oz Plastic Food Container with Lid (Rectangular)_ · _24 oz Plastic Food Container with Lid (Rectangular)_

**Prompt:**
> a clear plastic rectangular food takeout container with a matching lid, closed. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 10. `sushi-plastic-tray.jpg`  —  Sushi Packaging · 6 produk
Contoh produk: _Sushi Tray 10.5in x 8.1in x 2in_ · _Sushi Tray 10.6in x 10.6in x 2in_ · _Sushi Tray 7.2in x 5.1in x 1.8in_

**Prompt:**
> a clear plastic food tray. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 11. `sushi-plastic-container.jpg`  —  Sushi Packaging · 6 produk
Contoh produk: _#1 PET Sushi Container with Lid 6.5in x 3.5in x 2in_ · _#2 PET Sushi Container with Lid 8.7in x 3.4in x 2in_ · _#3 PET Sushi Container with Lid 6.5in x 4.5in x 2in_

**Prompt:**
> a clear plastic food takeout container with a matching lid, closed. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 12. `tissue-paper-tissue.jpg`  —  Tissue · 5 produk
Contoh produk: _Facial Tissues 3-Ply_ · _Bathroom Tissues 4-Ply_ · _Facial Tissue 24-Pack_

**Prompt:**
> a white paper facial tissue box with one tissue rising. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 13. `paper-togo-kraft-item.jpg`  —  Paper To-Go · 5 produk
Contoh produk: _#1 Kraft Take-Out Box 5in x 4.5in x 2.5in_ · _#2 Kraft Take-Out Box 8.5in x 6.25in x 1.875in_ · _#3 Kraft Take-Out Box 8.5in x 6.25in x 2.5in_

**Prompt:**
> a brown kraft paper paper to-go item. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 14. `cold-cups-plastic-lid.jpg`  —  Cold Cups & Lids · 5 produk
Contoh produk: _90 mm Flat No-Hole Lid_ · _12-24 oz Clear Lids (98 mm Flat)_ · _12-24 oz Dome Clear Lids_

**Prompt:**
> a clear plastic cup lid. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 15. `cutlery-plastic-fork.jpg`  —  Cutlery & Chopsticks · 5 produk
Contoh produk: _Medium Weight Plastic Fork_ · _7in White Extra Heavy Weight Plastic Fork_ · _Heavy Weight White Plastic Fork, Individually Wrapped_

**Prompt:**
> a clear plastic disposable fork. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 16. `paper-containers-paper-cup.jpg`  —  Paper Food Containers · 5 produk
Contoh produk: _5 oz White Paper Food Cup_ · _8 oz White Paper Food Cup_ · _12 oz White Paper Food Cup_

**Prompt:**
> an empty white paper drink cup. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 17. `paper-containers-paper-container.jpg`  —  Paper Food Containers · 5 produk
Contoh produk: _21 oz White Paper Food Container, Rim 142 mm_ · _25 oz White Paper Food Container, Rim 142 mm_ · _28 oz White Paper Food Container, Rim 142 mm_

**Prompt:**
> a white paper food takeout container with a matching lid, closed. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 18. `paper-togo-paper-item.jpg`  —  Paper To-Go · 4 produk
Contoh produk: _8 oz Paper Food Pail 2.8in x 2.4in x 2.5in_ · _16 oz Paper Food Pail 3.7in x 3.1in x 3.3in_ · _26 oz Paper Food Pail 4.1in x 3.7in x 4in_

**Prompt:**
> a white paper paper to-go item. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 19. `paper-togo-plastic-tray.jpg`  —  Paper To-Go · 4 produk
Contoh produk: _1 lb White/Red Food Tray 3.8in x 2.2in x 1.7in_ · _2 lb White/Red Food Tray 4.5in x 2.7in x 1.6in_ · _3 lb White/Red Food Tray 5.4in x 3.1in x 2.1in_

**Prompt:**
> a clear plastic food tray. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 20. `plates-paper-plate.jpg`  —  Plates · 4 produk
Contoh produk: _Compostable Paper Plate 6in_ · _Compostable Paper Plate 7in_ · _Compostable Paper Plate 9in_

**Prompt:**
> a white paper round disposable plate. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 21. `gloves-plastic-glove.jpg`  —  Gloves · 4 produk
Contoh produk: _Nitrile Disposable Examination Gloves Small 4 Mil_ · _Nitrile Disposable Examination Gloves Medium 4 Mil_ · _Nitrile Disposable Examination Gloves Large 4 Mil_

**Prompt:**
> a box of clear plastic disposable gloves with one glove beside it. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 22. `straws-plastic-straw.jpg`  —  Straws · 3 produk
Contoh produk: _9in Plastic Sharp Straws Black 6 x 229 mm, Film Wrapped_ · _9in Plastic Boba Straws Black 12 x 229 mm, Film Wrapped_ · _9in Boba Straws 9 x 12 mm Color Straw_

**Prompt:**
> a clear plastic drinking straw, paper-wrapped. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 23. `cutlery-plastic-spoon.jpg`  —  Cutlery & Chopsticks · 3 produk
Contoh produk: _Medium Weight Plastic Soup Spoon_ · _6.5in White Extra Heavy Weight Plastic Soup Spoon_ · _Heavy Weight White Plastic Tea Spoon, Individually Wrapped_

**Prompt:**
> a clear plastic disposable soup spoon. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 24. `napkins-plastic-napkin.jpg`  —  Napkins & Towels · 3 produk
Contoh produk: _Dinner Napkin 2-Ply 15in x 17in_ · _Tall Fold Napkin 1-Ply 13in x 6.7in_ · _Interfold Napkins White, 2-Ply_

**Prompt:**
> a neat stack of folded clear plastic napkins. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 25. `bags-plastic-tshirt.jpg`  —  Bags & Liners · 3 produk
Contoh produk: _#1 T-Shirt Carry Out Bags 8in x 6in x 16in, 12.5 Mic_ · _#3 T-Shirt Carry Out Bags 10.5in x 6in x 20in, 15 Mic_ · _#5 T-Shirt Carry Out Bags 12in x 7in x 22in, 17 Mic_

**Prompt:**
> a clear plastic t-shirt style carry-out shopping bag with loop handles. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 26. `hot-cups-plastic-carrier.jpg`  —  Hot Cups & Accessories · 2 produk
Contoh produk: _2 Cup Carrier (Carry 8 to 22 oz)_ · _4 Cup Carrier (Carry 8 to 32 oz)_

**Prompt:**
> a molded paper cup carrier tray holding drink cups. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 27. `hot-cups-kraft-cup.jpg`  —  Hot Cups & Accessories · 2 produk
Contoh produk: _12 oz Double Wall Ripple Kraft Paper Hot Cup_ · _16 oz Double Wall Ripple Kraft Paper Hot Cup_

**Prompt:**
> an empty brown kraft paper drink cup. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 28. `straws-paper-straw.jpg`  —  Straws · 2 produk
Contoh produk: _7.75in Clear Straight Jumbo Straws (Paper Wrapped)_ · _10.25in Plastic Giant Straws (Paper Wrapped)_

**Prompt:**
> a white paper drinking straw, paper-wrapped. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 29. `napkins-paper-item.jpg`  —  Napkins & Towels · 2 produk
Contoh produk: _Multifold Paper Towels Brown 1-Ply 9in x 9in_ · _Multifold Paper Towels Brown 1-Ply 9in x 9in_

**Prompt:**
> a white paper napkins & towels item. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 30. `wrap-foil-plastic-wrap.jpg`  —  Wrap, Foil & Pans · 2 produk
Contoh produk: _Food Service Cling Wrap with Serrated Cutter 18in x 2000ft_ · _Food Service Cling Wrap with Serrated Cutter 24in x 2000ft_

**Prompt:**
> a roll of clear plastic cling film in its box. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 31. `wrap-foil-foil-foil.jpg`  —  Wrap, Foil & Pans · 2 produk
Contoh produk: _18in x 500ft Aluminum Foil Roll 19 Mic (Heavy Duty)_ · _12in x 1000ft Aluminum Foil Roll 16 Mic_

**Prompt:**
> a roll of aluminum foil in its box. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 32. `wrap-foil-foil-item.jpg`  —  Wrap, Foil & Pans · 2 produk
Contoh produk: _Half Size Medium Aluminum Pan (Heavy Duty)_ · _Half Size Deep Aluminum Pan (Heavy Duty)_

**Prompt:**
> a aluminum foil wrap, foil & pans item. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 33. `plastic-containers-plastic-tray.jpg`  —  Plastic Containers · 1 produk
Contoh produk: _50 oz Noodle Bowl with Tray_

**Prompt:**
> a clear plastic food tray. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 34. `sushi-plastic-lid-round.jpg`  —  Sushi Packaging · 1 produk
Contoh produk: _Round Sushi Tray with Lid 13.7in x 2.1in_

**Prompt:**
> a clear plastic cup lid. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 35. `hot-cups-kraft-sleeve.jpg`  —  Hot Cups & Accessories · 1 produk
Contoh produk: _10-24 oz Kraft Paper Cup Sleeve_

**Prompt:**
> a brown kraft paper paper cup sleeve. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 36. `cutlery-bamboo-chopstick-round.jpg`  —  Cutlery & Chopsticks · 1 produk
Contoh produk: _22 cm x 0.55 cm Bamboo Chopsticks, Individually Wrapped (Round)_

**Prompt:**
> a pair of natural bamboo chopsticks in a paper wrapper. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 37. `cutlery-bamboo-chopstick.jpg`  —  Cutlery & Chopsticks · 1 produk
Contoh produk: _23 cm Bamboo Chopsticks Paper Wrapped (Twin)_

**Prompt:**
> a pair of natural bamboo chopsticks in a paper wrapper. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 38. `supplies-paper-item.jpg`  —  Register Supplies · 1 produk
Contoh produk: _3 1/8in x 230ft Thermal Paper Roll, BPA Free_

**Prompt:**
> a white paper register supplies item. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 39. `napkins-paper-napkin.jpg`  —  Napkins & Towels · 1 produk
Contoh produk: _Dinner Napkins 2-Ply, White Paper_

**Prompt:**
> a neat stack of folded white paper napkins. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 40. `napkins-plastic-item.jpg`  —  Napkins & Towels · 1 produk
Contoh produk: _Hard Wound Roll Towel 1-Ply, Bleached 8in x 600ft_

**Prompt:**
> a clear plastic napkins & towels item. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 41. `napkins-paper-tissue.jpg`  —  Napkins & Towels · 1 produk
Contoh produk: _Jumbo Roll Tissue 2-Ply 3.5in x 1000ft_

**Prompt:**
> a white paper facial tissue box with one tissue rising. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 42. `paper-containers-plastic-lid.jpg`  —  Paper Food Containers · 1 produk
Contoh produk: _98 mm PP Flat Lid (8 oz - 16 oz)_

**Prompt:**
> a clear plastic cup lid. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

### 43. `wrap-foil-foil-lid.jpg`  —  Wrap, Foil & Pans · 1 produk
Contoh produk: _Lids for Half Size Aluminum Pans_

**Prompt:**
> a aluminum foil cup lid. clean seamless off-white studio background, soft even lighting, subtle soft contact shadow, three-quarter 45-degree eye-level angle, product centered with margin, crisp focus, high-resolution e-commerce catalog photography, photorealistic, no text, no props, no hands, square 1:1

