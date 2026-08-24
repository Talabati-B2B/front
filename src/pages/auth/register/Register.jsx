import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import logo from "../../../assets/images/logo.svg";
import AuthLayout from "../../../components/layout/AuthLayout";
import Stepper from "./components/Stepper";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import { mockRegister } from "../../../services/auth.mock";

// حركة في الستيب بروجرس
const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [role, setRole] = useState("");
  // لحفظ بيانات  الخطوة الولى عند الرجوع
  const [stepOneData, setStepOneData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
  });
  // حفظ بيانات الخطوة الثالثة عند الرجوع
  const [stepThreeData, setStepThreeData] = useState({
    businessName: "",
    businessType: "",
    location: "",
    tab: "info",
    docType: "commercial",
    docFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleStepOneNext = () => goNext();

  const handleStepTwoNext = (selectedRole) => {
    if (!selectedRole) return;

    setRole(selectedRole);
    setStep(3);
  };

  const handleFinalSubmit = async (stepThreeData) => {
    const fullData = { ...stepOneData, role, ...stepThreeData };
    console.log("Full registration data:", fullData);

    setIsLoading(true);

    try {
     await mockRegister(fullData);

      await Swal.fire({
        icon: "success",
        title: "تم التسجيل بنجاح! 🎉",
        text: "تحقق من بريدك الإلكتروني لتفعيل حسابك",
        confirmButtonText: "الذهاب لتسجيل الدخول",
        confirmButtonColor: "#f97316",
      });

      navigate("/login");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "فشل التسجيل",
        text: error.response?.data?.message || "حدث خطأ غير متوقع",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <img src={logo} alt="Talabati Logo" className="w-[237px] h-auto" />
      </div>
      {/* progress bar */}
      <Stepper currentStep={step} />

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 1 && (
              <StepOne
                onNext={handleStepOneNext}
                data={stepOneData}
                setData={setStepOneData}
              />
            )}
            {step === 2 && (
              <StepTwo
                role={role}
                setRole={setRole}
                onNext={handleStepTwoNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <StepThree
                role={role}
                onBack={goBack}
                onSubmit={handleFinalSubmit}
                data={stepThreeData}
                setData={setStepThreeData}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
