import { useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

const PAGE_SIZE = 6;

const initialActivities = [
  {
    id: 1,
    action: "تسجيل مورد جديد",
    actor: "مخازن الندى",
    type: "الحسابات",
    date: "2026-08-19",
    time: "18:42",
    status: "يحتاج متابعة",
  },
  {
    id: 2,
    action: "اعتماد حساب متجر",
    actor: "مدير النظام",
    type: "الحسابات",
    date: "2026-08-19",
    time: "17:25",
    status: "ناجح",
  },
  {
    id: 3,
    action: "تحديث حالة طلب #ORD-1256",
    actor: "مخازن الأمانة",
    type: "الطلبات",
    date: "2026-08-19",
    time: "16:58",
    status: "ناجح",
  },
  {
    id: 4,
    action: "رفض طلب تسجيل مورد",
    actor: "مدير النظام",
    type: "الحسابات",
    date: "2026-08-19",
    time: "15:31",
    status: "مرفوض",
  },
  {
    id: 5,
    action: "تعديل بيانات منطقة الرمال",
    actor: "مدير النظام",
    type: "المناطق",
    date: "2026-08-19",
    time: "14:47",
    status: "ناجح",
  },
  {
    id: 6,
    action: "تعديل بيانات حساب متجر",
    actor: "متجر النور",
    type: "الحسابات",
    date: "2026-08-19",
    time: "13:18",
    status: "يحتاج متابعة",
  },
  {
    id: 7,
    action: "إنشاء منطقة خدمة جديدة",
    actor: "مدير النظام",
    type: "المناطق",
    date: "2026-08-18",
    time: "20:06",
    status: "ناجح",
  },
  {
    id: 8,
    action: "تحديث حالة طلب #ORD-1249",
    actor: "شركة البركة",
    type: "الطلبات",
    date: "2026-08-18",
    time: "18:44",
    status: "ناجح",
  },
  {
    id: 9,
    action: "طلب تعديلات على حساب مورد",
    actor: "مدير النظام",
    type: "الحسابات",
    date: "2026-08-18",
    time: "17:12",
    status: "يحتاج متابعة",
  },
  {
    id: 10,
    action: "تعطيل منطقة خدمة مؤقتًا",
    actor: "مدير النظام",
    type: "المناطق",
    date: "2026-08-18",
    time: "15:35",
    status: "ناجح",
  },
  {
    id: 11,
    action: "إنشاء طلب شراء #ORD-1242",
    actor: "سوبر ماركت الأمل",
    type: "الطلبات",
    date: "2026-08-18",
    time: "12:28",
    status: "ناجح",
  },
  {
    id: 12,
    action: "محاولة تحديث طلب غير مكتملة",
    actor: "شركة الإمداد الحديثة",
    type: "الطلبات",
    date: "2026-08-17",
    time: "19:52",
    status: "مرفوض",
  },
  {
    id: 13,
    action: "اعتماد حساب مورد",
    actor: "مدير النظام",
    type: "الحسابات",
    date: "2026-08-17",
    time: "16:41",
    status: "ناجح",
  },
  {
    id: 14,
    action: "تحديث بيانات منطقة النصيرات",
    actor: "مدير النظام",
    type: "المناطق",
    date: "2026-08-17",
    time: "11:16",
    status: "ناجح",
  },
];

const statusStyles = {
  ناجح: "bg-[#EAF8EF] text-[#15803D]",
  "يحتاج متابعة": "bg-[#FFF3E8] text-[#D96919]",
  مرفوض: "bg-[#FDECEC] text-[#C93C3C]",
};

const typeStyles = {
  الحسابات: {
    icon: FiUsers,
    badgeClass: "bg-[#EAF7F8] text-[#0B7890]",
    iconClass: "bg-[#EAF7F8] text-[#0B7890]",
  },
  الطلبات: {
    icon: FiShoppingCart,
    badgeClass: "bg-[#FFF2E8] text-[#D96919]",
    iconClass: "bg-[#FFF2E8] text-[#F2762E]",
  },
  المناطق: {
    icon: FiMapPin,
    badgeClass: "bg-[#EEF3FA] text-[#40577B]",
    iconClass: "bg-[#EEF3FA] text-[#40577B]",
  },
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[status] ?? "bg-[#F1F3F5] text-[#5F6368]"}`}
    >
      {status}
    </span>
  );
}

function ActivityType({ type }) {
  const config = typeStyles[type] ?? {
    icon: FiActivity,
    badgeClass: "bg-[#F1F3F5] text-[#5F6368]",
    iconClass: "bg-[#F1F3F5] text-[#5F6368]",
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${config.badgeClass}`}
    >
      <Icon size={12} aria-hidden="true" />
      {type}
    </span>
  );
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${dateString}T00:00:00`));
}

export default function AdminActivity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => {
    const todayActivities = initialActivities.filter(
      (activity) => activity.date === "2026-08-19",
    ).length;
    const successfulActivities = initialActivities.filter(
      (activity) => activity.status === "ناجح",
    ).length;
    const followUpActivities = initialActivities.filter(
      (activity) => activity.status === "يحتاج متابعة",
    ).length;

    return [
      {
        label: "إجمالي الأنشطة",
        value: initialActivities.length,
        icon: FiActivity,
        iconClass: "bg-[#EEF3FA] text-[#40577B]",
      },
      {
        label: "أنشطة اليوم",
        value: todayActivities,
        icon: FiClock,
        iconClass: "bg-[#EAF7F8] text-[#0B7890]",
      },
      {
        label: "عمليات ناجحة",
        value: successfulActivities,
        icon: FiCheckCircle,
        iconClass: "bg-[#EAF8EF] text-[#16A34A]",
      },
      {
        label: "تحتاج متابعة",
        value: followUpActivities,
        icon: FiAlertCircle,
        iconClass: "bg-[#FFF2E8] text-[#F2762E]",
      },
    ];
  }, []);

  const filteredActivities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return initialActivities.filter((activity) => {
      const matchesSearch =
        !normalizedSearch ||
        activity.action.toLowerCase().includes(normalizedSearch) ||
        activity.actor.toLowerCase().includes(normalizedSearch) ||
        activity.type.toLowerCase().includes(normalizedSearch);
      const matchesType =
        typeFilter === "الكل" || activity.type === typeFilter;
      const matchesStatus =
        statusFilter === "الكل" || activity.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleActivities = filteredActivities.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div dir="rtl" className="w-full min-w-0 p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-5">
        <header>
          <h1 className="text-[24px] font-bold text-[#00163B] sm:text-[28px]">
            مراقبة النشاط
          </h1>
          <p className="mt-1 max-w-3xl text-[12px] leading-6 text-[#747780] sm:text-[13px]">
            عرض ومتابعة أحدث أنشطة النظام والإجراءات الإدارية المتعلقة بالحسابات والطلبات ومناطق الخدمة.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
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

        <section className="min-w-0 overflow-hidden rounded-xl border border-[#0000000D] bg-white shadow-sm">
          <div className="border-b border-[#EEF0F3] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#00163B]">
                  سجل الأنشطة
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  ابحث وفلتر أحدث العمليات المسجلة داخل لوحة الإدارة
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap xl:w-auto xl:flex-nowrap">
                <label className="relative min-w-0 flex-1 xl:w-[300px] xl:flex-none">
                  <span className="sr-only">البحث في الأنشطة</span>
                  <FiSearch
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8D95]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="ابحث بالنشاط أو المستخدم..."
                    className="h-10 w-full rounded-lg border border-[#DDE1E7] bg-white pr-9 pl-3 text-[12px] text-[#191C1D] outline-none transition placeholder:text-[#A1A3AA] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                  />
                </label>

                <select
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                  className="h-10 min-w-[145px] rounded-lg border border-[#DDE1E7] bg-white px-3 text-[12px] text-[#44474F] outline-none focus:border-[#40577B]"
                  aria-label="تصفية حسب نوع العملية"
                >
                  <option value="الكل">كل الأنواع</option>
                  <option value="الحسابات">الحسابات</option>
                  <option value="الطلبات">الطلبات</option>
                  <option value="المناطق">المناطق</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="h-10 min-w-[145px] rounded-lg border border-[#DDE1E7] bg-white px-3 text-[12px] text-[#44474F] outline-none focus:border-[#40577B]"
                  aria-label="تصفية حسب حالة النشاط"
                >
                  <option value="الكل">كل الحالات</option>
                  <option value="ناجح">ناجح</option>
                  <option value="يحتاج متابعة">يحتاج متابعة</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-right">
              <thead>
                <tr className="bg-[#F4F6F9] text-[11px] font-semibold text-[#747780]">
                  <th className="px-5 py-3">النشاط / الإجراء</th>
                  <th className="px-5 py-3">المستخدم أو الجهة</th>
                  <th className="px-5 py-3">نوع العملية</th>
                  <th className="px-5 py-3">التاريخ / الوقت</th>
                  <th className="px-5 py-3">الحالة</th>
                </tr>
              </thead>

              <tbody>
                {visibleActivities.length > 0 ? (
                  visibleActivities.map((activity) => {
                    const typeConfig = typeStyles[activity.type] ?? {
                      icon: FiActivity,
                      iconClass: "bg-[#F1F3F5] text-[#5F6368]",
                    };
                    const ActivityIcon = typeConfig.icon;

                    return (
                      <tr
                        key={activity.id}
                        className="border-t border-[#EEF0F3] text-[12px] text-[#44474F] transition hover:bg-[#FAFBFC]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${typeConfig.iconClass}`}
                            >
                              <ActivityIcon size={16} aria-hidden="true" />
                            </span>
                            <span className="font-semibold text-[#00163B]">
                              {activity.action}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-[#191C1D]">
                          {activity.actor}
                        </td>
                        <td className="px-5 py-4">
                          <ActivityType type={activity.type} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FiClock
                              size={14}
                              className="text-[#8A8D95]"
                              aria-hidden="true"
                            />
                            <span className="font-medium text-[#44474F]">
                              {formatDate(activity.date)}
                            </span>
                            <span className="text-[#A1A3AA]">{activity.time}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={activity.status} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F6F9] text-[#8A8D95]">
                          <FiSearch size={20} aria-hidden="true" />
                        </span>
                        <p className="mt-3 text-[13px] font-semibold text-[#00163B]">
                          لا توجد أنشطة مطابقة
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-[#8A8D95]">
                          جرّب تغيير عبارة البحث أو فلاتر نوع العملية والحالة
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#EEF0F3] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[11px] text-[#8A8D95]">
                عرض {filteredActivities.length === 0 ? 0 : startIndex + 1} -{" "}
                {Math.min(startIndex + PAGE_SIZE, filteredActivities.length)} من أصل{" "}
                {filteredActivities.length} نشاط
              </p>
              <span className="hidden h-3 w-px bg-[#DDE1E7] sm:block" />
              <span className="inline-flex items-center gap-1 text-[10px] text-[#A1A3AA]">
                <FiRefreshCw size={11} aria-hidden="true" />
                بيانات محلية تجريبية
              </span>
            </div>

            <div className="flex items-center gap-1.5" dir="ltr">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة السابقة"
              >
                <FiChevronLeft size={15} aria-hidden="true" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                      page === safeCurrentPage
                        ? "bg-[#00163B] text-white"
                        : "border border-[#DDE1E7] bg-white text-[#40577B] hover:bg-[#F4F6F9]"
                    }`}
                    aria-current={page === safeCurrentPage ? "page" : undefined}
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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة التالية"
              >
                <FiChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
