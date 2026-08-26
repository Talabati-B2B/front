import { Navigate, useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";
import logo from "../../assets/images/logo.svg";
import { useAuth } from "../../context/AuthContext";
import {
  ACCOUNT_STATUS,
  getApprovalAccountByEmail,
  resubmitApprovalAccountByEmail,
} from "../../services/accountApproval.mock";

function destinationForRole(role, pending = false) {
  if (role === "store") return pending ? "/store/pending" : "/store";
  return pending ? "/supplierpendingdashboard" : "/supplier-dashboard";
}

export default function AccountRejected() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const account = getApprovalAccountByEmail(user.email);
  const status = account?.status;

  if (status === ACCOUNT_STATUS.APPROVED) {
    return <Navigate to={destinationForRole(user.role)} replace />;
  }

  if (
    status === ACCOUNT_STATUS.PENDING ||
    status === ACCOUNT_STATUS.NEEDS_CHANGES
  ) {
    return <Navigate to={destinationForRole(user.role, true)} replace />;
  }

  const handleResubmit = () => {
    const updated = resubmitApprovalAccountByEmail(user.email);
    if (updated) {
      navigate(destinationForRole(user.role, true), { replace: true });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F5F6F8] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="طلباتي" className="h-auto w-[190px]" />
        </div>

        <section className="overflow-hidden rounded-3xl border border-[#E3E6EA] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#F1D6D6] bg-[#FFF7F7] px-6 py-7 text-center sm:px-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEC] text-[#C93C3C]">
              <AlertTriangle size={30} aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-[24px] font-bold text-[#00163B]">
              لم يتم اعتماد الحساب
            </h1>
            <p className="mt-2 text-[13px] leading-7 text-[#747780]">
              تمت مراجعة طلب التسجيل، ويحتاج الحساب إلى تصحيح البيانات الموضحة أدناه قبل إعادة التقديم.
            </p>
          </div>

          <div className="space-y-5 px-6 py-7 sm:px-10">
            <div className="rounded-2xl border border-[#EEF0F3] bg-[#FAFBFC] p-5">
              <p className="text-[11px] font-semibold text-[#8A8D95]">
                الحساب
              </p>
              <p className="mt-1 text-[15px] font-bold text-[#00163B]">
                {account?.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email}
              </p>
              <p className="mt-1 text-[12px] text-[#7A7F89]" dir="ltr">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl border border-[#F0CBCB] bg-[#FFF9F9] p-5">
              <p className="text-[12px] font-bold text-[#9F2D2D]">سبب الرفض</p>
              <p className="mt-2 text-[13px] leading-7 text-[#5F636B]">
                {account?.rejectionReason ||
                  "لم يتم تحديد سبب الرفض. يرجى مراجعة بيانات الحساب قبل إعادة التقديم."}
              </p>
            </div>

            <div className="rounded-2xl border border-[#DDE4EE] bg-[#F7F9FC] p-5">
              <h2 className="text-[14px] font-bold text-[#00163B]">
                ماذا يحدث بعد إعادة التقديم؟
              </h2>
              <p className="mt-2 text-[12px] leading-7 text-[#6F737A]">
                سيتم تحويل حالة الحساب إلى قيد المراجعة، ومسح سبب الرفض السابق، وإرسال إشعار جديد للإدارة لمراجعة الطلب مرة أخرى.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleResubmit}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F2762E] px-6 text-[12px] font-bold text-white transition hover:bg-[#DC6826]"
              >
                <RefreshCw size={16} aria-hidden="true" />
                تعديل وإعادة إرسال الطلب
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
