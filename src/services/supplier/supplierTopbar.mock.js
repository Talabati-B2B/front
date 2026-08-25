export const SUPPLIER_NOTIFICATIONS_STORAGE_KEY =
  "talabaty-supplier-topbar-notifications";

export const supplierTopbarSearchItems = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    meta: "الملخص والإحصائيات",
    route: "/",
    keywords: ["لوحة التحكم", "الرئيسية", "dashboard", "home"],
  },
  {
    id: "orders",
    label: "الطلبات الواردة",
    meta: "إدارة وتتبع طلبات المتاجر",
    route: "/orders",
    keywords: [
      "طلب",
      "طلبات",
      "الطلبات",
      "عميل",
      "عملاء",
      "order",
      "orders",
    ],
  },
  {
    id: "products",
    label: "المنتجات",
    meta: "إدارة المنتجات والمخزون",
    route: "/products",
    keywords: [
      "منتج",
      "منتجات",
      "المخزون",
      "مخزون",
      "product",
      "products",
      "stock",
    ],
  },
  {
    id: "add-product",
    label: "إضافة منتج جديد",
    meta: "إضافة منتج إلى مخزون المورد",
    route: "/products/add",
    keywords: ["إضافة منتج", "منتج جديد", "add product"],
  },
  {
    id: "reports",
    label: "التقارير",
    meta: "تقارير المورد",
    route: "/reports",
    keywords: ["تقرير", "تقارير", "reports", "report"],
  },
  {
    id: "settings",
    label: "الإعدادات",
    meta: "إعدادات حساب المورد",
    route: "/settings",
    keywords: ["إعدادات", "الاعدادات", "settings", "setting"],
  },
  {
    id: "profile",
    label: "الملف الشخصي",
    meta: "بيانات المورد والشركة",
    route: "/profile",
    keywords: [
      "الملف الشخصي",
      "الملف",
      "حساب",
      "profile",
      "account",
    ],
  },
];

export const supplierTopbarNotifications = [
  {
    id: 1,
    type: "low-stock",
    title: "منتجات منخفضة المخزون",
    message: "لديك 12 منتجاً منخفض المخزون",
    route: "/products",
    read: false,
  },
  {
    id: 2,
    type: "new-orders",
    title: "طلبات جديدة",
    message: "لديك 8 طلبات جديدة لم تتم معالجتها",
    route: "/orders",
    read: false,
  },
  {
    id: 3,
    type: "price-update",
    title: "تحديث الأسعار",
    message: "تم تحديث أسعار بعض المنتجات",
    route: "/products",
    read: true,
  },
];

export function readSupplierTopbarNotificationsMock() {
  try {
    const stored = window.localStorage.getItem(
      SUPPLIER_NOTIFICATIONS_STORAGE_KEY,
    );

    if (!stored) {
      return supplierTopbarNotifications;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : supplierTopbarNotifications;
  } catch {
    return supplierTopbarNotifications;
  }
}

export function saveSupplierTopbarNotificationsMock(
  notifications,
) {
  try {
    window.localStorage.setItem(
      SUPPLIER_NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications),
    );
  } catch {
    // Local persistence is optional;
    // in-memory state still works.
  }

  return notifications;
}