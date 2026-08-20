import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiBell,
  FiBox,
  FiChevronDown,
  FiClipboard,
  FiFileText,
  FiHome,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import logo from "../../assets/images/dachboard_Logo.svg";

const adminNavigation = [
  {
    label: "لوحة التحكم",
    to: "/admin",
    icon: FiHome,
    end: true,
  },
  {
    label: "إدارة المستخدمين",
    to: "/admin/users",
    icon: FiUsers,
  },
  {
    label: "الطلبات",
    to: "/admin/orders",
    icon: FiClipboard,
  },
  {
    label: "الفواتير",
    to: "/admin/invoices",
    icon: FiFileText,
  },
  {
    label: "الإشعارات",
    to: "/admin/notifications",
    icon: FiBell,
  },
  {
    label: "المنتجات",
    to: "/admin/products",
    icon: FiBox,
  },
  // {
  //   label: "إدارة المناطق",
  //   to: "/admin/regions",
  //   icon: FiMapPin,
  // },
  {
    label: "التقارير",
    to: "/admin/reports",
    icon: FiBarChart2,
  },
  {
    label: "الإعدادات",
    to: "/admin/settings",
    icon: FiSettings,
  },
];

export default function AdminSidebar({
  adminName = "المشرف العام",
  adminRole = "مدير النظام",
  avatarSrc,
}) {
  return (
    <aside
      dir="rtl"
      className="w-72 h-screen overflow-hidden bg-[#062454] text-white px-5 pt-12 pb-8 flex flex-col shrink-0"
    >
      <div className="mb-7 flex justify-center">
        <img
          src={logo}
          alt="Talabati"
          className="h-auto w-28.5 object-contain"
        />
      </div>

      <nav aria-label="قائمة إدارة النظام" className="flex-1">
        <ul className="space-y-1.5">
          {adminNavigation.map(({ label, to, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "flex min-h-11 items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors duration-200",
                    isActive
                      ? "bg-[#40577B] text-white"
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon
                  className="shrink-0"
                  size={18}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={adminName}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20">
              <FiUser size={17} aria-hidden="true" />
            </div>
          )}

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-[12px] font-semibold text-white">
              {adminName}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-white/60">
              {adminRole}
            </p>
          </div>

          <FiChevronDown
            size={16}
            className="shrink-0 text-white/70"
            aria-hidden="true"
          />
        </div>
      </div>
    </aside>
  );
}