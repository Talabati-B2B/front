import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiBox,
  FiChevronDown,
  FiClipboard,
  FiHome,
  FiLogOut,
  FiShoppingCart,
  FiSettings,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import logo from "../../assets/images/dachboard_Logo.svg";
import { useAuth } from "../../context/AuthContext";

const storeNavigation = [
  {
    label: "لوحة التحكم",
    to: "/store",
    icon: FiHome,
    end: true,
  },
  {
    label: "الموردون",
    to: "/store/suppliers",
    icon: FiTruck,
  },
  {
    label: "المنتجات",
    to: "/store/products",
    icon: FiBox,
  },
  {
    label: "السلة",
    to: "/store/cart",
    icon: FiShoppingCart,
  },
  {
    label: "الطلبات",
    to: "/store/orders",
    icon: FiClipboard,
  },
  {
    label: "التقارير",
    to: "/store/reports",
    icon: FiBarChart2,
  },
  {
    label: "الإعدادات",
    to: "/store/settings",
    icon: FiSettings,
  },
];

export default function StoreSidebar({
  storeName = "المتجر",
  storeRole = "متجر",
  avatarSrc,
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <aside
      dir="rtl"
      className="flex h-screen w-72 shrink-0 flex-col overflow-hidden bg-[#062454] px-5 pb-5 pt-8 text-white"
    >
      {/* LOGO */}
      <div className="mb-5 flex shrink-0 justify-center">
        <img
          src={logo}
          alt="Talabati"
          className="h-auto w-28.5 object-contain"
        />
      </div>

      {/* NAVIGATION */}
      <nav
        aria-label="قائمة المتجر"
        className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="space-y-1.5">
          {storeNavigation.map(({ label, to, icon: Icon, end }) => (
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

                <span className="whitespace-nowrap">
                  {label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* PROFILE */}
      <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setProfileOpen((open) => !open)}
          aria-expanded={profileOpen}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-right transition-colors hover:bg-white/10"
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={storeName}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20">
              <FiUser
                size={17}
                aria-hidden="true"
              />
            </div>
          )}

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-[12px] font-semibold text-white">
              {storeName}
            </p>

            <p className="mt-0.5 truncate text-[10px] text-white/60">
              {storeRole}
            </p>
          </div>

          <FiChevronDown
            size={16}
            aria-hidden="true"
            className={`shrink-0 text-white/70 transition-transform duration-200 ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* PROFILE DROPDOWN */}
        {profileOpen && (
          <div className="mt-2 rounded-lg bg-white/10 p-1">
            <NavLink
              to="/store/settings"
              onClick={() => setProfileOpen(false)}
              className="flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FiSettings
                size={16}
                aria-hidden="true"
              />

              <span>إعدادات الحساب</span>
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-right text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FiLogOut
                size={16}
                aria-hidden="true"
              />

              <span>تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}