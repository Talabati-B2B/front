import { useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEye,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiX,
  FiXCircle,
} from "react-icons/fi";

const PAGE_SIZE = 6;

const orderStats = [
  {
    label: "إجمالي الطلبات",
    value: "1,248",
    icon: FiShoppingBag,
    iconClass: "bg-[#EEF3FA] text-[#40577B]",
  },
  {
    label: "طلبات نشطة",
    value: "456",
    icon: FiTruck,
    iconClass: "bg-[#EAF8EF] text-[#16A34A]",
  },
  {
    label: "قيد المراجعة",
    value: "24",
    icon: FiClock,
    iconClass: "bg-[#FFF2E8] text-[#F2762E]",
  },
  {
    label: "ملغاة",
    value: "8",
    icon: FiXCircle,
    iconClass: "bg-[#FDECEC] text-[#E45252]",
  },
];

const statusStyles = {
  "قيد المراجعة": "bg-[#FFF3E8] text-[#D96919]",
  "بانتظار التأكيد": "bg-[#EEF3FA] text-[#40577B]",
  "قيد التجهيز": "bg-[#FFF8E6] text-[#B7791F]",
  "قيد التوصيل": "bg-[#EAF7F8] text-[#0B7890]",
  مكتمل: "bg-[#EAF8EF] text-[#15803D]",
  ملغي: "bg-[#FDECEC] text-[#C93C3C]",
};

