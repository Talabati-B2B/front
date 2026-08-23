import { useState } from "react";
import {
  FaWhatsapp,
  FaRegEnvelope,
  FaRegClock,
  FaLocationDot,
} from "react-icons/fa6";
import Swal from "sweetalert2";

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    Swal.fire({
    title: "تم الإرسال بنجاح!",
    text: "سنقوم بالرد عليك في أقرب وقت.",
    icon: "success",
    confirmButtonText: "حسناً",
    confirmButtonColor: "#F2762E",
});
  };
  return (
    <section id="contact" className="contact-us my-30">
      <div className="title text-center">
        <h2 className="text-[32px] font-bold mb-5">
          تواصل
          <span className="text-[#F2762E]"> معنا!</span>
        </h2>

        <p className="text-[20px] font-normal leading-10">
          لدينا فريق جاهز للاجابة على استفساراتك ومساعدتك في أي وقت
        </p>
      </div>

      <div className="contact-us-container max-w-4xl mx-auto px-4">
        <div className="contact-us-cards grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-20 mt-22">
          {/* Right Card */}
          <div className="right-card bg-white border border-[#025E7315] shadow-xl rounded-[40px] py-10 px-8 lg:px-12 hover:shadow-2xl transition-all duration-300">
            <div className="card-title text-center">
              <h2 className="text-[20px] font-bold flex justify-center items-center gap-2">
                <FaRegEnvelope className="text-[#F2762E]" />
                أرسل لنا استفسارك
              </h2>

              <p className="text-[18px] font-normal leading-10 mt-3">
                سنقوم بمراجعة طلبك و توجيهه للقسم المختص فورا
              </p>
            </div>

            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >
              <div className="form-row flex flex-col md:flex-row items-center justify-between gap-5 mt-5">
                <div className="form-group flex flex-col gap-2 w-full">
                  <label className="text-[15px] font-semibold">
                    الاسم الاول
                    <span className="text-[#F2762E]">*</span>
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="احمد"
                    className="w-full bg-white border border-gray-200 rounded-2xl p-3 pr-4 text-[15px] shadow-sm outline-none transition-all duration-300 focus:border-[#F2762E] focus:ring-4 focus:ring-[#F2762E]/10"
                    required
                  />
                </div>

                <div className="form-group flex flex-col gap-2 w-full">
                  <label className="text-[15px] font-semibold">
                    الاسم الثاني
                    <span className="text-[#F2762E]">*</span>
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="احمد"
                    className="w-full bg-white border border-gray-200 rounded-2xl p-3 pr-4 text-[15px] shadow-sm outline-none transition-all duration-300 focus:border-[#F2762E] focus:ring-4 focus:ring-[#F2762E]/10"
                    required
                  />
                </div>
              </div>

              <div className="form-row flex flex-col md:flex-row items-center justify-between gap-5 mt-4">
                <div className="form-group flex flex-col gap-2 w-full">
                  <label className="text-[15px] font-semibold">
                    البريد الالكتروني
                    <span className="text-[#F2762E]">*</span>
                  </label>

                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    dir="rtl"
                    className="w-full bg-white border border-gray-200 rounded-2xl p-3 pr-4 text-[15px] shadow-sm outline-none transition-all duration-300 focus:border-[#F2762E] focus:ring-4 focus:ring-[#F2762E]/10"
                  />
                </div>

                <div className="form-group flex flex-col gap-2 w-full">
                  <label className="text-[15px] font-semibold">الموضوع</label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="دعم الشحنات"
                    className="w-full bg-white border border-gray-200 rounded-2xl p-3 pr-4 text-[15px] shadow-sm outline-none transition-all duration-300 focus:border-[#F2762E] focus:ring-4 focus:ring-[#F2762E]/10"
                  />
                </div>
              </div>

              <div className="full-width mt-8 flex flex-col gap-2">
                <label className="text-[15px] font-semibold">الرسالة</label>

                <textarea
                  placeholder="كيف يمكننا مساعدتك اليوم ؟"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-28 bg-white border border-gray-200 rounded-2xl p-3 pr-4 text-[15px] shadow-sm outline-none resize-none transition-all duration-300 focus:border-[#F2762E] focus:ring-4 focus:ring-[#F2762E]/10"
                  required
                />
              </div>

              <div className="w-full flex justify-center mt-4">
                <button
                  type="submit"
                  className="text-white bg-[#F2762E] px-10 py-3 rounded-2xl text-[16px] font-semibold hover:bg-[#d65f1f] hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300"
                >
                  ارسال الرسالة
                </button>
              </div>
            </form>
          </div>

          {/* Left Card */}
          <div className="left-card my-auto space-y-4 hidden md:block">
            <ContactItem
              icon={<FaWhatsapp />}
              title="واتساب"
              text="+972 00 000 0000"
              iconStyle="bg-[#54CF6026] text-[#30B944]"
            />

            <ContactItem
              icon={<FaRegEnvelope />}
              title="البريد الالكتروني"
              text="talabati@gmail.com"
              iconStyle="bg-[#025E7326] text-[#025E73E3]"
            />

            <ContactItem
              icon={<FaRegClock />}
              title="أوقات الرد"
              text="خلال 24 ساعة"
              iconStyle="bg-[#F2762E1A] text-[#ED893E]"
            />

            <ContactItem
              icon={<FaLocationDot />}
              title="الموقع"
              text="غزة , فلسطين"
              iconStyle="bg-[#06245426] text-[#384D6F]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, title, text, iconStyle }) {
  return (
    <div className="flex items-center gap-5 bg-white border border-gray-100 shadow-sm rounded-2xl px-6 py-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-[22px] ${iconStyle}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-[#000000B2] text-[17px] mb-2">{title}</p>

        <p>{text}</p>
      </div>
    </div>
  );
}

export default ContactUs;
