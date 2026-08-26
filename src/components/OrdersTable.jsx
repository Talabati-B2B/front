import { useEffect, useMemo, useState } from "react";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { IoIosSearch } from "react-icons/io";

import { useAuth } from "../context/AuthContext";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  getOrdersForSupplier,
  orderStatuses,
  subscribeOrders,
  updateOrderStatus as persistOrderStatus,
} from "../services/order/order";

const COLUMNS = [
  "رقم الطلب",
  "اسم المتجر",
  "تاريخ الطلب",
  "القيمة الإجمالية",
  "حالة الطلب",
  "إجراءات",
];

const ORDER_STATUS_STYLES = {
  [ORDER_STATUS.PENDING]: "bg-[#FFF1E8] text-[#A84B08]",
  [ORDER_STATUS.APPROVED]: "bg-[#E8F8EE] text-[#16834B]",
  [ORDER_STATUS.REJECTED]: "bg-[#FDECEC] text-[#C62828]",
};

const ITEMS_PER_PAGE = 5;

function FilterSelect({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-[190px]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="تصفية حسب حالة الطلب"
        className="h-11 w-full appearance-none rounded-lg border border-[#C9CFD8] bg-white py-2.5 pr-4 pl-10 text-right text-[12px] font-medium text-[#596579] outline-none transition-colors hover:border-[#AEB6C2] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
      >
        <option value="">كل الحالات</option>

        {orderStatuses.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
        strokeWidth={2}
      />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  tone = "default",
}) {
  const styles = {
    default:
      "border-[#D7DCE3] text-[#8A9099] hover:bg-[#F7F8FA] hover:text-[#062454]",
    success:
      "border-[#B7E3C7] text-[#16834B] hover:bg-[#EAF8EF]",
    danger:
      "border-[#F0BABA] text-[#D83232] hover:bg-[#FDECEC]",
    primary:
      "border-[#CAD6E6] text-[#40577B] hover:bg-[#EEF3FA]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}

function PageButton({
  children,
  active = false,
  label,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-[12px] font-semibold transition-colors",
        active
          ? "border-[#062454] bg-[#062454] text-white"
          : "border-[#D8DDE6] bg-white text-[#596579] hover:bg-[#F7F8FA]",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function OrdersTable() {
  const { user } = useAuth();

  const userEmail = String(user?.email ?? "")
    .trim()
    .toLowerCase();

  const userId = user?.id ?? null;
  const userSupplierId = user?.supplierId ?? null;

  /*
   * الحساب التجريبي للمورد مربوط بـ supplierId = 2.
   * بقية الموردين نستخدم supplierId إن وجد،
   * وإلا user.id.
   */
  const supplierId =
    userEmail === "supplier@test.com"
      ? 2
      : userSupplierId ?? userId ?? null;

  const [localOrders, setLocalOrders] = useState(() => {
    if (supplierId == null) {
      return [];
    }

    return getOrdersForSupplier(supplierId);
  });

  useEffect(() => {
    let cancelled = false;

    const syncOrders = () => {
      if (cancelled) {
        return;
      }

      const nextOrders =
        supplierId == null
          ? []
          : getOrdersForSupplier(supplierId);

      setLocalOrders(nextOrders);
    };

    /*
     * نؤجل المزامنة لأول microtask حتى لا يحصل
     * setState بشكل synchronous مباشرة داخل effect.
     */
    queueMicrotask(syncOrders);

    const unsubscribe = subscribeOrders(syncOrders);

    return () => {
      cancelled = true;

      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [supplierId]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return localOrders.filter((order) => {
      const orderNumber = String(
        order.orderNumber ?? "",
      ).toLowerCase();

      const storeName = String(
        order.storeName ?? "",
      ).toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        orderNumber.includes(normalizedSearch) ||
        storeName.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [localOrders, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  );

  const startIndex =
    (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const firstVisibleItem =
    filteredOrders.length === 0
      ? 0
      : startIndex + 1;

  const lastVisibleItem =
    filteredOrders.length === 0
      ? 0
      : Math.min(
          startIndex + ITEMS_PER_PAGE,
          filteredOrders.length,
        );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleAcceptOrder = (orderId) => {
    if (supplierId == null) {
      return;
    }

    const updated = persistOrderStatus(
      orderId,
      ORDER_STATUS.APPROVED,
      {
        supplierId,
      },
    );

    if (!updated) {
      return;
    }

    setLocalOrders(
      getOrdersForSupplier(supplierId),
    );

    setSelectedOrder((current) =>
      current?.id === updated.id
        ? updated
        : current,
    );

    setCurrentPage(1);
  };

  const handleRejectOrder = (orderId) => {
    if (supplierId == null) {
      return;
    }

    const updated = persistOrderStatus(
      orderId,
      ORDER_STATUS.REJECTED,
      {
        supplierId,
      },
    );

    if (!updated) {
      return;
    }

    setLocalOrders(
      getOrdersForSupplier(supplierId),
    );

    setSelectedOrder((current) =>
      current?.id === updated.id
        ? updated
        : current,
    );

    setCurrentPage(1);
  };

  return (
    <section className="min-w-0">
      {/* SEARCH + FILTER */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-[500px] items-center gap-2 rounded-lg border border-[#C9CFD8] bg-white px-4 py-2.5 transition-colors focus-within:border-[#40577B] focus-within:ring-2 focus-within:ring-[#40577B]/10">
          <IoIosSearch className="h-5 w-5 shrink-0 text-[#777E8A]" />

          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="ابحث برقم الطلب أو اسم المتجر..."
            aria-label="البحث في الطلبات"
            className="min-w-0 flex-1 bg-transparent text-right text-[12px] text-[#374151] outline-none placeholder:text-[#8A9099]"
          />

          <SlidersHorizontal
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[#777E8A]"
            strokeWidth={2}
          />
        </div>

        <div className="w-full sm:w-auto">
          <FilterSelect
            value={statusFilter}
            onChange={handleStatusFilterChange}
          />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-[#D7DBE2] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-right">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[17%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
            </colgroup>

            <thead>
              <tr className="bg-[#062454] text-white">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-3 py-3.5 text-center text-[12px] font-bold"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-6 py-14 text-center text-[13px] text-[#747B87]"
                  >
                    لا توجد طلبات مطابقة للبحث أو حالة
                    الطلب المحددة
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#E8EBEF] transition-colors last:border-b-0 hover:bg-[#FAFBFC]"
                  >
                    {/* ORDER ID */}
                    <td
                      className="whitespace-nowrap px-3 py-3 text-center text-[12px] font-medium text-[#747B87]"
                      dir="ltr"
                    >
                      {order.orderNumber}
                    </td>

                    {/* STORE */}
                    <td className="px-3 py-3 text-center text-[12px] font-medium text-[#1F2937]">
                      {order.storeName}
                    </td>

                    {/* DATE */}
                    <td
                      className="whitespace-nowrap px-3 py-3 text-center text-[11px] text-[#64748B]"
                      dir="ltr"
                    >
                      {order.date}
                    </td>

                    {/* TOTAL */}
                    <td className="whitespace-nowrap px-3 py-3 text-center text-[12px] font-semibold text-[#111827]">
                      <span dir="ltr">
                        ₪ {order.total}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-3 py-3 text-center">
                      <span
                        className={`inline-flex min-h-6 items-center justify-center rounded-full px-2.5 text-[10px] font-semibold ${
                          ORDER_STATUS_STYLES[
                            order.status
                          ] ??
                          "bg-[#F2F4F7] text-[#596579]"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[
                          order.status
                        ] ?? order.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <ActionButton
                          icon={Eye}
                          label={`عرض الطلب ${order.orderNumber}`}
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                        />

                        {order.status ===
                        ORDER_STATUS.PENDING ? (
                          <>
                            <ActionButton
                              icon={Check}
                              label="قبول الطلب"
                              tone="success"
                              onClick={() =>
                                handleAcceptOrder(
                                  order.id,
                                )
                              }
                            />

                            <ActionButton
                              icon={X}
                              label="رفض الطلب"
                              tone="danger"
                              onClick={() =>
                                handleRejectOrder(
                                  order.id,
                                )
                              }
                            />
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 border-t border-[#E1E5EA] bg-[#F7F8FA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="text-[12px] text-[#596579]">
            عرض {firstVisibleItem}-{lastVisibleItem} من{" "}
            {filteredOrders.length} طلب
          </span>

          <div
            className="flex items-center gap-2"
            dir="ltr"
          >
            <PageButton
              label="الصفحة السابقة"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1),
                )
              }
              disabled={safeCurrentPage === 1}
            >
              <ChevronLeft
                className="h-4 w-4"
                strokeWidth={2}
              />
            </PageButton>

            {Array.from(
              { length: totalPages },
              (_, index) => {
                const pageNumber = index + 1;

                return (
                  <PageButton
                    key={pageNumber}
                    active={
                      pageNumber ===
                      safeCurrentPage
                    }
                    label={`الصفحة ${pageNumber}`}
                    onClick={() =>
                      setCurrentPage(
                        pageNumber,
                      )
                    }
                  >
                    {pageNumber}
                  </PageButton>
                );
              },
            )}

            <PageButton
              label="الصفحة التالية"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    totalPages,
                    page + 1,
                  ),
                )
              }
              disabled={
                safeCurrentPage === totalPages
              }
            >
              <ChevronRight
                className="h-4 w-4"
                strokeWidth={2}
              />
            </PageButton>
          </div>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          dir="rtl"
        >
          <div className="w-full max-w-[480px] overflow-hidden rounded-xl bg-white shadow-xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#062454]">
                  تفاصيل الطلب
                </h3>

                <p
                  className="mt-1 text-[12px] text-[#7A818D]"
                  dir="ltr"
                >
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A818D] transition-colors hover:bg-[#F3F4F6] hover:text-[#062454]"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#8A9099]">
                  رقم الطلب
                </p>

                <p
                  className="mt-1 text-[13px] font-semibold text-[#1F2937]"
                  dir="ltr"
                >
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#8A9099]">
                  اسم المتجر
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#1F2937]">
                  {selectedOrder.storeName}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#8A9099]">
                  تاريخ الطلب
                </p>

                <p
                  className="mt-1 text-[13px] font-medium text-[#1F2937]"
                  dir="ltr"
                >
                  {selectedOrder.date}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#8A9099]">
                  القيمة الإجمالية
                </p>

                <p
                  className="mt-1 text-[13px] font-semibold text-[#1F2937]"
                  dir="ltr"
                >
                  ₪ {selectedOrder.total}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[11px] text-[#8A9099]">
                  حالة الطلب
                </p>

                <span
                  className={`mt-2 inline-flex min-h-7 items-center justify-center rounded-full px-3 text-[11px] font-semibold ${
                    ORDER_STATUS_STYLES[
                      selectedOrder.status
                    ] ??
                    "bg-[#F2F4F7] text-[#596579]"
                  }`}
                >
                  {ORDER_STATUS_LABELS[
                    selectedOrder.status
                  ] ?? selectedOrder.status}
                </span>
              </div>

              {/* ITEMS */}
              {Array.isArray(
                selectedOrder.items,
              ) &&
              selectedOrder.items.length > 0 ? (
                <div className="sm:col-span-2">
                  <p className="mb-3 text-[11px] text-[#8A9099]">
                    الأصناف
                  </p>

                  <div className="space-y-2 rounded-lg bg-[#F8F9FA] p-3">
                    {selectedOrder.items.map(
                      (item) => (
                        <div
                          key={`${selectedOrder.id}-${item.productId}`}
                          className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-2 text-[11px] last:border-b-0 last:pb-0"
                        >
                          <span className="font-medium text-[#1F2937]">
                            {item.name}
                          </span>

                          <span className="whitespace-nowrap text-[#64748B]">
                            {item.quantity} × ₪{" "}
                            {item.unitPrice}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-lg bg-[#062454] px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#0A316D]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}