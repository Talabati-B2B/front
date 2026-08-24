import { useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { recentActivities } from "../services/order/order";

const ACTIVITY_STYLES = {
  accepted: {
    Icon: Check,
    iconClass: "bg-[#DDF8E7] text-[#16834B]",
  },
  pending: {
    Icon: AlertCircle,
    iconClass: "bg-[#FFF0D9] text-[#111827]",
  },
  rejected: {
    Icon: X,
    iconClass: "bg-[#FFE2E2] text-[#FF3B3B]",
  },
};

export default function RecentActivities() {
  const [showAll, setShowAll] = useState(false);

  const visibleActivities = showAll
    ? recentActivities
    : recentActivities.slice(0, 3);

  return (
    <section
      dir="rtl"
      className="flex h-full min-w-0 flex-col rounded-[14px] border border-[#E7E9ED] bg-white px-6 py-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
    >
      <h2 className="mb-7 text-[20px] font-bold text-[#111827]">
        آخر النشاطات
      </h2>

      <div className="flex flex-1 flex-col gap-7">
        {visibleActivities.map((activity) => {
          const style =
            ACTIVITY_STYLES[activity.type] ??
            ACTIVITY_STYLES.pending;

          const Icon = style.Icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3"
            >
              <div
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full ${style.iconClass}`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={2.3}
                />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[14px] font-bold leading-6 text-[#111827]">
                  {activity.title}
                </p>

                <p className="mt-0.5 text-[12px] leading-5 text-[#44474F]">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {recentActivities.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mt-8 min-h-[48px] w-full rounded-[10px] border border-[#B64B00] bg-white px-4 text-[14px] font-bold text-[#B64B00] transition-colors hover:bg-[#FFF7F2]"
        >
          {showAll
            ? "عرض أقل"
            : "مشاهدة جميع النشاطات"}
        </button>
      )}

      {recentActivities.length <= 3 && (
        <button
          type="button"
          disabled
          className="mt-8 min-h-[48px] w-full cursor-default rounded-[10px] border border-[#B64B00] bg-white px-4 text-[14px] font-bold text-[#B64B00]"
        >
          مشاهدة جميع النشاطات
        </button>
      )}
    </section>
  );
}