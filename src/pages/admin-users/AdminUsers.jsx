import { useMemo, useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEdit3,
  FiEye,
  FiSearch,
  FiShoppingBag,
  FiUsers,
  FiX,
  FiXCircle,
} from "react-icons/fi";

const PAGE_SIZE = 5;

const initialUsers = [
  {
    id: 1,
    name: "شركة النخيل للتجارة",
    accountType: "مورد",
    email: "info@alnakheel.ps",
    phone: "0599123456",
    activityType: "تاجر جملة",
    category: "مواد غذائية",
    region: "دير البلح",
    status: "قيد المراجعة",
    joinDate: "2026-07-24",
  },
  {
    id: 2,
    name: "شركة النخيل للتجارة",
    accountType: "مورد",
    email: "sales@alnakheel.ps",
    phone: "0597442211",
    activityType: "مصنع",
    category: "منظفات",
    region: "غزة",
    status: "قيد المراجعة",
    joinDate: "2026-07-14",
  },
  {
    id: 3,
    name: "شركة النخيل للتجارة",
    accountType: "مورد",
    email: "home@alnakheel.ps",
    phone: "0598441133",
    activityType: "مستورد",
    category: "أدوات منزلية",
    region: "المغازي",
    status: "قيد المراجعة",
    joinDate: "2026-07-11",
  },
  {
    id: 4,
    name: "شركة النخيل للتجارة",
    accountType: "مورد",
    email: "supplies@alnakheel.ps",
    phone: "0595127788",
    activityType: "تاجر جملة",
    category: "مستلزمات",
    region: "النصيرات",
    status: "قيد المراجعة",
    joinDate: "2026-07-10",
  },
  {
    id: 5,
    name: "شركة النخيل للتجارة",
    accountType: "مورد",
    email: "food@alnakheel.ps",
    phone: "0594112688",
    activityType: "تاجر جملة",
    category: "مواد غذائية",
    region: "خانيونس",
    status: "قيد المراجعة",
    joinDate: "2026-07-05",
  },
  {
    id: 6,
    name: "مخازن الأمانة",
    accountType: "مورد",
    email: "alamana.supplier@example.com",
    phone: "0599123451",
    activityType: "تاجر جملة",
    category: "مواد غذائية",
    region: "غزة",
    status: "مقبول",
    joinDate: "2026-06-29",
  },
  {
    id: 7,
    name: "شركة البركة للتوزيع",
    accountType: "مورد",
    email: "baraka.dist@example.com",
    phone: "0597336142",
    activityType: "مستورد",
    category: "مواد غذائية",
    region: "دير البلح",
    status: "تحتاج تعديلات",
    joinDate: "2026-06-26",
  },
  {
    id: 8,
    name: "مؤسسة الخير التجارية",
    accountType: "مورد",
    email: "alkhair.trade@example.com",
    phone: "0598546321",
    activityType: "تاجر جملة",
    category: "مستلزمات",
    region: "خانيونس",
    status: "مقبول",
    joinDate: "2026-06-20",
  },
  {
    id: 9,
    name: "شركة الإمداد الحديثة",
    accountType: "مورد",
    email: "supply.modern@example.com",
    phone: "0594812637",
    activityType: "مصنع",
    category: "منظفات",
    region: "غزة",
    status: "مرفوض",
    joinDate: "2026-06-16",
  },
  {
    id: 10,
    name: "مخازن الندى",
    accountType: "مورد",
    email: "alnada.supplier@example.com",
    phone: "0596247851",
    activityType: "تاجر جملة",
    category: "مواد غذائية",
    region: "النصيرات",
    status: "مقبول",
    joinDate: "2026-06-12",
  },
  {
    id: 11,
    name: "متجر النخبة",
    accountType: "متجر",
    email: "elite.store@example.com",
    phone: "0568452101",
    activityType: "سوبر ماركت",
    category: "مواد غذائية",
    region: "دير البلح",
    status: "قيد المراجعة",
    joinDate: "2026-07-24",
  },
  {
    id: 12,
    name: "متجر الجودة",
    accountType: "متجر",
    email: "quality.store@example.com",
    phone: "0568452102",
    activityType: "مواد غذائية وتموينية",
    category: "منظفات",
    region: "غزة",
    status: "قيد المراجعة",
    joinDate: "2026-07-14",
  },
  {
    id: 13,
    name: "سوبر ماركت الأمل",
    accountType: "متجر",
    email: "alamal.market@example.com",
    phone: "0569127584",
    activityType: "مواد غذائية",
    category: "أدوات منزلية",
    region: "المغازي",
    status: "قيد المراجعة",
    joinDate: "2026-07-11",
  },
  {
    id: 14,
    name: "مخبز السلام",
    accountType: "متجر",
    email: "alsalam.bakery@example.com",
    phone: "0568452104",
    activityType: "مخبز ومعجنات",
    category: "مستلزمات",
    region: "النصيرات",
    status: "قيد المراجعة",
    joinDate: "2026-07-10",
  },
  {
    id: 15,
    name: "مطعم الشام",
    accountType: "متجر",
    email: "alsham.restaurant@example.com",
    phone: "0568452105",
    activityType: "مطعم وجبات سريعة",
    category: "مواد غذائية",
    region: "خانيونس",
    status: "قيد المراجعة",
    joinDate: "2026-07-05",
  },
  {
    id: 16,
    name: "متجر النور",
    accountType: "متجر",
    email: "alnoor.store@example.com",
    phone: "0568452190",
    activityType: "سوبر ماركت",
    category: "مواد غذائية",
    region: "غزة",
    status: "مقبول",
    joinDate: "2026-06-30",
  },
  {
    id: 17,
    name: "متجر الوفاء",
    accountType: "متجر",
    email: "alwafaa.store@example.com",
    phone: "0567029143",
    activityType: "مواد غذائية وتموينية",
    category: "منظفات",
    region: "دير البلح",
    status: "تحتاج تعديلات",
    joinDate: "2026-06-27",
  },
  {
    id: 18,
    name: "أسواق الهدى",
    accountType: "متجر",
    email: "alhuda.market@example.com",
    phone: "0568912734",
    activityType: "مواد غذائية",
    category: "مواد غذائية",
    region: "النصيرات",
    status: "مقبول",
    joinDate: "2026-06-21",
  },
  {
    id: 19,
    name: "متجر السلام",
    accountType: "متجر",
    email: "alsalam.store@example.com",
    phone: "0565379182",
    activityType: "سوبر ماركت",
    category: "مستلزمات",
    region: "خانيونس",
    status: "مرفوض",
    joinDate: "2026-06-18",
  },
  {
    id: 20,
    name: "مركز الوفاق التجاري",
    accountType: "متجر",
    email: "alwefaq.center@example.com",
    phone: "0563248719",
    activityType: "مواد غذائية وتموينية",
    category: "أدوات منزلية",
    region: "غزة",
    status: "مقبول",
    joinDate: "2026-06-14",
  },
];

