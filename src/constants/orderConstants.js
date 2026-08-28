export const ORDER_STATUSES = {
  pending: {
    key: "pending",
    label: "معلق",
    labelEn: "Pending",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  accepted: {
    key: "accepted",
    label: "مقبول",
    labelEn: "Accepted",
    color: "#10b981",
    bg: "#d1fae5",
  },
  preparing: {
    key: "preparing",
    label: "قيد التجهيز",
    labelEn: "Preparing",
    color: "#6366f1",
    bg: "#e0e7ff",
  },
  shipped: {
    key: "shipped",
    label: "تم الشحن",
    labelEn: "Shipped",
    color: "#3b82f6",
    bg: "#dbeafe",
  },
  delivered: {
    key: "delivered",
    label: "تم التسليم",
    labelEn: "Delivered",
    color: "#059669",
    bg: "#a7f3d0",
  },
  canceled: {
    key: "canceled",
    label: "ملغي",
    labelEn: "Canceled",
    color: "#ef4444",
    bg: "#fee2e2",
  },
  negotiating: {
    key: "negotiating",
    label: "قيد التفاوض",
    labelEn: "Negotiating",
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
  price_proposed: {
    key: "price_proposed",
    label: "عرض سعر جديد",
    labelEn: "Price Proposed",
    color: "#d97706",
    bg: "#fde68a",
  },
  cancellation_requested: {
    key: "cancellation_requested",
    label: "طلب إلغاء معلق",
    labelEn: "Cancellation Requested",
    color: "#dc2626",
    bg: "#fecaca",
  },
};

export const ORDER_STATUS_LIST = Object.values(ORDER_STATUSES);

export const ORDER_TYPES = {
  direct: { key: "direct", label: "مباشر", labelEn: "Direct" },
  negotiated: { key: "negotiated", label: "تفاوضي", labelEn: "Negotiated" },
};

export function getStatusInfo(status) {
  return ORDER_STATUSES[status] || { key: status, label: status, labelEn: status, color: "#6b7280", bg: "#f3f4f6" };
}
