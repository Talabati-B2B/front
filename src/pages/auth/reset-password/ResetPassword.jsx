import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout";
import { PasswordInput, Button } from "../../../components/common";
import ResetImg from "../../../assets/images/forget-password.png";
import { RiLock2Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { resetPassword } from "../../../services/authService";
import { getApiErrorMessage } from "../../../utils/apiError";

export default function ResetPassword() {
  const navigate = useNavigate();

  // رابط إعادة التعيين يصل بالشكل /reset-password?token=...&email=...
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await resetPassword({ ...data, token, email });

      await Swal.fire({
        icon: "success",
        title: "تم التحديث بنجاح 🎉",
        text: "تم تغيير كلمة المرور بنجاح",
        confirmButtonText: "تسجيل الدخول",
        confirmButtonColor: "#f97316",
      });

      navigate("/login", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "فشل التحديث",
        text: getApiErrorMessage(err),
      });
    }
  };

  // بدون التوكن والبريد لا يمكن إتمام الطلب، فنوقف المستخدم مبكراً
  if (!token || !email) {
    return (
      <AuthLayout>
        <div
          className="px-8 pt-3 pb-6 flex flex-col items-center justify-center text-center"
          dir="rtl"
        >
          <img src={ResetImg} className="w-64 h-64 object-contain mb-3" />

          <h2 className="text-xl font-bold text-[#1a3a5c] mb-2">
            الرابط غير صالح أو منتهي
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            افتح رابط إعادة التعيين من رسالة البريد الإلكتروني، أو اطلب رابطاً
            جديداً
          </p>

          <Link
            to="/forgot-password"
            className="text-orange-500 font-medium hover:underline"
          >
            طلب رابط جديد
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div
        className="px-8 pt-3 pb-6 flex flex-col items-center justify-center overflow-hidden"
        dir="rtl"
      >
        {/* image */}
        <img src={ResetImg} className="w-64 h-64 object-contain mb-3" />

        {/* title */}
        <h2 className="text-xl font-bold text-[#1a3a5c] mb-2">
          إعادة تعيين كلمة المرور
        </h2>
        <p className="text-sm text-gray-500 mb-6">
            يجب أن تكون كلمة المرور قوية وآمنة
        </p>

        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">

          {/* password */}
          <PasswordInput
            label="كلمة المرور الجديدة"
            icon={<RiLock2Fill />}
            registration={register("password", {
              required: "كلمة المرور مطلوبة",
              minLength: {
                value: 8,
                message: "يجب أن تكون 8 أحرف على الأقل",
              },
            })}
            error={errors.password?.message}
          />

          {/* confirm password */}
          <PasswordInput
            label="تأكيد كلمة المرور"
            icon={<RiLock2Fill />}
            registration={register("confirmPassword", {
              required: "تأكيد كلمة المرور مطلوب",
              validate: (value) =>
                value === getValues("password") ||
                "كلمتا المرور غير متطابقتين",
            })}
            error={errors.confirmPassword?.message}
          />

          {/* button */}
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "تحديث كلمة المرور"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}