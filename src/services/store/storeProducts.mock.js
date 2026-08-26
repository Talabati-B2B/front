import productOil from "../../assets/images/product-oil.png";
import productRice from "../../assets/images/product-rice.png";
import productWater from "../../assets/images/product-water.png";
import productTissues from "../../assets/images/product-tissues.png";

export const storeProductSummary = [
  {
    id: "purchases",
    label: "إجمالي المشتريات",
    value: "18,450 ₪",
    helper: "+12% عن الشهر الماضي",
    tone: "navy",
  },
  {
    id: "products",
    label: "إجمالي المنتجات",
    value: "1,248",
    helper: "+18% عن الشهر الماضي",
    tone: "green",
  },
  {
    id: "out-of-stock",
    label: "نفذ المخزون",
    value: "86",
    helper: "منتج غير متوفر حالياً",
    tone: "cyan",
  },
  {
    id: "popular",
    label: "الأكثر طلباً",
    value: "540",
    helper: "وحدة مطلوبة",
    tone: "orange",
  },
];

export const storeProductCategories = [
  "أغذية أساسية",
  "مواد غذائية",
  "زيوت",
  "مشروبات",
  "معلبات",
  "تنظيف",
  "تغليف",
  "مستلزمات",
];

export const storeStockStatuses = [
  "متوفر",
  "مخزون منخفض",
  "نفذ المخزون",
];

