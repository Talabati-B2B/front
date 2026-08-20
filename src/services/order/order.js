// Mock data for the incoming orders page. Replace with real API calls when available.
export const orderStats = [
  {
    id: 'total',
    label: 'إجمالي الطلبات الواردة',
    value: '1,284',
    icon: 'total',
    badge: { text: '+12%', tone: 'success' },
  },
  {
    id: 'pending',
    label: 'بانتظار القبول',
    value: '42',
    icon: 'pending',
    badge: { text: 'تنبيه', tone: 'warning' },
  },
  {
    id: 'processing',
    label: 'قيد التجهيز',
    value: '156',
    icon: 'processing',
    badge: null,
  },
  {
    id: 'completed',
    label: 'مكتملة اليوم',
    value: '89',
    icon: 'completed',
    badge: null,
  },
]

export const orders = [
  {
    id: 1,
    orderNumber: 'TB-OR-001',
    storeName: 'بيتي مول',
    date: '2026/07/24',
    total: 240,
  },
  {
    id: 2,
    orderNumber: 'TB-OR-002',
    storeName: 'لاكاسا مول',
    date: '2026/07/20',
    total: 30,
  },
  {
    id: 3,
    orderNumber: 'TB-OR-003',
    storeName: 'سوبر ماركت عجور',
    date: '2026/07/16',
    total: 40,
  },
  {
    id: 4,
    orderNumber: 'TB-OR-004',
    storeName: 'مطعم بلدنا',
    date: '2026/07/14',
    total: 50,
  },
  {
    id: 5,
    orderNumber: 'TB-OR-005',
    storeName: 'بازوكا كافي',
    date: '2026/07/10',
    total: 50,
  },
]

export const topStores = [
  {
    id: 1,
    name: 'سوبر ماركت الأصدقاء',
    activeOrders: 24,
    revenue: '15,400',
    progress: 80,
  },
  {
    id: 2,
    name: 'كيرفور',
    activeOrders: 18,
    revenue: '12,100',
    progress: 62,
  },
]

export const recentActivities = [
  {
    id: 1,
    title: 'تم قبول الطلب #ORD-94208',
    time: 'منذ 5 دقائق',
    type: 'accepted',
  },
  {
    id: 2,
    title: 'طلب جديد بانتظار القبول',
    time: 'منذ 12 دقيقة',
    type: 'pending',
  },
  {
    id: 3,
    title: 'تم رفض الطلب #ORD-94182',
    time: 'منذ 45 دقيقة',
    type: 'rejected',
  },
]
