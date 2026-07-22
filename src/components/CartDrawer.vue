<script setup>
import { computed, reactive, ref } from "vue";
import { useCart } from "../composables/useCart.js";
import {
  buildInvoiceHtml,
  buildInvoiceText,
  formatPrice,
  nextOrderNumber,
  sendOrder
} from "../config.js";
import { buildInvoicePdf } from "../utils/invoicePdf.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  products: { type: Array, required: true }
});

defineEmits(["close"]);

const { items, setQty, clear } = useCart();

const customer = reactive({
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  notes: ""
});

const placedOrder = ref(null);
const sending = ref(false);
const sendError = ref("");

const lines = computed(() =>
  items.value
    .map((item) => {
      const product = props.products.find((p) => p.id === item.id);
      if (!product) return null;
      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        qty: item.qty,
        subtotal: product.price !== null ? product.price * item.qty : null
      };
    })
    .filter(Boolean)
);

const total = computed(() => {
  const priced = lines.value.filter((l) => l.subtotal !== null);
  if (!priced.length) return null;
  return priced.reduce((sum, l) => sum + l.subtotal, 0);
});

const hasUnpriced = computed(() => lines.value.some((l) => l.subtotal === null));

const canSubmit = computed(
  () =>
    lines.value.length > 0 &&
    customer.name.trim() !== "" &&
    customer.email.trim() !== "" &&
    customer.phone.trim() !== "" &&
    customer.address.trim() !== ""
);

async function placeOrder() {
  if (!canSubmit.value || sending.value) return;
  sending.value = true;
  sendError.value = "";
  const orderNumber = nextOrderNumber();
  const snapshot = { ...customer };
  const invoice = buildInvoiceText(orderNumber, lines.value, total.value, snapshot);
  const dateText = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const invoiceHtml = buildInvoiceHtml(
    orderNumber,
    lines.value,
    total.value,
    snapshot,
    dateText
  );
  const lineSnapshot = lines.value.map((l) => ({ ...l }));
  const totalSnapshot = total.value;
  // Generate the PO as a PDF to attach to the order email (best-effort).
  const pdfBase64 = await buildInvoicePdf({
    orderNumber,
    dateText,
    customer: snapshot,
    lines: lineSnapshot,
    total: totalSnapshot
  }).catch(() => null);
  try {
    const result = await sendOrder(
      orderNumber,
      invoice,
      snapshot,
      lineSnapshot,
      totalSnapshot,
      dateText,
      pdfBase64
    );
    placedOrder.value = {
      number: orderNumber,
      invoice,
      invoiceHtml,
      via: result.via,
      lines: lineSnapshot,
      total: totalSnapshot
    };
    clear();
  } catch (err) {
    sendError.value =
      (err && err.message) ||
      "We couldn't send the order automatically. Please email us or try again.";
  } finally {
    sending.value = false;
  }
}

function printInvoice() {
  if (!placedOrder.value) return;
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) return;
  win.document.write(placedOrder.value.invoiceHtml);
  win.document.close();
  win.focus();
  // Give the logo a moment to load before the print dialog opens.
  setTimeout(() => win.print(), 350);
}

function startNewOrder() {
  placedOrder.value = null;
  sendError.value = "";
}
</script>

<template>
  <div class="cart-drawer" :hidden="!open" :aria-hidden="String(!open)">
    <button
      class="product-drawer__backdrop"
      type="button"
      aria-label="Close order list"
      @click="$emit('close')"
    ></button>

    <aside class="cart-drawer__panel" aria-labelledby="cart-title">
      <button
        class="product-drawer__close"
        type="button"
        aria-label="Close order list"
        @click="$emit('close')"
      >
        Close
      </button>

      <template v-if="placedOrder">
        <p class="eyebrow">Order received</p>
        <h2 id="cart-title">Thank you! 🎉</h2>
        <p class="cart-drawer__success">
          Your order <strong>{{ placedOrder.number }}</strong> has been sent to July Sunflowers.
          <strong>Our team will contact you shortly</strong> to confirm availability, pricing, and delivery.
        </p>
        <p class="cart-drawer__hint" v-if="placedOrder.via === 'mailto'">
          Your email app should have opened with this order. If it didn't, use Print / Save as PDF below and send it to us.
        </p>

        <table class="cart-table cart-table--summary">
          <thead>
            <tr><th>Product</th><th>Cases</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            <tr v-for="line in placedOrder.lines" :key="line.id">
              <td>
                <strong>{{ line.sku }}</strong>
                <span class="cart-table__name">{{ line.name }}</span>
              </td>
              <td>{{ line.qty }}</td>
              <td class="cart-table__price">
                {{ line.subtotal !== null ? formatPrice(line.subtotal) : "Ask" }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total</td>
              <td class="cart-table__price">
                {{ placedOrder.total !== null ? formatPrice(placedOrder.total) : "On request" }}
              </td>
            </tr>
          </tfoot>
        </table>

        <div class="cart-drawer__actions">
          <button class="button button--primary" type="button" @click="printInvoice">
            🖨 Print / Save as PDF
          </button>
          <button class="button button--secondary" type="button" @click="startNewOrder">
            Start a new order
          </button>
        </div>
      </template>

      <template v-else>
        <p class="eyebrow">Your order</p>
        <h2 id="cart-title">Order list</h2>

        <p class="cart-drawer__empty" v-if="!lines.length">
          No items yet. Use "Add to order" on any product.
        </p>

        <template v-else>
          <table class="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Cases</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in lines" :key="line.id">
                <td>
                  <strong>{{ line.sku }}</strong>
                  <span class="cart-table__name">{{ line.name }}</span>
                </td>
                <td>
                  <div class="qty-stepper">
                    <button type="button" @click="setQty(line.id, line.qty - 1)" aria-label="Decrease">−</button>
                    <span>{{ line.qty }}</span>
                    <button type="button" @click="setQty(line.id, line.qty + 1)" aria-label="Increase">+</button>
                  </div>
                </td>
                <td class="cart-table__price">
                  {{ line.subtotal !== null ? formatPrice(line.subtotal) : "Ask" }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">Estimated total</td>
                <td class="cart-table__price">
                  {{ total !== null ? formatPrice(total) : "On request" }}
                </td>
              </tr>
            </tfoot>
          </table>
          <p class="cart-drawer__hint" v-if="hasUnpriced">
            Some items are priced on request — we'll confirm the final total by email.
          </p>

          <form class="cart-form" @submit.prevent="placeOrder">
            <div class="cart-form__grid">
              <label>
                Name *
                <input v-model="customer.name" type="text" required autocomplete="name" />
              </label>
              <label>
                Company
                <input v-model="customer.company" type="text" autocomplete="organization" />
              </label>
              <label>
                Email *
                <input v-model="customer.email" type="email" required autocomplete="email" />
              </label>
              <label>
                Phone *
                <input v-model="customer.phone" type="tel" required autocomplete="tel" />
              </label>
            </div>
            <label>
              Delivery address *
              <textarea v-model="customer.address" rows="2" required autocomplete="street-address"></textarea>
            </label>
            <label>
              Notes
              <textarea v-model="customer.notes" rows="2"></textarea>
            </label>

            <p class="cart-drawer__error" v-if="sendError">{{ sendError }}</p>

            <div class="cart-drawer__actions">
              <button class="button button--primary" type="submit" :disabled="!canSubmit || sending">
                {{ sending ? "Sending…" : "Send order via email" }}
              </button>
            </div>
          </form>
        </template>
      </template>
    </aside>
  </div>
</template>
