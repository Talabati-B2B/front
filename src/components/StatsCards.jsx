import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  ClipboardClock,
  PackageOpen,
  TrendingUp,
} from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import * as supplierOrderService from "../services/supplier/orderService";

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

export default function StatsCards() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supplierOrderService.fetchOrders({ per_page: 100 }).then((res) => {
      const data = res.data;
      setOrders(data?.data || (Array.isArray(data) ? data : []));
    }).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const processing = orders.filter((o) => ["accepted", "preparing", "shipped"].includes(o.status)).length;
    const completed = orders.filter((o) => o.status === "delivered").length;

    return [
      { id: "total", icon: "total", label: "إجمالي الطلبات", value: total },
      { id: "pending", icon: "pending", label: "طلبات معلقة", value: pending },
      { id: "processing", icon: "processing", label: "قيد المعالجة", value: processing },
      { id: "completed", icon: "completed", label: "مكتملة", value: completed },
    ];
  }, [orders]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const { Icon, className, labelColor, valueColor } = ICONS[stat.icon];
        return (
          <div key={stat.id} className="flex flex-col gap-3 rounded-xl border border-[#0000000D] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}>
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-[14px] mb-4 mt-2 font-semibold ${labelColor}`}>{stat.label}</span>
              <span className={`text-[24px] leading-4 font-bold ${valueColor}`}>{stat.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
