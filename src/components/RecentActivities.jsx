import { Check, AlertCircle, X } from 'lucide-react'
import { recentActivities } from '../services/order/order'

const ACTIVITY_STYLES = {
  accepted: { Icon: Check, className: 'bg-green-100 text-success' },
  pending: { Icon: AlertCircle, className: 'bg-orange-100 text-accent' },
  rejected: { Icon: X, className: 'bg-red-100 text-red-500' },
}

export default function RecentActivities() {
  return (
    <section className="flex flex-col rounded-xl border border-[#F3F4F5] bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-heading">آخر النشاطات</h2>

      <div className="flex flex-1 flex-col">
        {recentActivities.map((activity, index) => {
          const { Icon, className } = ACTIVITY_STYLES[activity.type]
          const isLast = index === recentActivities.length - 1
          return (
            <div key={activity.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${className}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                {!isLast && <span className="w-px flex-1 bg-line" />}
              </div>
              <div className={`flex flex-col ${isLast ? '' : 'pb-6'}`}>
                <span className="text-sm font-bold text-heading">
                  {activity.title}
                </span>
                <span className="text-xs text-body">{activity.time}</span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-lg border border-[#9F4200] px-4 py-2.5 text-sm font-bold text-[#9F4200] transition-colors hover:bg-orange-50"
      >
        مشاهدة جميع النشاطات
      </button>
    </section>
  )
}
