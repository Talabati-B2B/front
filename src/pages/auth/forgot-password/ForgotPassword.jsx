import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout";
import { Input, Button } from "../../../components/common";
import ForgetImg from "../../../assets/images/forget-password.png";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  //Mock API
  const mockForgotPasswordAPI = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email === "fail@test.com") {
          reject("Error");
        } else {
          resolve("Success");
        }
      }, 1200);
    });
  };

  const onSubmit = async (data) => {
    try {
      await mockForgotPasswordAPI(data);

      await Swal.fire({
        icon: "success",
        title: "تم الإرسال 📩",
        text: "تم إرسال رابط إعادة تعيين كلمة المرور",
        confirmButtonText: "حسناً",
        toast: true,
      });

      navigate("/reset-password");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "فشل الإرسال",
        text: "تأكد من البريد الإلكتروني وحاول مرة أخرى",
      });
      console.error(err);
    }
  };

  return (
    <AuthLayout>
      <div
        className="px-8 pt-3 pb-6 flex flex-col items-center justify-center overflow-hidden"
        dir="rtl"
      >
        <div>
          <div>
            <img src={ForgetImg} className="w-72 h-72" />
          </div>
          <h2 className="text-xl font-bold text-[#1a3a5c] mb-2">
            نسيت كلمة المرور؟
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 grid w-full"
        >
          {/* email field */}
          <div>
            <Input
              label=" البريد الإلكتروني "
              placeholder="example@gmail.com"
              icon={<FiMail />}
              error={errors.email?.message}
              registration={{
                ...register("email", {
                  required: " البريد الإلكتروني مطلوب ",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: " البريد الالكتروني غير صحيح ",
                  },
                }),
              }}
            />
          </div>
          {/* submit btn */}
          <div>
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
            </Button>

            {/* to login */}
            <p className="text-xs text-center text-gray-400 mt-3">
              <Link
                to="/login"
                className="text-orange-500 font-medium hover:underline"
              >
                العودة الى تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
