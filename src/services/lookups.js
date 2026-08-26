import { api } from "./api";

// نسخة احتياطية تُستخدم فقط إذا تعذّر جلب المصدر الحيّ من /api/public/store-types.
export const FALLBACK_STORE_TYPES = [
  { value: 1, label: "سوبرماركت" },
  { value: 2, label: "بقالة وميني ماركت" },
  { value: 3, label: "صيدلية ومستلزمات طبية" },
  { value: 4, label: "مطعم ووجبات سريعة" },
];

// نسخة احتياطية تُستخدم فقط إذا تعذّر جلب المصدر الحيّ من /api/public/categories.
export const FALLBACK_SUPPLIER_CATEGORIES = [
  { value: 1, label: "مواد غذائية" },
  { value: 2, label: "منظفات" },
  { value: 3, label: "أدوية" },
  { value: 4, label: "متنوع" },
  { value: 5, label: "مواد بناء" },
  { value: 6, label: "إلكترونيات" },
];

function toOptions(rows) {
  return rows.map((row) => ({ value: row.id, label: row.name }));
}

export async function fetchStoreTypes() {
  try {
    // مسار عام لا يتطلب توكن — يعمل من صفحة التسجيل
    const res = await api.get("/api/public/store-types");
    const rows = res.data?.data;

    if (!Array.isArray(rows) || rows.length === 0) return FALLBACK_STORE_TYPES;

    return toOptions(rows);
  } catch {
    return FALLBACK_STORE_TYPES;
  }
}

export async function fetchSupplierCategories() {
  try {
    // مسار عام لا يتطلب توكن — يعمل من صفحة التسجيل
    const res = await api.get("/api/public/categories");
    const rows = res.data?.data;

    if (!Array.isArray(rows) || rows.length === 0) {
      return FALLBACK_SUPPLIER_CATEGORIES;
    }

    return toOptions(rows);
  } catch {
    return FALLBACK_SUPPLIER_CATEGORIES;
  }
}

// نموذج الخطوة الثالثة يستدعي هذه حسب الدور المختار
export function fetchBusinessTypes(role) {
  return role === "supplier" ? fetchSupplierCategories() : fetchStoreTypes();
}
