import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiEye,
  FiFileText,
  FiSearch,
  FiX,
  FiXCircle,
} from "react-icons/fi";

const PAGE_SIZE = 8;

const visibleInvoices = [
  {
    id: 1,
    number: "INV-2026-1087",
    entity: "شركة النور للتجارة",
    date: "2026-07-20",
    amount: 12750,
    status: "مدفوعة",
    paymentMethod: "تحويل بنكي",
  },
  {
    id: 2,
    number: "INV-2026-1086",
    entity: "مؤسسة البناء الحديث",
    date: "2026-07-15",
    amount: 8250,
    status: "متأخر",
    paymentMethod: "تحويل بنكي",
  },
  {
    id: 3,
    number: "INV-2026-1085",
    entity: "شركة التقنية المتقدمة",
    date: "2026-07-15",
    amount: 15600,
    status: "مدفوعة",
    paymentMethod: "بطاقة ائتمانية",
  },
  {
    id: 4,
    number: "INV-2026-1084",
    entity: "مؤسسة الواحة",
    date: "2026-07-10",
    amount: 6320,
    status: "متأخر",
    paymentMethod: "تحويل بنكي",
  },
  {
    id: 5,
    number: "INV-2026-1083",
    entity: "شركة الأفق",
    date: "2026-07-05",
    amount: 22400,
    status: "قيد الانتظار",
    paymentMethod: "تحويل بنكي",
  },
  {
    id: 6,
    number: "INV-2026-1082",
    entity: "مؤسسة الإبداع",
    date: "2026-07-03",
    amount: 9870,
    status: "مدفوعة",
    paymentMethod: "بطاقة ائتمانية",
  },
  {
    id: 7,
    number: "INV-2026-1081",
    entity: "شركة المستقبل",
    date: "2026-07-02",
    amount: 11300,
    status: "قيد الانتظار",
    paymentMethod: "تحويل بنكي",
  },
  {
    id: 8,
    number: "INV-2026-1080",
    entity: "مؤسسة الريادة",
    date: "2026-07-01",
    amount: 7450,
    status: "قيد الانتظار",
    paymentMethod: "بطاقة ائتمانية",
  },
];

const extraEntities = [
  "شركة البركة التجارية",
  "متجر الأمل",
  "مخازن الخير",
  "شركة الإمداد",
  "مؤسسة اليسر",
  "متجر الوفاء",
  "شركة الصفاء",
  "مؤسسة النخبة",
];

const paymentMethods = ["تحويل بنكي", "بطاقة ائتمانية"];

function buildMockInvoices() {
  const remainingStatuses = [
    ...Array.from({ length: 83 }, () => "مدفوعة"),
    ...Array.from({ length: 11 }, () => "قيد الانتظار"),
    ...Array.from({ length: 6 }, () => "متأخر"),
  ];

  const extraInvoices = remainingStatuses.map((status, index) => {
    const sequence = 1079 - index;
    const monthIndex = index % 3;
    const month = monthIndex === 0 ? 7 : monthIndex === 1 ? 6 : 5;
    const day = (index % 27) + 1;

    return {
      id: index + 9,
      number: `INV-2026-${sequence}`,
      entity: extraEntities[index % extraEntities.length],
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      amount: 4200 + ((index * 1375) % 24500),
      status,
      paymentMethod: paymentMethods[index % paymentMethods.length],
    };
  });

  return [...visibleInvoices, ...extraInvoices];
}

const initialInvoices = buildMockInvoices();

const statusStyles = {
  مدفوعة: {
    badge: "bg-[#DCF6E5] text-[#2D9E59]",
    dot: "bg-[#28B463]",
  },
  "قيد الانتظار": {
    badge: "bg-[#FFF0E8] text-[#F2762E]",
    dot: "bg-[#F2762E]",
  },
  متأخر: {
    badge: "bg-[#FDE5E7] text-[#E33845]",
    dot: "bg-[#E33845]",
  },
};

