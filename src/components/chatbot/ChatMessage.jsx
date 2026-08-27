import { RiRobot2Line } from "react-icons/ri";

// فقاعة رسالة واحدة. رسالة البوت على اليمين مع أيقونة، ورسالة المستخدم
// على اليسار بلون الهوية.
export default function ChatMessage({ role, text }) {
  const isBot = role === "bot";

  return (
    <div className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#03295C] text-white">
          <RiRobot2Line size={15} />
        </span>
      )}

      <p
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-7 whitespace-pre-wrap ${
          isBot
            ? "rounded-tr-sm bg-gray-100 text-gray-800"
            : "rounded-tl-sm bg-[#F2762E] text-white"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
