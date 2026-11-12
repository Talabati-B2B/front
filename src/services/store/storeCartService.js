import { api } from "../api";

/*
 * سلة المتجر وطلباته من الباك (/api/store/cart/*, /api/store/order/*).
 * نحافظ على الشكل الذي تقرؤه الشاشات (Cart.jsx / Orders.jsx) ونحوّل هنا فقط.
 */

export function mapCartItem(raw) {
  return {
    // id = رقم المنتج (الشاشات تتعامل بهذا)، و cartItemId هو رقم العنصر في السلة
    id: raw.product_id,
    cartItemId: raw.id,
    name: raw.name,
    sku: raw.sku ?? "",
    image: raw.image_url,
    price: Number(raw.price) || 0,
    quantity: Number(raw.quantity) || 1,
    availableQuantity: Number(raw.available_quantity) || 0,
    stockUnit: raw.stock_unit ?? "",
    negotiationMinQuantity: Number(raw.negotiation_min_quantity) || 0,
    supplierId: raw.supplier_id,
    supplierName: raw.supplier?.company_name ?? "مورد",
  };
}

export async function fetchCart() {
  const res = await api.get("/api/store/cart");

  return (res.data?.data?.items ?? []).map(mapCartItem);
}

export async function addCartItem(productId, quantity = 1) {
  await api.post("/api/store/cart/add", {
    product_id: productId,
    quantity,
  });
}

export async function updateCartItem(cartItemId, quantity) {
  await api.put(`/api/store/cart/item/${cartItemId}`, { quantity });
}

export async function removeCartItemById(cartItemId) {
  await api.delete(`/api/store/cart/item/${cartItemId}`);
}

// ----- الطلبات -----

/*
 * حالات الباك أدق من حالات الشاشة الحالية (pending/approved/rejected):
 * pending -> pending، canceled -> rejected، وأي حالة بعد القبول -> approved.
 */
const UI_STATUS = {
  pending: "pending",
  canceled: "rejected",
};

const FINISHED = ["delivered", "canceled"];

function formatDate(date) {
  return date.toLocaleDateString("ar-u-nu-latn", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("ar-u-nu-latn", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function mapOrder(raw) {
  const created = new Date(raw.created_at);
  const supplierName = raw.supplier?.company_name ?? "مورد";

  return {
    id: raw.id,
    orderNumber: `#${raw.order_number}`,
    storeId: raw.store?.id,
    storeName: raw.store?.store_name ?? "",
    supplierId: raw.supplier?.id,
    supplierName,
    supplier: supplierName,
    supplierInitial: supplierName.trim().charAt(0) || "م",
    supplierClass: "bg-[#40577B]",
    items: (raw.items ?? []).map((item) => ({
      productId: item.product_id,
      name: item.name,
      sku: item.sku ?? "",
      image: item.image_url,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unit_price) || 0,
    })),
    total: Number(raw.total_price) || 0,
    status: UI_STATUS[raw.status] ?? "approved",
    backendStatus: raw.status,
    createdAt: raw.created_at,
    date: String(raw.created_at).slice(0, 10),
    dateLabel: formatDate(created),
    timeLabel: formatTime(created),
    paymentStatus: raw.payment_status === "paid" ? "مدفوع" : "غير مدفوع",
    deliveryAddress: raw.delivery_address ?? "",
    rejectionReason: null,
    isPrevious: FINISHED.includes(raw.status),
  };
}

export async function fetchMyOrders() {
  const res = await api.get("/api/store/order/my-orders");

  return (res.data?.data ?? []).map(mapOrder);
}

// يرجّع الطلبات المنشأة (طلب لكل مورد في السلة)
export async function checkoutCart() {
  const res = await api.post("/api/store/order/checkout");

  return (res.data?.data ?? []).map(mapOrder);
}
