import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const steps = [
  { number: 3, label: " بيانات النشاط " },
  { number: 2, label: " نوع الحساب " },
  { number: 1, label: " البيانات الأساسية " },
];

export default function Stepper({ currentStep }) {
  return (
    <div className="flex justify-center px-6 py-5">
      {steps.map((step, idx) => {
        const isDone = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div
            key={step.number}
            className="flex-1 flex flex-col items-center relative"
          >
            {/* الخط */}
            {idx !== steps.length - 1 && (
              <div className="absolute top-5 right-1/2 translate-x-full w-full h-0.5 bg-gray-200">
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isDone ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ originX: 1 }}
                  className="h-full bg-[#1a3a5c]"
                />
              </div>
            )}

            {/* الدائرة */}
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isDone
                  ? "#1a3a5c"
                  : isActive
                    ? "#f97316"
                    : "#e5e7eb",
                scale: isActive ? 1.08 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold"
            >
              {isDone ? (
                <FaCheck className="text-white text-sm" />
              ) : (
                <span className={isActive ? "text-white" : "text-gray-500"}>
                  {step.number}
                </span>
              )}
            </motion.div>

            {/* النص */}
            <motion.span
              animate={{
                color: isActive ? "#f97316" : "#9ca3af",
              }}
              className="mt-3 text-xs font-medium whitespace-nowrap"
            >
              {step.label}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
