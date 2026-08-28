// import { useEffect, useMemo, useState } from "react";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Package,
//   Pencil,
//   Search,
//   SlidersHorizontal,
//   Trash2,
//   X,
// } from "lucide-react";

// import Sidebar from "../../components/Sidebar";
// import Topbar from "../../components/Topbar";
// import { useAuth } from "../../context/AuthContext";
// import * as productService from "../../services/supplier/productService";

// const PRODUCTS_PER_PAGE = 5;

// const STOCK_STATUSES = [
//   "متوفر",
//   "مخزون منخفض",
//   "نفذ المخزون",
// ];

// const STOCK_STATUS_STYLES = {
//   متوفر: "bg-[#DDF8E8] text-[#15803D]",
//   "مخزون منخفض": "bg-[#FFF0E7] text-[#E7651A]",
//   "نفذ المخزون": "bg-[#FDE8E8] text-[#C62828]",
// };

// function FilterSelect({
//   label,
//   value,
//   options,
//   onChange,
// }) {
//   return (
//     <div className="relative min-w-[160px]">
//       <select
//         value={value}
//         onChange={(event) =>
//           onChange(event.target.value)
//         }
//         className="w-full appearance-none rounded-lg border border-[#C4C6D0] bg-white px-4 py-3 pr-10 text-sm text-[#44474F] outline-none transition-colors hover:bg-gray-50 focus:border-[#062454]"
//       >
//         <option value="">{label}</option>

//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
//         strokeWidth={2}
//       />
//     </div>
//   );
// }

// function ProductActionButton({
//   icon: Icon,
//   label,
//   onClick,
//   tone = "default",
// }) {
//   const styles =
//     tone === "danger"
//       ? "border-[#F0CACA] text-[#C62828] hover:bg-[#FDECEC]"
//       : "border-[#C4C6D0] text-[#747780] hover:bg-[#F4F6F8] hover:text-[#062454]";

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       title={label}
//       aria-label={label}
//       className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-white transition-colors ${styles}`}
//     >
//       <Icon
//         className="h-4 w-4"
//         strokeWidth={2}
//       />
//     </button>
//   );
// }

// function PageButton({
//   children,
//   active = false,
//   disabled = false,
//   onClick,
//   label,
// }) {
//   return (
//     <button
//       type="button"
//       disabled={disabled}
//       onClick={onClick}
//       aria-label={label}
//       className={
//         active
//           ? "flex h-9 min-w-9 items-center justify-center rounded-md bg-[#062454] px-2 text-sm font-bold text-white"
//           : "flex h-9 min-w-9 items-center justify-center rounded-md border border-[#C4C6D0] bg-white px-2 text-sm font-semibold text-[#44474F] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//       }
//     >
//       {children}
//     </button>
//   );
// }

// function ModalShell({
//   title,
//   children,
//   onClose,
//   maxWidth = "max-w-[520px]",
// }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//       dir="rtl"
//     >
//       <div
//         className={`w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl`}
//       >
//         <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
//           <h3 className="text-[17px] font-bold text-[#062454]">
//             {title}
//           </h3>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="إغلاق"
//             className="flex h-8 w-8 items-center justify-center rounded-lg text-[#747780] transition-colors hover:bg-[#F3F4F6] hover:text-[#062454]"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {children}
//       </div>
//     </div>
//   );
// }

// export default function Products() {
//   const { user } = useAuth();
//   const [localProducts, setLocalProducts] = useState([]);

//   const loadProducts = () => {
//     productService.fetchProducts({ per_page: 100 }).then((res) => {
//       const items = res.data?.data || (Array.isArray(res.data) ? res.data : []);
//       setLocalProducts(items.map((p) => ({
//         id: p.id,
//         name: p.name || "",
//         sku: p.sku || "",
//         category: p.category?.name || p.category || "",
//         price: Number(p.price || p.base_price || 0),
//         stockQuantity: Number(p.stock ?? p.stock_quantity ?? 0),
//         stockUnit: p.unit?.name || p.stock_unit || "وحدة",
//         stockStatus: (p.stock ?? p.stock_quantity ?? 0) > 10 ? "متوفر" : (p.stock ?? p.stock_quantity ?? 0) > 0 ? "مخزون منخفض" : "نفذ المخزون",
//       })));
//     }).catch(() => {});
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const [searchTerm, setSearchTerm] =
//     useState("");

//   const [
//     categoryFilter,
//     setCategoryFilter,
//   ] = useState("");

