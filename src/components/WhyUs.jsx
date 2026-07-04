import image1 from "../assets/images/image1.svg";
import image2 from "../assets/images/image2.svg";
import image3 from "../assets/images/image3.svg";

function WhyUs() {
  return (
    <section  id="whyus"  className="py-20 px-6 text-center">
      <h2 className="mb-12 text-3xl lg:text-[32px] font-bold">
        لماذا <span className="text-[#F2762E]">تختارنا!</span>
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
        <div className="flex flex-col justify-center items-center gap-6 bg-white border border-[#025E7366]/70 rounded-[30px] pt-8 pb-12 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.12)] hover:-translate-y-3 hover:shadow-[0_0_60px_rgba(0,0,0,0.18)] transition duration-300">
          <div className="-mt-5">
            <img src={image1} alt="" className="w-52 h-36 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.18)]"/>
          </div>

          <p className="max-w-70 text-base font-normal">
            الوصول السريع إلى مجموعة واسعة من الموردين والمنتجات
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-6 bg-white border border-[#F25922]/70 rounded-[30px] pt-8 pb-12 w-full max-w-sm shadow-[0_0_45px_rgba(242,89,34,0.18)] hover:-translate-y-3 hover:shadow-[0_0_70px_rgba(242,89,34,0.25)] transition duration-300">
          <div className="-mt-5">
            <img
              src={image2}
              alt=""
              className="w-52 h-36 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.18)]"
            />
          </div>

          <p className="max-w-70 text-base font-normal text-[#F25922]">
            عرض المنتجات والوصول إلى عدد أكبر من المتاجر والعملاء
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-6 bg-white border border-[#025E7366]/70 rounded-[30px] pt-8 pb-12 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.12)] hover:-translate-y-3 hover:shadow-[0_0_60px_rgba(0,0,0,0.18)] transition duration-300">
          <div className="-mt-5">
            <img
              src={image3}
              alt=""
              className="w-52 h-36 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.18)]"
            />
          </div>

          <p className="max-w-70 text-base font-normal">
            حماية بيانات المستخدمين باستخدام أحدث معايير الأمان
          </p>
        </div>
      </div>
    </section>
  )
}


export default WhyUs
