import logo from "../assets/images/logo1.svg";
import { FaBars, FaGlobe, FaSignInAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 100);

      const sections = document.querySelectorAll("section");
      let current = "home";

      sections.forEach((section) => {
        const top = section.offsetTop - 150;
        const bottom = top + section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < bottom) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (id) =>
    `text-[18px] font-semibold transition ${
      activeSection === id ? "text-[#F2762E]" : "hover:text-[#F2762E]"
    }`;

  const handleClick = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-4 left-4 right-4 md:left-10 md:right-10 z-50 rounded-[25px] transition-all duration-500 ${
        scrolled
          ? "bg-white/15 backdrop-blur-xl border border-white/20 shadow-lg"
          : "bg-white"
      }`}
    >
      <nav className="px-4 md:px-6 lg:px-3.75 py-[8.5px]">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <a href="#home">
            <img
              className="w-28 h-auto md:w-36.5 md:h-15.75"
              src={logo}
              alt="logo"
            />
          </a>

          {/* Mobile Button */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars />
          </button>

          {/* Mobile Menu */}
          <ul
            className={`absolute top-full right-0 left-0 mt-3 bg-white rounded-[20px] p-5 flex flex-col gap-5 lg:hidden transition-all duration-300 ${
              isOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-3 invisible"
            }`}
          >
            <li>
              <a href="#home" onClick={handleClick} className={linkClass("home")}>
                الرئيسية
              </a>
            </li>

            <li>
              <a href="#whyus" onClick={handleClick} className={linkClass("whyus")}>
                عن المنصة
              </a>
            </li>

            <li>
              <a href="#whoare" onClick={handleClick} className={linkClass("whoare")}>
                من نحن
              </a>
            </li>

            <li>
              <a href="#steps" onClick={handleClick} className={linkClass("steps")}>
                خدماتنا
              </a>
            </li>

            <li>
              <a href="#contact" onClick={handleClick} className={linkClass("contact")}>
                تواصل معنا
              </a>
            </li>
          </ul>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex gap-8">
            <li>
              <a href="#home" className={linkClass("home")}>الرئيسية</a>
            </li>

            <li>
              <a href="#whyus" className={linkClass("whyus")}>عن المنصة</a>
            </li>

            <li>
              <a href="#whoare" className={linkClass("whoare")}>من نحن</a>
            </li>

            <li>
              <a href="#steps" className={linkClass("steps")}>خدماتنا</a>
            </li>

            <li>
              <a href="#contact" className={linkClass("contact")}>تواصل معنا</a>
            </li>
          </ul>

          {/* Actions */}
          <div className="hidden lg:block border border-[#0624548C] rounded-[10px] px-5 py-2.75">
            <div className="flex items-center">
              <div className="text-black/60 flex items-center">
                <FaGlobe className="w-5 h-4.5 hover:text-[#F2762E] ml-2" />
                <span className="relative pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-black/50">
                  En
                </span>
              </div>

              <div className="group flex items-center hover:text-[#F2762E]">
                <FaSignInAlt className="w-5 h-4 text-black/50 group-hover:text-[#F2762E]" />
                <a href="/login" className="font-semibold text-[15px] mr-2">
                  تسجيل دخول
                </a>
              </div>
            </div>
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;
