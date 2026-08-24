import { useState } from "react";
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

export default function SupplierDashboard() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const itemsPerPage = 4;

  const handleViewAllNotifications = () => {
    setShowAllNotifications(true);
  };

  const handleNotificationDetails = (notification) => {
    setSelectedNotification(notification);
  };

  const handleViewAllOrders = () => {
    navigate("/orders");
  };

  const handleCloseNotificationModal = () => {
    setSelectedNotification(null);
    setShowAllNotifications(false);
  };

  const notifications = [
    {
      id: 1,
      type: "low-stock",
      title: "منتجات منخفضة المخزون",
      message: "لديك 12 منتجاً منخفض المخزون",
    },
    {
      id: 2,
      type: "new-orders",
      title: "طلبات جديدة",
      message: "لديك 8 طلبات جديدة لم تتم معالجتها",
    },
    {
      id: 3,
      type: "price-update",
      title: "تحديث الأسعار",
      message: "تم تحديث أسعار بعض المنتجات",
    },
  ];

  const stats = [
    {
      icon: <MdLocalShipping size={21} />,
      color: "bg-[#EDF2FA] text-[#062454]",
      change: "+12%",
      changeColor: "text-[#16A34A]",
      title: "إجمالي الطلبات",
      value: "148",
      valueColor: "text-[#062454]",
      accent: "border-r-[#DCE6F7]",
    },
    {
      icon: <MdWarehouse size={21} />,
      color: "bg-[#EAF8EF] text-[#16834B]",
      change: "+8.4%",
      changeColor: "text-[#16A34A]",
      title: "إجمالي المنتجات",
      value: "2,450",
      valueColor: "text-[#062454]",
      accent: "border-r-[#CDEFD8]",
    },
    {
      icon: <FiAlertTriangle size={20} />,
      color: "bg-[#FDECEC] text-[#E5484D]",
      change: "-5%",
      changeColor: "text-[#E5484D]",
      title: "منخفض المخزون",
      value: "12 صنفاً",
      valueColor: "text-[#C62828]",
      accent: "border-r-[#F2CDCD]",
    },
    {
      icon: <FiUsers size={21} />,
      color: "bg-[#EAF8EF] text-[#16834B]",
      change: "+8.2%",
      changeColor: "text-[#15803D]",
      title: "العملاء",
      value: "856",
      valueColor: "text-[#062454]",
      accent: "border-r-transparent",
    },
  ];

  const orders = [
    {
      id: "#ORD-9921",
      name: "أسواق المزرعة",
      date: "24 أكتوبر 2026",
      status: "قيد الانتظار",
      total: "1,240 ر.س",
      statusColor: "bg-[#FFF0E5] text-[#B85B1B]",
    },
    {
      id: "#ORD-9915",
      name: "بيتني مول",
      date: "22 أكتوبر 2026",
      status: "قيد التوصيل",
      total: "3,120 ر.س",
      statusColor: "bg-[#E9F0FB] text-[#2761C3]",
    },
    {
      id: "#ORD-9920",
      name: "بقالة النجوم",
      date: "23 أكتوبر 2026",
      status: "تم القبول",
      total: "850 ر.س",
      statusColor: "bg-[#E7F5FF] text-[#1E65A7]",
    },
    {
      id: "#ORD-9914",
      name: "لاكاسا مول",
      date: "21 أكتوبر 2026",
      status: "قيد الانتظار",
      total: "450 ر.س",
      statusColor: "bg-[#FFF0E5] text-[#B85B1B]",
    },
    {
      id: "#ORD-9913",
      name: "سوبر ماركت الأمل",
      date: "20 أكتوبر 2026",
      status: "تم القبول",
      total: "1,850 ر.س",
      statusColor: "bg-[#E7F5FF] text-[#1E65A7]",
    },
    {
      id: "#ORD-9912",
      name: "متجر الوفاء",
      date: "19 أكتوبر 2026",
      status: "قيد التوصيل",
      total: "2,140 ر.س",
      statusColor: "bg-[#E9F0FB] text-[#2761C3]",
    },
    {
      id: "#ORD-9911",
      name: "ماركت المدينة",
      date: "18 أكتوبر 2026",
      status: "قيد الانتظار",
      total: "980 ر.س",
      statusColor: "bg-[#FFF0E5] text-[#B85B1B]",
    },
    {
      id: "#ORD-9910",
      name: "أسواق النخيل",
      date: "17 أكتوبر 2026",
      status: "تم القبول",
      total: "1,460 ر.س",
      statusColor: "bg-[#E7F5FF] text-[#1E65A7]",
    },
  ];



  const start = (page - 1) * itemsPerPage;

  const currentOrders = orders.slice(start, start + itemsPerPage);

  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));

  const months = ["يونيو", "مايو", "أبريل", "مارس", "فبراير", "يناير"];

  const values = [70, 85, 60, 55, 40, 50];

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

                    <p
                      className={`pt-1 text-[11px] font-semibold leading-5 ${stat.changeColor}`}
                    >
                      {stat.change} عن الشهر السابق
                    </p>
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
                        <th className="px-4 py-[18px] text-center">
                          رقم الطلب
                        </th>

                        <th className="px-4 py-[18px] text-center">
                          اسم المتجر
                        </th>

                        <th className="px-4 py-4.5 text-center">التاريخ</th>

                        <th className="px-4 py-4.5 text-center">الحالة</th>

                        <th className="px-4 py-4.5 text-center">الإجمالي</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentOrders.map((order) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SIMPLE PAGINATION */}
                <div
                  className="flex min-h-[64px] items-center justify-between border-t border-[#E7E9ED] px-5 py-3"
                  dir="ltr"
                >
                  <div className="flex items-center gap-2">
                    {/* PREVIOUS */}
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      aria-label="الصفحة السابقة"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8DDE6] bg-white text-[#697181] transition-colors hover:bg-[#F7F8FA] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {/* PAGE NUMBERS */}
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

                    {/* NEXT */}
                    <button
                      type="button"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      aria-label="الصفحة التالية"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8DDE6] bg-white text-[#697181] transition-colors hover:bg-[#F7F8FA] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>

                  <span className="text-[12px] text-[#596579]" dir="rtl">
                    عرض {start + 1}-
                    {Math.min(start + itemsPerPage, orders.length)} من{" "}
                    {orders.length} طلب
                  </span>
                </div>
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
                    {notifications.length}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-1">
                  {/* LOW STOCK */}
                  <div className="flex min-h-[84px] items-start gap-3 rounded-[10px] bg-[#FFF0F0] px-3.5 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFDCDD] text-[#E5484D]">
                      <FiAlertTriangle size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-5 text-[#2D3036]">
                        منتجات منخفضة المخزون
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium leading-4 text-[#7B8493]">
                        لديك 12 منتجاً منخفض المخزون
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationDetails(notifications[0])
                        }
                        className="mt-1.5 text-[11px] font-bold text-[#2463E8]"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>

                  {/* NEW ORDERS */}
                  <div className="flex min-h-[84px] items-start gap-3 rounded-[10px] bg-[#EAF9F0] px-3.5 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#CFF5DC] text-[#13A458]">
                      <FiShoppingCart size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-5 text-[#2D3036]">
                        طلبات جديدة
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium leading-4 text-[#7B8493]">
                        لديك 8 طلبات جديدة لم تتم معالجتها
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationDetails(notifications[1])
                        }
                        className="mt-1.5 text-[11px] font-bold text-[#2463E8]"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>

                  {/* PRICE UPDATE */}
                  <div className="flex min-h-[84px] items-start gap-3 rounded-[10px] bg-[#EDF4FF] px-3.5 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D8E8FF] text-[#3578E5]">
                      <MdLocalShipping size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-5 text-[#2D3036]">
                        تحديث الأسعار
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium leading-4 text-[#7B8493]">
                        تم تحديث أسعار بعض المنتجات
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationDetails(notifications[2])
                        }
                        className="mt-1.5 text-[11px] font-bold text-[#2463E8]"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
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
                    <span>300</span>
                    <span>225</span>
                    <span>150</span>
                    <span>75</span>
                    <span>0</span>
                  </div>

                  <div className="relative h-[255px] min-w-0 flex-1">
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map((line) => (
                        <div
                          key={line}
                          className="w-full border-t border-[#E8EDF4]"
                        />
                      ))}
                    </div>

                    <div
                      className="relative flex h-full items-end justify-between gap-3 px-3"
                      dir="ltr"
                    >
                      {values.map((value, index) => {
                        const isMax = value === Math.max(...values);

                        return (
                          <div
                            key={months[index]}
                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                          >
                            <div
                              className={`w-full max-w-[58px] rounded-t-[8px] ${
                                isMax
                                  ? "bg-[#2364E8]"
                                  : value <= 45
                                    ? "bg-[#5D93ED]"
                                    : "bg-[#3D7DEB]"
                              }`}
                              style={{
                                height: `${value}%`,
                              }}
                            />

                            <p
                              className="mt-3 text-[11px] font-medium text-[#455269]"
                              dir="rtl"
                            >
                              {months[index]}
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
                      18,450{" "}
                      <span className="text-[12px] font-medium text-[#5F6672]">
                        شيكل
                      </span>
                    </h3>

                    <p className="mt-2 text-[11px] font-semibold text-[#16A34A]">
                      +12% عن الشهر السابق
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
                        معدل نمو الطلبات
                      </p>

                      <p className="mt-4 text-[27px] font-bold text-[#16213A]">
                        +12%
                      </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DCEAFF] text-[#2463E8]">
                      <FiBarChart2 size={18} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
                    <div className="h-full w-3/4 rounded-full bg-[#2463E8]" />
                  </div>

                  <p className="mt-2 text-center text-[10px] text-[#A1A9B5]">
                    نمو في عدد الطلبات
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
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="border-b border-[#E5E7EB] pb-3 last:border-b-0 last:pb-0"
                    >
                      <p className="text-[14px] font-semibold leading-5">
                        {notification.title}
                      </p>

                      <span className="text-[12px] leading-4 text-[#64748B]">
                        {notification.message}
                      </span>
                    </div>
                  ))}
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
