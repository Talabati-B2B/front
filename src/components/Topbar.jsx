import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiUser } from "react-icons/fi";
import { FaGlobe, FaRegMoon } from "react-icons/fa";
import defaultAvatar from "../assets/images/supplierProfile.svg";
import { useAuth } from "../context/AuthContext";
import * as notificationService from "../services/notificationService";

export default function Topbar({
  title = "ملف الشخصي",
  variant = "default",
  searchPlaceholder = "البحث عن طلبات، منتجات، أو عملاء...",
  searchValue,
  onSearchChange,
  searchItems = [],
  onSearchResultSelect,
  supplierName,
  supplierRole,
  avatarSrc,
  notificationCount,
  showNotificationDot = true,
  notifications: notificationsProp,
  onLanguageClick,
  onThemeClick,
  onNotificationClick,
  onNotificationSelect,
  onProfileClick,
  onProfileSave,
  onProfileCancel,
  profileHasChanges = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [internalSearchValue, setInternalSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [internalNotifications, setInternalNotifications] = useState([]);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  const resolvedSupplierName =
    supplierName ||
    user?.name ||
    user?.company_name ||
    "المستخدم";
  const resolvedSupplierRole = supplierRole || (user?.role === "supplier" ? "المورد" : user?.role === "store" ? "المتجر" : "المستخدم");
  const resolvedAvatar = avatarSrc ?? user?.avatar_url ?? defaultAvatar;

  const isSearchControlled = searchValue !== undefined;
  const resolvedSearchValue = isSearchControlled
    ? searchValue
    : internalSearchValue;

  const resolvedNotifications = Array.isArray(notificationsProp)
    ? notificationsProp
    : internalNotifications;

  const unreadCount = resolvedNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const effectiveNotificationCount =
    typeof notificationCount === "number"
      ? notificationCount
      : unreadCount;

  const filteredSearchItems = useMemo(() => {
    const query = String(resolvedSearchValue ?? "")
      .trim()
      .toLowerCase();

    if (!query) {
      return [];
    }

    return searchItems
      .filter((item) => {
        const values = [item.label, item.meta, ...(item.keywords ?? [])];

        return values.some((value) =>
          String(value ?? "").toLowerCase().includes(query),
        );
      })
      .slice(0, 6);
  }, [resolvedSearchValue, searchItems]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const setSearch = (nextValue) => {
    if (!isSearchControlled) {
      setInternalSearchValue(nextValue);
    }

    onSearchChange?.(nextValue);
    setSearchOpen(Boolean(nextValue.trim()));
  };

  const handleSearchResultClick = (item) => {
    onSearchResultSelect?.(item);

    if (item.route) {
      navigate(item.route);
    }

    setSearch("");
    setSearchOpen(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      return;
    }

    if (event.key === "Enter" && filteredSearchItems[0]) {
      event.preventDefault();
      handleSearchResultClick(filteredSearchItems[0]);
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
      return;
    }

    navigate("/profile");
  };

  useEffect(() => {
    if (Array.isArray(notificationsProp)) return;
    notificationService.fetchNotifications({ per_page: 10 }).then((res) => {
      const items = res.data?.data || res.data || [];
      setInternalNotifications(items.map((n) => ({
        id: n.id,
        title: n.data?.title || n.data?.title_ar || "",
        message: n.data?.message || n.data?.message_ar || "",
        read: !!n.read_at,
        route: n.data?.order_id ? "/orders" : undefined,
      })));
    }).catch(() => {});
  }, [notificationsProp]);

  const persistNotifications = (nextNotifications) => {
    if (!Array.isArray(notificationsProp)) {
      setInternalNotifications(nextNotifications);
    }
  };

  const handleBellClick = () => {
    setNotificationsOpen((open) => !open);
    setSearchOpen(false);
    onNotificationClick?.();
  };

  const handleNotificationItemClick = (notification) => {
    const nextNotifications = resolvedNotifications.map((item) =>
      item.id === notification.id ? { ...item, read: true } : item,
    );

    persistNotifications(nextNotifications);
    notificationService.markAsRead(notification.id).catch(() => {});
    onNotificationSelect?.(notification);
    setNotificationsOpen(false);

    if (notification.route) {
      navigate(notification.route);
    }
  };

  if (variant === "profile") {
    return (
      <header
        dir="rtl"
        className="flex h-20 w-full items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white px-4 shadow-sm sm:px-6"
      >
        <h1 className="text-[19px] font-bold text-[#00163B]">{title}</h1>

        <div className="flex items-center gap-2">
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
      className="relative z-40 flex h-20 w-full items-center justify-between gap-6 border-b border-[#E5E7EB] bg-[#F7F8FA] px-6 shadow-sm"
    >
      <div className="flex min-w-0 flex-1 items-center">
        <div ref={searchRef} className="relative w-full max-w-[520px]">
          <FiSearch
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777C86]"
            size={18}
          />

          <input
            type="search"
            value={resolvedSearchValue ?? ""}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() =>
              setSearchOpen(Boolean(String(resolvedSearchValue ?? "").trim()))
            }
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-expanded={searchOpen}
            className="h-11 w-full rounded-lg border border-transparent bg-[#F0F2F5] py-2.5 pr-11 pl-4 text-right text-[14px] text-[#1F2937] outline-none transition placeholder:text-[#8A8F98] focus:border-[#062454]/20 focus:bg-white focus:ring-2 focus:ring-[#062454]/10"
          />

          {searchOpen ? (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-[#E0E4EA] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
              {filteredSearchItems.length ? (
                <div className="py-2">
                  {filteredSearchItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSearchResultClick(item)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-right transition-colors hover:bg-[#F7F8FA]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-[#20365A]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-[#7A818D]">
                          {item.meta}
                        </p>
                      </div>

                      <FiSearch
                        aria-hidden="true"
                        size={14}
                        className="shrink-0 text-[#98A0AA]"
                      />
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
            onClick={onLanguageClick}
            disabled={!onLanguageClick}
            aria-label="تغيير اللغة"
            title={
              onLanguageClick
                ? "تغيير اللغة"
                : "تغيير اللغة غير مربوط بعد بنظام تعدد اللغات"
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#44474F] transition hover:bg-[#ECEEF2] focus:outline-none focus:ring-2 focus:ring-[#062454]/20 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent"
          >
            <FaGlobe size={18} />
          </button>

          <button
            type="button"
            onClick={onThemeClick}
            disabled={!onThemeClick}
            aria-label="تغيير المظهر"
            title={
              onThemeClick
                ? "تغيير المظهر"
                : "المظهر الداكن غير معرّف في المشروع حالياً"
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#44474F] transition hover:bg-[#ECEEF2] focus:outline-none focus:ring-2 focus:ring-[#062454]/20 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent"
          >
            <FaRegMoon size={18} />
          </button>

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={handleBellClick}
              aria-label="الإشعارات"
              aria-expanded={notificationsOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#44474F] transition hover:bg-[#ECEEF2] focus:outline-none focus:ring-2 focus:ring-[#062454]/20"
            >
              <FiBell size={19} />

              {effectiveNotificationCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#E53935] px-1 text-[9px] font-bold leading-none text-white">
                  {effectiveNotificationCount > 99
                    ? "99+"
                    : effectiveNotificationCount}
                </span>
              ) : showNotificationDot && resolvedNotifications.length > 0 ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[#F7F8FA] bg-[#E53935]" />
              ) : null}
            </button>

            {notificationsOpen ? (
              <div
                dir="rtl"
                className="absolute left-0 top-[calc(100%+10px)] z-50 w-[330px] overflow-hidden rounded-xl border border-[#E0E4EA] bg-white text-right shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
              >
                <div className="border-b border-[#ECEEF1] px-4 py-3">
                  <h2 className="text-[13px] font-bold text-[#20365A]">
                    الإشعارات
                  </h2>
                </div>

                {resolvedNotifications.length ? (
                  <div className="max-h-[330px] overflow-y-auto">
                    {resolvedNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          handleNotificationItemClick(notification)
                        }
                        className={`block w-full border-b border-[#F0F1F3] px-4 py-3 text-right transition-colors last:border-b-0 hover:bg-[#F8F9FB] ${
                          notification.read ? "bg-white" : "bg-[#FFF8F2]"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              notification.read
                                ? "bg-[#C5CAD2]"
                                : "bg-[#F97316]"
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-[#20365A]">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-[10px] leading-5 text-[#667085]">
                              {notification.message}
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
          onClick={handleProfileClick}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-right transition-colors hover:bg-[#ECEEF2] focus:outline-none focus:ring-2 focus:ring-[#062454]/20"
          dir="rtl"
          aria-label="فتح الملف الشخصي للمورد"
        >
          <div className="text-right leading-tight">
            <p className="max-w-40 truncate text-[14px] font-semibold text-[#00163B]">
              {resolvedSupplierName}
            </p>
            <p className="mt-1 text-[12px] text-[#7A7F89]">
              {resolvedSupplierRole}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7EBF1] ring-1 ring-[#D9DCE2]">
            {resolvedAvatar ? (
              <img
                src={resolvedAvatar}
                alt={`صورة ${resolvedSupplierName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <FiUser
                aria-hidden="true"
                size={20}
                className="text-[#40577B]"
              />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
