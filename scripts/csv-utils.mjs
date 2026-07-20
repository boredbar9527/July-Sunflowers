// Shared CSV helpers for the catalog tooling (build script + local admin).
// The catalog CSV always uses the header below; keep it in one place.
export const CATALOG_HEADER = [
  "sku", "name", "category", "category_label", "unit", "price", "image", "hero_image", "story"
];

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }
  return rows;
}

function csvField(value) {
  const s = String(value ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

// Serialize rows (arrays of strings) back to the quoted style catalog.csv uses.
export function serializeCsv(header, rows) {
  const lines = [header.map(csvField).join(",")];
  for (const row of rows) lines.push(row.map(csvField).join(","));
  return lines.join("\n") + "\n";
}
