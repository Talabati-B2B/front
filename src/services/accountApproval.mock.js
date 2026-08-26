const ACCOUNTS_KEY = "talabaty-account-approval-accounts";
const NOTIFICATIONS_KEY = "talabaty-account-approval-notifications";

export const ACCOUNT_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  NEEDS_CHANGES: "needs_changes",
});

const STATUS_ALIASES = {
  "قيد المراجعة": ACCOUNT_STATUS.PENDING,
  "تحتاج تعديلات": ACCOUNT_STATUS.NEEDS_CHANGES,
  مقبول: ACCOUNT_STATUS.APPROVED,
  مرفوض: ACCOUNT_STATUS.REJECTED,
  active: ACCOUNT_STATUS.APPROVED,
};

const seedAccounts = [
  [
    1,
    "مخازن الأمانة",
    "مورد",
    "alamana.supplier@example.com",
    "0599123456",
    "2026-08-19",
    ACCOUNT_STATUS.PENDING,
  ],
  [
    2,
    "متجر النور",
    "متجر",
    "alnoor.store@example.com",
    "0568452190",
    "2026-08-19",
    ACCOUNT_STATUS.PENDING,
  ],
  [
    3,
    "شركة البركة للتوزيع",
    "مورد",
    "baraka.dist@example.com",
    "0597336142",
    "2026-08-18",
    ACCOUNT_STATUS.NEEDS_CHANGES,
  ],
  [
    4,
    "سوبر ماركت الأمل",
    "متجر",
    "alamal.market@example.com",
    "0569127584",
    "2026-08-18",
    ACCOUNT_STATUS.PENDING,
  ],
  [
    5,
    "مؤسسة الخير التجارية",
    "مورد",
    "alkhair.trade@example.com",
    "0598546321",
    "2026-08-17",
    ACCOUNT_STATUS.APPROVED,
  ],
  [
    6,
    "متجر الوفاء",
    "متجر",
    "alwafaa.store@example.com",
    "0567029143",
    "2026-08-17",
    ACCOUNT_STATUS.NEEDS_CHANGES,
  ],
  [
    7,
    "مخازن الندى",
    "مورد",
    "alnada.supplier@example.com",
    "0596247851",
    "2026-08-16",
    ACCOUNT_STATUS.PENDING,
  ],
  [
    8,
    "أسواق الهدى",
    "متجر",
    "alhuda.market@example.com",
    "0568912734",
    "2026-08-15",
    ACCOUNT_STATUS.APPROVED,
  ],
  [
    9,
    "شركة الإمداد الحديثة",
    "مورد",
    "supply.modern@example.com",
    "0594812637",
    "2026-08-15",
    ACCOUNT_STATUS.REJECTED,
    "لم تستوفِ المستندات المرفوعة متطلبات اعتماد المورد.",
  ],
  [
    10,
    "متجر السلام",
    "متجر",
    "alsalam.store@example.com",
    "0565379182",
    "2026-08-14",
    ACCOUNT_STATUS.PENDING,
  ],
  [
    11,
    "مخازن السعادة",
    "مورد",
    "alsaada.stock@example.com",
    "0591654382",
    "2026-08-14",
    ACCOUNT_STATUS.NEEDS_CHANGES,
  ],
  [
    12,
    "مركز الوفاق التجاري",
    "متجر",
    "alwefaq.center@example.com",
    "0563248719",
    "2026-08-13",
    ACCOUNT_STATUS.REJECTED,
    "بيانات السجل التجاري تحتاج إلى تحديث قبل إعادة التقديم.",
  ],
  [
    13,
    "مطعم الأمل",
    "متجر",
    "store@test.com",
    "",
    "2026-06-01",
    ACCOUNT_STATUS.APPROVED,
  ],
  [
    14,
    "شركة الأمل",
    "مورد",
    "supplier@test.com",
    "",
    "2026-06-01",
    ACCOUNT_STATUS.APPROVED,
  ],
].map(
  ([
    id,
    name,
    accountType,
    email,
    phone,
    submittedDate,
    status,
    rejectionReason = null,
  ]) => ({
    id,
    name,
    accountType,
    email,
    phone,
    submittedDate,
    status,
    rejectionReason,
  }),
);

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function read(key, fallback) {
  if (!canUseStorage()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Mock persistence is optional when storage is unavailable.
  }
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function normalizeStatus(status) {
  if (Object.values(ACCOUNT_STATUS).includes(status)) {
    return status;
  }

  return STATUS_ALIASES[status] ?? status ?? ACCOUNT_STATUS.PENDING;
}

function sanitizeApprovalAccount(account) {
  const safeAccount = { ...(account ?? {}) };

  delete safeAccount.password;
  delete safeAccount.confirmPassword;
  delete safeAccount.token;

  return {
    ...safeAccount,
    id: safeAccount.id,
    name: safeAccount.name || "حساب جديد",
    accountType:
      safeAccount.accountType === "مورد" || safeAccount.role === "supplier"
        ? "مورد"
        : "متجر",
    email: String(safeAccount.email ?? "").trim(),
    phone: safeAccount.phone || "",
    submittedDate:
      safeAccount.submittedDate || new Date().toISOString().slice(0, 10),
    status: normalizeStatus(safeAccount.status),
    rejectionReason: safeAccount.rejectionReason || null,
  };
}

function nextAccountId(accounts) {
  return (
    accounts.reduce(
      (max, account) => Math.max(max, Number(account.id) || 0),
      0,
    ) + 1
  );
}

function ensureAccounts() {
  const stored = read(ACCOUNTS_KEY, null);

  if (!Array.isArray(stored)) {
    write(ACCOUNTS_KEY, seedAccounts);
    return [...seedAccounts];
  }

  const normalized = stored.map(sanitizeApprovalAccount);

  const existingEmails = new Set(
    normalized.map((account) => normalizeEmail(account.email)),
  );

  let changed = normalized.length !== stored.length;

  seedAccounts.forEach((seed) => {
    if (!existingEmails.has(normalizeEmail(seed.email))) {
      normalized.push(seed);
      existingEmails.add(normalizeEmail(seed.email));
      changed = true;
    }
  });

  if (
    changed ||
    normalized.some(
      (account, index) => account.status !== stored[index]?.status,
    )
  ) {
    write(ACCOUNTS_KEY, normalized);
  }

  return normalized;
}

export function getApprovalAccounts() {
  return ensureAccounts();
}

export function getApprovalAccountById(id) {
  return (
    ensureAccounts().find(
      (account) => String(account.id) === String(id),
    ) ?? null
  );
}

export function getApprovalAccountByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return null;

  return (
    ensureAccounts().find(
      (account) => normalizeEmail(account.email) === normalizedEmail,
    ) ?? null
  );
}

