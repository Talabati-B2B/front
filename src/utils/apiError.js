// Laravel يرجّع أخطاء التحقق بالشكل: { message, errors: { field: ["..."] } }
// وبيرجّع { message } لوحدها بأخطاء 401/403.

// الباك إند لا يدعم Accept-Language، فكل رسائل التحقق تعود بالإنجليزية.
// نترجم الشائع منها هنا لحين توطينها من جهة السيرفر.
const MESSAGE_TRANSLATIONS = {
  "These credentials do not match our records.":
    "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "The email has already been taken.": "البريد الإلكتروني مستخدم بالفعل",
  "The mobile has already been taken.": "رقم الموبايل مستخدم بالفعل",
  "The i d number has already been taken.": "رقم الهوية مستخدم بالفعل",
  "The email field is required.": "البريد الإلكتروني مطلوب",
  "The password field is required.": "كلمة المرور مطلوبة",
  "The email field must be a valid email address.":
    "صيغة البريد الإلكتروني غير صحيحة",
  "The password field must be at least 8 characters.":
    "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
  "The password field confirmation does not match.":
    "كلمتا المرور غير متطابقتين",
  "The selected category id is invalid.": "نوع النشاط المحدد غير متاح حالياً",
  "The selected store type id is invalid.": "نوع المتجر المحدد غير متاح حالياً",
  "The commercial register field is required.": "الوثيقة المطلوبة غير مرفوعة",
  "The selected role is invalid.": "نوع الحساب المحدد غير صالح",
  "The token field is required.": "رابط إعادة التعيين غير صالح أو منتهي",
  "This password reset token is invalid.":
    "رابط إعادة التعيين غير صالح أو منتهي",
};

export function translateApiMessage(message) {
  if (!message) return message;
  return MESSAGE_TRANSLATIONS[message] ?? message;
}

export function getApiErrorMessage(error, fallback = "حدث خطأ غير متوقع") {
  if (error?.code === "ERR_NETWORK") {
    return "تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت";
  }

  const data = error?.response?.data;
  if (!data) return error?.message || fallback;

  const firstFieldError = Object.values(data.errors ?? {})[0]?.[0];
  return translateApiMessage(firstFieldError ?? data.message) ?? fallback;
}

// كل رسائل التحقق لكل حقل — لعرضها تحت الحقول بالنماذج
export function getApiFieldErrors(error) {
  const errors = error?.response?.data?.errors ?? {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      messages.map(translateApiMessage),
    ]),
  );
}
