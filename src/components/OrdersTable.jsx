import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X,
  Truck,
  PackageCheck,
  DollarSign,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { IoIosSearch } from "react-icons/io";

import * as supplierOrderService from "../services/supplier/orderService";
import { ORDER_STATUS_LIST, getStatusInfo } from "../constants/orderConstants";

const COLUMNS = ["رقم الطلب", "اسم المتجر", "تاريخ الطلب", "النوع", "القيمة الإجمالية", "حالة الطلب", "إجراءات"];

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

function getStoreName(order) {
  return order.store?.user?.first_name
    ? `${order.store.user.first_name} ${order.store.user.last_name || ""}`.trim()
    : order.store?.store_name || "متجر";
}

function ActionButton({ icon: Icon, label, onClick, disabled = false, tone = "default" }) {
  const styles = {
    default: "border-[#D7DCE3] text-[#8A9099] hover:bg-[#F7F8FA] hover:text-[#062454]",
    success: "border-[#B7E3C7] text-[#16834B] hover:bg-[#EAF8EF]",
    danger: "border-[#F0BABA] text-[#D83232] hover:bg-[#FDECEC]",
    primary: "border-[#CAD6E6] text-[#40577B] hover:bg-[#EEF3FA]",
    purple: "border-[#D4C4F0] text-[#7C3AED] hover:bg-[#F3EEFF]",
    blue: "border-[#B3D4F0] text-[#2563EB] hover:bg-[#EFF6FF]",
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles[tone]}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}

function PageButton({ children, active = false, label, onClick, disabled = false }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled}
      className={[
        "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-[12px] font-semibold transition-colors",
        active ? "border-[#062454] bg-[#062454] text-white" : "border-[#D8DDE6] bg-white text-[#596579] hover:bg-[#F7F8FA]",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}>
      {children}
    </button>
  );
}

