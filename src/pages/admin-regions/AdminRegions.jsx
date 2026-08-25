import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiMapPin,
  FiPlus,
  FiPower,
  FiSearch,
  FiTrash2,
  FiX,
  FiXCircle,
} from "react-icons/fi";

const PAGE_SIZE = 6;

const initialRegions = [
  {
    id: 1,
    name: "الرمال",
    city: "غزة",
    stores: 128,
    suppliers: 34,
    status: "نشطة",
  },
  {
    id: 2,
    name: "النصر",
    city: "غزة",
    stores: 94,
    suppliers: 27,
    status: "نشطة",
  },
  {
    id: 3,
    name: "الشجاعية",
    city: "غزة",
    stores: 76,
    suppliers: 19,
    status: "غير نشطة",
  },
  {
    id: 4,
    name: "تل الهوى",
    city: "غزة",
    stores: 61,
    suppliers: 16,
    status: "نشطة",
  },
  {
    id: 5,
    name: "الشيخ رضوان",
    city: "غزة",
    stores: 83,
    suppliers: 21,
    status: "نشطة",
  },
  {
    id: 6,
    name: "الزيتون",
    city: "غزة",
    stores: 57,
    suppliers: 13,
    status: "غير نشطة",
  },
  {
    id: 7,
    name: "دير البلح",
    city: "دير البلح",
    stores: 69,
    suppliers: 18,
    status: "نشطة",
  },
  {
    id: 8,
    name: "النصيرات",
    city: "دير البلح",
    stores: 72,
    suppliers: 20,
    status: "نشطة",
  },
  {
    id: 9,
    name: "وسط خانيونس",
    city: "خانيونس",
    stores: 88,
    suppliers: 23,
    status: "نشطة",
  },
  {
    id: 10,
    name: "وسط رفح",
    city: "رفح",
    stores: 54,
    suppliers: 14,
    status: "غير نشطة",
  },
];

const emptyForm = {
  name: "",
  city: "",
  status: "نشطة",
};

