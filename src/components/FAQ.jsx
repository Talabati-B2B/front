import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import box from "../assets/images/box3.png";

function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const questions = [
    {
      question: "ما هي منصة طلباتي؟",
      answer:
        "طلباتي هي منصة إلكترونية تربط المتاجر بالموردين، وتسهّل عملية البحث عن المنتجات، التواصل، وإدارة الطلبات بطريقة آمنة وسريعة.",
    },
    {
      question: "كيف يمكنني التسجيل في المنصة؟",
      answer:
        "يمكنك التسجيل من خلال الضغط على إنشاء حساب ثم تعبئة البيانات المطلوبة واختيار نوع الحساب (تاجر أو مورد).",
    },
    {
      question: "هل التسجيل في المنصة مجاني؟",
      answer:
        "نعم، التسجيل مجاني، وقد توجد بعض الخدمات الإضافية المدفوعة حسب الباقة.",
    },
    {
      question: "كيف أضيف منتجاتي على المتجر؟",
      answer:
        "بعد تسجيل الدخول، يمكنك الدخول إلى لوحة التحكم ثم اختيار إضافة منتج وإدخال تفاصيل المنتج مثل الاسم، السعر، والصورة.",
    },
    {
      question: "كيف يتم استلام الطلبات؟",
      answer:
        "عند وجود طلب جديد، يصلك إشعار داخل الحساب ويمكنك متابعة تفاصيل الطلب من لوحة التحكم.",
    },
    {
      question: "هل توفر المنصة خدمة التوصيل؟",
      answer:
        "نعم، يمكن ربط المتجر مع شركات توصيل أو الاستفادة من خدمات التوصيل المتاحة داخل المنصة.",
    },
  ];

  return (
    <section id="questions" className="questions my-30 py-10">
      <div className="questions-title text-center mb-14">
        <h2 className="text-[32px] font-bold mb-5">
          الاسئلة
          <span className="text-[#F2762E]"> الشائعة</span>
        </h2>

        <p className="text-[20px] font-normal leading-10">
          اكتشف الاجابات عن أكثر الأسئلة شيوعا حول خدماتنا
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_4fr] gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center items-center">
            <img
              src={box}
              className="hidden md:block w-60 md:w-72 h-auto hover:scale-105 transition-all duration-300"
              alt="box"
            />
          </div>
          {/* Questions */}

          <div className="flex flex-col gap-5">
            {questions.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  setActiveQuestion(activeQuestion === index ? null : index)
                }
                className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl flex justify-between items-start gap-6 cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <h3 className="text-[17px] md:text-[16px] font-semibold mb-2">
                    {item.question}
                  </h3>

<p
  className={`text-[16px] font-light leading-7 mt-3 overflow-hidden transition-all duration-500 ${
    activeQuestion === index
      ? "max-h-60 opacity-100"
      : "max-h-0 opacity-0"
  }`}
>
  {item.answer}
</p>
                </div>

                <FaChevronDown
  className={`transition-transform duration-300 ${
    activeQuestion === index ? "rotate-180" : ""
  }`}
/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
