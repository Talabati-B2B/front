import logo from "../assets/images/dachboard_Logo.svg";
import {
  FaHome,
  FaClipboardList,
  FaBoxOpen,
  FaChartLine,
  FaCog,
  FaPlus,
} from "react-icons/fa";
import { useState } from "react";

function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="w-65 min-h-screen bg-[#062454] text-white px-5 pt-2 pb-8 flex flex-col shrink-0">
      {/* Logo */}
      <div className="text-center mb-2 mx-auto -pt-3">
        <img className="w-40 h-41" src={logo} alt="logo" />
      </div>

      {/* Menu */}
      <div className="space-y-4 flex-1">
        <div
          onClick={() => setActiveItem("dashboard")}
          className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
            activeItem === "dashboard"
              ? "bg-white text-black"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          <FaHome size={18} />
          <span>لوحة التحكم</span>
        </div>

        <div
          onClick={() => setActiveItem("orders")}
          className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
            activeItem === "orders"
              ? "bg-white text-black"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          <FaClipboardList size={18} />
          <span>الطلبات</span>
        </div>

        <div
          onClick={() => setActiveItem("products")}
          className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
            activeItem === "products"
              ? "bg-white text-black"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          <FaBoxOpen size={18} />
          <span>المنتجات والمخزون</span>
        </div>

        <div
          onClick={() => setActiveItem("reports")}
          className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
            activeItem === "reports"
              ? "bg-white text-black"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          <FaChartLine size={18} />
          <span>التقارير</span>
        </div>

        <div
          onClick={() => setActiveItem("settings")}
          className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${
            activeItem === "settings"
              ? "bg-white text-black"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          <FaCog size={18} />
          <span>الإعدادات</span>
        </div>
      </div>

      {/* Button */}
      <button className="bg-orange-500 p-3 mt-5 rounded-xl">إضافة منتج جديد</button>
    </div>
  );
}

export default DashboardSidebar;
