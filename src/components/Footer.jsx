import image1 from "../assets/images/footer.png";
import logo from "../assets/images/footerLogo.svg";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

function Footer() {
  const helpLinks = [
    "كيف تعمل المنصة",
    "الشحن والتوصيل",
    "سياسة الخصوصية",
    "سياسة الاستخدام",
  ];

  const quickLinks = [
    "الرئيسية",
    "للمتاجر",
    "الدعم الفني",
    "عن المنصة",
    "للموردين",
    "استفسارات عامة",
  ];

  const [openSection, setOpenSection] = useState(null);

  return (
    <footer id="footer"
      className="relative overflow-hidden bg-cover bg-center pt-10"
      style={{ backgroundImage: `url(${image1})` }}
    >
      <div className="absolute inset-0 bg-[#03295C]/8"></div>
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-15">
          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="logo"
              className="w-30 mb-3 transition-transform duration-300 hover:scale-105"
            />

            <p className="text-[13px] leading-7 max-w-xs mb-5 text-white/80">
              منصة ذكية لربط الموردين بالمجال وإدارة المخزون والتوريد بكفاءة
              وشفافية.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#F2762E] hover:border-[#F2762E] hover:-translate-y-1 hover:shadow-lg"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#F2762E] hover:border-[#F2762E] hover:-translate-y-1 hover:shadow-lg"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#F2762E] hover:border-[#F2762E] hover:-translate-y-1 hover:shadow-lg"
              >
                <FaXTwitter />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#F2762E] hover:border-[#F2762E] hover:-translate-y-1 hover:shadow-lg"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Help */}
          <div>
            <h4
              onClick={() =>
                setOpenSection(openSection === "help" ? null : "help")
              }
              className="cursor-pointer text-[18px] font-bold text-white mb-4 flex justify-between items-center"
            >
              مساعدة
              <FaChevronDown
                className={`md:hidden transition-transform duration-300 ${
                  openSection === "help" ? "rotate-180" : ""
                }`}
              />
            </h4>

            <div
              className={`${openSection === "help" ? "block" : "hidden"} md:block`}
            >
              <ul className="text-[16px] leading-8">
                {helpLinks.map((link, index) => (
                  <li
                    key={index}
                    className="mb-1.75 text-[#ffffff]/80 transition-all duration-300 hover:text-[#F2762E] hover:-translate-x-1"
                  >
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              onClick={() =>
                setOpenSection(openSection === "quick" ? null : "quick")
              }
              className="cursor-pointer text-[18px] font-bold text-white mb-4 flex justify-between items-center"
            >
              روابط سريعة
              <FaChevronDown
                className={`md:hidden transition-transform duration-300 ${
                  openSection === "help" ? "rotate-180" : ""
                }`}
              />
            </h4>

            <div
              className={`${openSection === "quick"? "block" : "hidden"} md:block`}
            >
              <ul className="text-[16px] leading-8">
                {quickLinks.map((link, index) => (
                  <li
                    key={index}
                    className="mb-1.75 text-[#ffffff]/80 transition-all duration-300 hover:text-[#F2762E] hover:-translate-x-1"
                  >
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div
            className={`${openSection === "contact" ? "block" : "hidden"} md:block`}
          >
            <div>
              <h4
                onClick={() =>
                  setOpenSection(openSection === "contact" ? null : "contact")
                }
                className="cursor-pointer text-[18px] font-bold text-white mb-4 flex justify-between items-center"
              >
                تواصل معنا
                <FaChevronDown
                  className={`md:hidden transition-transform duration-300 ${
                    openSection === "help" ? "rotate-180" : ""
                  }`}
                />
              </h4>

              <div className="flex gap-2.5 mb-3 text-[16px] leading-8 text-[#ffffff]/80">
                <span>📞</span>
                <span className="hover:text-[#F2762E]">+972 59 0000 00</span>
              </div>

              <div className="flex gap-2.5 mb-3 text-[16px] leading-8 text-[#ffffff]/80">
                <span>✉️</span>
                <span className="hover:text-[#F2762E]">talabati@email.com</span>
              </div>

              <div className="flex gap-2.5 mb-3 text-[16px] leading-8 text-[#ffffff]/80">
                <span>📍</span>
                <span className="hover:text-[#F2762E]">فلسطين، غزة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 mt-6 flex flex-col md:flex-row justify-between items-center gap-3 px-6 py-4">
        <p className="text-xs text-[#f5ead8]/65">
          © ٢٠٢٦ <span className="text-[#F2762E] mx-1">طلباتي </span>
          جميع الحقوق محفوظة.
        </p>

        <div className="flex items-center gap-4 text-sm">
          <a
            href="#"
            className="relative text-[#f5ead8]/60 transition-all duration-300 hover:text-[#F2762E] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#F2762E] after:transition-all after:duration-300 hover:after:w-full"
          >
            سياسة الخصوصية
          </a>

          <a
            href="#"
            className="relative text-[#f5ead8]/60 transition-all duration-300 hover:text-[#F2762E] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#F2762E] after:transition-all after:duration-300 hover:after:w-full"
          >
            شروط الخدمة
          </a>

          <a
            href="#"
            className="relative text-[#f5ead8]/60 transition-all duration-300 hover:text-[#F2762E] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#F2762E] after:transition-all after:duration-300 hover:after:w-full"
          >
            سياسة ملفات الارتباط
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
