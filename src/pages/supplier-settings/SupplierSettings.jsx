import { useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  Warehouse,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const initialProfile = {
  name: "مستودع الأمانة",
  email: "supplier@talabati.ps",
  phone: "0599123456",
  avatar: "",
};

const initialWarehouse = {
  locationName: "غزة - الرمال",
  latitude: "31.5017",
  longitude: "34.4668",
};

const initialNotifications = {
  orders: true,
  inventory: true,
  system: true,
};

function Feedback({ type, message }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-[13px] font-medium ${
        isSuccess
          ? "border-[#B7E3C7] bg-[#ECF9F1] text-[#16834B]"
          : "border-[#F0BABA] bg-[#FDECEC] text-[#C62828]"
      }`}
      role="status"
    >
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
      )}
      <span>{message}</span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FA] text-[#062454]">
        <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <h2 className="text-[17px] font-bold text-[#00163B]">{title}</h2>
        {description ? (
          <p className="mt-1 text-[12px] leading-5 text-[#64748B]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-[#344054]">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[11px] font-medium text-[#C62828]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E2E6EC] bg-[#FAFBFC] px-4 py-3.5">
      <div>
        <p className="text-[13px] font-semibold text-[#1F2937]">{label}</p>
        <p className="mt-1 text-[11px] leading-5 text-[#64748B]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#062454]" : "bg-[#C8CED8]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
            checked ? "left-1" : "left-6"
          }`}
        />
      </button>
    </div>
  );
}

