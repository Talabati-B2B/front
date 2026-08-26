import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Landing
import LandingPage from "./pages/landing-page/landingPage";

// Auth
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";
import AccountStatusGate from "./components/auth/AccountStatusGate";
import AccountRejected from "./pages/account-rejected/AccountRejected";

// Supplier
import SupplierDashboard from "./pages/supplier-dashboard/SupplierDashboard";
import "./pages/supplier-dashboard/DashboardHome";
import SupplierPendingDashboard from "./pages/supplierpendingdashboard/SupplierPendingDashboard";
import Order from "./pages/orderPage/Order";
import SupplierProducts from "./pages/supplier-product/SupplierProducts";
import AddProduct from "./pages/supplier-product/AddProduct";
import SupplierReports from "./pages/supplier-reports/SupplierReports";
import SupplierSettings from "./pages/supplier-settings/SupplierSettings";
import SupplierProfile from "./pages/supplier-profile/SupplierProfile";

// Store
import StoreLayout from "./components/layout/StoreLayout";
import StoreDashboard from "./pages/store-dashboard/StoreDashboard";
import Suppliers from "./pages/store-suppliers/Suppliers";
import Products from "./pages/store-products/Products";
import Cart from "./pages/store-cart/Cart";
import Orders from "./pages/store-orders/Orders";
import Reports from "./pages/store-reports/Reports";
import Settings from "./pages/store-settings/Settings";
import Profile from "./pages/store-profile/Profile";
import StorePending from "./pages/store-pending/StorePending";

// Admin
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin-dashboard/AdminDashboard";
import AdminOrders from "./pages/admin-orders/AdminOrders";
import AdminInvoices from "./pages/admin-invoices/AdminInvoices";
import AdminRegions from "./pages/admin-regions/AdminRegions";
import AdminAccountReview from "./pages/admin-account-review/AdminAccountReview";
import AdminActivity from "./pages/admin-activity/AdminActivity";
import AdminUsers from "./pages/admin-users/AdminUsers";
import AdminUserDetails from "./pages/admin-user-details/AdminUserDetails";
import AdminNotifications from "./pages/admin-notifications/AdminNotifications";
import AdminProducts from "./pages/admin-products/AdminProducts";
import AdminReports from "./pages/admin-reports/AdminReports";
import AdminSettings from "./pages/admin-settings/AdminSettings";
import AdminProfile from "./pages/admin-profile/AdminProfile";

export default function App() {
  return (
    <Routes>
      {/* ================= Landing ================= */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/landing" element={<LandingPage />} />

      {/* ================= Auth ================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/account-rejected" element={<AccountRejected />} />

      {/* ================= Supplier ================= */}

      <Route
        path="/supplier-dashboard"
        element={
          <AccountStatusGate role="supplier">
            <SupplierDashboard />
          </AccountStatusGate>
        }
      />

      <Route
        path="/supplierpendingdashboard"
        element={
          <AccountStatusGate role="supplier" pendingOnly>
            <SupplierPendingDashboard />
          </AccountStatusGate>
        }
      />

      <Route path="/orders" element={<AccountStatusGate role="supplier"><Order /></AccountStatusGate>} />

      <Route path="/products" element={<AccountStatusGate role="supplier"><SupplierProducts /></AccountStatusGate>} />

      <Route path="/products/add" element={<AccountStatusGate role="supplier"><AddProduct /></AccountStatusGate>} />

      <Route path="/reports" element={<AccountStatusGate role="supplier"><SupplierReports /></AccountStatusGate>} />

      <Route path="/settings" element={<AccountStatusGate role="supplier"><SupplierSettings /></AccountStatusGate>} />

      <Route path="/profile" element={<AccountStatusGate role="supplier"><SupplierProfile /></AccountStatusGate>} />

      {/* ================= Store Pending ================= */}

      <Route path="/store/pending" element={<AccountStatusGate role="store" pendingOnly><StorePending /></AccountStatusGate>} />

      {/* ================= Store ================= */}

      <Route path="/store" element={<AccountStatusGate role="store"><StoreLayout /></AccountStatusGate>}>
        <Route index element={<StoreDashboard />} />

        <Route path="suppliers" element={<Suppliers />} />

        <Route path="products" element={<Products />} />

        <Route path="cart" element={<Cart />} />

        <Route path="orders" element={<Orders />} />

        <Route path="reports" element={<Reports />} />

        <Route path="settings" element={<Settings />} />

        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ================= Admin ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="orders" element={<AdminOrders />} />

        <Route path="invoices" element={<AdminInvoices />} />

        <Route path="regions" element={<AdminRegions />} />

        <Route path="account-review" element={<AdminAccountReview />} />

        <Route path="activity" element={<AdminActivity />} />

        <Route path="users" element={<AdminUsers />} />

        {/* User Management Details */}
        <Route path="users/:id" element={<AdminUserDetails />} />

        <Route path="notifications" element={<AdminNotifications />} />

        <Route path="products" element={<AdminProducts />} />

        <Route path="reports" element={<AdminReports />} />

        <Route path="settings" element={<AdminSettings />} />

        {/* Admin Profile */}
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}
