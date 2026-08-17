import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button, Input, PasswordInput } from "../../../components/common";
import Logo2 from "../../../assets/images/logo2.svg";
import { FaRegUser } from "react-icons/fa";
import { RiLock2Fill } from "react-icons/ri";
import { login } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });

  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      const userData = res.data.user;
      const token = res.data.token;
      loginUser(userData, token); //تخزين بيانات المستخدم عبر كونتيكست
      navigate("/"); // Redirect to the home page after successful login
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center overflow-hidden px-6 py-5 md:px-12 bg-white">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <img src={Logo2} alt="Talabati" className="" />

          <h1 className="text-xl font-semibold text-[#1a3a5c]">
            شريكك الالكتروني في التوريد والتوصيل
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="البريد الإلكتروني أو رقم الموبايل "
            placeholder="example@gmail.com"
            icon={<FaRegUser />}
            registration={register("email", {
              required: " البريد الإلكتروني مطلوب ",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: " البريد الإلكتروني غير صالح ",
              },
            })}
            error={errors.email?.message}
          />

          <PasswordInput
            label=" كلمة المرور "
            type="password"
            icon={<RiLock2Fill />}
            registration={register("password", {
              required: " كلمة المرور مطلوبة ",
              minLength: {
                value: 6,
                message: " يجب أن تكون كلمة المرور أكثر من 6 أحرف ",
              },
            })}
            error={errors.password?.message}
            extraLeftElement
          />

          {/* Remember/forget link */}
          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-500 hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              {/* remember me */}
              <input
                type="checkbox"
                {...register("remember")}
                className="accent-orange-500"
              />
              تذكرني
            </label>
          </div>
          {/* Login button */}
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        {/* Register link */}
        <div className="mt-2 text-center text-sm text-gray-500">
          ليس لديك حساب؟
          <Link to="/register" className="text-orange-500 mr-1 hover:underline">
            سجل الان كمتجر أو مورد
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
