import { useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { MapPin, SearchX, Truck, X } from "lucide-react";
import { storeSuppliers } from "../../services/store/storeSuppliers.mock";

export default function Suppliers() {
  const location = useLocation();

  const { searchValue = "" } = useOutletContext() ?? {};

  const normalizedSearch = searchValue.trim().toLowerCase();

  /*
   * إذا دخلنا من Dashboard ومعنا supplierId
   * يتم تحديد المورد من أول Render مباشرة
   * بدون استخدام useEffect.
   */
  const [selectedSupplier, setSelectedSupplier] = useState(() => {
    const supplierId = location.state?.supplierId;

    if (!supplierId) {
      return null;
    }

    return (
      storeSuppliers.find(
        (supplier) => supplier.id === supplierId,
      ) ?? null
    );
  });

  const filteredSuppliers = useMemo(() => {
    if (!normalizedSearch) {
      return storeSuppliers;
    }

    return storeSuppliers.filter((supplier) =>
      [
        supplier.name,
        supplier.description,
        supplier.location,
      ].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [normalizedSearch]);

  const handleOpenDetails = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleCloseDetails = () => {
    setSelectedSupplier(null);
  };

  return (
    <section
      dir="rtl"
      className="min-h-full bg-white px-4 py-5 sm:px-6 lg:px-7"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        {/* PAGE HEADER */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FA] text-[#40577B]">
            <Truck
              className="h-5 w-5"
              strokeWidth={2}
            />
          </div>

          <div>
            <h1 className="text-[22px] font-bold text-[#062454] sm:text-[24px]">
              الموردون
            </h1>

            <p className="mt-1 text-[13px] leading-6 text-[#7A818D]">
              تصفح الموردين المتاحين واختر المورد المناسب لاحتياجات
              متجرك.
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredSuppliers.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#D7DBE2] bg-[#FAFBFC] px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3FA] text-[#40577B]">
              <SearchX
                className="h-5 w-5"
                strokeWidth={2}
              />
            </div>

            <h2 className="mt-4 text-[15px] font-bold text-[#20365A]">
              لا يوجد موردون مطابقون
            </h2>

            <p className="mt-1 text-[12px] text-[#7A818D]">
              جرّب البحث باسم مورد أو نشاط أو منطقة أخرى.
            </p>
          </div>
        ) : (
          /* SUPPLIERS GRID */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSuppliers.map((supplier) => (
              <article
                key={supplier.id}
                className="flex min-h-[230px] flex-col rounded-xl border border-[#E1E4E9] bg-white px-4 py-5 text-center shadow-[0_1px_4px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_5px_14px_rgba(15,23,42,0.08)]"
              >
                {/* AVATAR */}
                <div
                  className={`mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[24px] font-bold text-white ${supplier.avatarClass}`}
                >
                  {supplier.shortName}
                </div>

                {/* NAME */}
                <h2 className="mt-4 text-[13px] font-bold text-[#111827]">
                  {supplier.name}
                </h2>

                {/* DESCRIPTION */}
                <p className="mt-1 text-[11px] leading-5 text-[#7A818D]">
                  {supplier.description}
                </p>

                {/* LOCATION */}
                <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-[#555B65]">
                  <MapPin
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                  />

                  <span>{supplier.location}</span>
                </p>

                {/* DETAILS BUTTON */}
                <button
                  type="button"
                  onClick={() => handleOpenDetails(supplier)}
                  className="mt-auto min-h-9 w-full rounded-lg border border-[#9FB0C8] bg-white px-3 text-[12px] font-semibold text-[#20365A] transition-colors hover:bg-[#F5F8FC] focus:outline-none focus:ring-2 focus:ring-[#40577B]/20"
                >
                  عرض التفاصيل
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* SUPPLIER DETAILS MODAL */}
      {selectedSupplier ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={handleCloseDetails}
          role="presentation"
        >
          <div
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplier-details-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#E7E9ED] px-5 py-4">
              <h2
                id="supplier-details-title"
                className="text-[16px] font-bold text-[#062454]"
              >
                تفاصيل المورد
              </h2>

              <button
                type="button"
                onClick={handleCloseDetails}
                aria-label="إغلاق"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-[#20365A]"
              >
                <X
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-5">
              {/* SUPPLIER IDENTITY */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-[32px] font-bold text-white ${selectedSupplier.avatarClass}`}
                >
                  {selectedSupplier.shortName}
                </div>

                <h3 className="mt-4 text-[17px] font-bold text-[#111827]">
                  {selectedSupplier.name}
                </h3>

                <p className="mt-1 text-[12px] text-[#7A818D]">
                  {selectedSupplier.description}
                </p>
              </div>

              {/* SUPPLIER INFO */}
              <div className="mt-6 space-y-3">
                {/* ACTIVITY */}
                <div className="rounded-xl border border-[#E6E9EE] bg-[#FAFBFC] px-4 py-3">
                  <p className="text-[10px] font-medium text-[#8A9099]">
                    النشاط
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#20365A]">
                    {selectedSupplier.description}
                  </p>
                </div>

                {/* LOCATION */}
                <div className="rounded-xl border border-[#E6E9EE] bg-[#FAFBFC] px-4 py-3">
                  <p className="text-[10px] font-medium text-[#8A9099]">
                    الموقع
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[#20365A]">
                    <MapPin
                      className="h-4 w-4 shrink-0 text-[#F97316]"
                      strokeWidth={2}
                    />

                    <p className="text-[12px] font-semibold">
                      {selectedSupplier.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={handleCloseDetails}
                className="mt-6 min-h-11 w-full rounded-xl bg-[#062454] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#0B356C]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}