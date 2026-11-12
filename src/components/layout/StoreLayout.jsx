import { useCallback, useEffect, useMemo, useState } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import StoreSidebar from "../store/StoreSidebar";
import StoreTopbar from "../store/StoreTopbar";

import { fetchStoreProducts } from "../../services/products/productService";
import { getApiErrorMessage } from "../../utils/apiError";

import { storeSuppliers } from "../../services/store/storeSuppliers.mock";

import {
  addCartItem,
  checkoutCart,
  fetchCart,
  fetchMyOrders,
  removeCartItemById,
  updateCartItem,
} from "../../services/store/storeCartService";

import { storeProfile as defaultStoreProfile } from "../../services/store/storeProfile.mock";

import { storeNotifications as defaultNotifications } from "../../services/store/storeNotifications.mock";

const STORAGE_KEYS = {
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

  /*
   * --------------------------------------------------
   * GENERAL STATE
   * --------------------------------------------------
   */

  const [searchValue, setSearchValue] = useState("");

  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState("");

  // السلة والطلبات من الباك (لم تعد محفوظة في المتصفح)
  const [cartItems, setCartItems] = useState([]);
  const [cartError, setCartError] = useState("");
  const [storeOrders, setStoreOrders] = useState([]);

  const [storeProfile, setStoreProfile] = useState(() =>
    readStoredValue(STORAGE_KEYS.profile, defaultStoreProfile),
  );

  const [notifications, setNotifications] = useState(() =>
    readStoredValue(STORAGE_KEYS.notifications, defaultNotifications),
  );

  const [profileActions, setProfileActions] = useState(null);

  /*
   * --------------------------------------------------
   * CART & ORDERS (من الباك)
   * --------------------------------------------------
   */

  const refreshCart = useCallback(
    () =>
      fetchCart()
        .then((items) => {
          setCartItems(items);
          setCartError("");
        })
        .catch((error) => {
          setCartError(getApiErrorMessage(error, "تعذّر تحميل السلة."));
        }),
    [],
  );

  const refreshOrders = useCallback(
    () =>
      fetchMyOrders()
        .then(setStoreOrders)
        .catch(() => {}),
    [],
  );

  useEffect(() => {
    refreshCart();
    refreshOrders();
  }, [refreshCart, refreshOrders]);

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
   * PRODUCTS (من الباك: منتجات الموردين المعتمدين)
   * --------------------------------------------------
   */

  useEffect(() => {
    let active = true;

    fetchStoreProducts()
      .then((list) => {
        if (!active) return;

        setProducts(list);
        setProductsError("");
      })
      .catch((error) => {
        if (active) {
          setProductsError(getApiErrorMessage(error, "تعذّر تحميل المنتجات."));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /*
   * --------------------------------------------------
   * LOCAL STORAGE
   * --------------------------------------------------
   */

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
   * CART ACTIONS
   * --------------------------------------------------
   *
   * نتحقق محلياً بسرعة ثم ننفذ على الباك ونعيد قراءة السلة،
   * فالباك هو المصدر الحقيقي للكميات والأسعار.
   */

  const runCartAction = (action) => {
    setCartError("");

    return action()
      .catch((error) => {
        setCartError(getApiErrorMessage(error, "تعذّر تنفيذ العملية على السلة."));
      })
      .then(refreshCart);
  };

  const addToCart = (product) => {
    if (!product || product.availableQuantity <= 0) {
      return false;
    }

    const existing = cartItems.find(
      (item) => String(item.id) === String(product.id),
    );

    if (existing && existing.quantity >= product.availableQuantity) {
      return false;
    }

    runCartAction(() => addCartItem(product.id, 1));

    return true;
  };

  const updateCartItemQuantity = (productId, nextQuantity) => {
    const item = cartItems.find(
      (cartItem) => String(cartItem.id) === String(productId),
    );

    if (!item) {
      return;
    }

    const normalizedQuantity = Math.min(
      item.availableQuantity,
      Math.max(1, Number(nextQuantity) || 1),
    );

    if (normalizedQuantity === item.quantity) {
      return;
    }

    runCartAction(() => updateCartItem(item.cartItemId, normalizedQuantity));
  };

  const removeCartItem = (productId) => {
    const item = cartItems.find(
      (cartItem) => String(cartItem.id) === String(productId),
    );

    if (!item) {
      return;
    }

    runCartAction(() => removeCartItemById(item.cartItemId));
  };

  /*
   * --------------------------------------------------
   * REORDER (إعادة طلب أصناف طلب سابق)
   * --------------------------------------------------
   */

  const reorderItems = (orderItems = []) => {
    let unavailableCount = 0;
    const toAdd = [];

    orderItems.forEach((orderItem) => {
      const currentProduct = products.find(
        (product) => String(product.id) === String(orderItem.productId),
      );

      if (!currentProduct || currentProduct.availableQuantity <= 0) {
        unavailableCount += 1;

        return;
      }

      const inCart =
        cartItems.find((item) => String(item.id) === String(currentProduct.id))
          ?.quantity ?? 0;

      const quantity = Math.min(
        currentProduct.availableQuantity - inCart,
        Math.max(1, Number(orderItem.quantity) || 1),
      );

      if (quantity <= 0) {
        return;
      }

      toAdd.push({ id: currentProduct.id, quantity });
    });

    if (toAdd.length > 0) {
      runCartAction(async () => {
        for (const item of toAdd) {
          await addCartItem(item.id, item.quantity);
        }
      });
    }

    return {
      addedCount: toAdd.length,
      unavailableCount,
    };
  };

  /*
   * --------------------------------------------------
   * CREATE ORDERS (طلب لكل مورد في السلة)
   * --------------------------------------------------
   */

  const createOrdersFromCart = async () => {
    if (cartItems.length === 0) {
      return [];
    }

    // عند الفشل ترمي رسالة الباك ليعرضها Cart.jsx
    const createdOrders = await checkoutCart().catch((error) => {
      throw new Error(getApiErrorMessage(error, "تعذّر إنشاء الطلب."));
    });

    await Promise.all([refreshCart(), refreshOrders()]);

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
              productsError,

              cartItems,
              cartError,
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
