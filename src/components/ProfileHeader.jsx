import { Calendar, Building2, MapPin, Upload } from "lucide-react";

function HeaderMeta({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5 text-body mb-3">
        <Icon className="h-4 w-4" strokeWidth={2} />
        <span className="text-[13px] text-[#00000099] font-semibold ">{label}</span>
      </div>
      <span className="text-[15px] text-[#000000] font-semibold text-heading">{value}</span>
    </div>
  );
}

export default function ProfileHeader({ profile }) {
  return (
    <section className="flex flex-wrap items-center gap-8 rounded-xl border border-line border-[#00000040] bg-white px-8 py-6 shadow-sm">
      <div className="relative shrink-0">
        <div className="flex h-26 w-26 items-center justify-center rounded-full bg-[#063154CC] text-4xl font-bold text-white">
          {profile.initial}
        </div>
        <button
          type="button"
          aria-label="تغيير الصورة الشخصية"
          className="absolute -bottom-1 left-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-white text-body shadow-sm transition-colors hover:text-heading"
        >
          <Upload className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-[20px] font-semibold text-heading leading-8">
              {profile.fullName}
            </h1>
            <span dir="ltr" className="text-[14px]  text-[#00000066] block">
              {profile.email}
            </span>
          </div>
          <span className="rounded-full bg-[#F2762EB2]/30 px-4 py-2 text-xs font-semibold text-accent text-[#F2762E]">
            {profile.statusLabel}
          </span>
        </div>
      </div>

      <div className="mx-auto flex flex-wrap items-center gap-10">
        <HeaderMeta
          icon={Calendar}
          label="تاريخ التقديم"
          value={profile.submissionDate}
        />
        <HeaderMeta
          icon={Building2}
          label="نوع المورد"
          value={profile.supplierType}
        />
        <HeaderMeta icon={MapPin} label="الموقع" value={profile.location} />
      </div>
    </section>
  );
}
