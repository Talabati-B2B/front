import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { RiRobot2Line } from "react-icons/ri";
import { IoClose, IoSend } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { MAX_INPUT_LENGTH } from "../../services/chatbot/gemini";

import ChatMessage from "./ChatMessage";
import { useChatbot } from "./useChatbot";

// صفحات لا يظهر فيها المساعد: المصادقة لا تحتمل تشتيتاً، ولوحة الأدمن
// أداة تشغيل داخلية لا جمهور لها.
const HIDDEN_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/account-rejected",
];

export default function ChatWidget() {
  const { pathname } = useLocation();
  const { role } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const { messages, isLoading, error, sendMessage, resetChat, suggestions } =
    useChatbot();

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const isHidden =
    role === "admin" ||
    pathname.startsWith("/admin") ||
    HIDDEN_PATHS.includes(pathname);

  // التمرير لآخر رسالة عند كل تحديث.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading, error]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // الإغلاق بمفتاح Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // إخفاء النافذة إذا انتقل المستخدم لصفحة غير مخدومة.
  useEffect(() => {
    if (isHidden) setIsOpen(false);
  }, [isHidden]);

  if (isHidden) return null;

  const submit = (text) => {
    sendMessage(text);
    setDraft("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(draft);
  };

  return (
    /*
     * items-start وليس items-end: الاتجاه rtl فبداية المحور المتقاطع هي
     * اليمين الفيزيائي. مع items-end كان الزر يقفز لليسار حين تتسع الحاوية
     * بعرض اللوحة المفتوحة.
     */
    <div
      dir="rtl"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-start gap-3"
    >
      {/*
       * إظهار وإخفاء شرطي مع animate-fadeIn من index.css بدل motion:
       * حركة الخروج في AnimatePresence كانت تُبقي اللوحة في الـ DOM بشفافية
       * صفر وهي ما زالت تلتقط النقر فتحجب الصفحة خلفها.
       */}
      {isOpen && (
          <div
            role="dialog"
            aria-label="مساعد طلباتي"
            className="animate-fadeIn flex h-[70vh] max-h-[520px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#03295C] px-4 py-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <RiRobot2Line size={19} />
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-semibold">مساعد طلباتي</h2>
                <p className="text-[12px] text-white/70">
                  {isLoading ? "يكتب الآن..." : "جاهز للإجابة على أسئلتك"}
                </p>
              </div>

              <button
                type="button"
                onClick={resetChat}
                aria-label="بدء محادثة جديدة"
                title="محادثة جديدة"
                className="rounded-lg p-1.5 transition hover:bg-white/15"
              >
                <FiRefreshCw size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق المحادثة"
                className="rounded-lg p-1.5 transition hover:bg-white/15"
              >
                <IoClose size={19} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-4 py-4"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  text={message.text}
                />
              ))}

              {isLoading && (
                <ChatMessage role="bot" text="جاري كتابة الرد..." />
              )}

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] leading-6 text-red-600">
                  {error}
                </p>
              )}

              {/* الأسئلة المقترحة تظهر قبل أول سؤال فقط */}
              {messages.length === 1 && !isLoading && (
                <div className="mt-1 flex flex-col gap-2">
                  {suggestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => submit(question)}
                      className="rounded-xl border border-[#F2762E]/40 px-3 py-2 text-right text-[13px] text-[#F2762E] transition hover:bg-[#F2762E]/10"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={MAX_INPUT_LENGTH}
                placeholder="اكتب سؤالك هنا..."
                aria-label="اكتب سؤالك"
                className="min-w-0 flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-[14px] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#F2762E]/40"
              />

              <button
                type="submit"
                disabled={isLoading || !draft.trim()}
                aria-label="إرسال"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2762E] text-white transition hover:bg-[#d96524] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IoSend size={17} className="rotate-180" />
              </button>
            </form>
          </div>
      )}

      {/* الأيقونة الثابتة */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "إغلاق مساعد طلباتي" : "افتح مساعد طلباتي"}
        aria-expanded={isOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F2762E] text-white shadow-lg transition hover:scale-105 hover:bg-[#d96524] focus:ring-4 focus:ring-[#F2762E]/30 focus:outline-none"
      >
        {isOpen ? <IoClose size={24} /> : <RiRobot2Line size={24} />}
      </button>
    </div>
  );
}
