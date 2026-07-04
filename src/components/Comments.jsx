import { useState } from "react";
import testimonial1 from "../assets/images/testimonials1.svg";
import testimonial2 from "../assets/images/testimonials2.svg";
import testimonial3 from "../assets/images/testimonials3.svg";
import testimonial4 from "../assets/images/testimonial4.jpg";
import testimonial5 from "../assets/images/testimonial5.jpg";
import quotes from "../assets/images/qutos.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const comments = [
        {
            name: "أحمد النجار",
            image: testimonial1,
            text: "أعجبني مستوى الأمان وسهولة الاستخدام، بالإضافة إلى التحديثات الفورية التي تجعل متابعة الطلبات أكثر كفاءة."
        },
        {
            name: "سارة المصري",
            image: testimonial2,
            text: "إدارة المنتجات والطلبات من خلال طلباتي سهلة جدًا، وساعدتنا على الوصول إلى عدد أكبر من المتاجر وزيادة المبيعات."
        },
        {
            name: "محمود أبو خالد",
            image: testimonial3,
            text: "منصة رائعة وفرت علينا الكثير من الوقت والجهد في البحث عن الموردين. أصبحت عملية الطلب أسرع وأسهل من قبل."
        },
        {
          name: "ليان أحمد",
          image: testimonial4,
          text: "تجربتي كانت ممتازة، تمكنت من العثور على منتجات بجودة عالية وأسعار مناسبة، مما ساعدني على زيادة أرباح متجري."
        },
        {
          name: "خالد يوسف",
          image: testimonial5,
          text: "وفّر علينا الموقع وقتًا طويلًا في البحث عن الموردين المناسبين. كل شيء منظم وسهل، وأصبحنا ننجز طلباتنا بسرعة أكبر."
        }
    ];

function Comments() {
  return (

    <section id="comment" className="testimonials py-20">

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        ماذا يقولون
        <span className="text-[#F2762E]"> عنا؟</span>
      </h2>

      <p className="text-center text-gray-500 max-w-xl mx-auto mb-12">
        تجارب حقيقية من عملائنا الذين وثقوا بمنصتنا لتسهيل أعمالهم.
      </p>

      <div className="max-w-7xl mx-auto px-6">
      <Swiper
        modules={[Pagination]}
        dir="rtl"
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="pb-12!"
      >

        {comments.map((comment, index) => (

          <SwiperSlide key={index}>
            <div className="flex justify-center">
            <div
              className="relative w-full max-w-82.5  bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-5 md:p-7 overflow-hidden  flex flex-col"
            >

              <img
                src={quotes}
                alt=""
                className="absolute top-6 left-6 w-10 opacity-10 rotate-180"
              />


              <div className="flex items-center gap-4">

                <img
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-[#F2762E]/10"
                  src={comment.image}
                  alt={comment.name}
                />

                <div>
                  <h3 className="text-lg font-semibold">
                    {comment.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    صاحب متجر
                  </p>
                </div>

              </div>


              <p className="text-gray-600 leading-8 text-[15px] my-6 flex-1">
                "{comment.text}"
              </p>


              <div className="flex gap-1 border-t border-gray-100 pt-5">

                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    className="text-[20px] text-[#F2762E]"
                  >
                    ★
                  </span>
                ))}

              </div>
            </div>
          </div>
          </SwiperSlide>

        ))}

      </Swiper>
      </div>
    </section>
  );
}

export default Comments;