export const storeProducts = [
  {
    id: 1,
    name: "أرز بسمتي هندي",
    sku: "RICE-IND-01",
    supplier: "شركة الموارد الغذائية",
    supplierId: 101,
    supplierName: "شركة الموارد الغذائية",
    category: "أغذية أساسية",
    price: 85,
    availableQuantity: 150,
    stockUnit: "كجم",
    stockStatus: "متوفر",
    image: productRice,
  },
  {
    id: 2,
    name: "زيت دوار الشمس 1.8 لتر",
    sku: "OIL-SUN-18",
    supplier: "الوطنية للزيوت",
    supplierId: 102,
    supplierName: "الوطنية للزيوت",
    category: "زيوت",
    price: 16.5,
    availableQuantity: 42,
    stockUnit: "عبوة",
    stockStatus: "متوفر",
    image: productOil,
  },
  {
    id: 3,
    name: "سكر ناعم",
    sku: "SUG-WHT-10",
    supplier: "مصنع السكر العربي",
    supplierId: 103,
    supplierName: "مصنع السكر العربي",
    category: "أغذية أساسية",
    price: 48,
    availableQuantity: 12,
    stockUnit: "كيس",
    stockStatus: "مخزون منخفض",
    image: productRice,
  },
  {
    id: 4,
    name: "مياه شرب 330 مل × 40",
    sku: "WTR-NAQ-40",
    supplier: "مياه نقي",
    supplierId: 104,
    supplierName: "مياه نقي",
    category: "مشروبات",
    price: 15,
    availableQuantity: 0,
    stockUnit: "كرتونة",
    stockStatus: "نفذ المخزون",
    image: productWater,
  },
  {
    id: 5,
    name: "مكرونة سباغيتي",
    sku: "PST-SPG-01",
    supplier: "شركة المطاحن",
    supplierId: 105,
    supplierName: "شركة المطاحن",
    category: "أغذية أساسية",
    price: 3.25,
    availableQuantity: 200,
    stockUnit: "وحدة",
    stockStatus: "متوفر",
    image: productRice,
  },
  {
    id: 6,
    name: "دقيق فاخر 10 كجم",
    sku: "FLR-PRM-10",
    supplier: "شركة الموارد الغذائية",
    supplierId: 101,
    supplierName: "شركة الموارد الغذائية",
    category: "أغذية أساسية",
    price: 22,
    availableQuantity: 8,
    stockUnit: "وحدات",
    stockStatus: "مخزون منخفض",
    image: productRice,
  },
  {
    id: 7,
    name: "صلصة طماطم كرتون",
    sku: "TOM-PST-CRT",
    supplier: "الواحة الغذائية",
    supplierId: 106,
    supplierName: "الواحة الغذائية",
    category: "معلبات",
    price: 58,
    availableQuantity: 55,
    stockUnit: "وحدة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 8,
    name: "شاي كيس 100 حبة",
    sku: "TEA-KBS-100",
    supplier: "شركة الموارد الغذائية",
    supplierId: 101,
    supplierName: "شركة الموارد الغذائية",
    category: "مشروبات",
    price: 12.5,
    availableQuantity: 90,
    stockUnit: "وحدة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 9,
    name: "زيت ذرة 1.5 لتر",
    sku: "OIL-CRN-15",
    supplier: "الوطنية للزيوت",
    supplierId: 102,
    supplierName: "الوطنية للزيوت",
    category: "زيوت",
    price: 15.75,
    availableQuantity: 31,
    stockUnit: "عبوة",
    stockStatus: "متوفر",
    image: productOil,
  },
  {
    id: 10,
    name: "مياه معدنية 1.5 لتر × 12",
    sku: "WTR-MIN-12",
    supplier: "الخليج للتجارة",
    supplierId: 7,
    supplierName: "الخليج للتجارة",
    category: "مشروبات",
    price: 18,
    availableQuantity: 20,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productWater,
  },
  {
    id: 11,
    name: "أرز مصري 5 كجم",
    sku: "RICE-EGY-05",
    supplier: "مؤسسة النور للتجارة",
    supplierId: 5,
    supplierName: "مؤسسة النور للتجارة",
    category: "أغذية أساسية",
    price: 34,
    availableQuantity: 9,
    stockUnit: "كيس",
    stockStatus: "مخزون منخفض",
    image: productRice,
  },
  {
    id: 12,
    name: "تونة قطع 185 جم",
    sku: "TUNA-185-24",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "معلبات",
    price: 46,
    availableQuantity: 64,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 13,
    name: "حمص حب معلب",
    sku: "CHP-CAN-24",
    supplier: "الواحة الغذائية",
    supplierId: 106,
    supplierName: "الواحة الغذائية",
    category: "معلبات",
    price: 37.5,
    availableQuantity: 0,
    stockUnit: "كرتونة",
    stockStatus: "نفذ المخزون",
    image: productTissues,
  },
  {
    id: 14,
    name: "مناديل ورقية 200 منديل",
    sku: "TIS-200-12",
    supplier: "مؤسسة التموين",
    supplierId: 8,
    supplierName: "مؤسسة التموين",
    category: "مستلزمات",
    price: 10.25,
    availableQuantity: 75,
    stockUnit: "عبوة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 15,
    name: "أكواب ورقية 12 أونصة",
    sku: "CUP-12OZ-50",
    supplier: "مؤسسة التموين",
    supplierId: 8,
    supplierName: "مؤسسة التموين",
    category: "مستلزمات",
    price: 11,
    availableQuantity: 14,
    stockUnit: "رزمة",
    stockStatus: "مخزون منخفض",
    image: productTissues,
  },
  {
    id: 16,
    name: "عصير برتقال 1 لتر",
    sku: "JCE-ORG-01",
    supplier: "شركة المدينة",
    supplierId: 4,
    supplierName: "شركة المدينة",
    category: "مشروبات",
    price: 9.5,
    availableQuantity: 80,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productWater,
  },
  {
    id: 17,
    name: "سكر أبيض 1 كجم",
    sku: "SUG-WHT-01",
    supplier: "مصنع السكر العربي",
    supplierId: 103,
    supplierName: "مصنع السكر العربي",
    category: "أغذية أساسية",
    price: 6.75,
    availableQuantity: 110,
    stockUnit: "كيس",
    stockStatus: "متوفر",
    image: productRice,
  },
  {
    id: 18,
    name: "زيت نباتي 3 لتر",
    sku: "OIL-VEG-03",
    supplier: "الوطنية للزيوت",
    supplierId: 102,
    supplierName: "الوطنية للزيوت",
    category: "زيوت",
    price: 27.5,
    availableQuantity: 6,
    stockUnit: "عبوة",
    stockStatus: "مخزون منخفض",
    image: productOil,
  },
  {
    id: 19,
    name: "فول مدمس معلب",
    sku: "BEAN-CAN-24",
    supplier: "الواحة الغذائية",
    supplierId: 106,
    supplierName: "الواحة الغذائية",
    category: "معلبات",
    price: 35,
    availableQuantity: 45,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 20,
    name: "مياه شرب 500 مل × 24",
    sku: "WTR-500-24",
    supplier: "مياه نقي",
    supplierId: 104,
    supplierName: "مياه نقي",
    category: "مشروبات",
    price: 13.5,
    availableQuantity: 0,
    stockUnit: "كرتونة",
    stockStatus: "نفذ المخزون",
    image: productWater,
  },
  {
    id: 21,
    name: "ملح طعام 1 كجم",
    sku: "SALT-01KG",
    supplier: "شركة المطاحن",
    supplierId: 105,
    supplierName: "شركة المطاحن",
    category: "أغذية أساسية",
    price: 3,
    availableQuantity: 130,
    stockUnit: "كيس",
    stockStatus: "متوفر",
    image: productRice,
  },
  {
    id: 22,
    name: "أكياس تسوق كبيرة",
    sku: "BAG-LRG-100",
    supplier: "مؤسسة التموين",
    supplierId: 8,
    supplierName: "مؤسسة التموين",
    category: "مستلزمات",
    price: 8.5,
    availableQuantity: 33,
    stockUnit: "رزمة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 23,
    name: "ذرة حلوة معلبة",
    sku: "CORN-CAN-24",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "معلبات",
    price: 39,
    availableQuantity: 10,
    stockUnit: "كرتونة",
    stockStatus: "مخزون منخفض",
    image: productTissues,
  },
  {
    id: 24,
    name: "عصير تفاح 1 لتر",
    sku: "JCE-APL-01",
    supplier: "شركة المدينة",
    supplierId: 4,
    supplierName: "شركة المدينة",
    category: "مشروبات",
    price: 9.75,
    availableQuantity: 68,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productWater,
  },
];

