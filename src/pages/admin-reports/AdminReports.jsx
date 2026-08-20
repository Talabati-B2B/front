import { useMemo, useState } from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const MONTHS = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو"];

const reportRecords = [
  {
    id: 1,
    reference: "INV-2026-001",
    month: "يناير",
    date: "2026-01-12",
    entity: "شركة النور للتجارة",
    entityType: "مورد",
    region: "الرياض",
    status: "مكتمل",
    orders: 72,
    sales: 1440,
    paidInvoices: 8,
    users: 14,
  },
  {
    id: 2,
    reference: "INV-2026-002",
    month: "يناير",
    date: "2026-01-18",
    entity: "متجر الأمل",
    entityType: "متجر",
    region: "جدة",
    status: "قيد المعالجة",
    orders: 36,
    sales: 720,
    paidInvoices: 0,
    users: 7,
  },
  {
    id: 3,
    reference: "INV-2026-003",
    month: "يناير",
    date: "2026-01-25",
    entity: "شركة البركة",
    entityType: "مورد",
    region: "الدمام",
    status: "ملغي",
    orders: 12,
    sales: 240,
    paidInvoices: 0,
    users: 3,
  },
  {
    id: 4,
    reference: "INV-2026-004",
    month: "فبراير",
    date: "2026-02-09",
    entity: "متجر الوفاء",
    entityType: "متجر",
    region: "جدة",
    status: "مكتمل",
    orders: 108,
    sales: 1680,
    paidInvoices: 11,
    users: 18,
  },
  {
    id: 5,
    reference: "INV-2026-005",
    month: "فبراير",
    date: "2026-02-16",
    entity: "شركة النور للتجارة",
    entityType: "مورد",
    region: "الرياض",
    status: "قيد المعالجة",
    orders: 54,
    sales: 840,
    paidInvoices: 0,
    users: 9,
  },
  {
    id: 6,
    reference: "INV-2026-006",
    month: "فبراير",
    date: "2026-02-22",
    entity: "شركة البركة",
    entityType: "مورد",
    region: "الدمام",
    status: "ملغي",
    orders: 18,
    sales: 280,
    paidInvoices: 0,
    users: 3,
  },
  {
    id: 7,
    reference: "INV-2026-007",
    month: "مارس",
    date: "2026-03-07",
    entity: "شركة البركة",
    entityType: "مورد",
    region: "الدمام",
    status: "مكتمل",
    orders: 132,
    sales: 1860,
    paidInvoices: 13,
    users: 19,
  },
  {
    id: 8,
    reference: "INV-2026-008",
    month: "مارس",
    date: "2026-03-14",
    entity: "متجر الأمل",
    entityType: "متجر",
    region: "الرياض",
    status: "قيد المعالجة",
    orders: 66,
    sales: 930,
    paidInvoices: 0,
    users: 10,
  },
  {
    id: 9,
    reference: "INV-2026-009",
    month: "مارس",
    date: "2026-03-26",
    entity: "متجر الوفاء",
    entityType: "متجر",
    region: "جدة",
    status: "ملغي",
    orders: 22,
    sales: 310,
    paidInvoices: 0,
    users: 3,
  },
  {
    id: 10,
    reference: "INV-2026-010",
    month: "إبريل",
    date: "2026-04-05",
    entity: "متجر الأمل",
    entityType: "متجر",
    region: "جدة",
    status: "مكتمل",
    orders: 120,
    sales: 1740,
    paidInvoices: 14,
    users: 22,
  },
  {
    id: 11,
    reference: "INV-2026-011",
    month: "إبريل",
    date: "2026-04-17",
    entity: "شركة البركة",
    entityType: "مورد",
    region: "الدمام",
    status: "قيد المعالجة",
    orders: 60,
    sales: 870,
    paidInvoices: 0,
    users: 11,
  },
  {
    id: 12,
    reference: "INV-2026-012",
    month: "إبريل",
    date: "2026-04-24",
    entity: "شركة النور للتجارة",
    entityType: "مورد",
    region: "الرياض",
    status: "ملغي",
    orders: 20,
    sales: 290,
    paidInvoices: 0,
    users: 3,
  },
  {
    id: 13,
    reference: "INV-2026-013",
    month: "مايو",
    date: "2026-05-06",
    entity: "شركة النور للتجارة",
    entityType: "مورد",
    region: "الرياض",
    status: "مكتمل",
    orders: 168,
    sales: 2160,
    paidInvoices: 22,
    users: 26,
  },
  {
    id: 14,
    reference: "INV-2026-014",
    month: "مايو",
    date: "2026-05-15",
    entity: "متجر الوفاء",
    entityType: "متجر",
    region: "جدة",
    status: "قيد المعالجة",
    orders: 84,
    sales: 1080,
    paidInvoices: 0,
    users: 13,
  },
  {
    id: 15,
    reference: "INV-2026-015",
    month: "مايو",
    date: "2026-05-28",
    entity: "شركة البركة",
    entityType: "مورد",
    region: "الدمام",
    status: "ملغي",
    orders: 28,
    sales: 360,
    paidInvoices: 0,
    users: 5,
  },
  {
    id: 16,
    reference: "INV-2026-016",
    month: "يونيو",
    date: "2026-06-08",
    entity: "متجر الوفاء",
    entityType: "متجر",
    region: "جدة",
    status: "مكتمل",
    orders: 150,
    sales: 1692,
    paidInvoices: 18,
    users: 23,
  },
  {
    id: 17,
    reference: "INV-2026-017",
    month: "يونيو",
    date: "2026-06-19",
    entity: "شركة النور للتجارة",
    entityType: "مورد",
    region: "الرياض",
    status: "قيد المعالجة",
    orders: 75,
    sales: 846,
    paidInvoices: 0,
    users: 11,
  },
  {
    id: 18,
    reference: "INV-2026-018",
    month: "يونيو",
    date: "2026-06-27",
    entity: "شركة البركة",
    entityType: "مورد",
    region: "الدمام",
    status: "ملغي",
    orders: 25,
    sales: 282,
    paidInvoices: 0,
    users: 4,
  },
];

