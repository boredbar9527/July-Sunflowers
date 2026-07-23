import { supabase } from "../supabase.js";

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const gate = $("gate");
const app = $("app");
const rowsEl = $("rows");
const dlg = $("dlg");

let products = [];
let editingId = null;

function toast(msg, isError = false) {
  const t = $("toast");
  t.textContent = msg;
  t.className = "show" + (isError ? " error" : "");
  setTimeout(() => (t.className = ""), 2600);
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "uncategorized";
}

const money = (v) =>
  v != null && v !== "" ? `$${Number(v).toFixed(2)}` : "Call for price";

// ---------- auth ----------
async function currentAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();
  return data ? user : { notAdmin: true, email: user.email };
}

async function refreshAuthUI() {
  const admin = await currentAdmin();
  if (admin && !admin.notAdmin) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
    $("who").textContent = admin.email;
    await loadProducts();
  } else {
    app.classList.add("hidden");
    gate.classList.remove("hidden");
    if (admin && admin.notAdmin) {
      $("login-msg").textContent =
        `${admin.email} is not an authorized admin. Ask the owner to add you.`;
      await supabase.auth.signOut();
    }
  }
}

$("login-send").addEventListener("click", async () => {
  const email = $("login-email").value.trim();
  if (!email) return toast("Enter your email", true);
  $("login-send").disabled = true;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + "/admin" }
  });
  $("login-send").disabled = false;
  if (error) {
    $("login-msg").textContent = "Error: " + error.message;
  } else {
    $("login-msg").textContent =
      "Check your inbox — we sent a login link to " + email + ".";
  }
});

$("logout").addEventListener("click", async () => {
  await supabase.auth.signOut();
  location.reload();
});

// ---------- products ----------
async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return toast("Load failed: " + error.message, true);
  products = data || [];
  renderRows();
  renderCategoryList();
}

function renderCategoryList() {
  const labels = [...new Set(products.map((p) => p.category_label).filter(Boolean))];
  $("catlist").innerHTML = labels.map((l) => `<option value="${l.replace(/"/g, "&quot;")}">`).join("");
}

function renderRows() {
  const q = $("search").value.trim().toLowerCase();
  const list = q
    ? products.filter((p) =>
        `${p.sku} ${p.name} ${p.category_label}`.toLowerCase().includes(q))
    : products;
  $("count").textContent = products.length;
  rowsEl.innerHTML = list
    .map(
      (p) => `
    <tr>
      <td>${p.image ? `<img class="thumb" src="${p.image}" alt="">` : ""}</td>
      <td>${esc(p.sku)}</td>
      <td>${esc(p.name)}</td>
      <td>${esc(p.category_label)}</td>
      <td>${esc(p.unit || "")}</td>
      <td class="num">${money(p.price)}</td>
      <td class="actions">
        <button class="ghost" data-edit="${p.id}">Edit</button>
        <button class="danger" data-del="${p.id}">Delete</button>
      </td>
    </tr>`
    )
    .join("");
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

$("search").addEventListener("input", renderRows);

rowsEl.addEventListener("click", async (e) => {
  const editId = e.target.getAttribute("data-edit");
  const delId = e.target.getAttribute("data-del");
  if (editId) openDialog(products.find((p) => p.id === editId));
  if (delId) {
    const p = products.find((x) => x.id === delId);
    if (!confirm(`Delete "${p.name}" (${p.sku})?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", delId);
    if (error) return toast("Delete failed: " + error.message, true);
    toast("Deleted");
    await loadProducts();
  }
});

// ---------- add / edit dialog ----------
function openDialog(p) {
  editingId = p ? p.id : null;
  $("dlg-title").textContent = p ? "Edit listing" : "Add listing";
  $("f-sku").value = p?.sku || "";
  $("f-name").value = p?.name || "";
  $("f-catlabel").value = p?.category_label || "";
  $("f-unit").value = p?.unit || "";
  $("f-price").value = p?.price ?? "";
  $("f-image").value = p?.image || "";
  $("f-file").value = "";
  const prev = $("f-preview");
  if (p?.image) { prev.src = p.image; prev.style.display = "block"; }
  else prev.style.display = "none";
  dlg.showModal();
}

$("btn-add").addEventListener("click", () => openDialog(null));
$("dlg-cancel").addEventListener("click", () => dlg.close());

$("f-file").addEventListener("change", async () => {
  const file = $("f-file").files[0];
  if (!file) return;
  $("dlg-save").disabled = true;
  toast("Uploading image…");
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `uploads/${Date.now()}-${Math.floor(performance.now())}.${ext}`;
  const { error } = await supabase.storage
    .from("catalog")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  $("dlg-save").disabled = false;
  if (error) return toast("Upload failed: " + error.message, true);
  const { data } = supabase.storage.from("catalog").getPublicUrl(path);
  $("f-image").value = data.publicUrl;
  const prev = $("f-preview");
  prev.src = data.publicUrl;
  prev.style.display = "block";
  toast("Image uploaded");
});

$("dlg-save").addEventListener("click", async () => {
  const sku = $("f-sku").value.trim();
  const name = $("f-name").value.trim();
  const label = $("f-catlabel").value.trim();
  if (!sku || !name || !label) return toast("SKU, name and category are required", true);
  const priceRaw = $("f-price").value.trim();
  const record = {
    sku,
    name,
    category_label: label,
    category: slugify(label),
    unit: $("f-unit").value.trim(),
    price: priceRaw === "" ? 0 : Number(priceRaw),
    image: $("f-image").value.trim(),
    updated_at: new Date().toISOString()
  };
  $("dlg-save").disabled = true;
  let error;
  if (editingId) {
    ({ error } = await supabase.from("products").update(record).eq("id", editingId));
  } else {
    record.sort_order = products.length + 1;
    ({ error } = await supabase.from("products").insert(record));
  }
  $("dlg-save").disabled = false;
  if (error) return toast("Save failed: " + error.message, true);
  dlg.close();
  toast(editingId ? "Listing updated" : "Listing added");
  await loadProducts();
});

// ---------- price adjust ----------
$("adj-apply").addEventListener("click", async () => {
  const pct = Number($("adj-pct").value);
  if (!pct || Number.isNaN(pct)) return toast("Enter a percentage", true);
  if (!confirm(`Adjust ALL ${products.length} prices by ${pct}%?`)) return;
  const factor = 1 + pct / 100;
  const updates = products.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category,
    category_label: p.category_label,
    price: Math.max(0, Math.round(Number(p.price || 0) * factor * 100) / 100)
  }));
  $("adj-apply").disabled = true;
  const { error } = await supabase.from("products").upsert(updates);
  $("adj-apply").disabled = false;
  if (error) return toast("Adjust failed: " + error.message, true);
  $("adj-pct").value = "";
  toast(`Prices adjusted by ${pct}%`);
  await loadProducts();
});

// ---------- boot ----------
supabase.auth.onAuthStateChange(() => refreshAuthUI());
refreshAuthUI();
