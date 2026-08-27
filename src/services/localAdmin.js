/*
 * دخول أدمن محلي: يتحقق من البريد وكلمة المرور داخل المتصفح دون أي نداء
 * للسيرفر، لأن الباك إند لا يملك حساب أدمن متاحاً لنا حالياً.
 *
 * تحذير أمني مقصود: هذه البيانات تُحزَم في ملفات JS التي ينزّلها المتصفح،
 * فأي زائر يقدر يقرأها من DevTools ويدخل الواجهة. الحماية الفعلية تبقى على
 * الباك إند عبر middleware القاعدة role:admin، فنداءات /api/admin/* تُرفض
 * بهذه الجلسة. للإلغاء: احذف هذا الملف واستدعاءاته من authService و api.
 */

// توكن وهمي نميّز به الجلسة المحلية عن توكن Sanctum الحقيقي.
export const LOCAL_ADMIN_TOKEN = "local-admin-session";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? "admin@talabati.com";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "Admin@2026";

export function isLocalAdminSession() {
  return localStorage.getItem("token") === LOCAL_ADMIN_TOKEN;
}

export function matchesLocalAdmin(email, password) {
  const typed = String(email ?? "").trim().toLowerCase();

  return typed === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
}

// نفس شكل رد Laravel حتى تقرأه extractToken و normalizeUser دون تعديل.
export function localAdminPayload() {
  return {
    access_token: LOCAL_ADMIN_TOKEN,
    token_type: "Bearer",
    user: {
      id: 0,
      first_name: "Admin",
      last_name: "System",
      email: ADMIN_EMAIL,
      status: "approved",
      roles: [{ name: "admin" }],
    },
  };
}