const statusMeta = {
  مكتمل: { color: "#45D483", soft: "bg-[#ECFBF2]", text: "text-[#169447]" },
  "قيد المعالجة": {
    color: "#5CA7F5",
    soft: "bg-[#EEF6FF]",
    text: "text-[#2E73D5]",
  },
  ملغي: { color: "#F46C6C", soft: "bg-[#FFF0F0]", text: "text-[#D43B3B]" },
};

const trendByMetric = {
  paidInvoices: "+15%",
  users: "+8%",
  sales: "+18%",
  orders: "+12%",
};

const performanceCompletionRate = 92;

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function StatCard({ label, value, trend, icon: Icon, iconClass }) {
  return (
    <article className="rounded-xl border border-[#D8DCE2] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="text-right">
          <p className="text-[14px] font-bold text-[#171A1F]">{label}</p>
          <p className="mt-1.5 text-[24px] font-bold leading-none text-[#05070A]">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClass}`}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 text-[11px] text-[#8A8D95]">
        <span className="font-bold text-[#18A54A]">{trend}</span> عن الشهر
        الماضي
      </p>
    </article>
  );
}

function FilterSelect({ label, value, onChange, children, icon: Icon }) {
  return (
    <label className="min-w-0 flex-1">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#4E525A]">
        {label}
      </span>
      <span className="relative flex h-11 items-center rounded-xl border border-[#CDD1D7] bg-white">
        {Icon ? (
          <Icon
            size={17}
            className="pointer-events-none absolute right-3 text-[#777B84]"
            aria-hidden="true"
          />
        ) : null}
        <select
          value={value}
          onChange={onChange}
          className={`h-full w-full appearance-none bg-transparent text-[12px] text-[#555A63] outline-none ${
            Icon ? "pr-10" : "pr-4"
          } pl-9`}
        >
          {children}
        </select>
        <FiChevronDown
          size={17}
          className="pointer-events-none absolute left-3 text-[#777B84]"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}

function OrdersStatusCard({ statusCounts, totalOrders }) {
  const entries = Object.entries(statusMeta).map(([status, meta]) => {
    const count = statusCounts[status] ?? 0;
    const percentage = totalOrders
      ? Math.round((count / totalOrders) * 100)
      : 0;
    return { status, count, percentage, ...meta };
  });

  let cursor = 0;
  const gradientParts = entries.map((entry) => {
    const start = cursor;
    cursor += entry.percentage;
    return `${entry.color} ${start}% ${cursor}%`;
  });

  return (
    <section className="rounded-xl border border-[#E0E3E8] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.05)]">
      <h2 className="text-[14px] font-bold text-[#17365F]">حالة الطلبات</h2>

      {totalOrders ? (
        <>
          <div className="mx-auto mt-6 flex w-full justify-center">
            <div
              className="relative flex h-[190px] w-[190px] items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${gradientParts.join(",")})`,
              }}
            >
              <div className="flex h-[134px] w-[134px] flex-col items-center justify-center rounded-full bg-white">
                <strong className="text-[20px] font-bold text-[#062454]">
                  {formatNumber(totalOrders)}
                </strong>
                <span className="mt-1 text-[10px] text-[#777B84]">
                  إجمالي الطلبات
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.status}
                className={`flex items-center justify-between rounded-xl border border-current/10 px-4 py-3 ${entry.soft} ${entry.text}`}
              >
                <span className="flex items-center gap-2 text-[12px] font-medium">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.status}
                </span>
                <strong className="text-[13px]">
                  {formatNumber(entry.count)} ({entry.percentage}%)
                </strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-[350px] items-center justify-center text-center text-[12px] text-[#8A8D95]">
          لا توجد بيانات طلبات مطابقة للفلاتر الحالية.
        </div>
      )}
    </section>
  );
}

