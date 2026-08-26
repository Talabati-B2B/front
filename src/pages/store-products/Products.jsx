import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  Banknote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Store,
  Warehouse,
  X,
} from "lucide-react";
import {
  storeProductCategories,
  storeProductSummary,
  storeStockStatuses,
} from "../../services/store/storeProducts.mock";

const PRODUCTS_PER_PAGE = 10;

const SUMMARY_ICONS = {
  purchases: Banknote,
  products: PackageCheck,
  "out-of-stock": Warehouse,
  popular: Star,
};

const SUMMARY_STYLES = {
  navy: {
    icon: "bg-[#EEF1F5] text-[#062454]",
    accent: "border-l-[#40577B]",
    helper: "text-[#16A34A]",
  },
  green: {
    icon: "bg-[#E0F9E8] text-[#16A34A]",
    accent: "border-l-[#8ED9A8]",
    helper: "text-[#16A34A]",
  },
  cyan: {
    icon: "bg-[#EAF5F7] text-[#0B7890]",
    accent: "border-l-[#7AB7C5]",
    helper: "text-[#64748B]",
  },
  orange: {
    icon: "bg-[#FFE3D1] text-[#F97316]",
    accent: "border-l-[#F6A26B]",
    helper: "text-[#64748B]",
  },
};

const STOCK_BADGE_STYLES = {
  متوفر: "bg-[#E9FBF0] text-[#16834B]",
  "مخزون منخفض": "bg-[#FFF1E5] text-[#E7651A]",
  "نفذ المخزون": "bg-[#FDEAEA] text-[#D83232]",
};

const STOCK_DOT_STYLES = {
  متوفر: "bg-[#22C55E]",
  "مخزون منخفض": "bg-[#F97316]",
  "نفذ المخزون": "bg-[#EF4444]",
};

const SORT_OPTIONS = [
  "السعر: من الأقل للأعلى",
  "السعر: من الأعلى للأقل",
  "الاسم: أ-ي",
  "الاسم: ي-أ",
];

