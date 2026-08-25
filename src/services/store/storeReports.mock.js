export const storeReportsOverview = {
  totalPurchases: {
    label: "إجمالي المشتريات",
    value: 125400,
    currency: "SAR",
    comparison: "+15% مقارنة بالشهر السابق",
  },
  completedOrders: {
    label: "الطلبات المكتملة",
    value: 142,
    helper: "عبر جميع القنوات",
  },
  achievedSavings: {
    label: "التوفير المحقق",
    value: 8200,
    currency: "SAR",
    helper: "بفضل عروض الموردين",
  },
  activeSuppliers: {
    label: "الموردون النشطون",
    value: 18,
    helper: "موردون معتمدون حالياً",
  },
};

export const monthlyPurchases = [
  { month: "Jan", value: 11 },
  { month: "Feb", value: 12 },
  { month: "Mar", value: 13 },
  { month: "Apr", value: 14 },
  { month: "May", value: 18 },
  { month: "Jun", value: 19 },
  { month: "Jul", value: 20 },
];

export const expenseDistribution = [
  { id: "food", label: "مواد غذائية", percentage: 40 },
  { id: "drinks", label: "مشروبات", percentage: 25 },
  { id: "cleaning", label: "منظفات", percentage: 20 },
  { id: "other", label: "أخرى", percentage: 15 },
];

export const topStoreSuppliers = [
  {
    id: 1,
    name: "المورد الماسي للحلول اللوجستية",
    total: 45200,
  },
  {
    id: 2,
    name: "شركة الوفاق للمواد الغذائية",
    total: 38900,
  },
  {
    id: 3,
    name: "مصنع بلاستيك الخليج",
    total: 21150,
  },
  {
    id: 4,
    name: "مؤسسة النور للتجارة",
    total: 14800,
  },
  {
    id: 5,
    name: "شركة المدينة للمشروبات",
    total: 9800,
  },
];