import { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import NavigationBtns from "./NavigationBtns";

const roles = [
  {
    id: "supplier",
    label: "حساب مورد",
    desc: "لتسجيل الشركات و الموردين و تقيم للمنتجات المتاجر",
    icon: <FaUserTie />,
    activeColor: "border-orange-400 bg-orange-50",
    iconBg: "bg-orange-400",
    radioColor: "text-orange-500",
  },
  {
    id: "store",
    label: "حساب متجر",
    desc: "لتسجيل المتاجر و الشراء من منتجات الموردين",
    icon: <IoStorefrontSharp />,
    activeColor: "border-blue-300 bg-blue-50",
    iconBg: "bg-blue-500",
    radioColor: "text-blue-500",
  },
];

export default function StepTwo({ role, setRole, onNext, onBack }) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!role) {
      setError("يرجى اختيار نوع الحساب");
      return;
    }

    onNext(role);
  };
  return (
    <div className="px-6 pb-6 my-2" dir="rtl">
      <p className="text-sm text-gray-700 font-medium md:text-center mb-4">
        اختر نوع النشاط الذي يناسبك
      </p>

      <div className="flex flex-col gap-3 my-4">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`
              w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-right
              ${role === r.id ? r.activeColor : "border-gray-100 bg-white hover:border-gray-200"}
            `}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0
              ${role === r.id ? r.iconBg : "bg-gray-200"}
            `}
            >
              {r.icon}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-800">{r.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                {r.desc}
              </p>
            </div>

            {/* Radio */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${role === r.id ? r.iconBg : "border-gray-300"}
            `}
            >
              {role === r.id && (
                <div className={`w-2.5 h-2.5 rounded-full ${r.iconBg}`} />
              )}
            </div>
          </button>
        ))}
      </div>

        {/* error message */}
      {error && (
        <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
      )}

      {/* Info box */}
      <div className="bg-[#1CA7F724] border border-blue-100 rounded-xl p-3 mb-2 shadow shadow-[#2EAFCD80]/50">
        <p className="text-sm text-[#025E73] font-semibold text-center mb-1">
          {" "}
          معلومة{" "}
        </p>
        <p className="text-xs text-black text-center leading-relaxed">
          يمكنك اكمال بيانات التسجيل حسب نوع الحساب في الخطوة التالية
        </p>
      </div>

      <NavigationBtns onNext={handleNext} onBack={onBack} />
    </div>
  );
}