//   const [
//     stockStatusFilter,
//     setStockStatusFilter,
//   ] = useState("");

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   const [
//     selectedProduct,
//     setSelectedProduct,
//   ] = useState(null);

//   const [
//     editingProduct,
//     setEditingProduct,
//   ] = useState(null);

//   const [
//     deletingProduct,
//     setDeletingProduct,
//   ] = useState(null);

//   const [editForm, setEditForm] = useState({
//     name: "",
//     sku: "",
//     category: "",
//     price: "",
//     stockQuantity: "",
//     stockUnit: "",
//     stockStatus: "متوفر",
//   });

//   const [editError, setEditError] =
//     useState("");

//   const categories = useMemo(
//     () => [
//       ...new Set(
//         localProducts.map(
//           (product) => product.category,
//         ),
//       ),
//     ],
//     [localProducts],
//   );

//   const filteredProducts = useMemo(() => {
//     const normalizedSearch = searchTerm
//       .trim()
//       .toLowerCase();

//     return localProducts.filter((product) => {
//       const matchesSearch =
//         normalizedSearch === "" ||
//         product.name
//           .toLowerCase()
//           .includes(normalizedSearch) ||
//         product.sku
//           .toLowerCase()
//           .includes(normalizedSearch);

//       const matchesCategory =
//         categoryFilter === "" ||
//         product.category === categoryFilter;

//       const matchesStockStatus =
//         stockStatusFilter === "" ||
//         product.stockStatus ===
//           stockStatusFilter;

//       return (
//         matchesSearch &&
//         matchesCategory &&
//         matchesStockStatus
//       );
//     });
//   }, [
//     localProducts,
//     searchTerm,
//     categoryFilter,
//     stockStatusFilter,
//   ]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(
//       filteredProducts.length /
//         PRODUCTS_PER_PAGE,
//     ),
//   );

//   const safeCurrentPage = Math.min(
//     currentPage,
//     totalPages,
//   );

//   const startIndex =
//     (safeCurrentPage - 1) *
//     PRODUCTS_PER_PAGE;

//   const paginatedProducts =
//     filteredProducts.slice(
//       startIndex,
//       startIndex + PRODUCTS_PER_PAGE,
//     );

//   const firstVisibleItem =
//     filteredProducts.length === 0
//       ? 0
//       : startIndex + 1;

//   const lastVisibleItem =
//     filteredProducts.length === 0
//       ? 0
//       : Math.min(
//           startIndex + PRODUCTS_PER_PAGE,
//           filteredProducts.length,
//         );

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleCategoryChange = (value) => {
//     setCategoryFilter(value);
//     setCurrentPage(1);
//   };

//   const handleStockStatusChange = (
//     value,
//   ) => {
//     setStockStatusFilter(value);
//     setCurrentPage(1);
//   };

//   const handleOpenView = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleOpenEdit = (product) => {
//     setEditingProduct(product);

//     setEditForm({
//       name: product.name,
//       sku: product.sku,
//       category: product.category,
//       price: String(product.price),
//       stockQuantity: String(
//         product.stockQuantity,
//       ),
//       stockUnit: product.stockUnit,
//       stockStatus: product.stockStatus,
//     });

//     setEditError("");
//   };

//   const handleEditChange = (event) => {
//     const { name, value } = event.target;

//     setEditForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   };

//   const handleSaveEdit = (
//     event,
//   ) => {
//     event.preventDefault();

//     const name = editForm.name.trim();
//     const sku = editForm.sku.trim();
//     const category =
//       editForm.category.trim();
//     const stockUnit =
//       editForm.stockUnit.trim();

//     const price = Number(editForm.price);
//     const stockQuantity = Number(
//       editForm.stockQuantity,
//     );

//     if (
//       !name ||
//       !sku ||
//       !category ||
//       !stockUnit ||
//       !editForm.stockStatus
//     ) {
//       setEditError(
//         "يرجى تعبئة جميع الحقول المطلوبة.",
//       );
//       return;
//     }

//     if (
//       Number.isNaN(price) ||
//       price < 0
//     ) {
//       setEditError(
//         "يرجى إدخال سعر صحيح.",
//       );
//       return;
//     }

//     if (
//       Number.isNaN(stockQuantity) ||
//       stockQuantity < 0
//     ) {
//       setEditError(
//         "يرجى إدخال كمية مخزون صحيحة.",
//       );
//       return;
//     }

//     productService.updateProduct(editingProduct.id, {
//       name,
//       sku,
//       price,
//       stock: stockQuantity,
//       stock_unit: stockUnit,
//     }).then(() => {
//       loadProducts();
//       setEditingProduct(null);
//       setEditError("");
//       setCurrentPage(1);
//     }).catch(() => {
//       setEditError("حدث خطأ أثناء تحديث المنتج.");
//     });
//   };

//   const handleConfirmDelete = () => {
//     if (!deletingProduct) {
//       return;
//     }

//     productService.deleteProduct(deletingProduct.id).then(() => {
//       loadProducts();
//       setDeletingProduct(null);
//       setCurrentPage(1);
//     }).catch(() => {});
//   };

//   const summaryCards = [
//     {
//       label: "إجمالي المبيعات",
//       value: "18,450 ₪",
//       helper: "+12% عن الشهر الماضي",
//       accent: "border-l-[#062454]",
//     },
//     {
//       label: "إجمالي المنتجات",
//       value: "1,248",
//       helper: "+18% عن الشهر الماضي",
//       accent: "border-l-[#7ED7A1]",
//     },
//     {
//       label:
//         "المنتجات المتوفرة بالمخزون",
//       value: "86",
//       helper: "تغطية مخزون مستقرة",
//       accent: "border-l-[#7AB7C5]",
//     },
//     {
//       label: "المنتجات الأكثر طلباً",
//       value: "540",
//       helper: "وحدة مباعة",
//       accent: "border-l-[#F6A26B]",
//     },
//   ];

//   return (
//     <div
//       className="flex h-screen overflow-hidden bg-[#F5F6F8]"
//       dir="rtl"
//     >
//       <Sidebar />

//       <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
//         <div className="shrink-0">
//           <Topbar />
//         </div>

//         <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
//           {/* HEADER */}
//           <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
//             <div>
//               <h1 className="text-[28px] font-bold text-[#00163B] sm:text-[32px]">
//                 إدارة المنتجات والمخزون
//               </h1>

//               <p className="mt-2 text-sm text-[#64748B]">
//                 عرض ومتابعة مستويات
//                 المخزون والبيانات التشغيلية
//                 للمنتجات.
//               </p>
//             </div>
//           </div>

//           {/* SUMMARY */}
//           <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             {summaryCards.map((card) => (
//               <div
//                 key={card.label}
//                 className={`rounded-xl border-l-4 ${card.accent} bg-white p-5 shadow-sm`}
//               >
//                 <p className="text-sm text-[#44474F]">
//                   {card.label}
//                 </p>

//                 <p className="mt-4 text-2xl font-bold text-[#062454]">
//                   {card.value}
//                 </p>

//                 <p className="mt-3 text-xs text-[#64748B]">
//                   {card.helper}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* PRODUCTS */}
//           <section className="overflow-hidden rounded-xl bg-white shadow-sm">
//             {/* FILTERS */}
//             <div className="flex flex-col gap-4 border-b border-[#E5E7EB] p-4 lg:flex-row lg:items-center lg:justify-between">
//               <div className="relative w-full lg:max-w-md">
//                 <Search
//                   className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]"
//                   strokeWidth={2}
//                 />

//                 <input
//                   type="search"
//                   value={searchTerm}
//                   onChange={
//                     handleSearchChange
//                   }
//                   placeholder="بحث باسم المنتج أو SKU..."
//                   className="w-full rounded-lg border border-[#C4C6D0] bg-white py-3 pr-11 pl-10 text-sm text-[#44474F] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#062454]"
//                 />

//                 <SlidersHorizontal
//                   className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
//                   strokeWidth={2}
//                 />
//               </div>

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <FilterSelect
//                   label="كل الفئات"
//                   value={categoryFilter}
//                   options={categories}
//                   onChange={
//                     handleCategoryChange
//                   }
//                 />

//                 <FilterSelect
//                   label="حالة المخزون"
//                   value={stockStatusFilter}
//                   options={STOCK_STATUSES}
//                   onChange={
//                     handleStockStatusChange
//                   }
//                 />
//               </div>
//             </div>

//             {/* TABLE */}
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[980px] text-right">
//                 <thead>
//                   <tr className="bg-[#062454] text-white">
//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       صورة المنتج
//                     </th>

//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       المنتج
//                     </th>

//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       رقم SKU
//                     </th>

//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       الفئة
//                     </th>

//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       السعر
//                     </th>

//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       الكمية
//                     </th>

//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       الحالة
//                     </th>

//                     <th className="px-5 py-4 text-center text-sm font-bold">
//                       إجراءات
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {paginatedProducts.length ===
//                   0 ? (
//                     <tr>
//                       <td
//                         colSpan={8}
//                         className="px-6 py-12 text-center text-sm text-[#64748B]"
//                       >
//                         لا توجد منتجات مطابقة
//                         لخيارات البحث أو
//                         التصفية.
//                       </td>
//                     </tr>
//                   ) : (
//                     paginatedProducts.map(
//                       (product) => (
//                         <tr
//                           key={product.id}
//                           className="border-b border-[#E5E7EB] transition-colors last:border-b-0 hover:bg-[#FAFAFA]"
//                         >
//                           <td className="px-5 py-4">
//                             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#F0F2F5] text-[#062454]">
//                               <Package
//                                 className="h-6 w-6"
//                                 strokeWidth={
//                                   1.8
//                                 }
//                               />
//                             </div>
//                           </td>

//                           <td className="whitespace-nowrap px-5 py-4 text-center text-sm font-semibold text-[#111827]">
//                             {product.name}
//                           </td>

//                           <td
//                             className="whitespace-nowrap px-5 py-4 text-center text-sm text-[#747780]"
//                             dir="ltr"
//                           >
//                             {product.sku}
//                           </td>

//                           <td className="whitespace-nowrap px-5 py-4 text-center text-sm font-semibold text-[#111827]">
//                             {product.category}
//                           </td>

//                           <td className="whitespace-nowrap px-5 py-4 text-center text-sm font-bold text-[#111827]">
//                             {product.price} ₪
//                           </td>

//                           <td className="whitespace-nowrap px-5 py-4 text-center text-sm text-[#111827]">
//                             {
//                               product.stockQuantity
//                             }{" "}
//                             {product.stockUnit}
//                           </td>

//                           <td className="whitespace-nowrap px-5 py-4 text-center">
//                             <span
//                               className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
//                                 STOCK_STATUS_STYLES[
//                                   product
//                                     .stockStatus
//                                 ]
//                               }`}
//                             >
//                               {
//                                 product.stockStatus
//                               }
//                             </span>
//                           </td>

//                           <td className="px-5 py-4">
//                             <div className="flex items-center justify-center gap-2">
//                               {/* VIEW */}
//                               <ProductActionButton
//                                 icon={Eye}
//                                 label="عرض المنتج"
//                                 onClick={() =>
//                                   handleOpenView(
//                                     product,
//                                   )
//                                 }
//                               />

//                               {/* EDIT */}
//                               <ProductActionButton
//                                 icon={Pencil}
//                                 label="تعديل المنتج"
//                                 onClick={() =>
//                                   handleOpenEdit(
//                                     product,
//                                   )
//                                 }
//                               />

//                               {/* DELETE */}
//                               <ProductActionButton
//                                 icon={Trash2}
//                                 label="حذف المنتج"
//                                 tone="danger"
//                                 onClick={() =>
//                                   setDeletingProduct(
//                                     product,
//                                   )
//                                 }
//                               />
//                             </div>
//                           </td>
//                         </tr>
//                       ),
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* PAGINATION */}
//             <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-[#F3F4F5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//               <p className="text-sm text-[#64748B]">
//                 عرض {firstVisibleItem} إلى{" "}
//                 {lastVisibleItem} من أصل{" "}
//                 {filteredProducts.length} منتج
//               </p>

//               <div className="flex flex-wrap items-center gap-2">
//                 <PageButton
//                   label="الصفحة السابقة"
//                   disabled={
//                     safeCurrentPage === 1
//                   }
//                   onClick={() =>
//                     setCurrentPage((page) =>
//                       Math.max(1, page - 1),
//                     )
//                   }
//                 >
//                   <ChevronRight
//                     className="h-4 w-4"
//                     strokeWidth={2}
//                   />
//                 </PageButton>

//                 {Array.from(
//                   { length: totalPages },
//                   (_, index) => {
//                     const pageNumber =
//                       index + 1;

//                     return (
//                       <PageButton
//                         key={pageNumber}
//                         label={`الصفحة ${pageNumber}`}
//                         active={
//                           safeCurrentPage ===
//                           pageNumber
//                         }
//                         onClick={() =>
//                           setCurrentPage(
//                             pageNumber,
//                           )
//                         }
//                       >
//                         {pageNumber}
//                       </PageButton>
//                     );
//                   },
//                 )}

//                 <PageButton
//                   label="الصفحة التالية"
//                   disabled={
//                     safeCurrentPage ===
//                     totalPages
//                   }
//                   onClick={() =>
//                     setCurrentPage((page) =>
//                       Math.min(
//                         totalPages,
//                         page + 1,
//                       ),
//                     )
//                   }
//                 >
//                   <ChevronLeft
//                     className="h-4 w-4"
//                     strokeWidth={2}
//                   />
//                 </PageButton>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>

//       {/* VIEW PRODUCT */}
//       {selectedProduct && (
//         <ModalShell
//           title="تفاصيل المنتج"
//           onClose={() =>
//             setSelectedProduct(null)
//           }
//         >
//           <div className="overflow-y-auto px-5 py-5">
//             <div className="mb-5 flex justify-center">
//               <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#F0F2F5] text-[#062454]">
//                 <Package
//                   className="h-9 w-9"
//                   strokeWidth={1.8}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <p className="text-xs text-[#8A9099]">
//                   اسم المنتج
//                 </p>

//                 <p className="mt-1 text-sm font-semibold text-[#111827]">
//                   {selectedProduct.name}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-[#8A9099]">
//                   رقم SKU
//                 </p>

//                 <p
//                   className="mt-1 text-sm font-semibold text-[#111827]"
//                   dir="ltr"
//                 >
//                   {selectedProduct.sku}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-[#8A9099]">
//                   الفئة
//                 </p>

//                 <p className="mt-1 text-sm font-semibold text-[#111827]">
//                   {
//                     selectedProduct.category
//                   }
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-[#8A9099]">
//                   السعر
//                 </p>

//                 <p className="mt-1 text-sm font-semibold text-[#111827]">
//                   {selectedProduct.price} ₪
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-[#8A9099]">
//                   الكمية
//                 </p>

//                 <p className="mt-1 text-sm font-semibold text-[#111827]">
//                   {
//                     selectedProduct.stockQuantity
//                   }{" "}
//                   {selectedProduct.stockUnit}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-[#8A9099]">
//                   حالة المخزون
//                 </p>

//                 <span
//                   className={`mt-2 inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
//                     STOCK_STATUS_STYLES[
//                       selectedProduct
//                         .stockStatus
//                     ]
//                   }`}
//                 >
//                   {
//                     selectedProduct.stockStatus
//                   }
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
//             <button
//               type="button"
//               onClick={() =>
//                 setSelectedProduct(null)
//               }
//               className="w-full rounded-lg bg-[#062454] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A316D]"
//             >
//               إغلاق
//             </button>
//           </div>
//         </ModalShell>
//       )}

//       {/* EDIT PRODUCT */}
//       {editingProduct && (
//         <ModalShell
//           title="تعديل المنتج"
//           onClose={() => {
//             setEditingProduct(null);
//             setEditError("");
//           }}
//           maxWidth="max-w-[620px]"
//         >
//           <form onSubmit={handleSaveEdit}>
//             <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
//               {editError && (
//                 <div className="mb-4 rounded-lg border border-[#F0BABA] bg-[#FDECEC] px-4 py-3 text-sm text-[#C62828]">
//                   {editError}
//                 </div>
//               )}

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <label className="block">
//                   <span className="mb-2 block text-sm font-semibold text-[#374151]">
//                     اسم المنتج
//                   </span>

//                   <input
//                     name="name"
//                     value={editForm.name}
//                     onChange={
//                       handleEditChange
//                     }
//                     className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="mb-2 block text-sm font-semibold text-[#374151]">
//                     SKU
//                   </span>

//                   <input
//                     name="sku"
//                     value={editForm.sku}
//                     onChange={
//                       handleEditChange
//                     }
//                     dir="ltr"
//                     className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="mb-2 block text-sm font-semibold text-[#374151]">
//                     الفئة
//                   </span>

//                   <input
//                     name="category"
//                     value={
//                       editForm.category
//                     }
//                     onChange={
//                       handleEditChange
//                     }
//                     className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="mb-2 block text-sm font-semibold text-[#374151]">
//                     السعر
//                   </span>

//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     name="price"
//                     value={editForm.price}
//                     onChange={
//                       handleEditChange
//                     }
//                     className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="mb-2 block text-sm font-semibold text-[#374151]">
//                     الكمية
//                   </span>

//                   <input
//                     type="number"
//                     min="0"
//                     name="stockQuantity"
//                     value={
//                       editForm.stockQuantity
//                     }
//                     onChange={
//                       handleEditChange
//                     }
//                     className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="mb-2 block text-sm font-semibold text-[#374151]">
//                     وحدة المخزون
//                   </span>

//                   <input
//                     name="stockUnit"
//                     value={
//                       editForm.stockUnit
//                     }
//                     onChange={
//                       handleEditChange
//                     }
//                     className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
//                   />
//                 </label>

//                 <label className="block sm:col-span-2">
//                   <span className="mb-2 block text-sm font-semibold text-[#374151]">
//                     حالة المخزون
//                   </span>

//                   <select
//                     name="stockStatus"
//                     value={
//                       editForm.stockStatus
//                     }
//                     onChange={
//                       handleEditChange
//                     }
//                     className="w-full rounded-lg border border-[#C4C6D0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
//                   >
//                     {STOCK_STATUSES.map(
//                       (status) => (
//                         <option
//                           key={status}
//                           value={status}
//                         >
//                           {status}
//                         </option>
//                       ),
//                     )}
//                   </select>
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingProduct(null);
//                   setEditError("");
//                 }}
//                 className="rounded-lg border border-[#C4C6D0] bg-white px-5 py-2.5 text-sm font-semibold text-[#596579]"
//               >
//                 إلغاء
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-lg bg-[#062454] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A316D]"
//               >
//                 حفظ التعديلات
//               </button>
//             </div>
//           </form>
//         </ModalShell>
//       )}

//       {/* DELETE CONFIRMATION */}
//       {deletingProduct && (
//         <ModalShell
//           title="حذف المنتج"
//           onClose={() =>
//             setDeletingProduct(null)
//           }
//           maxWidth="max-w-[440px]"
//         >
//           <div className="px-5 py-6 text-center">
//             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC] text-[#C62828]">
//               <Trash2 className="h-5 w-5" />
//             </div>

//             <p className="text-[15px] font-semibold text-[#111827]">
//               هل أنت متأكد من حذف هذا
//               المنتج؟
//             </p>

//             <p className="mt-2 text-sm text-[#64748B]">
//               {deletingProduct.name}
//             </p>
//           </div>

//           <div className="flex justify-center gap-3 border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
//             <button
//               type="button"
//               onClick={() =>
//                 setDeletingProduct(null)
//               }
//               className="min-w-[100px] rounded-lg border border-[#C4C6D0] bg-white px-5 py-2.5 text-sm font-semibold text-[#596579]"
//             >
//               إلغاء
//             </button>

//             <button
//               type="button"
//               onClick={
//                 handleConfirmDelete
//               }
//               className="min-w-[100px] rounded-lg bg-[#C62828] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A91F1F]"
//             >
//               حذف
//             </button>
//           </div>
//         </ModalShell>
//       )}
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useAuth } from "../../context/AuthContext";
import * as productService from "../../services/supplier/productService";

const PRODUCTS_PER_PAGE = 10;

const STOCK_STATUSES = [
  "متوفر",
  "مخزون منخفض",
  "نفذ المخزون",
];

const STOCK_STATUS_STYLES = {
  متوفر: "bg-[#DDF8E8] text-[#15803D]",
  "مخزون منخفض": "bg-[#FFF0E7] text-[#E7651A]",
  "نفذ المخزون": "bg-[#FDE8E8] text-[#C62828]",
};

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative min-w-[160px]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-lg border border-[#C4C6D0] bg-white px-4 py-3 pr-10 text-sm text-[#44474F] outline-none transition-colors hover:bg-gray-50 focus:border-[#062454]"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
        strokeWidth={2}
      />
    </div>
  );
}

function ProductActionButton({ icon: Icon, label, onClick, tone = "default" }) {
  const styles =
    tone === "danger"
      ? "border-[#F0CACA] text-[#C62828] hover:bg-[#FDECEC]"
      : "border-[#C4C6D0] text-[#747780] hover:bg-[#F4F6F8] hover:text-[#062454]";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-white transition-colors ${styles}`}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}

function PageButton({ children, active = false, disabled = false, onClick, label }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={
        active
          ? "flex h-9 min-w-9 items-center justify-center rounded-md bg-[#062454] px-2 text-sm font-bold text-white"
          : "flex h-9 min-w-9 items-center justify-center rounded-md border border-[#C4C6D0] bg-white px-2 text-sm font-semibold text-[#44474F] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {children}
    </button>
  );
}

function ModalShell({ title, children, onClose, maxWidth = "max-w-[520px]" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" dir="rtl">
      <div className={`w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h3 className="text-[17px] font-bold text-[#062454]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#747780] transition-colors hover:bg-[#F3F4F6] hover:text-[#062454]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Products() {
  const { user } = useAuth();
  const [localProducts, setLocalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    productService
      .fetchProducts({ per_page: 100 })
      .then((res) => {
        const items = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setLocalProducts(
          items.map((p) => {
            const stock = Number(p.stock ?? p.stock_quantity ?? 0);
            let imagePath = p.image?.path || p.image_url || "";
            if (imagePath && !imagePath.startsWith("http")) {
              imagePath = `http://127.0.0.1:8000/${imagePath}`;
            }

            return {
              id: p.id,
              name: p.name || "",
              description: p.description || "",
              category_id: p.category_id,
              category: p.category?.name || p.category || "عام",
              price: Number(p.price || 0),
              salePrice: p.sale_price ? Number(p.sale_price) : null,
              stockQuantity: stock,
              stockUnit: p.unit?.name || p.stock_unit || "قطعة",
              stockStatus: stock > 10 ? "متوفر" : stock > 0 ? "مخزون منخفض" : "نفذ المخزون",
              image: imagePath,
            };
          })
        );
      })
      .catch((err) => {
        console.error("Error loading products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
  });
  const [editError, setEditError] = useState("");

  const categories = useMemo(
    () => [...new Set(localProducts.map((product) => product.category))],
    [localProducts]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return localProducts.filter((product) => {
      const matchesSearch =
        normalizedSearch === "" ||
        product.name.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "" || product.category === categoryFilter;

      const matchesStockStatus =
        stockStatusFilter === "" || product.stockStatus === stockStatusFilter;

      return matchesSearch && matchesCategory && matchesStockStatus;
    });
  }, [localProducts, searchTerm, categoryFilter, stockStatusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const firstVisibleItem = filteredProducts.length === 0 ? 0 : startIndex + 1;
  const lastVisibleItem =
    filteredProducts.length === 0
      ? 0
      : Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length);

  // إحصائيات حقيقية مبنية على المنتجات الحقيقية
  const totalProductsCount = localProducts.length;
  const inStockCount = localProducts.filter((p) => p.stockQuantity > 0).length;
  const lowOrOutOfStockCount = localProducts.filter((p) => p.stockQuantity <= 10).length;
  const totalInventoryValue = localProducts.reduce(
    (sum, p) => sum + p.price * p.stockQuantity,
    0
  );

  const summaryCards = [
    {
      label: "إجمالي المنتجات",
      value: `${totalProductsCount} منتج`,
      helper: "إجمالي قائمة بضائعك المضافة",
      accent: "border-l-[#062454]",
    },
    {
      label: "المنتجات المتوفرة",
      value: `${inStockCount} متوفر`,
      helper: "جاهزة للطلب الفوري",
      accent: "border-l-[#7ED7A1]",
    },
    {
      label: "مخزون منخفض / نفذ",
      value: `${lowOrOutOfStockCount} منتج`,
      helper: "تحتاج إلى إعادة تزويد",
      accent: "border-l-[#F6A26B]",
    },
    {
      label: "قيمة المخزون التقديرية",
      value: `${totalInventoryValue.toLocaleString()} ₪`,
      helper: "إجمالي قيمة بضائعك الحالية",
      accent: "border-l-[#7AB7C5]",
    },
  ];

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
    });
    setEditError("");
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const price = Number(editForm.price);
    const stockQuantity = Number(editForm.stockQuantity);

    if (!editForm.name.trim()) {
      setEditError("يرجى إدخال اسم المنتج.");
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      setEditError("يرجى إدخال سعر صحيح.");
      return;
    }

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      setEditError("يرجى إدخال كمية صحيحة.");
      return;
    }

    productService
      .updateProduct(editingProduct.id, {
        name: editForm.name.trim(),
        description: editForm.description,
        price,
        stock_quantity: stockQuantity,
        category_id: editingProduct.category_id || 1,
        unit_id: 1,
      })
      .then(() => {
        loadProducts();
        setEditingProduct(null);
        setEditError("");
      })
      .catch((err) => {
        setEditError(err.response?.data?.message || "حدث خطأ أثناء تحديث المنتج.");
      });
  };

  const handleConfirmDelete = () => {
    if (!deletingProduct) return;

    productService
      .deleteProduct(deletingProduct.id)
      .then(() => {
        loadProducts();
        setDeletingProduct(null);
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
      });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6F8]" dir="rtl">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-[#00163B] sm:text-[32px]">
                إدارة المنتجات والمخزون
              </h1>
              <p className="mt-2 text-sm text-[#64748B]">
                عرض ومتابعة مستويات المخزون والبيانات الحقيقية لمنتجاتك.
              </p>
            </div>

            {/* ADD PRODUCT BUTTON */}
            <Link
              to="/products/add"
              className="flex items-center gap-2 rounded-xl bg-[#2F67EB] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2458D8]"
            >
              <Plus size={18} />
              إضافة منتج جديد
            </Link>
          </div>

          {/* SUMMARY CARDS (بيانات حقيقية محسوبة) */}
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-xl border-l-4 ${card.accent} bg-white p-5 shadow-sm`}
              >
                <p className="text-sm text-[#44474F]">{card.label}</p>
                <p className="mt-4 text-2xl font-bold text-[#062454]">{card.value}</p>
                <p className="mt-3 text-xs text-[#64748B]">{card.helper}</p>
              </div>
            ))}
          </div>

          {/* PRODUCTS TABLE */}
          <section className="overflow-hidden rounded-xl bg-white shadow-sm">
            {/* FILTERS */}
            <div className="flex flex-col gap-4 border-b border-[#E5E7EB] p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search
                  className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]"
                  strokeWidth={2}
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="بحث باسم المنتج..."
                  className="w-full rounded-lg border border-[#C4C6D0] bg-white py-3 pr-11 pl-10 text-sm text-[#44474F] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#062454]"
                />
                <SlidersHorizontal
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
                  strokeWidth={2}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <FilterSelect
                  label="كل الفئات"
                  value={categoryFilter}
                  options={categories}
                  onChange={(val) => {
                    setCategoryFilter(val);
                    setCurrentPage(1);
                  }}
                />
                <FilterSelect
                  label="حالة المخزون"
                  value={stockStatusFilter}
                  options={STOCK_STATUSES}
                  onChange={(val) => {
                    setStockStatusFilter(val);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* TABLE CONTENT */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-right">
                <thead>
                  <tr className="bg-[#062454] text-white">
                    <th className="px-5 py-4 text-center text-sm font-bold">صورة المنتج</th>
                    <th className="px-5 py-4 text-center text-sm font-bold">اسم المنتج</th>
                    <th className="px-5 py-4 text-center text-sm font-bold">الفئة</th>
                    <th className="px-5 py-4 text-center text-sm font-bold">السعر</th>
                    <th className="px-5 py-4 text-center text-sm font-bold">الكمية المتوفرة</th>
                    <th className="px-5 py-4 text-center text-sm font-bold">الحالة</th>
                    <th className="px-5 py-4 text-center text-sm font-bold">إجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#64748B]">
                        جاري تحميل المنتجات من السيرفر...
                      </td>
                    </tr>
                  ) : paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#64748B]">
                        لا توجد منتجات مضافة بعد. اضغط على "إضافة منتج جديد" للبدء.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#E5E7EB] transition-colors last:border-b-0 hover:bg-[#FAFAFA]"
                      >
                        <td className="px-5 py-4">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-[#F0F2F5] text-[#062454]">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6" strokeWidth={1.8} />
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-center text-sm font-semibold text-[#111827]">
                          {product.name}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-center text-sm font-semibold text-[#111827]">
                          {product.category}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-center text-sm font-bold text-[#111827]">
                          {product.price} ₪
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-center text-sm text-[#111827]">
                          {product.stockQuantity} {product.stockUnit}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-center">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
                              STOCK_STATUS_STYLES[product.stockStatus]
                            }`}
                          >
                            {product.stockStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <ProductActionButton
                              icon={Eye}
                              label="عرض التفاصيل"
                              onClick={() => setSelectedProduct(product)}
                            />
                            <ProductActionButton
                              icon={Pencil}
                              label="تعديل المنتج"
                              onClick={() => handleOpenEdit(product)}
                            />
                            <ProductActionButton
                              icon={Trash2}
                              label="حذف المنتج"
                              tone="danger"
                              onClick={() => setDeletingProduct(product)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-[#F3F4F5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748B]">
                عرض {firstVisibleItem} إلى {lastVisibleItem} من أصل {filteredProducts.length} منتج
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <PageButton
                  label="السابق"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </PageButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <PageButton
                    key={pageNumber}
                    label={`صفحة ${pageNumber}`}
                    active={safeCurrentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PageButton>
                ))}

                <PageButton
                  label="التالي"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PageButton>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* VIEW MODAL */}
      {selectedProduct && (
        <ModalShell title="تفاصيل المنتج" onClose={() => setSelectedProduct(null)}>
          <div className="overflow-y-auto px-5 py-5">
            <div className="mb-5 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-[#F0F2F5] text-[#062454]">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-9 w-9" strokeWidth={1.8} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#8A9099]">اسم المنتج</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{selectedProduct.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A9099]">الفئة</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{selectedProduct.category}</p>
              </div>
              <div>
                <p className="text-xs text-[#8A9099]">السعر</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{selectedProduct.price} ₪</p>
              </div>
              <div>
                <p className="text-xs text-[#8A9099]">الكمية المتوفرة</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">
                  {selectedProduct.stockQuantity} {selectedProduct.stockUnit}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-[#8A9099]">الوصف</p>
                <p className="mt-1 text-sm text-[#4B5563]">
                  {selectedProduct.description || "لا يوجد وصف."}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="w-full rounded-lg bg-[#062454] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A316D]"
            >
              إغلاق
            </button>
          </div>
        </ModalShell>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <ModalShell
          title="تعديل المنتج"
          onClose={() => {
            setEditingProduct(null);
            setEditError("");
          }}
          maxWidth="max-w-[620px]"
        >
          <form onSubmit={handleSaveEdit}>
            <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
              {editError && (
                <div className="mb-4 rounded-lg border border-[#F0BABA] bg-[#FDECEC] px-4 py-3 text-sm text-[#C62828]">
                  {editError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">اسم المنتج</label>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm((c) => ({ ...c, name: e.target.value }))}
                    className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">السعر (شيكل)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={editForm.price}
                    onChange={(e) => setEditForm((c) => ({ ...c, price: e.target.value }))}
                    className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">الكمية المتوفرة</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={editForm.stockQuantity}
                    onChange={(e) => setEditForm((c) => ({ ...c, stockQuantity: e.target.value }))}
                    className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">الوصف</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm((c) => ({ ...c, description: e.target.value }))}
                    className="w-full rounded-lg border border-[#C4C6D0] px-3 py-2.5 text-sm outline-none focus:border-[#062454]"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setEditError("");
                }}
                className="rounded-lg border border-[#C4C6D0] bg-white px-5 py-2.5 text-sm font-semibold text-[#596579]"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#062454] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A316D]"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* DELETE MODAL */}
      {deletingProduct && (
        <ModalShell
          title="حذف المنتج"
          onClose={() => setDeletingProduct(null)}
          maxWidth="max-w-[440px]"
        >
          <div className="px-5 py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC] text-[#C62828]">
              <Trash2 className="h-5 w-5" />
            </div>
            <p className="text-[15px] font-semibold text-[#111827]">
              هل أنت متأكد من حذف هذا المنتج؟
            </p>
            <p className="mt-2 text-sm text-[#64748B]">{deletingProduct.name}</p>
          </div>

          <div className="flex justify-center gap-3 border-t border-[#E5E7EB] bg-[#F8F9FA] px-5 py-4">
            <button
              type="button"
              onClick={() => setDeletingProduct(null)}
              className="min-w-[100px] rounded-lg border border-[#C4C6D0] bg-white px-5 py-2.5 text-sm font-semibold text-[#596579]"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="min-w-[100px] rounded-lg bg-[#C62828] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A91F1F]"
            >
              حذف
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