const supplierSeedProducts = [
  {
    id: 1001,
    name: "عصير برتقال طبيعي 1 لتر",
    sku: "TB-PR-001",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "مشروبات",
    price: 24,
    availableQuantity: 48,
    stockQuantity: 48,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productWater,
  },
  {
    id: 1002,
    name: "منظف أرضيات 3 لتر",
    sku: "TB-PR-002",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "تنظيف",
    price: 30,
    availableQuantity: 12,
    stockQuantity: 12,
    stockUnit: "كرتونة",
    stockStatus: "مخزون منخفض",
    image: productTissues,
  },
  {
    id: 1003,
    name: "علب وجبات ورقية",
    sku: "TB-PR-003",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "تغليف",
    price: 40,
    availableQuantity: 0,
    stockQuantity: 0,
    stockUnit: "حبة",
    stockStatus: "نفذ المخزون",
    image: productTissues,
  },
  {
    id: 1004,
    name: "مناديل مطاعم",
    sku: "TB-PR-004",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "مستلزمات",
    price: 50,
    availableQuantity: 40,
    stockQuantity: 40,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 1005,
    name: "أكواب ورقية 12 أونصة",
    sku: "TB-PR-005",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "تغليف",
    price: 50,
    availableQuantity: 100,
    stockQuantity: 100,
    stockUnit: "حبة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 1006,
    name: "مياه معدنية 1.5 لتر",
    sku: "TB-PR-006",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "مشروبات",
    price: 18,
    availableQuantity: 75,
    stockQuantity: 75,
    stockUnit: "كرتونة",
    stockStatus: "متوفر",
    image: productWater,
  },
  {
    id: 1007,
    name: "سكر أبيض 1 كجم",
    sku: "TB-PR-007",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "مواد غذائية",
    price: 7.5,
    availableQuantity: 8,
    stockQuantity: 8,
    stockUnit: "كرتونة",
    stockStatus: "مخزون منخفض",
    image: productRice,
  },
  {
    id: 1008,
    name: "أكياس نفايات كبيرة",
    sku: "TB-PR-008",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "مستلزمات",
    price: 16,
    availableQuantity: 0,
    stockQuantity: 0,
    stockUnit: "رزمة",
    stockStatus: "نفذ المخزون",
    image: productTissues,
  },
  {
    id: 1009,
    name: "صابون سائل 5 لتر",
    sku: "TB-PR-009",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "تنظيف",
    price: 28,
    availableQuantity: 17,
    stockQuantity: 17,
    stockUnit: "عبوة",
    stockStatus: "متوفر",
    image: productTissues,
  },
  {
    id: 1010,
    name: "قفازات استخدام مرة واحدة",
    sku: "TB-PR-010",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "مستلزمات",
    price: 22,
    availableQuantity: 6,
    stockQuantity: 6,
    stockUnit: "علبة",
    stockStatus: "مخزون منخفض",
    image: productTissues,
  },
  {
    id: 1011,
    name: "أرز بسمتي 5 كجم",
    sku: "TB-PR-011",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "مواد غذائية",
    price: 42,
    availableQuantity: 30,
    stockQuantity: 30,
    stockUnit: "كيس",
    stockStatus: "متوفر",
    image: productRice,
  },
  {
    id: 1012,
    name: "رول تغليف غذائي",
    sku: "TB-PR-012",
    supplier: "شركة الصافي",
    supplierId: 2,
    supplierName: "شركة الصافي",
    category: "تغليف",
    price: 14,
    availableQuantity: 4,
    stockQuantity: 4,
    stockUnit: "رول",
    stockStatus: "مخزون منخفض",
    image: productTissues,
  },
];