export function upsertApprovalAccount(account) {
  const accounts = ensureAccounts();
  const sanitized = sanitizeApprovalAccount(account);
  const normalizedEmail = normalizeEmail(sanitized.email);

  const existingIndex = accounts.findIndex(
    (item) =>
      (sanitized.id != null && String(item.id) === String(sanitized.id)) ||
      (normalizedEmail && normalizeEmail(item.email) === normalizedEmail),
  );

  const next = [...accounts];

  if (existingIndex >= 0) {
    next[existingIndex] = sanitizeApprovalAccount({
      ...next[existingIndex],
      ...sanitized,
      id: next[existingIndex].id,
    });

    write(ACCOUNTS_KEY, next);

    return next[existingIndex];
  }

  const created = {
    ...sanitized,
    id: sanitized.id ?? nextAccountId(accounts),
  };

  next.push(created);

  write(ACCOUNTS_KEY, next);

  return created;
}

export function ensureApprovalAccount(
  data,
  initialStatus = ACCOUNT_STATUS.PENDING,
) {
  const existing = getApprovalAccountByEmail(data?.email);

  if (existing) {
    return existing;
  }

  return upsertApprovalAccount({
    name:
      data?.name ||
      data?.businessName ||
      `${data?.firstName || ""} ${data?.lastName || ""}`.trim() ||
      "حساب جديد",
    accountType:
      data?.accountType === "مورد" || data?.role === "supplier"
        ? "مورد"
        : "متجر",
    email: data?.email,
    phone: data?.phone || "",
    submittedDate: data?.submittedDate || data?.joinDate,
    status: initialStatus,
    rejectionReason: data?.rejectionReason || null,
  });
}

export function createPendingAccount(data) {
  const existing = getApprovalAccountByEmail(data?.email);

  const account = upsertApprovalAccount({
    ...(existing || {}),
    name:
      data?.businessName ||
      `${data?.firstName || ""} ${data?.lastName || ""}`.trim() ||
      existing?.name ||
      "حساب جديد",
    accountType: data?.role === "supplier" ? "مورد" : "متجر",
    email: data?.email,
    phone: data?.phone || existing?.phone || "",
    submittedDate: new Date().toISOString().slice(0, 10),
    status: ACCOUNT_STATUS.PENDING,
    rejectionReason: null,
  });

  addApprovalNotification({
    accountId: account.id,
    accountName: account.name,
    accountType: account.accountType,
    resubmission: false,
  });

  return account;
}

