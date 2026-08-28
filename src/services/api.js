// import axios from "axios";

// الباك إند يرجّع Access-Control-Allow-Origin بعنوانه هو بدل عنوان الطالب،
// فالنداء المباشر من المتصفح يسقط بـ CORS. في التطوير نترك baseURL فارغاً
// لتمرّ الطلبات عبر بروكسي Vite (انظر vite.config.js) فتصبح من نفس الأصل.
// يُلغى هذا الالتفاف حين تُضبط إعدادات CORS على السيرفر.
// const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;

// export const api = axios.create({
//   baseURL,
//   headers: {
//     Accept: "application/json",
//   },
// });
// // ارسال التوكنز تلقائيا مع كل  طلب
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers = {
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     };
//   }
//   return config;
// });
// // لو التوكن انتهى
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

import axios from "axios";

// الباك إند يرجّع Access-Control-Allow-Origin بعنوانه هو بدل عنوان الطالب،
// فالنداء المباشر من المتصفح يسقط بـ CORS. في التطوير نترك baseURL فارغاً
// لتمرّ الطلبات عبر بروكسي Vite (انظر vite.config.js) فتصبح من نفس الأصل.
// يُلغى هذا الالتفاف حين تُضبط إعدادات CORS على السيرفر.
const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

// ارسال التوكنز تلقائيا مع كل  طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// لو التوكن انتهى
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
