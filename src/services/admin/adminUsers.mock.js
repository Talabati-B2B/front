// src/services/admin/adminUsers.mock.js

export const adminUsersMock = [
  {
    id: 1,

    name: "متجر النور",
    type: "Store",
    role: "متجر",

    status: "Pending",

    email: "alnoor@test.com",
    phone: "0599123456",

    location: "غزة",

    createdAt: "2026-08-20",

    companyInfo: {
      name: "متجر النور",
      activity: "مواد غذائية",
      address: "غزة - فلسطين",
    },

    documents: [
      {
        name: "السجل التجاري",
        status: "مرفق",
      },
      {
        name: "الهوية",
        status: "مرفق",
      },
    ],
  },

  {
    id: 2,

    name: "شركة القدس للتوريد",
    type: "Supplier",
    role: "مورد",

    status: "Pending",

    email: "quds@test.com",
    phone: "0598765432",

    location: "خانيونس",

    createdAt: "2026-08-15",

    companyInfo: {
      name: "شركة القدس للتوريد",
      activity: "مواد غذائية",
      address: "خانيونس - فلسطين",
    },

    documents: [
      {
        name: "السجل التجاري",
        status: "مرفق",
      },
    ],
  },

  {
    id: 3,

    name: "متجر البيت الحديث",
    type: "Store",
    role: "متجر",

    status: "Approved",

    email: "home@test.com",
    phone: "0599887766",

    location: "رفح",

    createdAt: "2026-07-10",

    companyInfo: {
      name: "متجر البيت الحديث",
      activity: "أدوات منزلية",
      address: "رفح - فلسطين",
    },

    documents: [],
  },
];

// جلب مستخدم واحد

export function getAdminUserById(id) {
  return adminUsersMock.find((user) => user.id === Number(id));
}

// تحديث حالة المستخدم

export function updateAdminUserStatus(id, newStatus) {
  const user = adminUsersMock.find((item) => item.id === Number(id));

  if (!user) {
    return null;
  }

  user.status = newStatus;

  return user;
}

// جلب حسب النوع

export function getUsersByType(type) {
  return adminUsersMock.filter((user) => user.type === type);
}

// البحث

export function searchAdminUsers(value) {
  const search = value.trim().toLowerCase();

  if (!search) {
    return adminUsersMock;
  }

  return adminUsersMock.filter((user) =>
    [user.name, user.email, user.phone, user.location, user.type]
      .join(" ")
      .toLowerCase()
      .includes(search),
  );
}
