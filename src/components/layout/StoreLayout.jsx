import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StoreSidebar from "../store/StoreSidebar";
import StoreTopbar from "../store/StoreTopbar";
import { storeProducts } from "../../services/store/storeProducts.mock";
import { storeSuppliers } from "../../services/store/storeSuppliers.mock";
import {
  currentStoreOrders,
  previousStoreOrders,
} from "../../services/store/storeOrders.mock";
import { storeProfile as defaultStoreProfile } from "../../services/store/storeProfile.mock";
import { storeNotifications as defaultNotifications } from "../../services/store/storeNotifications.mock";

const STORAGE_KEYS = {
  cart: "talabaty-store-cart",
  orders: "talabaty-store-orders",
  profile: "talabaty-store-profile",
  notifications: "talabaty-store-notifications",
};

const STORE_TITLES = {
  "/store": "لوحة التحكم",
  "/store/suppliers": "الموردون",
  "/store/products": "المنتجات",
  "/store/cart": "السلة",
  "/store/orders": "الطلبات",
  "/store/reports": "التقارير",
  "/store/settings": "الإعدادات",
  "/store/profile": "ملف الشخصي",
};

function readStoredValue(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local persistence is optional; the in-memory state still remains functional.
  }
}

function formatOrderDate(date) {
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatOrderTime(date) {
  return new Intl.DateTimeFormat("ar", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function StoreLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [cartItems, setCartItems] = useState(() =>
    readStoredValue(STORAGE_KEYS.cart, []),
  );
  const [ordersState, setOrdersState] = useState(() =>
    readStoredValue(STORAGE_KEYS.orders, {
      current: currentStoreOrders,
      previous: previousStoreOrders,
    }),
  );
  const [storeProfile, setStoreProfile] = useState(() =>
    readStoredValue(STORAGE_KEYS.profile, defaultStoreProfile),
  );
  const [notifications, setNotifications] = useState(() =>
    readStoredValue(STORAGE_KEYS.notifications, defaultNotifications),
  );
  const [profileActions, setProfileActions] = useState(null);

  const registerProfileActions = useCallback((actions) => {
    setProfileActions(() => actions);
  }, []);

  const currentOrders = ordersState.current ?? currentStoreOrders;
  const previousOrders = ordersState.previous ?? previousStoreOrders;

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.cart, cartItems);
  }, [cartItems]);

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.orders, ordersState);
  }, [ordersState]);

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.profile, storeProfile);
  }, [storeProfile]);

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  const title = STORE_TITLES[location.pathname] ?? "المتجر";
  const isProfilePage = location.pathname === "/store/profile";

  const addToCart = (product) => {
    if (!product || product.availableQuantity <= 0) {
      return false;
    }

    let added = false;

    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex((item) => item.id === product.id);

      if (existingIndex === -1) {
        added = true;
        return [...currentItems, { ...product, quantity: 1 }];
      }

      const existingItem = currentItems[existingIndex];
      if (existingItem.quantity >= product.availableQuantity) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      nextItems[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      added = true;
      return nextItems;
    });

    return added;
  };

  const updateCartItemQuantity = (productId, nextQuantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const normalizedQuantity = Math.min(
          item.availableQuantity,
          Math.max(1, Number(nextQuantity) || 1),
        );

        return { ...item, quantity: normalizedQuantity };
      }),
    );
  };

  const removeCartItem = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const reorderItems = (orderItems = []) => {
    let unavailableCount = 0;

    const availableProducts = orderItems.reduce((products, orderItem) => {
      const currentProduct = storeProducts.find(
        (product) => product.id === orderItem.productId,
      );

      if (!currentProduct || currentProduct.availableQuantity <= 0) {
        unavailableCount += 1;
        return products;
      }

      products.push({
        ...currentProduct,
        quantity: Math.min(
          currentProduct.availableQuantity,
          Math.max(1, orderItem.quantity),
        ),
      });

      return products;
    }, []);

    if (availableProducts.length === 0) {
      return { addedCount: 0, unavailableCount };
    }

    setCartItems((currentItems) => {
      const nextItems = [...currentItems];

      availableProducts.forEach((product) => {
        const existingIndex = nextItems.findIndex((item) => item.id === product.id);

        if (existingIndex === -1) {
          nextItems.push(product);
          return;
        }

        const existingItem = nextItems[existingIndex];
        nextItems[existingIndex] = {
          ...product,
          quantity: Math.min(
            product.availableQuantity,
            existingItem.quantity + product.quantity,
          ),
        };
      });

      return nextItems;
    });

    return {
      addedCount: availableProducts.length,
      unavailableCount,
    };
  };

  const createOrdersFromCart = () => {
    if (cartItems.length === 0) {
      return [];
    }

    const groupedItems = new Map();
    cartItems.forEach((item) => {
      if (!groupedItems.has(item.supplier)) {
        groupedItems.set(item.supplier, []);
      }
      groupedItems.get(item.supplier).push(item);
    });

    const allOrderIds = [...currentOrders, ...previousOrders].map((order) => order.id);
    const nextBaseId = Math.max(10245, ...allOrderIds) + 1;
    const now = new Date();

    const createdOrders = Array.from(groupedItems.entries()).map(
      ([supplier, items], index) => {
        const id = nextBaseId + index;

        return {
          id,
          orderNumber: `#ORD-${id}`,
          supplier,
          supplierInitial: supplier.trim().charAt(0) || "م",
          supplierClass: "bg-[#40577B]",
          date: now.toISOString().slice(0, 10),
          dateLabel: formatOrderDate(now),
          timeLabel: formatOrderTime(now),
          status: "جديد",
          paymentStatus: "غير مدفوع",
          deliveryAddress: storeProfile.address,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.price,
            image: item.image,
          })),
        };
      },
    );

    setOrdersState((current) => ({
      ...current,
      current: [...createdOrders, ...(current.current ?? [])],
    }));

    setCartItems([]);

    setNotifications((current) => [
      ...createdOrders.map((order, index) => ({
        id: Date.now() + index,
        title: "تم إنشاء الطلب",
        message: `تم إنشاء ${order.orderNumber} لدى ${order.supplier}.`,
        orderNumber: order.orderNumber,
        read: false,
        createdAt: "الآن",
      })),
      ...current,
    ]);

    return createdOrders;
  };

  const saveStoreProfile = (nextProfile) => {
    setStoreProfile((current) => ({ ...current, ...nextProfile }));
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  };

  const markNotificationRead = (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const handleNotificationSelect = (notification) => {
    markNotificationRead(notification.id);
    if (notification.orderNumber) {
      navigate("/store/orders", {
        state: { orderNumber: notification.orderNumber },
      });
    }
  };

  const globalSearchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return [];
    }

    const productResults = storeProducts
      .filter((product) =>
        [product.name, product.sku, product.supplier].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .slice(0, 3)
      .map((product) => ({
        id: `product-${product.id}`,
        type: "product",
        label: product.name,
        meta: product.supplier,
        value: product,
      }));

    const supplierResults = storeSuppliers
      .filter((supplier) =>
        [supplier.name, supplier.description, supplier.location].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .slice(0, 2)
      .map((supplier) => ({
        id: `supplier-${supplier.id}`,
        type: "supplier",
        label: supplier.name,
        meta: supplier.location,
        value: supplier,
      }));

    const orderResults = [...currentOrders, ...previousOrders]
      .filter((order) =>
        [order.orderNumber, order.supplier, order.status].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .slice(0, 2)
      .map((order) => ({
        id: `order-${order.id}`,
        type: "order",
        label: order.orderNumber,
        meta: order.supplier,
        value: order,
      }));

    return [...productResults, ...supplierResults, ...orderResults];
  }, [currentOrders, previousOrders, searchValue]);

  const handleGlobalSearchSelect = (result) => {
    if (result.type === "product") {
      navigate("/store/products", {
        state: { searchTerm: result.value.name },
      });
    } else if (result.type === "supplier") {
      navigate("/store/suppliers", {
        state: { supplierId: result.value.id },
      });
    } else if (result.type === "order") {
      navigate("/store/orders", {
        state: { orderNumber: result.value.orderNumber },
      });
    }

    setSearchValue("");
  };

  return (
    <div dir="rtl" className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      <StoreSidebar
        storeName={storeProfile.storeName}
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onNavigate={() => setSearchValue("")}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <StoreTopbar
          title={title}
          variant={isProfilePage ? "profile" : "default"}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchResults={globalSearchResults}
          onSearchResultSelect={handleGlobalSearchSelect}
          storeName={
            storeProfile.ownerName ??
            defaultStoreProfile.ownerName ??
            storeProfile.storeName
          }
          storeRole={storeProfile.accountType ?? "متجر"}
          avatarSrc={storeProfile.avatarSrc}
          notifications={notifications}
          onMarkAllNotificationsRead={markAllNotificationsRead}
          onNotificationSelect={handleNotificationSelect}
          onProfileClick={() => {
            setSearchValue("");
            navigate("/store/profile");
          }}
          onProfileSave={profileActions?.onSave}
          onProfileCancel={profileActions?.onCancel}
          profileHasChanges={Boolean(profileActions?.hasChanges)}
        />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <Outlet
            context={{
              searchValue,
              setSearchValue,
              cartItems,
              addToCart,
              updateCartItemQuantity,
              removeCartItem,
              reorderItems,
              createOrdersFromCart,
              currentOrders,
              previousOrders,
              storeProfile,
              saveStoreProfile,
              registerProfileActions,
            }}
          />
        </main>
      </div>
    </div>
  );
}