export function updateApprovalStatus(
  id,
  status,
  rejectionReason = null,
) {
  const normalizedStatus = normalizeStatus(status);
  const accounts = ensureAccounts();

  let updated = null;

  const next = accounts.map((account) => {
    if (String(account.id) !== String(id)) {
      return account;
    }

    updated = {
      ...account,
      status: normalizedStatus,
      rejectionReason:
        normalizedStatus === ACCOUNT_STATUS.REJECTED
          ? String(rejectionReason || "").trim() ||
            "لم يتم اعتماد الحساب. يرجى مراجعة البيانات وإعادة التقديم."
          : null,
    };

    return updated;
  });

  if (!updated) {
    return null;
  }

  write(ACCOUNTS_KEY, next);

  return updated;
}

export function updateApprovalStatusByEmail(
  email,
  status,
  rejectionReason = null,
) {
  const account = getApprovalAccountByEmail(email);

  if (!account) {
    return null;
  }

  return updateApprovalStatus(account.id, status, rejectionReason);
}

export function resubmitApprovalAccount(id) {
  const current = getApprovalAccountById(id);

  if (!current) {
    return null;
  }

  const updated = updateApprovalStatus(
    id,
    ACCOUNT_STATUS.PENDING,
    null,
  );

  if (updated) {
    addApprovalNotification({
      accountId: updated.id,
      accountName: updated.name,
      accountType: updated.accountType,
      resubmission: true,
    });
  }

  return updated;
}

export function resubmitApprovalAccountByEmail(email) {
  const account = getApprovalAccountByEmail(email);

  return account
    ? resubmitApprovalAccount(account.id)
    : null;
}

function normalizeNotification(notification) {
  return {
    id: notification.id,
    title: notification.title || "طلب تسجيل جديد",
    message:
      notification.message ||
      "يوجد طلب حساب جديد يحتاج إلى المراجعة.",
    details:
      notification.details ||
      notification.message ||
      "يوجد طلب حساب جديد يحتاج إلى المراجعة.",
    category: "العملاء",
    timeLabel: notification.timeLabel || "الآن",
    dateTime:
      notification.dateTime ||
      new Date().toLocaleString("ar"),
    source: "إدارة الحسابات",
    sentBy: "النظام",
    relatedEntity:
      notification.relatedEntity ||
      notification.accountName ||
      "",
    accountId: notification.accountId,
    isRead: Boolean(notification.isRead),
    kind: "account-approval",
  };
}

export function addApprovalNotification({
  accountId,
  accountName,
  accountType,
  resubmission = false,
}) {
  const notifications = read(
    NOTIFICATIONS_KEY,
    [],
  );

  const notification = normalizeNotification({
    id: `account-${accountId}-${Date.now()}`,
    accountId,
    accountName,
    title: resubmission
      ? "إعادة تقديم طلب حساب"
      : "طلب تسجيل جديد",
    message: resubmission
      ? `تمت إعادة تقديم طلب ${accountType} ${accountName} ويحتاج إلى مراجعة جديدة.`
      : `تم استلام طلب تسجيل جديد من ${accountType} ${accountName} ويحتاج إلى المراجعة.`,
  });

  write(
    NOTIFICATIONS_KEY,
    [notification, ...notifications],
  );

  return notification;
}

export function getApprovalNotifications() {
  return read(
    NOTIFICATIONS_KEY,
    [],
  ).map(normalizeNotification);
}

export function markApprovalNotificationRead(id) {
  const notifications = getApprovalNotifications();

  const next = notifications.map((notification) =>
    notification.id === id
      ? {
          ...notification,
          isRead: true,
        }
      : notification,
  );

  write(
    NOTIFICATIONS_KEY,
    next,
  );

  return (
    next.find(
      (notification) => notification.id === id,
    ) ?? null
  );
}

export function markAllApprovalNotificationsRead() {
  const next = getApprovalNotifications().map(
    (notification) => ({
      ...notification,
      isRead: true,
    }),
  );

  write(
    NOTIFICATIONS_KEY,
    next,
  );

  return next;
}

export function getAccountStatusForUser(user) {
  if (!user) {
    return null;
  }

  if (user.role === "admin") {
    return ACCOUNT_STATUS.APPROVED;
  }

  const account = getApprovalAccountByEmail(
    user.email,
  );

  if (account) {
    return account.status;
  }

  return normalizeStatus(user.status);
}