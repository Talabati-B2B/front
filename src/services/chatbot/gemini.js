/*
 * عميل Gemini للشات بوت.
 *
 * نستخدم fetch مباشرة وليس الـ axios instance في services/api.js: ذاك يحقن
 * توكن Sanctum الخاص بالمستخدم في كل طلب، ولا يجوز أن يُرسل توكن جلسته
 * إلى Google.
 *
 * تنبيه: المفتاح يُقرأ من متغيّر VITE_ فيُحزَم داخل ملفات JS التي ينزّلها
 * المتصفح، أي أنه مكشوف لأي زائر. قيّد المفتاح بـ HTTP referrer من Google
 * Cloud Console. لنقل النداء لاحقاً إلى خادم وسيط يكفي تعديل هذا الملف وحده.
 */

// نموذج الطبقة المجانية — يُغيَّر من هنا فقط.
// ملاحظة: gemini-2.5-flash لم يعد متاحاً للحسابات الجديدة (تردّ Google بـ 404
// موجّهة لهذا النموذج)، فإن ظهر خطأ NOT_FOUND مستقبلاً حدّث هذا السطر.
const MODEL = "gemini-3.6-flash";

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";

// حدود تحمي الحصة المجانية من الاستنزاف.
export const MAX_INPUT_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 8;

/*
 * هذا النموذج تفكيري، وتوكنات التفكير تُحسب ضمن نفس السقف. قياساً على أسئلة
 * الأدوار الثلاثة استهلك التفكير 476–658 توكن قبل أن يبدأ الرد، فسقف 500
 * كان يقطع الإجابة في منتصفها. 2048 يترك هامشاً مريحاً للجواب.
 */
const MAX_OUTPUT_TOKENS = 2048;

export function isChatbotConfigured() {
  return API_KEY.trim().length > 0;
}

// رسائل الواجهة { role: "user" | "bot", text } إلى صيغة محتويات Gemini.
function toGeminiContents(messages) {
  return messages.slice(-MAX_HISTORY_MESSAGES).map((message) => ({
    role: message.role === "bot" ? "model" : "user",
    parts: [{ text: message.text }],
  }));
}

function readErrorMessage(status) {
  if (status === 400 || status === 403) {
    return "مفتاح الخدمة غير صالح أو غير مصرّح له. تواصل مع مسؤول الموقع.";
  }

  // يحدث عادة حين يُسحب النموذج المضبوط في MODEL من الخدمة.
  if (status === 404) {
    return "النموذج المستخدم غير متاح. حدّث قيمة MODEL في services/chatbot/gemini.js.";
  }

  if (status === 429) {
    return "الخدمة مشغولة حالياً بسبب كثرة الطلبات، جرّب بعد قليل.";
  }

  if (status >= 500) {
    return "الخدمة غير متاحة مؤقتاً، حاول مرة أخرى بعد قليل.";
  }

  return "تعذّر الحصول على رد، حاول مرة أخرى.";
}

/*
 * يرسل المحادثة ويعيد نص الرد.
 * يرمي Error برسالة عربية جاهزة للعرض.
 */
export async function askGemini({ systemInstruction, messages, signal }) {
  if (!isChatbotConfigured()) {
    throw new Error(
      "المساعد غير مُفعّل حالياً: مفتاح الخدمة غير مضبوط. أضف VITE_GEMINI_API_KEY في ملف .env.",
    );
  }

  let response;

  try {
    response = await fetch(`${ENDPOINT}?key=${encodeURIComponent(API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    });
  } catch (error) {
    // الإلغاء يُمرَّر كما هو ليتعامل معه المستدعي بصمت.
    if (error?.name === "AbortError") throw error;

    throw new Error("تعذّر الاتصال بالخدمة، تحقق من اتصالك بالإنترنت.", {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new Error(readErrorMessage(response.status));
  }

  const data = await response.json();

  const candidate = data?.candidates?.[0];

  // أجزاء التفكير تأتي ضمن نفس المصفوفة ولا تُعرض للمستخدم.
  const text = candidate?.content?.parts
    ?.filter((part) => part.thought !== true)
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    if (candidate?.finishReason === "MAX_TOKENS") {
      throw new Error("الرد كان أطول من المتاح، جرّب تسأل سؤالاً أكثر تحديداً.");
    }

    throw new Error("لم يصل رد واضح من المساعد، جرّب تصيغ سؤالك بشكل مختلف.");
  }

  // شبكة أمان: النموذج يميل أحياناً لتنسيق ماركداون رغم التعليمات،
  // والواجهة تعرض نصاً عادياً فتظهر النجوم كما هي.
  return text.replace(/\*\*/g, "");
}
