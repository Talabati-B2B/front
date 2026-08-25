import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  ChevronDown,
  Download,
  Package,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const RANGE_OPTIONS = [
  { value: "7d", label: "آخر 7 أيام" },
  { value: "30d", label: "آخر 30 يوم" },
  { value: "90d", label: "آخر 90 يوم" },
];

const REPORT_DATA = {
  "7d": {
    revenue: "28,740",
    orders: "286",
    activeStores: "31",
    growth: "+4%",
    chart: [8, 16, 22, 29, 34, 42, 48, 52, 58, 63, 69, 72],
  },
  "30d": {
    revenue: "125,450",
    orders: "1,240",
    activeStores: "45",
    growth: "+12%",
    chart: [0, 10, 10, 20, 30, 35, 40, 50, 55, 65, 75, 70],
  },
  "90d": {
    revenue: "342,900",
    orders: "3,480",
    activeStores: "63",
    growth: "+18%",
    chart: [12, 18, 26, 34, 40, 47, 55, 62, 68, 74, 82, 88],
  },
};

const REGION_DATA = [
  { label: "غزة", value: 40, color: "#112A59" },
  { label: "خانيونس", value: 25, color: "#F57A2C" },
  { label: "رفح", value: 15, color: "#0B7285" },
  { label: "شمال غزة", value: 15, color: "#D9D9D9" },
];

const TOP_PRODUCTS = [
  {
    id: 1,
    name: "عصير برتقال طبيعي 1 لتر",
    category: "مشروبات",
    quantity: 420,
    price: 45000,
    status: "متوفر",
  },
  {
    id: 2,
    name: "مجموعة أجبان فاخرة",
    category: "مواد غذائية",
    quantity: 850,
    price: 12400,
    status: "متوفر",
  },
  {
    id: 3,
    name: "أكواب ورقية",
    category: "تغليف",
    quantity: 310,
    price: 28500,
    status: "مخزون منخفض",
  },
];

