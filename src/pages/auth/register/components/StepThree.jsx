import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Select, DropzoneUpload } from "../../../../components/common";
import { FiMapPin } from "react-icons/fi";
import NavigationBtns from "./NavigationBtns";
import { useEffect } from "react";

// Tab switcher component
function TabSwitcher({ activeTab, onChange }) {
  const tabs = [
    { id: "info", label: " معلومات النشاط " },
    { id: "docs", label: "الوثائق" },
  ];
  return (
    <div
      className="flex rounded-xl overflow-hidden border border-gray-100 mb-4"
      dir="rtl"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-2.5 text-sm font-medium transition
            ${
              activeTab === tab.id
                ? "bg-[#1a3a5c] text-white"
                : "bg-white text-gray-400 hover:bg-gray-50"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Doc type selector component
function DocTypeSelector({ selected, onChange }) {
  const types = [
    { id: "commercial", label: " سجل تجاري ", desc: " السجل التجاري للنشاط " },
    { id: "ownership", label: " إثبات ملكية ", desc: " عقد وكالة أو تفويض " },
  ];

  return (
    <div className="flex flex-col gap-2 mb-4" dir="rtl">
      <p className="text-sm text-gray-500 font-medium mt-3">
        الوثائق المطلوبة{" "}
        <span className="text-gray-400 font-normal">
          ( ارفع وثيقة واحدة على الأقل )
        </span>
      </p>
      <div className="grid grid-cols-2 gap-3">
        {types.map((type) => {
          const isSelected = selected === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={`
              relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-right transition
              ${
                isSelected
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }
            `}
            >
              {/* Radio dot */}
              <div
                className={`absolute right-3 bottom-3 w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${isSelected ? "border-orange-400" : "border-gray-300"}`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                )}
              </div>

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-1
              ${isSelected ? "bg-orange-100" : "bg-gray-100"}`}
              >
                📄
              </div>
              <p className="text-sm font-bold text-gray-700">{type.label}</p>
              <p className="text-xs text-gray-400">{type.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// shared business form
const CONFIG = {
  store: {
    namePlaceholder: " سوبرماركت الأمل ",
    nameLabel: " اسم المتجر ",
    typeLabel: " نوع المتجر ",
    typeOptions: [1, 2, 3, " متجر تجزئة ", " أخرى"],
    locationLabel: " موقع المتجر ",
    submitLabel: " إنشاء الحساب ",
  },
  supplier: {
    namePlaceholder: " شركة النور للتجارة ",
    nameLabel: " اسم الشركة ",
    typeLabel: " نوع النشاط التجاري ",
    typeOptions: [
      1,
      2,
      3,
      " متنوع ",
      " مواد بناء ",
      " إلكترونيات ",
    ],
    locationLabel: " موقع الشركة ",
    submitLabel: " إرسال طلب التسجيل ",
  },
};

// business form
function BusinessForm({ role, onBack, onSubmit, isLoading, data, setData }) {
  const config = CONFIG[role];
  const [tab, setTab] = useState(data.tab);
  const [docType, setDocType] = useState(data.docType);
  const [docFile, setDocFile] = useState(data.docFile);
  const [docError, setDocError] = useState("");

  const {
    register,
    trigger,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      businessName: data.businessName,
      businessType: data.businessType,
      location: data.location,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      setData({
        ...values,
        tab,
        docType,
        docFile,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, tab, docType, docFile, setData]);

  // Tab: info to docs
  const handleNext = async () => {
    const valid = await trigger(["businessName", "businessType", "location"]);
    if (valid) setTab("docs");
  };
  // final submit
  const onFormSubmit = (data) => {
    alert("FORM SUBMIT FIRED");
    console.log("DATA:", data);

    if (!docFile) {
      setDocError(" يُرجى رفع وثيقة واحدة على الأقل ");
      return;
    }
    onSubmit({ ...data, docType, docFile });
  };

  const handleBack = () => {
    setData({
      ...getValues(),
      tab,
      docType,
      docFile,
    });

    onBack();
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <TabSwitcher activeTab={tab} onChange={setTab} />
      {/* Info tab content */}
      {tab === "info" && (
        <div className="flex flex-col gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            {/* اسم النشاط */}
            <Input
              label={config.nameLabel}
              placeholder={config.namePlaceholder}
              required
              icon="🏢"
              registration={register("businessName", {
                required: `${config.nameLabel} مطلوب `,
                minLength: { value: 2, message: " حرفين على الأقل " },
              })}
              error={errors.businessName?.message}
            />
            {/* نوع النشاط */}
            <Select
              label={config.typeLabel}
              required
              options={config.typeOptions}
              registration={register("businessType", {
                required: `${config.typeLabel} مطلوب`,
              })}
              error={errors.businessType?.message}
            />
          </div>
          {/* موقع النشاط */}
          <Input
            label={config.locationLabel}
            placeholder="مثال: غزة، حي الرمال"
            required
            icon={<FiMapPin size={14} />}
            registration={register("location", {
              required: `${config.locationLabel} مطلوب`,
              minLength: { value: 3, message: "يرجى إدخال الموقع بشكل أوضح" },
            })}
            error={errors.location?.message}
          />
          {/* التالي بدون تأكيد الارسال */}
          <NavigationBtns
            onNext={handleNext}
            onBack={handleBack}
            nextLabel="التالي"
          />
        </div>
      )}

      {/* Docs tab content */}
      {tab === "docs" && (
        <div className="flex flex-col gap-4">
          <div>
            <DocTypeSelector selected={docType} onChange={setDocType} />
            <DropzoneUpload
              file={docFile}
              onChange={(f) => {
                setDocFile(f);
                setDocError("");
              }}
              error={docError}
            />
          </div>
          {/* final submit btn */}
          <NavigationBtns
            onBack={() => setTab("info")}
            nextLabel={config.submitLabel}
            nextDisabled={isLoading}
            nextType="submit"
          />
        </div>
      )}
    </form>
  );
}

//Step 3
export default function StepThree({
  role,
  onBack,
  onSubmit,
  isLoading,
  data,
  setData,
}) {
  const titles = {
    store: " أدخل بيانات متجرك ومعلومات النشاط ",
    supplier: " أدخل بيانات شركتك ومعلوات النشاط ",
  };
  return (
    <div className="px-6 pb-6" dir="rtl">
      <p className="text-sm text-gray-700 font-medium mb-4">{titles[role]}</p>
      <BusinessForm
        role={role}
        onBack={onBack}
        onSubmit={onSubmit}
        isLoading={isLoading}
        data={data}
        setData={setData}
      />
    </div>
  );
}
