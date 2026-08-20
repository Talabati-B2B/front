import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Pagination from "../../components/common/Pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiUsers,
  FiShoppingCart,
  FiAlertTriangle,
  FiBell,
} from "react-icons/fi";
import { MdWarehouse, MdLocalShipping } from "react-icons/md";

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const itemsPerPage = 4;

  const handleViewAllNotifications = () => {
    // NOTE: no "/notifications" route currently exists in App.jsx.
    // Only updating local state until that route is added.
    setShowAllNotifications(true);
  };

  const handleNotificationDetails = (notification) => {
    // NOTE: no "/notifications/:id" route currently exists in App.jsx.
    // Only updating local state until that route is added.
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
      icon: <FiShoppingCart size={22} />,
      color: "bg-blue-100 text-blue-600",
      change: "+12%",
      changeColor: "text-green-500",
      title: "إجمالي الطلبات",
      value: "148",
      valueColor: "text-[#0D2B5B]",
    },
    {
      icon: <MdWarehouse size={22} />,
      color: "bg-emerald-100 text-emerald-600",
      change: "+8.4%",
      changeColor: "text-green-500",
      title: "إجمالي المنتجات",
      value: "2,450",
      valueColor: "text-[#0D2B5B]",
    },
    {
      icon: <FiAlertTriangle size={22} />,
      color: "bg-red-100 text-red-600",
      change: "-5%",
      changeColor: "text-red-500",
      title: "منخفض المخزون",
      value: "12 صنفاً",
      valueColor: "text-red-500",
    },
    {
      icon: <FiUsers size={22} />,
      color: "bg-green-100 text-green-600",
      change: "+8.2%",
      changeColor: "text-green-500",
      title: "العملاء",
      value: "856",
      valueColor: "text-[#0D2B5B]",
    },
  ];

  const orders = [
    {
      id: "#ORD-9921",
      name: "أسواق المزرعة",
      date: "24 أكتوبر 2026",
      status: "قيد الانتظار",
      total: "1,240 ر.س",
      statusColor: "bg-orange-100 text-orange-600",
    },
    {
      id: "#ORD-9915",
      name: "بيتني مول",
      date: "22 أكتوبر 2026",
      status: "قيد التوصيل",
      total: "3,120 ر.س",
      statusColor: "bg-blue-100 text-blue-600",
    },
    {
      id: "#ORD-9920",
      name: "بقالة النجوم",
      date: "23 أكتوبر 2026",
      status: "تم القبول",
      total: "850 ر.س",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      id: "#ORD-9914",
      name: "لاكاسا مول",
      date: "21 أكتوبر 2026",
      status: "قيد الانتظار",
      total: "450 ر.س",
      statusColor: "bg-orange-100 text-orange-600",
    },
  ];
  const start = (page - 1) * itemsPerPage;
  const currentOrders = orders.slice(start, start + itemsPerPage);

  const months = ["يونيو", "مايو", "أبريل", "مارس", "فبراير", "يناير"];
  const values = [70, 85, 60, 55, 40, 50];

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-stretch">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col"
              >
                {/* الأعلى */}
                <div className="flex justify-between gap-8">
                  {/* الأيقونة */}
                  <div
                    className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${s.color}`}
                  >
                    {s.icon}
                  </div>

                  {/* النسبة */}
                  <span
                    className={`${s.changeColor} font-semibold text-[14px] text-left`}
                  >
                    {s.change} عن الشهر السابق
                  </span>
                </div>

                {/* الأسفل */}
                <div className="mt-5 flex-1 flex flex-col justify-between">
                  <p className="text-[#44474F] text-[16px]">{s.title}</p>

                  <h2
                    className={` text-[20px] text-xl font-bold mt-2 ${s.valueColor}`}
                  >
                    {s.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* NOTIFICATIONS */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <FiBell size={20} />
                <h2 className="font-bold">تنبيهات النظام</h2>
              </div>

              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded-lg flex items-center gap-4">
                  <FiAlertTriangle className="text-red-500" />
                  <div>
                    <p className="font-semibold text-[14px] leading-5">
                      منتجات منخفضة المخزون
                    </p>
                    <span className="text-[#64748B] text-[12px] leading-4 font-semibold">
                      لديك 12 منتجاً منخفض المخزون
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNotificationDetails(notifications[0])}
                      className="text-[#2563EB] block font-bold text-[12px] leading-4 mt-4"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg flex items-center gap-4">
                  <FiShoppingCart className="text-green-500" />
                  <div>
                    <p className="font-semibold text-[14px] leading-5">
                      طلبات جديدة
                    </p>
                    <span className="text-[#64748B] text-[12px] leading-4 font-semibold">
                      لديك 8 طلبات جديدة لم تتم معالجتها
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNotificationDetails(notifications[1])}
                      className="text-[#2563EB] block font-bold text-[12px] leading-4 mt-4"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg flex gap-4 mb-10 items-center">
                  <MdLocalShipping className="text-blue-500" />
                  <div>
                    <p className="font-semibold text-[14px] leading-5">
                      تحديث الأسعار
                    </p>
                    <span className="text-[#64748B] text-[12px] leading-4 font-semibold">
                      تم تحديث أسعار بعض المنتجات
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNotificationDetails(notifications[2])}
                      className="text-[#2563EB] block font-bold text-[12px] leading-4 mt-4"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>

                <div className="-mx-4 ">
                  <button
                    type="button"
                    onClick={handleViewAllNotifications}
                    className="w-full bg-[#062454] text-white py-4 rounded-bl-lg rounded-br-lg text-[14px] leading-5"
                  >
                    عرض جميع التنبيهات
                  </button>
                </div>
              </div>
            </div>
            {/* ORDERS */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4 p-4">
                <h2 className="font-semibold text-[18px] leading-7">
                  آخر الطلبات المستلمة
                </h2>
                <button
                  type="button"
                  onClick={handleViewAllOrders}
                  className="text-[#1455E5] font-normal text-[16px] leading-6"
                >
                  عرض الكل←
                </button>
              </div>

              <table className="w-full text-sm" dir="rtl">
                <thead>
                  <tr className="text-[12px] py-4 leading-6 text-white bg-[#062454]">
                    <th className="py-5 text-center">رقم الطلب</th>
                    <th className="py-5 text-center">اسم المتجر</th>
                    <th className="py-5 text-center">التاريخ</th>
                    <th className="py-5 text-center">الحالة</th>
                    <th className="py-5 text-center">الإجمالي</th>
                  </tr>
                </thead>

                <tbody>
                  {currentOrders.map((o, i) => (
                    <tr key={i} className="border border-[#00000026]">
                      <td className="p-2 text-center text-[#062454] font-medium text-[16px] leading-6 py-5">
                        {o.id}
                      </td>
                      <td className="py-5 text-center text-[14px] leading-6">
                        {o.name}
                      </td>
                      <td className="py-5 text-center">{o.date}</td>
                      <td className="py-5 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${o.statusColor}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-5 text-center">{o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="py-4 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalItems={orders.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </div>
          </div>

          {/* CHART + SIDE STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            {/* SIDE STATS */}
            <div className="flex flex-col gap-4">
              {/* TOTAL SALES */}
              <div className="bg-white rounded-xl shadow-sm p-4 flex-1 flex items-center justify-between">
                <div>
                  <p className="text-[#64748B] text-[13px] mb-2">
                    إجمالي المبيعات
                  </p>
                  <h3 className="text-[20px] font-bold text-[#0D2B5B]">
                    18,450{" "}
                    <span className="text-[13px] font-normal text-[#64748B]">
                      شيكل
                    </span>
                  </h3>
                  <span className="text-green-500 text-[12px] font-semibold">
                    +12% عن الشهر السابق
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <FiShoppingCart size={18} />
                </div>
              </div>

              {/* GROWTH RATE */}
              <div className="bg-white rounded-xl shadow-sm p-4 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FiUsers size={18} />
                  </div>
                  <p className="text-[#64748B] text-[13px]">معدل نمو الطلبات</p>
                </div>
                <h3 className="text-[22px] font-bold text-[#0D2B5B] mb-3">
                  +12%
                </h3>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-[#94A3B8] text-[11px] mt-2">
                  نمو في عدد الطلبات
                </p>
              </div>
            </div>
            {/* CHART */}
            <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-[16px]">إحصائيات الطلبات</h2>
                <span className="text-[#94A3B8] text-[13px]">(آخر 6 أشهر)</span>
              </div>

              <div className="flex" dir="ltr">
                {/* Y-axis scale labels */}
                <div className="flex flex-col justify-between h-48 pr-2 text-[11px] text-[#94A3B8] shrink-0">
                  <span>300</span>
                  <span>225</span>
                  <span>150</span>
                  <span>75</span>
                  <span>0</span>
                </div>

                {/* Bars + gridlines */}
                <div className="relative flex-1 h-48">
                  {/* horizontal gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div
                        key={line}
                        className="border-t border-[#EEF1F6] w-full"
                      />
                    ))}
                  </div>

                  {/* bars */}
                  <div className="relative flex items-end justify-between gap-3 h-full px-2">
                    {values.map((v, i) => {
                      const isMax = v === Math.max(...values);
                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center justify-end flex-1 h-full"
                        >
                          <div
                            className={`w-8 sm:w-10 rounded-t-lg ${
                              isMax
                                ? "bg-linear-to-t from-blue-700 to-blue-500"
                                : v <= 45
                                  ? "bg-linear-to-t from-blue-400 to-blue-300"
                                  : "bg-linear-to-t from-blue-600 to-blue-400"
                            }`}
                            style={{ height: `${v}%` }}
                          ></div>
                          <p
                            className="text-[12px] mt-3 text-[#334155]"
                            dir="rtl"
                          >
                            {months[i]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION MODAL */}
      {(selectedNotification || showAllNotifications) && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          dir="rtl"
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              type="button"
              onClick={handleCloseNotificationModal}
              aria-label="إغلاق"
              className="absolute top-4 left-4 text-[#64748B] hover:text-[#062454] text-xl leading-none"
            >
              ×
            </button>

            {selectedNotification ? (
              <>
                <h3 className="font-bold text-[16px] leading-6 mb-3 pl-6">
                  {selectedNotification.title}
                </h3>
                <p className="text-[#64748B] text-[14px] leading-6">
                  {selectedNotification.message}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-[16px] leading-6 mb-4 pl-6">
                  جميع التنبيهات
                </h3>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="border-b border-[#E5E7EB] pb-3 last:border-b-0 last:pb-0"
                    >
                      <p className="font-semibold text-[14px] leading-5">
                        {n.title}
                      </p>
                      <span className="text-[#64748B] text-[12px] leading-4">
                        {n.message}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleCloseNotificationModal}
              className="w-full mt-6 bg-[#062454] text-white py-3 rounded-lg text-[14px] leading-5"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
