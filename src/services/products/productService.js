import { api } from "../api";
import fallbackImage from "../../assets/images/product-tissues.png";

/*
 * خدمة المنتجات الحقيقية (تحل محل services/store/storeProducts.mock.js).
 *
 * الباك يرجّع snake_case وحالة المخزون برموز (in_stock...). نحوّلها هنا مرة واحدة
 * إلى الشكل الذي تقرؤه الصفحات أصلاً (availableQuantity, stockStatus بالعربية...)
 * فلا تتغيّر شاشات العرض.
 */

export const STOCK_STATUS_LABELS = {
  in_stock: "متوفر",
  low_stock: "مخزون منخفض",
  out_of_stock: "نفذ المخزون",
};

export const STOCK_STATUSES = Object.values(STOCK_STATUS_LABELS);

export function mapProduct(raw) {
  const quantity = Number(raw.quantity) || 0;
  const supplierName = raw.supplier?.company_name ?? "";

  return {
    id: raw.id,
    name: raw.name ?? "",
    description: raw.description ?? "",
    sku: raw.sku ?? "",

    categoryId: raw.category_id,
    category: raw.category?.name ?? "",

    price: Number(raw.price) || 0,
    suggestedPrice: Number(raw.suggested_price) || 0,

    availableQuantity: quantity,
    stockQuantity: quantity,
    quantity,
    minimumStock: Number(raw.minimum_stock) || 0,
    unitId: raw.unit_id,
    stockUnit: raw.unit?.name ?? "",
    stockStatus: STOCK_STATUS_LABELS[raw.stock_status] ?? STOCK_STATUS_LABELS.in_stock,

    image: raw.image_url || fallbackImage,

    supplierId: raw.supplier_id,
    supplierName,
    supplier: supplierName,
  };
}

const mapList = (res) => (res.data?.data ?? []).map(mapProduct);

/* ---------------- المورد ---------------- */

export async function fetchSupplierProducts() {
  return mapList(await api.get("/api/supplier/products"));
}

/**
 * data: { name, description, categoryId, sku, price, suggestedPrice,
 *         quantity, minimumStock, unitId, image: File }
 */
export async function createSupplierProduct(data) {
  const form = new FormData();

  form.append("name", data.name);
  form.append("description", data.description);
  form.append("category_id", data.categoryId);
  form.append("sku", data.sku);
  form.append("price", data.price);
  form.append("suggested_price", data.suggestedPrice);
  form.append("quantity", data.quantity);
  form.append("minimum_stock", data.minimumStock);
  form.append("unit_id", data.unitId);
  form.append("image", data.image);

  const res = await api.post("/api/supplier/products", form);

  return mapProduct(res.data.data);
}

/** changes: { name, sku, categoryId, price, quantity, unitId } */
export async function updateSupplierProduct(id, changes) {
  const res = await api.put(`/api/supplier/products/${id}`, {
    name: changes.name,
    sku: changes.sku,
    category_id: changes.categoryId,
    price: changes.price,
    quantity: changes.quantity,
    unit_id: changes.unitId,
  });

  return mapProduct(res.data.data);
}

export async function deleteSupplierProduct(id) {
  await api.delete(`/api/supplier/products/${id}`);
}

/* ---------------- المتجر ---------------- */

export async function fetchStoreProducts() {
  return mapList(await api.get("/api/store/products"));
}

/* ---------------- الأدمن (واجهة الشاشة تُربط لاحقاً) ---------------- */

export async function fetchAdminProducts() {
  return mapList(await api.get("/api/admin/products"));
}

export async function deleteAdminProduct(id) {
  await api.delete(`/api/admin/products/${id}`);
}
