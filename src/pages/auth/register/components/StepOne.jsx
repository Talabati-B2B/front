import { useForm } from "react-hook-form";
import { Input, PasswordInput, Button } from "../../../../components/common";
import { FaRegUser, FaIdCard } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { RiLock2Fill } from "react-icons/ri";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function StepOne({ onNext, data, setData }) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: data,
    mode: "onBlur",
  });

  useEffect(() => {
  const subscription = watch((value) => {
    setData(value);
  });

  return () => subscription.unsubscribe();
}, [watch, setData]);

  const onSubmit = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" px-6 pb-6"
      dir="rtl"
      noValidate
    >
      <p className="text-sm text-gray-700 font-medium mb-4">
        أدخل بياناتك الأساسية لانشاء الحساب
      </p>

      {/* Name fields */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <Input
          label=" الاسم الأول "
          placeholder=" أحمد "
          required
          icon={<FaRegUser />}
          registration={register("firstName", {
            required: " الاسم الأول مطلوب ",
          })}
          error={errors.firstName?.message}
        />

        <Input
          label=" الاسم الأخير "
          placeholder=" أحمد "
          required
          icon={<FaRegUser />}
          registration={register("lastName", {
            required: " الاسم الأخير مطلوب ",
          })}
          error={errors.lastName?.message}
        />
      </div>

      {/* Email field */}
      <div className="mb-3">
        <Input
          label=" البريد الإلكتروني "
          placeholder="example@example.com"
          type="email"
          required
          icon={<MdOutlineEmail />}
          registration={register("email", {
            required: " البريد الإلكتروني مطلوب ",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: " البريد الإلكتروني غير صحيح ",
            },
          })}
          error={errors.email?.message}
        />
      </div>

      {/* Phone + idNumber fields */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <Input
          label=" رقم الموبايل "
          placeholder="0591234567"
          type="tel"
          required
          icon={<FiPhone />}
          registration={register("phone", {
            required: " رقم الموبايل مطلوب ",
            pattern: { value: /^05\d{8}$/, message: " رقم الهاتف غير صحيح " },
          })}
          error={errors.phone?.message}
        />

        <Input
          label=" رقم الهوية "
          placeholder="123456789"
          type="number"
          required
          icon={<FaIdCard />}
          registration={register("idNumber", {
            required: " رقم الهوية مطلوب ",
            pattern: { value: /^\d{9}$/, message: " رقم الهوية غير صحيح " },
          })}
          error={errors.idNumber?.message}
        />
      </div>

      {/* Password + confirmationPass fields */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <PasswordInput
          label=" كلمة المرور "
          type="password"
          required
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
        {/* password confirmation */}
        <PasswordInput
          label=" تأكيد كلمة المرور "
          type="password"
          required
          icon={<RiLock2Fill />}
          registration={register("confirmPassword", {
            required: " تأكيد كلمة المرور مطلوب ",
            validate: (value) =>
              value === getValues("password") || " كلمتا المرور غير متطابقتين ",
          })}
          error={errors.confirmPassword?.message}
        />
      </div>

      {/* Next btn */}
      <Button type="submit" variant="primary" fullWidth>
        التالي
      </Button>
      {/* to login */}
      <p className="text-xs text-center text-gray-400 mt-3">
        لديك حساب بالفعل؟
        <Link
          to="/login"
          className="text-orange-500 font-medium hover:underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
