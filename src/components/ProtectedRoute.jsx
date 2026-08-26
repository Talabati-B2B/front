import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { resolveHomeRoute } from "../utils/authNormalize";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  // نتفادى وميض إعادة التوجيه ريثما تُقرأ الجلسة من التخزين المحلي
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // دور غير مصرّح له: نعيده للوحته بدل عرض صفحة ليست له
    return <Navigate to={resolveHomeRoute(user.role, user.status)} replace />;
  }

  return children ?? <Outlet />;
}
