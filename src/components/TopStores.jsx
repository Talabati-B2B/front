import { MoreVertical, Store } from "lucide-react";
import { topStores } from "../services/order/order";

export default function TopStores() {
  return (
    <section className="rounded-xl border border-[#F3F4F5] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-heading">
          المتاجر الأكثر طلباً هذا الأسبوع
        </h2>
        <button
          type="button"
          aria-label="خيارات"
          className="flex h-8 w-8 items-center justify-center rounded-full text-body transition-colors hover:bg-gray-100"
        >
          <MoreVertical className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {topStores.map((store) => (
          <div
            key={store.id}
            className="flex items-center gap-4 rounded-xl bg-[#F3F4F580] px-4 py-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-body">
              <Store className="h-5 w-5" strokeWidth={2} />
            </span>

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-bold text-heading">
                {store.name}
              </span>
              <span className="text-xs text-body">
                {store.activeOrders} طلب فعال
              </span>
            </div>

            <div className="flex w-36 shrink-0 flex-col items-start gap-2">
              <span className="flex items-center gap-1 text-sm font-extrabold text-[#9F4200]">
                <span>₪</span>
                {store.revenue}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#9F4200]"
                  style={{ width: `${store.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}