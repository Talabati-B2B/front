import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiCheckCircle,
  FiDollarSign,
  FiMoreVertical,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
const storeReportsOverview = {
  totalPurchases: { label: "إجمالي المشتريات", value: 0, currency: "₪", comparison: "" },
  completedOrders: { label: "الطلبات المكتملة", value: 0, helper: "عبر جميع القنوات" },
  achievedSavings: { label: "التوفير المحقق", value: 0, currency: "₪", helper: "" },
  activeSuppliers: { label: "الموردون النشطون", value: 0, helper: "موردون معتمدون حالياً" },
};

const monthlyPurchases = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
];

const expenseDistribution = [
  { id: "food", label: "مواد غذائية", percentage: 0 },
  { id: "drinks", label: "مشروبات", percentage: 0 },
  { id: "cleaning", label: "منظفات", percentage: 0 },
  { id: "other", label: "أخرى", percentage: 0 },
];

const topStoreSuppliers = [];

const summaryCards = [
  {
    id: "purchases",
    ...storeReportsOverview.totalPurchases,
    icon: FiDollarSign,
    iconClass: "bg-[#E9EDF3] text-[#062454]",
  },
  {
    id: "completed",
    ...storeReportsOverview.completedOrders,
    icon: FiCheckCircle,
    iconClass: "bg-[#FFF0E6] text-[#B64B00]",
  },
  {
    id: "savings",
    ...storeReportsOverview.achievedSavings,
    icon: FiShoppingBag,
    iconClass: "bg-[#E8EEF2] text-[#38A7E8]",
  },
  {
    id: "suppliers",
    ...storeReportsOverview.activeSuppliers,
    icon: FiTruck,
    iconClass: "bg-[#E9EDF3] text-[#062454]",
  },
];

const barColors = [
  "#2F6FED",
  "#5CB8C7",
  "#F2C62D",
  "#FF6A32",
  "#FF4940",
  "#DE55D7",
  "#7741E7",
];

const donutColors = ["#001B49", "#B64B00", "#7D99D1", "#BEC3CD"];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function SummaryCard({ card }) {
  const Icon = card.icon;

  return (
    <article className="flex min-h-[184px] items-center justify-between gap-4 rounded-xl border border-[#E0E4EA] bg-white px-6 py-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="min-w-0 text-right">
        <p className="text-[11px] text-[#737984]">{card.label}</p>

        <p className="mt-2 text-[28px] font-bold leading-tight text-[#062454]">
          {formatNumber(card.value)}
          {card.currency ? (
            <span className="mt-1 block text-[22px]">{card.currency}</span>
          ) : null}
        </p>

        {card.comparison ? (
          <p className="mt-3 text-[11px] leading-5 text-[#16A34A]">
            {card.comparison} ↗
          </p>
        ) : (
          <p className="mt-3 text-[11px] leading-5 text-[#555B65]">
            {card.helper}
          </p>
        )}
      </div>

      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
      >
        <Icon size={24} aria-hidden="true" />
      </span>
    </article>
  );
}

function PurchasesChart() {
  const chartWidth = 620;
  const chartHeight = 250;
  const left = 48;
  const right = 20;
  const top = 18;
  const bottom = 42;
  const maxValue = 30;
  const innerWidth = chartWidth - left - right;
  const innerHeight = chartHeight - top - bottom;
  const slotWidth = innerWidth / monthlyPurchases.length;
  const barWidth = 38;
  const ticks = [0, 10, 20, 30];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto min-w-[560px] w-full"
        role="img"
        aria-label="تحليل المشتريات الشهرية"
      >
        <rect x="0" y="0" width={chartWidth} height={chartHeight} fill="#F8F8F9" />

        {ticks.map((tick) => {
          const y = top + innerHeight - (tick / maxValue) * innerHeight;

          return (
            <g key={tick}>
              <line
                x1={left}
                y1={y}
                x2={chartWidth - right}
                y2={y}
                stroke="#D8DCE2"
                strokeWidth="1"
              />
              <text
                x={left - 14}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#20242A"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {monthlyPurchases.map((item, index) => {
          const height = (item.value / maxValue) * innerHeight;
          const x = left + index * slotWidth + (slotWidth - barWidth) / 2;
          const y = top + innerHeight - height;

          return (
            <g key={item.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={height}
                rx="2"
                fill={barColors[index % barColors.length]}
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight - 16}
                textAnchor="middle"
                fontSize="11"
                fill="#20242A"
              >
                {item.month}
              </text>
            </g>
          );
        })}

        <text
          x="13"
          y={chartHeight / 2}
          transform={`rotate(-90 13 ${chartHeight / 2})`}
          textAnchor="middle"
          fontSize="10"
          fill="#767B84"
        >
          المشتريات
        </text>
      </svg>
    </div>
  );
}

