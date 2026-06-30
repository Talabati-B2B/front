import { FaUserTie, FaStore } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function LoginSide() {
  const features = [
    {
      icon: <FaStore />,
      title: " إدارة سلاسل التوريد ",
      desc: " نظام لوجستي متكامل لدعم نمو أعمالك ",
    },
    {
      icon: <FaUserTie />,
      title: " +500 ",
      desc: " مورد نشط ",
    },
    {
      icon: <FaClockRotateLeft />,
      title: "24/7",
      desc: " توصيل مستمر ",
    },
  ];

  return (
    <div className=" h-screen overflow-hidden" dir="rtl">
      <div className="relative z-10 mt-20 flex flex-col justify-center items-center text-white pl-8">
        <motion.h1
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-5"
        >
          مرحباً بك في
          <motion.span  className="text-orange-500"> طلباتي  </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/90 text-lg mb-10"
        >
          منصة ذكية لإدارة سلسلة التوريد
        </motion.p>
        {/* cards */}
        <div className="mt-20 space-y-3 w-full max-w-sm flex flex-col">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              className="bg-white/10 opacity-50 rounded-2xl px-5 py-2 gap-4 text-white/90 flex justify-start"
            >
              {/* icon */}
              <div className="w-14 h-14 rounded-xl text-orange-500 bg-white/10 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              {/* tittle & description */}
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm font-light mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