const periodOptions = [
  { value: "الكل", label: "كل الفترات" },
  { value: "2026-07", label: "يوليو 2026" },
  { value: "2026-06", label: "يونيو 2026" },
  { value: "2026-05", label: "مايو 2026" },
];

function formatAmount(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${Number(day)}/${Number(month)}/${year}`;
}

function StatCard({ label, value, icon: Icon, tone }) {
  const tones = {
    total: "border-[#9CC7EA] bg-[#EEF5FD] text-[#0B4F86] icon:bg-[#CBE4F8] icon:text-[#1269A5]",
    paid: "border-[#8BD0A5] bg-[#ECFAF1] text-[#16813D] icon:bg-[#C8EFD6] icon:text-[#1FA052]",
    pending: "border-[#F3B187] bg-[#FFF4ED] text-[#F2762E] icon:bg-[#FFE1CF] icon:text-[#F2762E]",
    late: "border-[#F2A2A8] bg-[#FDEEEF] text-[#D92736] icon:bg-[#FFD6D9] icon:text-[#E23845]",
  };

  const toneClasses = tones[tone].split(" ");
  const cardClasses = toneClasses.filter((item) => !item.startsWith("icon:"));
  const iconClasses = toneClasses
    .filter((item) => item.startsWith("icon:"))
    .map((item) => item.replace("icon:", ""));

  return (
    <article
      className={`flex min-h-[90px] items-center justify-between rounded-xl border px-5 py-4 ${cardClasses.join(" ")}`}
    >
      <div className="text-right">
        <p className="text-[14px] font-bold text-[#171A1F]">{label}</p>
        <p className="mt-1 text-[23px] font-bold leading-none">{value}</p>
      </div>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClasses.join(" ")}`}
      >
        <Icon size={20} aria-hidden="true" />
      </span>
    </article>
  );
}