function SummaryCard({ item }) {
  const Icon = SUMMARY_ICONS[item.id] ?? Store;
  const style = SUMMARY_STYLES[item.tone] ?? SUMMARY_STYLES.navy;

  return (
    <article
      className={`min-h-[150px] rounded-xl border border-[#EEF0F3] border-l-[3px] ${style.accent} bg-white px-5 py-4 shadow-[0_1px_5px_rgba(15,23,42,0.04)]`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[#555B65]">{item.label}</p>
          <p className="mt-6 text-[25px] font-bold text-[#062454]">
            {item.value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${style.icon}`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
      </div>

      <p className={`mt-3 text-[10px] ${style.helper}`}>{item.helper}</p>
    </article>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative w-full sm:w-[170px]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-[#CDD2DA] bg-white py-2 pr-4 pl-9 text-right text-[12px] font-medium text-[#596579] outline-none transition-colors hover:border-[#AEB6C2] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
      >
        <option value="">{label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
        strokeWidth={2}
      />
    </div>
  );
}

function IconTooltipButton({
  tooltip,
  onClick,
  disabled,
  ariaLabel,
  className,
  children,
}) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </button>

      <span className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#062454] px-2 py-1 text-[10px] font-medium text-white group-hover:block">
        {tooltip}
      </span>
    </span>
  );
}

function TableQuantityControl({ product, quantity, onChange }) {
  const atMaximum = quantity >= product.availableQuantity;

  return (
    <div
      className="inline-flex h-8 items-center rounded-md border border-[#D8DDE6] bg-white"
      aria-label={`تعديل كمية ${product.name}`}
    >
      <button
        type="button"
        onClick={() => onChange(-1)}
        aria-label={`تقليل كمية ${product.name}`}
        className="flex h-full w-7 items-center justify-center text-[#596579] transition-colors hover:bg-[#F5F6F8]"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
      </button>

      <span className="flex h-full min-w-6 items-center justify-center border-x border-[#E3E6EB] px-1.5 text-[11px] font-bold text-[#20365A]">
        {quantity}
      </span>

      <button
        type="button"
        disabled={atMaximum}
        onClick={() => onChange(1)}
        aria-label={`زيادة كمية ${product.name}`}
        className="flex h-full w-7 items-center justify-center text-[#596579] transition-colors hover:bg-[#F5F6F8] disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

function ProductDetailsModal({ product, onClose }) {
  if (!product) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#00163B]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[520px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 shrink-0 rounded-xl border border-[#E0E4EA] object-cover"
            />
            <div className="min-w-0">
              <h2
                id="product-details-title"
                className="text-[17px] font-bold text-[#20365A]"
              >
                {product.name}
              </h2>
              <p className="mt-1 text-[10px] text-[#7A818D]" dir="ltr">
                SKU: {product.sku}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق تفاصيل المنتج"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#7A818D] transition-colors hover:bg-[#F3F5F8] hover:text-[#20365A]"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-[#E5E8EC] bg-[#FAFBFC] p-4 sm:grid-cols-2">
          <div>
            <dt className="text-[9px] text-[#8A9099]">المورد</dt>
            <dd className="mt-1 text-[12px] font-semibold text-[#40516C]">
              {product.supplier}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] text-[#8A9099]">الفئة</dt>
            <dd className="mt-1 text-[12px] font-semibold text-[#40516C]">
              {product.category}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] text-[#8A9099]">السعر</dt>
            <dd className="mt-1 text-[13px] font-bold text-[#062454]">
              ₪ {product.price.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] text-[#8A9099]">الكمية المتاحة</dt>
            <dd className="mt-1 text-[12px] font-semibold text-[#40516C]">
              {product.availableQuantity} {product.stockUnit}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 min-h-10 w-full rounded-lg bg-[#062454] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#0B356C]"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}

function PageButton({
  children,
  active = false,
  disabled = false,
  onClick,
  label,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={[
        "flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-[12px] font-semibold transition-colors",
        active
          ? "border-[#062454] bg-[#062454] text-white"
          : "border-[#D8DDE6] bg-white text-[#596579] hover:bg-[#F7F8FA]",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ProductsContent({ initialSearchTerm = "" }) {
  const {
    searchValue: topbarSearchValue = "",
    products = [],
    cartItems = [],
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
  } = useOutletContext() ?? {};
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showAlert = (message) => {
    Swal.fire({
      toast: true,
      position: "top-start",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      direction: "rtl",
    });
  };

  const filteredProducts = useMemo(() => {
    const localSearch = searchTerm.trim().toLowerCase();
    const topbarSearch = topbarSearchValue.trim().toLowerCase();

    return products.filter((product) => {
      const searchableValues = [
        product.name,
        product.sku,
        product.supplier,
        product.category,
      ].map((value) => value.toLowerCase());

      const matchesLocalSearch =
        localSearch === "" ||
        searchableValues.some((value) => value.includes(localSearch));

      const matchesTopbarSearch =
        topbarSearch === "" ||
        searchableValues.some((value) => value.includes(topbarSearch));

      const matchesCategory =
        categoryFilter === "" || product.category === categoryFilter;

      const matchesStockStatus =
        stockStatusFilter === "" || product.stockStatus === stockStatusFilter;

      return (
        matchesLocalSearch &&
        matchesTopbarSearch &&
        matchesCategory &&
        matchesStockStatus
      );
    });
  }, [products, searchTerm, topbarSearchValue, categoryFilter, stockStatusFilter]);

  const sortedProducts = useMemo(() => {
    if (!sortOption) {
      return filteredProducts;
    }

    const productsCopy = [...filteredProducts];

    switch (sortOption) {
      case "السعر: من الأقل للأعلى":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "السعر: من الأعلى للأقل":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "الاسم: أ-ي":
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      case "الاسم: ي-أ":
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name, "ar"));
      default:
        return productsCopy;
    }
  }, [filteredProducts, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const firstVisibleItem = sortedProducts.length === 0 ? 0 : startIndex + 1;
  const lastVisibleItem =
    sortedProducts.length === 0
      ? 0
      : Math.min(startIndex + PRODUCTS_PER_PAGE, sortedProducts.length);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleStockStatusChange = (value) => {
    setStockStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    if (product.stockStatus === "نفذ المخزون") {
      return;
    }

    addToCart?.(product);
    showAlert(`تمت إضافة ${product.name} إلى السلة`);
  };

  const handleQuantityChange = (product, currentQuantity, delta) => {
    const nextQuantity = currentQuantity + delta;

    if (nextQuantity <= 0) {
      removeCartItem?.(product.id);
      showAlert(`تم إزالة ${product.name} من السلة`);
      return;
    }

    updateCartItemQuantity?.(product.id, nextQuantity);
    showAlert(
      delta > 0
        ? `تم زيادة كمية ${product.name}`
        : `تم تقليل كمية ${product.name}`,
    );
  };

  return (
    <>
      <section
        dir="rtl"
        className="min-h-full bg-white px-4 py-5 sm:px-6 lg:px-7"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-5">
            <h1 className="text-[22px] font-bold text-[#062454] sm:text-[25px]">
              المنتجات
            </h1>
            <p className="mt-1.5 text-[12px] leading-6 text-[#6D7480]">
              تصفح المنتجات المتاحة من الموردين ومتابعة الأسعار والكميات
              المتوفرة.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {storeProductSummary.map((item) => (
              <SummaryCard key={item.id} item={item} />
            ))}
          </div>

          <section className="min-w-0 overflow-hidden rounded-xl border border-[#E1E4E9] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-3 border-b border-[#E6E8EC] px-4 py-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="w-full lg:max-w-[430px]">
                <div className="relative w-full">
                  <Search
                    aria-hidden="true"
                    className="absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#7A818D]"
                    strokeWidth={2}
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="ابحث بالاسم، SKU، المورد أو التصنيف..."
                    aria-label="البحث في المنتجات"
                    className="h-11 w-full rounded-lg border border-[#CDD2DA] bg-white pr-11 pl-10 text-right text-[12px] text-[#374151] outline-none transition-colors placeholder:text-[#9AA0AA] focus:border-[#40577B] focus:ring-2 focus:ring-[#40577B]/10"
                  />

                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      aria-label="مسح البحث"
                      className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[#7A818D] transition-colors hover:bg-[#F3F5F8] hover:text-[#20365A]"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  ) : (
                    <SlidersHorizontal
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A818D]"
                      strokeWidth={2}
                    />
                  )}
                </div>
              </div>

              <div className="flex w-full flex-nowrap gap-3 sm:flex-row lg:w-auto">
                <FilterSelect
                  label="كل الفئات"
                  value={categoryFilter}
                  options={storeProductCategories}
                  onChange={handleCategoryChange}
                />

                <FilterSelect
                  label="حالة المخزون"
                  value={stockStatusFilter}
                  options={storeStockStatuses}
                  onChange={handleStockStatusChange}
                />

                <FilterSelect
                  label="ترتيب حسب"
                  value={sortOption}
                  options={SORT_OPTIONS}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[900px] table-fixed text-right">
                <colgroup>
                  <col className="w-[29%]" />
                  <col className="w-[14%]" />
                  <col className="w-[20%]" />
                  <col className="w-[15%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                </colgroup>

                <thead>
                  <tr className="bg-[#F2F3F5] text-[#6D7480]">
                    <th className="px-5 py-3 text-right text-[11px] font-semibold">
                      المنتج
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold">
                      التصنيف
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold">
                      المورد
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold">
                      المخزون
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold">
                      السعر
                    </th>
                    <th className="px-3 py-3 text-center text-[11px] font-semibold">
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-14 text-center text-[12px] text-[#7A818D]"
                      >
                        لا توجد منتجات مطابقة للبحث أو خيارات التصفية.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => {
                      const cartItem = cartItems.find(
                        (item) => item.id === product.id,
                      );
                      const outOfStock = product.stockStatus === "نفذ المخزون";

                      return (
                        <tr
                          key={product.id}
                          className={[
                            "border-t border-[#E7E9ED] text-[12px] transition-colors hover:bg-[#FAFBFC]",
                            outOfStock ? "opacity-70" : "",
                          ].join(" ")}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className={[
                                  "h-11 w-11 shrink-0 rounded-lg border border-[#DDE1E7] object-cover",
                                  outOfStock ? "grayscale-[35%]" : "",
                                ].join(" ")}
                              />

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-[12px] font-bold leading-5 text-[#20365A]">
                                    {product.name}
                                  </p>
                                  {outOfStock && (
                                    <span className="shrink-0 rounded-full bg-[#FDEAEA] px-2 py-0.5 text-[8px] font-semibold text-[#D83232]">
                                      غير متوفر
                                    </span>
                                  )}
                                </div>
                                <p
                                  className="mt-0.5 text-[9px] text-[#7A818D]"
                                  dir="ltr"
                                >
                                  SKU: {product.sku}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-center text-[11px] font-medium text-[#30343A]">
                            {product.category}
                          </td>

                          <td className="px-4 py-3.5 text-center text-[11px] font-medium text-[#20365A]">
                            {product.supplier}
                          </td>

                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${STOCK_BADGE_STYLES[product.stockStatus]}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${STOCK_DOT_STYLES[product.stockStatus]}`}
                              />
                              {outOfStock
                                ? "نفذت الكمية"
                                : `${product.availableQuantity} ${product.stockUnit}`}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-3.5 text-center text-[13px] font-bold text-[#111827]">
                            ₪ {product.price.toFixed(2)}
                          </td>

                          <td className="px-3 py-3.5">
                            <div className="flex items-center justify-center gap-2">
                              <IconTooltipButton
                                tooltip="عرض التفاصيل"
                                onClick={() => setSelectedProduct(product)}
                                ariaLabel={`عرض تفاصيل ${product.name}`}
                                className="flex h-8 w-8 items-center justify-center rounded-md text-[#062454] transition-colors hover:bg-[#EEF3FA]"
                              >
                                <Eye className="h-4.5 w-4.5" strokeWidth={2} />
                              </IconTooltipButton>

                              {outOfStock ? (
                                <IconTooltipButton
                                  tooltip="المنتج غير متوفر"
                                  disabled
                                  ariaLabel={`${product.name} غير متوفر`}
                                  className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md text-[#B7BBC2] opacity-55"
                                >
                                  <ShoppingCart
                                    className="h-4.5 w-4.5"
                                    strokeWidth={2}
                                  />
                                </IconTooltipButton>
                              ) : cartItem ? (
                                <TableQuantityControl
                                  product={product}
                                  quantity={cartItem.quantity}
                                  onChange={(delta) =>
                                    handleQuantityChange(
                                      product,
                                      cartItem.quantity,
                                      delta,
                                    )
                                  }
                                />
                              ) : (
                                <IconTooltipButton
                                  tooltip="إضافة للسلة"
                                  onClick={() => handleAddToCart(product)}
                                  ariaLabel={`إضافة ${product.name} للسلة`}
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#B64B00] transition-colors hover:bg-[#FFF3EA]"
                                >
                                  <ShoppingCart
                                    className="h-4.5 w-4.5"
                                    strokeWidth={2}
                                  />
                                </IconTooltipButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#D7DBE2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-[#7A818D]">
                عرض {firstVisibleItem}-{lastVisibleItem} من أصل{" "}
                {sortedProducts.length} منتج
              </p>

              <div className="flex items-center gap-2" dir="ltr">
                <PageButton
                  label="الصفحة السابقة"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </PageButton>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <PageButton
                      key={pageNumber}
                      label={`الصفحة ${pageNumber}`}
                      active={safeCurrentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PageButton>
                  );
                })}

                <PageButton
                  label="الصفحة التالية"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </PageButton>
              </div>
            </div>
          </section>
        </div>
      </section>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

export default function Products() {
  const location = useLocation();

  return (
    <ProductsContent
      key={location.key}
      initialSearchTerm={location.state?.searchTerm ?? ""}
    />
  );
}
