import { useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Archive,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  IdCard,
  LayoutDashboard,
  MapPin,
  Phone,
  Settings,
  Store,
  Truck,
  Upload,
} from "lucide-react";
import logo from "../../assets/images/dachboard_Logo.svg";
import {
  getMockStoreAccountStatus,
  savePendingContactMock,
  savePendingNotesMock,
  storePendingProfile,
} from "../../services/store/storePending.mock";

const MAX_NOTES_LENGTH = 500;
const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;

const pendingMenu = [
  { label: "لوحة التحكم", icon: LayoutDashboard },
  { label: "الطلبات", icon: Truck },
  { label: "المنتجات و المخزون", icon: Archive },
  { label: "التقارير", icon: BarChart3 },
  { label: "الإعدادات", icon: Settings },
];

function PendingSidebar() {
  return (
    <aside
      aria-label="قائمة الحساب قيد المراجعة"
      className="hidden h-screen w-72 shrink-0 flex-col bg-[#082D63] px-7 pb-8 pt-8 text-white lg:flex"
    >
      <div className="flex justify-center">
        <img
          src={logo}
          alt="طلباتي"
          className="h-auto w-[128px] object-contain"
        />
      </div>

      <nav
        className="mt-12"
        aria-label="قائمة غير متاحة حتى اعتماد الحساب"
      >
        <ul className="space-y-6">
          {pendingMenu.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-3.5 text-[15px] font-medium text-white/90"
              aria-disabled="true"
              title="سيصبح هذا القسم متاحاً بعد اعتماد الحساب"
            >
              <Icon
                className="h-5 w-5 shrink-0 text-white"
                strokeWidth={2}
              />

              <span>{label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function MobilePendingHeader() {
  return (
    <div className="flex items-center justify-between bg-[#082D63] px-4 py-3 text-white lg:hidden">
      <img
        src={logo}
        alt="طلباتي"
        className="h-auto w-24 object-contain"
      />

      <span className="rounded-full border border-[#FF7A2F] bg-white/5 px-3 py-1.5 text-[11px] font-bold text-[#FF9A63]">
        قيد المراجعة
      </span>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 text-center sm:text-right">
      <div className="flex items-center justify-center gap-2 text-[12px] text-[#777F8A] sm:justify-start">
        <Icon
          className="h-4 w-4 shrink-0"
          strokeWidth={1.8}
        />

        <span>{label}</span>
      </div>

      <p className="mt-2 truncate text-[14px] font-semibold text-[#202A36]">
        {value}
      </p>
    </div>
  );
}

function StoreInfoCard({ profile }) {
  const rows = [
    {
      label: "تاريخ التقديم",
      value: profile.submissionDate,
      icon: CalendarDays,
    },
    {
      label: "نوع المتجر",
      value: profile.storeType,
      icon: Store,
    },
    {
      label: "الموقع",
      value: profile.location,
      icon: MapPin,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#DADDE3] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-center gap-2.5 border-b border-[#E4E6EA] pb-4">
        <Store
          className="h-6 w-6 text-[#FF7425]"
          strokeWidth={2.2}
        />

        <h2 className="text-[18px] font-bold text-[#171C24]">
          معلومات المتجر
        </h2>
      </div>

      <div>
        {rows.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="grid min-h-[58px] grid-cols-[1fr_auto] items-center gap-4 border-b border-[#ECEEF1] py-4 last:border-b-0"
          >
            <span className="text-[14px] font-semibold text-[#252A31]">
              {value}
            </span>

            <div className="flex items-center gap-2 text-[#8A9099]">
              <span className="text-[12px]">{label}</span>

              <Icon
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactCard({ initialPhone, initialWhatsapp }) {
  const [phone, setPhone] = useState(initialPhone);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    const normalizedPhone = phone.trim();
    const normalizedWhatsapp = whatsapp.trim();

    if (
      !normalizedPhone ||
      !PHONE_PATTERN.test(normalizedPhone)
    ) {
      nextErrors.phone = true;
    }

    if (
      !normalizedWhatsapp ||
      !PHONE_PATTERN.test(normalizedWhatsapp)
    ) {
      nextErrors.whatsapp = true;
    }

    setErrors(nextErrors);
    setSaved(false);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    savePendingContactMock({
      phone: normalizedPhone,
      whatsapp: normalizedWhatsapp,
    });

    setSaved(true);
  };

  return (
    <section className="rounded-2xl border border-[#FF5E57] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <h2 className="mb-5 text-center text-[18px] font-bold text-[#171C24]">
        معلومات الاتصال
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* PHONE */}
        <label className="block">
          <span className="mb-2 block text-[13px] font-bold text-[#252A31]">
            رقم الهاتف{" "}
            <span className="text-[#F05A42]">*</span>
          </span>

          <div
            className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
              errors.phone
                ? "border-[#E5484D]"
                : "border-[#CED2D8]"
            }`}
          >
            <Phone
              className="h-[18px] w-[18px] shrink-0 text-[#858C95]"
              strokeWidth={1.8}
            />

            <input
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);

                setErrors((current) => ({
                  ...current,
                  phone: false,
                }));

                setSaved(false);
              }}
              placeholder="0590000000"
              aria-label="رقم الهاتف"
              className="min-w-0 flex-1 bg-transparent text-left text-[14px] text-[#4E5661] outline-none placeholder:text-[#A5ABB2]"
            />
          </div>

          {errors.phone ? (
            <p className="mt-1.5 text-[11px] font-medium text-[#E5484D]">
              يرجى إدخال رقم هاتف صحيح.
            </p>
          ) : null}
        </label>

        {/* WHATSAPP */}
        <label className="block">
          <span className="mb-2 block text-[13px] font-bold text-[#252A31]">
            رقم الواتساب{" "}
            <span className="text-[#F05A42]">*</span>
          </span>

          <div
            className={`flex h-12 overflow-hidden rounded-xl border bg-white ${
              errors.whatsapp
                ? "border-[#E5484D]"
                : "border-[#CED2D8]"
            }`}
            dir="ltr"
          >
            <span className="flex items-center border-r border-[#D6D9DE] px-4 text-[14px] font-semibold text-[#222831]">
              +970
            </span>

            <input
              type="tel"
              value={whatsapp}
              onChange={(event) => {
                setWhatsapp(event.target.value);

                setErrors((current) => ({
                  ...current,
                  whatsapp: false,
                }));

                setSaved(false);
              }}
              placeholder="590000000"
              aria-label="رقم الواتساب"
              className="min-w-0 flex-1 bg-transparent px-4 text-right text-[14px] text-[#4E5661] outline-none placeholder:text-[#A5ABB2]"
            />
          </div>

          {errors.whatsapp ? (
            <p className="mt-1.5 text-[11px] font-medium text-[#E5484D]">
              يرجى إدخال رقم واتساب صحيح.
            </p>
          ) : null}
        </label>

        <p
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {saved
            ? "تم حفظ معلومات الاتصال محلياً"
            : ""}
        </p>

        {saved ? (
          <p className="text-center text-[12px] font-semibold text-[#26A95B]">
            تم حفظ معلومات الاتصال بنجاح.
          </p>
        ) : null}

        <div className="pt-2 text-center">
          <button
            type="submit"
            className="min-h-11 min-w-[135px] rounded-lg bg-[#FF7024] px-8 text-[14px] font-bold text-white transition-colors hover:bg-[#EA641B]"
          >
            حفظ
          </button>
        </div>
      </form>
    </section>
  );
}

function DocumentRow({
  document,
  onUpload,
  onView,
}) {
  const inputRef = useRef(null);

  const isUploaded = Boolean(document.uploaded);

  return (
    <div
      className={`flex min-h-[72px] items-center gap-3 rounded-xl border px-4 py-3 ${
        isUploaded
          ? "border-[#CED2D8]"
          : "border-[#FF625B]"
      }`}
    >
      {/* INFO */}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-[#242A33]">
          {document.title}
        </p>

        {document.fileName ? (
          <p
            dir="ltr"
            className="mt-1 truncate text-left text-[10px] text-[#7C838C]"
          >
            {document.fileName}
          </p>
        ) : null}
      </div>

      {/* STATUS */}
      <span
        className={`shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-bold ${
          isUploaded
            ? "bg-[#E1F8E8] text-[#2A9A55]"
            : "bg-[#E6E6E6] text-[#777D85]"
        }`}
      >
        {isUploaded ? "تم التحقق" : "غير مرفوع"}
      </span>

      {/* VIEW / UPLOAD */}
      {isUploaded ? (
        <button
          type="button"
          onClick={() => onView(document)}
          aria-label={`عرض ${document.title}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D4D8DE] text-[#84909D] transition-colors hover:bg-[#F5F7F9] hover:text-[#344054]"
        >
          <Eye
            className="h-4 w-4"
            strokeWidth={1.7}
          />
        </button>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onUpload(document.id, file);
              }

              event.target.value = "";
            }}
            aria-label={`رفع ${document.title}`}
          />

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            aria-label={`رفع ${document.title}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D4D8DE] text-[#84909D] transition-colors hover:bg-[#F5F7F9] hover:text-[#344054]"
          >
            <Upload
              className="h-4 w-4"
              strokeWidth={1.7}
            />
          </button>
        </>
      )}

      {/* FINAL ICON */}
      {isUploaded ? (
        <CheckCircle2
          className="h-6 w-6 shrink-0 text-[#26A95B]"
          strokeWidth={1.9}
        />
      ) : (
        <IdCard
          className="h-6 w-6 shrink-0 text-[#E03030]"
          strokeWidth={1.9}
        />
      )}
    </div>
  );
}

function DocumentsCard({ initialDocuments }) {
  const [documents, setDocuments] =
    useState(initialDocuments);

  const handleUpload = (documentId, file) => {
    setDocuments((current) =>
      current.map((document) =>
        document.id === documentId
          ? {
              ...document,
              uploaded: true,
              verified: false,
              fileName: file.name,
            }
          : document,
      ),
    );
  };

  const handleView = (document) => {
    window.alert(
      `معاينة محلية: ${
        document.fileName || document.title
      }`,
    );
  };

  return (
    <section className="rounded-2xl border border-[#DADDE3] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-center justify-center gap-2.5 border-b border-[#E4E6EA] pb-4">
        <FileText
          className="h-6 w-6 text-[#FF7425]"
          strokeWidth={2}
        />

        <h2 className="text-[18px] font-bold text-[#171C24]">
          المستندات المرفوعة
        </h2>
      </div>

      <div className="space-y-3.5">
        {documents.map((document) => (
          <DocumentRow
            key={document.id}
            document={document}
            onUpload={handleUpload}
            onView={handleView}
          />
        ))}
      </div>
    </section>
  );
}

function NotesCard() {
  const [notes, setNotes] = useState(() => {
    try {
      return (
        window.localStorage.getItem(
          "talabaty-store-pending-notes",
        ) || ""
      );
    } catch {
      return "";
    }
  });

  const remainingLabel = useMemo(
    () => `${notes.length}/${MAX_NOTES_LENGTH}`,
    [notes],
  );

  return (
    <section className="rounded-2xl border border-[#DADDE3] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <h2 className="mb-4 text-[17px] font-bold text-[#171C24]">
        ملاحظات (اختياري)
      </h2>

      <div className="relative">
        <textarea
          value={notes}
          onChange={(event) => {
            const value =
              event.target.value.slice(
                0,
                MAX_NOTES_LENGTH,
              );

            setNotes(value);
            savePendingNotesMock(value);
          }}
          placeholder="اكتب ملاحظاتك هنا..."
          rows={7}
          className="min-h-[180px] w-full resize-none rounded-xl border border-[#CED2D8] bg-white p-4 pb-9 text-[14px] leading-7 text-[#434B55] outline-none transition placeholder:text-[#A2A8B0] focus:border-[#8AA4C2]"
        />

        <span className="pointer-events-none absolute bottom-3 left-4 text-[10px] text-[#A1A6AD]">
          {remainingLabel}
        </span>
      </div>
    </section>
  );
}

export default function StorePending() {
  const [accountStatus] = useState(() =>
    getMockStoreAccountStatus(),
  );

  const [avatarSrc, setAvatarSrc] =
    useState("");

  const avatarInputRef = useRef(null);

  const profile = storePendingProfile;

  if (accountStatus === "approved") {
    return <Navigate to="/store" replace />;
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () =>
      setAvatarSrc(
        String(reader.result ?? ""),
      );

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen overflow-hidden bg-[#F5F6F8]"
    >
      <PendingSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobilePendingHeader />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#F5F6F8] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            {/* TOP PROFILE CARD */}
            <section className="rounded-2xl border border-[#D7DAE0] bg-white px-6 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.05)] sm:px-7">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                aria-label="تغيير الصورة الشخصية"
              />

              <div className="grid items-center gap-7 lg:grid-cols-[auto_minmax(220px,0.85fr)_minmax(0,1.7fr)]">
                {/* AVATAR */}
                <div className="relative mx-auto shrink-0 lg:mx-0">
                  <div className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full bg-[#476C8F] text-[40px] font-bold text-white">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={profile.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{profile.initial}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      avatarInputRef.current?.click()
                    }
                    aria-label="تغيير الصورة الشخصية"
                    className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-[#51606E] shadow-md transition-colors hover:bg-[#F2F4F6]"
                  >
                    <Upload
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </button>
                </div>

                {/* NAME */}
                <div className="min-w-0 text-center lg:text-right">
                  <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <h1 className="truncate text-[22px] font-bold text-[#1F252D]">
                      {profile.fullName}
                    </h1>

                    <span className="rounded-lg border border-[#FF9A6A] bg-[#FFF7F2] px-3.5 py-1.5 text-[11px] font-bold text-[#F27B42]">
                      {profile.statusLabel}
                    </span>
                  </div>

                  <p
                    dir="ltr"
                    className="mt-2 truncate text-[12px] text-[#9AA0A8] lg:text-right"
                  >
                    {profile.email}
                  </p>
                </div>

                {/* META */}
                <div className="grid grid-cols-1 gap-5 border-t border-[#EFF0F2] pt-5 sm:grid-cols-3 lg:border-t-0 lg:pt-0">
                  <MetaItem
                    icon={CalendarDays}
                    label="تاريخ التقديم"
                    value={profile.submissionDate}
                  />

                  <MetaItem
                    icon={Building2}
                    label="نوع المتجر"
                    value={profile.storeType}
                  />

                  <MetaItem
                    icon={MapPin}
                    label="الموقع"
                    value={profile.location}
                  />
                </div>
              </div>
            </section>

            {/* MAIN CARDS */}
            <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <DocumentsCard
                  initialDocuments={
                    profile.documents
                  }
                />

                <NotesCard />
              </div>

              {/* LEFT COLUMN */}
              <div className="space-y-6">
                <StoreInfoCard
                  profile={profile}
                />

                <ContactCard
                  initialPhone={
                    profile.phone
                  }
                  initialWhatsapp={
                    profile.whatsapp
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}