function MonthlyOrdersChart({ monthlyData }) {
  const hasData = monthlyData.some((item) => item.orders > 0 || item.sales > 0);

  if (!hasData) {
    return (
      <section className="rounded-xl border border-[#E0E3E8] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.05)]">
        <h2 className="text-[14px] font-bold text-[#17365F]">
          تقرير الطلبات الشهري
        </h2>
        <div className="flex min-h-[350px] items-center justify-center text-center text-[12px] text-[#8A8D95]">
          لا توجد بيانات شهرية مطابقة للفلاتر الحالية.
        </div>
      </section>
    );
  }

  const maxOrders = Math.max(...monthlyData.map((item) => item.orders), 1);
  const maxSales = Math.max(...monthlyData.map((item) => item.sales), 1);
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 55;
  const paddingTop = 20;
  const paddingBottom = 45;
  const usableHeight = chartHeight - paddingTop - paddingBottom;
  const step = (chartWidth - paddingX * 2) / Math.max(monthlyData.length, 1);
  const barWidth = Math.min(36, step * 0.35);

  const points = monthlyData
    .map((item, index) => {
      const x = paddingX + step * index + step / 2;
      const y =
        paddingTop + usableHeight - (item.orders / maxOrders) * usableHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="min-w-0 rounded-xl border border-[#E0E3E8] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[14px] font-bold text-[#17365F]">
          تقرير الطلبات الشهري
        </h2>
        <span className="flex items-center gap-2 text-[10px] text-[#676B73]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#062454]" />
          الطلبات
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[310px] min-w-[620px] w-full"
          role="img"
          aria-label="رسم بياني للطلبات والمبيعات الشهرية"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + usableHeight - ratio * usableHeight;
            return (
              <line
                key={ratio}
                x1={paddingX}
                x2={chartWidth - paddingX}
                y1={y}
                y2={y}
                stroke="#E5E8EC"
                strokeWidth="1"
                strokeDasharray={ratio === 0 ? "0" : "7 8"}
              />
            );
          })}

          {monthlyData.map((item, index) => {
            const x = paddingX + step * index + step / 2;
            const barHeight = (item.sales / maxSales) * usableHeight;
            const barY = paddingTop + usableHeight - barHeight;

            return (
              <g key={item.month}>
                <rect
                  x={x - barWidth / 2}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  fill="#0B5C9E"
                />
                <text
                  x={x}
                  y={chartHeight - 15}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6E727A"
                >
                  {item.month}
                </text>
              </g>
            );
          })}

          <polyline
            points={points}
            fill="none"
            stroke="#D6E6FB"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {monthlyData.map((item, index) => {
            const x = paddingX + step * index + step / 2;
            const y =
              paddingTop +
              usableHeight -
              (item.orders / maxOrders) * usableHeight;
            return (
              <circle
                key={`point-${item.month}`}
                cx={x}
                cy={y}
                r="8"
                fill="white"
                stroke="#5598E7"
                strokeWidth="5"
              />
            );
          })}
        </svg>
      </div>
    </section>
  );
}

