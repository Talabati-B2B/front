import { api } from "../api";

export async function fetchCart() {
  const res = await api.get("/api/store/cart");
  const d = res.data?.data || res.data || {};
  const groups = d.suppliers_groups || [];
  const items = groups.flatMap((g) => g.items || []);
  return items.map((item) => normalizeCartItem(item, groups));
}

export async function addCartItem(productId, quantity = 1) {
  const res = await api.post("/api/store/cart/items", {
    product_id: productId,
    quantity,
  });
  return res.data;
}

export async function updateCartItem(cartItemId, quantity) {
  const res = await api.put(`/api/store/cart/items/${cartItemId}`, { quantity });
  return res.data;
}

export async function removeCartItem(cartItemId) {
  const res = await api.delete(`/api/store/cart/items/${cartItemId}`);
  return res.data;
}

export async function clearCart() {
  const res = await api.delete("/api/store/cart");
  return res.data;
}

function normalizeCartItem(item, groups) {
  const product = item.product || {};
  const hasNestedProduct = !!item.product;
  const imagePath = hasNestedProduct
    ? (product.image?.path || product.image_url)
    : (typeof item.image === "string" ? item.image : item.image?.path);
  const group = groups?.find((g) => g.items?.some((i) => i.id === item.id));
  return {
    id: item.id,
    cartItemId: item.id,
    productId: hasNestedProduct ? product.id : item.product_id,
    name: hasNestedProduct ? product.name : item.name,
    price: parseFloat(item.effective_price || product.sale_price || item.sale_price || product.price || item.price || 0),
    originalPrice: parseFloat(product.price || item.price || 0),
    quantity: item.quantity,
    availableQuantity: hasNestedProduct ? product.stock_quantity : item.stock_quantity,
    supplier: hasNestedProduct
      ? (product.supplier?.company_name || "")
      : (group?.supplier_name || ""),
    supplierId: hasNestedProduct ? product.supplier_id : (group?.supplier_id || item.supplier_id),
    image: imagePath,
    sku: product.sku || item.sku,
    stockUnit: hasNestedProduct ? (product.unit?.name || "") : (item.unit || ""),
  };
}