const STATUS_STYLES = {
  متوفر: "bg-[#DDF8E8] text-[#16834B]",
  "مخزون منخفض": "bg-[#FFF3D6] text-[#9A6A00]",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function SummaryCard({ icon: Icon, label, value, helper, accent, iconClass }) {
  return (
    <article
      className={`min-h-[126px] rounded-[10px] border border-[#D6DBE3] border-t-2 ${accent} bg-white px-5 py-5 shadow-[0_2px_7px_rgba(15,23,42,0.03)]`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-right">
          <p className="text-[14px] font-semibold text-[#4A4F57]">{label}</p>
          <p className="mt-5 text-[26px] font-bold leading-none text-[#062454]">{value}</p>
          {helper ? (
            <p className="mt-3 text-[11px] text-[#6F7682]">{helper}</p>
          ) : null}
        </div>

        <Icon className={`mt-1 h-6 w-6 ${iconClass}`} strokeWidth={1.8} aria-hidden="true" />
      </div>
    </article>
  );
}

function buildChart(values) {
  const width = 620;
  const height = 250;
  const left = 36;
  const right = 12;
  const top = 12;
  const bottom = 34;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const points = values.map((value, index) => {
    const x = left + (chartWidth * index) / (values.length - 1);
    const y = top + chartHeight - (value / 100) * chartHeight;
    return [x, y];
  });

  const linePath = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const firstX = points[0][0];
  const lastX = points[points.length - 1][0];
  const baseline = top + chartHeight;
  const areaPath = `${linePath} L ${lastX.toFixed(2)} ${baseline.toFixed(2)} L ${firstX.toFixed(2)} ${baseline.toFixed(2)} Z`;

  return { width, height, left, right, top, bottom, chartHeight, points, linePath, areaPath };
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export default function SupplierReports() {
  const [range, setRange] = useState("30d");
  const [productSearch, setProductSearch] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const report = REPORT_DATA[range];
  const chart = useMemo(() => buildChart(report.chart), [report.chart]);

  const filteredProducts = useMemo(() => {
    const normalized = productSearch.trim().toLowerCase();

    return TOP_PRODUCTS.filter((product) => {
      const matchesSearch =
        normalized === "" ||
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);
      const matchesStatus = statusFilter === "" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [productSearch, statusFilter]);

  const summaryCards = [
    {
      label: "إجمالي الإيرادات",
      value: `${report.revenue} ₪`,
      icon: Banknote,
      accent: "border-t-[#F57A2C]",
      iconClass: "text-[#B85D14]",
    },
    {
      label: "إجمالي الطلبات",
      value: report.orders,
      helper: "طلب",
      icon: ShoppingCart,
      accent: "border-t-[#7AB7C5]",
      iconClass: "text-[#0D7285]",
    },
    {
      label: "المتاجر النشطة",
      value: report.activeStores,
      helper: "متجر",
      icon: Store,
      accent: "border-t-[#8492A8]",
      iconClass: "text-[#253858]",
    },
    {
      label: "معدل النمو",
      value: report.growth,
      helper: "هذا الشهر",
      icon: TrendingUp,
      accent: "border-t-[#F08A82]",
      iconClass: "text-[#16834B]",
    },
  ];

  const handleExport = () => {
    const rangeLabel = RANGE_OPTIONS.find((option) => option.value === range)?.label ?? range;
    const rows = [
      ["الفترة", rangeLabel],
      ["إجمالي الإيرادات", `${report.revenue} ₪`],
      ["إجمالي الطلبات", report.orders],
      ["المتاجر النشطة", report.activeStores],
      ["معدل النمو", report.growth],
      [],
      ["اسم المنتج", "الفئة", "الكمية", "السعر", "الحالة"],
      ...filteredProducts.map((product) => [
        product.name,
        product.category,
        product.quantity,
        product.price,
        product.status,
      ]),
    ];

    const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `supplier-report-${range}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6F8]" dir="rtl">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-6 lg:px-7">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="text-right">
                <h1 className="text-[27px] font-bold text-[#00163B]">التقارير</h1>
                <p className="mt-1 text-[14px] font-medium text-[#333840]">
                  نظرة عامة على الأداء التشغيلي و النمو
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:flex-row-reverse">
                <div className="relative">
                  <select
                    value={range}
                    onChange={(event) => setRange(event.target.value)}
                    aria-label="الفترة الزمنية للتقرير"
                    className="h-11 min-w-[140px] appearance-none rounded-lg border border-[#B8BEC8] bg-[#F8F9FA] py-2 pr-11 pl-9 text-[13px] font-medium text-[#344054] outline-none focus:border-[#40577B]"
                  >
                    {RANGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <CalendarDays
                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#062454]"
                    strokeWidth={1.8}
                  />
                  <ChevronDown
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
                    strokeWidth={2}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FF7420] px-5 text-[13px] font-semibold text-[#111827] transition-colors hover:bg-[#ED6816]"
                >
                  <Download className="h-4 w-4" strokeWidth={2} />
                  <span>تصدير البيانات</span>
                </button>
              </div>
            </div>

            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <SummaryCard key={card.label} {...card} />
              ))}
            </section>

            <section className="mb-6 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(260px,0.78fr)_minmax(0,2fr)]" dir="ltr">
              <article
                dir="rtl"
                className="min-w-0 rounded-[10px] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
              >
                <h2 className="mb-3 text-center text-[16px] font-medium text-[#3D4046]">
                  توزيع الطلبات حسب المنطقة
                </h2>

                <div className="flex justify-center py-2">
                  <div
                    className="h-[245px] w-[245px] max-w-full rounded-full"
                    style={{
                      background:
                        "conic-gradient(#112A59 0deg 151.58deg, #F57A2C 151.58deg 246.32deg, #0B7285 246.32deg 303.16deg, #D9D9D9 303.16deg 360deg)",
                    }}
                    aria-label="مخطط توزيع الطلبات حسب المنطقة"
                    role="img"
                  />
                </div>

                <div className="mt-2 space-y-2.5 px-2">
                  {REGION_DATA.map((region) => (
                    <div key={region.label} className="flex items-center justify-end gap-2 text-[12px] text-[#2D3036]">
                      <span>{region.label} {region.value}%</span>
                      <span
                        className="h-7 w-7 rounded-full"
                        style={{ backgroundColor: region.color }}
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
              </article>

              <article
                dir="rtl"
                className="min-w-0 rounded-[10px] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
              >
                <div className="h-[390px] min-w-0 w-full">
                  <svg
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                    className="h-full w-full"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="مخطط الأداء التشغيلي خلال السنة"
                  >
                    <defs>
                      <linearGradient id="supplierReportsArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6D8EBF" stopOpacity="0.78" />
                        <stop offset="100%" stopColor="#A9BAD2" stopOpacity="0.62" />
                      </linearGradient>
                    </defs>

                    {[0, 20, 40, 60, 80, 100].map((tick) => {
                      const y = chart.top + chart.chartHeight - (tick / 100) * chart.chartHeight;
                      return (
                        <g key={tick}>
                          <line
                            x1={chart.left}
                            x2={chart.width - chart.right}
                            y1={y}
                            y2={y}
                            stroke="#DADDE2"
                            strokeWidth="1"
                          />
                          <text
                            x={chart.left - 8}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#3D4046"
                          >
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    <path d={chart.areaPath} fill="url(#supplierReportsArea)" />
                    <path
                      d={chart.linePath}
                      fill="none"
                      stroke="#2F78EF"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />

                    {MONTHS.map((month, index) => {
                      const x = chart.points[index][0];
                      return (
                        <text
                          key={month}
                          x={x}
                          y={chart.height - 10}
                          textAnchor="middle"
                          fontSize="9.5"
                          fill="#262A30"
                        >
                          {month}
                        </text>
                      );
                    })}

                    <text
                      x="11"
                      y={chart.height / 2}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#596579"
                      transform={`rotate(-90 11 ${chart.height / 2})`}
                    >
                      الطلبات
                    </text>
                  </svg>
                </div>
              </article>
            </section>

            <section className="overflow-hidden rounded-[10px] border border-[#CCD2DB] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-3 border-b border-[#D9DEE5] px-5 py-3">
                <h2 className="text-[15px] font-semibold text-[#354054]">المنتجات الأكثر مبيعاً</h2>

                <div className="flex items-center gap-2" dir="ltr">
                  {showProductSearch ? (
                    <div className="relative w-[220px] max-w-[55vw]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                      <input
                        autoFocus
                        type="search"
                        value={productSearch}
                        onChange={(event) => setProductSearch(event.target.value)}
                        placeholder="بحث..."
                        className="h-9 w-full rounded-lg border border-[#CCD2DB] bg-white pr-3 pl-9 text-right text-[12px] outline-none focus:border-[#40577B]"
                        dir="rtl"
                      />
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      setShowProductSearch((current) => !current);
                      if (showProductSearch) setProductSearch("");
                    }}
                    aria-label="بحث في المنتجات الأكثر مبيعاً"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F3F4F6] hover:text-[#062454]"
                  >
                    <Search className="h-5 w-5" strokeWidth={1.8} />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowStatusFilter((current) => !current)}
                      aria-label="تصفية المنتجات حسب الحالة"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[#F3F4F6] ${statusFilter ? "text-[#062454]" : "text-[#667085]"}`}
                    >
                      <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
                    </button>

                    {showStatusFilter ? (
                      <div className="absolute left-0 top-11 z-20 w-44 rounded-lg border border-[#D6DBE3] bg-white p-2 shadow-lg" dir="rtl">
                        {["", "متوفر", "مخزون منخفض"].map((status) => (
                          <button
                            key={status || "all"}
                            type="button"
                            onClick={() => {
                              setStatusFilter(status);
                              setShowStatusFilter(false);
                            }}
                            className={`w-full rounded-md px-3 py-2 text-right text-[12px] transition-colors hover:bg-[#F5F6F8] ${statusFilter === status ? "bg-[#EEF3FA] font-semibold text-[#062454]" : "text-[#4A4F57]"}`}
                          >
                            {status || "كل الحالات"}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-right">
                  <thead>
                    <tr className="bg-[#F1F2F4] text-[#20242A]">
                      <th className="px-5 py-4 text-right text-[12px] font-semibold">اسم المنتج</th>
                      <th className="px-5 py-4 text-center text-[12px] font-semibold">الفئة</th>
                      <th className="px-5 py-4 text-center text-[12px] font-semibold">الكمية</th>
                      <th className="px-5 py-4 text-center text-[12px] font-semibold">السعر</th>
                      <th className="px-5 py-4 text-center text-[12px] font-semibold">الحالة</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-[13px] text-[#667085]">
                          لا توجد منتجات مطابقة.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t border-[#D9DEE5]">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0F2F5] text-[#062454]">
                                <Package className="h-6 w-6" strokeWidth={1.7} />
                              </div>
                              <span className="text-[13px] font-medium text-[#22262C]">{product.name}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-center text-[13px] font-medium text-[#333840]">
                            {product.category}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-center text-[13px] text-[#333840]">
                            {product.quantity} وحدة
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-center text-[14px] font-bold text-[#062454]" dir="ltr">
                            ₪{product.price.toLocaleString("en-US")}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-center">
                            <span className={`inline-flex rounded-md px-3 py-1 text-[11px] font-semibold ${STATUS_STYLES[product.status]}`}>
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
