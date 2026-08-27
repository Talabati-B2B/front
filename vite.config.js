import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  /*
   * Vite لا يمرّر إلى كود المتصفح إلا المتغيّرات التي تبدأ بـ VITE_، وبعض
   * لوحات الاستضافة تعترض على هذه البادئة. نحقن المفتاح هنا يدوياً عبر define
   * فيصبح اسم المتغيّر على الخادم حراً: GEMINI_API_KEY يكفي.
   * loadEnv أعلاه يُستدعى ببادئة فارغة، فيقرأ ملفات .env و process.env معاً.
   */
  const geminiApiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || "";

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __GEMINI_API_KEY__: JSON.stringify(geminiApiKey),
    },
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
