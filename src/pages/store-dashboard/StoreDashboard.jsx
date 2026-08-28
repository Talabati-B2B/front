import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  BrainCircuit,
  ChevronLeft,
  ClipboardCheck,
  MapPin,
  PlusSquare,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getStatusInfo } from "../../constants/orderConstants";
import { assetUrl } from "../../utils/assetUrl";

function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[17px] font-bold text-[#062454]">
        {title}
      </h2>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#F97316] transition-colors hover:text-[#D85F09]"
        >
          <span>{actionLabel}</span>

          <ChevronLeft
            className="h-4 w-4"
            strokeWidth={2}
          />
        </button>
      ) : null}
    </div>
  );
}

function EmptySection({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D7DBE2] bg-[#FAFBFC] px-4 py-8 text-center text-[13px] text-[#7A818D]">
      {message}
    </div>
  );
}

const aiSuggestion = {
  title: "اقتراح ذكي",
  message: "بناءً على طلباتك السابقة، ننصحك بإعادة طلب المنتجات الأكثر مبيعاً لديك قبل نفاد المخزون.",
  actionLabel: "تصفح المنتجات",
};

const restockAlert = {
  title: "تنبيه إعادة تخزين",
  message: "بعض المنتجات في متجرك قاربت على النفاد. راجع المخزون وأعد الطلب.",
  actionLabel: "مراجعة المخزون",
};

const supplierPromo = {
  title: "اكتشف موردين جدد",
  message: "تصفح الموردين المتاحين واستفد من أفضل الأسعار والعروض الحصرية لمتجرك.",
  linkLabel: "تصفح الموردين →",
};

