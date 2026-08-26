import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiExternalLink,
  FiEye,
  FiLoader,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiUserCheck,
  FiUsers,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import {
  ACCOUNT_STATUS,
  approveAccount,
  fetchApprovalAccounts,
  rejectAccount,
  requestAccountChanges,
} from "../../services/admin/accountApproval";
import { getApiErrorMessage } from "../../utils/apiError";

const PAGE_SIZE = 6;

const LOAD_ERROR_FALLBACK = "تعذّر تحميل طلبات الانضمام";

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

const statusLabels = {
  [ACCOUNT_STATUS.UNDER_REVIEW]: "قيد المراجعة",
  [ACCOUNT_STATUS.NEED_CHANGES]: "تحتاج تعديلات",
  [ACCOUNT_STATUS.APPROVED]: "مقبول",
  [ACCOUNT_STATUS.REJECTED]: "مرفوض",
};

// حوار السبب مشترك بين الرفض وطلب التعديلات، فكلاهما يشترط نصاً على السيرفر.
const REASON_DIALOGS = {
  [ACCOUNT_STATUS.REJECTED]: {
    title: "تأكيد رفض الحساب",
    description: 'سيتم تحديث حالة الحساب إلى "مرفوض" وإشعار صاحبه بالسبب.',
    label: "سبب الرفض",
    placeholder: "اكتب سبب رفض الحساب...",
    confirmText: "تأكيد الرفض",
    icon: FiXCircle,
    iconClass: "bg-[#FDECEC] text-[#C93C3C]",
    confirmClass: "bg-[#C93C3C] hover:bg-[#B43434]",
    focusClass: "focus:border-[#C93C3C] focus:ring-[#C93C3C]/10",
  },
  [ACCOUNT_STATUS.NEED_CHANGES]: {
    title: "طلب تعديلات على الحساب",
    description:
      "سيصل صاحب الحساب إشعار بالملاحظات ويمكنه تحديث بياناته وإعادة تقديمها.",
    label: "الملاحظات المطلوب تعديلها",
    placeholder: "اكتب الملاحظات المطلوب من صاحب الحساب تعديلها...",
    confirmText: "إرسال الملاحظات",
    icon: FiEdit3,
    iconClass: "bg-[#EEF3FA] text-[#40577B]",
    confirmClass: "bg-[#40577B] hover:bg-[#334764]",
    focusClass: "focus:border-[#40577B] focus:ring-[#40577B]/10",
  },
};

