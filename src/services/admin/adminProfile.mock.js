// src/services/admin/adminProfile.mock.js

export const adminProfile = {
  name: "محمد أحمد",
  username: "admin",
  email: "admin@talabaty.com",
  phone: "0599000000",
  role: "مدير النظام",
  status: "فعال",

  avatarSrc: "",

  lastLogin: "23 أغسطس 2026 - 10:30 ص",

  permissions: [
    {
      id: 1,
      title: "إدارة المستخدمين",
      enabled: true,
    },
    {
      id: 2,
      title: "إدارة الموردين",
      enabled: true,
    },
    {
      id: 3,
      title: "إدارة المتاجر",
      enabled: true,
    },
    {
      id: 4,
      title: "إدارة الطلبات",
      enabled: true,
    },
    {
      id: 5,
      title: "التقارير",
      enabled: true,
    },
  ],
};