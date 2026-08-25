import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiChevronDown,
  FiClipboard,
  FiInfo,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import illustration from "../../assets/images/add-product-illustration.png";

const INITIAL_FORM = {
  name: "",
  description: "",
  category: "",
  sku: "",
  unitPrice: "",
  suggestedPrice: "",
  quantity: "",
  minimumStock: "",
};

const CATEGORIES = [
  "مواد غذائية",
  "مشروبات",
  "تنظيف",
  "تغليف",
  "مستلزمات",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-1 text-[11px] font-medium text-[#D32F2F]">{message}</p>;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedProduct, setSubmittedProduct] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }
  };

  const validateImage = (file) => {
    if (!file) return "صورة المنتج مطلوبة";
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "يرجى اختيار صورة بصيغة JPG أو PNG";
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return "حجم الصورة يجب ألا يتجاوز 5MB";
    }
    return "";
  };

  const handleImage = (file) => {
    const imageError = validateImage(file);

    if (imageError) {
      setErrors((current) => ({ ...current, image: imageError }));
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, image: "" }));
  };

  const handleFileChange = (event) => {
    handleImage(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleImage(event.dataTransfer.files?.[0]);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "اسم المنتج مطلوب";
    if (!form.description.trim()) nextErrors.description = "وصف المنتج مطلوب";
    if (!form.category) nextErrors.category = "فئة المنتج مطلوبة";
    if (!form.sku.trim()) nextErrors.sku = "رمز المنتج (SKU) مطلوب";

    if (form.unitPrice === "" || Number(form.unitPrice) <= 0) {
      nextErrors.unitPrice = "أدخل سعر وحدة أكبر من صفر";
    }

    if (form.suggestedPrice === "" || Number(form.suggestedPrice) <= 0) {
      nextErrors.suggestedPrice = "أدخل سعر بيع مقترح أكبر من صفر";
    }

    if (form.quantity === "" || Number(form.quantity) < 0) {
      nextErrors.quantity = "أدخل كمية صحيحة";
    }

    if (form.minimumStock === "" || Number(form.minimumStock) < 0) {
      nextErrors.minimumStock = "أدخل حدًا أدنى صحيحًا";
    }

    const imageError = validateImage(imageFile);
    if (imageError) nextErrors.image = imageError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    const product = {
      id: Date.now(),
      ...form,
      unitPrice: Number(form.unitPrice),
      suggestedPrice: Number(form.suggestedPrice),
      quantity: Number(form.quantity),
      minimumStock: Number(form.minimumStock),
      imageName: imageFile?.name ?? "",
    };

    setSubmittedProduct(product);
    setShowConfirmation(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    navigate("/products");
  };

  const handleSuccessBackdrop = () => {
    if (showSuccess && submittedProduct) {
      setShowSuccess(false);
      navigate("/products");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F8FF]" dir="rtl">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-[1500px] px-5 pb-12 pt-8 sm:px-6 lg:px-8"
          >
            <section
              dir="ltr"
              className="mb-6 grid min-h-[320px] grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1.05fr]"
            >
              <div className="order-2 flex items-end justify-center lg:order-1 lg:justify-start">
                <img
                  src={illustration}
                  alt="إضافة منتج جديد"
                  className="h-auto w-full max-w-[500px] object-contain"
                />
              </div>

              <div dir="rtl" className="order-1 pt-3 text-right lg:order-2 lg:pt-6">
                <h1 className="text-[22px] font-bold text-[#062454] sm:text-[26px]">
                  أضف منتج جديد إلى قائمة منتجاتك
                </h1>
              </div>
            </section>

            <section className="rounded-[18px] border border-[#CAD1DA] bg-white px-5 py-7 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-8 lg:px-10 lg:py-9">
              <div className="mb-7 flex items-center justify-start gap-3">
                <FiClipboard className="text-[#F47821]" size={31} />
                <h2 className="text-[24px] font-bold text-[#062454] sm:text-[28px]">
                  معلومات المنتج
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-x-12 gap-y-7 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                      اسم المنتج<span className="text-[#F47821]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="اكتب اسم منتجك..."
                      className={`h-[58px] w-full rounded-[8px] border bg-white px-4 text-[14px] text-[#2F343B] outline-none placeholder:text-[#A4A8AE] focus:border-[#6F8FC5] ${
                        errors.name ? "border-[#D32F2F]" : "border-[#BFC4CA]"
                      }`}
                    />
                    <FieldError message={errors.name} />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                      وصف المنتج<span className="text-[#F47821]">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="اكتب وصف منتجك بالتفصيل..."
                      className={`min-h-[255px] w-full resize-none rounded-[8px] border bg-white px-4 py-4 text-[14px] leading-6 text-[#2F343B] outline-none placeholder:text-[#A4A8AE] focus:border-[#6F8FC5] ${
                        errors.description
                          ? "border-[#D32F2F]"
                          : "border-[#BFC4CA]"
                      }`}
                    />
                    <FieldError message={errors.description} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                      أضف صورة المنتج<span className="text-[#F47821]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`relative flex min-h-[226px] w-full flex-col items-center justify-center overflow-hidden rounded-[16px] border bg-[#FAFBFC] px-5 text-center transition ${
                        errors.image
                          ? "border-[#D32F2F]"
                          : isDragging
                            ? "border-[#6F8FC5] bg-[#F1F6FD]"
                            : "border-[#BFC4CA]"
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="معاينة صورة المنتج"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 bg-black/20" />
                          <span className="relative rounded-lg bg-white/90 px-4 py-2 text-[12px] font-semibold text-[#062454]">
                            تغيير الصورة
                          </span>
                        </>
                      ) : (
                        <>
                          <FiUploadCloud size={42} className="text-[#94BEC8]" />
                          <span className="mt-3 text-[13px] font-semibold text-[#31363D]">
                            إضافة منتج جديد
                          </span>
                          <span className="mt-6 text-[11px] leading-5 text-[#A3A7AD]">
                            اسحب صورة هنا أو انقر للتصفح
                            <br />
                            (PNG,JPG الحد الأقصى 5MB)
                          </span>
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FieldError message={errors.image} />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                      فئة المنتج<span className="text-[#F47821]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={(event) =>
                          updateField("category", event.target.value)
                        }
                        className={`h-[58px] w-full appearance-none rounded-[8px] border bg-white px-4 pl-11 text-[14px] outline-none focus:border-[#6F8FC5] ${
                          form.category ? "text-[#2F343B]" : "text-[#A4A8AE]"
                        } ${
                          errors.category
                            ? "border-[#D32F2F]"
                            : "border-[#BFC4CA]"
                        }`}
                      >
                        <option value="">اختر فئة المنتج</option>
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8188]"
                        size={18}
                      />
                    </div>
                    <FieldError message={errors.category} />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                      رمز المنتج (SKU)<span className="text-[#F47821]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(event) => updateField("sku", event.target.value)}
                      placeholder="اكتب رمز منتجك أو امسح رمز الباركود"
                      className={`h-[58px] w-full rounded-[8px] border bg-white px-4 text-[14px] text-[#2F343B] outline-none placeholder:text-[#A4A8AE] focus:border-[#6F8FC5] ${
                        errors.sku ? "border-[#D32F2F]" : "border-[#BFC4CA]"
                      }`}
                    />
                    <FieldError message={errors.sku} />
                  </div>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                    سعر الوحدة<span className="text-[#F47821]">*</span>
                  </label>
                  <div className="flex" dir="rtl">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitPrice}
                      onChange={(event) =>
                        updateField("unitPrice", event.target.value)
                      }
                      placeholder="0.0"
                      className={`h-[58px] min-w-0 flex-1 rounded-r-[8px] border border-l-0 bg-white px-4 text-[14px] text-[#2F343B] outline-none placeholder:text-[#8F9399] focus:border-[#6F8FC5] ${
                        errors.unitPrice
                          ? "border-[#D32F2F]"
                          : "border-[#BFC4CA]"
                      }`}
                    />
                    <span className="flex h-[58px] w-[78px] items-center justify-center rounded-l-[8px] border border-[#BFC4CA] bg-white text-[13px] text-[#6E747B]">
                      شيكل
                    </span>
                  </div>
                  <FieldError message={errors.unitPrice} />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                    الكمية<span className="text-[#F47821]">*</span>
                  </label>
                  <div className="flex" dir="rtl">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.quantity}
                      onChange={(event) =>
                        updateField("quantity", event.target.value)
                      }
                      placeholder="0"
                      className={`h-[58px] min-w-0 flex-1 rounded-r-[8px] border border-l-0 bg-white px-4 text-[14px] text-[#2F343B] outline-none placeholder:text-[#8F9399] focus:border-[#6F8FC5] ${
                        errors.quantity
                          ? "border-[#D32F2F]"
                          : "border-[#BFC4CA]"
                      }`}
                    />
                    <span className="flex h-[58px] w-[78px] items-center justify-center rounded-l-[8px] border border-[#BFC4CA] bg-white text-[13px] text-[#6E747B]">
                      قطعة
                    </span>
                  </div>
                  <FieldError message={errors.quantity} />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                    سعر البيع المقترح<span className="text-[#F47821]">*</span>
                  </label>
                  <div className="flex" dir="rtl">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.suggestedPrice}
                      onChange={(event) =>
                        updateField("suggestedPrice", event.target.value)
                      }
                      placeholder="0.0"
                      className={`h-[58px] min-w-0 flex-1 rounded-r-[8px] border border-l-0 bg-white px-4 text-[14px] text-[#2F343B] outline-none placeholder:text-[#8F9399] focus:border-[#6F8FC5] ${
                        errors.suggestedPrice
                          ? "border-[#D32F2F]"
                          : "border-[#BFC4CA]"
                      }`}
                    />
                    <span className="flex h-[58px] w-[78px] items-center justify-center rounded-l-[8px] border border-[#BFC4CA] bg-white text-[13px] text-[#6E747B]">
                      شيكل
                    </span>
                  </div>
                  <FieldError message={errors.suggestedPrice} />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#22252A]">
                    الحد الأدنى<span className="text-[#F47821]">*</span>
                  </label>
                  <div className="flex" dir="rtl">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.minimumStock}
                      onChange={(event) =>
                        updateField("minimumStock", event.target.value)
                      }
                      placeholder="0"
                      className={`h-[58px] min-w-0 flex-1 rounded-r-[8px] border border-l-0 bg-white px-4 text-[14px] text-[#2F343B] outline-none placeholder:text-[#8F9399] focus:border-[#6F8FC5] ${
                        errors.minimumStock
                          ? "border-[#D32F2F]"
                          : "border-[#BFC4CA]"
                      }`}
                    />
                    <span className="flex h-[58px] w-[78px] items-center justify-center rounded-l-[8px] border border-[#BFC4CA] bg-white text-[13px] text-[#6E747B]">
                      قطعة
                    </span>
                  </div>
                  <FieldError message={errors.minimumStock} />
                </div>
              </div>

              <div className="mx-auto mt-8 flex min-h-[82px] max-w-[880px] items-center justify-center gap-4 rounded-[14px] bg-[#EDF4FF] px-5 py-4 text-center text-[14px] font-medium text-[#062454] sm:text-[15px]">
                <FiInfo size={27} className="shrink-0 text-[#0F57B5]" />
                <p>
                  سعر البيع المقترح هو السعر الذي تقترحه بناءً على سعر الشراء
                  والربح المناسب
                </p>
              </div>
            </section>

            <div className="mt-8 flex flex-wrap justify-start gap-5">
              <button
                type="submit"
                className="flex min-h-[58px] min-w-[230px] items-center justify-center gap-3 rounded-[13px] bg-[#2F67EB] px-8 text-[18px] font-bold text-white shadow-sm transition hover:bg-[#2458D8]"
              >
                <FiCheck size={28} />
                حفظ المنتج
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="flex min-h-[58px] min-w-[190px] items-center justify-center gap-3 rounded-[13px] border border-[#F04444] bg-white px-8 text-[18px] font-bold text-[#D92D2D] transition hover:bg-[#FFF7F7]"
              >
                <FiX size={26} />
                إلغاء
              </button>
            </div>
          </form>
        </main>
      </div>

      {showConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/35 p-4"
          dir="rtl"
        >
          <div className="w-full max-w-[610px] rounded-[14px] bg-white px-8 py-11 shadow-[0_16px_45px_rgba(15,23,42,0.18)]">
            <p className="text-center text-[17px] font-medium text-[#20242A]">
              هل أنت متأكد من بيانات المنتج؟
            </p>

            <div className="mt-9 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex h-10 min-w-[94px] items-center justify-center gap-2 rounded-[6px] bg-[#2F67EB] px-4 text-[14px] font-semibold text-white"
              >
                <FiCheck size={17} />
                موافق
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="h-10 min-w-[94px] rounded-[6px] border border-[#F04444] bg-white px-4 text-[14px] font-medium text-[#D92D2D]"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <button
          type="button"
          aria-label="إغلاق رسالة النجاح والعودة إلى المنتجات"
          onClick={handleSuccessBackdrop}
          className="fixed inset-0 z-50 flex w-full cursor-default items-center justify-center bg-[#1F2937]/35 p-4 text-right"
          dir="rtl"
        >
          <span className="flex w-full max-w-[610px] cursor-pointer flex-col items-center rounded-[14px] bg-white px-8 py-11 shadow-[0_16px_45px_rgba(15,23,42,0.18)]">
            <span className="text-center text-[17px] font-medium text-[#20242A]">
              تمت إضافة منتجك بنجاح
            </span>
            <FiCheck
              aria-hidden="true"
              className="mt-8 text-[#F47821]"
              size={82}
              strokeWidth={2.5}
            />
          </span>
        </button>
      )}
    </div>
  );
}