function StatusBadge({ status }) {
  const label = statusLabels[status] ?? status;

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[label] ?? "bg-[#F1F3F5] text-[#5F6368]"}`}
    >
      {label}
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

// السيرفر يرجّع created_at بصيغة ISO كاملة وليس تاريخاً مجرداً.
function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function AdminAccountReview() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyAccountId, setBusyAccountId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  // { account, status } — status يحدد أي نسخة من حوار السبب تُعرض
  const [reasonDialog, setReasonDialog] = useState(null);
  const [reasonText, setReasonText] = useState("");

  // التحميل الأول: لا نغيّر أي حالة بشكل متزامن داخل الـ effect، بل داخل
  // الـ callbacks فقط، مع حارس يمنع التحديث بعد فك التركيب.
  useEffect(() => {
    let active = true;

    fetchApprovalAccounts()
      .then((rows) => {
        if (active) setAccounts(rows);
      })
      .catch((error) => {
        if (active) setLoadError(getApiErrorMessage(error, LOAD_ERROR_FALLBACK));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // إعادة التحميل اليدوية وبعد كل إجراء إداري
  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      setAccounts(await fetchApprovalAccounts());
    } catch (error) {
      setLoadError(getApiErrorMessage(error, LOAD_ERROR_FALLBACK));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const underReviewAccounts = accounts.filter(
      (account) => account.status === ACCOUNT_STATUS.UNDER_REVIEW,
    );

    return [
      {
        label: "إجمالي الحسابات قيد المراجعة",
        value: underReviewAccounts.length,
        icon: FiUsers,
        iconClass: "bg-[#EEF3FA] text-[#40577B]",
      },
      {
        label: "الموردون قيد المراجعة",
        value: underReviewAccounts.filter(
          (account) => account.accountType === "مورد",
        ).length,
        icon: FiUserCheck,
        iconClass: "bg-[#EAF7F8] text-[#0B7890]",
      },
      {
        label: "المتاجر قيد المراجعة",
        value: underReviewAccounts.filter(
          (account) => account.accountType === "متجر",
        ).length,
        icon: FiShoppingBag,
        iconClass: "bg-[#FFF2E8] text-[#F2762E]",
      },
      {
        label: "تحتاج إلى تعديلات",
        value: accounts.filter(
          (account) => account.status === ACCOUNT_STATUS.NEED_CHANGES,
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
        statusFilter === "الكل" || statusLabels[account.status] === statusFilter;

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

  // كل إجراء يعيد تحميل القوائم من السيرفر: الحساب ينتقل بين أربعة مسارات
  // مختلفة حسب حالته الجديدة، فالتحديث المحلي وحده يترك الجدول غير متطابق.
  const runAccountAction = async (accountId, action, failureMessage) => {
    setBusyAccountId(accountId);
    setActionError("");

    try {
      await action();
      await loadAccounts();
      setSelectedAccount(null);

      return true;
    } catch (error) {
      setActionError(getApiErrorMessage(error, failureMessage));

      return false;
    } finally {
      setBusyAccountId(null);
    }
  };

  const handleApprove = (accountId) =>
    runAccountAction(
      accountId,
      () => approveAccount(accountId),
      "تعذّر قبول الحساب",
    );

  const openReasonDialog = (account, status) => {
    setReasonDialog({ account, status });
    setReasonText(
      status === ACCOUNT_STATUS.REJECTED
        ? (account.rejectionReason ?? "")
        : (account.needChangesReason ?? ""),
    );
  };

  const closeReasonDialog = () => {
    setReasonDialog(null);
    setReasonText("");
  };

  const confirmReasonDialog = async () => {
    const reason = reasonText.trim();
    if (!reasonDialog || !reason) return;

    const { account, status } = reasonDialog;
    const isRejection = status === ACCOUNT_STATUS.REJECTED;

    const succeeded = await runAccountAction(
      account.id,
      () =>
        isRejection
          ? rejectAccount(account.id, reason)
          : requestAccountChanges(account.id, reason),
      isRejection ? "تعذّر رفض الحساب" : "تعذّر إرسال طلب التعديلات",
    );

    if (succeeded) closeReasonDialog();
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

  const activeDialog = reasonDialog
    ? REASON_DIALOGS[reasonDialog.status]
    : null;
  const DialogIcon = activeDialog?.icon;
  const isDialogBusy = busyAccountId === reasonDialog?.account?.id;

  return (
    <div dir="rtl" className="w-full min-w-0 p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[24px] font-bold text-[#00163B] sm:text-[28px]">
              مراجعة الحسابات
            </h1>
            <p className="mt-1 max-w-3xl text-[12px] leading-6 text-[#747780] sm:text-[13px]">
              مراجعة طلبات تسجيل الموردين والمتاجر واتخاذ الإجراء المناسب على حالة كل حساب قبل اعتماده.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAccounts}
            disabled={isLoading}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DDE1E7] bg-white px-3.5 text-[12px] font-semibold text-[#40577B] transition hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw
              size={14}
              className={isLoading ? "animate-spin" : undefined}
              aria-hidden="true"
            />
            تحديث
          </button>
        </header>

        {actionError ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-[#F2D1D1] bg-[#FDECEC] px-4 py-3 text-[12px] font-semibold text-[#C93C3C]"
          >
            <FiAlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {actionError}
          </div>
        ) : null}

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
                      {isLoading ? "—" : stat.value}
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
                  ابحث وفلتر حسابات الموردين والمتاجر ثم حدّث حالة كل طلب
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <FiLoader
                          size={26}
                          className="animate-spin text-[#40577B]"
                          aria-hidden="true"
                        />
                        <p className="mt-3 text-[13px] font-semibold text-[#00163B]">
                          جارٍ تحميل طلبات الانضمام...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : loadError ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC] text-[#C93C3C]">
                          <FiAlertCircle size={21} aria-hidden="true" />
                        </span>
                        <p className="mt-3 text-[13px] font-semibold text-[#00163B]">
                          {loadError}
                        </p>
                        <button
                          type="button"
                          onClick={loadAccounts}
                          className="mt-4 h-9 rounded-lg bg-[#00163B] px-4 text-[12px] font-semibold text-white transition hover:bg-[#062454]"
                        >
                          إعادة المحاولة
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : visibleAccounts.length > 0 ? (
                  visibleAccounts.map((account) => {
                    const isBusy = busyAccountId === account.id;

                    return (
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
                          {account.phone || "—"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {formatDate(account.submittedAt)}
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
                              disabled={
                                isBusy ||
                                account.status === ACCOUNT_STATUS.APPROVED
                              }
                              className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#CFE7D7] bg-[#F4FBF6] px-2.5 text-[11px] font-semibold text-[#15803D] transition hover:bg-[#EAF8EF] disabled:cursor-not-allowed disabled:opacity-40"
                              title={`قبول ${account.name}`}
                            >
                              {isBusy ? (
                                <FiLoader
                                  size={13}
                                  className="animate-spin"
                                  aria-hidden="true"
                                />
                              ) : (
                                <FiCheckCircle size={13} aria-hidden="true" />
                              )}
                              قبول
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openReasonDialog(
                                  account,
                                  ACCOUNT_STATUS.NEED_CHANGES,
                                )
                              }
                              disabled={
                                isBusy ||
                                account.status === ACCOUNT_STATUS.NEED_CHANGES
                              }
                              className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#D7DFEA] bg-[#F7F9FC] px-2.5 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#EEF3FA] disabled:cursor-not-allowed disabled:opacity-40"
                              title={`طلب تعديلات من ${account.name}`}
                            >
                              <FiEdit3 size={13} aria-hidden="true" />
                              طلب تعديلات
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openReasonDialog(account, ACCOUNT_STATUS.REJECTED)
                              }
                              disabled={
                                isBusy ||
                                account.status === ACCOUNT_STATUS.REJECTED
                              }
                              className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#F2D1D1] bg-white px-2.5 text-[11px] font-semibold text-[#C93C3C] transition hover:bg-[#FDECEC] disabled:cursor-not-allowed disabled:opacity-40"
                              title={`رفض ${account.name}`}
                            >
                              <FiXCircle size={13} aria-hidden="true" />
                              رفض
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
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
                  {selectedAccount.ownerName ? (
                    <p className="mt-1 truncate text-[11px] text-[#8A8D95]">
                      صاحب الحساب: {selectedAccount.ownerName}
                    </p>
                  ) : null}
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
                    {selectedAccount.phone || "—"}
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
                    {formatDate(selectedAccount.submittedAt)}
                  </dd>
                </div>

                {selectedAccount.location ? (
                  <div className="rounded-lg border border-[#EEF0F3] p-3.5 sm:col-span-2">
                    <dt className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A8D95]">
                      <FiMapPin size={13} aria-hidden="true" />
                      الموقع
                    </dt>
                    <dd className="mt-2 text-[12px] font-semibold text-[#191C1D]">
                      {selectedAccount.location}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {selectedAccount.documentUrl ? (
                <a
                  href={selectedAccount.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DDE1E7] bg-white px-3.5 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#EEF3FA]"
                >
                  <FiExternalLink size={14} aria-hidden="true" />
                  عرض السجل التجاري
                </a>
              ) : (
                <p className="mt-4 text-[11px] text-[#8A8D95]">
                  لم يُرفع سجل تجاري لهذا الحساب.
                </p>
              )}

              {selectedAccount.needChangesReason ? (
                <div className="mt-4 rounded-lg border border-[#D7DFEA] bg-[#F7F9FC] p-3.5">
                  <p className="text-[11px] font-medium text-[#8A8D95]">
                    ملاحظات التعديل المرسلة سابقاً
                  </p>
                  <p className="mt-2 text-[12px] leading-6 text-[#333842]">
                    {selectedAccount.needChangesReason}
                  </p>
                </div>
              ) : null}

              {selectedAccount.rejectionReason ? (
                <div className="mt-4 rounded-lg border border-[#F2D1D1] bg-[#FDECEC] p-3.5">
                  <p className="text-[11px] font-medium text-[#C93C3C]">
                    سبب الرفض
                  </p>
                  <p className="mt-2 text-[12px] leading-6 text-[#333842]">
                    {selectedAccount.rejectionReason}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#EEF0F3] bg-[#FAFBFC] px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  openReasonDialog(selectedAccount, ACCOUNT_STATUS.NEED_CHANGES)
                }
                disabled={
                  selectedAccount.status === ACCOUNT_STATUS.NEED_CHANGES ||
                  busyAccountId === selectedAccount.id
                }
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D7DFEA] bg-white px-3.5 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#EEF3FA] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiEdit3 size={14} aria-hidden="true" />
                طلب تعديلات
              </button>
              <button
                type="button"
                onClick={() =>
                  openReasonDialog(selectedAccount, ACCOUNT_STATUS.REJECTED)
                }
                disabled={
                  selectedAccount.status === ACCOUNT_STATUS.REJECTED ||
                  busyAccountId === selectedAccount.id
                }
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#F2D1D1] bg-white px-3.5 text-[11px] font-semibold text-[#C93C3C] transition hover:bg-[#FDECEC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiXCircle size={14} aria-hidden="true" />
                رفض
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedAccount.id)}
                disabled={
                  selectedAccount.status === ACCOUNT_STATUS.APPROVED ||
                  busyAccountId === selectedAccount.id
                }
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#00163B] px-3.5 text-[11px] font-semibold text-white transition hover:bg-[#062454] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyAccountId === selectedAccount.id ? (
                  <FiLoader size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <FiCheckCircle size={14} aria-hidden="true" />
                )}
                قبول الحساب
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {reasonDialog && activeDialog ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#00163B]/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDialogBusy) {
              closeReasonDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reason-dialog-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="px-5 pt-6 text-center">
              <span
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${activeDialog.iconClass}`}
              >
                <DialogIcon size={22} aria-hidden="true" />
              </span>
              <h2
                id="reason-dialog-title"
                className="mt-4 text-[17px] font-bold text-[#00163B]"
              >
                {activeDialog.title}
              </h2>
              <p className="mt-2 text-[12px] leading-6 text-[#747780]">
                <span className="mx-1 font-bold text-[#00163B]">
                  {reasonDialog.account.name}
                </span>
                — {activeDialog.description}
              </p>
            </div>

            <div className="px-5 pb-1 pt-5">
              <label className="block text-right text-[12px] font-semibold text-[#333842]">
                {activeDialog.label}
                <textarea
                  value={reasonText}
                  onChange={(event) => setReasonText(event.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder={activeDialog.placeholder}
                  className={`mt-2 w-full resize-none rounded-xl border border-[#DDE1E7] bg-white p-3 text-[12px] leading-6 text-[#333842] outline-none transition focus:ring-2 ${activeDialog.focusClass}`}
                />
              </label>
              <p className="mt-1 text-left text-[10px] text-[#A1A3AA]">
                {reasonText.length}/500
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#EEF0F3] bg-[#FAFBFC] px-5 py-4">
              <button
                type="button"
                onClick={closeReasonDialog}
                disabled={isDialogBusy}
                className="h-9 min-w-[100px] rounded-lg border border-[#DDE1E7] bg-white px-4 text-[12px] font-semibold text-[#40577B] transition hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmReasonDialog}
                disabled={!reasonText.trim() || isDialogBusy}
                className={`inline-flex h-9 min-w-[100px] items-center justify-center gap-1.5 rounded-lg px-4 text-[12px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${activeDialog.confirmClass}`}
              >
                {isDialogBusy ? (
                  <FiLoader size={14} className="animate-spin" aria-hidden="true" />
                ) : null}
                {activeDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
