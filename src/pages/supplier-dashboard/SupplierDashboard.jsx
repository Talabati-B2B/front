import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiAlertTriangle,
  FiBarChart2,
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiPlusSquare,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import { MdLocalShipping, MdWarehouse } from "react-icons/md";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import * as supplierOrderService from "../../services/supplier/orderService";
import * as productService from "../../services/supplier/productService";
import * as notificationService from "../../services/notificationService";

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  accepted: "تم القبول",
  preparing: "قيد التجهيز",
  shipped: "قيد التوصيل",
  delivered: "تم التسليم",
  canceled: "ملغي",
  negotiating: "قيد التفاوض",
  price_proposed: "عرض سعر",
  cancellation_requested: "طلب إلغاء",
};

const STATUS_COLORS = {
  pending: "bg-[#FFF0E5] text-[#B85B1B]",
  accepted: "bg-[#E7F5FF] text-[#1E65A7]",
  preparing: "bg-[#EAF8EF] text-[#16834B]",
  shipped: "bg-[#E9F0FB] text-[#2761C3]",
  delivered: "bg-[#DDF8E8] text-[#15803D]",
  canceled: "bg-[#FDE8E8] text-[#C62828]",
  negotiating: "bg-[#FFF8E1] text-[#F59E0B]",
  price_proposed: "bg-[#EDF4FF] text-[#3578E5]",
  cancellation_requested: "bg-[#FDE8E8] text-[#C62828]",
};

const NOTIF_STYLES = {
  low_stock: { bg: "bg-[#FFF0F0]", iconBg: "bg-[#FFDCDD]", iconColor: "text-[#E5484D]", Icon: FiAlertTriangle },
  new_order: { bg: "bg-[#EAF9F0]", iconBg: "bg-[#CFF5DC]", iconColor: "text-[#13A458]", Icon: FiShoppingCart },
  default: { bg: "bg-[#EDF4FF]", iconBg: "bg-[#D8E8FF]", iconColor: "text-[#3578E5]", Icon: MdLocalShipping },
};

