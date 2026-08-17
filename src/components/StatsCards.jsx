import {
  FileText,
  ClipboardClock,
  PackageOpen,
  TrendingUp,
} from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { orderStats } from "../services/order/order";

const ICONS = {
  total: {
    Icon: FileText,
    className: "bg-[#D8E2FF4D] text-[#00163B]",
    labelColor: "text-[#44474F]",
    valueColor: "text-[#00163B]",
  },
  pending: {
    Icon: ClipboardClock,
    className: "bg-[#FFDBCB4D] text-[#9F4200]",
    labelColor: "text-[#44474F]",
    valueColor: "text-[#9F4200]",
  },
  processing: {
    Icon: PackageOpen,
    className: "bg-[#D8E2FF4D] text-[#00163B]",
    labelColor: "text-[#44474F]",
    valueColor: "text-[#00163B]",
  },
  completed: {
    Icon: FaCheckCircle,
    className: "bg-[#EFF6FF] text-[#2563EB]",
    labelColor: "text-[#44474F]",
    valueColor: "text-[#00163B]",
  },
};

function StatBadge({ badge }) {
  if (!badge) return null;

  if (badge.tone === "success") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#F0FDF4] px-3 py-2 text-[14px] font-bold text-[#16A34A]">
        {badge.text}
        <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#FFDBCB33] px-3 py-2 text-[14px] font-bold text-[#9F4200]">
      {badge.text}
    </span>
  );
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {orderStats.map((stat) => {
        const { Icon, className, labelColor, valueColor } = ICONS[stat.icon];
        return (
          <div
            key={stat.id}
            className="flex flex-col gap-3 rounded-xl border border-[#0000000D] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <StatBadge badge={stat.badge} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-[14px] mb-4 mt-2 font-semibold ${labelColor}`}>
                {stat.label}
              </span>
              <span className={`text-[24px] leading-4 font-bold ${valueColor}`}>
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