const statusStyles = {
  "قيد المراجعة": "bg-[#FFE9DA] text-[#F2762E]",
  "تحتاج تعديلات": "bg-[#EEF3FA] text-[#40577B]",
  مقبول: "bg-[#EAF8EF] text-[#15803D]",
  مرفوض: "bg-[#FDECEC] text-[#C93C3C]",
};

const tabConfig = {
  مورد: {
    label: "الموردين",
    icon: FiUsers,
    totalLabel: "إجمالي الموردين",
    searchPlaceholder: "ابحث عن المورد...",
  },
  متجر: {
    label: "المتاجر",
    icon: FiShoppingBag,
    totalLabel: "إجمالي المتاجر",
    searchPlaceholder: "ابحث عن المتجر...",
  },
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyles[status] ?? "bg-[#F1F3F5] text-[#5F6368]"}`}
    >
      {status === "قيد المراجعة" && (
        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#F2762E] text-[8px] font-bold leading-none text-white">
          !
        </span>
      )}
      {status}
    </span>
  );
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${year}/${month}/${day}`;
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState("مورد");
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [regionFilter, setRegionFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [rejectingAccount, setRejectingAccount] = useState(null);

  const tabUsers = useMemo(
    () => users.filter((user) => user.accountType === activeTab),
    [activeTab, users],
  );

  const stats = useMemo(() => {
    const total = tabUsers.length;
    const countByStatus = (status) =>
      tabUsers.filter((user) => user.status === status).length;

    const makePercentage = (value) =>
      total === 0 ? 0 : Math.round((value / total) * 100);

    const pending = countByStatus("قيد المراجعة");
    const accepted = countByStatus("مقبول");
    const rejected = countByStatus("مرفوض");

    return [
      {
        label: tabConfig[activeTab].totalLabel,
        value: total,
        caption: tabConfig[activeTab].totalLabel,
        icon: FiUsers,
        iconClass: "bg-[#E5F1F7] text-[#4F92AE]",
        valueClass: "text-[#64A6BE]",
      },
      {
        label: "قيد المراجعة",
        value: pending,
        caption: `${makePercentage(pending)}% إجمالي`,
        icon: FiClock,
        iconClass: "bg-[#FFE5D3] text-[#F2762E]",
        valueClass: "text-[#F2762E]",
      },
      {
        label: "مقبول",
        value: accepted,
        caption: `${makePercentage(accepted)}% إجمالي`,
        icon: FiCheckCircle,
        iconClass: "bg-[#DDF6E4] text-[#23B14D]",
        valueClass: "text-[#23B14D]",
      },
      {
        label: "مرفوض",
        value: rejected,
        caption: `${makePercentage(rejected)}% إجمالي`,
        icon: FiXCircle,
        iconClass: "bg-[#FFDADB] text-[#E53935]",
        valueClass: "text-[#E53935]",
      },
    ];
  }, [activeTab, tabUsers]);

  const filterOptions = useMemo(() => {
    const unique = (key) => [...new Set(tabUsers.map((user) => user[key]))];

    return {
      activities: unique("activityType"),
      categories: unique("category"),
      regions: unique("region"),
    };
  }, [tabUsers]);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tabUsers.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone.includes(search) ||
        user.activityType.toLowerCase().includes(search) ||
        user.category.toLowerCase().includes(search) ||
        user.region.toLowerCase().includes(search);
      const matchesActivity =
        activityFilter === "الكل" || user.activityType === activityFilter;
      const matchesStatus =
        statusFilter === "الكل" || user.status === statusFilter;
      const matchesCategory =
        categoryFilter === "الكل" || user.category === categoryFilter;
      const matchesRegion =
        regionFilter === "الكل" || user.region === regionFilter;

      return (
        matchesSearch &&
        matchesActivity &&
        matchesStatus &&
        matchesCategory &&
        matchesRegion
      );
    });
  }, [
    activityFilter,
    categoryFilter,
    regionFilter,
    searchTerm,
    statusFilter,
    tabUsers,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  const updateAccountStatus = (accountId, status) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === accountId ? { ...user, status } : user,
      ),
    );

    setSelectedAccount((current) =>
      current?.id === accountId ? { ...current, status } : current,
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setActivityFilter("الكل");
    setStatusFilter("الكل");
    setCategoryFilter("الكل");
    setRegionFilter("الكل");
    setCurrentPage(1);
  };

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  const confirmReject = () => {
    if (!rejectingAccount) {
      return;
    }

    updateAccountStatus(rejectingAccount.id, "مرفوض");
    setRejectingAccount(null);
  };

  const currentTabConfig = tabConfig[activeTab];

  return (
    <div dir="rtl" className="w-full min-w-0 p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-5">
        <section className="mx-auto grid w-full max-w-[535px] grid-cols-2 overflow-hidden rounded-[18px] border border-[#8EA0BC] bg-white">
          {["مورد", "متجر"].map((tab) => {
            const config = tabConfig[tab];
            const Icon = config.icon;
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`flex h-[58px] items-center justify-center gap-4 px-5 text-[20px] font-medium transition-colors sm:text-[22px] ${
                  isActive
                    ? "bg-[#062C66] text-white"
                    : "bg-white text-[#062C66] hover:bg-[#F4F7FB]"
                }`}
                aria-pressed={isActive}
              >
                <Icon size={26} aria-hidden="true" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-[18px] border border-[#C8CCD2] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 text-right">
                    <p className="text-[18px] font-bold text-[#111820]">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-1 text-[22px] font-medium leading-none ${stat.valueClass}`}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[10px] text-[#8A8D95]">
                      {stat.caption}
                    </p>
                  </div>

                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.iconClass}`}
                  >
                    <Icon size={25} aria-hidden="true" />
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-[14px] border border-[#C8CCD2] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <label className="relative block w-full xl:max-w-[275px]">
              <span className="sr-only">بحث المستخدمين</span>
              <FiSearch
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8D95]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={currentTabConfig.searchPlaceholder}
                className="h-11 w-full rounded-[12px] border border-[#C9CDD4] bg-white px-4 pl-10 text-[12px] text-[#191C1D] outline-none placeholder:text-[#B1B4BA] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
              />
            </label>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:max-w-[700px]">
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#222831]">
                نوع النشاط
                <select
                  value={activityFilter}
                  onChange={handleFilterChange(setActivityFilter)}
                  className="h-10 rounded-[12px] border border-[#C9CDD4] bg-white px-3 text-[12px] font-normal text-[#6F737A] outline-none focus:border-[#40577B]"
                >
                  <option value="الكل">الكل</option>
                  {filterOptions.activities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#222831]">
                الحالة
                <select
                  value={statusFilter}
                  onChange={handleFilterChange(setStatusFilter)}
                  className="h-10 rounded-[12px] border border-[#C9CDD4] bg-white px-3 text-[12px] font-normal text-[#6F737A] outline-none focus:border-[#40577B]"
                >
                  <option value="الكل">الكل</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="تحتاج تعديلات">تحتاج تعديلات</option>
                  <option value="مقبول">مقبول</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#222831]">
                التصنيف
                <select
                  value={categoryFilter}
                  onChange={handleFilterChange(setCategoryFilter)}
                  className="h-10 rounded-[12px] border border-[#C9CDD4] bg-white px-3 text-[12px] font-normal text-[#6F737A] outline-none focus:border-[#40577B]"
                >
                  <option value="الكل">الكل</option>
                  {filterOptions.categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#222831]">
                المنطقة
                <select
                  value={regionFilter}
                  onChange={handleFilterChange(setRegionFilter)}
                  className="h-10 rounded-[12px] border border-[#C9CDD4] bg-white px-3 text-[12px] font-normal text-[#6F737A] outline-none focus:border-[#40577B]"
                >
                  <option value="الكل">الكل</option>
                  {filterOptions.regions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-[22px] border border-[#D4D7DC] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[980px] text-right">
              <thead>
                <tr className="bg-[#062C66] text-[14px] font-medium text-white">
                  <th className="px-5 py-4">الاسم</th>
                  <th className="px-4 py-4">نوع النشاط</th>
                  <th className="px-4 py-4">التصنيف</th>
                  <th className="px-4 py-4">المنطقة</th>
                  <th className="px-4 py-4">الحالة</th>
                  <th className="px-4 py-4">تاريخ الانضمام</th>
                  <th className="px-4 py-4 text-center">إجراءات</th>
                </tr>
              </thead>

              <tbody>
                {visibleUsers.length > 0 ? (
                  visibleUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-[#E6E8EB] text-[12px] text-[#566070] transition-colors hover:bg-[#FAFBFC]"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08A32A] text-[13px] font-semibold text-white">
                            {initials(user.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-[#1F2933]">
                              {user.name}
                            </p>
                            <p className="mt-0.5 truncate text-[9px] text-[#99A0AA]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{user.activityType}</td>
                      <td className="px-4 py-3.5">{user.category}</td>
                      <td className="px-4 py-3.5">{user.region}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5" dir="ltr">
                        {formatDate(user.joinDate)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5" dir="rtl">
                          <button
                            type="button"
                            onClick={() => setSelectedAccount(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#D6DADF] bg-white text-[#68707A] transition-colors hover:bg-[#F4F6F9]"
                            title={`عرض ${user.name}`}
                            aria-label={`عرض ${user.name}`}
                          >
                            <FiEye size={15} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateAccountStatus(user.id, "مقبول")}
                            disabled={user.status === "مقبول"}
                            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#D6DADF] bg-white text-[#15803D] transition-colors hover:bg-[#EAF8EF] disabled:cursor-not-allowed disabled:opacity-35"
                            title={`قبول ${user.name}`}
                            aria-label={`قبول ${user.name}`}
                          >
                            <FiCheck size={15} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateAccountStatus(user.id, "تحتاج تعديلات")
                            }
                            disabled={user.status === "تحتاج تعديلات"}
                            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#D6DADF] bg-white text-[#40577B] transition-colors hover:bg-[#EEF3FA] disabled:cursor-not-allowed disabled:opacity-35"
                            title={`طلب تعديلات من ${user.name}`}
                            aria-label={`طلب تعديلات من ${user.name}`}
                          >
                            <FiEdit3 size={14} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingAccount(user)}
                            disabled={user.status === "مرفوض"}
                            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#D6DADF] bg-white text-[#C93C3C] transition-colors hover:bg-[#FDECEC] disabled:cursor-not-allowed disabled:opacity-35"
                            title={`رفض ${user.name}`}
                            aria-label={`رفض ${user.name}`}
                          >
                            <FiX size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F4F8] text-[#7B879B]">
                          <FiUsers size={21} aria-hidden="true" />
                        </span>
                        <p className="mt-3 text-[13px] font-semibold text-[#00163B]">
                          لا توجد نتائج مطابقة
                        </p>
                        <p className="mt-1 text-[11px] text-[#8A8D95]">
                          جرّب تغيير البحث أو خيارات التصفية
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E6E8EB] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[#52657F]">
              عرض {filteredUsers.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + PAGE_SIZE, filteredUsers.length)} من {filteredUsers.length}{" "}
              {activeTab === "مورد" ? "مورد" : "متجر"}
            </p>

            <div className="flex items-center gap-1.5" dir="ltr">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#DDE1E7] bg-white text-[#6E7C90] transition-colors hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-35"
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
                    className={`flex h-8 min-w-8 items-center justify-center rounded-[5px] border px-2 text-[11px] font-medium transition-colors ${
                      safeCurrentPage === page
                        ? "border-[#2B247E] bg-[#2B247E] text-white"
                        : "border-[#DDE1E7] bg-white text-[#5F6B7A] hover:bg-[#F4F6F9]"
                    }`}
                    aria-current={safeCurrentPage === page ? "page" : undefined}
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
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#DDE1E7] bg-white text-[#6E7C90] transition-colors hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="الصفحة التالية"
              >
                <FiChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00163B]/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setSelectedAccount(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-user-details-title"
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#EEF0F3] px-5 py-4">
              <div>
                <h2
                  id="admin-user-details-title"
                  className="text-[17px] font-bold text-[#00163B]"
                >
                  تفاصيل الحساب
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  عرض البيانات الأساسية للحساب المحدد
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#747780] transition hover:bg-[#F4F6F9]"
                aria-label="إغلاق"
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              {[
                ["اسم الحساب", selectedAccount.name],
                ["النوع", selectedAccount.accountType],
                ["نوع النشاط", selectedAccount.activityType],
                ["التصنيف", selectedAccount.category],
                ["المنطقة", selectedAccount.region],
                ["البريد الإلكتروني", selectedAccount.email],
                ["رقم الهاتف", selectedAccount.phone],
                ["تاريخ الانضمام", formatDate(selectedAccount.joinDate)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#EEF0F3] bg-[#FAFBFC] p-3"
                >
                  <p className="text-[10px] text-[#8A8D95]">{label}</p>
                  <p className="mt-1 break-words text-[12px] font-semibold text-[#00163B]">
                    {value}
                  </p>
                </div>
              ))}

              <div className="sm:col-span-2 rounded-xl border border-[#EEF0F3] bg-[#FAFBFC] p-3">
                <p className="text-[10px] text-[#8A8D95]">الحالة</p>
                <div className="mt-2">
                  <StatusBadge status={selectedAccount.status} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-[#EEF0F3] px-5 py-4">
              <button
                type="button"
                onClick={() => updateAccountStatus(selectedAccount.id, "مقبول")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#15803D] px-4 text-[11px] font-semibold text-white transition hover:bg-[#126C34]"
              >
                <FiCheck size={14} aria-hidden="true" />
                قبول
              </button>
              <button
                type="button"
                onClick={() =>
                  updateAccountStatus(selectedAccount.id, "تحتاج تعديلات")
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#EEF3FA] px-4 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#E2E9F3]"
              >
                <FiEdit3 size={14} aria-hidden="true" />
                طلب تعديلات
              </button>
              <button
                type="button"
                onClick={() => setRejectingAccount(selectedAccount)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#FDECEC] px-4 text-[11px] font-semibold text-[#C93C3C] transition hover:bg-[#F9DDDD]"
              >
                <FiX size={14} aria-hidden="true" />
                رفض
              </button>
            </div>
          </section>
        </div>
      )}

      {rejectingAccount && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#00163B]/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setRejectingAccount(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reject-admin-user-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC] text-[#C93C3C]">
              <FiXCircle size={22} aria-hidden="true" />
            </span>
            <h2
              id="reject-admin-user-title"
              className="mt-4 text-center text-[17px] font-bold text-[#00163B]"
            >
              تأكيد رفض الحساب
            </h2>
            <p className="mt-2 text-center text-[12px] leading-6 text-[#747780]">
              هل تريد رفض حساب <strong>{rejectingAccount.name}</strong>؟ سيتم تحديث
              الحالة محليًا إلى "مرفوض".
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setRejectingAccount(null)}
                className="h-10 min-w-[110px] rounded-lg border border-[#DDE1E7] bg-white px-4 text-[12px] font-semibold text-[#44474F] transition hover:bg-[#F4F6F9]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="h-10 min-w-[110px] rounded-lg bg-[#C93C3C] px-4 text-[12px] font-semibold text-white transition hover:bg-[#B73333]"
              >
                تأكيد الرفض
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
