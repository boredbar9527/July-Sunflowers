# July Sunflowers — Setup Guide

How to run, test, and publish the July Sunflowers catalog website.

---

## Part 1 — Sign up for Resend (for automatic order emails)

Orders placed on the website are emailed to you automatically through **Resend** (free).

1. Go to **https://resend.com** and sign up using **your store email** (this inbox will receive the orders).
2. Once signed in, open **API Keys** → **Create API Key** → copy it (it looks like `re_xxxxxxxx`).
3. Keep this key — you'll use it in Part 2 & 3.

> Note: with the default setup, orders can only be delivered to the email address you used to sign up for Resend. That is enough for daily use. (Later, to send from your own domain, verify a domain in Resend.)

---

## Part 2 — Run it on your computer (local testing)

**Prerequisite:** install **Node.js** from https://nodejs.org (choose the LTS version).

1. Open the project folder in a Terminal / Command Prompt.
2. Install once, at the start:
   ```
   npm install
   ```
3. Create the secret settings file: copy `.env.example` to `.env`, then fill it in:
   ```
   RESEND_API_KEY=re_xxxxxxxx        (the key from Part 1)
   ORDER_EMAIL=store@gmail.com        (inbox that receives orders)
   ORDER_FROM=July Sunflowers <onboarding@resend.dev>
   ```
   > This `.env` file is secret and is NOT uploaded to GitHub. Do not share it publicly.
4. Start **both** the storefront and admin panel with one command:
   ```
   npm start
   ```
   - Storefront → **http://localhost:5173**
   - Admin panel → **http://localhost:5174**

   > Prefer separate terminals? Run `npm run dev` (storefront) and `npm run admin` (admin) individually instead.

**Test an order:** at http://localhost:5173 → add products to the cart → fill in the form → "Send order via email" → check your store inbox (you should receive a Purchase Order email with a PDF attachment).

---

## Part 3 — Go live (deploy to Vercel)

1. Make sure the code is on GitHub.
2. Go to **https://vercel.com** → **Add New Project** → select this repo → **Import**.
3. **IMPORTANT** — before deploying, open **Settings → Environment Variables** and add these three:
   | Name | Value |
   |------|-------|
   | `RESEND_API_KEY` | your Resend key |
   | `ORDER_EMAIL` | inbox that receives orders |
   | `ORDER_FROM` | `July Sunflowers <onboarding@resend.dev>` |
4. Click **Deploy**. Done — the site is live and orders are emailed automatically.

> If the environment variables aren't set, the site still goes live, but orders won't be emailed automatically (they fall back to opening the customer's email app).

---

## Part 4 — Manage the catalog (Admin Panel)

Run `npm run admin` (http://localhost:5174). From there you can:

- **Store info & contact** — change the store email, phone, and address
- **Homepage promo slides** — upload/edit the 5 homepage banners
- **Price adjustment** — raise/lower prices by a percentage
- **Products** — add / edit / delete products, upload 3 images per product
  (Card = in the grid, Hover = on mouse-over, Detail = when opened) + description + badge

When you're done editing, click **"Publish to website"** — the changes are pushed to GitHub and the live site updates automatically (about 1–2 minutes).

---

## Changing keys / info later

- **Change the Resend key / order email:** update `.env` (for local) AND Vercel → Settings → Environment Variables (for the live site), then Redeploy.
- **Change store info (public email, phone, address):** just use the Admin Panel → Store info → Save → Publish.
