import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { FaGlobe, FaRegMoon } from "react-icons/fa";
import image from "../assets/images/supplierProfile.svg";

export default function Topbar() {
  return (
    <header className="bg-[#EDEEEFCC] w-full h-20 px-6 flex items-center justify-between shadow-sm">
      {/* البحث */}
      <div className="relative w-130">
        <FiSearch
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#44474F]"
          size={18}
        />

        <input
          type="text"
          placeholder="البحث عن طلبات، منتجات، أو عملاء..."
          className="w-full bg-[#F3F4F5] rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]"
        />
      </div>

      {/* المستخدم */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <FaGlobe size={18} />
        </button>

        <button className="relative">
          <FaRegMoon size={18} />

          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-1 h-1 flex items-center justify-center"></span>
        </button>

        <button className="relative">
          <FiBell size={18} className="" />

          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-1 h-1 flex items-center justify-center"></span>
        </button>


        <div className="flex items-center gap-3">
          <div className="text-right">
            <h3 className="font-semibold text-[15px]">مستودع الأمانة</h3>
            <p className="text-sm text-gray-500">المورد</p>
          </div>

          <div className="w-11 h-11 rounded-full flex items-center justify-center">
            <img className="rounded-full" src={image} alt="profile img"/>
          </div>
        </div>
      </div>
    </header>
  );
}
