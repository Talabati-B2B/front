export const SUPPLIER_PROFILE_STORAGE_KEY = "talabaty-supplier-profile";

export const supplierProfile = {
  firstName: "أحمد",
  lastName: "محمد",
  ownerName: "أحمد محمد",
  email: "ahmadmohmmad@gmail.com",
  mobile: "0599000000",
  whatsapp: "+970599000000",
  jobTitle: "مسؤول المبيعات",
  country: "دولة فلسطين",
  accountStatus: "مورد معتمد",
  status: "فعال",
  avatarSrc: "",

  companyName: "شركة الأمل للتجارة",
  businessType: "تجارة عامة",
  companyLocation: "مدينة غزة، منطقة الصناعة",

  officialDocuments: [
    {
      id: "commercial-register",
      name: "السجل التجاري",
      fileName: "commercial-register.pdf",
      status: "ساري",
    },
    {
      id: "ownership-proof",
      name: "إثبات ملكية",
      fileName: "ownership-proof.pdf",
      status: "ساري",
    },
    {
      id: "national-id",
      name: "هوية وطنية",
      fileName: "national-id.pdf",
      status: "ساري",
    },
  ],

  bio: "نحن نعمل على توفير منتجات وخدمات موثوقة للتجار والمتاجر، مع الحرص على سرعة التوريد واستمرارية الخدمة.",
  services:
    "توفير وتوريد أصناف متنوعة للمتاجر مع خدمة توصيل مرنة ودعم مستمر.",
};

export function readSupplierProfileMock() {
  try {
    const stored = window.localStorage.getItem(
      SUPPLIER_PROFILE_STORAGE_KEY,
    );

    return stored
      ? {
          ...supplierProfile,
          ...JSON.parse(stored),
        }
      : supplierProfile;
  } catch {
    return supplierProfile;
  }
}

export function saveSupplierProfileMock(profile) {
  try {
    window.localStorage.setItem(
      SUPPLIER_PROFILE_STORAGE_KEY,
      JSON.stringify(profile),
    );
  } catch {
    // Local persistence is optional.
    // In-memory state remains functional.
  }

  return profile;
}