export default function AdminInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [periodFilter, setPeriodFilter] = useState("الكل");
  const [entityFilter, setEntityFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const totals = useMemo(
    () => ({
      total: initialInvoices.length,
      paid: initialInvoices.filter((invoice) => invoice.status === "مدفوعة").length,
      pending: initialInvoices.filter(
        (invoice) => invoice.status === "قيد الانتظار",
      ).length,
      late: initialInvoices.filter((invoice) => invoice.status === "متأخر").length,
    }),
    [],
  );

  const entityOptions = useMemo(
    () => [...new Set(initialInvoices.map((invoice) => invoice.entity))],
    [],
  );

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return initialInvoices.filter((invoice) => {
      const matchesSearch =
        !normalizedSearch ||
        invoice.number.toLowerCase().includes(normalizedSearch) ||
        invoice.entity.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "الكل" || invoice.status === statusFilter;
      const matchesPeriod =
        periodFilter === "الكل" || invoice.date.startsWith(periodFilter);
      const matchesEntity =
        entityFilter === "الكل" || invoice.entity === entityFilter;

      return matchesSearch && matchesStatus && matchesPeriod && matchesEntity;
    });
  }, [entityFilter, periodFilter, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const selectedInvoice =
    initialInvoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null;

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    resetPage();
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    resetPage();
  };

  const handlePeriodChange = (event) => {
    setPeriodFilter(event.target.value);
    resetPage();
  };

  const handleEntityChange = (event) => {
    setEntityFilter(event.target.value);
    resetPage();
  };

  const handleDownload = (invoice) => {
    const content = [
      `رقم الفاتورة: ${invoice.number}`,
      `الجهة: ${invoice.entity}`,
      `التاريخ: ${formatDate(invoice.date)}`,
      `المبلغ: ${formatAmount(invoice.amount)}`,
      `الحالة: ${invoice.status}`,
      `طريقة الدفع: ${invoice.paymentMethod}`,
    ].join("\n");

    const blob = new Blob([`\uFEFF${content}`], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoice.number}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const shownFrom = filteredInvoices.length ? startIndex + 1 : 0;
  const shownTo = Math.min(startIndex + PAGE_SIZE, filteredInvoices.length);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, Math.min(safeCurrentPage - 2, totalPages - 4));
    return Array.from({ length: 5 }, (_, index) => start + index);
  }, [safeCurrentPage, totalPages]);

  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <header>
          <h1 className="text-[24px] font-bold text-[#00163B] sm:text-[28px]">
            الفواتير
          </h1>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="إجمالي الفواتير"
            value={totals.total}
            icon={FiFileText}
            tone="total"
          />
          <StatCard
            label="المدفوعة"
            value={totals.paid}
            icon={FiCheckCircle}
            tone="paid"
          />
          <StatCard
            label="قيد الانتظار"
            value={totals.pending}
            icon={FiClock}
            tone="pending"
          />
          <StatCard
            label="المتأخرة"
            value={totals.late}
            icon={FiXCircle}
            tone="late"
          />
        </section>

        <section className="rounded-xl border border-[#D4D7DC] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.95fr] lg:items-end">
            <label>
              <span className="sr-only">البحث في الفواتير</span>
              <div className="relative">
                <FiSearch
                  size={19}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#979BA3]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="البحث برقم الفاتورة..."
                  className="h-14 w-full rounded-xl border border-[#C9CDD3] bg-white pr-12 pl-4 text-[12px] text-[#171A1F] outline-none placeholder:text-[#A1A4AA] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                />
              </div>
            </label>

            <label>
              <span className="mb-1.5 block text-center text-[12px] font-bold text-[#171A1F]">
                الحالة
              </span>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="h-12 w-full rounded-xl border border-[#C9CDD3] bg-white px-4 text-[12px] text-[#666A73] outline-none focus:border-[#40577B]"
              >
                <option value="الكل">كل الحالات</option>
                <option value="مدفوعة">مدفوعة</option>
                <option value="قيد الانتظار">قيد الانتظار</option>
                <option value="متأخر">متأخر</option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-center text-[12px] font-bold text-[#171A1F]">
                التاريخ
              </span>
              <select
                value={periodFilter}
                onChange={handlePeriodChange}
                className="h-12 w-full rounded-xl border border-[#C9CDD3] bg-white px-4 text-[12px] text-[#666A73] outline-none focus:border-[#40577B]"
              >
                {periodOptions.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-center text-[12px] font-bold text-[#171A1F]">
                الجهة
              </span>
              <select
                value={entityFilter}
                onChange={handleEntityChange}
                className="h-12 w-full rounded-xl border border-[#C9CDD3] bg-white px-4 text-[12px] text-[#666A73] outline-none focus:border-[#40577B]"
              >
                <option value="الكل">كل الجهات</option>
                {entityOptions.map((entity) => (
                  <option key={entity} value={entity}>
                    {entity}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#CACDD2] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-right">
              <thead>
                <tr className="bg-[#F7F7F8] text-[12px] font-bold text-[#171A1F]">
                  <th className="px-6 py-4">رقم الفاتورة</th>
                  <th className="px-5 py-4">الجهة</th>
                  <th className="px-5 py-4">التاريخ</th>
                  <th className="px-5 py-4">المبلغ</th>
                  <th className="px-5 py-4">الحالة</th>
                  <th className="px-5 py-4">طريقة الدفع</th>
                  <th className="px-5 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {visibleInvoices.length ? (
                  visibleInvoices.map((invoice) => {
                    const style = statusStyles[invoice.status];

                    return (
                      <tr
                        key={invoice.id}
                        className="border-t border-[#DADDE2] text-[12px] text-[#292D33] transition hover:bg-[#FCFCFD]"
                      >
                        <td className="px-6 py-4 font-medium text-[#2774D4]" dir="ltr">
                          {invoice.number}
                        </td>
                        <td className="px-5 py-4 font-medium text-[#171A1F]">
                          {invoice.entity}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4" dir="ltr">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-medium" dir="ltr">
                          {formatAmount(invoice.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex min-w-[100px] items-center justify-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-medium ${style.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                              aria-hidden="true"
                            />
                            {invoice.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          {invoice.paymentMethod}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceId(invoice.id)}
                              className="flex h-10 w-11 items-center justify-center rounded-md border border-[#D4D7DC] bg-white text-[#A0A4AB] transition hover:bg-[#F7F8FA] hover:text-[#40577B]"
                              aria-label={`عرض ${invoice.number}`}
                              title="عرض الفاتورة"
                            >
                              <FiEye size={19} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownload(invoice)}
                              className="flex h-10 w-11 items-center justify-center rounded-md border border-[#D4D7DC] bg-white text-[#A0A4AB] transition hover:bg-[#F7F8FA] hover:text-[#40577B]"
                              aria-label={`تحميل ${invoice.number}`}
                              title="تحميل الفاتورة"
                            >
                              <FiDownload size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <FiFileText
                        size={36}
                        className="mx-auto text-[#AAB0B9]"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-[14px] font-bold text-[#00163B]">
                        لا توجد فواتير
                      </p>
                      <p className="mt-1 text-[12px] text-[#8A8D95]">
                        لا توجد فواتير مطابقة لخيارات البحث والتصفية الحالية.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E5E7EA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[#686C74]">
              عرض {shownFrom}-{shownTo} من أصل {filteredInvoices.length} فاتورة
            </p>

            <div className="flex items-center gap-2" dir="ltr">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#CDD1D7] bg-white text-[#171A1F] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة السابقة"
              >
                <FiChevronLeft size={16} aria-hidden="true" />
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-lg border px-2 text-[11px] font-semibold transition ${
                    page === safeCurrentPage
                      ? "border-[#40577B] bg-[#40577B] text-white"
                      : "border-[#CDD1D7] bg-white text-[#171A1F] hover:bg-[#F6F7F9]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#CDD1D7] bg-white text-[#171A1F] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة التالية"
              >
                <FiChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedInvoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-details-title"
            className="w-full max-w-lg rounded-2xl border border-[#D8DCE2] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="invoice-details-title"
                  className="text-[18px] font-bold text-[#00163B]"
                >
                  تفاصيل الفاتورة
                </h2>
                <p className="mt-1 text-[12px] text-[#7C8088]" dir="ltr">
                  {selectedInvoice.number}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoiceId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8DCE2] text-[#666B73] transition hover:bg-[#F7F8FA]"
                aria-label="إغلاق التفاصيل"
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[10px] text-[#8A8D95]">الجهة</p>
                <p className="mt-1 text-[13px] font-semibold text-[#171A1F]">
                  {selectedInvoice.entity}
                </p>
              </div>
              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[10px] text-[#8A8D95]">التاريخ</p>
                <p className="mt-1 text-[13px] font-semibold text-[#171A1F]" dir="ltr">
                  {formatDate(selectedInvoice.date)}
                </p>
              </div>
              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[10px] text-[#8A8D95]">المبلغ</p>
                <p className="mt-1 text-[13px] font-semibold text-[#171A1F]" dir="ltr">
                  {formatAmount(selectedInvoice.amount)}
                </p>
              </div>
              <div className="rounded-xl bg-[#F7F8FA] p-4">
                <p className="text-[10px] text-[#8A8D95]">طريقة الدفع</p>
                <p className="mt-1 text-[13px] font-semibold text-[#171A1F]">
                  {selectedInvoice.paymentMethod}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E0E3E7] px-4 py-3">
              <span className="text-[11px] font-medium text-[#6B7078]">الحالة</span>
              <span
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-medium ${statusStyles[selectedInvoice.status].badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusStyles[selectedInvoice.status].dot}`}
                  aria-hidden="true"
                />
                {selectedInvoice.status}
              </span>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => handleDownload(selectedInvoice)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#062454] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#0A336D]"
              >
                <FiDownload size={16} aria-hidden="true" />
                تحميل الفاتورة
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
