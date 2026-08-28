import { useCallback, useMemo, useState } from "react";
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
  XCircle,
  Truck,
  MessageSquare,
  Upload,
  DollarSign,
  Copy,
  Landmark,
} from "lucide-react";

import { ORDER_STATUSES, ORDER_STATUS_LIST, getStatusInfo } from "../../constants/orderConstants";
import * as storeOrderService from "../../services/store/orderService";
import * as invoiceService from "../../services/invoiceService";

function getStatusLabel(status) {
  return getStatusInfo(status).label;
}

function getStatusStyle(status) {
  const info = getStatusInfo(status);
  return `border bg-opacity-20 font-semibold`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

function getSupplierName(order) {
  return order.supplier?.company_name || order.supplier?.user?.first_name || "مورد";
}

function getSupplierInitial(order) {
  const name = getSupplierName(order);
  return name.charAt(0).toUpperCase();
}

function getOrderItems(order) {
  return order.order_items || order.items || [];
}

function getOrderTotal(order) {
  return parseFloat(order.total_price || 0);
}

function getPaymentStatus(order) {
  if (!order.invoice) return "غير مدفوع";
  const s = order.invoice.escrow_status || order.invoice.status;
  const map = {
    pending_payment: "بانتظار الدفع",
    held_in_escrow: "محتجز بالضمان",
    released_to_supplier: "تم التحويل",
    refunded: "مسترد",
    issued: "صادرة",
    paid: "مدفوع",
    canceled: "ملغاة",
  };
  return map[s] || s;
}

function getPaymentStatusColor(order) {
  if (!order.invoice) return "bg-[#FFF0F0] text-[#D83232]";
  const s = order.invoice.escrow_status || order.invoice.status;
  if (s === "held_in_escrow" || s === "paid") return "bg-[#EAF9EF] text-[#16834B]";
  if (s === "released_to_supplier") return "bg-[#EDF4FF] text-[#4D7ED8]";
  if (s === "refunded") return "bg-[#FFF8F1] text-[#D97706]";
  return "bg-[#FFF0F0] text-[#D83232]";
}

function StatusBadge({ status }) {
  const info = getStatusInfo(status);
  return (
    <span
      className="inline-flex min-w-[78px] items-center justify-center rounded-full px-3 py-1.5 text-[10px] font-semibold"
      style={{ color: info.color, backgroundColor: info.bg }}
    >
      {info.label}
    </span>
  );
}

function SummaryCards({ orders }) {
  const counts = useMemo(() => {
    const c = { all: orders.length, pending: 0, active: 0, delivered: 0, canceled: 0 };
    orders.forEach((o) => {
      if (o.status === "pending") c.pending++;
      else if (["accepted", "preparing", "shipped"].includes(o.status)) c.active++;
      else if (o.status === "delivered") c.delivered++;
      else if (o.status === "canceled") c.canceled++;
    });
    return c;
  }, [orders]);

  const cards = [
    { id: "all", label: "إجمالي الطلبات", value: counts.all, tone: "blue", icon: Package },
    { id: "pending", label: "بانتظار المعالجة", value: counts.pending, tone: "orange", icon: Clock3 },
    { id: "delivered", label: "تم التسليم", value: counts.delivered, tone: "green", icon: CheckCircle2 },
    { id: "canceled", label: "ملغية", value: counts.canceled, tone: "red", icon: X },
  ];

  const toneStyles = {
    blue: "bg-[#EDF4FF] text-[#4D7ED8]",
    orange: "bg-[#FFF2E8] text-[#F97316]",
    green: "bg-[#EAF9EF] text-[#16A34A]",
    red: "bg-[#FFF0F0] text-[#E44848]",
  };

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.id} className="flex min-h-[108px] items-center justify-between gap-4 rounded-xl border border-[#E8EBEF] bg-white px-5 py-4 shadow-[0_1px_5px_rgba(15,23,42,0.03)]">
            <div>
              <p className="text-[11px] font-medium text-[#8A9099]">{item.label}</p>
              <p className="mt-2 text-[24px] font-bold text-[#20365A]">{item.value}</p>
            </div>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneStyles[item.tone]}`}>
              <Icon className="h-6 w-6" strokeWidth={1.9} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function OrderActions({ order, onAction }) {
  const s = order.status;
  const buttons = [];

  if (s === "pending") {
    buttons.push(
      <button key="cancel" onClick={() => onAction("cancel", order)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-[10px] font-semibold text-red-600 hover:bg-red-50">
        <XCircle className="h-3.5 w-3.5" /> إلغاء
      </button>,
    );
  }

  if (s === "accepted" && order.invoice && order.invoice.escrow_status === "pending_payment") {
    buttons.push(
      <button key="pay" onClick={() => onAction("upload_proof", order)} className="inline-flex items-center gap-1 rounded-lg bg-[#F97316] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#EA6B0D]">
        <Upload className="h-3.5 w-3.5" /> رفع إثبات دفع
      </button>,
    );
  }

  if (s === "price_proposed") {
    buttons.push(
      <button key="accept" onClick={() => onAction("accept_offer", order)} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> قبول العرض
      </button>,
      <button key="reject" onClick={() => onAction("reject_offer", order)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-[10px] font-semibold text-red-600 hover:bg-red-50">
        <XCircle className="h-3.5 w-3.5" /> رفض العرض
      </button>,
    );
  }

  if (s === "shipped") {
    buttons.push(
      <button key="confirm" onClick={() => onAction("confirm_delivery", order)} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> تأكيد الاستلام
      </button>,
    );
  }

  if (s === "negotiating") {
    buttons.push(
      <button key="chat" onClick={() => onAction("open_chat", order)} className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-purple-700">
        <MessageSquare className="h-3.5 w-3.5" /> فتح المحادثة
      </button>,
    );
  }

  if (buttons.length === 0) return null;
  return <div className="mt-3 flex flex-wrap gap-2">{buttons}</div>;
}

function OrderDetails({ order, onReorder, onViewInvoice, onAction, reorderMessage }) {
  if (!order) {
    return (
      <aside className="rounded-xl border border-[#E6E9ED] bg-white p-6 text-center shadow-[0_1px_5px_rgba(15,23,42,0.03)]">
        <Package className="mx-auto h-8 w-8 text-[#A0A7B2]" strokeWidth={1.6} />
        <p className="mt-3 text-[12px] text-[#7A818D]">اختر طلبا لعرض التفاصيل.</p>
      </aside>
    );
  }

  const items = getOrderItems(order);
  const total = getOrderTotal(order);

  return (
    <aside className="overflow-hidden rounded-xl border border-[#E6E9ED] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.03)]">
      <div className="border-b border-[#ECEEF1] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-[#20365A]">تفاصيل الطلب</h2>
          <span className="whitespace-nowrap text-[12px] font-bold text-[#173A6B]" dir="ltr">{order.order_number}</span>
        </div>

        <dl className="mt-5 space-y-3 text-[10px]">
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-[#9AA0AA]">اسم المورد</dt>
            <dd className="text-left font-medium text-[#40516C]">{getSupplierName(order)}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-[#9AA0AA]">تاريخ الطلب</dt>
            <dd className="text-left text-[#40516C]">{formatDate(order.created_at)} - {formatTime(order.created_at)}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-[#9AA0AA]">نوع الطلب</dt>
            <dd className="text-left font-medium text-[#40516C]">{order.order_type === "negotiated" ? "تفاوضي" : "مباشر"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#9AA0AA]">حالة الطلب</dt>
            <dd><StatusBadge status={order.status} /></dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#9AA0AA]">حالة الدفع</dt>
            <dd className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${getPaymentStatusColor(order)}`}>
              {getPaymentStatus(order)}
            </dd>
          </div>
        </dl>

        <OrderActions order={order} onAction={onAction} />
      </div>

      <div className="px-5 py-5">
        <h3 className="border-r-[3px] border-[#F97316] pr-2 text-[12px] font-bold text-[#20365A]">الاصناف المطلوبة</h3>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F8F9FA]">
                <Package className="h-5 w-5 text-[#A0A7B2]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold text-[#40516C]">{item.product?.name || item.name}</p>
                <p className="mt-0.5 whitespace-nowrap text-[8px] text-[#9AA0AA]">
                  {item.quantity} x {Number(item.price || 0).toFixed(2)} ₪
                </p>
              </div>
              <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-[#173A6B]">
                ₪ {(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-dashed border-[#DDE1E6] pt-4 text-[10px]">
          <div className="mt-1 flex items-center justify-between gap-4 py-2">
            <span className="text-[13px] font-bold text-[#20365A]">الإجمالي الكلي</span>
            <span className="text-[18px] font-bold text-[#F97316]">₪ {total.toFixed(2)}</span>
          </div>
        </div>

        {reorderMessage && (
          <p className="mt-2 rounded-lg bg-[#F2F8F4] px-3 py-2 text-center text-[9px] leading-5 text-[#16834B]">{reorderMessage}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => onReorder(order)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-3 text-[11px] font-bold text-white transition-colors hover:bg-[#EA6810]">
            <RotateCcw className="h-4 w-4" strokeWidth={2} /> إعادة الطلب
          </button>
          <button type="button" onClick={() => onViewInvoice(order)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#C8D6EC] bg-white px-3 text-[11px] font-semibold text-[#4677C5] transition-colors hover:bg-[#F5F8FD]">
            <FileText className="h-4 w-4" strokeWidth={1.8} /> عرض الفاتورة
          </button>
        </div>
      </div>
    </aside>
  );
}

function InvoiceModal({ order, onClose }) {
  if (!order) return null;
  const items = getOrderItems(order);
  const total = getOrderTotal(order);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#00163B]/45 p-4" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#E8EBEF] pb-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#20365A]">الفاتورة</h2>
            <p className="mt-1 text-[11px] font-semibold text-[#173A6B]" dir="ltr">{order.invoice?.invoice_number || order.order_number}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7A818D] hover:bg-[#F3F5F8]">
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-[#FAFBFC] p-4 text-[11px] sm:grid-cols-2">
          <div><span className="text-[#8A9099]">المورد:</span> <span className="font-semibold text-[#40516C]">{getSupplierName(order)}</span></div>
          <div><span className="text-[#8A9099]">التاريخ:</span> <span className="font-semibold text-[#40516C]">{formatDate(order.created_at)}</span></div>
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
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[#ECEEF1]">
                  <td className="px-3 py-3 font-semibold text-[#40516C]">{item.product?.name || item.name}</td>
                  <td className="px-3 py-3 text-center">{item.quantity}</td>
                  <td className="px-3 py-3 text-center">₪ {Number(item.price || 0).toFixed(2)}</td>
                  <td className="px-3 py-3 text-center font-bold text-[#173A6B]">₪ {(item.quantity * Number(item.price || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mr-auto mt-5 max-w-[280px] border-t border-[#E8EBEF] pt-4 text-[11px]">
          <div className="flex justify-between gap-4 pt-2 text-[14px] font-bold text-[#20365A]">
            <span>الإجمالي</span>
            <span className="text-[#F97316]">₪ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentProofModal({ order, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const handleUpload = async () => {
    if (!file || !order?.invoice?.id) return;
    setUploading(true);
    setError("");
    try {
      await invoiceService.uploadPaymentProof(order.invoice.id, file);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "فشل رفع إثبات الدفع");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const platformAccount = {
    bankName: "بنك فلسطين",
    accountHolder: "منصة طلباتي B2B",
    accountNumber: "4012-7890-0056-3201",
    iban: "PS92PALS000000004012789000563201",
    branch: "الفرع الرئيسي - غزة",
  };

  const total = order?.invoice?.total_amount || order?.total_price || 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#00163B]/45 p-4" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-[16px] font-bold text-[#20365A]">رفع إثبات دفع</h2>
        <p className="mt-1 text-[11px] text-[#7A818D]">طلب رقم {order?.order_number}</p>

        <div className="mt-4 rounded-xl border border-[#E8F5E9] bg-[#F1F8F2] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="h-4 w-4 text-[#2E7D32]" />
            <h3 className="text-[13px] font-bold text-[#2E7D32]">بيانات حساب المنصة</h3>
          </div>
          <p className="text-[10px] text-[#5A7A5E] mb-3">قم بتحويل المبلغ إلى الحساب التالي ثم ارفق إثبات الدفع</p>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <div>
                <span className="text-[9px] text-[#9AA0AA] block">اسم البنك</span>
                <span className="text-[12px] font-semibold text-[#20365A]">{platformAccount.bankName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <div>
                <span className="text-[9px] text-[#9AA0AA] block">صاحب الحساب</span>
                <span className="text-[12px] font-semibold text-[#20365A]">{platformAccount.accountHolder}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <div>
                <span className="text-[9px] text-[#9AA0AA] block">رقم الحساب</span>
                <span className="text-[12px] font-semibold text-[#20365A] font-mono tracking-wide">{platformAccount.accountNumber}</span>
              </div>
              <button type="button" onClick={() => copyToClipboard(platformAccount.accountNumber, "account")} className="p-1 rounded hover:bg-[#F0F0F0] transition">
                <Copy className="h-3.5 w-3.5 text-[#7A818D]" />
              </button>
            </div>
            {copied === "account" && <span className="text-[9px] text-green-600 mr-2">تم النسخ!</span>}

            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <div>
                <span className="text-[9px] text-[#9AA0AA] block">IBAN</span>
                <span className="text-[11px] font-semibold text-[#20365A] font-mono tracking-wide">{platformAccount.iban}</span>
              </div>
              <button type="button" onClick={() => copyToClipboard(platformAccount.iban, "iban")} className="p-1 rounded hover:bg-[#F0F0F0] transition">
                <Copy className="h-3.5 w-3.5 text-[#7A818D]" />
              </button>
            </div>
            {copied === "iban" && <span className="text-[9px] text-green-600 mr-2">تم النسخ!</span>}

            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <div>
                <span className="text-[9px] text-[#9AA0AA] block">الفرع</span>
                <span className="text-[12px] font-semibold text-[#20365A]">{platformAccount.branch}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-[#FFF8F0] border border-[#FFE0B2] px-3 py-2.5">
            <span className="text-[11px] font-semibold text-[#E65100]">المبلغ المطلوب تحويله</span>
            <span className="text-[14px] font-bold text-[#E65100]">₪ {Number(total).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8DDE6] bg-[#FAFBFC] transition hover:border-[#F97316]">
            <Upload className="h-8 w-8 text-[#A0A7B2]" />
            <span className="mt-2 text-[11px] text-[#7A818D]">{file ? file.name : "اضغط لاختيار صورة أو ملف PDF"}</span>
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        {error && <p className="mt-3 text-[11px] text-red-600">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button type="button" disabled={!file || uploading} onClick={handleUpload} className="flex-1 rounded-lg bg-[#F97316] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#EA6B0D] disabled:opacity-50">
            {uploading ? "جاري الرفع..." : "رفع إثبات الدفع"}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-[#D8DDE6] px-4 py-2.5 text-[12px] font-semibold text-[#596579] hover:bg-[#F7F8FA]">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersTable({ orders, selectedOrderId, onSelectOrder }) {
  if (orders.length === 0) {
    return <div className="px-5 py-12 text-center text-[11px] text-[#7A818D]">لا توجد طلبات مطابقة.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[690px] text-right">
        <thead>
          <tr className="bg-[#FAFBFC] text-[9px] font-medium text-[#9AA0AA]">
            <th className="px-4 py-3 text-right">رقم الطلب</th>
            <th className="px-4 py-3 text-right">المورد</th>
            <th className="px-4 py-3 text-center">التاريخ</th>
            <th className="px-4 py-3 text-center">النوع</th>
            <th className="px-4 py-3 text-center">الإجمالي</th>
            <th className="px-4 py-3 text-center">حالة الطلب</th>
            <th className="w-12 px-3 py-3 text-center" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isSelected = selectedOrderId === order.id;
            return (
              <tr key={order.id} onClick={() => onSelectOrder(order)} className={`cursor-pointer border-t border-[#ECEEF1] text-[10px] transition-colors ${isSelected ? "bg-[#FFF5EC]" : "bg-white hover:bg-[#FAFBFC]"}`}>
                <td className="whitespace-nowrap px-4 py-4 font-bold text-[#173A6B]" dir="ltr">{order.order_number}</td>
                <td className="px-4 py-4">
                  <div className="flex min-w-[145px] items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#40577B] text-[9px] font-bold text-white">{getSupplierInitial(order)}</span>
                    <span className="font-medium text-[#40516C]">{getSupplierName(order)}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-[#596579]">
                  <span className="block whitespace-nowrap">{formatDate(order.created_at)}</span>
                  <span className="mt-0.5 block text-[8px] text-[#9AA0AA]">{formatTime(order.created_at)}</span>
                </td>
                <td className="px-4 py-4 text-center text-[#596579]">{order.order_type === "negotiated" ? "تفاوضي" : "مباشر"}</td>
                <td className="whitespace-nowrap px-4 py-4 text-center font-bold text-[#173A6B]">₪ {getOrderTotal(order).toFixed(2)}</td>
                <td className="px-4 py-4 text-center"><StatusBadge status={order.status} /></td>
                <td className="px-3 py-4 text-center">
                  <button type="button" onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7A818D] hover:bg-[#EEF1F5]">
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

function OrdersContent({ initialOrderNumber, successMessage }) {
  const {
    searchValue: topbarSearchValue = "",
    reorderItems,
    orders = [],
    currentOrders = [],
    previousOrders = [],
    loadOrders,
  } = useOutletContext() ?? {};

  const allOrders = useMemo(() => [...currentOrders, ...previousOrders], [currentOrders, previousOrders]);

  const requestedOrder = initialOrderNumber
    ? allOrders.find((o) => o.order_number === initialOrderNumber)
    : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showAllCurrent, setShowAllCurrent] = useState(false);
  const [showAllPrevious, setShowAllPrevious] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(requestedOrder ?? currentOrders[0] ?? previousOrders[0] ?? null);
  const [activeSection, setActiveSection] = useState(
    requestedOrder && previousOrders.some((o) => o.id === requestedOrder?.id) ? "previous" : "current",
  );
  const [reorderMessage, setReorderMessage] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filterOrders = useCallback((list) => {
    const local = searchTerm.trim().toLowerCase();
    const global = topbarSearchValue.trim().toLowerCase();
    return list.filter((order) => {
      const searchable = [order.order_number, getSupplierName(order), getStatusLabel(order.status)].map((v) => String(v ?? "").toLowerCase());
      const matchLocal = !local || searchable.some((v) => v.includes(local));
      const matchGlobal = !global || searchable.some((v) => v.includes(global));
      const matchStatus = !statusFilter || order.status === statusFilter;
      const matchDate = !dateFilter || (order.created_at && order.created_at.startsWith(dateFilter));
      return matchLocal && matchGlobal && matchStatus && matchDate;
    });
  }, [searchTerm, topbarSearchValue, statusFilter, dateFilter]);

  const filteredCurrent = useMemo(() => filterOrders(currentOrders), [filterOrders, currentOrders]);
  const filteredPrevious = useMemo(() => filterOrders(previousOrders), [filterOrders, previousOrders]);
  const visibleCurrent = showAllCurrent ? filteredCurrent : filteredCurrent.slice(0, 4);
  const visiblePrevious = showAllPrevious ? filteredPrevious : filteredPrevious.slice(0, 3);

  const goToSection = (section) => {
    setActiveSection(section);
    setReorderMessage("");
    const source = section === "current" ? filteredCurrent : filteredPrevious;
    setSelectedOrder(source[0] ?? null);
  };

  const handleAction = async (action, order) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (action === "cancel") {
        const reason = prompt("سبب الإلغاء (اختياري):");
        await storeOrderService.cancelOrder(order.id, reason || undefined);
      } else if (action === "accept_offer") {
        await storeOrderService.acceptOffer(order.id);
      } else if (action === "reject_offer") {
        await storeOrderService.rejectOffer(order.id);
      } else if (action === "confirm_delivery") {
        await storeOrderService.confirmDelivery(order.id);
      } else if (action === "upload_proof") {
        setPaymentOrder(order);
        setActionLoading(false);
        return;
      } else if (action === "open_chat") {
        // TODO: open negotiation chat modal
        setActionLoading(false);
        return;
      }
      await loadOrders?.();
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReorder = async (order) => {
    if (typeof reorderItems !== "function") {
      setReorderMessage("تعذر الوصول إلى السلة.");
      return;
    }
    const items = getOrderItems(order).map((i) => ({ productId: i.product_id, product_id: i.product_id, quantity: i.quantity }));
    const result = await reorderItems(items);
    if (!result || result.addedCount === 0) {
      setReorderMessage("لم تتم إضافة منتجات لأن الأصناف غير متوفرة.");
    } else if (result.unavailableCount > 0) {
      setReorderMessage(`تم إضافة ${result.addedCount} صنف للسلة، وتعذر إضافة ${result.unavailableCount} صنف غير متوفر.`);
    } else {
      setReorderMessage(`تم إضافة ${result.addedCount} صنف للسلة.`);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter("");
  };

  return (
    <>
      <section dir="rtl" className="min-h-full bg-white px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto w-full max-w-[1320px]">
          <header className="mb-5">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-[#B8793C]" strokeWidth={1.8} />
              <h1 className="text-[22px] font-bold text-[#062454] sm:text-[25px]">طلبات المتجر</h1>
            </div>
            <p className="mt-1.5 text-[11px] text-[#7A818D]">تابع طلباتك الحالية والسابقة بسهولة</p>
          </header>

          {successMessage && (
            <div className="mb-5 rounded-xl border border-[#BFE3CC] bg-[#F0FAF4] px-4 py-3 text-[11px] font-medium text-[#16834B]">{successMessage}</div>
          )}

          <div className="mb-6 flex items-end gap-6 border-b border-[#E6E9ED]">
            <button type="button" onClick={() => goToSection("current")} className={`border-b-2 px-2 pb-3 text-[12px] font-semibold transition-colors ${activeSection === "current" ? "border-[#F97316] text-[#F97316]" : "border-transparent text-[#8A9099] hover:text-[#596579]"}`}>
              الطلبات الحالية ({filteredCurrent.length})
            </button>
            <button type="button" onClick={() => goToSection("previous")} className={`border-b-2 px-2 pb-3 text-[12px] font-semibold transition-colors ${activeSection === "previous" ? "border-[#F97316] text-[#F97316]" : "border-transparent text-[#8A9099] hover:text-[#596579]"}`}>
              الطلبات السابقة ({filteredPrevious.length})
            </button>
          </div>

          <SummaryCards orders={allOrders} />

          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#ECEEF1] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.02)] lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9099]" strokeWidth={1.8} />
              <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث برقم الطلب أو اسم المورد..." className="h-11 w-full rounded-lg border border-[#E0E3E7] bg-[#FAFBFC] pr-10 pl-10 text-[11px] text-[#40516C] outline-none placeholder:text-[#A0A7B2] focus:border-[#AEB9C8] focus:bg-white" />
            </div>

            <div className="relative w-full lg:w-[170px]">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 w-full appearance-none rounded-lg border border-[#E0E3E7] bg-[#FAFBFC] pr-4 pl-9 text-[11px] font-medium text-[#596579] outline-none focus:border-[#AEB9C8]">
                <option value="">كل الحالات</option>
                {ORDER_STATUS_LIST.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9099]" strokeWidth={1.8} />
            </div>

            <label className="relative block w-full lg:w-[170px]">
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A7B2]" strokeWidth={1.8} />
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-11 w-full rounded-lg border border-[#E0E3E7] bg-[#FAFBFC] pr-10 pl-3 text-[10px] text-[#596579] outline-none focus:border-[#AEB9C8]" />
            </label>

            {(searchTerm || statusFilter || dateFilter) && (
              <button type="button" onClick={resetFilters} className="h-11 rounded-lg border border-[#E0E3E7] bg-white px-4 text-[10px] font-semibold text-[#596579] hover:bg-[#F7F8FA]">مسح</button>
            )}
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start" dir="ltr">
            <div className="min-w-0 xl:sticky xl:top-5" dir="rtl">
              <OrderDetails order={selectedOrder} onReorder={handleReorder} onViewInvoice={setInvoiceOrder} onAction={handleAction} reorderMessage={reorderMessage} />
            </div>

            <section className="min-w-0 overflow-hidden rounded-xl border border-[#E6E9ED] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.03)]" dir="rtl">
              <div className="flex items-center justify-between gap-3 border-b border-[#ECEEF1] px-5 py-5">
                <h2 className="text-[16px] font-bold text-[#20365A]">{activeSection === "current" ? "الطلبات الحالية" : "الطلبات السابقة"}</h2>
                <span className="text-[9px] text-[#8A9099]">{activeSection === "current" ? filteredCurrent.length : filteredPrevious.length} طلب</span>
              </div>

              <OrdersTable
                orders={activeSection === "current" ? visibleCurrent : visiblePrevious}
                selectedOrderId={selectedOrder?.id}
                onSelectOrder={(order) => { setSelectedOrder(order); setReorderMessage(""); }}
              />

              {activeSection === "current" && filteredCurrent.length > 4 && (
                <div className="border-t border-[#ECEEF1] px-5 py-3">
                  <button type="button" onClick={() => setShowAllCurrent((c) => !c)} className="flex min-h-9 w-full items-center justify-center gap-1 rounded-lg bg-[#FAFBFC] text-[10px] font-semibold text-[#4677C5] hover:bg-[#F3F5F8]">
                    {showAllCurrent ? "عرض أقل" : "عرض الكل"} <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              )}
              {activeSection === "previous" && filteredPrevious.length > 3 && (
                <div className="border-t border-[#ECEEF1] px-5 py-3">
                  <button type="button" onClick={() => setShowAllPrevious((c) => !c)} className="flex min-h-9 w-full items-center justify-center gap-1 rounded-lg bg-[#FAFBFC] text-[10px] font-semibold text-[#4677C5] hover:bg-[#F3F5F8]">
                    {showAllPrevious ? "عرض أقل" : "عرض الكل"} <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      {paymentOrder && <PaymentProofModal order={paymentOrder} onClose={() => setPaymentOrder(null)} onSuccess={() => loadOrders?.()} />}
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
