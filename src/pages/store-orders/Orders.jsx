import { useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock3,
  FileText,
  Filter,
  MoreVertical,
  Package,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import {
  currentStoreOrders,
  previousStoreOrders,
  storeOrderStatusOptions,
  storeOrderSummary,
} from "../../services/store/storeOrders.mock";

const STATUS_STYLES = {
  جديد: "border border-[#F8C89E] bg-[#FFF8F1] text-[#D97706]",
  "قيد التجهيز": "bg-[#EEF3FB] text-[#40577B]",
  "قيد الشحن": "bg-[#EEF3FB] text-[#40577B]",
  "تم التسليم": "bg-[#E9F9EF] text-[#16834B]",
};

const SUMMARY_STYLES = {
  blue: "bg-[#EDF4FF] text-[#4D7ED8]",
  orange: "bg-[#FFF2E8] text-[#F97316]",
  green: "bg-[#EAF9EF] text-[#16A34A]",
  red: "bg-[#FFF0F0] text-[#E44848]",
};

const SUMMARY_ICONS = {
  all: Package,
  processing: Clock3,
  delivered: CheckCircle2,
  cancelled: X,
};

function getOrderSubtotal(order) {
  return order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
}

function getOrderTotals(order) {
  const subtotal = getOrderSubtotal(order);
  const tax = subtotal * 0.15;

  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

function SummaryCard({ item }) {
  const Icon = SUMMARY_ICONS[item.id] ?? Package;

  return (
    <article className="flex min-h-[108px] items-center justify-between gap-4 rounded-xl border border-[#E8EBEF] bg-white px-5 py-4 shadow-[0_1px_5px_rgba(15,23,42,0.03)]">
      <div>
        <p className="text-[11px] font-medium text-[#8A9099]">{item.label}</p>
        <p className="mt-2 text-[24px] font-bold text-[#20365A]">{item.value}</p>
        <p className="mt-1 text-[9px] text-[#8A9099]">{item.helper}</p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${SUMMARY_STYLES[item.tone]}`}
      >
        <Icon className="h-6 w-6" strokeWidth={1.9} />
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-w-[78px] items-center justify-center rounded-full px-3 py-1.5 text-[10px] font-semibold ${STATUS_STYLES[status] ?? "bg-[#F2F4F7] text-[#596579]"}`}
    >
      {status}
    </span>
  );
}

function OrderDetails({ order, onReorder, onViewInvoice, reorderMessage }) {
  if (!order) {
    return (
      <aside className="rounded-xl border border-[#E6E9ED] bg-white p-6 text-center shadow-[0_1px_5px_rgba(15,23,42,0.03)]">
        <Package className="mx-auto h-8 w-8 text-[#A0A7B2]" strokeWidth={1.6} />
        <p className="mt-3 text-[12px] text-[#7A818D]">
          اختر طلباً لعرض التفاصيل.
        </p>
      </aside>
    );
  }

  const { subtotal, tax, total } = getOrderTotals(order);

  return (
    <aside className="overflow-hidden rounded-xl border border-[#E6E9ED] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.03)]">
      <div className="border-b border-[#ECEEF1] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-[#20365A]">تفاصيل الطلب</h2>
          <span className="whitespace-nowrap text-[12px] font-bold text-[#173A6B]" dir="ltr">
            {order.orderNumber}
          </span>
        </div>

        <dl className="mt-5 space-y-3 text-[10px]">
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-[#9AA0AA]">اسم المورد</dt>
            <dd className="text-left font-medium text-[#40516C]">{order.supplier}</dd>
          </div>

          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-[#9AA0AA]">تاريخ الطلب</dt>
            <dd className="text-left text-[#40516C]">
              {order.dateLabel} - {order.timeLabel}
            </dd>
          </div>

          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-[#9AA0AA]">عنوان التسليم</dt>
            <dd className="max-w-[180px] text-left leading-5 text-[#40516C]">
              {order.deliveryAddress}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#9AA0AA]">حالة الطلب</dt>
            <dd>
              <StatusBadge status={order.status} />
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#9AA0AA]">حالة الدفع</dt>
            <dd
              className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                order.paymentStatus === "مدفوع"
                  ? "bg-[#EAF9EF] text-[#16834B]"
                  : "bg-[#FFF0F0] text-[#D83232]"
              }`}
            >
              {order.paymentStatus}
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-5 py-5">
        <h3 className="border-r-[3px] border-[#F97316] pr-2 text-[12px] font-bold text-[#20365A]">
          الأصناف المطلوبة
        </h3>

        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={`${order.id}-${item.productId}`} className="flex min-w-0 items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="h-10 w-10 shrink-0 rounded-md border border-[#E5E7EB] object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold text-[#40516C]">
                  {item.name}
                </p>
                <p className="mt-0.5 whitespace-nowrap text-[8px] text-[#9AA0AA]">
                  {item.quantity} × {item.unitPrice.toFixed(2)} ₪
                </p>
              </div>

              <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-[#173A6B]">
                ₪ {(item.quantity * item.unitPrice).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-dashed border-[#DDE1E6] pt-4 text-[10px]">
          <div className="flex items-center justify-between gap-4 py-1.5">
            <span className="text-[#8A9099]">إجمالي الأصناف</span>
            <span className="font-semibold text-[#40516C]">₪ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-1.5">
            <span className="text-[#8A9099]">الضريبة (15%)</span>
            <span className="font-semibold text-[#40516C]">₪ {tax.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4 py-2">
            <span className="text-[13px] font-bold text-[#20365A]">الإجمالي الكلي</span>
            <span className="text-[18px] font-bold text-[#F97316]">₪ {total.toFixed(2)}</span>
          </div>
        </div>

        {reorderMessage ? (
          <p className="mt-2 rounded-lg bg-[#F2F8F4] px-3 py-2 text-center text-[9px] leading-5 text-[#16834B]">
            {reorderMessage}
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onReorder(order)}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-3 text-[11px] font-bold text-white transition-colors hover:bg-[#EA6810]"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            إعادة الطلب
          </button>

          <button
            type="button"
            onClick={() => onViewInvoice(order)}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#C8D6EC] bg-white px-3 text-[11px] font-semibold text-[#4677C5] transition-colors hover:bg-[#F5F8FD]"
          >
            <FileText className="h-4 w-4" strokeWidth={1.8} />
            عرض الفاتورة
          </button>
        </div>
      </div>
    </aside>
  );
}

function InvoiceModal({ order, onClose }) {
  if (!order) {
    return null;
  }

  const { subtotal, tax, total } = getOrderTotals(order);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#00163B]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#E8EBEF] pb-4">
          <div>
            <h2 id="invoice-title" className="text-[18px] font-bold text-[#20365A]">الفاتورة</h2>
            <p className="mt-1 text-[11px] font-semibold text-[#173A6B]" dir="ltr">
              {order.orderNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق الفاتورة"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7A818D] transition-colors hover:bg-[#F3F5F8] hover:text-[#20365A]"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-[#FAFBFC] p-4 text-[11px] sm:grid-cols-2">
          <div><span className="text-[#8A9099]">المورد:</span> <span className="font-semibold text-[#40516C]">{order.supplier}</span></div>
          <div><span className="text-[#8A9099]">التاريخ:</span> <span className="font-semibold text-[#40516C]">{order.dateLabel}</span></div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[480px] text-right text-[10px]">
            <thead>
              <tr className="bg-[#F4F5F7] text-[#6D7480]">
                <th className="px-3 py-2.5 text-right">الصنف</th>
                <th className="px-3 py-2.5 text-center">الكمية</th>
                <th className="px-3 py-2.5 text-center">سعر الوحدة</th>
                <th className="px-3 py-2.5 text-center">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={`${order.id}-${item.productId}`} className="border-t border-[#ECEEF1]">
                  <td className="px-3 py-3 font-semibold text-[#40516C]">{item.name}</td>
                  <td className="px-3 py-3 text-center">{item.quantity}</td>
                  <td className="px-3 py-3 text-center">₪ {item.unitPrice.toFixed(2)}</td>
                  <td className="px-3 py-3 text-center font-bold text-[#173A6B]">₪ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mr-auto mt-5 max-w-[280px] space-y-2 border-t border-[#E8EBEF] pt-4 text-[11px]">
          <div className="flex justify-between gap-4"><span className="text-[#8A9099]">إجمالي الأصناف</span><span>₪ {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#8A9099]">الضريبة (15%)</span><span>₪ {tax.toFixed(2)}</span></div>
          <div className="flex justify-between gap-4 pt-2 text-[14px] font-bold text-[#20365A]"><span>الإجمالي</span><span className="text-[#F97316]">₪ {total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}

function CurrentOrdersTable({ orders, selectedOrderId, onSelectOrder }) {
  if (orders.length === 0) {
    return (
      <div className="px-5 py-12 text-center text-[11px] text-[#7A818D]">
        لا توجد طلبات مطابقة للبحث أو الفلاتر المحددة.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[690px] text-right">
        <thead>
          <tr className="bg-[#FAFBFC] text-[9px] font-medium text-[#9AA0AA]">
            <th className="px-4 py-3 text-right">رقم الطلب</th>
            <th className="px-4 py-3 text-right">المورد</th>
            <th className="px-4 py-3 text-center">التاريخ</th>
            <th className="px-4 py-3 text-center">عدد الأصناف</th>
            <th className="px-4 py-3 text-center">الإجمالي</th>
            <th className="px-4 py-3 text-center">حالة الطلب</th>
            <th className="w-12 px-3 py-3 text-center">الإجراء</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const { total } = getOrderTotals(order);
            const isSelected = selectedOrderId === order.id;

            return (
              <tr
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className={`cursor-pointer border-t border-[#ECEEF1] text-[10px] transition-colors ${
                  isSelected ? "bg-[#FFF5EC]" : "bg-white hover:bg-[#FAFBFC]"
                }`}
              >
                <td className="whitespace-nowrap px-4 py-4 font-bold text-[#173A6B]" dir="ltr">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-4">
                  <div className="flex min-w-[145px] items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${order.supplierClass}`}
                    >
                      {order.supplierInitial}
                    </span>
                    <span className="font-medium text-[#40516C]">{order.supplier}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-[#596579]">
                  <span className="block whitespace-nowrap">{order.dateLabel}</span>
                  <span className="mt-0.5 block text-[8px] text-[#9AA0AA]">{order.timeLabel}</span>
                </td>
                <td className="px-4 py-4 text-center font-medium text-[#40516C]">
                  {order.items.length}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center font-bold text-[#173A6B]">
                  ₪ {total.toFixed(2)}
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-3 py-4 text-center">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectOrder(order);
                    }}
                    aria-label={`عرض تفاصيل ${order.orderNumber}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7A818D] transition-colors hover:bg-[#EEF1F5] hover:text-[#20365A]"
                  >
                    <MoreVertical className="h-4 w-4" strokeWidth={2} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PreviousOrdersTable({ orders, onSelectOrder }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-right">
        <thead>
          <tr className="bg-[#FAFBFC] text-[9px] font-medium text-[#9AA0AA]">
            <th className="px-5 py-3 text-right">رقم الطلب</th>
            <th className="px-5 py-3 text-right">المورد</th>
            <th className="px-5 py-3 text-center">التاريخ</th>
            <th className="px-5 py-3 text-center">الإجمالي</th>
            <th className="px-5 py-3 text-center">حالة الطلب</th>
            <th className="px-5 py-3 text-center">الإجراء</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const { total } = getOrderTotals(order);

            return (
              <tr key={order.id} className="border-t border-[#ECEEF1] text-[10px]">
                <td className="whitespace-nowrap px-5 py-4 font-bold text-[#173A6B]" dir="ltr">
                  {order.orderNumber}
                </td>
                <td className="px-5 py-4">
                  <div className="flex min-w-[150px] items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${order.supplierClass}`}
                    >
                      {order.supplierInitial}
                    </span>
                    <span className="font-medium text-[#40516C]">{order.supplier}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-center text-[#596579]">
                  {order.dateLabel}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-center font-bold text-[#173A6B]">
                  ₪ {total.toFixed(2)}
                </td>
                <td className="px-5 py-4 text-center">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onSelectOrder(order)}
                    className="min-h-8 rounded-md border border-[#E4E7EB] bg-white px-4 text-[9px] font-semibold text-[#40516C] transition-colors hover:bg-[#F7F8FA]"
                  >
                    عرض
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


function filterOrderList(orders, searchTerm, topbarSearchValue, statusFilter, dateFilter) {
  const localSearch = searchTerm.trim().toLowerCase();
  const globalSearch = topbarSearchValue.trim().toLowerCase();

  return orders.filter((order) => {
    const searchableValues = [
      order.orderNumber,
      order.supplier,
      order.status,
    ].map((value) => value.toLowerCase());

    const matchesLocalSearch =
      !localSearch || searchableValues.some((value) => value.includes(localSearch));
    const matchesGlobalSearch =
      !globalSearch || searchableValues.some((value) => value.includes(globalSearch));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date === dateFilter;

    return matchesLocalSearch && matchesGlobalSearch && matchesStatus && matchesDate;
  });
}

function OrdersContent({ initialOrderNumber, successMessage }) {
  const {
    searchValue: topbarSearchValue = "",
    reorderItems,
    currentOrders = currentStoreOrders,
    previousOrders = previousStoreOrders,
  } = useOutletContext() ?? {};

  const allOrders = useMemo(
    () => [...currentOrders, ...previousOrders],
    [currentOrders, previousOrders],
  );

  const requestedOrder = initialOrderNumber
    ? allOrders.find((order) => order.orderNumber === initialOrderNumber)
    : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showAllCurrent, setShowAllCurrent] = useState(false);
  const [showAllPrevious, setShowAllPrevious] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(
    requestedOrder ?? currentOrders[0] ?? previousOrders[0] ?? null,
  );
  const [activeSection, setActiveSection] = useState(
    requestedOrder && previousOrders.some((order) => order.id === requestedOrder.id)
      ? "previous"
      : "current",
  );
  const [reorderMessage, setReorderMessage] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const filteredCurrentOrders = useMemo(
    () =>
      filterOrderList(
        currentOrders,
        searchTerm,
        topbarSearchValue,
        statusFilter,
        dateFilter,
      ),
    [currentOrders, dateFilter, searchTerm, statusFilter, topbarSearchValue],
  );

  const filteredPreviousOrders = useMemo(
    () =>
      filterOrderList(
        previousOrders,
        searchTerm,
        topbarSearchValue,
        statusFilter,
        dateFilter,
      ),
    [previousOrders, dateFilter, searchTerm, statusFilter, topbarSearchValue],
  );

  const visibleCurrentOrders = showAllCurrent
    ? filteredCurrentOrders
    : filteredCurrentOrders.slice(0, 4);

  const visiblePreviousOrders = showAllPrevious
    ? filteredPreviousOrders
    : filteredPreviousOrders.slice(0, 3);

  const goToSection = (section) => {
    setActiveSection(section);
    setReorderMessage("");

    const source = section === "current" ? filteredCurrentOrders : filteredPreviousOrders;
    setSelectedOrder(source[0] ?? null);
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setReorderMessage("");
  };

  const handleReorder = (order) => {
    if (typeof reorderItems !== "function") {
      setReorderMessage("تعذر الوصول إلى السلة المحلية حالياً.");
      return;
    }

    const result = reorderItems(order.items);

    if (!result || result.addedCount === 0) {
      setReorderMessage("لم تتم إضافة منتجات لأن الأصناف المطلوبة غير متوفرة حالياً.");
      return;
    }

    if (result.unavailableCount > 0) {
      setReorderMessage(
        `تم تحديث الأسعار والمخزون وإضافة ${result.addedCount} صنف للسلة، وتعذر إضافة ${result.unavailableCount} صنف غير متوفر.`,
      );
      return;
    }

    setReorderMessage(
      `تم التحقق من المخزون وتحديث الأسعار وإضافة ${result.addedCount} صنف للسلة.`,
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter("");
    setShowAllCurrent(false);
    setShowAllPrevious(false);
  };

  return (
    <>
      <section dir="rtl" className="min-h-full bg-white px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto w-full max-w-[1320px]">
          <header className="mb-5">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-[#B8793C]" strokeWidth={1.8} />
              <h1 className="text-[22px] font-bold text-[#062454] sm:text-[25px]">
                طلبات المتجر
              </h1>
            </div>
            <p className="mt-1.5 text-[11px] text-[#7A818D]">
              تابع طلباتك الحالية والسابقة بسهولة
            </p>
          </header>

          {successMessage ? (
            <div className="mb-5 rounded-xl border border-[#BFE3CC] bg-[#F0FAF4] px-4 py-3 text-[11px] font-medium text-[#16834B]">
              {successMessage}
            </div>
          ) : null}

          <div className="mb-6 flex items-end gap-6 border-b border-[#E6E9ED]">
            <button
              type="button"
              onClick={() => goToSection("current")}
              className={`border-b-2 px-2 pb-3 text-[12px] font-semibold transition-colors ${
                activeSection === "current"
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-[#8A9099] hover:text-[#596579]"
              }`}
            >
              الطلبات الحالية
            </button>
            <button
              type="button"
              onClick={() => goToSection("previous")}
              className={`border-b-2 px-2 pb-3 text-[12px] font-semibold transition-colors ${
                activeSection === "previous"
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-[#8A9099] hover:text-[#596579]"
              }`}
            >
              الطلبات السابقة
            </button>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {storeOrderSummary.map((item) => (
              <SummaryCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#ECEEF1] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.02)] lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9099]"
                strokeWidth={1.8}
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setShowAllCurrent(false);
                  setShowAllPrevious(false);
                }}
                placeholder="ابحث برقم الطلب أو اسم المورد..."
                className="h-11 w-full rounded-lg border border-[#E0E3E7] bg-[#FAFBFC] pr-10 pl-10 text-[11px] text-[#40516C] outline-none placeholder:text-[#A0A7B2] focus:border-[#AEB9C8] focus:bg-white"
              />
              <Filter
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A7B2]"
                strokeWidth={1.8}
              />
            </div>

            <div className="relative w-full lg:w-[150px]">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setShowAllCurrent(false);
                  setShowAllPrevious(false);
                }}
                className="h-11 w-full appearance-none rounded-lg border border-[#E0E3E7] bg-[#FAFBFC] pr-4 pl-9 text-[11px] font-medium text-[#596579] outline-none focus:border-[#AEB9C8] focus:bg-white"
              >
                <option value="">حالة الطلب</option>
                {storeOrderStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9099]"
                strokeWidth={1.8}
              />
            </div>

            <label className="relative block w-full lg:w-[170px]">
              <CalendarDays
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A7B2]"
                strokeWidth={1.8}
              />
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(event.target.value);
                  setShowAllCurrent(false);
                  setShowAllPrevious(false);
                }}
                aria-label="تاريخ الطلب"
                className="h-11 w-full rounded-lg border border-[#E0E3E7] bg-[#FAFBFC] pr-10 pl-3 text-[10px] text-[#596579] outline-none focus:border-[#AEB9C8] focus:bg-white"
              />
            </label>

            {(searchTerm || statusFilter || dateFilter) && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-11 rounded-lg border border-[#E0E3E7] bg-white px-4 text-[10px] font-semibold text-[#596579] hover:bg-[#F7F8FA]"
              >
                مسح الفلاتر
              </button>
            )}
          </div>

          <div
            className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start"
            dir="ltr"
          >
            <div className="min-w-0 xl:sticky xl:top-5" dir="rtl">
              <OrderDetails
                order={selectedOrder}
                onReorder={handleReorder}
                onViewInvoice={setInvoiceOrder}
                reorderMessage={reorderMessage}
              />
            </div>

            {activeSection === "current" ? (
              <section
                className="min-w-0 overflow-hidden rounded-xl border border-[#E6E9ED] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.03)]"
                dir="rtl"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#ECEEF1] px-5 py-5">
                  <h2 className="text-[16px] font-bold text-[#20365A]">الطلبات الحالية</h2>
                  <span className="text-[9px] text-[#8A9099]">
                    {filteredCurrentOrders.length} طلب
                  </span>
                </div>

                <CurrentOrdersTable
                  orders={visibleCurrentOrders}
                  selectedOrderId={selectedOrder?.id}
                  onSelectOrder={handleSelectOrder}
                />

                {filteredCurrentOrders.length > 4 ? (
                  <div className="border-t border-[#ECEEF1] px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setShowAllCurrent((current) => !current)}
                      className="flex min-h-9 w-full items-center justify-center gap-1 rounded-lg bg-[#FAFBFC] text-[10px] font-semibold text-[#4677C5] transition-colors hover:bg-[#F3F5F8]"
                    >
                      {showAllCurrent ? "عرض أقل" : "عرض جميع الطلبات الحالية"}
                      <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>
                ) : null}
              </section>
            ) : (
              <section
                className="min-w-0 overflow-hidden rounded-xl border border-[#E6E9ED] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.03)]"
                dir="rtl"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#ECEEF1] px-5 py-5">
                  <h2 className="text-[15px] font-bold text-[#20365A]">الطلبات السابقة</h2>
                  {filteredPreviousOrders.length > 3 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllPrevious((current) => !current)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4677C5] hover:text-[#315FAD]"
                    >
                      {showAllPrevious ? "عرض أقل" : "عرض الكل"}
                      <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  ) : null}
                </div>

                {visiblePreviousOrders.length ? (
                  <PreviousOrdersTable
                    orders={visiblePreviousOrders}
                    onSelectOrder={handleSelectOrder}
                  />
                ) : (
                  <div className="px-5 py-12 text-center text-[11px] text-[#7A818D]">
                    لا توجد طلبات سابقة مطابقة للبحث أو الفلاتر المحددة.
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </section>

      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
    </>
  );
}

export default function Orders() {
  const location = useLocation();

  return (
    <OrdersContent
      key={location.key}
      initialOrderNumber={location.state?.orderNumber}
      successMessage={location.state?.successMessage}
    />
  );
}
