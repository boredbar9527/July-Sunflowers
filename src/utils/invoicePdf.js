// Generates a Purchase Order PDF (base64) on the client, lazily loading jsPDF so
// it never bloats the initial bundle. Returns raw base64 (no data: prefix),
// ready for Resend's attachment `content` field.
import { CONTACT_EMAIL, STORE_ADDRESS, CONTACT_PHONE_DISPLAY } from "../config.js";
import { LOGO_BASE64 } from "../data/logoData.js";

const money = (v) =>
  v === null || v === undefined || v === "" || Number.isNaN(Number(v))
    ? "On request"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(v));

export async function buildInvoicePdf({ orderNumber, dateText, customer = {}, lines = [], total = null }) {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable")
  ]);
  const autoTable = autoTableMod.default || autoTableMod.autoTable;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 40;
  const GREEN = [47, 125, 50];
  const DARK = [35, 77, 39];
  const GRAY = [138, 151, 141];
  const INK = [31, 42, 36];

  // Header — logo left, brand text beside it
  try {
    doc.addImage(`data:image/png;base64,${LOGO_BASE64}`, "PNG", M, 26, 40, 40);
  } catch {
    // A corrupt/unsupported image must never block the PO itself.
  }
  const TX = M + 50;
  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...DARK);
  doc.text("July Sunflowers", TX, 48);
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...GRAY);
  doc.text("WHOLESALE FOODSERVICE SUPPLY", TX, 60);
  doc.setFont("helvetica", "bold").setFontSize(17).setTextColor(...GREEN);
  doc.text("PURCHASE ORDER", W - M, 50, { align: "right" });
  doc.setDrawColor(...GREEN).setLineWidth(2).line(M, 74, W - M, 74);

  // Order meta
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GRAY);
  doc.text("Order No.", M, 92);
  doc.setFont("helvetica", "bold").setTextColor(...DARK).text(String(orderNumber), M + 54, 92);
  doc.setFont("helvetica", "normal").setTextColor(...GRAY).text("Date", W - M - 150, 92);
  doc.setFont("helvetica", "bold").setTextColor(...DARK).text(String(dateText), W - M - 122, 92);

  let y = 106;
  const half = (W - 2 * M) / 2;
  const bar = (label) => {
    doc.setFillColor(...GREEN).rect(M, y, W - 2 * M, 15, "F");
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(255, 255, 255);
    doc.text(label.toUpperCase(), M + 6, y + 10.5);
    y += 15;
  };
  const kv = (x, w, label, value) => {
    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...GRAY);
    doc.text(label.toUpperCase(), x + 2, y + 10);
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...INK);
    doc.text(doc.splitTextToSize(String(value || "-"), w - 8), x + 2, y + 21);
  };

  bar("Vendor");
  kv(M, half, "Name", "July Sunflowers");
  kv(M + half, half, "Email", CONTACT_EMAIL);
  y += 26;
  kv(M, half, "Address", STORE_ADDRESS);
  kv(M + half, half, "Phone", CONTACT_PHONE_DISPLAY);
  y += 32;

  bar("Customer");
  kv(M, half, "Name", customer.name);
  kv(M + half, half, "Company", customer.company || "-");
  y += 26;
  kv(M, half, "Email", customer.email);
  kv(M + half, half, "Phone", customer.phone);
  y += 26;
  kv(M, W - 2 * M, "Delivery Address", customer.address);
  y += 34;

  autoTable(doc, {
    startY: y,
    head: [["No", "Description", "Unit", "Qty", "Unit Price", "Total"]],
    body: lines.map((l, i) => [
      i + 1,
      `${l.name}  ·  #${l.sku}`,
      "case",
      l.qty,
      l.price != null ? money(l.price) : "—",
      money(l.subtotal)
    ]),
    theme: "grid",
    headStyles: { fillColor: GREEN, textColor: 255, fontSize: 9, halign: "left" },
    bodyStyles: { fontSize: 9, textColor: INK },
    columnStyles: {
      0: { halign: "center", cellWidth: 30 },
      2: { halign: "center", cellWidth: 42 },
      3: { halign: "right", cellWidth: 38 },
      4: { halign: "right", cellWidth: 70 },
      5: { halign: "right", cellWidth: 72 }
    },
    margin: { left: M, right: M }
  });

  const fy = doc.lastAutoTable.finalY;

  // Totals (right)
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GRAY);
  doc.text("Subtotal", W - M - 150, fy + 22);
  doc.text(money(total), W - M, fy + 22, { align: "right" });
  doc.setDrawColor(...GREEN).setLineWidth(1.5).line(W - M - 155, fy + 30, W - M, fy + 30);
  doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(...DARK);
  doc.text("Total", W - M - 150, fy + 47);
  doc.text(money(total), W - M, fy + 47, { align: "right" });

  // Notes (left)
  if (customer.notes) {
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...GRAY);
    doc.text("NOTES", M, fy + 22);
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...INK);
    doc.text(doc.splitTextToSize(String(customer.notes), 250), M, fy + 34);
  }

  doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...GRAY);
  doc.text(
    "This is an order request, not a paid receipt. July Sunflowers will confirm availability, pricing, and delivery.",
    M,
    fy + 82
  );

  return doc.output("datauristring").split(",")[1];
}
