import { FiBell, FiSearch, FiUser } from "react-icons/fi";
import { FaRegMoon } from "react-icons/fa";

export default function AdminTopbar({
  title = "لوحة التحكم",
  searchPlaceholder = "البحث عن مستخدم، طلب، أو منتج...",
  searchValue,
  onSearchChange,
  adminName = "المسؤول",
  adminRole = "مدير النظام",
  avatarSrc,
  notificationCount,
  showNotificationDot = true,
  onNotificationClick,
  onThemeClick,
}) {
  const hasNotificationCount =
    typeof notificationCount === "number" && notificationCount > 0;

  return (
    <header
      dir="rtl"
      className="flex h-20 w-full items-center justify-between gap-6 border-b border-[#E5E7EB] bg-[#F7F8FA] px-6 shadow-sm"
    >
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <h1 className="shrink-0 text-[19px] font-bold text-[#00163B]">
          {title}
        </h1>

        <div className="relative w-full max-w-[520px]">
          <FiSearch
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777C86]"
            size={18}
          />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-11 w-full rounded-lg border border-transparent bg-[#F0F2F5] py-2.5 pr-11 pl-4 text-right text-[14px] text-[#1F2937] outline-none transition placeholder:text-[#8A8F98] focus:border-[#062454]/20 focus:bg-white focus:ring-2 focus:ring-[#062454]/10"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4" dir="ltr">
        <div className="flex items-center gap-2 border-r border-[#D9DCE2] pr-4">
          <button
            type="button"
            onClick={onThemeClick}
            aria-label="تغيير المظهر"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#44474F] transition hover:bg-[#ECEEF2] focus:outline-none focus:ring-2 focus:ring-[#062454]/20"
          >
            <FaRegMoon size={18} />
          </button>

          <button
            type="button"
            onClick={onNotificationClick}
            aria-label="الإشعارات"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#44474F] transition hover:bg-[#ECEEF2] focus:outline-none focus:ring-2 focus:ring-[#062454]/20"
          >
            <FiBell size={19} />

            {hasNotificationCount ? (
              <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#E53935] px-1 text-[9px] font-bold leading-none text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            ) : showNotificationDot ? (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[#F7F8FA] bg-[#E53935]" />
            ) : null}
          </button>
        </div>

        <div className="flex items-center gap-3" dir="rtl">
          <div className="text-right leading-tight">
            <p className="max-w-40 truncate text-[14px] font-semibold text-[#00163B]">
              {adminName}
            </p>
            <p className="mt-1 text-[12px] text-[#7A7F89]">{adminRole}</p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7EBF1] ring-1 ring-[#D9DCE2]">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={`صورة ${adminName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <FiUser aria-hidden="true" size={20} className="text-[#40577B]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
