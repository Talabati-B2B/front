import { createPendingAccount } from "./accountApproval.mock.js";

const delay = (ms = 800) => new Promise((res) => setTimeout(res, ms));
const REGISTERED_USERS_KEY = "talabaty-mock-registered-users";

const MOCK_USERS = [
  {
    id: 1,
    firstName: "أحمد",
    lastName: "محمد",
    email: "store@test.com",
    password: "Test@1234",
    role: "store",
    status: "active",
    storeName: "مطعم الأمل",
    storeType: "سوبرماركت",
    location: "غزة، حي الرمال",
    token: "mock-store-token-xyz",
  },
  {
    id: 2,
    firstName: "أحمد",
    lastName: "محمد",
    email: "supplier@test.com",
    password: "Test@1234",
    role: "supplier",
    status: "active",
    storeName: "شركة الأمل",
    storeType: "مواد غذائية",
    location: "غزة، منطقة الصناعة",
    token: "mock-supplier-token-xyz",
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

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function getRegisteredUsers() {
  if (!canUseStorage()) return [];

  try {
    const stored = window.localStorage.getItem(REGISTERED_USERS_KEY);
    const users = stored ? JSON.parse(stored) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch {
    // Mock persistence is optional when storage is unavailable.
  }
}

function getAllUsers() {
  const users = [...MOCK_USERS];

  getRegisteredUsers().forEach((registeredUser) => {
    const email = normalizeEmail(registeredUser.email);

    if (!users.some((user) => normalizeEmail(user.email) === email)) {
      users.push(registeredUser);
    }
  });

  return users;
}

export const mockRegister = async (data) => {
  await delay();

  const email = normalizeEmail(data.email);

  const exists = getAllUsers().find(
    (user) => normalizeEmail(user.email) === email,
  );

  if (exists) {
    throw new Error("البريد الإلكتروني مستخدم بالفعل");
  }

  const registeredUsers = getRegisteredUsers();

  const user = {
    id: Date.now(),
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: String(data.email ?? "").trim(),
    password: data.password,
    role: data.role,
    status: "active",
    phone: data.phone || "",
    businessName: data.businessName || "",
    businessType: data.businessType || "",
    location: data.location || "",
    token: `mock-${data.role}-token-${Date.now()}`,
  };

  saveRegisteredUsers([...registeredUsers, user]);

  createPendingAccount(data);

  return {
    success: true,
    message: "تم التسجيل بنجاح وتم إرسال الحساب للمراجعة",
  };
};

export const mockLogin = async ({ email, password }) => {
  await delay();

  const normalizedEmail = normalizeEmail(email);

  const user = getAllUsers().find(
    (item) => normalizeEmail(item.email) === normalizedEmail,
  );

  if (!user) {
    throw new Error("البريد الإلكتروني غير مسجل");
  }

  if (user.password !== password) {
    throw new Error("كلمة المرور غير صحيحة");
  }

  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  return {
    token: user.token,
    user: userWithoutPassword,
  };
};

export const mockForgotPassword = async (email) => {
  await delay();

  const normalizedEmail = normalizeEmail(email);

  const user = getAllUsers().find(
    (item) => normalizeEmail(item.email) === normalizedEmail,
  );

  if (!user) {
    throw new Error("البريد الإلكتروني غير مسجل");
  }

  return {
    success: true,
    message: "تم إرسال رابط إعادة تعيين كلمة المرور",
  };
};

export const mockResetPassword = async ({ email, password }) => {
  await delay();

  const normalizedEmail = normalizeEmail(email);

  const user = getAllUsers().find(
    (item) => normalizeEmail(item.email) === normalizedEmail,
  );

  if (!user) {
    throw new Error("البريد الإلكتروني غير مسجل");
  }

  const registeredUsers = getRegisteredUsers();

  const updatedUsers = registeredUsers.map((registeredUser) =>
    normalizeEmail(registeredUser.email) === normalizedEmail
      ? { ...registeredUser, password }
      : registeredUser,
  );

  if (
    updatedUsers.some(
      (registeredUser, index) => registeredUser !== registeredUsers[index],
    )
  ) {
    saveRegisteredUsers(updatedUsers);
  }

  return {
    success: true,
    message: "تم تغيير كلمة المرور بنجاح",
  };
};