const seedProducts = [
  ...storeProducts,
  ...supplierSeedProducts,
];

export const STORE_PRODUCTS_STORAGE_KEY =
  "talabaty_store_products";

const PRODUCTS_CHANGED_EVENT =
  "talabaty:products-changed";

const SUPPLIER_IDS_BY_NAME = {
  "شركة الأمل": 2,
  "شركة الأمل للتجارة": 2,
  "شركة الصافي": 2,
};

function canUseStorage() {
  return (
    typeof window !==
      "undefined" &&
    Boolean(
      window.localStorage,
    )
  );
}

function inferStockStatus(
  quantity,
  minimumStock = 10,
) {
  const numericQuantity =
    Math.max(
      0,
      Number(quantity) || 0,
    );

  const numericMinimum =
    Math.max(
      0,
      Number(
        minimumStock,
      ) || 0,
    );

  if (
    numericQuantity <= 0
  ) {
    return "نفذ المخزون";
  }

  if (
    numericQuantity <=
    numericMinimum
  ) {
    return "مخزون منخفض";
  }

  return "متوفر";
}

function resolveSupplierId(
  product,
  supplierName,
) {
  const mappedSupplierId =
    SUPPLIER_IDS_BY_NAME[
      supplierName
    ];

  const currentSupplierId =
    product.supplierId;

  // إصلاح المنتجات القديمة التي كانت تحمل supplier:name
  if (
    mappedSupplierId != null &&
    (
      currentSupplierId == null ||
      String(
        currentSupplierId,
      ).startsWith(
        "supplier:",
      )
    )
  ) {
    return mappedSupplierId;
  }

  return (
    currentSupplierId ??
    mappedSupplierId ??
    null
  );
}

function normalizeProduct(
  product,
) {
  const availableQuantity =
    Math.max(
      0,
      Number(
        product.availableQuantity ??
        product.stockQuantity ??
        product.quantity,
      ) || 0,
    );

  const minimumStock =
    Math.max(
      0,
      Number(
        product.minimumStock,
      ) || 10,
    );

  const supplierName =
    product.supplierName ||
    product.supplier ||
    product.ownerName ||
    "مورد";

  return {
    ...product,

    id:
      product.id,

    supplierId:
      resolveSupplierId(
        product,
        supplierName,
      ),

    supplierName,

    supplier:
      supplierName,

    name:
      String(
        product.name ??
        "",
      ).trim(),

    sku:
      String(
        product.sku ??
        "",
      ).trim(),

    category:
      product.category ||
      "مستلزمات",

    price:
      Math.max(
        0,
        Number(
          product.price ??
          product.unitPrice,
        ) || 0,
      ),

    availableQuantity,

    stockQuantity:
      availableQuantity,

    quantity:
      availableQuantity,

    minimumStock,

    stockUnit:
      product.stockUnit ||
      "وحدة",

    stockStatus:
      product.stockStatus ||
      inferStockStatus(
        availableQuantity,
        minimumStock,
      ),

    image:
      product.image ||
      productTissues,
  };
}

function readStoredProducts() {
  if (!canUseStorage()) {
    return seedProducts.map(
      normalizeProduct,
    );
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORE_PRODUCTS_STORAGE_KEY,
      );

    const parsed =
      raw
        ? JSON.parse(raw)
        : null;

    if (
      Array.isArray(parsed)
    ) {
      return parsed.map(
        normalizeProduct,
      );
    }
  } catch {
    // نرجع للبيانات الافتراضية
  }

  return seedProducts.map(
    normalizeProduct,
  );
}

function writeStoredProducts(
  products,
) {
  const normalized =
    products.map(
      normalizeProduct,
    );

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(
        STORE_PRODUCTS_STORAGE_KEY,
        JSON.stringify(
          normalized,
        ),
      );

      window.dispatchEvent(
        new CustomEvent(
          PRODUCTS_CHANGED_EVENT,
        ),
      );
    } catch {
      // تجاهل خطأ localStorage في نسخة mock
    }
  }

  return normalized;
}

