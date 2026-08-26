import {
  currentStoreOrders,
  previousStoreOrders,
} from "../store/storeOrders.mock";

export const ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

export const ORDER_STATUS_LABELS = Object.freeze({
  [ORDER_STATUS.PENDING]: "قيد المراجعة",
  [ORDER_STATUS.APPROVED]: "مقبول",
  [ORDER_STATUS.REJECTED]: "مرفوض",
});

export const orderStatuses = Object.values(ORDER_STATUS);

export const orderStatusTransitions = {
  [ORDER_STATUS.PENDING]: {
    accept: ORDER_STATUS.APPROVED,
    reject: ORDER_STATUS.REJECTED,
  },
};

export const ORDERS_STORAGE_KEY = "talabaty_orders";
const ORDERS_CHANGED_EVENT = "talabaty:orders-changed";

const SUPPLIER_IDS_BY_NAME = {
  "شركة الأمل": 2,
  "شركة الأمل للتجارة": 2,
  "شركة الصافي": 2,
  "شركة المدينة": 4,
  "مؤسسة النور للتجارة": 5,
  "الخليج للتجارة": 7,
  "مؤسسة التموين": 8,
  "شركة الموارد الغذائية": 101,
  "الوطنية للزيوت": 102,
  "مصنع السكر العربي": 103,
  "مياه نقي": 104,
  "شركة المطاحن": 105,
  "الواحة الغذائية": 106,
};

