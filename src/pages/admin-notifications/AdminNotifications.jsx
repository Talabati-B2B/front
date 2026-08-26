import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiFileText,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  getApprovalNotifications,
  markAllApprovalNotificationsRead,
  markApprovalNotificationRead,
} from "../../services/accountApproval.mock";

const initialNotifications = [
  {
    id: 1,
    title: "طلب جديد",
    message: "تم استلام طلب جديد رقم #1258 من شركة النور للتجارة.",
    details:
      "تم استلام طلب جديد من شركة النور للتجارة برقم #1258. يرجى مراجعة تفاصيل الطلب واتخاذ الإجراء المناسب.",
    category: "الطلبات",
    timeLabel: "منذ 5 دقائق",
    dateTime: "25 مايو 2026 - 2:15 مساءً",
    source: "نظام الطلبات",
    sentBy: "النظام",
    relatedOrderId: "#1258",
    isRead: false,
    icon: FiShoppingCart,
    iconClass: "bg-[#FFE8D4] text-[#F2762E]",
  },
  {
    id: 2,
    title: "تم اعتماد مورد",
    message: "تم اعتماد مورد \"مؤسسة اليسر\" بنجاح.",
    details:
      "اكتملت مراجعة بيانات مورد مؤسسة اليسر وتم اعتماد الحساب بنجاح ضمن المنصة.",
    category: "العملاء",
    timeLabel: "منذ 15 دقيقة",
    dateTime: "25 مايو 2026 - 2:05 مساءً",
    source: "إدارة الحسابات",
    sentBy: "مدير النظام",
    relatedEntity: "مؤسسة اليسر",
    isRead: false,
    icon: FiUser,
    iconClass: "bg-[#F1DDF3] text-[#9C3AAA]",
  },
  {
    id: 3,
    title: "فاتورة مستحقة",
    message: "فاتورة رقم #INV-2024-045 مستحقة في 30 يونيو 2026.",
    details:
      "يوجد استحقاق مالي للفاتورة رقم #INV-2024-045 بتاريخ 30 يونيو 2026 ويحتاج إلى المتابعة.",
    category: "النظام",
    timeLabel: "منذ 15 دقيقة",
    dateTime: "25 مايو 2026 - 1:58 مساءً",
    source: "النظام المالي",
    sentBy: "النظام",
    relatedEntity: "#INV-2024-045",
    isRead: false,
    icon: FiFileText,
    iconClass: "bg-[#DDF4E4] text-[#20A44B]",
  },
  {
    id: 4,
    title: "تم اعتماد مورد",
    message: "تم اعتماد مورد \"مؤسسة اليسر\" بنجاح.",
    details:
      "تم اعتماد حساب المورد بعد الانتهاء من مراجعة بيانات التسجيل والمستندات المطلوبة.",
    category: "العملاء",
    timeLabel: "منذ 3 ساعات",
    dateTime: "25 مايو 2026 - 11:15 صباحًا",
    source: "إدارة الحسابات",
    sentBy: "مدير النظام",
    relatedEntity: "مؤسسة اليسر",
    isRead: true,
    icon: FiPackage,
    iconClass: "bg-[#E5F2F8] text-[#0B4D84]",
  },
  {
    id: 5,
    title: "تنبيه نظام",
    message: "تم رصد تحديث يحتاج إلى مراجعة في إعدادات النظام.",
    details:
      "تم تسجيل تحديث جديد في إعدادات النظام ويُنصح بمراجعته للتأكد من توافق الإعدادات الحالية.",
    category: "النظام",
    timeLabel: "منذ 1 يوم",
    dateTime: "24 مايو 2026 - 3:40 مساءً",
    source: "النظام",
    sentBy: "النظام",
    isRead: true,
    icon: FiAlertTriangle,
    iconClass: "bg-[#FFDCDC] text-[#C92A2A]",
  },
];

function approvalNotificationToUi(notification) {
  return {
    ...notification,
    icon: FiUser,
    iconClass: "bg-[#F1DDF3] text-[#9C3AAA]",
  };
}

function getInitialNotifications() {
  const approvalNotifications = getApprovalNotifications().map(
    approvalNotificationToUi,
  );
  return [...approvalNotifications, ...initialNotifications];
}

