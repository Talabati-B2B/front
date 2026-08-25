import { useState } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiMail,
  FiMoon,
  FiPhone,
  FiSave,
  FiSun,
  FiUser,
} from "react-icons/fi";

const initialProfile = {
  name: "محمد الشامي",
  email: "admin@test.com",
  phone: "0599000000",
};

const initialNotificationPreferences = {
  orders: true,
  users: true,
  system: true,
};

function SettingsCard({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-xl border border-[#E1E5EB] bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-[#EEF0F3] px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FA] text-[#40577B]">
          <Icon size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 text-right">
          <h2 className="text-[16px] font-bold text-[#00163B]">{title}</h2>
          <p className="mt-1 text-[11px] leading-5 text-[#7A7F89]">
            {description}
          </p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  dir,
  autoComplete,
}) {
  return (
    <label className="block text-right">
      <span className="mb-2 block text-[12px] font-semibold text-[#44474F]">
        {label}
      </span>
      <div className="relative">
        {Icon ? (
          <Icon
            size={16}
            aria-hidden="true"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8F98]"
          />
        ) : null}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          autoComplete={autoComplete}
          className={`h-11 w-full rounded-lg border bg-white px-4 text-[13px] text-[#1F2937] outline-none transition placeholder:text-[#A1A5AD] ${
            Icon ? "pr-10" : ""
          } ${
            error
              ? "border-[#E45252] focus:ring-2 focus:ring-[#E45252]/10"
              : "border-[#D9DDE4] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
          }`}
        />
      </div>
      {error ? (
        <span className="mt-1.5 block text-[11px] font-medium text-[#D63B45]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <label className="block text-right">
      <span className="mb-2 block text-[12px] font-semibold text-[#44474F]">
        {label}
      </span>
      <div className="relative">
        <FiLock
          size={16}
          aria-hidden="true"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8F98]"
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`h-11 w-full rounded-lg border bg-white pr-10 pl-11 text-[13px] text-[#1F2937] outline-none transition ${
            error
              ? "border-[#E45252] focus:ring-2 focus:ring-[#E45252]/10"
              : "border-[#D9DDE4] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[#7A7F89] transition hover:bg-[#F2F4F7] hover:text-[#40577B]"
        >
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
      {error ? (
        <span className="mt-1.5 block text-[11px] font-medium text-[#D63B45]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SuccessMessage({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#BFE7CC] bg-[#EEF9F2] px-3.5 py-2.5 text-[12px] font-medium text-[#16813D]">
      <FiCheckCircle size={16} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E7EAF0] bg-[#FAFBFC] px-4 py-3.5">
      <div className="text-right">
        <p className="text-[13px] font-semibold text-[#00163B]">{label}</p>
        <p className="mt-1 text-[11px] text-[#8A8F98]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#40577B]" : "bg-[#C7CBD2]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
            checked ? "right-1" : "right-6"
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [profile, setProfile] = useState(initialProfile);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaved, setProfileSaved] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [visiblePasswordField, setVisiblePasswordField] = useState(null);

  const [appearance, setAppearance] = useState("light");
  const [appearanceSaved, setAppearanceSaved] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState(
    initialNotificationPreferences,
  );

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileSaved(false);
    setProfileErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    const errors = {};
    if (!profile.name.trim()) errors.name = "الاسم مطلوب";
    if (!profile.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^\S+@\S+\.\S+$/.test(profile.email)) {
      errors.email = "أدخل بريدًا إلكترونيًا صحيحًا";
    }
    if (!profile.phone.trim()) errors.phone = "رقم الهاتف مطلوب";

    setProfileErrors(errors);
    setProfileSaved(Object.keys(errors).length === 0);
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }));
    setPasswordChanged(false);
    setPasswordErrors((current) => ({ ...current, [field]: "", confirm: "" }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    const errors = {};
    if (!passwords.current) errors.current = "كلمة المرور الحالية مطلوبة";
    if (!passwords.next) errors.next = "كلمة المرور الجديدة مطلوبة";
    if (!passwords.confirm) {
      errors.confirm = "تأكيد كلمة المرور مطلوب";
    } else if (passwords.next !== passwords.confirm) {
      errors.confirm = "كلمتا المرور غير متطابقتين";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      setPasswordChanged(true);
      setPasswords({ current: "", next: "", confirm: "" });
      setVisiblePasswordField(null);
    }
  };

  const handleAppearanceChange = (value) => {
    setAppearance(value);
    setAppearanceSaved(true);
  };

  const handleNotificationChange = (key, value) => {
    setNotificationPreferences((current) => ({ ...current, [key]: value }));
  };

  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <div className="text-right">
          <h1 className="text-[22px] font-bold text-[#00163B]">الإعدادات</h1>
          <p className="mt-1.5 text-[12px] leading-5 text-[#7A7F89]">
            إدارة بيانات حساب المسؤول وتفضيلات الأمان والإشعارات والمظهر.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
          <SettingsCard
            title="الملف الشخصي"
            description="تحديث معلومات حساب المسؤول المستخدمة داخل لوحة الإدارة."
            icon={FiUser}
          >
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="flex flex-col items-center gap-3 rounded-lg bg-[#F8F9FB] px-4 py-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E7EBF1] text-[22px] font-bold text-[#40577B] ring-1 ring-[#D9DCE2]">
                  {profile.name.trim().charAt(0) || "م"}
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-right">
                  <p className="truncate text-[15px] font-bold text-[#00163B]">
                    {profile.name || "المسؤول"}
                  </p>
                  <p className="mt-1 text-[11px] text-[#8A8F98]">
                    مدير النظام
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    label="الاسم"
                    value={profile.name}
                    onChange={(event) =>
                      handleProfileChange("name", event.target.value)
                    }
                    icon={FiUser}
                    error={profileErrors.name}
                  />
                </div>
                <Field
                  label="البريد الإلكتروني"
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    handleProfileChange("email", event.target.value)
                  }
                  icon={FiMail}
                  dir="ltr"
                  autoComplete="email"
                  error={profileErrors.email}
                />
                <Field
                  label="رقم الهاتف"
                  type="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    handleProfileChange("phone", event.target.value)
                  }
                  icon={FiPhone}
                  dir="ltr"
                  autoComplete="tel"
                  error={profileErrors.phone}
                />
              </div>

              {profileSaved ? (
                <SuccessMessage>تم حفظ بيانات الملف الشخصي محليًا بنجاح.</SuccessMessage>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#062454] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#0A326E]"
                >
                  <FiSave size={15} aria-hidden="true" />
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </SettingsCard>

          <SettingsCard
            title="أمان الحساب"
            description="تغيير كلمة المرور محليًا لأغراض واجهة المستخدم فقط."
            icon={FiLock}
          >
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <PasswordField
                label="كلمة المرور الحالية"
                value={passwords.current}
                onChange={(event) =>
                  handlePasswordChange("current", event.target.value)
                }
                show={visiblePasswordField === "current"}
                onToggle={() =>
                  setVisiblePasswordField((current) =>
                    current === "current" ? null : "current",
                  )
                }
                autoComplete="current-password"
                error={passwordErrors.current}
              />

              <PasswordField
                label="كلمة المرور الجديدة"
                value={passwords.next}
                onChange={(event) =>
                  handlePasswordChange("next", event.target.value)
                }
                show={visiblePasswordField === "next"}
                onToggle={() =>
                  setVisiblePasswordField((current) =>
                    current === "next" ? null : "next",
                  )
                }
                autoComplete="new-password"
                error={passwordErrors.next}
              />

              <PasswordField
                label="تأكيد كلمة المرور الجديدة"
                value={passwords.confirm}
                onChange={(event) =>
                  handlePasswordChange("confirm", event.target.value)
                }
                show={visiblePasswordField === "confirm"}
                onToggle={() =>
                  setVisiblePasswordField((current) =>
                    current === "confirm" ? null : "confirm",
                  )
                }
                autoComplete="new-password"
                error={passwordErrors.confirm}
              />

              <p className="text-[10px] leading-5 text-[#92969E]">
                لا يتم حفظ كلمة المرور المدخلة أو إرسالها إلى أي خادم في هذه النسخة.
              </p>

              {passwordChanged ? (
                <SuccessMessage>
                  تم تنفيذ تغيير كلمة المرور محليًا بنجاح.
                </SuccessMessage>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#062454] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#0A326E]"
                >
                  <FiLock size={15} aria-hidden="true" />
                  تغيير كلمة المرور
                </button>
              </div>
            </form>
          </SettingsCard>

          <SettingsCard
            title="المظهر"
            description="اختيار تفضيل مظهر واجهة الإدارة على هذا الجهاز."
            icon={FiSun}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleAppearanceChange("light")}
                aria-pressed={appearance === "light"}
                className={`flex items-center gap-3 rounded-lg border px-4 py-4 text-right transition ${
                  appearance === "light"
                    ? "border-[#40577B] bg-[#EEF3FA] ring-1 ring-[#40577B]/10"
                    : "border-[#E1E5EB] bg-white hover:bg-[#F8F9FB]"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#F2A332] shadow-sm ring-1 ring-[#E1E5EB]">
                  <FiSun size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[#00163B]">
                    الوضع الفاتح
                  </p>
                  <p className="mt-1 text-[10px] text-[#8A8F98]">
                    المظهر الحالي للتطبيق
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAppearanceChange("dark")}
                aria-pressed={appearance === "dark"}
                className={`flex items-center gap-3 rounded-lg border px-4 py-4 text-right transition ${
                  appearance === "dark"
                    ? "border-[#40577B] bg-[#EEF3FA] ring-1 ring-[#40577B]/10"
                    : "border-[#E1E5EB] bg-white hover:bg-[#F8F9FB]"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#062454] text-white shadow-sm">
                  <FiMoon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[#00163B]">
                    الوضع الداكن
                  </p>
                  <p className="mt-1 text-[10px] text-[#8A8F98]">
                    حفظ التفضيل محليًا فقط
                  </p>
                </div>
              </button>
            </div>

            {appearanceSaved ? (
              <div className="mt-4">
                <SuccessMessage>
                  تم اختيار {appearance === "light" ? "الوضع الفاتح" : "الوضع الداكن"} محليًا.
                </SuccessMessage>
              </div>
            ) : null}
          </SettingsCard>

          <SettingsCard
            title="تفضيلات الإشعارات"
            description="تحديد أنواع إشعارات الإدارة التي ترغب في متابعتها."
            icon={FiBell}
          >
            <div className="space-y-3">
              <Toggle
                checked={notificationPreferences.orders}
                onChange={(value) => handleNotificationChange("orders", value)}
                label="إشعارات الطلبات"
                description="التحديثات والتنبيهات المتعلقة بحالة الطلبات."
              />
              <Toggle
                checked={notificationPreferences.users}
                onChange={(value) => handleNotificationChange("users", value)}
                label="إشعارات المستخدمين"
                description="طلبات التسجيل والتحديثات المتعلقة بالحسابات."
              />
              <Toggle
                checked={notificationPreferences.system}
                onChange={(value) => handleNotificationChange("system", value)}
                label="إشعارات النظام"
                description="التنبيهات والتحديثات العامة الخاصة بالنظام."
              />
            </div>
          </SettingsCard>
        </div>

        <SettingsCard
          title="اللغة"
          description="لغة واجهة الإدارة الحالية."
          icon={FiGlobe}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-right">
              <p className="text-[13px] font-semibold text-[#00163B]">
                العربية
              </p>
              <p className="mt-1 text-[11px] text-[#8A8F98]">
                لا يوجد نظام تعدد لغات مفعّل حاليًا، لذلك تبقى العربية اللغة الحالية.
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-[#EEF3FA] px-3 py-1.5 text-[11px] font-semibold text-[#40577B]">
              اللغة الحالية
            </span>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
