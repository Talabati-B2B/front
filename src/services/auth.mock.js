// محاكاة لتأخر جلب البيانات من API
const delay = (ms = 800) => new Promise((res) => setTimeout(res, ms));

// بيانات مشابهو للداتا بيز
const MOCK_USERS = [
  {
    id: 1,
    firstName: "أحمد",
    lastName: " محمد ",
    email: "store@test.com",
    password: "Test@1234",
    role: "store",
    status: "active",
    storeName: " مطعم الأمل ",
    storeType: "سوبرماركت",
    location: " غزة، حي الرمال ",
    token: "mock-store-token-xyz",
  },
  {
    id: 2,
    firstName: "أحمد",
    lastName: " محمد ",
    email: "supplier@test.com",
    password: "Test@1234",
    role: "supplier",
    status: "active",
    storeName: " شركة الأمل ",
    storeType: "موتد غذائية",
    location: " غزة، منطقة الصناعة ",
    token: "mock-store-token-xyz",
  },
  {
    id: 3,
    firstName: "محمد",
    lastName: "الشامي",
    email: "admin@test.com",
    password: "Test@1234",
    role: "admin",
    status: "active",
    token: "mock-admin-token-xyz",
  },
];

// تسجيل
export const mockRegister = async (data) => {
  await delay();
  const exists = MOCK_USERS.find((u) => u.email === data.email);
  if (exists) {
    throw new Error(" البريد الاكتروني مستخدم بالفعل ");
  }
  return {
    success: true,
    message: " تم التجيل بنجاح - تحقق من بريدك الالكتروني ",
  };
};

// نسجيل الدخول
export const mockLogin = async ({email, password}) => {
  await delay()

  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    throw new Error("البريد الإلكتروني غير مسجل");
  }
  if (user.password !== password) {
    throw new Error("كلمة المرور غير صحيحة");
  }
  if (user.status === "pending") {
    throw new Error(" حسابك قيد المراجعة — سيتم التواصل معك قريباً ");
  }

//   const {password: ...userWithoutPassword} = user;

//   return {
//     token: user.token,
//     user: userWithoutPassword,
//   };
};
