import landingImg from "../assets/images/landing.png";
import heroImage from "../assets/images/ovar_landing.jpeg";
import Counter from "./Counter"

function Hero() {
  return (
    <section id="home"
      style={{ backgroundImage: `url(${landingImg})` }}
      className="min-h-screen w-full  relative flex flex-col">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      {/* Hero Content */}
      <div className="relative z-10 flex-1 w-full flex flex-col lg:flex-row justify-between items-center gap-10">
        {/* Text Content */}
        <div className="text-white w-full max-w-7xl mx-auto px-6 lg:px-15 pt-32 lg:pt-40">
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold">
            {" "}
            منصة <span className="text-[#F2762E]">طلباتي</span>
          </h1>

          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-semibold mt-2">
            للامداد الطارئ في قطاع<span className="text-[#F2762E]"> غزة </span>
          </h2>

          <p className="pt-8 lg:pt-10 text-base md:text-lg lg:text-[20px] font-semibold max-w-xl">
            {" "}
            نربط المتاجر بالموردين المتاحين حسب الموقع الامن، نوفر المنتجات
            الأساسية، وننظم طلبات التوصيل بسرعة وكفاءة في الظروف الصعبة
          </p>
        </div>

        <div className="w-full lg:w-auto flex justify-center">
          <img
            src={heroImage}
            alt="منصة طلباتي"
            className="w-[90%] md:w-125 lg:w-225 h-auto mt-10 lg:mt-30 rounded-[43%] object-cover p-4 lg:pl-6"
          />
        </div>
      </div>
      {/* Hero Features */}
<div className="relative z-10 max-w-xl mx-auto text-center text-white mt-16 lg:mt-20 mb-20 px-6">

  <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold">
    ابدأ رحلتك مع طلباتي
  </h2>

  <p className="mt-5 mb-8 text-base md:text-lg lg:text-[20px] font-semibold">
    في منصة واحدة نربط الموردين والمتاجر في غزة بمنصة ذكية لإدارة الطلبات
    <span className="text-[#F2762E]">
      {" "}بسهولة، سرعة وشفافية
    </span>
  </p>


  {/* Buttons */}
  <div className="flex flex-col md:flex-row justify-center gap-4 pb-10">

    <a href="/register" className=" text-black text-center py-2 px-5 bg-[#F2762E] rounded-[10px] font-semibold hover:bg-[#d96524] transition duration-300">
      ابدأ الآن</a>


    <a href="#" className=" text-white text-center py-2 px-5 border border-white rounded-[10px] font-semibold  hover:bg-white hover:text-black transition duration-300">
      اكتشف خدماتنا</a>

  </div>

</div>

            <div className="relative z-20 bg-white flex flex-wrap justify-around items-center text-center gap-6 w-[45%] max-w-4xl mx-auto -mb-10 py-5 px-6 rounded-2xl shadow-md">

  <div>
    <Counter target={50}/>
    <p>تم التنفيذ</p>
  </div>

  <div>
    <Counter target={100}/>
    <p>متجر مسجل</p>
  </div>

  <div>
    <Counter target={70}/>
    <p>مورد نشط</p>
  </div>

  <div>
    <Counter target={95} suffix="%"/>
    <p>رضا المستخدم</p>
  </div>

</div>
    </section>
  );
}

export default Hero;