function ExpenseDonut() {
  const stops = expenseDistribution.map((item, index) => {
    const start = expenseDistribution
      .slice(0, index)
      .reduce((sum, entry) => sum + entry.percentage, 0);
    const end = start + item.percentage;

    return `${donutColors[index]} ${start}% ${end}%`;
  });

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative mt-5 h-44 w-44 rounded-full"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}
        aria-label="توزيع المصاريف حسب الفئة"
        role="img"
      >
        <div className="absolute inset-[38px] flex flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="text-[22px] font-bold text-[#062454]">100%</span>
          <span className="mt-1 text-[14px] text-[#111827]">الإجمالي</span>
        </div>
      </div>

      <div className="mt-4 w-full space-y-3">
        {expenseDistribution.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between gap-4 text-[12px]">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: donutColors[index] }}
              />
              <span className="truncate text-[#555B65]">{item.label}</span>
            </div>
            <span className="font-medium text-[#20242A]">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reports() {
  const { searchValue = "" } = useOutletContext() ?? {};
  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredSuppliers = useMemo(() => {
    if (!normalizedSearch) {
      return topStoreSuppliers;
    }

    return topStoreSuppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const maxSupplierTotal = Math.max(...topStoreSuppliers.map((item) => item.total));

  return (
    <section dir="rtl" className="min-h-full bg-white px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1320px]">
        <h1 className="mb-5 text-[22px] font-bold text-[#062454]">التقارير</h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.id} card={card} />
          ))}
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          <article className="min-w-0 rounded-xl border border-[#E0E4EA] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-bold text-[#062454]">
                تحليل المشتريات الشهرية
              </h2>

              <button
                type="button"
                disabled
                aria-label="خيارات الرسم البياني"
                title="لا توجد خيارات إضافية محددة في التصميم"
                className="cursor-not-allowed text-[#757B85]"
              >
                <FiMoreVertical size={20} />
              </button>
            </div>

            <PurchasesChart />
          </article>

          <article className="rounded-xl border border-[#E0E4EA] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <h2 className="text-center text-[15px] font-bold text-[#062454]">
              توزيع المصاريف حسب الفئة
            </h2>
            <ExpenseDonut />
          </article>
        </div>

        <article className="mt-5 rounded-xl border border-[#E0E4EA] bg-white px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <h2 className="mb-7 text-[15px] font-bold text-[#062454]">
            أفضل 5 موردين حسب حجم التعامل
          </h2>

          {filteredSuppliers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#D7DBE2] bg-[#FAFBFC] px-4 py-8 text-center text-[13px] text-[#7A818D]">
              لا يوجد موردون مطابقون لبحثك.
            </div>
          ) : (
            <div className="space-y-5">
              {filteredSuppliers.map((supplier) => {
                const width = (supplier.total / maxSupplierTotal) * 100;

                return (
                  <div key={supplier.id}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-[12px]">
                      <p className="min-w-0 truncate text-[#4A4F58]">
                        {supplier.name}
                      </p>
                      <p className="shrink-0 text-[14px] font-medium text-[#20242A]" dir="ltr">
                        {formatNumber(supplier.total)} SAR
                      </p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#E4E6E9]" dir="ltr">
                      <div
                        className="h-full rounded-full bg-[#062454]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
