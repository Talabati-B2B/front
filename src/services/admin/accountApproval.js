import { api } from "../api";

// حالات الحساب كما يخزّنها الباك إند (عمود users.status).
export const ACCOUNT_STATUS = Object.freeze({
  UNDER_REVIEW: "under_review",
  NEED_CHANGES: "need_changes",
  APPROVED: "approved",
  REJECTED: "rejected",
});

// لكل حالة مسار عرض مستقل في لوحة الأدمن.
const STATUS_ENDPOINTS = Object.freeze({
  [ACCOUNT_STATUS.UNDER_REVIEW]: "/api/admin/under-review-accounts",
  [ACCOUNT_STATUS.NEED_CHANGES]: "/api/admin/need-changes-accounts",
  [ACCOUNT_STATUS.APPROVED]: "/api/admin/approved-accounts",
  [ACCOUNT_STATUS.REJECTED]: "/api/admin/rejected-accounts",
});

// المورد والمتجر جدولان مختلفان بأسماء أعمدة مختلفة، فنوحّدهما بشكل واحد
// تستهلكه الواجهة دون أن تعرف أيّ نوع حساب تعرض.
function normalizeAccount(user, status) {
  const role = user?.roles?.[0]?.name ?? (user?.supplier ? "supplier" : "store");
  const isSupplier = role === "supplier";
  const profile = (isSupplier ? user?.supplier : user?.store) ?? null;

  const ownerName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: user.id,
    role,
    accountType: isSupplier ? "مورد" : "متجر",
    // اسم النشاط هو ما يهم الأدمن، ويبقى اسم صاحب الحساب بديلاً احتياطياً
    name: profile?.company_name || profile?.store_name || ownerName || "—",
    ownerName,
    email: user?.email ?? "",
    phone: user?.mobile || user?.phone || "",
    location: profile?.company_location || profile?.store_location || "",
    submittedAt: user?.created_at ?? null,
    status,
    documentUrl: profile?.commercial_register_url ?? null,
    needChangesReason: profile?.need_changes_reasons ?? null,
    rejectionReason: profile?.rejected_reasons ?? null,
  };
}

/**
 * جلب كل طلبات الانضمام بحالاتها الأربع في نداء واحد من منظور الواجهة.
 * الباك إند يفصلها في أربعة مسارات، فنجمعها هنا ونرتّبها بالأحدث.
 */
export async function fetchApprovalAccounts() {
  const entries = Object.entries(STATUS_ENDPOINTS);

  const responses = await Promise.all(
    entries.map(([, endpoint]) => api.get(endpoint)),
  );

  return responses
    .flatMap((response, index) => {
      const status = entries[index][0];
      const rows = response.data?.data ?? [];

      return rows.map((user) => normalizeAccount(user, status));
    })
    .sort((a, b) => new Date(b.submittedAt ?? 0) - new Date(a.submittedAt ?? 0));
}

export function approveAccount(accountId) {
  return api.post(`/api/admin/accounts/${accountId}/approve`);
}

// السيرفر يشترط سبباً نصياً في الرفض وطلب التعديلات (required|max:500).
export function rejectAccount(accountId, reason) {
  return api.post(`/api/admin/accounts/${accountId}/reject`, {
    rejected_reasons: reason,
  });
}

export function requestAccountChanges(accountId, reason) {
  return api.post(`/api/admin/accounts/${accountId}/need-changes`, {
    need_changes_reasons: reason,
  });
}