const filters = [
  { label: "الكل" },
  { label: "غير مقروء", unreadOnly: true },
  { label: "الطلبات", icon: FiClipboard },
  { label: "العملاء", icon: FiUsers },
  { label: "النظام", icon: FiSettings },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(getInitialNotifications);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  const selectedNotification = useMemo(
    () =>
      notifications.find(
        (notification) => notification.id === selectedNotificationId,
      ) ?? null,
    [notifications, selectedNotificationId],
  );

  const visibleNotifications = useMemo(() => {
    if (activeFilter === "غير مقروء") {
      return notifications.filter((notification) => !notification.isRead);
    }

    if (activeFilter === "الكل") {
      return notifications;
    }

    return notifications.filter(
      (notification) => notification.category === activeFilter,
    );
  }, [activeFilter, notifications]);

  const markAsRead = (notificationId) => {
    const notification = notifications.find((item) => item.id === notificationId);
    if (notification?.kind === "account-approval") {
      markApprovalNotificationRead(notificationId);
    }

    setNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  };

  const markAllAsRead = () => {
    markAllApprovalNotificationsRead();
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#00163B]">الإشعارات</h1>
            <p className="mt-1.5 text-[13px] text-[#747780]">
              تابع أحدث التنبيهات والتحديثات الخاصة بحسابك
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-[#0B3A73] bg-white px-5 text-[13px] font-semibold text-[#0B3A73] transition hover:bg-[#F5F8FC]"
          >
            <FiCheckCircle size={19} aria-hidden="true" />
            تحديد الكل كمقروء
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.label;

            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter.label)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-6 text-[13px] font-medium transition ${
                  isActive
                    ? "border-[#062454] bg-[#062454] text-white"
                    : "border-[#D7DBE1] bg-white text-[#5F636B] hover:border-[#BFC5CE]"
                }`}
              >
                {filter.unreadOnly ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F2762E]" />
                ) : null}
                {Icon ? <Icon size={17} aria-hidden="true" /> : null}
                {filter.label}
              </button>
            );
          })}
        </div>

        <div
          className={`grid min-w-0 gap-5 ${
            selectedNotification
              ? "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px]"
              : "grid-cols-1"
          }`}
        >
          <div className="min-w-0 space-y-3">
            {visibleNotifications.length ? (
              visibleNotifications.map((notification) => {
                const Icon = notification.icon;
                const isSelected = selectedNotificationId === notification.id;

                return (
                  <article
                    key={notification.id}
                    className={`relative grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-xl border bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.07)] sm:grid-cols-[auto_minmax(0,1fr)_140px] sm:items-center sm:px-5 sm:py-4 ${
                      !notification.isRead
                        ? "border-[#F5B98E] bg-[#FFFDFC]"
                        : "border-[#D9DCE2]"
                    } ${isSelected ? "ring-1 ring-[#F2762E]" : ""}`}
                  >
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${notification.iconClass}`}
                    >
                      <Icon size={24} aria-hidden="true" />
                    </span>

                    <div className="min-w-0 text-right">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-[15px] font-bold text-[#062454]">
                          {notification.title}
                        </h2>
                        {!notification.isRead ? (
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#F2762E]"
                            aria-label="غير مقروء"
                          />
                        ) : null}
                      </div>
                      <p className="mt-1.5 truncate text-[12px] text-[#5F636B] sm:whitespace-normal">
                        {notification.message}
                      </p>
                      {notification.relatedOrderId || notification.relatedEntity ? (
                        <p className="mt-1 text-[11px] text-[#8A8D95]">
                          {notification.relatedOrderId
                            ? `الطلب المرتبط: ${notification.relatedOrderId}`
                            : `الجهة المرتبطة: ${notification.relatedEntity}`}
                        </p>
                      ) : null}
                    </div>

                    <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-start sm:justify-center">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#777B84]">
                        <FiClock size={13} aria-hidden="true" />
                        <span>{notification.timeLabel}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedNotificationId(notification.id)}
                        className={`h-9 min-w-[98px] rounded-lg border px-5 text-[12px] font-medium transition ${
                          notification.isRead
                            ? "border-[#C8CBD1] text-[#8A8D95] hover:bg-[#F6F7F9]"
                            : "border-[#F2762E] text-[#F2762E] hover:bg-[#FFF4EC]"
                        }`}
                      >
                        عرض
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#D9DCE2] bg-white px-6 text-center">
                <FiCheckCircle size={34} className="text-[#AEB4BE]" aria-hidden="true" />
                <h2 className="mt-3 text-[15px] font-bold text-[#00163B]">
                  لا توجد إشعارات
                </h2>
                <p className="mt-1 text-[12px] text-[#8A8D95]">
                  لا توجد إشعارات مطابقة للتصنيف المحدد حاليًا.
                </p>
              </div>
            )}
          </div>

          {selectedNotification ? (
            <aside className="h-fit overflow-hidden rounded-2xl border border-[#D9DCE2] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] xl:sticky xl:top-5">
              <div className="flex items-center justify-between border-b border-[#E7E9ED] px-5 py-4">
                <h2 className="text-[15px] font-bold text-[#00163B]">
                  تفاصيل الإشعار
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedNotificationId(null)}
                  aria-label="إغلاق تفاصيل الإشعار"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A7F89] transition hover:bg-[#F2F4F7]"
                >
                  <FiX size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="px-5 py-5 text-center">
                {(() => {
                  const SelectedIcon = selectedNotification.icon;
                  return (
                    <span
                      className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full ${selectedNotification.iconClass}`}
                    >
                      <SelectedIcon size={32} aria-hidden="true" />
                      {!selectedNotification.isRead ? (
                        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#F2762E]" />
                      ) : null}
                    </span>
                  );
                })()}

                <h3 className="mt-4 text-[15px] font-bold text-[#111827]">
                  {selectedNotification.title}
                </h3>
                <p className="mt-3 text-[12px] leading-6 text-[#5F636B]">
                  {selectedNotification.details}
                </p>
              </div>

              <div className="border-t border-[#E7E9ED] px-5 py-4">
                <dl className="space-y-4 text-[11px]">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 font-semibold text-[#333842]">
                      <FiClock size={15} aria-hidden="true" />
                      التاريخ و الوقت
                    </dt>
                    <dd className="text-left text-[#5F636B]">
                      {selectedNotification.dateTime}
                    </dd>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 font-semibold text-[#333842]">
                      <FiShoppingCart size={15} aria-hidden="true" />
                      المصدر
                    </dt>
                    <dd className="text-[#5F636B]">{selectedNotification.source}</dd>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 font-semibold text-[#333842]">
                      <FiUser size={15} aria-hidden="true" />
                      أرسلت بواسطة
                    </dt>
                    <dd className="text-[#5F636B]">{selectedNotification.sentBy}</dd>
                  </div>

                  {selectedNotification.relatedOrderId ? (
                    <div className="flex items-start justify-between gap-4">
                      <dt className="flex items-center gap-2 font-semibold text-[#333842]">
                        <FiFileText size={15} aria-hidden="true" />
                        الطلب المرتبط
                      </dt>
                      <dd className="font-semibold text-[#0B6EA8]">
                        {selectedNotification.relatedOrderId}
                      </dd>
                    </div>
                  ) : selectedNotification.relatedEntity ? (
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-semibold text-[#333842]">الجهة المرتبطة</dt>
                      <dd className="text-[#5F636B]">
                        {selectedNotification.relatedEntity}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[#E7E9ED] px-5 py-4">
                {selectedNotification.kind === "account-approval" ? (
                  <Link
                    to="/admin/account-review"
                    onClick={() => markAsRead(selectedNotification.id)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#062454] px-4 text-[12px] font-semibold text-white transition hover:bg-[#0A315E]"
                  >
                    مراجعة الحساب
                  </Link>
                ) : null}

                {selectedNotification.relatedOrderId ? (
                  <Link
                    to="/admin/orders"
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#062454] px-4 text-[12px] font-semibold text-white transition hover:bg-[#0A315E]"
                  >
                    عرض الطلب
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={() => markAsRead(selectedNotification.id)}
                  disabled={selectedNotification.isRead}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#0B3A73] bg-white px-4 text-[12px] font-semibold text-[#0B3A73] transition hover:bg-[#F5F8FC] disabled:cursor-default disabled:border-[#D4D8DE] disabled:text-[#A0A4AC] disabled:hover:bg-white"
                >
                  <FiCheckCircle size={15} aria-hidden="true" />
                  {selectedNotification.isRead ? "تمت القراءة" : "تحديد كمقروء"}
                </button>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
