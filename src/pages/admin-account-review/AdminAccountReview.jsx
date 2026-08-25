import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiEye,
  FiMail,
  FiPhone,
  FiSearch,
  FiShoppingBag,
  FiUserCheck,
  FiUsers,
  FiX,
  FiXCircle,
} from "react-icons/fi";

const PAGE_SIZE = 6;

const initialAccounts = [
  {
    id: 1,
    name: "مخازن الأمانة",
    accountType: "مورد",
    email: "alamana.supplier@example.com",
    phone: "0599123456",
    submittedDate: "2026-08-19",
    status: "قيد المراجعة",
  },
  {
    id: 2,
    name: "متجر النور",
    accountType: "متجر",
    email: "alnoor.store@example.com",
    phone: "0568452190",
    submittedDate: "2026-08-19",
    status: "قيد المراجعة",
  },
  {
    id: 3,
    name: "شركة البركة للتوزيع",
    accountType: "مورد",
    email: "baraka.dist@example.com",
    phone: "0597336142",
    submittedDate: "2026-08-18",
    status: "تحتاج تعديلات",
  },
  {
    id: 4,
    name: "سوبر ماركت الأمل",
    accountType: "متجر",
    email: "alamal.market@example.com",
    phone: "0569127584",
    submittedDate: "2026-08-18",
    status: "قيد المراجعة",
  },
  {
    id: 5,
    name: "مؤسسة الخير التجارية",
    accountType: "مورد",
    email: "alkhair.trade@example.com",
    phone: "0598546321",
    submittedDate: "2026-08-17",
    status: "مقبول",
  },
  {
    id: 6,
    name: "متجر الوفاء",
    accountType: "متجر",
    email: "alwafaa.store@example.com",
    phone: "0567029143",
    submittedDate: "2026-08-17",
    status: "تحتاج تعديلات",
  },
  {
    id: 7,
    name: "مخازن الندى",
    accountType: "مورد",
    email: "alnada.supplier@example.com",
    phone: "0596247851",
    submittedDate: "2026-08-16",
    status: "قيد المراجعة",
  },
  {
    id: 8,
    name: "أسواق الهدى",
    accountType: "متجر",
    email: "alhuda.market@example.com",
    phone: "0568912734",
    submittedDate: "2026-08-15",
    status: "مقبول",
  },
  {
    id: 9,
    name: "شركة الإمداد الحديثة",
    accountType: "مورد",
    email: "supply.modern@example.com",
    phone: "0594812637",
    submittedDate: "2026-08-15",
    status: "مرفوض",
  },
  {
    id: 10,
    name: "متجر السلام",
    accountType: "متجر",
    email: "alsalam.store@example.com",
    phone: "0565379182",
    submittedDate: "2026-08-14",
    status: "قيد المراجعة",
  },
  {
    id: 11,
    name: "مخازن السعادة",
    accountType: "مورد",
    email: "alsaada.stock@example.com",
    phone: "0591654382",
    submittedDate: "2026-08-14",
    status: "تحتاج تعديلات",
  },
  {
    id: 12,
    name: "مركز الوفاق التجاري",
    accountType: "متجر",
    email: "alwefaq.center@example.com",
    phone: "0563248719",
    submittedDate: "2026-08-13",
    status: "مرفوض",
  },
];

const statusStyles = {
  "قيد المراجعة": "bg-[#FFF3E8] text-[#D96919]",
  "تحتاج تعديلات": "bg-[#EEF3FA] text-[#40577B]",
  مقبول: "bg-[#EAF8EF] text-[#15803D]",
  مرفوض: "bg-[#FDECEC] text-[#C93C3C]",
};

