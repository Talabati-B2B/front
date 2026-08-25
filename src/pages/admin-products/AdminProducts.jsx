import { useMemo, useState } from "react";
import {
  FiBox,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
  FiX,
} from "react-icons/fi";

const PAGE_SIZE = 4;

const initialProducts = [
  {
    id: 1,
    name: "قهوة عربية فاخرة",
    sku: "AR-COF-001",
    category: "مشروبات",
    price: 20,
    stock: 450,
    capacity: 600,
    ordersCount: 1250,
    supplier: "شركة البن العربي",
    thumbnail: "☕",
    thumbnailClass: "bg-[#F3E8D8]",
  },
  {
    id: 2,
    name: "تمر الجواهر",
    sku: "AR-DAT-204",
    category: "حلويات",
    price: 25,
    stock: 12,
    capacity: 240,
    ordersCount: 865,
    supplier: "مزارع الجواهر",
    thumbnail: "🌴",
    thumbnailClass: "bg-[#EFE5DC]",
  },
  {
    id: 3,
    name: "عسل سدر بري",
    sku: "AR-HNY-102",
    category: "مواد خام",
    price: 50,
    stock: 80,
    capacity: 200,
    ordersCount: 740,
    supplier: "مناحل الوادي",
    thumbnail: "🍯",
    thumbnailClass: "bg-[#FFF0D6]",
  },
  {
    id: 4,
    name: "زيت زيتون",
    sku: "AR-OIL-455",
    category: "زيوت وطبخ",
    price: 65,
    stock: 600,
    capacity: 670,
    ordersCount: 1120,
    supplier: "معاصر القدس",
    thumbnail: "🫒",
    thumbnailClass: "bg-[#E8E7D3]",
  },
  {
    id: 5,
    name: "أرز بسمتي فاخر",
    sku: "AR-RCE-318",
    category: "حبوب",
    price: 34,
    stock: 0,
    capacity: 320,
    ordersCount: 690,
    supplier: "مخازن الخير",
    thumbnail: "🌾",
    thumbnailClass: "bg-[#F5EEDC]",
  },
  {
    id: 6,
    name: "شاي أسود ممتاز",
    sku: "AR-TEA-719",
    category: "مشروبات",
    price: 18,
    stock: 155,
    capacity: 300,
    ordersCount: 580,
    supplier: "شركة البركة",
    thumbnail: "🍵",
    thumbnailClass: "bg-[#E4F0E8]",
  },
  {
    id: 7,
    name: "سكر أبيض ناعم",
    sku: "AR-SGR-221",
    category: "مواد خام",
    price: 14,
    stock: 28,
    capacity: 250,
    ordersCount: 530,
    supplier: "مؤسسة اليسر",
    thumbnail: "🧂",
    thumbnailClass: "bg-[#F1F3F5]",
  },
  {
    id: 8,
    name: "طحين قمح فاخر",
    sku: "AR-FLR-511",
    category: "حبوب",
    price: 22,
    stock: 230,
    capacity: 300,
    ordersCount: 920,
    supplier: "مطاحن فلسطين",
    thumbnail: "🌾",
    thumbnailClass: "bg-[#F0E5D3]",
  },
  {
    id: 9,
    name: "زيت دوار الشمس",
    sku: "AR-SUN-845",
    category: "زيوت وطبخ",
    price: 31,
    stock: 62,
    capacity: 260,
    ordersCount: 610,
    supplier: "شركة الإمداد",
    thumbnail: "🌻",
    thumbnailClass: "bg-[#FFF2C8]",
  },
  {
    id: 10,
    name: "بسكويت بالتمر",
    sku: "AR-BIS-904",
    category: "حلويات",
    price: 12,
    stock: 185,
    capacity: 240,
    ordersCount: 455,
    supplier: "مصانع النور",
    thumbnail: "🍪",
    thumbnailClass: "bg-[#F5E1D0]",
  },
  {
    id: 11,
    name: "مياه معدنية",
    sku: "AR-WTR-620",
    category: "مشروبات",
    price: 8,
    stock: 0,
    capacity: 500,
    ordersCount: 830,
    supplier: "مياه الصفاء",
    thumbnail: "💧",
    thumbnailClass: "bg-[#DFF2FA]",
  },
  {
    id: 12,
    name: "عدس أحمر",
    sku: "AR-LEN-420",
    category: "حبوب",
    price: 16,
    stock: 300,
    capacity: 350,
    ordersCount: 505,
    supplier: "مخازن الوفاق",
    thumbnail: "🫘",
    thumbnailClass: "bg-[#F2DFD7]",
  },
];

