// Serverless order handler: emails the order as a branded Purchase Order via
// Resend (https://resend.com). Runs on Vercel in production; the Vite dev
// plugin (see vite.config.js) imports sendOrderEmail so it also works on
// localhost. Secrets come from env vars — never from the client bundle.

import { LOGO_BASE64 } from "../src/data/logoData.js";

const money = (v) =>
  v === null || v === undefined || v === "" || Number.isNaN(Number(v))
    ? "On request"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(v));

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Email-safe Purchase Order (table layout + inline styles so it renders in Gmail
// and other clients that strip <style> and don't support flex/grid).
export function buildEmailHtml({ orderNumber, dateText, customer = {}, lines = [], total = null }) {
  const grand = money(total);
  const waDigits = String(customer.phone || "").replace(/\D/g, "");

  const rows = lines
    .map(
      (l, i) => `
      <tr>
        <td style="padding:9px 10px;border-bottom:1px solid #eef2ee;text-align:center;color:#5a6b60;">${i + 1}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef2ee;"><strong>${esc(l.name)}</strong> <span style="color:#8a978d;">&middot; #${esc(l.sku)}</span></td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef2ee;text-align:center;">case</td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef2ee;text-align:right;">${l.qty}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef2ee;text-align:right;white-space:nowrap;">${l.price != null ? money(l.price) : "&mdash;"}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #eef2ee;text-align:right;white-space:nowrap;font-weight:600;">${money(l.subtotal)}</td>
      </tr>`
    )
    .join("");

  const infoCell = (label, value) =>
    `<td style="padding:7px 12px;vertical-align:top;width:50%;">
       <div style="font-size:10px;letter-spacing:.5px;text-transform:uppercase;color:#8a978d;">${esc(label)}</div>
       <div style="font-weight:700;color:#1f2a24;">${value}</div>
     </td>`;

  const bar = (t) =>
    `<tr><td colspan="6" style="background:#2f7d32;color:#fff;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;padding:7px 12px;">${t}</td></tr>`;

  return `<!doctype html><html><body style="margin:0;background:#f1f3f1;padding:24px 0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1f2a24;">
  <table role="presentation" width="640" align="center" cellpadding="0" cellspacing="0" style="width:640px;max-width:96%;margin:0 auto;background:#fff;border:1px solid #e2e6e2;border-radius:12px;overflow:hidden;">
    <tr><td style="background:#234d27;padding:18px 24px;">
      <table role="presentation" width="100%"><tr>
        <td style="width:52px;vertical-align:middle;"><img src="cid:jslogo" width="44" height="44" alt="July Sunflowers logo" style="display:block;border-radius:8px;background:#fff;" /></td>
        <td style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-.01em;padding-left:10px;">July Sunflowers <span style="font-weight:400;font-size:12px;color:#bcd6bd;">Wholesale Foodservice Supply</span></td>
        <td style="text-align:right;color:#ffd9ac;font-size:18px;font-weight:800;letter-spacing:2px;">PURCHASE ORDER</td>
      </tr></table>
    </td></tr>

    <tr><td style="padding:16px 24px 4px;">
      <table role="presentation" width="100%" style="font-size:13px;">
        <tr>
          <td style="color:#5a6b60;">Order No. <strong style="color:#234d27;">${esc(orderNumber)}</strong></td>
          <td style="text-align:right;color:#5a6b60;">Date <strong style="color:#234d27;">${esc(dateText)}</strong></td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:10px 24px 20px;">
      <table role="presentation" width="100%" cellspacing="0" style="border:1px solid #e2e6e2;border-collapse:collapse;font-size:12px;">
        ${bar("Vendor")}
        <tr>${infoCell("Name", "July Sunflowers")}${infoCell("Email", esc(process.env.CONTACT_EMAIL_DISPLAY || "info@jsf2024.com"))}</tr>
        ${bar("Customer")}
        <tr>${infoCell("Name", esc(customer.name))}${infoCell("Company", esc(customer.company || "-"))}</tr>
        <tr>${infoCell("Email", esc(customer.email))}${infoCell("Phone", esc(customer.phone))}</tr>
        <tr>${infoCell(
          "WhatsApp",
          waDigits ? `<a href="https://wa.me/${waDigits}" style="color:#2f7d32;">Chat buyer &rarr;</a>` : "-"
        )}${infoCell("Delivery address", esc(customer.address))}</tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" style="border-collapse:collapse;font-size:12px;margin-top:16px;">
        <tr style="background:#2f7d32;color:#fff;">
          <th style="padding:8px 10px;text-align:center;">No</th>
          <th style="padding:8px 10px;text-align:left;">Description</th>
          <th style="padding:8px 10px;text-align:center;">Unit</th>
          <th style="padding:8px 10px;text-align:right;">Qty</th>
          <th style="padding:8px 10px;text-align:right;">Unit Price</th>
          <th style="padding:8px 10px;text-align:right;">Total</th>
        </tr>
        ${rows}
      </table>

      <table role="presentation" width="100%" style="margin-top:14px;font-size:13px;">
        <tr>
          <td style="vertical-align:top;">
            <div style="font-size:10px;letter-spacing:.5px;text-transform:uppercase;color:#8a978d;margin-bottom:2px;">Notes</div>
            <div style="color:#3b423d;">${customer.notes ? esc(customer.notes) : "&mdash;"}</div>
          </td>
          <td style="text-align:right;vertical-align:top;white-space:nowrap;">
            <div style="color:#5a6b60;">Subtotal: ${grand}</div>
            <div style="font-size:17px;font-weight:800;color:#234d27;border-top:2px solid #2f7d32;padding-top:6px;margin-top:6px;">Total: ${grand}</div>
          </td>
        </tr>
      </table>

      <p style="margin:22px 0 0;font-size:11px;color:#8a978d;border-top:1px dashed #cdd8ce;padding-top:10px;">
        This is an order request, not a paid receipt. Please contact the customer to confirm availability, final case pricing, and delivery.
      </p>
    </td></tr>
  </table>
  </body></html>`;
}

// POST the composed email to Resend. Throws on failure.
export async function sendOrderEmail(payload, { apiKey, to, from }) {
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  if (!payload || !payload.orderNumber) throw new Error("Invalid order payload.");

  const html = buildEmailHtml(payload);
  const subject = `New order ${payload.orderNumber} — ${payload.customer?.name || "Website"}`;

  // The logo rides along as an inline attachment (cid:jslogo) so it renders in
  // Gmail and other clients that block remote/data-URI images.
  const attachments = [
    { filename: "logo.png", content: LOGO_BASE64, content_id: "jslogo" }
  ];
  if (payload.pdfBase64) {
    attachments.push({ filename: `${payload.orderNumber || "order"}.pdf`, content: payload.pdfBase64 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: from || "July Sunflowers <onboarding@resend.dev>",
      to: [to],
      reply_to: payload.customer?.email || undefined,
      subject,
      html,
      attachments
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Resend rejected the email (${res.status}).`);
  return { ok: true, id: data.id };
}

// Vercel serverless entry point.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const payload =
      typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body || "{}");
    await sendOrderEmail(payload, {
      apiKey: process.env.RESEND_API_KEY,
      to: process.env.ORDER_EMAIL || "info@jsf2024.com",
      from: process.env.ORDER_FROM || "July Sunflowers <onboarding@resend.dev>"
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
