/*
 * عميل Gemini للشات بوت.
 *
 * نستخدم fetch مباشرة وليس الـ axios instance في services/api.js: ذاك يحقن
 * توكن Sanctum الخاص بالمستخدم في كل طلب، ولا يجوز أن يُرسل توكن جلسته
 * إلى Google.
 *
 * تنبيه: المفتاح يُحقن وقت البناء عبر define في vite.config.js فيُحزَم داخل
 * ملفات JS التي ينزّلها المتصفح، أي أنه مكشوف لأي زائر. قيّد المفتاح بـ HTTP
 * referrer من Google Cloud Console. لنقل النداء لاحقاً إلى خادم وسيط يكفي
 * تعديل هذا الملف وحده.
 */

/*
 * نماذج الطبقة المجانية بالترتيب. الأول هو المفضّل، وما بعده احتياط يُجرَّب
 * حين يفشل الذي قبله بسبب سحب النموذج (404) أو نفاد حصته (429) أو تعطّل
 * الخدمة (5xx). الأخير اسم متحرّك تديره Google، فيبقى صالحاً حتى لو سُحب
 * الاسمان المثبّتان فوقه.
 */
const MODELS = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-flash-latest"];

/*
 * النموذج الذي نجح آخر مرة. بعد أول تحويل نبدأ منه مباشرة بدل دفع ثمن نداء
 * فاشل مع كل رسالة. يعود إلى الصفر مع كل إعادة تحميل للصفحة.
 */
let activeModelIndex = 0;

function endpointFor(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

// أخطاء يُرجى أن يصلحها نموذج آخر: سُحب النموذج، أو نفدت حصته، أو تعطّل.
function isModelFailure(status) {
  return status === 404 || status === 429 || status >= 500;
}

/*
 * ثابت يستبدله Vite نصياً وقت البناء بقيمة GEMINI_API_KEY. حارس typeof يمنع
 * ReferenceError لو نُفِّذ الملف خارج بناء Vite (اختبارات مثلاً).
 */
const API_KEY =
  typeof __GEMINI_API_KEY__ === "string" ? __GEMINI_API_KEY__ : "";

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

  // نصل هنا بعد استنفاد كل النماذج، أي أن الأسماء في MODELS سُحبت كلها.
  if (status === 404) {
    return "النماذج المستخدمة غير متاحة. حدّث قائمة MODELS في services/chatbot/gemini.js.";
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
 * يرسل المحادثة ويعيد نص الرد، ويتحوّل تلقائياً إلى النموذج التالي في MODELS
 * حين يفشل الحالي فشلاً يُرجى أن يصلحه غيره.
 * يرمي Error برسالة عربية جاهزة للعرض.
 */
export async function askGemini({ systemInstruction, messages, signal }) {
  if (!isChatbotConfigured()) {
    throw new Error(
      "المساعد غير مُفعّل حالياً: مفتاح الخدمة غير مضبوط. أضف GEMINI_API_KEY في ملف .env أو في متغيّرات البيئة على الاستضافة.",
    );
  }

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: toGeminiContents(messages),
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  });

  let response = null;
  let lastStatus = null;

  // نبدأ من آخر نموذج ناجح وندور على البقية، فلا يُستبعد نموذج تعافى لاحقاً.
  for (let attempt = 0; attempt < MODELS.length; attempt += 1) {
    const index = (activeModelIndex + attempt) % MODELS.length;

    let attemptResponse;

    try {
      attemptResponse = await fetch(
        `${endpointFor(MODELS[index])}?key=${encodeURIComponent(API_KEY)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal,
          body,
        },
      );
    } catch (error) {
      // الإلغاء يُمرَّر كما هو ليتعامل معه المستدعي بصمت.
      if (error?.name === "AbortError") throw error;

      // انقطاع الشبكة لا علاقة له بالنموذج، فتجريب غيره هدر للوقت.
      throw new Error("تعذّر الاتصال بالخدمة، تحقق من اتصالك بالإنترنت.", {
        cause: error,
      });
    }

    if (attemptResponse.ok) {
      // نثبّت الناجح فلا ندفع ثمن نداء فاشل مع كل رسالة تالية.
      activeModelIndex = index;
      response = attemptResponse;
      break;
    }

    lastStatus = attemptResponse.status;

    // 400 و403 خطأ في المفتاح نفسه، ولا يصلحه تبديل النموذج.
    if (!isModelFailure(lastStatus)) break;
  }

  if (!response) {
    throw new Error(readErrorMessage(lastStatus));
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
