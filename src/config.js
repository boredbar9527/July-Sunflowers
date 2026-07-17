// Store-wide contact settings. Update these in one place.
export const WHATSAPP_NUMBER = "19098283565"; // digits only, country code first
export const CONTACT_EMAIL = "info@jsf2024.com";
export const CONTACT_PHONE_DISPLAY = "+1 (909) 828-3565";

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
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// --- Order / invoice (frontend only) -------------------------------------
// The email transport is intentionally pluggable: sendOrder() currently
// composes a mailto: draft. When the client picks a service (Web3Forms,
// EmailJS, serverless endpoint, ...), only this function needs to change.

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

export function sendOrder(orderNumber, invoiceText) {
  // Temporary transport: opens the customer's email app with the invoice
  // pre-filled, addressed to the store.
  const subject = `Order ${orderNumber} — July Sunflowers`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(invoiceText)}`;
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === "") return null;
  const value = Number(price);
  if (Number.isNaN(value)) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