export default function SupplierSettings() {
  const avatarInputRef = useRef(null);

  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileFeedback, setProfileFeedback] = useState(null);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  const [warehouse, setWarehouse] = useState(initialWarehouse);
  const [savedWarehouse, setSavedWarehouse] = useState(initialWarehouse);
  const [warehouseErrors, setWarehouseErrors] = useState({});
  const [warehouseFeedback, setWarehouseFeedback] = useState(null);

  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationFeedback, setNotificationFeedback] = useState(null);

  const validateProfile = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s]{8,15}$/;

    if (!profile.name.trim()) errors.name = "اسم المورد مطلوب.";
    if (!profile.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب.";
    } else if (!emailPattern.test(profile.email.trim())) {
      errors.email = "يرجى إدخال بريد إلكتروني صحيح.";
    }

    if (!profile.phone.trim()) {
      errors.phone = "رقم الهاتف مطلوب.";
    } else if (!phonePattern.test(profile.phone.trim())) {
      errors.phone = "يرجى إدخال رقم هاتف صحيح.";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = (event) => {
    event.preventDefault();
    setProfileFeedback(null);

    if (!validateProfile()) return;

    const nextProfile = {
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
    };

    setProfile(nextProfile);
    setSavedProfile(nextProfile);
    setProfileFeedback({
      type: "success",
      message: "تم حفظ بيانات الحساب بنجاح.",
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileFeedback({
        type: "error",
        message: "يرجى اختيار ملف صورة صالح.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileFeedback({
        type: "error",
        message: "حجم الصورة يجب ألا يتجاوز 5MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({
        ...current,
        avatar: typeof reader.result === "string" ? reader.result : "",
      }));
      setProfileFeedback(null);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordFeedback(null);

    const errors = {};

    if (!passwords.current) errors.current = "كلمة المرور الحالية مطلوبة.";
    if (!passwords.next) {
      errors.next = "كلمة المرور الجديدة مطلوبة.";
    } else if (passwords.next.length < 8) {
      errors.next = "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.";
    }

    if (!passwords.confirm) {
      errors.confirm = "تأكيد كلمة المرور مطلوب.";
    } else if (passwords.next !== passwords.confirm) {
      errors.confirm = "كلمتا المرور غير متطابقتين.";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setPasswords({ current: "", next: "", confirm: "" });
    setPasswordFeedback({
      type: "success",
      message: "تم التحقق من نموذج تغيير كلمة المرور محليًا بنجاح.",
    });
  };

  const validateWarehouse = () => {
    const errors = {};
    const latitude = Number(warehouse.latitude);
    const longitude = Number(warehouse.longitude);

    if (!warehouse.locationName.trim()) {
      errors.locationName = "اسم أو وصف موقع المستودع مطلوب.";
    }

    if (warehouse.latitude === "" || Number.isNaN(latitude)) {
      errors.latitude = "خط العرض مطلوب ويجب أن يكون رقمًا.";
    } else if (latitude < -90 || latitude > 90) {
      errors.latitude = "خط العرض يجب أن يكون بين -90 و 90.";
    }

    if (warehouse.longitude === "" || Number.isNaN(longitude)) {
      errors.longitude = "خط الطول مطلوب ويجب أن يكون رقمًا.";
    } else if (longitude < -180 || longitude > 180) {
      errors.longitude = "خط الطول يجب أن يكون بين -180 و 180.";
    }

    setWarehouseErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWarehouseSave = (event) => {
    event.preventDefault();
    setWarehouseFeedback(null);

    if (!validateWarehouse()) return;

    const nextWarehouse = {
      locationName: warehouse.locationName.trim(),
      latitude: warehouse.latitude.trim(),
      longitude: warehouse.longitude.trim(),
    };

    setWarehouse(nextWarehouse);
    setSavedWarehouse(nextWarehouse);
    setWarehouseFeedback({
      type: "success",
      message: "تم حفظ موقع المستودع محليًا بنجاح.",
    });
  };

  const handleNotificationChange = (key, value) => {
    setNotifications((current) => ({ ...current, [key]: value }));
    setNotificationFeedback({
      type: "success",
      message: "تم تحديث تفضيلات الإشعارات لهذه الجلسة.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6F8]" dir="rtl">
      <Sidebar supplierName={savedProfile.name} avatarSrc={savedProfile.avatar} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-6 lg:px-7">
            <div className="mb-6">
              <h1 className="text-[27px] font-bold text-[#00163B]">الإعدادات</h1>
              <p className="mt-1.5 text-[13px] leading-6 text-[#64748B]">
                إدارة بيانات حساب المورد، الأمان، موقع المستودع وتفضيلات الإشعارات.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <section className="rounded-xl border border-[#E1E5EA] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
                <SectionHeader
                  icon={UserRound}
                  title="الحساب والملف الشخصي"
                  description="حدّث بيانات المورد الأساسية وصورة الحساب."
                />

                <Feedback {...(profileFeedback ?? {})} />

                <form onSubmit={handleProfileSave} noValidate>
                  <div className="mb-5 flex flex-col items-center gap-3 rounded-xl bg-[#F8F9FB] p-4 sm:flex-row sm:items-center">
                    <div className="relative">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="صورة المورد"
                          className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8EEF7] text-[#062454]">
                          <UserRound className="h-8 w-8" strokeWidth={1.7} />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        aria-label="تغيير صورة الحساب"
                        className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#F47721] text-white shadow-md transition-colors hover:bg-[#E96F17]"
                      >
                        <Camera className="h-4 w-4" strokeWidth={2} />
                      </button>

                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>

                    <div className="text-center sm:text-right">
                      <p className="text-[14px] font-bold text-[#1F2937]">
                        صورة الملف الشخصي
                      </p>
                      <p className="mt-1 text-[11px] text-[#64748B]">
                        JPG أو PNG بحد أقصى 5MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="اسم المورد" error={profileErrors.name}>
                      <div className="relative">
                        <UserRound className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A1]" />
                        <input
                          value={profile.name}
                          onChange={(event) =>
                            setProfile((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-lg border border-[#C9CFD8] bg-white pr-10 pl-3 text-[13px] text-[#344054] outline-none focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                        />
                      </div>
                    </Field>

                    <Field label="البريد الإلكتروني" error={profileErrors.email}>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A1]" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(event) =>
                            setProfile((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          dir="ltr"
                          className="h-11 w-full rounded-lg border border-[#C9CFD8] bg-white pr-10 pl-3 text-left text-[13px] text-[#344054] outline-none focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                        />
                      </div>
                    </Field>

                    <Field label="رقم الهاتف" error={profileErrors.phone}>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A1]" />
                        <input
                          value={profile.phone}
                          onChange={(event) =>
                            setProfile((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                          dir="ltr"
                          className="h-11 w-full rounded-lg border border-[#C9CFD8] bg-white pr-10 pl-3 text-left text-[13px] text-[#344054] outline-none focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                        />
                      </div>
                    </Field>

                    <div className="rounded-lg border border-[#E2E6EC] bg-[#F8F9FB] px-4 py-3">
                      <p className="text-[11px] text-[#64748B]">اللغة</p>
                      <p className="mt-1 text-[13px] font-semibold text-[#1F2937]">
                        العربية
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#062454] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0A316D]"
                    >
                      <Save className="h-4 w-4" strokeWidth={2} />
                      حفظ بيانات الحساب
                    </button>
                  </div>
                </form>
              </section>

              <section className="rounded-xl border border-[#E1E5EA] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
                <SectionHeader
                  icon={ShieldCheck}
                  title="الأمان وكلمة المرور"
                  description="غيّر كلمة المرور محليًا لأغراض واجهة النموذج فقط."
                />

                <Feedback {...(passwordFeedback ?? {})} />

                <form onSubmit={handlePasswordSubmit} noValidate>
                  <div className="space-y-4">
                    {[
                      { key: "current", label: "كلمة المرور الحالية" },
                      { key: "next", label: "كلمة المرور الجديدة" },
                      { key: "confirm", label: "تأكيد كلمة المرور الجديدة" },
                    ].map(({ key, label }) => (
                      <Field key={key} label={label} error={passwordErrors[key]}>
                        <div className="relative">
                          <LockKeyhole className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A1]" />
                          <input
                            type={passwordVisibility[key] ? "text" : "password"}
                            value={passwords[key]}
                            onChange={(event) => {
                              setPasswords((current) => ({
                                ...current,
                                [key]: event.target.value,
                              }));
                              setPasswordErrors((current) => ({
                                ...current,
                                [key]: "",
                              }));
                            }}
                            autoComplete="off"
                            className="h-11 w-full rounded-lg border border-[#C9CFD8] bg-white pr-10 pl-10 text-[13px] text-[#344054] outline-none focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPasswordVisibility((current) => ({
                                ...current,
                                [key]: !current[key],
                              }))
                            }
                            aria-label={
                              passwordVisibility[key]
                                ? "إخفاء كلمة المرور"
                                : "إظهار كلمة المرور"
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#062454]"
                          >
                            {passwordVisibility[key] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#062454] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0A316D]"
                    >
                      <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                      تحديث كلمة المرور
                    </button>
                  </div>
                </form>
              </section>

              <section className="rounded-xl border border-[#E1E5EA] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
                <SectionHeader
                  icon={Warehouse}
                  title="موقع المستودع"
                  description="حدّث موقع مستودع المورد الذي يُستخدم ضمن العمليات اللوجستية."
                />

                <Feedback {...(warehouseFeedback ?? {})} />

                <div className="mb-5 flex items-start gap-3 rounded-lg border border-[#DCE4EF] bg-[#F4F7FB] px-4 py-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#062454]" />
                  <div>
                    <p className="text-[11px] font-medium text-[#64748B]">
                      الموقع المحفوظ حاليًا
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-[#1F2937]">
                      {savedWarehouse.locationName}
                    </p>
                    <p className="mt-1 text-[11px] text-[#64748B]" dir="ltr">
                      {savedWarehouse.latitude}, {savedWarehouse.longitude}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleWarehouseSave} noValidate>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="وصف موقع المستودع"
                        error={warehouseErrors.locationName}
                      >
                        <input
                          value={warehouse.locationName}
                          onChange={(event) =>
                            setWarehouse((current) => ({
                              ...current,
                              locationName: event.target.value,
                            }))
                          }
                          placeholder="مثال: غزة - الرمال"
                          className="h-11 w-full rounded-lg border border-[#C9CFD8] bg-white px-3 text-[13px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                        />
                      </Field>
                    </div>

                    <Field label="خط العرض" error={warehouseErrors.latitude}>
                      <input
                        value={warehouse.latitude}
                        onChange={(event) =>
                          setWarehouse((current) => ({
                            ...current,
                            latitude: event.target.value,
                          }))
                        }
                        inputMode="decimal"
                        dir="ltr"
                        className="h-11 w-full rounded-lg border border-[#C9CFD8] bg-white px-3 text-left text-[13px] text-[#344054] outline-none focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                      />
                    </Field>

                    <Field label="خط الطول" error={warehouseErrors.longitude}>
                      <input
                        value={warehouse.longitude}
                        onChange={(event) =>
                          setWarehouse((current) => ({
                            ...current,
                            longitude: event.target.value,
                          }))
                        }
                        inputMode="decimal"
                        dir="ltr"
                        className="h-11 w-full rounded-lg border border-[#C9CFD8] bg-white px-3 text-left text-[13px] text-[#344054] outline-none focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                      />
                    </Field>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#062454] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0A316D]"
                    >
                      <MapPin className="h-4 w-4" strokeWidth={2} />
                      حفظ موقع المستودع
                    </button>
                  </div>
                </form>
              </section>

              <section className="rounded-xl border border-[#E1E5EA] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
                <SectionHeader
                  icon={Bell}
                  title="تفضيلات الإشعارات"
                  description="تحكم في أنواع التنبيهات التي تريد متابعتها خلال هذه الجلسة."
                />

                <Feedback {...(notificationFeedback ?? {})} />

                <div className="space-y-3">
                  <Toggle
                    checked={notifications.orders}
                    onChange={(value) => handleNotificationChange("orders", value)}
                    label="إشعارات الطلبات"
                    description="تنبيهات الطلبات الجديدة وتغيّر حالة الطلب."
                  />

                  <Toggle
                    checked={notifications.inventory}
                    onChange={(value) =>
                      handleNotificationChange("inventory", value)
                    }
                    label="إشعارات المخزون"
                    description="تنبيهات انخفاض أو نفاد مخزون المنتجات."
                  />

                  <Toggle
                    checked={notifications.system}
                    onChange={(value) => handleNotificationChange("system", value)}
                    label="إشعارات النظام"
                    description="التنبيهات والتحديثات التشغيلية العامة للمنصة."
                  />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
