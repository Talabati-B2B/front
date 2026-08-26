import { useCallback, useEffect, useMemo, useState } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import StoreSidebar from "../store/StoreSidebar";
import StoreTopbar from "../store/StoreTopbar";

import {
  getStoreProducts,
  subscribeStoreProducts,
} from "../../services/store/storeProducts.mock";

import { storeSuppliers } from "../../services/store/storeSuppliers.mock";

import {
  createOrdersFromCart as createSharedOrdersFromCart,
  getOrdersForStore,
  subscribeOrders,
} from "../../services/order/order";

import { storeProfile as defaultStoreProfile } from "../../services/store/storeProfile.mock";

import { storeNotifications as defaultNotifications } from "../../services/store/storeNotifications.mock";

const STORAGE_KEYS = {
  cart: "talabaty-store-cart",
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
    // Mock storage only.
  }
}

export default function StoreLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  /*
   * --------------------------------------------------
   * STORE ID
   * --------------------------------------------------
   */

  const userEmail = String(user?.email ?? "")
    .trim()
    .toLowerCase();

  const userId = user?.id ?? null;

  const userStoreId = user?.storeId ?? null;

  /*
   * الحساب التجريبي للمتجر مربوط بـ Store ID = 1
   */
  const storeId =
    userEmail === "store@test.com" ? 1 : (userStoreId ?? userId ?? null);

  /*
   * --------------------------------------------------
   * GENERAL STATE
   * --------------------------------------------------
   */

  const [searchValue, setSearchValue] = useState("");

  const [products, setProducts] = useState(() => getStoreProducts());

  const [cartItems, setCartItems] = useState(() =>
    readStoredValue(STORAGE_KEYS.cart, []),
  );

  const [storeProfile, setStoreProfile] = useState(() =>
    readStoredValue(STORAGE_KEYS.profile, defaultStoreProfile),
  );

  const [notifications, setNotifications] = useState(() =>
    readStoredValue(STORAGE_KEYS.notifications, defaultNotifications),
  );

  const [profileActions, setProfileActions] = useState(null);

  /*
   * --------------------------------------------------
   * ORDER REVISION
   * --------------------------------------------------
   *
   * لا نخزن الطلبات نفسها في state.
   *
   * فقط نرفع revision عند أي تغيير،
   * وبعدها نعيد قراءتها من المصدر المشترك.
   */

  const [ordersRevision, setOrdersRevision] = useState(0);

  /*
   * --------------------------------------------------
   * SHARED STORE ORDERS
   * --------------------------------------------------
   */

  const storeOrders = useMemo(() => {
    if (storeId == null) {
      return [];
    }

    return getOrdersForStore(storeId);
  }, [storeId, ordersRevision]);

  const currentOrders = useMemo(
    () => storeOrders.filter((order) => !order.isPrevious),
    [storeOrders],
  );

  const previousOrders = useMemo(
    () => storeOrders.filter((order) => Boolean(order.isPrevious)),
    [storeOrders],
  );

  /*
   * --------------------------------------------------
   * PROFILE ACTIONS
   * --------------------------------------------------
   */

  const registerProfileActions = useCallback((actions) => {
    setProfileActions(() => actions);
  }, []);

  /*
   * --------------------------------------------------
   * PRODUCTS SUBSCRIPTION
   * --------------------------------------------------
   */

  useEffect(() => {
    return subscribeStoreProducts(setProducts);
  }, []);

  /*
   * --------------------------------------------------
   * ORDERS SUBSCRIPTION
   * --------------------------------------------------
   *
   * create / accept / reject
   * كلها تعمل event من order.js.
   *
   * نحن فقط نعيد render وبعدها نقرأ
   * أحدث نسخة من getOrdersForStore().
   */

  useEffect(() => {
    const handleOrdersChange = () => {
      setOrdersRevision((revision) => revision + 1);
    };

    return subscribeOrders(handleOrdersChange);
  }, []);

  /*
   * --------------------------------------------------
   * LOCAL STORAGE
   * --------------------------------------------------
   */

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.cart, cartItems);
  }, [cartItems]);

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.profile, storeProfile);
  }, [storeProfile]);

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  /*
   * --------------------------------------------------
   * PAGE TITLE
   * --------------------------------------------------
   */

  const title = STORE_TITLES[location.pathname] ?? "المتجر";

  const isProfilePage = location.pathname === "/store/profile";

  /*
   * --------------------------------------------------
   * ADD TO CART
   * --------------------------------------------------
   */

  const addToCart = (product) => {
    if (!product || product.availableQuantity <= 0) {
      return false;
    }

    let added = false;

    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => String(item.id) === String(product.id),
      );

      if (existingIndex === -1) {
        added = true;

        return [
          ...currentItems,
          {
            ...product,
            quantity: 1,
          },
        ];
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

  /*
   * --------------------------------------------------
   * UPDATE CART QUANTITY
   * --------------------------------------------------
   */

  const updateCartItemQuantity = (productId, nextQuantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (String(item.id) !== String(productId)) {
          return item;
        }

        const normalizedQuantity = Math.min(
          item.availableQuantity,

          Math.max(1, Number(nextQuantity) || 1),
        );

        return {
          ...item,

          quantity: normalizedQuantity,
        };
      }),
    );
  };

  /*
   * --------------------------------------------------
   * REMOVE CART ITEM
   * --------------------------------------------------
   */

  const removeCartItem = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => String(item.id) !== String(productId)),
    );
  };

  /*
   * --------------------------------------------------
   * REORDER
   * --------------------------------------------------
   */

  const reorderItems = (orderItems = []) => {
    let unavailableCount = 0;

    const availableProducts = orderItems.reduce((available, orderItem) => {
      const currentProduct = products.find(
        (product) => String(product.id) === String(orderItem.productId),
      );

      if (!currentProduct || currentProduct.availableQuantity <= 0) {
        unavailableCount += 1;

        return available;
      }

      available.push({
        ...currentProduct,

        quantity: Math.min(
          currentProduct.availableQuantity,

          Math.max(1, Number(orderItem.quantity) || 1),
        ),
      });

      return available;
    }, []);

    if (availableProducts.length === 0) {
      return {
        addedCount: 0,
        unavailableCount,
      };
    }

    setCartItems((currentItems) => {
      const nextItems = [...currentItems];

      availableProducts.forEach((product) => {
        const existingIndex = nextItems.findIndex(
          (item) => String(item.id) === String(product.id),
        );

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

  /*
   * --------------------------------------------------
   * CREATE ORDERS
   * --------------------------------------------------
   */

  const createOrdersFromCart = () => {
    if (cartItems.length === 0 || storeId == null) {
      return [];
    }

    const createdOrders = createSharedOrdersFromCart(cartItems, {
      ...user,

      /*
       * مهم:
       * order.js يعتمد على id كـ storeId.
       */
      id: storeId,

      storeId,

      storeName: storeProfile.storeName,

      businessName: user?.businessName || storeProfile.storeName,

      address: storeProfile.address,

      deliveryAddress: storeProfile.address,
    });

    if (createdOrders.length === 0) {
      return [];
    }

    /*
     * createSharedOrdersFromCart يطلق
     * orders-changed event.
     *
     * لكن نرفع revision أيضاً هنا لضمان
     * تحديث الواجهة فوراً.
     */

    setOrdersRevision((revision) => revision + 1);

    /*
     * إفراغ السلة بعد نجاح إنشاء الطلب.
     */

    setCartItems([]);

    /*
     * Notifications
     */

    setNotifications((current) => [
      ...createdOrders.map((order, index) => ({
        id: Date.now() + index,

        title: "تم إنشاء الطلب",

        message: `تم إنشاء ${order.orderNumber} لدى ${order.supplierName}.`,

        orderNumber: order.orderNumber,

        read: false,

        createdAt: "الآن",
      })),

      ...current,
    ]);

    return createdOrders;
  };

  /*
   * --------------------------------------------------
   * PROFILE
   * --------------------------------------------------
   */

  const saveStoreProfile = (nextProfile) => {
    setStoreProfile((current) => ({
      ...current,
      ...nextProfile,
    }));
  };

  /*
   * --------------------------------------------------
   * NOTIFICATIONS
   * --------------------------------------------------
   */

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,

        read: true,
      })),
    );
  };

  const markNotificationRead = (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,

              read: true,
            }
          : notification,
      ),
    );
  };

  const handleNotificationSelect = (notification) => {
    markNotificationRead(notification.id);

    if (notification.orderNumber) {
      navigate("/store/orders", {
        state: {
          orderNumber: notification.orderNumber,
        },
      });
    }
  };

  /*
   * --------------------------------------------------
   * GLOBAL SEARCH
   * --------------------------------------------------
   */

  const globalSearchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return [];
    }

    /*
     * PRODUCTS
     */

    const productResults = products
      .filter((product) =>
        [product.name, product.sku, product.supplier].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
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

    /*
     * SUPPLIERS
     */

    const supplierResults = storeSuppliers
      .filter((supplier) =>
        [supplier.name, supplier.description, supplier.location].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
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

    /*
     * ORDERS
     */

    const orderResults = [...currentOrders, ...previousOrders]
      .filter((order) =>
        [order.orderNumber, order.supplier, order.status].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
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
  }, [currentOrders, previousOrders, products, searchValue]);

  /*
   * --------------------------------------------------
   * GLOBAL SEARCH SELECT
   * --------------------------------------------------
   */

  const handleGlobalSearchSelect = (result) => {
    if (result.type === "product") {
      navigate("/store/products", {
        state: {
          searchTerm: result.value.name,
        },
      });
    } else if (result.type === "supplier") {
      navigate("/store/suppliers", {
        state: {
          supplierId: result.value.id,
        },
      });
    } else if (result.type === "order") {
      navigate("/store/orders", {
        state: {
          orderNumber: result.value.orderNumber,
        },
      });
    }

    setSearchValue("");
  };

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

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

              products,

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
