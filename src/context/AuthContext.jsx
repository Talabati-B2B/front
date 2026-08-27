import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

import { getMe, logout as logoutRequest } from "../services/authService";
import { normalizeUser } from "../utils/authNormalize";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // عند فتح التطبيق تحقق إذا كان المستخدم مسجل دخول
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        // بيانات تالفة بالتخزين المحلي — نتعامل معها كجلسة غير مسجلة
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // Login
  const loginUser = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(userToken);
  };

  /*
   * إعادة قراءة المستخدم من السيرفر.
   *
   * النسخة المخزّنة محلياً لقطة من لحظة تسجيل الدخول: لو وافق الأدمن على
   * الحساب بعدها تبقى الحالة قديمة ويظل صاحبه عالقاً في شاشة الانتظار حتى
   * يخرج ويدخل. /api/user هو مصدر الحقيقة للحالة والدور وبيانات النشاط.
   */
  const refreshUser = useCallback(async () => {
    const fresh = normalizeUser(await getMe());

    if (fresh) {
      localStorage.setItem("user", JSON.stringify(fresh));
      setUser(fresh);
    }

    return fresh;
  }, []);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  // Logout
  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // حتى لو فشل إبطال التوكن على السيرفر، ننهي الجلسة محلياً
    }

    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role ?? null,
        status: user?.status ?? null,
        isAuthenticated: !!user,
        loginUser,
        refreshUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