function nextProductId(
  products,
) {
  return (
    products.reduce(
      (
        max,
        product,
      ) =>
        Math.max(
          max,
          Number(
            product.id,
          ) || 0,
        ),
      0,
    ) + 1
  );
}

export function getStoreProducts() {
  const products =
    readStoredProducts();

  if (
    canUseStorage() &&
    !window.localStorage.getItem(
      STORE_PRODUCTS_STORAGE_KEY,
    )
  ) {
    writeStoredProducts(
      products,
    );
  }

  return products;
}

export function getSupplierProducts(
  supplierId,
) {
  if (
    supplierId == null
  ) {
    return [];
  }

  return getStoreProducts().filter(
    (product) =>
      String(
        product.supplierId,
      ) ===
      String(
        supplierId,
      ),
  );
}

export function createStoreProduct(
  data,
) {
  const products =
    getStoreProducts();

  const availableQuantity =
    Math.max(
      0,
      Number(
        data.availableQuantity ??
        data.stockQuantity ??
        data.quantity,
      ) || 0,
    );

  const minimumStock =
    Math.max(
      0,
      Number(
        data.minimumStock,
      ) || 10,
    );

  const supplierName =
    data.supplierName ||
    data.supplier ||
    data.businessName ||
    "مورد";

  const product =
    normalizeProduct({
      ...data,

      id:
        data.id ??
        nextProductId(
          products,
        ),

      supplierId:
        data.supplierId,

      supplierName,

      supplier:
        supplierName,

      price:
        Number(
          data.price ??
          data.unitPrice,
        ) || 0,

      availableQuantity,

      stockQuantity:
        availableQuantity,

      minimumStock,

      stockStatus:
        inferStockStatus(
          availableQuantity,
          minimumStock,
        ),

      image:
        data.image ||
        productTissues,
    });

  writeStoredProducts([
    ...products,
    product,
  ]);

  return product;
}

export function updateStoreProduct(
  productId,
  changes,
) {
  const products =
    getStoreProducts();

  let updated = null;

  const next =
    products.map(
      (product) => {
        if (
          String(
            product.id,
          ) !==
          String(
            productId,
          )
        ) {
          return product;
        }

        const availableQuantity =
          Math.max(
            0,
            Number(
              changes.availableQuantity ??
              changes.stockQuantity ??
              changes.quantity ??
              product.availableQuantity,
            ) || 0,
          );

        const minimumStock =
          Math.max(
            0,
            Number(
              changes.minimumStock ??
              product.minimumStock,
            ) || 0,
          );

        updated =
          normalizeProduct({
            ...product,
            ...changes,

            availableQuantity,

            stockQuantity:
              availableQuantity,

            quantity:
              availableQuantity,

            minimumStock,

            stockStatus:
              changes.stockStatus ||
              inferStockStatus(
                availableQuantity,
                minimumStock,
              ),
          });

        return updated;
      },
    );

  if (!updated) {
    return null;
  }

  writeStoredProducts(
    next,
  );

  return updated;
}

export function deleteStoreProduct(
  productId,
  supplierId = null,
) {
  const products =
    getStoreProducts();

  const next =
    products.filter(
      (product) => {
        const matchesId =
          String(
            product.id,
          ) ===
          String(
            productId,
          );

        const matchesSupplier =
          supplierId == null ||
          String(
            product.supplierId,
          ) ===
          String(
            supplierId,
          );

        return !(
          matchesId &&
          matchesSupplier
        );
      },
    );

  if (
    next.length ===
    products.length
  ) {
    return false;
  }

  writeStoredProducts(
    next,
  );

  return true;
}

export function subscribeStoreProducts(
  callback,
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return () => {};
  }

  const notify = () =>
    callback(
      getStoreProducts(),
    );

  const handleStorage = (
    event,
  ) => {
    if (
      event.key ===
      STORE_PRODUCTS_STORAGE_KEY
    ) {
      notify();
    }
  };

  window.addEventListener(
    PRODUCTS_CHANGED_EVENT,
    notify,
  );

  window.addEventListener(
    "storage",
    handleStorage,
  );

  return () => {
    window.removeEventListener(
      PRODUCTS_CHANGED_EVENT,
      notify,
    );

    window.removeEventListener(
      "storage",
      handleStorage,
    );
  };
}