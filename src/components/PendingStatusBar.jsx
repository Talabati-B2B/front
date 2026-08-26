import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiRefreshCw } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { getMe } from "../services/authService";
import { normalizeUser, resolveHomeRoute } from "../utils/authNormalize";

// شريط صغير ثابت لشاشات "قيد المراجعة": يتيح تحديث حالة الحساب أو تسجيل الخروج.
// عند الموافقة يعيد التوجيه تلقائياً للوحة المناسبة.
export default function PendingStatusBar() {
  const navigate = useNavigate();
  const { user, loginUser, logout, token } = useAuth();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const handleRefresh = async () => {
    setChecking(true);
    setMessage("");

    try {
      const fresh = await getMe();
      // /api/user يرجّع المستخدم دون علاقة الأدوار، فنحتفظ بالدور من الجلسة الحالية
      const freshUser = normalizeUser(fresh);
      const role = freshUser?.role ?? user?.role;
      const status = freshUser?.status ?? fresh?.status;

      const merged = { ...user, ...fresh, role };
      loginUser(merged, token);

      const home = resolveHomeRoute(role, status);
      if (home !== "/supplierpendingdashboard" && home !== "/store/pending") {
        navigate(home, { replace: true });
      } else {
        setMessage("لا يزال حسابك قيد المراجعة");
      }
    } catch {
      setMessage("تعذّر تحديث الحالة، حاول مجدداً");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      dir="rtl"
      className="fixed top-3 left-3 z-50 flex items-center gap-2"
    >
      {message && (
        <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow">
          {message}
        </span>
      )}

      <button
        type="button"
        onClick={handleRefresh}
        disabled={checking}
        className="flex items-center gap-1.5 rounded-lg bg-[#FF7024] px-3 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-[#EA641B] disabled:opacity-60"
      >
        <FiRefreshCw className={checking ? "animate-spin" : ""} size={14} />
        {checking ? "جارٍ التحقق..." : "تحديث الحالة"}
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-600 shadow transition-colors hover:bg-gray-50"
      >
        <FiLogOut size={14} />
        تسجيل خروج
      </button>
    </div>
  );
}