const platformSummary = {
  totalProducts: 86,
  totalStores: 204,
  totalSuppliers: 17620,
};

function getStockStatus(product) {
  if (product.stock === 0) {
    return "نفد المخزون";
  }

  const percentage = (product.stock / product.capacity) * 100;

  if (percentage <= 20) {
    return "مخزون منخفض";
  }

  return "متوفر";
}

const statusStyles = {
  متوفر: {
    badge: "bg-[#DDF7E8] text-[#2E9E5B]",
    bar: "bg-[#27C66F]",
  },
  "مخزون منخفض": {
    badge: "bg-[#FFE4E6] text-[#DF4B57]",
    bar: "bg-[#F07E42]",
  },
  "نفد المخزون": {
    badge: "bg-[#FDECEC] text-[#C93C3C]",
    bar: "bg-[#D52B2B]",
  },
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function StatCard({ label, value, change, icon: Icon, iconClass }) {
  return (
    <article className="rounded-xl border border-[#D8DCE2] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="text-right">
          <p className="text-[14px] font-bold text-[#171A1F]">{label}</p>
          <p className="mt-1 text-[23px] font-bold leading-none text-[#05070A]">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClass}`}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      {change ? (
        <p className="mt-5 text-[11px] text-[#8A8D95]">
          <span className="font-bold text-[#18A54A]">{change}</span> عن الشهر الماضي
        </p>
      ) : (
        <div className="mt-5 h-[16px]" />
      )}
    </article>
  );
}

function ProductThumbnail({ product }) {
  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[24px] ${product.thumbnailClass}`}
      role="img"
      aria-label={`صورة ${product.name}`}
    >
      {product.thumbnail}
    </span>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  const categoryOptions = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );

  const mostOrderedProduct = useMemo(
    () =>
      products.reduce(
        (highest, product) =>
          !highest || product.ordersCount > highest.ordersCount
            ? product
            : highest,
        null,
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      const productStatus = getStockStatus(product);
      const matchesStatus =
        statusFilter === "الكل" || productStatus === statusFilter;
      const matchesCategory =
        categoryFilter === "الكل" || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, products, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;
  const productToDelete =
    products.find((product) => product.id === productToDeleteId) ?? null;

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    resetPage();
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    resetPage();
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    resetPage();
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productToDelete.id),
    );
    setProductToDeleteId(null);

    const nextFilteredCount = Math.max(0, filteredProducts.length - 1);
    const nextTotalPages = Math.max(1, Math.ceil(nextFilteredCount / PAGE_SIZE));

    if (safeCurrentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
    }
  };

  const shownFrom = filteredProducts.length ? pageStart + 1 : 0;
  const shownTo = Math.min(pageStart + PAGE_SIZE, filteredProducts.length);

  return (
    <div dir="rtl" className="w-full p-4 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <header>
          <h1 className="text-[24px] font-bold text-[#00163B] sm:text-[28px]">
            المنتجات
          </h1>
          <div className="mt-4">
            <h2 className="text-[15px] font-bold text-[#00163B]">
              نظرة عامة على المنتجات
            </h2>
            <p className="mt-1 text-[12px] text-[#44474F]">
              تحكم في المخزون والموردين والموافقات من مكان واحد
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="إجمالي المنتجات"
            value={formatNumber(platformSummary.totalProducts)}
            change="+15%"
            icon={FiBox}
            iconClass="bg-[#DCF7E5] text-[#28A745]"
          />
          <StatCard
            label="إجمالي المتاجر"
            value={formatNumber(platformSummary.totalStores)}
            change="+8%"
            icon={FiShoppingBag}
            iconClass="bg-[#F5E3F8] text-[#C765D4]"
          />
          <StatCard
            label="إجمالي الموردين"
            value={formatNumber(platformSummary.totalSuppliers)}
            icon={FiTruck}
            iconClass="bg-[#DDECF0] text-[#0B7890]"
          />
          <StatCard
            label="المنتجات الأكثر طلباً"
            value={formatNumber(mostOrderedProduct?.ordersCount ?? 0)}
            change="+12%"
            icon={FiShoppingCart}
            iconClass="bg-[#FFF0E5] text-[#F2762E]"
          />
        </section>

        <section className="mx-auto w-full max-w-[890px] rounded-2xl border border-[#D2D6DC] bg-white px-4 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.35fr_0.9fr_0.9fr]">
            <label>
              <span className="sr-only">البحث في المنتجات</span>
              <div className="relative">
                <FiSearch
                  size={20}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#969AA2]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="البحث برقم المنتج..."
                  className="h-14 w-full rounded-2xl border border-[#C7CBD1] bg-white pr-12 pl-4 text-[12px] text-[#171A1F] outline-none placeholder:text-[#A2A5AB] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                />
              </div>
            </label>

            <label>
              <span className="mb-1.5 block text-center text-[12px] font-bold text-[#171A1F]">
                الحالة
              </span>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="h-12 w-full rounded-xl border border-[#C7CBD1] bg-white px-4 text-[12px] text-[#666A73] outline-none focus:border-[#40577B]"
              >
                <option value="الكل">كل الحالات</option>
                {Object.keys(statusStyles).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-center text-[12px] font-bold text-[#171A1F]">
                الفئة
              </span>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="h-12 w-full rounded-xl border border-[#C7CBD1] bg-white px-4 text-[12px] text-[#666A73] outline-none focus:border-[#40577B]"
              >
                <option value="الكل">اختر الفئة</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#E2E4E8] bg-white shadow-[0_3px_10px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 border-b border-[#ECEEF1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[16px] font-bold text-[#00163B]">قائمة المنتجات</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#D8DCE2] bg-[#F8F9FB] px-3 py-2 text-[11px] text-[#555A63]">
                {categoryFilter === "الكل" ? "كل الفئات" : categoryFilter}
              </span>
              <span className="rounded-md border border-[#D8DCE2] bg-[#F8F9FB] px-3 py-2 text-[11px] text-[#555A63]">
                {statusFilter === "الكل" ? "كل الحالات" : statusFilter}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-right">
              <thead>
                <tr className="bg-[#F5F6F8] text-[11px] font-medium text-[#595D66]">
                  <th className="px-5 py-3.5">المنتج</th>
                  <th className="px-5 py-3.5">SKU</th>
                  <th className="px-5 py-3.5">الفئة</th>
                  <th className="px-5 py-3.5">السعر</th>
                  <th className="px-5 py-3.5">مستوى المخزون</th>
                  <th className="px-5 py-3.5">الحالة</th>
                  <th className="px-5 py-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.length ? (
                  visibleProducts.map((product) => {
                    const status = getStockStatus(product);
                    const statusStyle = statusStyles[status];
                    const stockPercentage = Math.min(
                      100,
                      Math.round((product.stock / product.capacity) * 100),
                    );

                    return (
                      <tr
                        key={product.id}
                        className="border-t border-[#ECEEF1] text-[12px] text-[#363A41] transition hover:bg-[#FCFCFD]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <ProductThumbnail product={product} />
                            <span className="font-medium text-[#171A1F]">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium tracking-wide text-[#4B5059]" dir="ltr">
                          {product.sku}
                        </td>
                        <td className="px-5 py-4">{product.category}</td>
                        <td className="whitespace-nowrap px-5 py-4" dir="ltr">
                          {product.price.toFixed(2)} ₪
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-[160px]">
                            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-[#30343A]">
                              <span>{stockPercentage}%</span>
                              <span>{product.stock} وحدة</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#E9EBEF]">
                              <div
                                className={`h-full rounded-full ${statusStyle.bar}`}
                                style={{ width: `${stockPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex min-w-[88px] justify-center rounded-full px-3 py-1.5 text-[10px] font-medium ${statusStyle.badge}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedProductId(product.id)}
                              className="flex h-9 w-10 items-center justify-center rounded-lg border border-[#CDD1D7] bg-white text-[#7B8089] transition hover:bg-[#F6F7F9]"
                              aria-label={`عرض ${product.name}`}
                              title="عرض المنتج"
                            >
                              <FiEye size={17} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDeleteId(product.id)}
                              className="flex h-9 w-10 items-center justify-center rounded-lg border border-[#CDD1D7] bg-white text-[#D62828] transition hover:bg-[#FFF5F5]"
                              aria-label={`حذف ${product.name}`}
                              title="حذف المنتج"
                            >
                              <FiTrash2 size={17} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center">
                      <FiPackage
                        size={34}
                        className="mx-auto text-[#AEB4BE]"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-[14px] font-bold text-[#00163B]">
                        لا توجد منتجات
                      </p>
                      <p className="mt-1 text-[12px] text-[#8A8D95]">
                        لا توجد منتجات مطابقة لخيارات البحث والتصفية الحالية.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#ECEEF1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[#60646C]">
              عرض {shownFrom}-{shownTo} من أصل {filteredProducts.length} منتج
            </p>

            <div className="flex items-center gap-2" dir="ltr">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#CDD1D7] bg-white text-[#171A1F] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة السابقة"
              >
                <FiChevronLeft size={17} aria-hidden="true" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-[12px] font-semibold transition ${
                      page === safeCurrentPage
                        ? "border-[#B85709] bg-[#B85709] text-white"
                        : "border-[#CDD1D7] bg-white text-[#171A1F] hover:bg-[#F6F7F9]"
                    }`}
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
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#CDD1D7] bg-white text-[#171A1F] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="الصفحة التالية"
              >
                <FiChevronRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#ECEEF1] px-5 py-4">
              <h2 className="text-[16px] font-bold text-[#00163B]">
                تفاصيل المنتج
              </h2>
              <button
                type="button"
                onClick={() => setSelectedProductId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6F747D] hover:bg-[#F3F4F6]"
                aria-label="إغلاق تفاصيل المنتج"
              >
                <FiX size={19} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4">
                <ProductThumbnail product={selectedProduct} />
                <div>
                  <h3 className="text-[16px] font-bold text-[#171A1F]">
                    {selectedProduct.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#777B84]" dir="ltr">
                    {selectedProduct.sku}
                  </p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-[#F7F8FA] p-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] text-[#8A8D95]">الفئة</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-[#171A1F]">
                    {selectedProduct.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#8A8D95]">السعر</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-[#171A1F]">
                    {selectedProduct.price.toFixed(2)} ₪
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#8A8D95]">المورد</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-[#171A1F]">
                    {selectedProduct.supplier}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#8A8D95]">المخزون</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-[#171A1F]">
                    {selectedProduct.stock} وحدة
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ) : null}

      {productToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC] text-[#D62828]">
              <FiTrash2 size={21} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-[17px] font-bold text-[#00163B]">
              حذف المنتج
            </h2>
            <p className="mt-2 text-[12px] leading-6 text-[#6F747D]">
              هل أنت متأكد من حذف {productToDelete.name}؟ سيتم حذف المنتج من
              القائمة محليًا.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="h-11 flex-1 rounded-xl bg-[#D62828] text-[13px] font-semibold text-white hover:bg-[#BC2020]"
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => setProductToDeleteId(null)}
                className="h-11 flex-1 rounded-xl border border-[#D7DBE1] bg-white text-[13px] font-semibold text-[#4B5059] hover:bg-[#F7F8FA]"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
