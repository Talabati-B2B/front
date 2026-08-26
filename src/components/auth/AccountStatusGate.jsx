import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// حالات الحساب كما يخزّنها السيرفر (عمود users.status)
const APPROVED = "approved";
const REJECTED = "rejected";

function operationalPath(role) {
  return role === "store" ? "/store" : "/supplier-dashboard";
}

function pendingPath(role) {
  return role === "store" ? "/store/pending" : "/supplierpendingdashboard";
}

/**
 * بوابة توجّه المتجر أو المورد حسب حالة حسابه.
 *
 * كانت الحالة تُقرأ من نسخة محلية في localStorage (بيانات تجريبية مزروعة
 * ومفردات حالات مختلفة عن السيرفر)، فيبقى صاحب الحساب في شاشة الانتظار بعد
 * موافقة الأدمن حتى يخرج ويدخل. الآن نعيد قراءتها من /api/user عند كل دخول
 * لمسار محمي، ونستخدم النسخة المخزّنة كقيمة مبدئية ريثما يصل الرد.
 */
export default function AccountStatusGate({ role, children, pendingOnly = false }) {
  const { user, refreshUser } = useAuth();
  const isGatedUser = Boolean(user) && user.role === role && role !== "admin";

  const [isSyncing, setIsSyncing] = useState(isGatedUser);

  useEffect(() => {
    if (!isGatedUser) return undefined;

    let active = true;

    refreshUser()
      .catch(() => {
        // فشل التحديث (انقطاع شبكة مثلاً) — نكمل بالحالة المخزّنة محلياً
      })
      .finally(() => {
        if (active) setIsSyncing(false);
      });

    return () => {
      active = false;
    };
  }, [isGatedUser, refreshUser]);

  if (!isGatedUser) {
    return children;
  }

  if (isSyncing) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#F5F6F8] text-[13px] text-gray-400"
      >
        جارٍ التحقق من حالة الحساب...
      </div>
    );
  }

  if (user.status === REJECTED) {
    return <Navigate to="/account-rejected" replace />;
  }

  // أي حالة غير approved (pending أو under_review أو need_changes) تبقى في
  // شاشة الانتظار، وهي نفسها الشاشة التي تعرض ملاحظات الإدارة.
  if (user.status === APPROVED) {
    return pendingOnly ? <Navigate to={operationalPath(role)} replace /> : children;
  }

  return pendingOnly ? children : <Navigate to={pendingPath(role)} replace />;
}
