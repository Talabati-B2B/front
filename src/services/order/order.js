// Local mock data for the Supplier Orders page.
// Replace with API data when the backend contract is available.
export const orderStatuses = [
  "بانتظار القبول",
  "قيد التجهيز",
  "قيد التغليف",
  "قيد النقل",
  "تم التسليم",
  "مرفوض",
];

export const orderStatusTransitions = {
  "بانتظار القبول": {
    accept: "قيد التجهيز",
    reject: "مرفوض",
  },
  "قيد التجهيز": "قيد التغليف",
  "قيد التغليف": "قيد النقل",
  "قيد النقل": "تم التسليم",
};

export const orderStats = [
  {
    id: "total",
    label: "إجمالي الطلبات الواردة",
    value: "1,284",
    icon: "total",
    badge: { text: "+12%", tone: "success" },
  },
  {
    id: "pending",
    label: "بانتظار القبول",
    value: "42",
    icon: "pending",
    badge: { text: "تنبيه", tone: "warning" },
  },
  {
    id: "processing",
    label: "قيد التجهيز",
    value: "156",
    icon: "processing",
    badge: null,
  },
  {
    id: "completed",
    label: "مكتملة اليوم",
    value: "89",
    icon: "completed",
    badge: null,
  },
];

export const orders = [
  {
    id: 1,
    orderNumber: "TB-OR-001",
    storeName: "بيتي مول",
    date: "2026/07/24",
    total: 240,
    status: "بانتظار القبول",
  },
  {
    id: 2,
    orderNumber: "TB-OR-002",
    storeName: "لاكاسا مول",
    date: "2026/07/20",
    total: 30,
    status: "قيد التجهيز",
  },
  {
    id: 3,
    orderNumber: "TB-OR-003",
    storeName: "سوبر ماركت عجور",
    date: "2026/07/16",
    total: 40,
    status: "قيد التغليف",
  },
  {
    id: 4,
    orderNumber: "TB-OR-004",
    storeName: "مطعم بلدنا",
    date: "2026/07/14",
    total: 50,
    status: "قيد النقل",
  },
  {
    id: 5,
    orderNumber: "TB-OR-005",
    storeName: "بازوكا كافي",
    date: "2026/07/10",
    total: 50,
    status: "تم التسليم",
  },
  {
    id: 6,
    orderNumber: "TB-OR-006",
    storeName: "سوبر ماركت الأصدقاء",
    date: "2026/07/08",
    total: 180,
    status: "مرفوض",
  },
  {
    id: 7,
    orderNumber: "TB-OR-007",
    storeName: "متجر الوفاء",
    date: "2026/07/06",
    total: 320,
    status: "بانتظار القبول",
  },
  {
    id: 8,
    orderNumber: "TB-OR-008",
    storeName: "ماركت المدينة",
    date: "2026/07/04",
    total: 125,
    status: "قيد التجهيز",
  },
  {
    id: 9,
    orderNumber: "TB-OR-009",
    storeName: "أسواق النخيل",
    date: "2026/07/02",
    total: 275,
    status: "قيد التغليف",
  },
  {
    id: 10,
    orderNumber: "TB-OR-010",
    storeName: "متجر الجودة",
    date: "2026/06/30",
    total: 410,
    status: "قيد النقل",
  },
];

export const topStores = [
  {
    id: 1,
    name: "سوبر ماركت الأصدقاء",
    activeOrders: 24,
    revenue: "15,400",
    progress: 80,
  },
  {
    id: 2,
    name: "كيرفور",
    activeOrders: 18,
    revenue: "12,100",
    progress: 62,
  },
];

export const recentActivities = [
  {
    id: 1,
    title: "تم قبول الطلب #ORD-94208",
    time: "منذ 5 دقائق",
    type: "accepted",
  },
  {
    id: 2,
    title: "طلب جديد بانتظار القبول",
    time: "منذ 12 دقيقة",
    type: "pending",
  },
  {
    id: 3,
    title: "تم رفض الطلب #ORD-94182",
    time: "منذ 45 دقيقة",
    type: "rejected",
  },
  {
  id: 4,
  title: "تم بدء تجهيز الطلب #ORD-94175",
  time: "منذ ساعة",
  type: "accepted",
},
{
  id: 5,
  title: "طلب جديد بانتظار القبول",
  time: "منذ ساعتين",
  type: "pending",
},
{
  id: 6,
  title: "تم رفض الطلب #ORD-94160",
  time: "منذ 3 ساعات",
  type: "rejected",
},
];