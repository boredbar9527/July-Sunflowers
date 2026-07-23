// Store-wide contact settings. These live in src/data/settings.json so the
// local catalog admin can edit them; the frontend just imports them here.
import settings from "./data/settings.json";

export const WHATSAPP_NUMBER = settings.whatsappNumber;   // digits only, country code first
export const CONTACT_EMAIL = settings.contactEmail;       // shown publicly (nav, footer, contact)
export const ORDER_EMAIL = settings.orderEmail;           // where orders are delivered
export const CONTACT_PHONE_DISPLAY = settings.phoneDisplay;
export const CONTACT_PHONE_TEL = settings.phoneTel;       // for tel: links
export const STORE_ADDRESS = settings.address;
export const STORE_LOGO = "/assets/logo-LCTJEtBP.png";

export function buildWhatsAppLink(product) {
  const lines = [
    "Hello July Sunflowers, I would like to order:",
    `- ${product.name} (SKU ${product.sku})`,
    "",
    "Please let me know availability and pricing."
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildEmailLink(product) {
  const subject = `Order inquiry: ${product.name} (SKU ${product.sku})`;
  const body = `Hello July Sunflowers,\n\nI would like to order ${product.name} (SKU ${product.sku}).\nPlease let me know availability and pricing.\n`;
  return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// --- Order / invoice ------------------------------------------------------
// Orders are emailed by the serverless /api/order function via Resend; see
// sendOrder() below. If that fails, it falls back to a mailto: draft.

export function nextOrderNumber() {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const key = "jsf-order-seq";
  const seq = (Number(localStorage.getItem(key)) || 0) + 1;
  localStorage.setItem(key, String(seq));
  return `JSF-${ymd}-${String(seq).padStart(3, "0")}`;
}

export function buildInvoiceText(orderNumber, lines, total, customer) {
  const rows = lines.map(
    (l) =>
      `- ${l.sku} | ${l.name} | ${l.qty} case(s)` +
      (l.subtotal !== null ? ` | ${formatPrice(l.subtotal)}` : " | price on request")
  );
  return [
    `Order ${orderNumber}`,
    "",
    "Items:",
    ...rows,
    "",
    `Estimated total: ${total !== null ? formatPrice(total) : "on request"}`,
    "",
    "Customer:",
    `Name: ${customer.name}`,
    `Company: ${customer.company || "-"}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    customer.notes ? `Notes: ${customer.notes}` : "",
    "",
    "Sent from julysunflowers order page."
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export async function sendOrder(orderNumber, invoiceText, customer = {}, lines = [], total = null, dateText = "", pdfBase64 = null) {
  const subject = `New order ${orderNumber} — ${customer.name || "Website"}`;

  // Primary transport: our serverless /api/order function emails a branded
  // Purchase Order via Resend. The RESEND_API_KEY lives server-side only.
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, dateText, customer, lines, total, pdfBase64 })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true, via: "resend" };
    throw new Error(data.error || "Order service unavailable.");
  } catch (err) {
    // Fallback: open the customer's email app so an order is never lost.
    window.location.href = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(invoiceText)}`;
    return { ok: true, via: "mailto" };
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]
  );
}

// Standalone, self-contained Purchase Order document (inline CSS) suitable for
// opening in a print window and saving as PDF from the browser.
export function buildInvoiceHtml(orderNumber, lines, total, customer, dateText) {
  const rows = lines
    .map(
      (l, i) => `<tr>
        <td class="c">${i + 1}</td>
        <td><strong>${escapeHtml(l.name)}</strong><span class="muted"> · #${escapeHtml(l.sku)}</span></td>
        <td class="c">case</td>
        <td class="num">${l.qty}</td>
        <td class="num">${l.price !== null ? formatPrice(l.price) : "—"}</td>
        <td class="num">${l.subtotal !== null ? formatPrice(l.subtotal) : "On request"}</td>
      </tr>`
    )
    .join("");

  const grand = total !== null ? formatPrice(total) : "On request";

  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<title>Purchase Order ${escapeHtml(orderNumber)} — July Sunflowers</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1f2a24;margin:0;padding:28px;background:#fff}
  .sheet{max-width:760px;margin:0 auto}
  .top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:22px}
  .company{display:flex;gap:12px;align-items:center}
  .company img{height:48px}
  .company b{display:block;font-size:20px;color:#234d27}
  .company small{font-size:11px;color:#5a6b60;text-transform:uppercase;letter-spacing:.08em}
  .doc h1{margin:0 0 8px;font-size:24px;letter-spacing:2px;color:#2f7d32;text-align:right}
  .doc table{font-size:12px;border-collapse:collapse;margin-left:auto}
  .doc .k{color:#5a6b60;text-align:right;padding:3px 8px}
  .doc .v{font-weight:800;border:1px solid #d9e6da;padding:3px 10px;min-width:120px}
  .bar{background:#2f7d32;color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:6px 10px}
  .info{width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e2e6e2;border-top:none;margin-bottom:4px}
  .info td{padding:6px 10px;vertical-align:top;width:50%}
  .info .k{color:#8a978d;font-size:10px;text-transform:uppercase;letter-spacing:.05em;padding-bottom:0}
  .info .v{font-weight:700;padding-top:1px;border-bottom:1px solid #eef2ee}
  table.items{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px}
  table.items th{background:#2f7d32;color:#fff;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
  table.items td{padding:8px 10px;border-bottom:1px solid #eef2ee}
  table.items .c{text-align:center}
  table.items .num{text-align:right;white-space:nowrap}
  .muted{color:#8a978d;font-weight:400}
  .bottom{display:flex;justify-content:space-between;gap:20px;margin-top:16px}
  .notes{flex:1}
  .notes .bar{margin-bottom:6px}
  .notes p{font-size:12px;color:#3b423d;margin:0;padding:0 2px;line-height:1.5}
  .totals{width:260px;font-size:13px}
  .totals table{width:100%;border-collapse:collapse}
  .totals td{padding:6px 8px}
  .totals .k{text-align:right;color:#5a6b60}
  .totals .v{text-align:right;font-weight:700;white-space:nowrap}
  .totals .grand td{border-top:2px solid #2f7d32;font-size:16px;font-weight:800;color:#234d27;padding-top:8px}
  .disc{margin-top:22px;font-size:11px;color:#8a978d;border-top:1px dashed #cdd8ce;padding-top:10px}
  @media print{body{padding:0}}
</style></head>
<body><div class="sheet">
  <div class="top">
    <div class="company">
      <img src="${STORE_LOGO}" alt="July Sunflowers" />
      <div><b>July Sunflowers</b><small>Wholesale Foodservice Supply</small></div>
    </div>
    <div class="doc">
      <h1>PURCHASE ORDER</h1>
      <table>
        <tr><td class="k">DATE</td><td class="v">${escapeHtml(dateText)}</td></tr>
        <tr><td class="k">ORDER NO.</td><td class="v">${escapeHtml(orderNumber)}</td></tr>
      </table>
    </div>
  </div>

  <div class="bar">Vendor</div>
  <table class="info">
    <tr><td class="k">Name</td><td class="k">Email</td></tr>
    <tr><td class="v">July Sunflowers</td><td class="v">${escapeHtml(CONTACT_EMAIL)}</td></tr>
    <tr><td class="k">Address</td><td class="k">Phone</td></tr>
    <tr><td class="v">${escapeHtml(STORE_ADDRESS)}</td><td class="v">${escapeHtml(CONTACT_PHONE_DISPLAY)}</td></tr>
  </table>

  <div class="bar">Customer</div>
  <table class="info">
    <tr><td class="k">Name</td><td class="k">Company</td></tr>
    <tr><td class="v">${escapeHtml(customer.name)}</td><td class="v">${escapeHtml(customer.company || "-")}</td></tr>
    <tr><td class="k">Email</td><td class="k">Phone</td></tr>
    <tr><td class="v">${escapeHtml(customer.email)}</td><td class="v">${escapeHtml(customer.phone)}</td></tr>
    <tr><td class="k" colspan="2">Delivery Address</td></tr>
    <tr><td class="v" colspan="2">${escapeHtml(customer.address)}</td></tr>
  </table>

  <table class="items">
    <thead><tr><th class="c">No</th><th>Description</th><th class="c">Unit</th><th class="num">Qty</th><th class="num">Unit Price</th><th class="num">Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="bottom">
    <div class="notes">
      <div class="bar">Additional Notes</div>
      <p>${customer.notes ? escapeHtml(customer.notes) : "—"}</p>
    </div>
    <div class="totals">
      <table>
        <tr><td class="k">Subtotal</td><td class="v">${grand}</td></tr>
        <tr class="grand"><td class="k">Total</td><td class="v">${grand}</td></tr>
      </table>
    </div>
  </div>

  <div class="disc">This is an order request, not a paid receipt. July Sunflowers will contact you shortly to confirm availability, final case pricing, and delivery.</div>
</div></body></html>`;
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === "") return null;
  const value = Number(price);
  if (Number.isNaN(value)) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

// Single source of truth for how an unpriced product reads across the UI
// (drawer, card, and table previously used three different phrasings).
export const PRICE_FALLBACK = "Contact for pricing";

export function priceLabel(price) {
  return formatPrice(price) ?? PRICE_FALLBACK;
}