const legacySupplierOrders = [
  {
    id: "SUP-1",
    orderNumber: "TB-OR-001",
    storeName: "بيتي مول",
    date: "2026-07-24",
    total: 240,
    status: ORDER_STATUS.PENDING,
  },
  {
    id: "SUP-2",
    orderNumber: "TB-OR-002",
    storeName: "لاكاسا مول",
    date: "2026-07-20",
    total: 30,
    status: ORDER_STATUS.APPROVED,
  },
  {
    id: "SUP-3",
    orderNumber: "TB-OR-003",
    storeName: "سوبر ماركت عجور",
    date: "2026-07-16",
    total: 40,
    status: ORDER_STATUS.APPROVED,
  },
  {
    id: "SUP-4",
    orderNumber: "TB-OR-004",
    storeName: "مطعم بلدنا",
    date: "2026-07-14",
    total: 50,
    status: ORDER_STATUS.APPROVED,
  },
  {
    id: "SUP-5",
    orderNumber: "TB-OR-005",
    storeName: "بازوكا كافي",
    date: "2026-07-10",
    total: 50,
    status: ORDER_STATUS.APPROVED,
  },
  {
    id: "SUP-6",
    orderNumber: "TB-OR-006",
    storeName: "سوبر ماركت الأصدقاء",
    date: "2026-07-08",
    total: 180,
    status: ORDER_STATUS.REJECTED,
  },
  {
    id: "SUP-7",
    orderNumber: "TB-OR-007",
    storeName: "متجر الوفاء",
    date: "2026-07-06",
    total: 320,
    status: ORDER_STATUS.PENDING,
  },
  {
    id: "SUP-8",
    orderNumber: "TB-OR-008",
    storeName: "ماركت المدينة",
    date: "2026-07-04",
    total: 125,
    status: ORDER_STATUS.APPROVED,
  },
  {
    id: "SUP-9",
    orderNumber: "TB-OR-009",
    storeName: "أسواق النخيل",
    date: "2026-07-02",
    total: 275,
    status: ORDER_STATUS.APPROVED,
  },
  {
    id: "SUP-10",
    orderNumber: "TB-OR-010",
    storeName: "متجر الجودة",
    date: "2026-06-30",
    total: 410,
    status: ORDER_STATUS.APPROVED,
  },
].map((order, index) => ({
  ...order,
  storeId: 9000 + index,
  supplierId: 2,
  supplierName: "شركة الصافي",
  supplier: "شركة الصافي",
  supplierInitial: "ص",
  supplierClass: "bg-[#36965D]",
  createdAt: `${order.date}T12:00:00.000Z`,
  dateLabel: order.date,
  timeLabel: "",
  paymentStatus: "غير مدفوع",
  deliveryAddress: "",
  items: [],
}));

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function formatOrderDate(date) {
  try {
    return new Intl.DateTimeFormat("ar", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function formatOrderTime(date) {
  try {
    return new Intl.DateTimeFormat("ar", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

function canonicalStatus(status) {
  if (Object.values(ORDER_STATUS).includes(status)) {
    return status;
  }

  if (
    status === "جديد" ||
    status === "بانتظار القبول" ||
    status === "قيد المراجعة"
  ) {
    return ORDER_STATUS.PENDING;
  }

  if (
    status === "مرفوض" ||
    status === "ملغي"
  ) {
    return ORDER_STATUS.REJECTED;
  }

  return ORDER_STATUS.APPROVED;
}

function supplierIdFromOrder(order) {
  const supplierName =
    order.supplierName ||
    order.supplier ||
    "unknown";

  const mappedSupplierId =
    SUPPLIER_IDS_BY_NAME[supplierName];

  const currentSupplierId =
    order.supplierId;

  // إصلاح الطلبات القديمة التي تم تخزين المورد فيها كنص supplier:name
  if (
    mappedSupplierId != null &&
    (
      currentSupplierId == null ||
      String(currentSupplierId).startsWith("supplier:")
    )
  ) {
    return mappedSupplierId;
  }

  return (
    currentSupplierId ??
    mappedSupplierId ??
    `supplier:${supplierName}`
  );
}

function normalizeItem(item) {
  return {
    ...item,
    productId: item.productId ?? item.id,
    name: item.name || "منتج",
    sku: item.sku || "",
    quantity: Math.max(
      1,
      Number(item.quantity) || 1,
    ),
    unitPrice: Math.max(
      0,
      Number(
        item.unitPrice ??
        item.price,
      ) || 0,
    ),
    image: item.image || "",
  };
}

function normalizeOrder(order) {
  const createdAt =
    order.createdAt ||
    `${
      order.date ||
      new Date().toISOString().slice(0, 10)
    }T12:00:00.000Z`;

  const createdDate =
    new Date(createdAt);

  const supplierName =
    order.supplierName ||
    order.supplier ||
    "مورد";

  const items =
    Array.isArray(order.items)
      ? order.items.map(normalizeItem)
      : [];

  const total =
    Number(order.total) ||
    items.reduce(
      (sum, item) =>
        sum +
        item.unitPrice *
        item.quantity,
      0,
    );

  return {
    ...order,

    id: order.id,

    orderNumber:
      order.orderNumber ||
      `#ORD-${order.id}`,

    storeId:
      order.storeId,

    storeName:
      order.storeName ||
      "متجر",

    supplierId:
      supplierIdFromOrder(order),

    supplierName,

    supplier:
      supplierName,

    supplierInitial:
      order.supplierInitial ||
      supplierName
        .trim()
        .charAt(0) ||
      "م",

    supplierClass:
      order.supplierClass ||
      "bg-[#40577B]",

    items,

    total,

    status:
      canonicalStatus(
        order.status,
      ),

    createdAt,

    date:
      order.date ||
      createdAt.slice(0, 10),

    dateLabel:
      order.dateLabel ||
      formatOrderDate(
        createdDate,
      ),

    timeLabel:
      order.timeLabel ||
      formatOrderTime(
        createdDate,
      ),

    paymentStatus:
      order.paymentStatus ||
      "غير مدفوع",

    deliveryAddress:
      order.deliveryAddress ||
      "",

    rejectionReason:
      order.rejectionReason ||
      null,
  };
}

function seedStoreOrders() {
  const normalizeStoreSeed = (
    order,
    isPrevious,
  ) =>
    normalizeOrder({
      ...order,

      id:
        `STORE-${order.id}`,

      storeId:
        1,

      storeName:
        "متجر النور",

      supplierId:
        supplierIdFromOrder(
          order,
        ),

      status:
        canonicalStatus(
          order.status,
        ),

      createdAt:
        `${order.date}T12:00:00.000Z`,

      isPrevious,
    });

  return [
    ...currentStoreOrders.map(
      (order) =>
        normalizeStoreSeed(
          order,
          false,
        ),
    ),

    ...previousStoreOrders.map(
      (order) =>
        normalizeStoreSeed(
          order,
          true,
        ),
    ),
  ];
}

function seedOrders() {
  return [
    ...seedStoreOrders(),
    ...legacySupplierOrders,
  ].map(normalizeOrder);
}

function readOrders() {
  if (!canUseStorage()) {
    return seedOrders();
  }

  try {
    const raw =
      window.localStorage.getItem(
        ORDERS_STORAGE_KEY,
      );

    const parsed =
      raw
        ? JSON.parse(raw)
        : null;

    if (Array.isArray(parsed)) {
      return parsed.map(
        normalizeOrder,
      );
    }
  } catch {
    // في حال وجود بيانات تالفة نرجع للبيانات الافتراضية
  }

  const seeded =
    seedOrders();

  writeOrders(
    seeded,
    false,
  );

  return seeded;
}

function writeOrders(
  ordersValue,
  notify = true,
) {
  const normalized =
    ordersValue.map(
      normalizeOrder,
    );

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(
          normalized,
        ),
      );

      if (notify) {
        window.dispatchEvent(
          new CustomEvent(
            ORDERS_CHANGED_EVENT,
          ),
        );
      }
    } catch {
      // تجاهل خطأ localStorage في نسخة mock
    }
  }

  return normalized;
}

function buildOrderId(
  index = 0,
) {
  return `ORD-${Date.now()}-${index + 1}`;
}

function resolveStoreName(
  store,
) {
  return (
    store?.businessName ||
    store?.storeName ||
    [
      store?.firstName,
      store?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "متجر"
  );
}

export function getOrderStatusLabel(
  status,
) {
  return (
    ORDER_STATUS_LABELS[
      canonicalStatus(status)
    ] ||
    String(status || "")
  );
}

export function getOrders() {
  return readOrders();
}

export function getOrdersForStore(
  storeId,
) {
  if (storeId == null) {
    return [];
  }

  return getOrders()
    .filter(
      (order) =>
        String(order.storeId) ===
        String(storeId),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt),
    );
}

export function getOrdersForSupplier(
  supplierId,
) {
  if (supplierId == null) {
    return [];
  }

  return getOrders()
    .filter(
      (order) =>
        String(
          order.supplierId,
        ) ===
        String(
          supplierId,
        ),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt),
    );
}

export function createOrdersFromCart(
  cartItems,
  store,
) {
  if (
    !Array.isArray(cartItems) ||
    cartItems.length === 0 ||
    store?.id == null
  ) {
    return [];
  }

  const groups =
    new Map();

  cartItems.forEach(
    (item) => {
      const supplierName =
        item.supplierName ||
        item.supplier ||
        "مورد";

      let supplierId =
        item.supplierId;

      const mappedSupplierId =
        SUPPLIER_IDS_BY_NAME[
          supplierName
        ];

      // إصلاح أي supplierId قديم
      if (
        mappedSupplierId != null &&
        (
          supplierId == null ||
          String(
            supplierId,
          ).startsWith(
            "supplier:",
          )
        )
      ) {
        supplierId =
          mappedSupplierId;
      }

      supplierId =
        supplierId ??
        mappedSupplierId ??
        `supplier:${supplierName}`;

      const key =
        String(supplierId);

      if (
        !groups.has(key)
      ) {
        groups.set(
          key,
          {
            supplierId,
            supplierName,
            items: [],
          },
        );
      }

      groups
        .get(key)
        .items.push(item);
    },
  );

  if (
    groups.size === 0
  ) {
    return [];
  }

  const existing =
    getOrders();

  const now =
    new Date();

  const storeName =
    resolveStoreName(
      store,
    );

  const createdOrders =
    Array.from(
      groups.values(),
    ).map(
      (
        group,
        index,
      ) => {
        const id =
          buildOrderId(
            index,
          );

        const items =
          group.items.map(
            (item) =>
              normalizeItem({
                productId:
                  item.productId ??
                  item.id,

                name:
                  item.name,

                sku:
                  item.sku,

                quantity:
                  item.quantity,

                unitPrice:
                  item.price,

                image:
                  item.image,
              }),
          );

        return normalizeOrder({
          id,

          orderNumber:
            `#${id}`,

          storeId:
            store.id,

          storeName,

          supplierId:
            group.supplierId,

          supplierName:
            group.supplierName,

          supplier:
            group.supplierName,

          items,

          total:
            items.reduce(
              (
                sum,
                item,
              ) =>
                sum +
                item.unitPrice *
                item.quantity,
              0,
            ),

          status:
            ORDER_STATUS.PENDING,

          createdAt:
            now.toISOString(),

          date:
            now
              .toISOString()
              .slice(0, 10),

          dateLabel:
            formatOrderDate(
              now,
            ),

          timeLabel:
            formatOrderTime(
              now,
            ),

          paymentStatus:
            "غير مدفوع",

          deliveryAddress:
            store.deliveryAddress ||
            store.address ||
            store.location ||
            "",

          isPrevious:
            false,
        });
      },
    );

  writeOrders([
    ...createdOrders,
    ...existing,
  ]);

  return createdOrders;
}

export function updateOrderStatus(
  orderId,
  nextStatus,
  {
    supplierId = null,
    rejectionReason = null,
  } = {},
) {
  const targetStatus =
    canonicalStatus(
      nextStatus,
    );

  if (
    ![
      ORDER_STATUS.APPROVED,
      ORDER_STATUS.REJECTED,
    ].includes(
      targetStatus,
    )
  ) {
    return null;
  }

  const ordersValue =
    getOrders();

  let updated = null;

  const next =
    ordersValue.map(
      (order) => {
        if (
          String(order.id) !==
          String(orderId)
        ) {
          return order;
        }

        if (
          supplierId != null &&
          String(
            order.supplierId,
          ) !==
          String(
            supplierId,
          )
        ) {
          return order;
        }

        if (
          order.status !==
          ORDER_STATUS.PENDING
        ) {
          return order;
        }

        updated =
          normalizeOrder({
            ...order,

            status:
              targetStatus,

            rejectionReason:
              targetStatus ===
              ORDER_STATUS.REJECTED
                ? String(
                    rejectionReason ||
                    "",
                  ).trim() ||
                  null
                : null,
          });

        return updated;
      },
    );

  if (!updated) {
    return null;
  }

  writeOrders(next);

  return updated;
}

export function subscribeOrders(
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
      getOrders(),
    );

  const handleStorage = (
    event,
  ) => {
    if (
      event.key ===
      ORDERS_STORAGE_KEY
    ) {
      notify();
    }
  };

  window.addEventListener(
    ORDERS_CHANGED_EVENT,
    notify,
  );

  window.addEventListener(
    "storage",
    handleStorage,
  );

  return () => {
    window.removeEventListener(
      ORDERS_CHANGED_EVENT,
      notify,
    );

    window.removeEventListener(
      "storage",
      handleStorage,
    );
  };
}

export const orders =
  legacySupplierOrders;

export const orderStats = [
  {
    id: "total",
    label: "إجمالي الطلبات الواردة",
    value: "1,284",
    icon: "total",
    badge: {
      text: "+12%",
      tone: "success",
    },
  },
  {
    id: "pending",
    label: "بانتظار القبول",
    value: "42",
    icon: "pending",
    badge: {
      text: "تنبيه",
      tone: "warning",
    },
  },
  {
    id: "processing",
    label: "قيد التجهيز",
    value: "156",
    icon: "processing",
    badge: null,
  },
  {
    id: "completed",
    label: "مكتملة اليوم",
    value: "89",
    icon: "completed",
    badge: null,
  },
];

export const topStores = [
  {
    id: 1,
    name: "سوبر ماركت الأصدقاء",
    activeOrders: 24,
    revenue: "15,400",
    progress: 80,
  },
  {
    id: 2,
    name: "كيرفور",
    activeOrders: 18,
    revenue: "12,100",
    progress: 62,
  },
];

export const recentActivities = [
  {
    id: 1,
    title: "تم قبول الطلب #ORD-94208",
    time: "منذ 5 دقائق",
    type: "accepted",
  },
  {
    id: 2,
    title: "طلب جديد بانتظار القبول",
    time: "منذ 12 دقيقة",
    type: "pending",
  },
  {
    id: 3,
    title: "تم رفض الطلب #ORD-94182",
    time: "منذ 45 دقيقة",
    type: "rejected",
  },
  {
    id: 4,
    title: "تم بدء تجهيز الطلب #ORD-94175",
    time: "منذ ساعة",
    type: "accepted",
  },
  {
    id: 5,
    title: "طلب جديد بانتظار القبول",
    time: "منذ ساعتين",
    type: "pending",
  },
  {
    id: 6,
    title: "تم رفض الطلب #ORD-94160",
    time: "منذ 3 ساعات",
    type: "rejected",
  },
];