export default function StoreDashboard() {
  const navigate = useNavigate();

  const {
    searchValue = "",
    setSearchValue,
    products: rawProducts = [],
    suppliers: rawSuppliers = [],
    orders: rawOrders = [],
  } = useOutletContext() ?? {};

  const normalizedSearch = searchValue.trim().toLowerCase();

  const goTo = (path, state) => {
    setSearchValue?.("");
    navigate(path, state ? { state } : undefined);
  };

  const suggestedSuppliers = useMemo(() => rawSuppliers.slice(0, 4).map((s) => ({
    id: s.id,
    name: s.company_name || s.name || "",
    description: s.description || "",
    location: s.address || s.location || "",
    shortName: (s.company_name || s.name || "").charAt(0),
    avatarClass: "bg-[#4C6B7B]",
  })), [rawSuppliers]);

  const suggestedProducts = useMemo(() => rawProducts.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name || "",
    price: Number(p.price || p.base_price || 0),
    supplier: p.supplier?.company_name || p.supplier || "",
    stockStatus: p.stock > 10 ? "متوفر" : p.stock > 0 ? "مخزون منخفض" : "غير متوفر",
    image: p.image?.path ? assetUrl(p.image.path) : (p.image || null),
  })), [rawProducts]);

  const latestOrders = useMemo(() => rawOrders.slice(0, 5).map((o) => {
    const supplierName = o.supplier?.company_name || o.supplier?.name || "";
    const info = getStatusInfo(o.status);
    return {
      id: o.id,
      orderNumber: o.order_number || `ORD-${o.id}`,
      supplier: supplierName,
      supplierInitial: supplierName.charAt(0) || "م",
      supplierClass: "bg-[#4C6B7B]",
      status: info.label,
      statusClass: `${info.color} ${info.bgColor}`,
      total: Number(o.total_amount || o.total || 0),
    };
  }), [rawOrders]);

  const storeCategories = useMemo(() => {
    const catMap = {};
    rawProducts.forEach((p) => {
      const cat = p.category?.name || p.category;
      if (!cat) return;
      if (!catMap[cat]) catMap[cat] = { count: 0, image: p.image?.path ? assetUrl(p.image.path) : (p.image || null) };
      catMap[cat].count++;
    });
    return Object.entries(catMap).slice(0, 5).map(([name, data], i) => ({
      id: i,
      name,
      image: data.image,
      suppliersCount: data.count,
    }));
  }, [rawProducts]);

  const filteredSuppliers = useMemo(() => {
    if (!normalizedSearch) return suggestedSuppliers;
    return suggestedSuppliers.filter((supplier) =>
      [supplier.name, supplier.description, supplier.location].some((value) =>
        String(value).toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [normalizedSearch, suggestedSuppliers]);

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return suggestedProducts;
    return suggestedProducts.filter((product) =>
      [product.name, product.supplier].some((value) =>
        String(value).toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [normalizedSearch, suggestedProducts]);

  const filteredOrders = useMemo(() => {
    if (!normalizedSearch) return latestOrders;
    return latestOrders.filter((order) =>
      [order.orderNumber, order.supplier, order.status].some((value) =>
        String(value).toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [normalizedSearch, latestOrders]);

  return (
    <section
      dir="rtl"
      className="min-h-full bg-white px-4 py-5 sm:px-6 lg:px-7"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[14px] font-medium text-[#7A818D]">
              مرحباً بك في طلباتي، إليك ملخص متجرك اليوم
            </p>
          </div>

          <button
            type="button"
            onClick={() => goTo("/store/products")}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-6 text-[15px] font-bold text-[#111827] transition-colors hover:bg-[#EA6B0D] sm:w-auto sm:min-w-[210px]"
          >
            <PlusSquare
              className="h-5 w-5"
              strokeWidth={2.2}
            />

            <span>إضافة طلب جديد</span>
          </button>
        </div>

        <div
          className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]"
          dir="ltr"
        >
          {/* LEFT SIDE */}
          <aside
            className="order-2 min-w-0 xl:order-1"
            dir="rtl"
          >
            <div className="mb-4 flex items-center gap-2">
              <BrainCircuit
                className="h-5 w-5 text-[#F97316]"
                strokeWidth={2}
              />

              <h2 className="text-[17px] font-bold text-[#062454]">
                اقتراحات الذكاء الاصطناعي
              </h2>

              <span className="mr-auto h-2 w-2 rounded-full bg-[#22C55E]" />
            </div>

            <div className="space-y-4">
              {/* AI SUGGESTION */}
              <article className="rounded-xl border border-[#D7DBE2] bg-[#F7F9FC] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className="h-5 w-5 text-[#40577B]"
                      strokeWidth={2}
                    />

                    <h3 className="text-[15px] font-bold text-[#20365A]">
                      {aiSuggestion.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[12px] leading-6 text-[#5F6672]">
                  {aiSuggestion.message}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    goTo("/store/products", {
                      searchTerm: "أرز بسمتي",
                    })
                  }
                  className="mt-4 min-h-10 w-full rounded-lg border border-[#40577B] bg-white px-3 text-[13px] font-semibold text-[#20365A] transition-colors hover:bg-[#EFF3F8]"
                >
                  {aiSuggestion.actionLabel}
                </button>
              </article>

              {/* RESTOCK */}
              <article className="rounded-xl border border-[#F4CDB9] bg-[#FFF8F3] p-4">
                <div className="mb-2 flex items-center gap-2 text-[#B64B00]">
                  <ClipboardCheck
                    className="h-5 w-5"
                    strokeWidth={2}
                  />

                  <h3 className="text-[15px] font-bold">
                    {restockAlert.title}
                  </h3>
                </div>

                <p className="text-[11px] leading-6 text-[#6D6F75]">
                  {restockAlert.message}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    goTo("/store/products", {
                      searchTerm: "زيت دوار الشمس",
                    })
                  }
                  className="mt-4 min-h-10 w-full rounded-lg bg-[#B64B00] px-3 text-[13px] font-bold text-white transition-colors hover:bg-[#993F00]"
                >
                  {restockAlert.actionLabel}
                </button>
              </article>

              {/* RECENT ORDERS SIDEBAR */}
              <div className="border-t border-[#D7DBE2] pt-5">
                <h3 className="mb-4 text-[16px] font-bold text-[#111827]">
                  آخر الطلبات
                </h3>

                <div className="space-y-4">
                  {latestOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B64B00]" />

                      <div>
                        <p className="text-[11px] font-medium text-[#20365A]">
                          طلب {order.orderNumber} — {order.supplier}
                        </p>

                        <p className="mt-1 text-[9px] text-[#7A818D]">
                          {order.status} • ₪ {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {latestOrders.length === 0 && (
                    <p className="text-[11px] text-[#7A818D]">لا توجد طلبات حتى الآن.</p>
                  )}
                </div>
              </div>

              {/* PROMO */}
              <article className="relative overflow-hidden rounded-xl bg-[#0B356C] px-5 py-6 text-white shadow-sm">
                <Sparkles className="absolute -bottom-6 -left-4 h-20 w-20 text-white/5" />

                <h3 className="text-[15px] font-bold text-[#FF8A2A]">
                  {supplierPromo.title}
                </h3>

                <p className="mt-2 text-[12px] leading-6 text-white/90">
                  {supplierPromo.message}
                </p>

                <button
                  type="button"
                  onClick={() => goTo("/store/suppliers")}
                  className="mt-7 text-[11px] font-medium text-white underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  {supplierPromo.linkLabel}
                </button>
              </article>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div
            className="order-1 min-w-0 xl:order-2"
            dir="rtl"
          >
            {/* CATEGORIES */}
            <section className="mb-7">
              <SectionHeader
                title="التصنيفات"
                actionLabel="عرض جميع التصنيفات"
                onAction={() => goTo("/store/products")}
              />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {storeCategories.map((category) => (
                  <article
                    key={category.id}
                    className="flex min-h-[86px] min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-[#E1E4E9] bg-white p-3 shadow-[0_1px_4px_rgba(15,23,42,0.03)]"
                  >
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FA] text-[18px] font-bold text-[#40577B]">
                        {category.name.charAt(0)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="whitespace-normal text-[11px] font-semibold leading-5 text-[#20365A]">
                        {category.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#7A818D]">
                        {category.suppliersCount} مورد
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* SUPPLIERS */}
            <section className="mb-7">
              <SectionHeader
                title="الموردون المقترحون"
                actionLabel="عرض جميع الموردين"
                onAction={() => goTo("/store/suppliers")}
              />

              {filteredSuppliers.length === 0 ? (
                <EmptySection message="لا يوجد موردون مطابقون لبحثك." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredSuppliers.map((supplier) => (
                    <article
                      key={supplier.id}
                      className="rounded-xl border border-[#E1E4E9] bg-white px-4 py-5 text-center shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
                    >
                      <div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[24px] font-bold text-white ${supplier.avatarClass}`}
                      >
                        {supplier.shortName}
                      </div>

                      <h3 className="mt-4 text-[13px] font-bold text-[#111827]">
                        {supplier.name}
                      </h3>

                      <p className="mt-1 text-[11px] text-[#7A818D]">
                        {supplier.description}
                      </p>

                      <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-[#555B65]">
                        <MapPin
                          className="h-3.5 w-3.5"
                          strokeWidth={2}
                        />

                        {supplier.location}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          goTo("/store/suppliers", {
                            supplierId: supplier.id,
                          })
                        }
                        className="mt-4 min-h-9 w-full rounded-lg border border-[#9FB0C8] bg-white px-3 text-[12px] font-semibold text-[#20365A] transition-colors hover:bg-[#F7F9FC]"
                      >
                        عرض التفاصيل
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* PRODUCTS */}
            <section className="mb-7">
              <SectionHeader
                title="المنتجات المقترحة"
                actionLabel="عرض جميع المنتجات"
                onAction={() => goTo("/store/products")}
              />

              {filteredProducts.length === 0 ? (
                <EmptySection message="لا توجد منتجات مطابقة لبحثك." />
              ) : (
                <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E1E4E9] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
                    >
                      {/* IMAGE */}
                      <div className="bg-[#F4F4F4] p-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-28 w-full rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-28 w-full items-center justify-center rounded-md bg-[#EEF3FA] text-[24px] font-bold text-[#40577B]">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="min-h-[60px] flex-1 text-[12px] font-bold leading-5 text-[#20365A]">
                            {product.name}
                          </h3>

                          <span className="shrink-0 whitespace-nowrap text-[11px] text-[#737984]">
                            {product.price.toFixed(2)} ش
                          </span>
                        </div>

                        <p className="mt-3 text-[10px] text-[#7A818D]">
                          {product.supplier}
                        </p>

                        <p className="mt-1 mb-2 flex items-center gap-1 text-[10px] text-[#2C9A58]">
                          <span className="h-2 w-2 rounded-full bg-[#22C55E]" />

                          {product.stockStatus}
                        </p>

                        {/* BUTTON ALWAYS AT BOTTOM */}
                        <button
                          type="button"
                          onClick={() =>
                            goTo("/store/products", {
                              searchTerm: product.name.split(" ")[0],
                            })
                          }
                          title="فتح المنتج في صفحة المنتجات"
                          className="mt-auto inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#FF7A21] px-3 text-[12px] font-bold text-[#111827] transition-colors hover:bg-[#EA6B0D]"
                        >
                          <ShoppingCart
                            className="h-4 w-4"
                            strokeWidth={2}
                          />

                          أضف للطلب
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* LATEST ORDERS */}
            <section className="overflow-hidden rounded-xl border border-[#D7DBE2] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#D7DBE2] px-5 py-4">
                <h2 className="text-[17px] font-bold text-[#20365A]">
                  آخر الطلبات
                </h2>

                <button
                  type="button"
                  onClick={() => goTo("/store/orders")}
                  className="rounded-lg border border-[#F97316] px-4 py-2 text-[12px] font-medium text-[#F97316] transition-colors hover:bg-[#FFF5EC]"
                >
                  عرض جميع الطلبات
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-right">
                  <thead>
                    <tr className="bg-[#F1F2F4] text-[11px] font-semibold text-[#6D7480]">
                      <th className="px-5 py-3 text-right">
                        رقم الطلب
                      </th>

                      <th className="px-5 py-3 text-right">
                        المورد
                      </th>

                      <th className="px-5 py-3 text-center">
                        الحالة
                      </th>

                      <th className="px-5 py-3 text-center">
                        الإجمالي
                      </th>

                      <th className="w-12 px-3 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-[12px] text-[#7A818D]"
                        >
                          لا توجد طلبات مطابقة لبحثك.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-t border-[#E6E8EC] text-[12px]"
                        >
                          <td
                            className="whitespace-nowrap px-5 py-4 font-bold text-[#173A6B]"
                            dir="ltr"
                          >
                            {order.orderNumber}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${order.supplierClass}`}
                              >
                                {order.supplierInitial}
                              </span>

                              <span className="font-medium text-[#30343A]">
                                {order.supplier}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${order.statusClass}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-center font-bold text-[#111827]">
                            ₪ {order.total.toFixed(2)}
                          </td>

                          <td className="px-3 py-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                goTo("/store/orders", {
                                  orderNumber:
                                    order.orderNumber,
                                })
                              }
                              aria-label={`عرض الطلب ${order.orderNumber}`}
                              className="text-[#7A818D] transition-colors hover:text-[#20365A]"
                            >
                              <ChevronLeft
                                className="h-4 w-4"
                                strokeWidth={2}
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}