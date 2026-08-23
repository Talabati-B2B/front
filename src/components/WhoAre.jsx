import image from "../assets/images/WhoAre.jpeg";
import { FaEnvelope, FaEye } from "react-icons/fa6";

function WhoAre() {
  return (
    <section id="whoare"
      className="relative py-20 mt-30 bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute left-50 top-15 ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          من <span className="text-[#F2762E]">نحن </span>
        </h2>
        <p className="text-center text-gray-500 max-w-xl mx-auto mb-12">
          منصة الكترونية ذكية تهدف الى تسهيل التواصل والتعامل التجاري بين
          المتاجر والموردين من خلال بيئة رقمية امنة وسهلة الاستخدام, نسعى الى
          توفير حل متكامل يساعد اصحاب المتاجر على الوصول للموردين والمنتجات
          المتاحة بسرعة وكفاءة.
        </p>
      </div>
      <div className="grid grid-cols-2">
        <div></div>
        <div className="flex flex-col mt-40">
          {/* رؤيتنا */}
          <div className="flex justify-between items-center max-w-100 bg-[#F5F5F5]/85 border-l border-[#03295C] rounded-2xl shadow px-4 py-2">
            <div  className="ml-7 text-[25px] text-white bg-[#03295C] p-4  rounded-[50%]">
              <FaEye />
            </div>
            <div>
              <h1 className="text-[#03295C] font-bold py-2 text-[20px]">رؤيتنا</h1>
              <p className="text-[#000000] text-[15px]">
                {" "}
                بناء منصة رقمية رائدة تربط الموردين والمتاجر وتساهم في تطوير
                قطاع التجارة الإلكترونية وتعزيز كفاءة سلاسل التوريد.
              </p>
            </div>
          </div>
          {/* رسالتنا */}
          <div className="flex justify-between items-center max-w-100 mt-10 bg-[#F5F5F5]/85 border-l border-[#F2762E] rounded-2xl shadow px-4 py-2 ">

            <div className="ml-7 text-[25px] text-white  bg-[#F2762E] p-4 rounded-[50%] ">
              <FaEnvelope />
            </div>
            <div>
              <h1 className="text-[#F2762E] font-bold py-2 text-[20px]">رسالتنا</h1>
              <p className="text-[#000000] text-[15px]">
                {" "}
                تقديم حلول تقنية مبتكرة تساعد الشركات والمتاجر على إدارة أعمالها
                بكفاءة أكبر، وتوفير تجربة تجارية رقمية حديثة وآمنة للجميع.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhoAre;
