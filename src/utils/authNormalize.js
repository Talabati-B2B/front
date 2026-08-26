// تطبيع رد الـ auth القادم من Laravel + Spatie Permission.
// شكل الرد: { message, access_token, token_type, user: { ..., status, roles: [{ name }] } }

// التوكن اسمه access_token وليس token
export function extractToken(payload) {
  return payload?.access_token ?? null;
}

// الرول محفوظ كعلاقة roles وليس كحقل نصّي على المستخدم
export function getUserRole(rawUser) {
  return rawUser?.roles?.[0]?.name ?? null;
}

// السيرفر يرجّع password و remember_token داخل كائن المستخدم — نحذفهما قبل التخزين.
// نسطّح الرول لحقل role حتى تقرأه بقية الواجهة مباشرة.
export function normalizeUser(rawUser) {
  if (!rawUser) return null;

  const safeUser = { ...rawUser };

  delete safeUser.password;
  delete safeUser.remember_token;
  delete safeUser.roles;

  return {
    ...safeUser,
    role: getUserRole(rawUser),
  };
}

const ACTIVE_STATUSES = ["approved", "active"];

// حسابات الموردين والمتاجر تمر بمراجعة إدارية قبل الاعتماد،
// فوجهة كل دور تختلف حسب حالة الحساب.
export function resolveHomeRoute(role, status) {
  const isActive = ACTIVE_STATUSES.includes(status);

  if (role === "admin") return "/admin";
  if (role === "supplier") {
    return isActive ? "/supplier-dashboard" : "/supplierpendingdashboard";
  }
  if (role === "store") {
    return isActive ? "/store" : "/store/pending";
  }

  return "/login";
}
