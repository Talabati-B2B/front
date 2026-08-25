import { Link } from "react-router-dom";
import {
  FiActivity,
  FiClipboard,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiMapPin,
  FiShoppingCart,
  FiTrendingDown,
  FiTrendingUp,
  FiTruck,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    label: "إجمالي المستخدمين",
    value: "12,842",
    change: "+14%",
    trend: "up",
    icon: FiUsers,
    iconClass: "bg-[#EAF8EF] text-[#16A34A]",
    changeClass: "text-[#16A34A]",
    sparkline: [
      { height: 28, color: "#0B7890" },
      { height: 20, color: "#4EA1B3" },
      { height: 14, color: "#8FC5D0" },
      { height: 8, color: "#C9E1E6" },
    ],
  },
  {
    label: "طلبات اليوم",
    value: "456",
    change: "+8.2%",
    trend: "up",
    icon: FiShoppingCart,
    iconClass: "bg-[#FFF0E4] text-[#F2762E]",
    changeClass: "text-[#16A34A]",
    sparkline: [
      { height: 28, color: "#0B7890" },
      { height: 20, color: "#4EA1B3" },
      { height: 13, color: "#8FC5D0" },
      { height: 9, color: "#D5E8EC" },
    ],
  },
  {
    label: "الإيرادات الكلية",
    value: "₪92.4K",
    change: "+22.4%",
    trend: "up",
    icon: FiCreditCard,
    iconClass: "bg-[#EEF2FF] text-[#00163B]",
    changeClass: "text-[#16A34A]",
    sparkline: [
      { height: 14, color: "#0B7890" },
      { height: 24, color: "#0B7890" },
      { height: 31, color: "#0B7890" },
      { height: 22, color: "#0B7890" },
    ],
  },
  {
    label: "موردون قيد الانتظار",
    value: "24",
    change: "-2.1%",
    trend: "down",
    icon: FiClipboard,
    iconClass: "bg-[#EAF4F6] text-[#0B7890]",
    changeClass: "text-[#E45252]",
    sparkline: [
      { height: 13, color: "#D52B2B" },
      { height: 20, color: "#E55C64" },
      { height: 28, color: "#ED8B91" },
      { height: 35, color: "#F2B8BB" },
    ],
  },
];

const reviewOrders = [
  {
    id: "#ORD-1248",
    store: "متجر النور",
    supplier: "مخازن الخير",
    status: "قيد المراجعة",
    statusClass: "bg-[#FFF3E8] text-[#D96919]",
    total: "1,840 ₪",
  },
  {
    id: "#ORD-1241",
    store: "سوبر ماركت الأمل",
    supplier: "شركة البركة",
    status: "بانتظار التأكيد",
    statusClass: "bg-[#EEF3FA] text-[#40577B]",
    total: "920 ₪",
  },
];

const recentOrders = [
  {
    id: "#ORD-1256",
    store: "أسواق الهدى",
    supplier: "مخازن الأمانة",
    status: "مكتمل",
    statusClass: "bg-[#EAF8EF] text-[#15803D]",
    total: "2,350 ₪",
  },
  {
    id: "#ORD-1255",
    store: "متجر الوفاء",
    supplier: "شركة الإمداد",
    status: "قيد التوصيل",
    statusClass: "bg-[#FFF2E8] text-[#D96919]",
    total: "1,270 ₪",
  },
];

const activities = [
  {
    title: "تم تسجيل مورد جديد",
    description: "مخازن الندى بانتظار التحقق من الحساب",
    time: "منذ 12 دقيقة",
    icon: FiUsers,
    iconClass: "bg-[#EAF7F8] text-[#0B7890]",
  },
  {
    title: "تم إنشاء طلب جديد",
    description: "طلب #ORD-1256 أضيف إلى النظام",
    time: "منذ 28 دقيقة",
    icon: FiShoppingCart,
    iconClass: "bg-[#FFF2E8] text-[#F2762E]",
  },
  {
    title: "تم تحديث حالة توصيل",
    description: "الشحنة الخاصة بالطلب #ORD-1249 قيد التوصيل",
    time: "منذ ساعة",
    icon: FiTruck,
    iconClass: "bg-[#EDF2FA] text-[#40577B]",
  },
];

const chartData = [
  { day: "السبت", total: 48, completed: 18 },
  { day: "الأحد", total: 72, completed: 45 },
  { day: "الاثنين", total: 61, completed: 29 },
  { day: "الثلاثاء", total: 86, completed: 86 },
  { day: "الأربعاء", total: 70, completed: 45 },
  { day: "الخميس", total: 76, completed: 58 },
  { day: "الجمعة", total: 54, completed: 25 },
];

