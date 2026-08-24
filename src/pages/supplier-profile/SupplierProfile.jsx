import { useMemo, useRef, useState } from "react";
import {
  FiCamera,
  FiCheckCircle,
  FiEye,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiX,
} from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  readSupplierProfileMock,
  saveSupplierProfileMock,
} from "../../services/supplier/supplierProfile.mock";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  dir = "rtl",
  icon: Icon,
  error,
  readOnly = false,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-[#303846]">
        {label}
        {required ? <span className="mr-1 text-[#F97316]">*</span> : null}
      </span>

      <div className="relative">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818894]"
            size={16}
          />
        ) : null}

        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          dir={dir}
          readOnly={readOnly}
          className={`h-11 w-full rounded-lg border bg-[#FAFBFC] px-3 text-[12px] text-[#344054] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#1D73C9]/10 ${
            Icon ? "pr-9" : ""
          } ${
            error
              ? "border-[#E25B5B] focus:border-[#E25B5B]"
              : "border-[#E1E5EA] focus:border-[#6EA8DE]"
          } ${readOnly ? "cursor-default text-[#69707D]" : ""}`}
        />
      </div>

      {error ? (
        <span className="mt-1 block text-[10px] text-[#D14343]">{error}</span>
      ) : null}
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-[#303846]">
        {label}
      </span>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="h-11 w-full rounded-lg border border-[#E1E5EA] bg-[#FAFBFC] px-3 text-[12px] text-[#344054] outline-none transition focus:border-[#6EA8DE] focus:bg-white focus:ring-2 focus:ring-[#1D73C9]/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function DocumentCard({ document, onView }) {
  return (
    <div className="flex min-h-[72px] items-center gap-3 rounded-lg border border-[#E2E6EB] bg-white px-3 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#2563A9]">
        <FiFileText size={18} aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold text-[#253A5B]">
          {document.name}
        </p>
        <p className="mt-1 text-[10px] font-semibold text-[#27A35A]">
          {document.status}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onView(document)}
        aria-label={`عرض ${document.name}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-[#20365A]"
      >
        <FiEye size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function SupplierProfile() {
  const initialProfile = useMemo(() => readSupplierProfileMock(), []);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [form, setForm] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const avatarInputRef = useRef(null);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedProfile),
    [form, savedProfile],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaveMessage("");

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName?.trim()) nextErrors.firstName = "الاسم الأول مطلوب.";
    if (!form.lastName?.trim()) nextErrors.lastName = "اسم العائلة مطلوب.";

    if (!form.email?.trim()) {
      nextErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح.";
    }

    if (!form.mobile?.trim()) {
      nextErrors.mobile = "رقم الهاتف مطلوب.";
    } else if (!PHONE_PATTERN.test(form.mobile.trim())) {
      nextErrors.mobile = "يرجى إدخال رقم هاتف صحيح.";
    }

    if (form.whatsapp?.trim() && !PHONE_PATTERN.test(form.whatsapp.trim())) {
      nextErrors.whatsapp = "يرجى إدخال رقم واتساب صحيح.";
    }

    if (!form.companyName?.trim()) nextErrors.companyName = "اسم الشركة مطلوب.";
    if (!form.businessType?.trim()) nextErrors.businessType = "نوع النشاط التجاري مطلوب.";
    if (!form.companyLocation?.trim()) nextErrors.companyLocation = "موقع الشركة مطلوب.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setSaveMessage("");
      return;
    }

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    const nextProfile = {
      ...form,
      firstName,
      lastName,
      ownerName: `${firstName} ${lastName}`.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      whatsapp: form.whatsapp?.trim() ?? "",
      jobTitle: form.jobTitle?.trim() ?? "",
      companyName: form.companyName.trim(),
      businessType: form.businessType.trim(),
      companyLocation: form.companyLocation.trim(),
      bio: form.bio?.trim() ?? "",
      services: form.services?.trim() ?? "",
    };

    saveSupplierProfileMock(nextProfile);
    setSavedProfile(nextProfile);
    setForm(nextProfile);
    setSaveMessage("تم حفظ التعديلات محلياً بنجاح.");
  };

  const handleCancel = () => {
    setForm(savedProfile);
    setErrors({});
    setSaveMessage("");
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveMessage("يرجى اختيار ملف صورة صالح.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        avatarSrc: String(reader.result ?? ""),
      }));
      setSaveMessage("");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F7]" dir="rtl">
      <Sidebar
        supplierName={savedProfile.companyName}
        supplierRole="مورد"
        avatarSrc={savedProfile.avatarSrc}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          variant="profile"
          title="ملف الشخصي"
          onProfileSave={handleSave}
          onProfileCancel={handleCancel}
          profileHasChanges={hasChanges}
        />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#F4F5F7]">
          <section dir="rtl" className="min-h-full pb-8">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              aria-label="تغيير صورة الملف الشخصي"
            />

            {/* Profile hero */}
            <div className="mb-5 overflow-hidden border-b border-[#E1E5EA] bg-white">
              <div className="h-[150px] bg-[#15447E] sm:h-[170px]" />

              <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
                <div className="flex flex-col items-center pb-5 sm:flex-row sm:items-end sm:gap-5">
                  <div className="relative -mt-[62px] shrink-0 sm:-mt-[66px]">
                    <div className="flex h-[124px] w-[124px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#F97316] text-[46px] font-bold text-white shadow-[0_4px_14px_rgba(15,23,42,0.16)] sm:h-[132px] sm:w-[132px]">
                      {form.avatarSrc ? (
                        <img
                          src={form.avatarSrc}
                          alt={form.ownerName || form.companyName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{form.firstName?.trim()?.charAt(0) || "م"}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      aria-label="تغيير الصورة الشخصية"
                      className="absolute bottom-1 left-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#0B356C] text-white shadow-md transition-colors hover:bg-[#082A57]"
                    >
                      <FiCamera size={17} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-3 min-w-0 flex-1 text-center sm:mb-2 sm:mt-0 sm:text-right">
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                      <h2 className="max-w-full truncate text-[20px] font-bold text-[#102F59]">
                        {`${form.firstName ?? ""} ${form.lastName ?? ""}`.trim() ||
                          form.companyName}
                      </h2>

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#DDF8E8] px-3 py-1.5 text-[10px] font-bold text-[#16834B]">
                        <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                        {form.status || "فعال"}
                      </span>
                    </div>

                    <p className="mt-1.5 truncate text-[11px] font-medium text-[#667085]">
                      {form.companyName}
                    </p>
                    <p className="mt-1 truncate text-[10px] text-[#98A0AC]" dir="ltr">
                      {form.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[1180px] space-y-4 px-4 sm:px-6">
              {saveMessage ? (
                <div className="flex items-center gap-2 rounded-lg border border-[#CDEDD9] bg-[#F0FBF4] px-4 py-3 text-[11px] font-semibold text-[#16834B]">
                  <FiCheckCircle size={16} aria-hidden="true" />
                  {saveMessage}
                </div>
              ) : null}

              {/* Basic information */}
              <article className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-5">
                <h3 className="mb-4 text-[15px] font-bold text-[#193A67]">
                  المعلومات الأساسية
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label="الاسم الأول"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    error={errors.firstName}
                  />
                  <Field
                    label="اسم العائلة"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    error={errors.lastName}
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="المسمى الوظيفي / Position"
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      icon={FiUser}
                    />
                  </div>

                  <SelectField
                    label="الدولة"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    options={["دولة فلسطين"]}
                  />

                  <Field
                    label="حالة الحساب"
                    name="accountStatus"
                    value={form.accountStatus}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </article>

              {/* Contact */}
              <article className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-5">
                <h3 className="mb-4 text-[15px] font-bold text-[#193A67]">
                  بيانات التواصل
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label="رقم الهاتف"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    icon={FiPhone}
                    error={errors.mobile}
                    dir="ltr"
                  />
                  <Field
                    label="رقم الواتساب"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    icon={FiPhone}
                    error={errors.whatsapp}
                    dir="ltr"
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="البريد الإلكتروني"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      icon={FiMail}
                      error={errors.email}
                      dir="ltr"
                    />
                  </div>
                </div>
              </article>

              {/* Professional details */}
              <article className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-5">
                <h3 className="mb-4 text-[15px] font-bold text-[#193A67]">
                  التفاصيل المهنية
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label="اسم الشركة"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                    error={errors.companyName}
                  />
                  <SelectField
                    label="نوع النشاط التجاري"
                    name="businessType"
                    value={form.businessType}
                    onChange={handleChange}
                    options={["تجارة عامة", "مواد غذائية", "منظفات", "مشروبات", "تغليف"]}
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="موقع الشركة"
                      name="companyLocation"
                      value={form.companyLocation}
                      onChange={handleChange}
                      required
                      icon={FiMapPin}
                      error={errors.companyLocation}
                    />
                  </div>
                </div>
              </article>

              {/* Official documents */}
              <article className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-bold text-[#193A67]">
                    المستندات الرسمية
                  </h3>
                  <span className="rounded-full bg-[#DDF8E8] px-2.5 py-1 text-[9px] font-bold text-[#16834B]">
                    تم التحقق
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {form.officialDocuments.map((document, index) => (
                    <div key={document.id} className={index === 2 ? "md:col-span-2" : ""}>
                      <DocumentCard document={document} onView={setSelectedDocument} />
                    </div>
                  ))}
                </div>
              </article>

              {/* About company */}
              <article className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-5">
                <h3 className="mb-4 text-[15px] font-bold text-[#193A67]">
                  نبذة عن الشركة
                </h3>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold text-[#303846]">
                    المعلومات الأساسية
                  </span>
                  <textarea
                    name="bio"
                    value={form.bio ?? ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-[#E1E5EA] bg-[#FAFBFC] px-3 py-3 text-[12px] leading-6 text-[#344054] outline-none transition focus:border-[#6EA8DE] focus:bg-white focus:ring-2 focus:ring-[#1D73C9]/10"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-[11px] font-semibold text-[#303846]">
                    المنتجات والخدمات الرئيسية
                  </span>
                  <input
                    type="text"
                    name="services"
                    value={form.services ?? ""}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-[#E1E5EA] bg-[#FAFBFC] px-3 text-[12px] text-[#344054] outline-none transition focus:border-[#6EA8DE] focus:bg-white focus:ring-2 focus:ring-[#1D73C9]/10"
                  />
                </label>
              </article>

              <footer className="flex flex-col gap-3 px-1 pt-4 text-[9px] text-[#9AA0AA] sm:flex-row sm:items-center sm:justify-between">
                <p>© 2026 طلباتي. جميع الحقوق محفوظة</p>
                <div className="flex flex-wrap gap-5">
                  <span>سياسة الخصوصية</span>
                  <span>شروط الخدمة</span>
                  <span>المساعدة والدعم</span>
                </div>
              </footer>
            </div>

            {selectedDocument ? (
              <div
                className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 p-4"
                onMouseDown={() => setSelectedDocument(null)}
                role="presentation"
              >
                <div
                  dir="rtl"
                  className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
                  onMouseDown={(event) => event.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="supplier-document-title"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#2563A9]">
                        <FiFileText size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <h3
                          id="supplier-document-title"
                          className="text-[14px] font-bold text-[#20365A]"
                        >
                          {selectedDocument.name}
                        </h3>
                        <p className="mt-1 text-[10px] text-[#27A35A]">
                          {selectedDocument.status}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDocument(null)}
                      aria-label="إغلاق"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F2F4F7]"
                    >
                      <FiX size={17} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-5 rounded-lg border border-[#E4E7EC] bg-[#FAFBFC] px-4 py-5 text-center">
                    <FiFileText
                      size={28}
                      aria-hidden="true"
                      className="mx-auto text-[#667085]"
                    />
                    <p className="mt-3 text-[11px] font-semibold text-[#344054]">
                      {selectedDocument.fileName}
                    </p>
                    <p className="mt-1 text-[10px] text-[#8A9099]">
                      معاينة محلية للمستند فقط، بدون اتصال بالخادم.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}