export default function AdminReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [monthFilter, setMonthFilter] = useState("الكل");
  const [entityFilter, setEntityFilter] = useState("الكل");

  const entities = useMemo(
    () => [...new Set(reportRecords.map((record) => record.entity))],
    [],
  );

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reportRecords.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        record.reference.toLowerCase().includes(normalizedSearch) ||
        record.entity.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "الكل" || record.status === statusFilter;
      const matchesMonth =
        monthFilter === "الكل" || record.month === monthFilter;
      const matchesEntity =
        entityFilter === "الكل" || record.entity === entityFilter;

      return matchesSearch && matchesStatus && matchesMonth && matchesEntity;
    });
  }, [entityFilter, monthFilter, searchTerm, statusFilter]);

  const totals = useMemo(
    () =>
      filteredRecords.reduce(
        (accumulator, record) => ({
          orders: accumulator.orders + record.orders,
          sales: accumulator.sales + record.sales,
          paidInvoices: accumulator.paidInvoices + record.paidInvoices,
          users: accumulator.users + record.users,
        }),
        { orders: 0, sales: 0, paidInvoices: 0, users: 0 },
      ),
    [filteredRecords],
  );

  const statusCounts = useMemo(
    () =>
      filteredRecords.reduce((accumulator, record) => {
        accumulator[record.status] =
          (accumulator[record.status] ?? 0) + record.orders;
        return accumulator;
      }, {}),
    [filteredRecords],
  );

  const monthlyData = useMemo(
    () =>
      MONTHS.map((month) => {
        const monthRecords = filteredRecords.filter(
          (record) => record.month === month,
        );
        return {
          month,
          orders: monthRecords.reduce((sum, record) => sum + record.orders, 0),
          sales: monthRecords.reduce((sum, record) => sum + record.sales, 0),
        };
      }).filter((item) => monthFilter === "الكل" || item.month === monthFilter),
    [filteredRecords, monthFilter],
  );

  const regionSummary = useMemo(() => {
    const regionTotals = filteredRecords.reduce((accumulator, record) => {
      accumulator[record.region] =
        (accumulator[record.region] ?? 0) + record.orders;
      return accumulator;
    }, {});

    const sortedRegions = Object.entries(regionTotals).sort(
      (a, b) => b[1] - a[1],
    );
    const [region = "—", orders = 0] = sortedRegions[0] ?? [];
    const percentage = totals.orders
      ? Math.round((orders / totals.orders) * 100)
      : 0;

    return { region, percentage };
  }, [filteredRecords, totals.orders]);

  const bestMonth = useMemo(() => {
    const candidates = monthlyData.filter((item) => item.orders || item.sales);
    if (!candidates.length) {
      return "—";
    }

    return [...candidates].sort(
      (a, b) => b.orders + b.sales / 100 - (a.orders + a.sales / 100),
    )[0].month;
  }, [monthlyData]);

  const hasData = filteredRecords.length > 0;

  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <header>
          <h1 className="text-[23px] font-bold text-[#062454]">التقارير</h1>
          <p className="mt-2 text-[13px] text-[#666B74]">
            تابع أداء المنصة و الموردين و الطلبات من مكان واحد
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="الفواتير المدفوعة"
            value={formatNumber(totals.paidInvoices)}
            trend={trendByMetric.paidInvoices}
            icon={FiCheckCircle}
            iconClass="bg-[#DCF7E4] text-[#23A84E]"
          />
          <StatCard
            label="عدد المستخدمون"
            value={formatNumber(totals.users)}
            trend={trendByMetric.users}
            icon={FiUsers}
            iconClass="bg-[#F0E1FA] text-[#9A56CE]"
          />
          <StatCard
            label="إجمالي المبيعات"
            value={formatNumber(totals.sales)}
            trend={trendByMetric.sales}
            icon={FiDollarSign}
            iconClass="bg-[#DFF2F5] text-[#277D8B]"
          />
          <StatCard
            label="إجمالي الطلبات"
            value={formatNumber(totals.orders)}
            trend={trendByMetric.orders}
            icon={FiShoppingCart}
            iconClass="bg-[#FFF0E4] text-[#F2762E]"
          />
        </div>

        <section className="rounded-2xl border border-[#D9DDE3] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1.35fr_0.8fr_0.9fr_0.9fr] xl:items-end">
            <label className="min-w-0">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#4E525A]">
                البحث
              </span>
              <span className="relative flex h-11 items-center rounded-xl border border-[#CDD1D7] bg-white">
                <FiSearch
                  size={18}
                  className="pointer-events-none absolute right-3 text-[#8A8D95]"
                  aria-hidden="true"
                />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="البحث برقم الفاتورة..."
                  className="h-full w-full rounded-xl bg-transparent pr-10 pl-4 text-[12px] text-[#343840] outline-none placeholder:text-[#B2B5BA]"
                />
              </span>
            </label>

            <FilterSelect
              label="الحالة"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="الكل">كل الحالات</option>
              <option value="مكتمل">مكتمل</option>
              <option value="قيد المعالجة">قيد المعالجة</option>
              <option value="ملغي">ملغي</option>
            </FilterSelect>

            <FilterSelect
              label="التاريخ"
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
              icon={FiCalendar}
            >
              <option value="الكل">اختر الفترة</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month} 2026
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              label="الجهة"
              value={entityFilter}
              onChange={(event) => setEntityFilter(event.target.value)}
              icon={FiBarChart2}
            >
              <option value="الكل">كل الجهات</option>
              {entities.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </FilterSelect>
          </div>
        </section>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-4">
          <div className="min-w-0 xl:col-span-3 [&>section]:h-full">
            <MonthlyOrdersChart monthlyData={monthlyData} />
          </div>

          <div className="min-w-0 xl:col-span-1 [&>section]:h-full">
            <OrdersStatusCard
              statusCounts={statusCounts}
              totalOrders={totals.orders}
            />
          </div>
        </div>

        <section className="rounded-xl border border-[#E0E3E8] bg-white px-5 py-5 shadow-[0_1px_4px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#E8EAEE] pb-4">
            <div className="flex items-center gap-2 text-[#17365F]">
              <FiBarChart2 size={18} aria-hidden="true" />
              <h2 className="text-[14px] font-bold">ملخص الأداء</h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-[#17365F]"
              aria-label="عرض التفاصيل"
            >
              عرض التفاصيل
              <FiChevronLeft size={17} aria-hidden="true" />
            </button>
          </div>

          {hasData ? (
            <div className="grid grid-cols-1 divide-y divide-[#ECEEF1] pt-5 md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-y-0">
              <div className="flex items-center justify-center gap-4 px-5 py-4 md:py-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F3F6] text-[#062454]">
                  <FiCheckCircle size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] text-[#777B84]">معدل الإنجاز</p>
                  <p className="mt-1 text-[18px] font-bold text-[#111827]">
                    {performanceCompletionRate}%
                  </p>
                  <div className="mt-2 h-2 w-28 overflow-hidden rounded-full bg-[#E9ECF0]">
                    <div
                      className="h-full rounded-full bg-[#062454]"
                      style={{ width: `${performanceCompletionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 px-5 py-4 md:py-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0E5] text-[#F2762E]">
                  <FiMapPin size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] text-[#777B84]">
                    أكثر منطقة نشاطاً
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {regionSummary.region}
                  </p>
                  <p className="mt-1 text-[10px] text-[#8A8D95]">
                    {regionSummary.percentage}% من إجمالي الطلبات
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 px-5 py-4 md:py-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFAF1] text-[#16A34A]">
                  <FiTrendingUp size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] text-[#777B84]">أفضل شهر</p>
                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {bestMonth}
                  </p>
                  <p className="mt-1 text-[10px] text-[#8A8D95]">
                    أعلى عدد طلبات ومبيعات
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[150px] items-center justify-center text-center text-[12px] text-[#8A8D95]">
              لا توجد بيانات أداء مطابقة للفلاتر الحالية.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
