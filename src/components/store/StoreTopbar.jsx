import { useEffect, useRef, useState } from "react";
import { FiBell, FiSearch, FiUser } from "react-icons/fi";
import { FaGlobe, FaRegMoon } from "react-icons/fa";

const RESULT_LABELS = {
  product: "منتج",
  supplier: "مورد",
  order: "طلب",
};

export default function StoreTopbar({
  title = "لوحة التحكم",
  searchPlaceholder = "البحث عن منتجات، موردين، أو طلبات...",
  searchValue = "",
  onSearchChange,
  searchResults = [],
  onSearchResultSelect,
  storeName = "المتجر",
  storeRole = "متجر",
  avatarSrc,
  notifications = [],
  onMarkAllNotificationsRead,
  onNotificationSelect,
  onProfileClick,
  variant = "default",
  onProfileSave,
  onProfileCancel,
  profileHasChanges = false,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    onSearchChange?.(value);
    setSearchOpen(Boolean(value.trim()));
  };

  const handleSearchResult = (result) => {
    onSearchResultSelect?.(result);
    setSearchOpen(false);
  };

  if (variant === "profile") {
    return (
      <header
        dir="rtl"
        className="relative z-30 flex h-20 w-full items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white px-4 shadow-sm sm:px-6"
      >
        <h1 className="text-[19px] font-bold text-[#00163B]">{title}</h1>

        <div className="flex items-center gap-2" dir="rtl">
          <button
            type="button"
            onClick={onProfileCancel}
            className="min-h-9 rounded-lg border border-[#E1E5EA] bg-white px-4 text-[11px] font-semibold text-[#667085] transition-colors hover:bg-[#F7F8FA]"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={onProfileSave}
            disabled={!profileHasChanges}
            className="min-h-9 rounded-lg bg-[#0B356C] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#082A57] disabled:cursor-not-allowed disabled:opacity-50"
          >
            حفظ التعديلات
          </button>
        </div>
      </header>
    );
  }

  return (
    <header
      dir="rtl"
      className="relative z-30 flex h-20 w-full items-center justify-between gap-6 border-b border-[#E5E7EB] bg-[#F7F8FA] px-6 shadow-sm"
    >
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <h1 className="shrink-0 text-[19px] font-bold text-[#00163B]">
          {title}
        </h1>

        <div ref={searchRef} className="relative w-full max-w-[520px]">
          <FiSearch
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777C86]"
            size={18}
          />

          <input
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={() => setSearchOpen(Boolean(searchValue.trim()))}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-11 w-full rounded-lg border border-transparent bg-[#F0F2F5] py-2.5 pr-11 pl-4 text-right text-[14px] text-[#1F2937] outline-none transition placeholder:text-[#8A8F98] focus:border-[#062454]/20 focus:bg-white focus:ring-2 focus:ring-[#062454]/10"
          />

          {searchOpen ? (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-[#E0E4EA] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
              {searchResults.length ? (
                <div className="max-h-80 overflow-y-auto py-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleSearchResult(result)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-right transition-colors hover:bg-[#F7F8FA]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-[#20365A]">
                          {result.label}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-[#7A818D]">
                          {result.meta}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[9px] font-semibold text-[#40577B]">
                        {RESULT_LABELS[result.type] ?? result.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-5 text-center text-[11px] text-[#7A818D]">
                  لا توجد نتائج مطابقة.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4" dir="ltr">
        <div className="flex items-center gap-2 border-r border-[#D9DCE2] pr-4">
          <button
            type="button"
            disabled
            aria-label="اللغة"
            title="تغيير اللغة يحتاج دعم واجهة متعددة اللغات وغير معرّف في Store حالياً"
            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg text-[#44474F] opacity-55"
          >
            <FaGlobe size={18} />
          </button>

          <button
            type="button"
            disabled
            aria-label="تغيير المظهر"
            title="المظهر الداكن غير معرّف في تصميم Store الحالي"
            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg text-[#44474F] opacity-55"
          >
            <FaRegMoon size={18} />
          </button>

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="الإشعارات"
              aria-expanded={notificationsOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#44474F] transition hover:bg-[#ECEEF2] focus:outline-none focus:ring-2 focus:ring-[#062454]/20"
            >
              <FiBell size={19} />

              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#E53935] px-1 text-[9px] font-bold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div
                dir="rtl"
                className="absolute left-0 top-[calc(100%+10px)] z-50 w-[330px] overflow-hidden rounded-xl border border-[#E0E4EA] bg-white text-right shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#ECEEF1] px-4 py-3">
                  <h2 className="text-[13px] font-bold text-[#20365A]">الإشعارات</h2>
                  {unreadCount > 0 ? (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsRead}
                      className="text-[10px] font-semibold text-[#F97316] hover:text-[#D85F09]"
                    >
                      تعليم الكل كمقروء
                    </button>
                  ) : null}
                </div>

                {notifications.length ? (
                  <div className="max-h-[330px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => {
                          onNotificationSelect?.(notification);
                          setNotificationsOpen(false);
                        }}
                        className={`block w-full border-b border-[#F0F1F3] px-4 py-3 text-right transition-colors last:border-b-0 hover:bg-[#F8F9FB] ${
                          notification.read ? "bg-white" : "bg-[#FFF8F2]"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              notification.read ? "bg-[#C5CAD2]" : "bg-[#F97316]"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-[#20365A]">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-[10px] leading-5 text-[#667085]">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-[9px] text-[#9AA0AA]">
                              {notification.createdAt}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-8 text-center text-[11px] text-[#7A818D]">
                    لا توجد إشعارات حالياً.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onProfileClick}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-right transition-colors hover:bg-[#ECEEF2]"
          dir="rtl"
          aria-label="فتح إعدادات الملف الشخصي"
        >
          <div className="text-right leading-tight">
            <p className="max-w-40 truncate text-[14px] font-semibold text-[#00163B]">
              {storeName}
            </p>
            <p className="mt-1 text-[12px] text-[#7A7F89]">{storeRole}</p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7EBF1] ring-1 ring-[#D9DCE2]">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={`صورة ${storeName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <FiUser aria-hidden="true" size={20} className="text-[#40577B]" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