const orders = [
  {
    id: "#ORD-1264",
    store: "متجر النور",
    supplier: "مخازن الخير",
    date: "19 أغسطس 2026",
    total: "1,840 ₪",
    status: "قيد المراجعة",
  },
  {
    id: "#ORD-1263",
    store: "سوبر ماركت الأمل",
    supplier: "شركة البركة",
    date: "19 أغسطس 2026",
    total: "920 ₪",
    status: "بانتظار التأكيد",
  },
  {
    id: "#ORD-1262",
    store: "أسواق الهدى",
    supplier: "مخازن الأمانة",
    date: "18 أغسطس 2026",
    total: "2,350 ₪",
    status: "مكتمل",
  },
  {
    id: "#ORD-1261",
    store: "متجر الوفاء",
    supplier: "شركة الإمداد",
    date: "18 أغسطس 2026",
    total: "1,270 ₪",
    status: "قيد التوصيل",
  },
  {
    id: "#ORD-1260",
    store: "مركز المدينة",
    supplier: "مؤسسة اليسر",
    date: "18 أغسطس 2026",
    total: "3,110 ₪",
    status: "قيد التجهيز",
  },
  {
    id: "#ORD-1259",
    store: "سوبر ماركت السلام",
    supplier: "مخازن الندى",
    date: "17 أغسطس 2026",
    total: "785 ₪",
    status: "ملغي",
  },
  {
    id: "#ORD-1258",
    store: "متجر الرحمة",
    supplier: "شركة الوفاق",
    date: "17 أغسطس 2026",
    total: "1,560 ₪",
    status: "قيد المراجعة",
  },
  {
    id: "#ORD-1257",
    store: "أسواق فلسطين",
    supplier: "مخازن الشفاء",
    date: "17 أغسطس 2026",
    total: "2,060 ₪",
    status: "مكتمل",
  },
  {
    id: "#ORD-1256",
    store: "أسواق الهدى",
    supplier: "مخازن الأمانة",
    date: "16 أغسطس 2026",
    total: "2,350 ₪",
    status: "مكتمل",
  },
  {
    id: "#ORD-1255",
    store: "متجر الوفاء",
    supplier: "شركة الإمداد",
    date: "16 أغسطس 2026",
    total: "1,270 ₪",
    status: "قيد التوصيل",
  },
];

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[status] ?? "bg-[#F1F3F5] text-[#5F6368]"}`}
    >
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [supplierFilter, setSupplierFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const supplierOptions = useMemo(
    () => [...new Set(orders.map((order) => order.supplier))],
    [],
  );

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.store.toLowerCase().includes(normalizedSearch) ||
        order.supplier.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "الكل" || order.status === statusFilter;
      const matchesSupplier =
        supplierFilter === "الكل" || order.supplier === supplierFilter;

      return matchesSearch && matchesStatus && matchesSupplier;
    });
  }, [searchTerm, statusFilter, supplierFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleOrders = filteredOrders.slice(pageStart, pageStart + PAGE_SIZE);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSupplierChange = (event) => {
    setSupplierFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <header>
          <h1 className="text-[24px] font-bold text-[#00163B] sm:text-[28px]">
            إدارة الطلبات
          </h1>
          <p className="mt-1 text-[12px] text-[#747780] sm:text-[13px]">
            متابعة وإدارة جميع طلبات المتاجر والموردين في النظام
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {orderStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-xl border border-[#0000000D] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 text-right">
                    <p className="text-[13px] font-medium text-[#747780]">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-[24px] font-bold leading-none text-[#00163B]">
                      {stat.value}
                    </p>
                  </div>

                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-xl border border-[#0000000D] bg-white shadow-sm">
          <div className="border-b border-[#EEF0F3] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#00163B]">
                  جميع الطلبات
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  عرض ومتابعة حالة الطلبات المسجلة في النظام
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <label className="relative min-w-0 flex-1 lg:w-[300px] lg:flex-none">
                  <span className="sr-only">البحث في الطلبات</span>
                  <FiSearch
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8D95]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="البحث برقم الطلب، المتجر أو المورد..."
                    className="h-10 w-full rounded-lg border border-[#DDE1E7] bg-white pr-9 pl-3 text-[12px] text-[#191C1D] outline-none transition placeholder:text-[#A1A3AA] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                  />
                </label>

                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="h-10 min-w-[150px] rounded-lg border border-[#DDE1E7] bg-white px-3 text-[12px] text-[#44474F] outline-none focus:border-[#40577B]"
                  aria-label="تصفية حسب الحالة"
                >
                  <option value="الكل">كل الحالات</option>
                  {Object.keys(statusStyles).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <select
                  value={supplierFilter}
                  onChange={handleSupplierChange}
                  className="h-10 min-w-[160px] rounded-lg border border-[#DDE1E7] bg-white px-3 text-[12px] text-[#44474F] outline-none focus:border-[#40577B]"
                  aria-label="تصفية حسب المورد"
                >
                  <option value="الكل">كل الموردين</option>
                  {supplierOptions.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-right">
              <thead>
                <tr className="bg-[#F4F6F9] text-[11px] font-semibold text-[#747780]">
                  <th className="px-5 py-3">رقم الطلب</th>
                  <th className="px-5 py-3">المتجر</th>
                  <th className="px-5 py-3">المورد</th>
                  <th className="px-5 py-3">تاريخ الطلب</th>
                  <th className="px-5 py-3">الإجمالي</th>
                  <th className="px-5 py-3">الحالة</th>
                  <th className="px-5 py-3 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {visibleOrders.length > 0 ? (
                  visibleOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[#EEF0F3] text-[12px] text-[#44474F] transition hover:bg-[#FAFBFC]"
                    >
                      <td
                        className="whitespace-nowrap px-5 py-4 font-semibold text-[#0B7890]"
                        dir="ltr"
                      >
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-[#191C1D]">
                        {order.store}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {order.supplier}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[#747780]">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#191C1D]">
                        {order.total}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#EEF3FA]"
                            aria-label={`عرض الطلب ${order.id}`}
                            title="عرض الطلب"
                          >
                            <FiEye size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-[13px] text-[#8A8D95]"
                    >
                      لا توجد طلبات مطابقة لخيارات البحث والتصفية.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#EEF0F3] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[11px] text-[#8A8D95]">
              عرض {visibleOrders.length} من أصل {filteredOrders.length} طلب
            </p>

            <div className="flex items-center gap-2" dir="ltr">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#EEF3FA] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة السابقة"
              >
                <FiChevronLeft size={16} aria-hidden="true" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                      safeCurrentPage === page
                        ? "bg-[#062454] text-white"
                        : "border border-[#DDE1E7] bg-white text-[#40577B] hover:bg-[#EEF3FA]"
                    }`}
                    aria-current={safeCurrentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#EEF3FA] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة التالية"
              >
                <FiChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00163B]/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-[#0000000D] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#EEF0F3] px-5 py-4 sm:px-6">
              <div className="min-w-0 text-right">
                <h2
                  id="order-details-title"
                  className="text-[18px] font-bold text-[#00163B]"
                >
                  تفاصيل الطلب
                </h2>
                <p
                  className="mt-1 text-[12px] font-semibold text-[#0B7890]"
                  dir="ltr"
                >
                  {selectedOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#EEF3FA]"
                aria-label="إغلاق تفاصيل الطلب"
                title="إغلاق"
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[11px] text-[#8A8D95]">المتجر</p>
                <p className="mt-1.5 text-[13px] font-semibold text-[#191C1D]">
                  {selectedOrder.store}
                </p>
              </div>

              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[11px] text-[#8A8D95]">المورد</p>
                <p className="mt-1.5 text-[13px] font-semibold text-[#191C1D]">
                  {selectedOrder.supplier}
                </p>
              </div>

              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[11px] text-[#8A8D95]">تاريخ الطلب</p>
                <p className="mt-1.5 text-[13px] font-semibold text-[#191C1D]">
                  {selectedOrder.date}
                </p>
              </div>

              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[11px] text-[#8A8D95]">الإجمالي</p>
                <p className="mt-1.5 text-[13px] font-bold text-[#00163B]">
                  {selectedOrder.total}
                </p>
              </div>

              <div className="rounded-xl bg-[#F7F8FA] p-4 sm:col-span-2">
                <p className="mb-2 text-[11px] text-[#8A8D95]">الحالة</p>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