function ProposePriceModal({ order, onClose, onSuccess }) {
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!price || isNaN(price)) return;
    setLoading(true);
    try {
      await supplierOrderService.proposePrice(order.id, parseFloat(price), notes || undefined);
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "فشل تقديم العرض");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4" dir="rtl" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-[16px] font-bold text-[#062454]">تقديم عرض سعر</h2>
        <p className="mt-1 text-[11px] text-[#7A818D]">طلب رقم {order?.order_number}</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-medium text-[#596579]">السعر المقترح (₪)</label>
            <input type="number" step="0.01" min="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 h-11 w-full rounded-lg border border-[#D8DDE6] px-3 text-[13px] outline-none focus:border-[#40577B]" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#596579]">ملاحظات (اختياري)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-[#D8DDE6] px-3 py-2 text-[12px] outline-none focus:border-[#40577B]" />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" disabled={!price || loading} onClick={handleSubmit} className="flex-1 rounded-lg bg-[#062454] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#0A316D] disabled:opacity-50">
            {loading ? "جاري الإرسال..." : "تقديم العرض"}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-[#D8DDE6] px-4 py-2.5 text-[12px] font-semibold text-[#596579] hover:bg-[#F7F8FA]">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [proposePriceOrder, setProposePriceOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await supplierOrderService.fetchOrders();
      const data = res.data;
      if (data?.data) {
        setOrders(data.data);
      } else {
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch { /* keep current */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const searchable = [order.order_number, getStoreName(order)].map((v) => String(v ?? "").toLowerCase());
      const matchSearch = !q || searchable.some((v) => v.includes(q));
      const matchStatus = !statusFilter || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const firstVisible = filteredOrders.length === 0 ? 0 : startIndex + 1;
  const lastVisible = filteredOrders.length === 0 ? 0 : Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length);

  const handleAction = async (action, order) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (action === "accept") await supplierOrderService.acceptOrder(order.id);
      else if (action === "reject") {
        const reason = prompt("سبب الرفض (اختياري):");
        await supplierOrderService.rejectOrder(order.id, reason || undefined);
      }
      else if (action === "ship") await supplierOrderService.shipOrder(order.id);
      else if (action === "deliver") await supplierOrderService.deliverOrder(order.id);
      else if (action === "approve_cancel") await supplierOrderService.approveCancellation(order.id);
      else if (action === "reject_cancel") await supplierOrderService.rejectCancellation(order.id);
      else if (action === "propose_price") {
        setProposePriceOrder(order);
        setActionLoading(false);
        return;
      }
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const renderActions = (order) => {
    const s = order.status;
    const btns = [
      <ActionButton key="view" icon={Eye} label="عرض" onClick={() => setSelectedOrder(order)} />,
    ];

    if (s === "pending") {
      btns.push(
        <ActionButton key="accept" icon={Check} label="قبول" tone="success" onClick={() => handleAction("accept", order)} />,
        <ActionButton key="reject" icon={X} label="رفض" tone="danger" onClick={() => handleAction("reject", order)} />,
      );
    }
    if (s === "accepted" || s === "preparing") {
      btns.push(<ActionButton key="ship" icon={Truck} label="شحن" tone="blue" onClick={() => handleAction("ship", order)} />);
    }
    if (s === "shipped") {
      btns.push(<ActionButton key="deliver" icon={PackageCheck} label="تسليم" tone="success" onClick={() => handleAction("deliver", order)} />);
    }
    if (s === "negotiating" || s === "price_proposed") {
      btns.push(<ActionButton key="propose" icon={DollarSign} label="عرض سعر" tone="purple" onClick={() => handleAction("propose_price", order)} />);
    }
    if (s === "cancellation_requested") {
      btns.push(
        <ActionButton key="approve_cancel" icon={Check} label="قبول الإلغاء" tone="success" onClick={() => handleAction("approve_cancel", order)} />,
        <ActionButton key="reject_cancel" icon={XCircle} label="رفض الإلغاء" tone="danger" onClick={() => handleAction("reject_cancel", order)} />,
      );
    }

    return <div className="flex items-center justify-center gap-1.5">{btns}</div>;
  };

  return (
    <section className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-[500px] items-center gap-2 rounded-lg border border-[#C9CFD8] bg-white px-4 py-2.5 focus-within:border-[#40577B] focus-within:ring-2 focus-within:ring-[#40577B]/10">
          <IoIosSearch className="h-5 w-5 shrink-0 text-[#777E8A]" />
          <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="ابحث برقم الطلب أو اسم المتجر..." className="min-w-0 flex-1 bg-transparent text-right text-[12px] text-[#374151] outline-none placeholder:text-[#8A9099]" />
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#777E8A]" strokeWidth={2} />
        </div>

        <div className="relative w-full sm:w-[190px]">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="h-11 w-full appearance-none rounded-lg border border-[#C9CFD8] bg-white py-2.5 pr-4 pl-10 text-right text-[12px] font-medium text-[#596579] outline-none hover:border-[#AEB6C2] focus:border-[#40577B]">
            <option value="">كل الحالات</option>
            {ORDER_STATUS_LIST.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" strokeWidth={2} />
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-[#D7DBE2] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[820px] table-fixed text-right">
            <colgroup>
              <col className="w-[13%]" />
              <col className="w-[17%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="bg-[#062454] text-white">
                {COLUMNS.map((col) => (
                  <th key={col} className="whitespace-nowrap px-3 py-3.5 text-center text-[12px] font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={COLUMNS.length} className="px-6 py-14 text-center text-[13px] text-[#747B87]">جاري التحميل...</td></tr>
              ) : paginatedOrders.length === 0 ? (
                <tr><td colSpan={COLUMNS.length} className="px-6 py-14 text-center text-[13px] text-[#747B87]">لا توجد طلبات مطابقة</td></tr>
              ) : (
                paginatedOrders.map((order) => {
                  const info = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} className="border-b border-[#E8EBEF] transition-colors last:border-b-0 hover:bg-[#FAFBFC]">
                      <td className="whitespace-nowrap px-3 py-3 text-center text-[12px] font-medium text-[#747B87]" dir="ltr">{order.order_number}</td>
                      <td className="px-3 py-3 text-center text-[12px] font-medium text-[#1F2937]">{getStoreName(order)}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-center text-[11px] text-[#64748B]">{formatDate(order.created_at)}</td>
                      <td className="px-3 py-3 text-center text-[11px] text-[#64748B]">{order.order_type === "negotiated" ? "تفاوضي" : "مباشر"}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-center text-[12px] font-semibold text-[#111827]">₪ {parseFloat(order.total_price || 0).toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-center">
                        <span className="inline-flex min-h-6 items-center justify-center rounded-full px-2.5 text-[10px] font-semibold" style={{ color: info.color, backgroundColor: info.bg }}>
                          {info.label}
                        </span>
                      </td>
                      <td className="px-2 py-3">{renderActions(order)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E1E5EA] bg-[#F7F8FA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="text-[12px] text-[#596579]">عرض {firstVisible}-{lastVisible} من {filteredOrders.length} طلب</span>
          <div className="flex items-center gap-2" dir="ltr">
            <PageButton label="السابقة" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safeCurrentPage === 1}>
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => (
              <PageButton key={i + 1} active={i + 1 === safeCurrentPage} label={`صفحة ${i + 1}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</PageButton>
            ))}
            <PageButton label="التالية" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safeCurrentPage === totalPages}>
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </PageButton>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" dir="rtl">
          <div className="w-full max-w-[480px] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#062454]">تفاصيل الطلب</h3>
                <p className="mt-1 text-[12px] text-[#7A818D]" dir="ltr">{selectedOrder.order_number}</p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A818D] hover:bg-[#F3F4F6]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#8A9099]">رقم الطلب</p>
                <p className="mt-1 text-[13px] font-semibold text-[#1F2937]" dir="ltr">{selectedOrder.order_number}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9099]">اسم المتجر</p>
                <p className="mt-1 text-[13px] font-semibold text-[#1F2937]">{getStoreName(selectedOrder)}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9099]">تاريخ الطلب</p>
                <p className="mt-1 text-[13px] font-medium text-[#1F2937]">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9099]">القيمة الإجمالية</p>
                <p className="mt-1 text-[13px] font-semibold text-[#1F2937]">₪ {parseFloat(selectedOrder.total_price || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9099]">نوع الطلب</p>
                <p className="mt-1 text-[13px] font-medium text-[#1F2937]">{selectedOrder.order_type === "negotiated" ? "تفاوضي" : "مباشر"}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9099]">حالة الطلب</p>
                <span className="mt-2 inline-flex min-h-7 items-center justify-center rounded-full px-3 text-[11px] font-semibold" style={{ color: getStatusInfo(selectedOrder.status).color, backgroundColor: getStatusInfo(selectedOrder.status).bg }}>
                  {getStatusInfo(selectedOrder.status).label}
                </span>
              </div>

              {selectedOrder.order_items?.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="mb-3 text-[11px] text-[#8A9099]">الأصناف</p>
                  <div className="space-y-2 rounded-lg bg-[#F8F9FA] p-3">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-2 text-[11px] last:border-b-0 last:pb-0">
                        <span className="font-medium text-[#1F2937]">{item.product?.name || "منتج"}</span>
                        <span className="whitespace-nowrap text-[#64748B]">{item.quantity} x ₪ {parseFloat(item.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
              <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-lg bg-[#062454] px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-[#0A316D]">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {proposePriceOrder && (
        <ProposePriceModal order={proposePriceOrder} onClose={() => setProposePriceOrder(null)} onSuccess={loadOrders} />
      )}
    </section>
  );
}
