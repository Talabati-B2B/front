import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // الباك إند يرجّع Access-Control-Allow-Origin بعنوانه هو بدل عنوان الطالب،
      // فأي نداء مباشر من المتصفح يسقط بـ CORS. نمرّر الطلبات عبر خادم التطوير
      // ليصبح النداء من نفس الأصل. يُحذف هذا حين تُضبط إعدادات CORS بالسيرفر.
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
})
