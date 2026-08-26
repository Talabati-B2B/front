import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../../../components/layout/AuthLayout";
import { Input, Button } from "../../../components/common";
import ForgetImg from "../../../assets/images/forget-password.png";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../services/authService";
import { getApiErrorMessage } from "../../../utils/apiError";

export default function ForgotPassword() {
  const [sentTo, setSentTo] = useState("");
  const [requestError, setRequestError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setRequestError("");

    try {
      await forgotPassword(data.email);

      // الرابط يصل على البريد ويحمل التوكن، فلا نوجّه لصفحة إعادة التعيين مباشرة
      setSentTo(data.email);
    } catch (err) {
      setRequestError(getApiErrorMessage(err));
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

        {/* success message */}
        {sentTo && (
          <div className="mb-4 w-full rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
            تم إرسال رابط إعادة التعيين إلى {sentTo}، تفقّد بريدك الإلكتروني
          </div>
        )}

        {/* error message */}
        {requestError && (
          <div className="mb-4 w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center">
            {requestError}
          </div>
        )}

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
