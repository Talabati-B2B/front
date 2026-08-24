import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiBarChart2,
  FiBox,
  FiChevronDown,
  FiClipboard,
  FiHome,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import logo from "../assets/images/dachboard_Logo.svg";

const supplierNavigation = [
  {
    label: "لوحة التحكم",
    to: "/",
    icon: FiHome,
    end: true,
  },
  {
    label: "الطلبات",
    to: "/orders",
    icon: FiClipboard,
  },
  {
    label: "المنتجات والمخزون",
    to: "/products",
    icon: FiBox,
    end: true,
  },
  {
    label: "التقارير",
    to: "/reports",
    icon: FiBarChart2,
  },
  {
    label: "الإعدادات",
    to: "/settings",
    icon: FiSettings,
  },
];


export default function DashboardSidebar({

  supplierName = "المورد",
  supplierRole = "مورد",
  avatarSrc,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
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

      <nav aria-label="قائمة المورد" className="flex-1">
        <ul className="space-y-1.3">
          {supplierNavigation.map(({ label, to, icon: Icon, end }) => (
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
                <Icon className="shrink-0" size={18} aria-hidden="true" />
                <span className="whitespace-nowrap">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setProfileOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-right transition-colors hover:bg-white/10"
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={supplierName}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20">
              <FiUser size={17} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-white">
              {supplierName}
            </p>

            <p className="mt-0.5 truncate text-[10px] text-white/60">
              {supplierRole}
            </p>
          </div>

          <FiChevronDown
            size={16}
            className={`shrink-0 text-white/70 transition-transform duration-200 ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {profileOpen && (
          <div className="mt-2 rounded-lg bg-white/10 p-1">
            <NavLink
              to="/settings"
              onClick={() => setProfileOpen(false)}
              className="flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FiSettings size={16} />
              <span>إعدادات الحساب</span>
            </NavLink>
          </div>
        )}
      </div>

      <div className="mt-4">
        <NavLink
          to="/products/add"
          className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#F47721] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#E67E1F]"
        >
          إضافة منتج جديد
        </NavLink>
      </div>
    </aside>
  );
}