const statusStyles = {
  نشطة: "bg-[#EAF8EF] text-[#15803D]",
  "غير نشطة": "bg-[#FDECEC] text-[#C93C3C]",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[status] ?? "bg-[#F1F3F5] text-[#5F6368]"}`}
    >
      {status}
    </span>
  );
}

export default function AdminRegions() {
  const [regions, setRegions] = useState(initialRegions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const stats = useMemo(() => {
    const active = regions.filter((region) => region.status === "نشطة").length;
    const inactive = regions.length - active;

    return [
      {
        label: "إجمالي المناطق",
        value: regions.length,
        icon: FiMapPin,
        iconClass: "bg-[#EEF3FA] text-[#40577B]",
      },
      {
        label: "المناطق النشطة",
        value: active,
        icon: FiCheckCircle,
        iconClass: "bg-[#EAF8EF] text-[#16A34A]",
      },
      {
        label: "المناطق غير النشطة",
        value: inactive,
        icon: FiXCircle,
        iconClass: "bg-[#FDECEC] text-[#E45252]",
      },
    ];
  }, [regions]);

  const filteredRegions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return regions.filter((region) => {
      const matchesSearch =
        !normalizedSearch ||
        region.name.toLowerCase().includes(normalizedSearch) ||
        region.city.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "الكل" || region.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [regions, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRegions.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleRegions = filteredRegions.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditingRegion(null);
    setFormData(emptyForm);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (region) => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      city: region.city,
      status: region.status,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRegion(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedCity = formData.city.trim();

    if (!trimmedName) {
      errors.name = "اسم المنطقة مطلوب";
    }

    if (!trimmedCity) {
      errors.city = "اسم المدينة مطلوب";
    }

    if (!formData.status) {
      errors.status = "حالة المنطقة مطلوبة";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingRegion) {
      setRegions((current) =>
        current.map((region) =>
          region.id === editingRegion.id
            ? {
                ...region,
                name: trimmedName,
                city: trimmedCity,
                status: formData.status,
              }
            : region,
        ),
      );
    } else {
      setRegions((current) => {
        const nextId =
          current.reduce((maxId, region) => Math.max(maxId, region.id), 0) + 1;

        return [
          {
            id: nextId,
            name: trimmedName,
            city: trimmedCity,
            stores: 0,
            suppliers: 0,
            status: formData.status,
          },
          ...current,
        ];
      });
      setCurrentPage(1);
    }

    closeModal();
  };

  const toggleRegionStatus = (regionId) => {
    setRegions((current) =>
      current.map((region) =>
        region.id === regionId
          ? {
              ...region,
              status: region.status === "نشطة" ? "غير نشطة" : "نشطة",
            }
          : region,
      ),
    );
  };

  const deleteRegion = (region) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف منطقة "${region.name}"؟`,
    );

    if (!confirmed) {
      return;
    }

    setRegions((current) =>
      current.filter((currentRegion) => currentRegion.id !== region.id),
    );
  };

  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#00163B] sm:text-[28px]">
              إدارة المناطق
            </h1>
            <p className="mt-1 text-[12px] text-[#747780] sm:text-[13px]">
              إدارة مناطق الخدمة وحالتها ومتابعة توزيع المتاجر والموردين داخل النظام
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#00163B] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#062454] focus:outline-none focus:ring-2 focus:ring-[#00163B]/20 sm:self-auto"
          >
            <FiPlus size={17} aria-hidden="true" />
            إضافة منطقة
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-xl border border-[#0000000D] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 text-right">
                    <p className="text-[13px] font-medium text-[#747780]">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-[24px] font-bold leading-none text-[#00163B]">
                      {stat.value}
                    </p>
                  </div>

                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-xl border border-[#0000000D] bg-white shadow-sm">
          <div className="border-b border-[#EEF0F3] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#00163B]">
                  قائمة المناطق
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  عرض مناطق الخدمة وتحديث حالتها والبيانات الأساسية الخاصة بها
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <label className="relative min-w-0 flex-1 lg:w-[320px] lg:flex-none">
                  <span className="sr-only">البحث في المناطق</span>
                  <FiSearch
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8D95]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="البحث باسم المنطقة أو المدينة..."
                    className="h-10 w-full rounded-lg border border-[#DDE1E7] bg-white pr-9 pl-3 text-[12px] text-[#191C1D] outline-none transition placeholder:text-[#A1A3AA] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                  />
                </label>

                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="h-10 min-w-[160px] rounded-lg border border-[#DDE1E7] bg-white px-3 text-[12px] text-[#44474F] outline-none focus:border-[#40577B]"
                  aria-label="تصفية حسب حالة المنطقة"
                >
                  <option value="الكل">كل الحالات</option>
                  <option value="نشطة">نشطة</option>
                  <option value="غير نشطة">غير نشطة</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-right">
              <thead>
                <tr className="bg-[#F4F6F9] text-[11px] font-semibold text-[#747780]">
                  <th className="px-5 py-3">اسم المنطقة</th>
                  <th className="px-5 py-3">المدينة</th>
                  <th className="px-5 py-3">عدد المتاجر</th>
                  <th className="px-5 py-3">عدد الموردين</th>
                  <th className="px-5 py-3">الحالة</th>
                  <th className="px-5 py-3 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {visibleRegions.length > 0 ? (
                  visibleRegions.map((region) => (
                    <tr
                      key={region.id}
                      className="border-t border-[#EEF0F3] text-[12px] text-[#44474F] transition hover:bg-[#FAFBFC]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#00163B]">
                        <span className="inline-flex items-center gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FA] text-[#40577B]">
                            <FiMapPin size={15} aria-hidden="true" />
                          </span>
                          {region.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">{region.city}</td>
                      <td className="px-5 py-4 font-medium text-[#191C1D]">
                        {region.stores.toLocaleString("ar")}
                      </td>
                      <td className="px-5 py-4 font-medium text-[#191C1D]">
                        {region.suppliers.toLocaleString("ar")}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={region.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(region)}
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#DDE1E7] bg-white px-2.5 text-[11px] font-semibold text-[#40577B] transition hover:bg-[#EEF3FA]"
                            title={`تعديل ${region.name}`}
                          >
                            <FiEdit2 size={13} aria-hidden="true" />
                            تعديل
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleRegionStatus(region.id)}
                            className={`inline-flex h-8 items-center justify-center gap-1 rounded-lg border px-2.5 text-[11px] font-semibold transition ${
                              region.status === "نشطة"
                                ? "border-[#F6D9C4] bg-[#FFF8F2] text-[#D96919] hover:bg-[#FFF2E8]"
                                : "border-[#CFE7D7] bg-[#F4FBF6] text-[#15803D] hover:bg-[#EAF8EF]"
                            }`}
                            title={
                              region.status === "نشطة"
                                ? `تعطيل ${region.name}`
                                : `تفعيل ${region.name}`
                            }
                          >
                            <FiPower size={13} aria-hidden="true" />
                            {region.status === "نشطة" ? "تعطيل" : "تفعيل"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteRegion(region)}
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-[#F2D1D1] bg-white px-2.5 text-[11px] font-semibold text-[#C93C3C] transition hover:bg-[#FDECEC]"
                            title={`حذف ${region.name}`}
                          >
                            <FiTrash2 size={13} aria-hidden="true" />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F4F8] text-[#7B879B]">
                          <FiMapPin size={21} aria-hidden="true" />
                        </span>
                        <p className="mt-3 text-[13px] font-semibold text-[#00163B]">
                          لا توجد مناطق مطابقة
                        </p>
                        <p className="mt-1 text-[11px] text-[#8A8D95]">
                          جرّب تغيير عبارة البحث أو فلتر الحالة
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#EEF0F3] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[11px] text-[#8A8D95]">
              عرض {filteredRegions.length === 0 ? 0 : startIndex + 1} -{" "}
              {Math.min(startIndex + PAGE_SIZE, filteredRegions.length)} من أصل{" "}
              {filteredRegions.length} منطقة
            </p>

            <div className="flex items-center gap-1.5" dir="ltr">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة السابقة"
              >
                <FiChevronLeft size={15} aria-hidden="true" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                      page === safeCurrentPage
                        ? "bg-[#00163B] text-white"
                        : "border border-[#DDE1E7] bg-white text-[#40577B] hover:bg-[#F4F6F9]"
                    }`}
                    aria-current={page === safeCurrentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE1E7] bg-white text-[#40577B] transition hover:bg-[#F4F6F9] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة التالية"
              >
                <FiChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00163B]/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="region-modal-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-4">
              <div>
                <h2
                  id="region-modal-title"
                  className="text-[17px] font-bold text-[#00163B]"
                >
                  {editingRegion ? "تعديل المنطقة" : "إضافة منطقة"}
                </h2>
                <p className="mt-1 text-[11px] text-[#8A8D95]">
                  {editingRegion
                    ? "حدّث البيانات الأساسية للمنطقة"
                    : "أدخل البيانات الأساسية لإضافة منطقة جديدة"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#747780] transition hover:bg-[#F4F6F9] hover:text-[#00163B]"
                aria-label="إغلاق"
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4 px-5 py-5">
                <div>
                  <label
                    htmlFor="region-name"
                    className="mb-1.5 block text-[12px] font-semibold text-[#44474F]"
                  >
                    اسم المنطقة
                    <span className="mr-1 text-[#E45252]">*</span>
                  </label>
                  <input
                    id="region-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="مثال: الرمال"
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-[#191C1D] outline-none transition placeholder:text-[#A1A3AA] focus:ring-2 ${
                      formErrors.name
                        ? "border-[#E45252] focus:border-[#E45252] focus:ring-[#E45252]/10"
                        : "border-[#DDE1E7] focus:border-[#40577B] focus:ring-[#40577B]/10"
                    }`}
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? "region-name-error" : undefined}
                  />
                  {formErrors.name ? (
                    <p
                      id="region-name-error"
                      className="mt-1.5 text-[11px] font-medium text-[#C93C3C]"
                    >
                      {formErrors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="region-city"
                    className="mb-1.5 block text-[12px] font-semibold text-[#44474F]"
                  >
                    المدينة
                    <span className="mr-1 text-[#E45252]">*</span>
                  </label>
                  <input
                    id="region-city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="مثال: غزة"
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-[#191C1D] outline-none transition placeholder:text-[#A1A3AA] focus:ring-2 ${
                      formErrors.city
                        ? "border-[#E45252] focus:border-[#E45252] focus:ring-[#E45252]/10"
                        : "border-[#DDE1E7] focus:border-[#40577B] focus:ring-[#40577B]/10"
                    }`}
                    aria-invalid={Boolean(formErrors.city)}
                    aria-describedby={formErrors.city ? "region-city-error" : undefined}
                  />
                  {formErrors.city ? (
                    <p
                      id="region-city-error"
                      className="mt-1.5 text-[11px] font-medium text-[#C93C3C]"
                    >
                      {formErrors.city}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="region-status"
                    className="mb-1.5 block text-[12px] font-semibold text-[#44474F]"
                  >
                    الحالة
                    <span className="mr-1 text-[#E45252]">*</span>
                  </label>
                  <select
                    id="region-status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-[#191C1D] outline-none transition focus:ring-2 ${
                      formErrors.status
                        ? "border-[#E45252] focus:border-[#E45252] focus:ring-[#E45252]/10"
                        : "border-[#DDE1E7] focus:border-[#40577B] focus:ring-[#40577B]/10"
                    }`}
                    aria-invalid={Boolean(formErrors.status)}
                    aria-describedby={
                      formErrors.status ? "region-status-error" : undefined
                    }
                  >
                    <option value="نشطة">نشطة</option>
                    <option value="غير نشطة">غير نشطة</option>
                  </select>
                  {formErrors.status ? (
                    <p
                      id="region-status-error"
                      className="mt-1.5 text-[11px] font-medium text-[#C93C3C]"
                    >
                      {formErrors.status}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#EEF0F3] bg-[#FAFBFC] px-5 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-lg border border-[#DDE1E7] bg-white px-4 text-[12px] font-semibold text-[#44474F] transition hover:bg-[#F4F6F9]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#00163B] px-5 text-[12px] font-semibold text-white transition hover:bg-[#062454] focus:outline-none focus:ring-2 focus:ring-[#00163B]/20"
                >
                  {editingRegion ? "حفظ التعديلات" : "إضافة المنطقة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