const accountTypeStyles = {
  مورد: "bg-[#EAF7F8] text-[#0B7890]",
  متجر: "bg-[#FFF2E8] text-[#D96919]",
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

function AccountTypeBadge({ type }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${accountTypeStyles[type] ?? "bg-[#F1F3F5] text-[#5F6368]"}`}
    >
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

export default function AdminAccountReview() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [rejectingAccount, setRejectingAccount] = useState(null);

  const stats = useMemo(() => {
    const pendingAccounts = accounts.filter(
      (account) => account.status === "قيد المراجعة",
    );

    return [
      {
        label: "إجمالي الحسابات قيد المراجعة",
        value: pendingAccounts.length,
        icon: FiUsers,
        iconClass: "bg-[#EEF3FA] text-[#40577B]",
      },
      {
        label: "الموردون قيد المراجعة",
        value: pendingAccounts.filter(
          (account) => account.accountType === "مورد",
        ).length,
        icon: FiUserCheck,
        iconClass: "bg-[#EAF7F8] text-[#0B7890]",
      },
      {
        label: "المتاجر قيد المراجعة",
        value: pendingAccounts.filter(
          (account) => account.accountType === "متجر",
        ).length,
        icon: FiShoppingBag,
        iconClass: "bg-[#FFF2E8] text-[#F2762E]",
      },
      {
        label: "تحتاج إلى تعديلات",
        value: accounts.filter(
          (account) => account.status === "تحتاج تعديلات",
        ).length,
        icon: FiEdit3,
        iconClass: "bg-[#F3F0FF] text-[#6D5BD0]",
      },
    ];
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        !normalizedSearch ||
        account.name.toLowerCase().includes(normalizedSearch) ||
        account.email.toLowerCase().includes(normalizedSearch) ||
        account.phone.includes(normalizedSearch);
      const matchesType =
        typeFilter === "الكل" || account.accountType === typeFilter;
      const matchesStatus =
        statusFilter === "الكل" || account.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const updateAccountStatus = (accountId, status) => {
    setAccounts((current) =>
      current.map((account) =>
        account.id === accountId ? { ...account, status } : account,
      ),
    );

    setSelectedAccount((current) =>
      current?.id === accountId ? { ...current, status } : current,
    );
  };

  const handleApprove = (accountId) => {
    updateAccountStatus(accountId, "مقبول");
  };

  const handleRequestChanges = (accountId) => {
    updateAccountStatus(accountId, "تحتاج تعديلات");
  };

  const confirmReject = () => {
    if (!rejectingAccount) {
      return;
    }

    updateAccountStatus(rejectingAccount.id, "مرفوض");
    setRejectingAccount(null);
  };

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
            مراجعة الحسابات
          </h1>
          <p className="mt-1 max-w-3xl text-[12px] leading-6 text-[#747780] sm:text-[13px]">
            مراجعة طلبات تسجيل الموردين والمتاجر واتخاذ الإجراء المناسب على حالة كل حساب قبل اعتماده.
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
                  الحسابات المقدمة للمراجعة
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  ابحث وفلتر حسابات الموردين والمتاجر ثم حدّث حالة المراجعة محليًا
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap xl:w-auto xl:flex-nowrap">
                <label className="relative min-w-0 flex-1 sm:min-w-[260px] xl:w-[320px] xl:flex-none">
                  <span className="sr-only">البحث في الحسابات</span>
                  <FiSearch
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8D95]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="بحث بالاسم أو البريد أو الهاتف..."
                    className="h-10 w-full rounded-lg border border-[#DDE1E7] bg-white pr-9 pl-3 text-[12px] text-[#191C1D] outline-none transition placeholder:text-[#A1A3AA] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                  />
                </label>

                <select
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                  className="h-10 min-w-[145px] rounded-lg border border-[#DDE1E7] bg-white px-3 text-[12px] text-[#44474F] outline-none focus:border-[#40577B]"
                  aria-label="تصفية حسب نوع الحساب"
                >
                  <option value="الكل">كل الأنواع</option>
                  <option value="مورد">مورد</option>
                  <option value="متجر">متجر</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="h-10 min-w-[160px] rounded-lg border border-[#DDE1E7] bg-white px-3 text-[12px] text-[#44474F] outline-none focus:border-[#40577B]"
                  aria-label="تصفية حسب حالة الحساب"
                >
                  <option value="الكل">كل الحالات</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="تحتاج تعديلات">تحتاج تعديلات</option>
                  <option value="مقبول">مقبول</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[1180px] text-right">
              <thead>
                <tr className="bg-[#F4F6F9] text-[11px] font-semibold text-[#747780]">
                  <th className="px-5 py-3">اسم الحساب</th>
                  <th className="px-5 py-3">النوع</th>
                  <th className="px-5 py-3">البريد الإلكتروني</th>
                  <th className="px-5 py-3">رقم الهاتف</th>
                  <th className="px-5 py-3">تاريخ التقديم</th>
                  <th className="px-5 py-3">الحالة</th>
                  <th className="px-5 py-3 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {visibleAccounts.length > 0 ? (
                  visibleAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-t border-[#EEF0F3] text-[12px] text-[#44474F] transition hover:bg-[#FAFBFC]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#00163B]">
                        <span className="inline-flex items-center gap-2.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF3FA] text-[#40577B]">
                            {account.accountType === "مورد" ? (
                              <FiUserCheck size={16} aria-hidden="true" />
                            ) : (
                              <FiShoppingBag size={16} aria-hidden="true" />
                            )}
                          </span>
                          {account.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <AccountTypeBadge type={account.accountType} />
                      </td>
                      <td className="px-5 py-4" dir="ltr">
                        <span className="block text-left text-[#44474F]">
                          {account.email}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium" dir="ltr">
                        {account.phone}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(account.submittedDate)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={account.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedAccount(account)}
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#DDE1E7] bg-white px-2.5 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#EEF3FA]"
                            title={`عرض ${account.name}`}
                          >
                            <FiEye size={13} aria-hidden="true" />
                            عرض
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApprove(account.id)}
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#CFE7D7] bg-[#F4FBF6] px-2.5 text-[11px] font-semibold text-[#15803D] transition hover:bg-[#EAF8EF]"
                            title={`قبول ${account.name}`}
                          >
                            <FiCheckCircle size={13} aria-hidden="true" />
                            قبول
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRequestChanges(account.id)}
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#D7DFEA] bg-[#F7F9FC] px-2.5 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#EEF3FA]"
                            title={`طلب تعديلات من ${account.name}`}
                          >
                            <FiEdit3 size={13} aria-hidden="true" />
                            طلب تعديلات
                          </button>

                          <button
                            type="button"
                            onClick={() => setRejectingAccount(account)}
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#F2D1D1] bg-white px-2.5 text-[11px] font-semibold text-[#C93C3C] transition hover:bg-[#FDECEC]"
                            title={`رفض ${account.name}`}
                          >
                            <FiXCircle size={13} aria-hidden="true" />
                            رفض
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
                          لا توجد حسابات مطابقة
                        </p>
                        <p className="mt-1 text-[11px] text-[#8A8D95]">
                          جرّب تغيير عبارة البحث أو خيارات التصفية
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#EEF0F3] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[11px] text-[#8A8D95]">
              عرض {filteredAccounts.length === 0 ? 0 : startIndex + 1} -{" "}
              {Math.min(startIndex + PAGE_SIZE, filteredAccounts.length)} من أصل{" "}
              {filteredAccounts.length} حساب
            </p>

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

      {selectedAccount ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00163B]/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAccount(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-details-title"
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-4">
              <div>
                <h2
                  id="account-details-title"
                  className="text-[17px] font-bold text-[#00163B]"
                >
                  تفاصيل الحساب
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  البيانات الأساسية المقدمة للمراجعة
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#747780] transition hover:bg-[#F4F6F9] hover:text-[#00163B]"
                aria-label="إغلاق"
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="flex items-center gap-3 rounded-xl bg-[#F7F9FC] p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF3FA] text-[#40577B]">
                  {selectedAccount.accountType === "مورد" ? (
                    <FiUserCheck size={20} aria-hidden="true" />
                  ) : (
                    <FiShoppingBag size={20} aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-bold text-[#00163B]">
                    {selectedAccount.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <AccountTypeBadge type={selectedAccount.accountType} />
                    <StatusBadge status={selectedAccount.status} />
                  </div>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[#EEF0F3] p-3.5">
                  <dt className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A8D95]">
                    <FiMail size={13} aria-hidden="true" />
                    البريد الإلكتروني
                  </dt>
                  <dd className="mt-2 break-all text-[12px] font-semibold text-[#191C1D]" dir="ltr">
                    {selectedAccount.email}
                  </dd>
                </div>

                <div className="rounded-lg border border-[#EEF0F3] p-3.5">
                  <dt className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A8D95]">
                    <FiPhone size={13} aria-hidden="true" />
                    رقم الهاتف
                  </dt>
                  <dd className="mt-2 text-[12px] font-semibold text-[#191C1D]" dir="ltr">
                    {selectedAccount.phone}
                  </dd>
                </div>

                <div className="rounded-lg border border-[#EEF0F3] p-3.5">
                  <dt className="text-[11px] font-medium text-[#8A8D95]">
                    رقم الحساب
                  </dt>
                  <dd className="mt-2 text-[12px] font-semibold text-[#191C1D]">
                    #{selectedAccount.id.toString().padStart(4, "0")}
                  </dd>
                </div>

                <div className="rounded-lg border border-[#EEF0F3] p-3.5">
                  <dt className="text-[11px] font-medium text-[#8A8D95]">
                    تاريخ التقديم
                  </dt>
                  <dd className="mt-2 text-[12px] font-semibold text-[#191C1D]">
                    {formatDate(selectedAccount.submittedDate)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#EEF0F3] bg-[#FAFBFC] px-5 py-4">
              <button
                type="button"
                onClick={() => handleRequestChanges(selectedAccount.id)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D7DFEA] bg-white px-3.5 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#EEF3FA]"
              >
                <FiEdit3 size={14} aria-hidden="true" />
                طلب تعديلات
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectingAccount(selectedAccount);
                  setSelectedAccount(null);
                }}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#F2D1D1] bg-white px-3.5 text-[11px] font-semibold text-[#C93C3C] transition hover:bg-[#FDECEC]"
              >
                <FiXCircle size={14} aria-hidden="true" />
                رفض
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedAccount.id)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#00163B] px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#062454]"
              >
                <FiCheckCircle size={14} aria-hidden="true" />
                قبول الحساب
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {rejectingAccount ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#00163B]/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setRejectingAccount(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-account-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="px-5 pt-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC] text-[#C93C3C]">
                <FiXCircle size={22} aria-hidden="true" />
              </span>
              <h2
                id="reject-account-title"
                className="mt-4 text-[17px] font-bold text-[#00163B]"
              >
                تأكيد رفض الحساب
              </h2>
              <p className="mt-2 text-[12px] leading-6 text-[#747780]">
                هل أنت متأكد من رفض حساب
                <span className="mx-1 font-bold text-[#00163B]">
                  {rejectingAccount.name}
                </span>
                ؟ سيتم تحديث الحالة محليًا إلى "مرفوض".
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#EEF0F3] bg-[#FAFBFC] px-5 py-4">
              <button
                type="button"
                onClick={() => setRejectingAccount(null)}
                className="h-9 min-w-[100px] rounded-lg border border-[#DDE1E7] bg-white px-4 text-[12px] font-semibold text-[#40577B] transition hover:bg-[#F4F6F9]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="h-9 min-w-[100px] rounded-lg bg-[#C93C3C] px-4 text-[12px] font-semibold text-white transition hover:bg-[#B43434]"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
