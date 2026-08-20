import logo from "../assets/images/dachboard_Logo.svg";
import {
  FaHome,
  FaClipboardList,
  FaBoxOpen,
  FaChartLine,
  FaCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function DashboardSidebar() {
  const activeClass = "bg-white text-black";
  const inactiveClass = "text-gray-300 hover:bg-white/10";
  const unavailableClass =
    "text-gray-300 opacity-60 cursor-not-allowed";

  return (
    <div className="w-72 min-h-screen bg-[#062454] text-white px-5 pt-12 pb-8 flex flex-col shrink-0">
      {/* Logo */}
      <div className="text-center mb-6 mx-auto -pt-3">
        <img className="w-40 h-41" src={logo} alt="logo" />
      </div>

      {/* Menu */}
      <div className="space-y-4 flex-1">
        {/* Dashboard - existing route */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
              isActive ? activeClass : inactiveClass
            }`
          }
        >
          <FaHome size={18} />
          <span>لوحة التحكم</span>
        </NavLink>

        {/* Orders - existing route */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
              isActive ? activeClass : inactiveClass
            }`
          }
        >
          <FaClipboardList size={18} />
          <span>الطلبات</span>
        </NavLink>

        {/* Products - page/route does not exist yet */}
        <button
          type="button"
          disabled
          title="سيتم ربطه بعد إنشاء الصفحة"
          className={`w-full p-3 rounded-xl flex items-center gap-3 text-right ${unavailableClass}`}
        >
          <FaBoxOpen size={18} />
          <span>المنتجات والمخزون</span>
        </button>

        {/* Reports - page/route does not exist yet */}
        <button
          type="button"
          disabled
          title="سيتم ربطه بعد إنشاء الصفحة"
          className={`w-full p-3 rounded-xl flex items-center gap-3 text-right ${unavailableClass}`}
        >
          <FaChartLine size={18} />
          <span>التقارير</span>
        </button>

        {/* Settings - page/route does not exist yet */}
        <button
          type="button"
          disabled
          title="سيتم ربطه بعد إنشاء الصفحة"
          className={`w-full p-3 rounded-xl flex items-center gap-3 text-right ${unavailableClass}`}
        >
          <FaCog size={18} />
          <span>الإعدادات</span>
        </button>
      </div>

      {/* Add Product - page/route does not exist yet */}
      <button
        type="button"
        disabled
        title="سيتم ربطه بعد إنشاء صفحة المنتجات"
        className="bg-orange-500 p-3 mt-5 rounded-xl opacity-60 cursor-not-allowed"
      >
        إضافة منتج جديد
      </button>
    </div>
  );
}

export default DashboardSidebar;