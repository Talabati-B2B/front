import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiCamera,
  FiCheckCircle,
  FiEye,
  FiFileText,
  FiMail,
  FiPhone,
  FiX,
} from "react-icons/fi";
const emptyProfile = {
  storeName: "",
  ownerName: "",
  email: "",
  mobile: "",
  whatsapp: "",
  storeLocation: "",
  bio: "",
  avatarSrc: null,
  officialDocuments: [],
  verificationDocuments: [],
};

function mergeProfile(profile) {
  return {
    ...emptyProfile,
    ...profile,
    officialDocuments:
      profile?.officialDocuments ?? emptyProfile.officialDocuments,
    verificationDocuments:
      profile?.verificationDocuments ?? emptyProfile.verificationDocuments,
  };
}

function ProfileField({
  label,
  name,
  value,
  onChange,
  required = false,
  dir = "rtl",
  type = "text",
  icon: Icon,
  error,
  className = "",
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
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
          className={`h-11 w-full rounded-lg border bg-[#FAFBFC] px-3 text-[12px] text-[#344054] outline-none transition placeholder:text-[#A3A8B1] focus:bg-white focus:ring-2 focus:ring-[#1D73C9]/10 ${
            Icon ? "pr-9" : ""
          } ${
            error
              ? "border-[#E25B5B] focus:border-[#E25B5B]"
              : "border-[#E1E5EA] focus:border-[#6EA8DE]"
          }`}
        />
      </div>

      {error ? (
        <span className="mt-1 block text-[10px] text-[#D14343]">{error}</span>
      ) : null}
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

export default function Profile() {
  const {
    storeProfile,
    saveStoreProfile,
    registerProfileActions,
  } = useOutletContext() ?? {};

  const resolvedProfile = useMemo(
    () => mergeProfile(storeProfile),
    [storeProfile],
  );

  const [form, setForm] = useState(resolvedProfile);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const avatarInputRef = useRef(null);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(resolvedProfile),
    [form, resolvedProfile],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setSaveMessage("");

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const validate = useCallback(() => {
    const nextErrors = {};

    if (!form.firstName?.trim()) {
      nextErrors.firstName = "الاسم الأول مطلوب.";
    }

    if (!form.lastName?.trim()) {
      nextErrors.lastName = "اسم العائلة مطلوب.";
    }

    if (!form.email?.trim()) {
      nextErrors.email = "البريد الإلكتروني مطلوب.";
    }

    if (!form.mobile?.trim()) {
      nextErrors.mobile = "رقم الهاتف مطلوب.";
    }

    if (!form.storeName?.trim()) {
      nextErrors.storeName = "اسم المتجر مطلوب.";
    }

    if (!form.businessType?.trim()) {
      nextErrors.businessType = "نوع النشاط التجاري مطلوب.";
    }

    if (!form.address?.trim()) {
      nextErrors.address = "عنوان المتجر مطلوب.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const handleSave = useCallback(() => {
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
      storeName: form.storeName.trim(),
      businessType: form.businessType.trim(),
      address: form.address.trim(),
      bio: form.bio?.trim() ?? "",
      services: form.services?.trim() ?? "",
    };

    saveStoreProfile?.(nextProfile);
    setForm(nextProfile);
    setSaveMessage("تم حفظ التعديلات محلياً.");
  }, [form, saveStoreProfile, validate]);

  const handleCancel = useCallback(() => {
    setForm(resolvedProfile);
    setErrors({});
    setSaveMessage("");
  }, [resolvedProfile]);

  useEffect(() => {
    registerProfileActions?.({
      onSave: handleSave,
      onCancel: handleCancel,
      hasChanges,
    });

    return () => {
      registerProfileActions?.(null);
    };
  }, [handleCancel, handleSave, hasChanges, registerProfileActions]);

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
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
    <section dir="rtl" className="min-h-full bg-[#F4F5F7] pb-8">
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
        {/* Cover */}
        <div className="h-[150px] bg-[#15447E] sm:h-[170px]" />

        {/* Profile identity */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
          <div className="flex flex-col items-center pb-5 sm:flex-row sm:items-end sm:gap-5">
            {/* Avatar */}
            <div className="relative -mt-[62px] shrink-0 sm:-mt-[66px]">
              <div className="flex h-[124px] w-[124px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#F97316] text-[46px] font-bold text-white shadow-[0_4px_14px_rgba(15,23,42,0.16)] sm:h-[132px] sm:w-[132px]">
                {form.avatarSrc ? (
                  <img
                    src={form.avatarSrc}
                    alt={form.ownerName || form.storeName}
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

            {/* Name / status */}
            <div className="mt-3 min-w-0 flex-1 text-center sm:mb-2 sm:mt-0 sm:text-right">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h2 className="max-w-full truncate text-[20px] font-bold text-[#102F59]">
                  {`${form.firstName ?? ""} ${form.lastName ?? ""}`.trim() ||
                    form.storeName}
                </h2>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#DDF8E8] px-3 py-1.5 text-[10px] font-bold text-[#16834B]">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  {form.status || "فعال"}
                </span>
              </div>

              <p className="mt-1.5 truncate text-[11px] font-medium text-[#667085]">
                {form.storeName}
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

        {/* Personal information */}
        <article className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-5">
          <h3 className="mb-4 text-[15px] font-bold text-[#193A67]">
            المعلومات الشخصية
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProfileField
              label="الاسم الأول"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              error={errors.firstName}
            />

            <ProfileField
              label="اسم العائلة"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              error={errors.lastName}
            />

            <div className="md:col-span-2">
              <ProfileField
                label="المسمى الوظيفي / Position"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
              />
            </div>

            <ProfileField
              label="الدولة"
              name="country"
              value={form.country}
              onChange={handleChange}
            />

            <ProfileField
              label="نوع الحساب"
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
            />
          </div>
        </article>

        {/* Contact */}
        <article className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:p-5">
          <h3 className="mb-4 text-[15px] font-bold text-[#193A67]">
            بيانات التواصل
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProfileField
              label="رقم الهاتف"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              icon={FiPhone}
              error={errors.mobile}
              dir="ltr"
            />

            <ProfileField
              label="رقم الواتساب"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              icon={FiPhone}
              dir="ltr"
            />

            <div className="md:col-span-2">
              <ProfileField
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
            <ProfileField
              label="اسم المتجر"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              required
              error={errors.storeName}
            />

            <ProfileField
              label="نوع النشاط التجاري"
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              required
              error={errors.businessType}
            />

            <div className="md:col-span-2">
              <ProfileField
                label="عنوان المتجر"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                error={errors.address}
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
              {form.officialDocuments?.length ?? 0} مستند
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(form.officialDocuments ?? []).map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={setSelectedDocument}
              />
            ))}
          </div>
        </article>

        {/* About */}
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
              اهتمامات وخدمات استثنائية ومختلفة
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
            aria-labelledby="store-document-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#2563A9]">
                  <FiFileText size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3
                    id="store-document-title"
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
  );
}
