import { createContext, useContext, useState, useEffect } from "react";

import { logout as logoutRequest } from "../services/authService";

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

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
