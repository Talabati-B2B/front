import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Minus,
  PackageCheck,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

function QuantityControl({ item, onChange }) {
  const atMinimum = item.quantity <= 1;
  const atMaximum = item.quantity >= item.availableQuantity;

  return (
    <div
      className="inline-flex h-10 items-center overflow-hidden rounded-lg border border-[#D8DDE6] bg-white"
      aria-label={`تعديل كمية ${item.name}`}
    >
      <button
        type="button"
        disabled={atMinimum}
        onClick={() => onChange(item.id, item.quantity - 1)}
        aria-label={`تقليل كمية ${item.name}`}
        className="flex h-full w-10 items-center justify-center text-[#596579] transition-colors hover:bg-[#F5F6F8] disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Minus className="h-4 w-4" strokeWidth={2} />
      </button>

      <span className="flex h-full min-w-12 items-center justify-center border-x border-[#E3E6EB] px-3 text-[13px] font-bold text-[#20365A]">
        {item.quantity}
      </span>

      <button
        type="button"
        disabled={atMaximum}
        onClick={() => onChange(item.id, item.quantity + 1)}
        aria-label={`زيادة كمية ${item.name}`}
        className="flex h-full w-10 items-center justify-center text-[#596579] transition-colors hover:bg-[#F5F6F8] disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function CartItem({ item, onQuantityChange, onRemove }) {
  const subtotal = item.price * item.quantity;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 border-t border-[#E7E9ED] px-4 py-4 lg:grid-cols-[minmax(230px,1fr)_100px_140px_100px_44px] lg:items-center lg:gap-3 lg:px-5">
      <div className="flex min-w-[220px] items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-14 w-14 shrink-0 rounded-lg border border-[#DDE1E7] object-cover"
        />

        <div className="min-w-0">
          <h3 className="text-[13px] font-bold leading-5 text-[#20365A]">
            {item.name}
          </h3>
          <p className="mt-1 whitespace-nowrap text-[10px] text-[#7A818D]" dir="ltr">
            SKU: {item.sku}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-1 text-[10px] text-[#8A9099] lg:hidden">سعر الوحدة</p>
        <p className="whitespace-nowrap text-[13px] font-bold text-[#111827]">
          ₪ {item.price.toFixed(2)}
        </p>
      </div>

      <div>
        <p className="mb-1 text-[10px] text-[#8A9099] lg:hidden">الكمية</p>
        <QuantityControl item={item} onChange={onQuantityChange} />
        <p className="mt-1 text-[9px] text-[#8A9099]">
          المتاح: {item.availableQuantity} {item.stockUnit}
        </p>
      </div>

      <div>
        <p className="mb-1 text-[10px] text-[#8A9099] lg:hidden">الإجمالي</p>
        <p className="whitespace-nowrap text-[13px] font-bold text-[#062454]">
          ₪ {subtotal.toFixed(2)}
        </p>
      </div>

      <div className="flex lg:justify-center">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`حذف ${item.name} من السلة`}
          title="حذف من السلة"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#D83232] transition-colors hover:bg-[#FFF0F0]"
        >
          <Trash2 className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems = [],
    updateCartItemQuantity,
    removeCartItem,
    createOrdersFromCart,
    setSearchValue,
  } = useOutletContext() ?? {};

  const supplierGroups = useMemo(() => {
    const groups = new Map();

    cartItems.forEach((item) => {
      const supplierId = item.supplierId ?? item.supplier;
      const supplier = item.supplierName || item.supplier || "مورد";

      if (!groups.has(String(supplierId))) {
        groups.set(String(supplierId), { supplierId, supplier, items: [] });
      }

      groups.get(String(supplierId)).items.push(item);
    });

    return Array.from(groups.values());
  }, [cartItems]);

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  const totalUnits = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  if (cartItems.length === 0) {
    return (
      <section
        dir="rtl"
        className="min-h-full bg-white px-4 py-5 sm:px-6 lg:px-7"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-5">
            <h1 className="text-[22px] font-bold text-[#062454] sm:text-[25px]">
              السلة
            </h1>
            <p className="mt-1.5 text-[12px] leading-6 text-[#6D7480]">
              راجع المنتجات التي اخترتها قبل إنشاء الطلب.
            </p>
          </div>

          <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[#E1E4E9] bg-white px-6 py-12 shadow-[0_1px_5px_rgba(15,23,42,0.04)]">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F5F8] text-[#40577B]">
                <ShoppingCart className="h-7 w-7" strokeWidth={1.8} />
              </div>
              <h2 className="mt-4 text-[17px] font-bold text-[#20365A]">
                السلة فارغة
              </h2>
              <p className="mt-2 text-[12px] leading-6 text-[#7A818D]">
                أضف منتجات من صفحة المنتجات لتظهر هنا.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" className="min-h-full bg-white px-4 py-5 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mb-5">
          <h1 className="text-[22px] font-bold text-[#062454] sm:text-[25px]">
            السلة
          </h1>
          <p className="mt-1.5 text-[12px] leading-6 text-[#6D7480]">
            راجع المنتجات والكميات المختارة من الموردين قبل إنشاء الطلب.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="min-w-0 space-y-4">
            {supplierGroups.map((group) => (
              <section
                key={String(group.supplierId)}
                className="min-w-0 overflow-hidden rounded-xl border border-[#E1E4E9] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-center gap-3 px-4 py-4 lg:px-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF1F5] text-[#40577B]">
                    <PackageCheck className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#8A9099]">المورد</p>
                    <h2 className="truncate text-[14px] font-bold text-[#20365A]">
                      {group.supplier}
                    </h2>
                  </div>
                </div>

                <div className="hidden grid-cols-[minmax(230px,1fr)_100px_140px_100px_44px] gap-3 border-t border-[#E7E9ED] bg-[#F5F6F8] px-5 py-2.5 text-[10px] font-semibold text-[#6D7480] lg:grid">
                  <span>المنتج</span>
                  <span>سعر الوحدة</span>
                  <span>الكمية</span>
                  <span>الإجمالي</span>
                  <span />
                </div>

                {group.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={updateCartItemQuantity}
                    onRemove={removeCartItem}
                  />
                ))}
              </section>
            ))}
          </div>

          <aside className="rounded-xl border border-[#E1E4E9] bg-white p-5 shadow-[0_1px_5px_rgba(15,23,42,0.04)] xl:sticky xl:top-5">
            <h2 className="text-[17px] font-bold text-[#062454]">ملخص السلة</h2>

            <div className="mt-5 space-y-4 border-b border-[#E7E9ED] pb-5">
              <div className="flex items-center justify-between gap-4 text-[12px]">
                <span className="text-[#6D7480]">عدد الوحدات</span>
                <span className="font-bold text-[#20365A]">{totalUnits}</span>
              </div>

              <div className="flex items-center justify-between gap-4 text-[12px]">
                <span className="text-[#6D7480]">عدد الموردين</span>
                <span className="font-bold text-[#20365A]">
                  {supplierGroups.length}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 py-5">
              <span className="text-[13px] font-semibold text-[#555B65]">
                الإجمالي
              </span>
              <span className="text-[22px] font-bold text-[#062454]">
                ₪ {cartTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                const createdOrders = createOrdersFromCart?.() ?? [];
                if (createdOrders.length > 0) {
                  setSearchValue?.("");
                  navigate("/store/orders", {
                    state: {
                      orderNumber: createdOrders[0].orderNumber,
                      successMessage:
                        createdOrders.length === 1
                          ? "تم إنشاء الطلب محلياً وإضافته إلى الطلبات الحالية."
                          : `تم إنشاء ${createdOrders.length} طلبات حسب الموردين وإضافتها إلى الطلبات الحالية.`,
                    },
                  });
                }
              }}
              className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#F97316] px-4 text-[14px] font-bold text-white transition-colors hover:bg-[#EA6B0D]"
            >
              إتمام الطلب
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-[#8A9099]">
              سيتم فصل المنتجات إلى طلبات حسب المورد عند الإتمام.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
