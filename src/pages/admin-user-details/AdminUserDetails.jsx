import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { FiArrowRight, FiCheck, FiX, FiUser } from "react-icons/fi";

import {
  adminUsersMock,
  updateAdminUserStatus,
} from "../../services/admin/adminUsers.mock";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialUser = adminUsersMock.find((user) => user.id === Number(id));

  const [user, setUser] = useState(initialUser);

  if (!user) {
    return <div className="p-6 text-center">المستخدم غير موجود</div>;
  }

  const handleApprove = () => {
    const updated = updateAdminUserStatus(user.id, "Approved");

    setUser(updated);
  };

  const handleReject = () => {
    const updated = updateAdminUserStatus(user.id, "Rejected");

    setUser(updated);
  };

  return (
    <section dir="rtl" className="min-h-full bg-[#F7F8FA] p-6">
      <div className="mx-auto max-w-[1100px] space-y-5">
        {/* Back */}

        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-sm font-bold text-[#062454]"
        >
          <FiArrowRight />
          العودة للمستخدمين
        </button>

        {/* Header */}

        <div className="rounded-2xl bg-white p-6 border">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#062454] text-white">
              <FiUser size={30} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#062454]">{user.name}</h1>

              <p className="text-sm text-gray-500">{user.type}</p>

              <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs">
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Information */}

        <div className="grid gap-4 md:grid-cols-2">
          <Info title="البريد الإلكتروني" value={user.email} />

          <Info title="رقم الهاتف" value={user.phone} />

          <Info title="تاريخ التسجيل" value={user.createdAt} />

          <Info title="نوع الحساب" value={user.type} />
        </div>

        {/* Actions */}

        {user.status === "Pending" && (
          <div className="flex gap-3 rounded-xl bg-white p-5 border">
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white font-bold"
            >
              <FiCheck />
              قبول الطلب
            </button>

            <button
              onClick={handleReject}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white font-bold"
            >
              <FiX />
              رفض الطلب
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs text-gray-500">{title}</p>

      <p className="mt-2 font-semibold text-[#062454]">{value}</p>
    </div>
  );
}