const quickActions = [
  { label: "مراجعة الحسابات", icon: FiUserCheck },
  { label: "متابعة الطلبات", icon: FiFileText, featured: true },
  { label: "إدارة المناطق", icon: FiMapPin },
  { label: "مراقبة النشاط", icon: FiActivity },
];

function SectionCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-[#0000000D] bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function StatusBadge({ children, className }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export default function AdminDashboard() {
  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon =
              stat.trend === "down" ? FiTrendingDown : FiTrendingUp;

            return (
              <article
                key={stat.label}
                className="flex min-h-[142px] flex-col rounded-[11px] border border-[#D5D9E0] bg-white px-5 py-[18px] shadow-[0_2px_6px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 text-right">
                    <p className="text-[13px] font-medium leading-5 text-[#44474F]">
                      {stat.label}
                    </p>

                    <p
                      className="mt-1.5 text-[24px] font-bold leading-none tracking-[-0.02em] text-[#00163B]"
                      dir={
                        stat.label === "الإيرادات الكلية" ? "ltr" : undefined
                      }
                    >
                      {stat.value}
                    </p>
                  </div>

                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] ${stat.iconClass}`}
                  >
                    <Icon size={21} strokeWidth={2} aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                  <span
                    className={`flex items-center gap-1 text-[11px] font-bold leading-none ${stat.changeClass}`}
                    dir="ltr"
                  >
                    <span>{stat.change}</span>
                    <TrendIcon size={12} strokeWidth={2.2} aria-hidden="true" />
                  </span>

                  <div
                    className="flex h-9 items-end gap-[3px]"
                    aria-hidden="true"
                  >
                    {stat.sparkline.map((bar, index) => (
                      <span
                        key={`${stat.label}-${index}`}
                        className="block w-[4px] rounded-[1px]"
                        style={{
                          height: `${bar.height}px`,
                          backgroundColor: bar.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <SectionCard className="xl:col-span-2 overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <h2 className="text-[16px] font-bold text-[#00163B]">
                  طلبات تحتاج للمراجعة
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  أحدث الطلبات التي تحتاج متابعة من الإدارة
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="text-[12px] font-semibold text-[#0B7890]"
              >
                عرض الكل
              </Link>
            </div>

            <div className="overflow-hidden">
              <table className="w-full table-fixed text-right">
                <thead>
                  <tr className="bg-[#F4F6F9] text-[11px] font-semibold text-[#747780]">
                    <th className="px-5 py-3">رقم الطلب</th>
                    <th className="px-5 py-3">المتجر</th>
                    <th className="px-5 py-3">المورد</th>
                    <th className="px-5 py-3">الحالة</th>
                    <th className="px-5 py-3">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[#EEF0F3] text-[12px] text-[#44474F]"
                    >
                      <td
                        className="px-5 py-4 font-semibold text-[#0B7890]"
                        dir="ltr"
                      >
                        {order.id}
                      </td>
                      <td className="px-5 py-4 font-medium text-[#191C1D]">
                        {order.store}
                      </td>
                      <td className="px-5 py-4">{order.supplier}</td>
                      <td className="px-5 py-4">
                        <StatusBadge className={order.statusClass}>
                          {order.status}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#191C1D]">
                        {order.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard className="p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-bold text-[#00163B]">
                  نشاط النظام
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  آخر الأنشطة المسجلة
                </p>
              </div>
              <FiActivity
                className="text-[#0B7890]"
                size={19}
                aria-hidden="true"
              />
            </div>

            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div key={activity.title} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.iconClass}`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-[#191C1D]">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-[#747780]">
                        {activity.description}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[#A1A3AA]">
                        <FiClock size={11} aria-hidden="true" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <SectionCard className="xl:col-span-2 p-5">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-bold text-[#00163B]">
                  الطلبات اليومية
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  مقارنة إجمالي الطلبات بالطلبات المكتملة
                </p>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[#747780]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#0B7890]" />
                  الطلبات المكتملة
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#DDE5F2]" />
                  إجمالي الطلبات
                </span>
              </div>
            </div>

            <div className="relative h-[220px] border-b border-[#DDE1E7] sm:h-[250px]">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
                {[1, 2, 3, 4].map((line) => (
                  <span
                    key={line}
                    className="block border-t border-dashed border-[#EEF0F3]"
                  />
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 top-3 flex items-end justify-around gap-2 px-1 sm:px-3">
                {chartData.map((item) => (
                  <div
                    key={item.day}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    <div className="relative flex h-[calc(100%-26px)] w-full max-w-12 items-end overflow-hidden rounded-t-md bg-[#E8EDF6] sm:max-w-14">
                      <div
                        className="w-full rounded-t-md bg-[#AEB8C9]"
                        style={{ height: `${item.total}%` }}
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-t-md bg-[#0B7890]"
                        style={{ height: `${item.completed}%` }}
                      />
                    </div>
                    <span className="mt-2 whitespace-nowrap text-[9px] text-[#8A8D95] sm:text-[10px]">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard className="p-5">
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-[#00163B]">
                حالة الطلبات
              </h2>
              <p className="mt-1 text-[11px] text-[#8A8D95]">
                توزيع الطلبات حسب الحالة الحالية
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#0B7890_0_62%,#B8C2D1_62%_86%,#F2762E_86%_100%)] sm:h-40 sm:w-40">
                <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-white sm:h-[126px] sm:w-[126px]">
                  <span className="text-[24px] font-bold text-[#00163B]">
                    1,209
                  </span>
                  <span className="mt-1 text-[11px] text-[#8A8D95]">
                    إجمالي الطلبات
                  </span>
                </div>
              </div>

              <div className="mt-6 grid w-full grid-cols-3 gap-2 text-center">
                <div>
                  <span className="mx-auto mb-1 block h-2 w-2 rounded-full bg-[#0B7890]" />
                  <p className="text-[10px] text-[#747780]">مكتمل</p>
                  <p className="mt-1 text-[12px] font-bold text-[#00163B]">
                    62%
                  </p>
                </div>
                <div>
                  <span className="mx-auto mb-1 block h-2 w-2 rounded-full bg-[#B8C2D1]" />
                  <p className="text-[10px] text-[#747780]">قيد التنفيذ</p>
                  <p className="mt-1 text-[12px] font-bold text-[#00163B]">
                    24%
                  </p>
                </div>
                <div>
                  <span className="mx-auto mb-1 block h-2 w-2 rounded-full bg-[#F2762E]" />
                  <p className="text-[10px] text-[#747780]">بانتظار المراجعة</p>
                  <p className="mt-1 text-[12px] font-bold text-[#00163B]">
                    14%
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <SectionCard className="xl:col-span-2 overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <h2 className="text-[16px] font-bold text-[#00163B]">
                  أحدث الطلبات
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  نظرة سريعة على آخر الطلبات في المنصة
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="text-[12px] font-semibold text-[#0B7890]"
              >
                عرض الكل
              </Link>
            </div>

            <div className="overflow-hidden">
              <table className="w-full table-fixed text-right">
                <thead>
                  <tr className="bg-[#F4F6F9] text-[11px] font-semibold text-[#747780]">
                    <th className="px-5 py-3">رقم الطلب</th>
                    <th className="px-5 py-3">المتجر</th>
                    <th className="px-5 py-3">المورد</th>
                    <th className="px-5 py-3">الحالة</th>
                    <th className="px-5 py-3">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[#EEF0F3] text-[12px] text-[#44474F]"
                    >
                      <td
                        className="px-5 py-4 font-semibold text-[#0B7890]"
                        dir="ltr"
                      >
                        {order.id}
                      </td>
                      <td className="px-5 py-4 font-medium text-[#191C1D]">
                        {order.store}
                      </td>
                      <td className="px-5 py-4">{order.supplier}</td>
                      <td className="px-5 py-4">
                        <StatusBadge className={order.statusClass}>
                          {order.status}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#191C1D]">
                        {order.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="group grid grid-cols-2 gap-3 self-start">
            {quickActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  to={
                    action.label === "مراجعة الحسابات"
                      ? "/admin/account-review"
                      : action.label === "متابعة الطلبات"
                        ? "/admin/orders"
                        : action.label === "إدارة المناطق"
                          ? "/admin/regions"
                          : "/admin/activity"
                  }
                  className={`
          flex min-h-[92px] flex-col items-center justify-center gap-2
          rounded-xl border p-4 text-center shadow-sm
          transition-all duration-300 ease-in-out
          hover:-translate-y-0.5
          hover:border-[#00163B]
          hover:bg-[#00163B]
          hover:text-white
          hover:shadow-md

          ${
            index === 0
              ? `
                border-[#00163B]
                bg-[#00163B]
                text-white

                group-hover:bg-white
                group-hover:text-[#00163B]
                group-hover:border-[#0000000D]

                hover:!border-[#00163B]
                hover:!bg-[#00163B]
                hover:!text-white
              `
              : `
                border-[#0000000D]
                bg-white
                text-[#00163B]
              `
          }
        `}
                >
                  <Icon size={20} aria-hidden="true" />

                  <span className="text-[11px] font-semibold">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
