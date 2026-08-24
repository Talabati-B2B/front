import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCalendar,
  FiEdit3,
  FiSave,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

import { adminProfile } from "../../services/admin/adminProfile.mock";

export default function AdminProfile() {
  const [profile, setProfile] = useState(adminProfile);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: profile.name,
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setProfile((prev) => ({
      ...prev,
      ...formData,
    }));

    setEditMode(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
    });

    setEditMode(false);
  };

  return (
    <section dir="rtl" className="min-h-full bg-[#F7F8FA] px-5 py-6">
      <div className="mx-auto max-w-[1200px] space-y-5">
        {/* Header */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#062454] text-white">
                <FiUser size={38} />
              </div>

              <div>
                <h1 className="text-[22px] font-bold text-[#062454]">
                  {profile.name}
                </h1>

                <p className="mt-1 text-sm text-[#7A818D]">{profile.role}</p>

                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <FiCheckCircle size={14} />
                  {profile.status}
                </span>
              </div>
            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 rounded-lg bg-[#FF7A1A] px-5 py-2.5 text-sm font-bold text-white"
              >
                <FiEdit3 />
                تعديل البيانات
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-[#062454] px-5 py-2.5 text-sm font-bold text-white"
                >
                  <FiSave />
                  حفظ
                </button>

                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-600"
                >
                  <FiX />
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </div>

        {saved && (
          <div className="rounded-lg bg-green-100 p-3 text-center text-sm font-semibold text-green-700">
            تم حفظ البيانات بنجاح
          </div>
        )}

        {/* Account Info */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-[#062454]">
            معلومات الحساب
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="الاسم"
              icon={<FiUser />}
              value={formData.name}
              disabled={!editMode}
              onChange={(v) => handleChange("name", v)}
            />

            <Input
              label="اسم المستخدم"
              icon={<FiUser />}
              value={formData.username}
              disabled={!editMode}
              onChange={(v) => handleChange("username", v)}
            />

            <Input
              label="البريد الإلكتروني"
              icon={<FiMail />}
              value={formData.email}
              disabled={!editMode}
              onChange={(v) => handleChange("email", v)}
            />

            <Input
              label="رقم الهاتف"
              icon={<FiPhone />}
              value={formData.phone}
              disabled={!editMode}
              onChange={(v) => handleChange("phone", v)}
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-[#062454]">
            <FiShield />
            صلاحيات الإدارة
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            {profile.permissions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] p-4"
              >
                <span className="text-sm font-semibold text-[#374151]">
                  {item.title}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  مفعلة
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Login */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#062454]">
            <FiCalendar />
            آخر نشاط
          </h2>

          <p className="mt-3 text-sm text-gray-600">{profile.lastLogin}</p>
        </div>
      </div>
    </section>
  );
}

function Input({ label, icon, value, disabled, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#374151]">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-lg border border-[#D9DCE2] bg-white px-3">
        <span className="text-[#7A818D]">{icon}</span>

        <input
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full bg-transparent text-sm outline-none disabled:text-gray-500"
        />
      </div>
    </div>
  );
}
