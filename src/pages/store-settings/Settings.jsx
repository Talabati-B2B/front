import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiCheckCircle,
  FiFileText,
  FiLock,
  FiMapPin,
  FiPhone,
  FiSave,
  FiShoppingBag,
  FiUploadCloud,
} from "react-icons/fi";
import { storeProfile as defaultStoreProfile } from "../../services/store/storeProfile.mock";

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  dir,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[12px] font-semibold text-[#30343A]">
        {label}
      </span>

      <div className="relative">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A818D]"
            size={17}
          />
        ) : null}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-[#1F2937] outline-none transition placeholder:text-[#A0A5AE] ${
            Icon ? "pr-10" : ""
          } ${
            error
              ? "border-[#E05252] focus:ring-2 focus:ring-[#E05252]/10"
              : "border-[#DDE1E7] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
          }`}
        />
      </div>

      {error ? (
        <span className="mt-1.5 block text-[10px] text-[#D83232]">{error}</span>
      ) : null}
    </label>
  );
}

export default function Settings() {
  const {
    storeProfile = defaultStoreProfile,
    saveStoreProfile,
  } = useOutletContext() ?? {};

  const [form, setForm] = useState({
    storeName: storeProfile.storeName,
    mobile: storeProfile.mobile,
    address: storeProfile.address,
    latitude: storeProfile.latitude,
    longitude: storeProfile.longitude,
    password: "",
  });
  const [documents, setDocuments] = useState(storeProfile.verificationDocuments ?? []);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef(null);

  const originalDocuments = storeProfile.verificationDocuments ?? [];
  const hasChanges =
    form.storeName !== storeProfile.storeName ||
    form.mobile !== storeProfile.mobile ||
    form.address !== storeProfile.address ||
    form.latitude !== storeProfile.latitude ||
    form.longitude !== storeProfile.longitude ||
    form.password.length > 0 ||
    documents.length !== originalDocuments.length ||
    documents.some(
      (document, index) => document.name !== originalDocuments[index]?.name,
    );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setSaveMessage("");

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setDocuments([
      {
        id: Date.now(),
        name: file.name,
        status: "مرفوعة محلياً",
      },
    ]);
    setSaveMessage("");
    event.target.value = "";
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.storeName.trim()) {
      nextErrors.storeName = "اسم المتجر مطلوب.";
    }

    if (!form.mobile.trim()) {
      nextErrors.mobile = "رقم الجوال مطلوب.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "عنوان المتجر مطلوب.";
    }

    if (form.latitude.trim() && Number.isNaN(Number(form.latitude))) {
      nextErrors.latitude = "أدخل قيمة رقمية صحيحة.";
    }

    if (form.longitude.trim() && Number.isNaN(Number(form.longitude))) {
      nextErrors.longitude = "أدخل قيمة رقمية صحيحة.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      setSaveMessage("");
      return;
    }

    saveStoreProfile?.({
      storeName: form.storeName.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      latitude: form.latitude.trim(),
      longitude: form.longitude.trim(),
      verificationDocuments: documents,
    });

    setForm((current) => ({ ...current, password: "" }));
    setSaveMessage("تم حفظ التعديلات محلياً على بيانات المتجر.");
  };

  return (
    <section dir="rtl" className="min-h-full bg-white px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#062454]">الإعدادات</h1>
          <p className="mt-1 text-[12px] text-[#7A818D]">
            إدارة معلومات المتجر وبيانات التواصل والموقع.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <article className="rounded-xl border border-[#E0E4EA] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-[#EEF0F3] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E9EDF3] text-[#062454]">
                <FiShoppingBag size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-[#062454]">
                  معلومات المتجر
                </h2>
                <p className="mt-0.5 text-[10px] text-[#7A818D]">
                  البيانات الأساسية الخاصة بالمتجر.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="اسم المتجر"
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                icon={FiShoppingBag}
                error={errors.storeName}
              />

              <Field
                label="رقم الجوال"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                icon={FiPhone}
                error={errors.mobile}
                dir="ltr"
              />

              <div className="md:col-span-2">
                <Field
                  label="العنوان"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  icon={FiMapPin}
                  error={errors.address}
                />
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-[#E0E4EA] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-[#EEF0F3] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF0E6] text-[#B64B00]">
                <FiMapPin size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-[#062454]">
                  الموقع الجغرافي
                </h2>
                <p className="mt-0.5 text-[10px] text-[#7A818D]">
                  إحداثيات موقع المتجر.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="خط العرض"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="31.0000"
                error={errors.latitude}
                dir="ltr"
              />

              <Field
                label="خط الطول"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="34.0000"
                error={errors.longitude}
                dir="ltr"
              />
            </div>
          </article>

          <article className="rounded-xl border border-[#E0E4EA] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-[#EEF0F3] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8EEF2] text-[#40577B]">
                <FiFileText size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-[#062454]">
                  وثائق اعتماد الوكالة
                </h2>
                <p className="mt-0.5 text-[10px] text-[#7A818D]">
                  تحديث الوثيقة المحفوظة ضمن بيانات المتجر.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleDocumentUpload}
              aria-label="رفع وثيقة اعتماد الوكالة"
            />

            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-[#C9CFD8] bg-[#FAFBFC] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                {documents.length ? (
                  documents.map((document) => (
                    <div key={document.id} className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#40577B] ring-1 ring-[#E1E4E9]">
                        <FiFileText size={17} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-[#30343A]">
                          {document.name}
                        </p>
                        <p className="mt-1 text-[10px] text-[#2C9A58]">
                          {document.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[#7A818D]">لا توجد وثيقة مرفوعة.</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#9FB0C8] bg-white px-4 text-[12px] font-semibold text-[#20365A] transition hover:bg-[#F7F9FC]"
              >
                <FiUploadCloud size={17} aria-hidden="true" />
                تحديث الوثيقة
              </button>
            </div>
          </article>

          <article className="rounded-xl border border-[#E0E4EA] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-[#EEF0F3] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3ECFF] text-[#6D4FB3]">
                <FiLock size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-[#062454]">
                  كلمة المرور
                </h2>
                <p className="mt-0.5 text-[10px] text-[#7A818D]">
                  التغيير هنا محلي فقط ولا يحدّث نظام المصادقة.
                </p>
              </div>
            </div>

            <div className="max-w-[520px]">
              <Field
                label="كلمة المرور الجديدة"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                icon={FiLock}
                placeholder="أدخل كلمة مرور جديدة"
              />
            </div>
          </article>

          <div className="flex flex-col gap-3 rounded-xl border border-[#E0E4EA] bg-[#FAFBFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-5">
              {saveMessage ? (
                <p className="flex items-center gap-2 text-[11px] font-medium text-[#16834B]">
                  <FiCheckCircle size={16} aria-hidden="true" />
                  {saveMessage}
                </p>
              ) : (
                <p className="text-[10px] text-[#7A818D]">
                  التعديلات في هذه المرحلة محفوظة محلياً فقط.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!hasChanges}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-6 text-[13px] font-bold text-white transition hover:bg-[#EA6B0D] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <FiSave size={17} aria-hidden="true" />
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
