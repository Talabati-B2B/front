import { useState } from "react";
import icon1 from "../assets/images/icon1.svg";
import icon2 from "../assets/images/icon2.svg";
import icon3 from "../assets/images/icon3.svg";
import icon4 from "../assets/images/icon4.svg";
import icon5 from "../assets/images/icon5.svg";
import image1 from "../assets/images/step1.jpeg";
import image2 from "../assets/images/step2.jpeg";
import image3 from "../assets/images/step3.jpg";
import image4 from "../assets/images/step4.png";
import image5 from "../assets/images/step5.jpg";

function Steps() {
  const steps = [
    {
      title: "استيراد المنتجات",
      icon: icon1,
      color: "#072A68",
      heading: "توفير استيراد فعال مع ضمان الجودة",
      description:
        "فريقنا االخبير في مجال التوريد سيساعدك في العثور على منتجاتك مباشرة من مصنعين موثوق بهم في الصن أو تركيا ,مما يضمن لك جودة عاليا و أسعار معقولة .كما أننا نضمن لك فحصا مجانيا للجودة للتأكد من أن كل قطعة تفي بالمعايير العالية قبل وصولها الى زبائنك.",
      image: image1,
    },
    {
      title: "فحص الجودة",
      icon: icon2,
      color: "#072A68",
      heading: "فحص الجودة بدقة عالية",
      description:
        "يقوم فريق فحص الجودة بمراجعة المنتجات في جميع مراحل التخزين والتجهيز للتأكد من مطابقتها للمعايير المطلوبة وخلوها من أي عيوب. تساعد هذه العملية على ضمان جودة المنتجات قبل الشحن، وتقليل الأخطاء، ورفع مستوى رضا العملاء من خلال تقديم منتجات موثوقة وعالية الجودة.",
      image: image2,
    },
    {
      title: "التخزين الذكي",
      icon: icon3,
      color: "#072A68",
      heading: "إدارة ذكية للمخزون بكفاءة عالية",
      description:
        "نوفر حلول تخزين ذكية تساعد الموردين والمتاجر على متابعة المخزون بشكل منظم ودقيق، مع تحديث الكميات المتاحة في الوقت الفعلي. يساهم ذلك في تقليل الهدر، تجنب نفاد المنتجات، وتحسين إدارة الطلبات لضمان توفر السلع عند الحاجة.",
      image: image3,
    },
    {
      title: "التوريد والمبيعات",
      icon: icon4,
      color: "#072A68",
      heading: "توريد أسرع لزيادة المبيعات",
      description:
        "نساعد المتاجر على الوصول إلى الموردين والمنتجات بسهولة، مما يضمن استمرارية التوريد وتحسين كفاءة المبيعات وتلبية احتياجات العملاء بسرعة.",
      image: image4,
    },
    {
      title: "التوصيل النهائي",
      icon: icon5,
      color: "#072A68",
      heading: "سرعة في التوصيل وكفاءة في الخدمة",
      description:
        "نضمن متابعة الطلبات وتنسيق عمليات التوصيل بفعالية، لتصل المنتجات إلى وجهتها بأسرع وقت ممكن وبأعلى مستوى من الموثوقية.",
      image: image5,
    },
  ];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="steps" className="steps py-15 my-20 bg-[#025E730D]">
      <h2 className="text-[32px] font-bold text-center mb-15">
        نحن معك خطوة بخطوة لتلبية جميع احتياجاتك
      </h2>

      {/* Steps Indicator */}
      <div className="max-w-4xl mx-auto px-3 md:px-6">
        <div className="relative">
          {/* Line */}
          {/* Base Line */}
          <div className="absolute top-5 md:top-10 left-[8%] right-[8%] h-0.5 md:h-1 bg-[#0D6674]"></div>

          {/* Active Line */}
          <div
            className="absolute top-5 md:top-10 right-[8%] h-0.5 md:h-1 bg-[#F28C38] transition-all duration-500"
            style={{
              width: `${(activeStep / (steps.length - 1)) * 84}%`,
            }}
          ></div>

          {/* Items */}
          <div className="relative flex justify-between items-start">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className="flex flex-col items-center w-40 cursor-pointer"
              >
                {/* Circle */}
                <div
                  className="w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center z-10 mt-1 md:mt-3"
                  style={{
                    backgroundColor:
                      index <= activeStep ? "#F28C38" : "#072A68",
                  }}
                >
                  <img
                    src={step.icon}
                    className="w-3 h-3 md:w-5 md:h-5"
                    alt=""
                  />
                </div>
                {/* Text */}
                <h3 className="mt-2 md:mt-6 text-[10px] sm:text-xs md:text-[18px] font-normal text-center leading-4 md:leading-normal px-1">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Steps Content */}
      <div
        key={activeStep}
        className="mt-12 px-6 max-w-6xl mx-auto md:pr-12 animate-fadeIn"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-[22px] md:text-[26px] font-bold mb-8 md:mb-12">
              {steps[activeStep].heading}
            </h2>
            <p className="w-full md:w-120 text-[15px] md:text-[18px] font-normal leading-8">
              {steps[activeStep].description}
            </p>
          </div>
          {/* Image Content */}
          <div>
            <img
              src={steps[activeStep].image}
              alt={steps[activeStep].title}
              className="w-full md:w-110 h-auto md:h-100 object-cover rounded-[30px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Steps;