export default function SupplierDashboard() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [ordersRes, productsRes, notifsRes] = await Promise.allSettled([
          supplierOrderService.fetchOrders({ per_page: 100 }),
          productService.fetchProducts({ per_page: 100 }),
          notificationService.fetchNotifications({ per_page: 10 }),
        ]);

        if (cancelled) return;

        if (ordersRes.status === "fulfilled") {
          const raw = ordersRes.value?.data || ordersRes.value || [];
          setOrders(Array.isArray(raw) ? raw : []);
        }

        if (productsRes.status === "fulfilled") {
          const raw = productsRes.value?.data?.data || productsRes.value?.data || [];
          setProducts(Array.isArray(raw) ? raw : []);
        }

        if (notifsRes.status === "fulfilled") {
          const raw = notifsRes.value?.data || notifsRes.value || [];
          setNotifications(Array.isArray(raw) ? raw : []);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (p) => (Number(p.stock ?? p.stock_quantity ?? 0)) <= 10
  ).length;
  const uniqueStores = useMemo(() => {
    const names = new Set();
    orders.forEach((o) => {
      const name = o.store?.name || o.store?.company_name || o.store_name;
      if (name) names.add(name);
    });
    return names.size;
  }, [orders]);

  const totalSales = useMemo(() => {
    return orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + Number(o.total_price || o.total || 0), 0);
  }, [orders]);

  const stats = [
    {
      icon: <MdLocalShipping size={21} />,
      color: "bg-[#EDF2FA] text-[#062454]",
      title: "إجمالي الطلبات",
      value: loading ? "..." : String(totalOrders),
      valueColor: "text-[#062454]",
      accent: "border-r-[#DCE6F7]",
    },
    {
      icon: <MdWarehouse size={21} />,
      color: "bg-[#EAF8EF] text-[#16834B]",
      title: "إجمالي المنتجات",
      value: loading ? "..." : String(totalProducts),
      valueColor: "text-[#062454]",
      accent: "border-r-[#CDEFD8]",
    },
    {
      icon: <FiAlertTriangle size={20} />,
      color: "bg-[#FDECEC] text-[#E5484D]",
      title: "منخفض المخزون",
      value: loading ? "..." : `${lowStockCount} صنفاً`,
      valueColor: "text-[#C62828]",
      accent: "border-r-[#F2CDCD]",
    },
    {
      icon: <FiUsers size={21} />,
      color: "bg-[#EAF8EF] text-[#16834B]",
      title: "العملاء",
      value: loading ? "..." : String(uniqueStores),
      valueColor: "text-[#062454]",
      accent: "border-r-transparent",
    },
  ];

  const itemsPerPage = 4;

  const formattedOrders = useMemo(() => {
    return orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((o) => ({
        id: `#ORD-${o.id}`,
        name: o.store?.name || o.store?.company_name || o.store_name || "متجر",
        date: o.created_at
          ? new Date(o.created_at).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
        status: STATUS_LABELS[o.status] || o.status,
        statusColor: STATUS_COLORS[o.status] || "bg-[#F3F4F6] text-[#6B7280]",
        total: `${Number(o.total_price || o.total || 0).toLocaleString()} ₪`,
      }));
  }, [orders]);

  const start = (page - 1) * itemsPerPage;
  const currentOrders = formattedOrders.slice(start, start + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(formattedOrders.length / itemsPerPage));

  const displayNotifications = useMemo(() => {
    return notifications.slice(0, 3).map((n) => {
      const data = n.data || {};
      let type = "default";
      const msg = (data.message || data.title || "").toLowerCase();
      if (msg.includes("مخزون") || msg.includes("stock")) type = "low_stock";
      else if (msg.includes("طلب") || msg.includes("order")) type = "new_order";

      return {
        id: n.id,
        type,
        title: data.title || data.title_ar || "إشعار",
        message: data.message || data.message_ar || data.body || "",
      };
    });
  }, [notifications]);

  const monthlyData = useMemo(() => {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const now = new Date();
    const counts = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      counts[key] = { label: months[d.getMonth()], count: 0 };
    }

    orders.forEach((o) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (counts[key]) counts[key].count++;
    });

    const entries = Object.values(counts);
    const maxCount = Math.max(...entries.map((e) => e.count), 1);
    return entries.map((e) => ({
      label: e.label,
      value: Math.round((e.count / maxCount) * 100),
      count: e.count,
    }));
  }, [orders]);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const growthLabel = totalOrders > 0 ? `${pendingOrders} طلب جديد` : "لا توجد طلبات";

  const handleViewAllNotifications = () => setShowAllNotifications(true);
  const handleNotificationDetails = (notification) => setSelectedNotification(notification);
  const handleViewAllOrders = () => navigate("/orders");
  const handleCloseNotificationModal = () => {
    setSelectedNotification(null);
    setShowAllNotifications(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]" dir="rtl">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-6 lg:px-7">
            {/* ADD PRODUCT */}
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/products/add")}
                className="flex h-[50px] min-w-[200px] items-center justify-center gap-3 rounded-[13px] bg-[#F47721] px-5 text-[14px] font-semibold text-[#111827] transition-colors hover:bg-[#E96F17]"
              >
                <FiPlusSquare size={18} aria-hidden="true" />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            {/* STATS */}
            <section className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <article
                  key={stat.title}
                  className={`min-h-[124px] rounded-[14px] border border-[#ECEFF3] border-r-2 ${stat.accent} bg-white px-5 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${stat.color}`}
                    >
                      {stat.icon}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[14px] font-medium text-[#44474F]">
                      {stat.title}
                    </p>

                    <p
                      className={`mt-1 text-[24px] font-bold leading-8 ${stat.valueColor}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            {/* ORDERS + ALERTS */}
            <section
              className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2.45fr)_minmax(270px,1fr)]"
              dir="ltr"
            >
              {/* ORDERS */}
              <article
                dir="rtl"
                className="min-w-0 overflow-hidden rounded-[14px] border border-[#ECEFF3] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
              >
                <div className="flex min-h-[58px] items-center justify-between gap-4 px-5">
                  <h2 className="text-[16px] font-bold text-[#16213A]">
                    آخر الطلبات المستلمة
                  </h2>

                  <button
                    type="button"
                    onClick={handleViewAllOrders}
                    className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-[#1455E5] transition-colors hover:text-[#0E3DAA]"
                  >
                    <span>عرض الكل</span>
                    <FiChevronLeft size={15} aria-hidden="true" />
                  </button>
                </div>

                {/* ORDERS TABLE */}
                <div className="overflow-hidden">
                  <table className="w-full text-sm" dir="rtl">
                    <thead>
                      <tr className="bg-[#062454] text-[12px] font-semibold text-white">
                        <th className="px-4 py-[18px] text-center">رقم الطلب</th>
                        <th className="px-4 py-[18px] text-center">اسم المتجر</th>
                        <th className="px-4 py-4.5 text-center">التاريخ</th>
                        <th className="px-4 py-4.5 text-center">الحالة</th>
                        <th className="px-4 py-4.5 text-center">الإجمالي</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#64748B]">
                            جاري تحميل الطلبات...
                          </td>
                        </tr>
                      ) : currentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#64748B]">
                            لا توجد طلبات حتى الآن.
                          </td>
                        </tr>
                      ) : (
                        currentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-[#E7E9ED] last:border-b-0"
                          >
                            <td
                              className="px-4 py-[14px] text-center text-[13px] font-bold text-[#062454]"
                              dir="ltr"
                            >
                              {order.id}
                            </td>

                            <td className="px-4 py-[14px] text-center text-[13px] font-medium text-[#24262B]">
                              {order.name}
                            </td>

                            <td className="px-4 py-[14px] text-center text-[12px] text-[#5F6470]">
                              {order.date}
                            </td>

                            <td className="px-4 py-[14px] text-center">
                              <span
                                className={`inline-flex min-h-8 items-center justify-center rounded-full px-3 text-[12px] font-medium ${order.statusColor}`}
                              >
                                {order.status}
                              </span>
                            </td>

                            <td className="px-4 py-[14px] text-center text-[13px] font-semibold text-[#16181D]">
                              {order.total}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* SIMPLE PAGINATION */}
                {formattedOrders.length > 0 && (
                  <div
                    className="flex min-h-[64px] items-center justify-between border-t border-[#E7E9ED] px-5 py-3"
                    dir="ltr"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        aria-label="الصفحة السابقة"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8DDE6] bg-white text-[#697181] transition-colors hover:bg-[#F7F8FA] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiChevronLeft size={16} />
                      </button>

                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            type="button"
                            onClick={() => setPage(pageNumber)}
                            className={`flex h-10 min-w-10 items-center justify-center rounded-lg border text-[13px] font-semibold transition-colors ${
                              page === pageNumber
                                ? "border-[#2F248B] bg-[#2F248B] text-white"
                                : "border-[#D8DDE6] bg-white text-[#697181] hover:bg-[#F7F8FA]"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        aria-label="الصفحة التالية"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8DDE6] bg-white text-[#697181] transition-colors hover:bg-[#F7F8FA] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiChevronRight size={16} />
                      </button>
                    </div>

                    <span className="text-[12px] text-[#596579]" dir="rtl">
                      عرض {start + 1}-
                      {Math.min(start + itemsPerPage, formattedOrders.length)} من{" "}
                      {formattedOrders.length} طلب
                    </span>
                  </div>
                )}
              </article>

              {/* NOTIFICATIONS */}
              <article
                dir="rtl"
                className="flex min-h-[430px] min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#ECEFF3] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
              >
                <div className="flex min-h-[60px] items-center justify-between px-5">
                  <div className="flex items-center gap-2.5">
                    <FiBell size={18} className="text-[#7D8798]" />
                    <h2 className="text-[16px] font-bold text-[#16213A]">
                      تنبيهات النظام
                    </h2>
                  </div>

                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#EA1111] px-1.5 text-[11px] font-bold text-white">
                    {displayNotifications.length}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-1">
                  {loading ? (
                    <div className="flex flex-1 items-center justify-center text-sm text-[#64748B]">
                      جاري تحميل التنبيهات...
                    </div>
                  ) : displayNotifications.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-sm text-[#64748B]">
                      لا توجد تنبيهات حالياً
                    </div>
                  ) : (
                    displayNotifications.map((notif) => {
                      const style = NOTIF_STYLES[notif.type] || NOTIF_STYLES.default;
                      const { Icon } = style;
                      return (
                        <div
                          key={notif.id}
                          className={`flex min-h-[84px] items-start gap-3 rounded-[10px] ${style.bg} px-3.5 py-3`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
                          >
                            <Icon size={17} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-bold leading-5 text-[#2D3036]">
                              {notif.title}
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium leading-4 text-[#7B8493]">
                              {notif.message}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleNotificationDetails(notif)}
                              className="mt-1.5 text-[11px] font-bold text-[#2463E8]"
                            >
                              عرض التفاصيل
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleViewAllNotifications}
                  className="min-h-[50px] w-full bg-[#062454] text-[13px] font-semibold text-white transition-colors hover:bg-[#0A316D]"
                >
                  عرض جميع التنبيهات
                </button>
              </article>
            </section>

            {/* CHART + SALES */}
            <section
              className="mt-6 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2.45fr)_minmax(270px,1fr)]"
              dir="ltr"
            >
              {/* CHART */}
              <article
                dir="rtl"
                className="min-w-0 rounded-[14px] border border-[#ECEFF3] bg-white px-5 pb-5 pt-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
              >
                <div className="mb-6 flex items-center gap-2">
                  <h2 className="text-[16px] font-bold text-[#16213A]">
                    إحصائيات الطلبات
                  </h2>

                  <span className="text-[12px] text-[#9AA4B4]">
                    (آخر 6 أشهر)
                  </span>
                </div>

                <div className="flex min-w-0" dir="rtl">
                  <div className="flex h-[255px] shrink-0 flex-col justify-between pr-2 text-[10px] text-[#98A3B3]">
                    {(() => {
                      const maxVal = Math.max(...monthlyData.map((m) => m.count), 1);
                      return [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0].map((v) => (
                        <span key={v}>{v}</span>
                      ));
                    })()}
                  </div>

                  <div className="relative h-[255px] min-w-0 flex-1">
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map((line) => (
                        <div key={line} className="w-full border-t border-[#E8EDF4]" />
                      ))}
                    </div>

                    <div
                      className="relative flex h-full items-end justify-between gap-3 px-3"
                      dir="ltr"
                    >
                      {monthlyData.map((item) => {
                        const isMax = item.value === Math.max(...monthlyData.map((m) => m.value));
                        return (
                          <div
                            key={item.label}
                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                          >
                            <div
                              className={`w-full max-w-[58px] rounded-t-[8px] ${
                                isMax
                                  ? "bg-[#2364E8]"
                                  : item.value <= 45
                                    ? "bg-[#5D93ED]"
                                    : "bg-[#3D7DEB]"
                              }`}
                              style={{ height: `${Math.max(item.value, 2)}%` }}
                            />
                            <p
                              className="mt-3 text-[11px] font-medium text-[#455269]"
                              dir="rtl"
                            >
                              {item.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>

              {/* SALES / GROWTH */}
              <div className="flex min-w-0 flex-col gap-4" dir="rtl">
                {/* TOTAL SALES */}
                <article className="flex min-h-[126px] items-center justify-between gap-4 rounded-[14px] border border-[#ECEFF3] bg-white px-5 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#7E8796]">
                      إجمالي المبيعات
                    </p>

                    <h3 className="mt-1 text-[20px] font-bold text-[#16213A]">
                      {loading ? "..." : totalSales.toLocaleString()}{" "}
                      <span className="text-[12px] font-medium text-[#5F6672]">
                        شيكل
                      </span>
                    </h3>

                    <p className="mt-2 text-[11px] font-semibold text-[#16A34A]">
                      من الطلبات المكتملة
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF9E7] text-[#16A34A]">
                    <FiDollarSign size={23} aria-hidden="true" />
                  </div>
                </article>

                {/* ORDER GROWTH */}
                <article className="min-h-[174px] rounded-[14px] border border-[#ECEFF3] bg-white px-5 py-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-bold text-[#283247]">
                        طلبات جديدة بانتظار المعالجة
                      </p>

                      <p className="mt-4 text-[27px] font-bold text-[#16213A]">
                        {loading ? "..." : growthLabel}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DCEAFF] text-[#2463E8]">
                      <FiBarChart2 size={18} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
                    <div
                      className="h-full rounded-full bg-[#2463E8]"
                      style={{
                        width: totalOrders > 0
                          ? `${Math.min(Math.round((pendingOrders / totalOrders) * 100), 100)}%`
                          : "0%",
                      }}
                    />
                  </div>

                  <p className="mt-2 text-center text-[10px] text-[#A1A9B5]">
                    {totalOrders > 0
                      ? `${pendingOrders} من ${totalOrders} طلب بانتظار المعالجة`
                      : "لا توجد طلبات بعد"}
                  </p>
                </article>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* NOTIFICATION MODAL */}
      {(selectedNotification || showAllNotifications) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          dir="rtl"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={handleCloseNotificationModal}
              aria-label="إغلاق"
              className="absolute left-4 top-4 text-xl leading-none text-[#64748B] hover:text-[#062454]"
            >
              ×
            </button>

            {selectedNotification ? (
              <>
                <h3 className="mb-3 pl-6 text-[16px] font-bold leading-6">
                  {selectedNotification.title}
                </h3>

                <p className="text-[14px] leading-6 text-[#64748B]">
                  {selectedNotification.message}
                </p>
              </>
            ) : (
              <>
                <h3 className="mb-4 pl-6 text-[16px] font-bold leading-6">
                  جميع التنبيهات
                </h3>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-[#64748B]">لا توجد تنبيهات</p>
                  ) : (
                    notifications.map((n) => {
                      const data = n.data || {};
                      return (
                        <div
                          key={n.id}
                          className="border-b border-[#E5E7EB] pb-3 last:border-b-0 last:pb-0"
                        >
                          <p className="text-[14px] font-semibold leading-5">
                            {data.title || data.title_ar || "إشعار"}
                          </p>

                          <span className="text-[12px] leading-4 text-[#64748B]">
                            {data.message || data.message_ar || data.body || ""}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleCloseNotificationModal}
              className="mt-6 w-full rounded-lg bg-[#062454] py-3 text-[14px] leading-5 text-white"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
