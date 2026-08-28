import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StoreSidebar from "../store/StoreSidebar";
import StoreTopbar from "../store/StoreTopbar";

import * as cartService from "../../services/store/cartService";
import * as orderService from "../../services/store/orderService";
import * as marketplaceService from "../../services/store/marketplaceService";
import * as notificationService from "../../services/notificationService";

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

export default function StoreLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersPagination, setOrdersPagination] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileActions, setProfileActions] = useState(null);

  const storeProfile = useMemo(() => ({
    storeName: user?.store?.store_name || user?.first_name || "المتجر",
    ownerName: user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "",
    accountType: "متجر",
    avatarSrc: user?.avatar_url || null,
    address: user?.store?.address || "",
  }), [user]);

  // --- Cart ---
  const loadCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const items = await cartService.fetchCart();
      setCartItems(items);
    } catch {
      // keep current cart on error
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = useCallback(async (product) => {
    try {
      await cartService.addCartItem(product.productId || product.id, 1);
      await loadCart();
      return true;
    } catch {
      return false;
    }
  }, [loadCart]);

  const updateCartItemQuantity = useCallback(async (productId, quantity) => {
    const item = cartItems.find(
      (i) => String(i.productId) === String(productId) || String(i.id) === String(productId)
    );
    if (!item) return;
    try {
      await cartService.updateCartItem(item.cartItemId || item.id, quantity);
      await loadCart();
    } catch { /* keep current */ }
  }, [cartItems, loadCart]);

  const removeCartItem = useCallback(async (productId) => {
    const item = cartItems.find(
      (i) => String(i.productId) === String(productId) || String(i.id) === String(productId)
    );
    if (!item) return;
    try {
      await cartService.removeCartItem(item.cartItemId || item.id);
      await loadCart();
    } catch { /* keep current */ }
  }, [cartItems, loadCart]);

  // --- Orders ---
  const loadOrders = useCallback(async (params = {}) => {
    try {
      setOrdersLoading(true);
      const res = await orderService.fetchOrders(params);
      const data = res.data;
      if (data?.data) {
        setOrders(data.data);
        setOrdersPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
        });
      } else {
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {
      // keep current
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const currentOrders = useMemo(
    () => orders.filter((o) => !["delivered", "canceled"].includes(o.status)),
    [orders],
  );

  const previousOrders = useMemo(
    () => orders.filter((o) => ["delivered", "canceled"].includes(o.status)),
    [orders],
  );

  // --- Checkout ---
  const createOrdersFromCart = useCallback(async () => {
    if (cartItems.length === 0) return [];
    try {
      const res = await orderService.checkout();
      setCartItems([]);
      await loadOrders();
      return res.data?.orders || [];
    } catch {
      return [];
    }
  }, [cartItems, loadOrders]);

  // --- Products & Suppliers ---
  const loadMarketplace = useCallback(async () => {
    try {
      const res = await marketplaceService.fetchMarketplaceData();
      const d = res.data || res;
      if (d.products) setProducts(d.products);
      if (d.suppliers) setSuppliers(d.suppliers);
    } catch { /* keep empty */ }
  }, []);

  useEffect(() => { loadMarketplace(); }, [loadMarketplace]);

  // --- Notifications ---
  const loadNotifications = useCallback(async () => {
    try {
      const [notifRes, count] = await Promise.all([
        notificationService.fetchNotifications(),
        notificationService.fetchUnreadCount(),
      ]);
      const items = notifRes.data?.data || notifRes.data || [];
      setNotifications(Array.isArray(items) ? items : []);
      setUnreadCount(typeof count === "number" ? count : 0);
    } catch { /* keep current */ }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  // Poll notifications every 30s
  const notifIntervalRef = useRef(null);
  useEffect(() => {
    notifIntervalRef.current = setInterval(loadNotifications, 30000);
    return () => clearInterval(notifIntervalRef.current);
  }, [loadNotifications]);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((cur) => cur.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch { /* keep current */ }
  }, []);

  const markNotificationRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((cur) =>
        cur.map((n) => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* keep current */ }
  }, []);

  const handleNotificationSelect = useCallback((notification) => {
    markNotificationRead(notification.id);
    const data = notification.data || notification;
    if (data.order_id) {
      navigate("/store/orders", { state: { orderId: data.order_id } });
    }
  }, [markNotificationRead, navigate]);

  // --- Profile ---
  const registerProfileActions = useCallback((actions) => {
    setProfileActions(() => actions);
  }, []);

  const saveStoreProfile = useCallback(() => {}, []);

  // --- Reorder ---
  const reorderItems = useCallback(async (orderItems = []) => {
    let addedCount = 0;
    for (const item of orderItems) {
      try {
        await cartService.addCartItem(item.productId || item.product_id, item.quantity || 1);
        addedCount++;
      } catch { /* skip unavailable */ }
    }
    if (addedCount > 0) await loadCart();
    return { addedCount, unavailableCount: orderItems.length - addedCount };
  }, [loadCart]);

  // --- Search ---
  const globalSearchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return [];

    const productResults = products
      .filter((p) =>
        [p.name, p.sku, p.supplier?.company_name].some((v) =>
          String(v ?? "").toLowerCase().includes(query),
        ),
      )
      .slice(0, 3)
      .map((p) => ({
        id: `product-${p.id}`,
        type: "product",
        label: p.name,
        meta: p.supplier?.company_name || "",
        value: p,
      }));

    const supplierResults = suppliers
      .filter((s) =>
        [s.company_name, s.description, s.address].some((v) =>
          String(v ?? "").toLowerCase().includes(query),
        ),
      )
      .slice(0, 2)
      .map((s) => ({
        id: `supplier-${s.id}`,
        type: "supplier",
        label: s.company_name,
        meta: s.address,
        value: s,
      }));

    const orderResults = orders
      .filter((o) =>
        [o.order_number, o.supplier?.company_name, o.status].some((v) =>
          String(v ?? "").toLowerCase().includes(query),
        ),
      )
      .slice(0, 2)
      .map((o) => ({
        id: `order-${o.id}`,
        type: "order",
        label: o.order_number,
        meta: o.supplier?.company_name || "",
        value: o,
      }));

    return [...productResults, ...supplierResults, ...orderResults];
  }, [products, suppliers, orders, searchValue]);

  const handleGlobalSearchSelect = useCallback((result) => {
    if (result.type === "product") {
      navigate("/store/products", { state: { searchTerm: result.value.name } });
    } else if (result.type === "supplier") {
      navigate("/store/suppliers", { state: { supplierId: result.value.id } });
    } else if (result.type === "order") {
      navigate("/store/orders", { state: { orderNumber: result.value.order_number } });
    }
    setSearchValue("");
  }, [navigate]);

  // --- UI ---
  const title = STORE_TITLES[location.pathname] ?? "المتجر";
  const isProfilePage = location.pathname === "/store/profile";

  const notificationsForTopbar = useMemo(
    () => notifications.map((n) => ({
      id: n.id,
      title: n.data?.title || n.title || "",
      message: n.data?.message || n.message || "",
      read: !!n.read_at,
      createdAt: n.created_at || "",
      orderNumber: n.data?.order_number || "",
      data: n.data,
    })),
    [notifications],
  );

  return (
    <div dir="rtl" className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      <StoreSidebar
        storeName={storeProfile.storeName}
        cartCount={cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}
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
          storeName={storeProfile.ownerName || storeProfile.storeName}
          storeRole={storeProfile.accountType}
          avatarSrc={storeProfile.avatarSrc}
          notifications={notificationsForTopbar}
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
              suppliers,
              loadMarketplace,

              cartItems,
              cartLoading,
              addToCart,
              updateCartItemQuantity,
              removeCartItem,
              loadCart,

              reorderItems,
              createOrdersFromCart,

              orders,
              currentOrders,
              previousOrders,
              ordersLoading,
              ordersPagination,
              loadOrders,

              storeProfile,
              saveStoreProfile,

              notifications: notificationsForTopbar,
              unreadCount,
              loadNotifications,

              registerProfileActions,
            }}
          />
        </main>
      </div>
    </div>
  );
}
