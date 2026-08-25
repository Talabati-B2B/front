import { Routes, Route } from "react-router-dom";

// Landing
import LandingPage from "./pages/landing-page/landingPage";

// Auth
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";

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

      {/* ================= Supplier ================= */}

      <Route path="/supplier-dashboard" element={<SupplierDashboard />} />

      <Route
        path="/supplierpendingdashboard"
        element={<SupplierPendingDashboard />}
      />

      <Route path="/orders" element={<Order />} />

      <Route path="/products" element={<SupplierProducts />} />

      <Route path="/products/add" element={<AddProduct />} />

      <Route path="/reports" element={<SupplierReports />} />

      <Route path="/settings" element={<SupplierSettings />} />

      <Route path="/profile" element={<SupplierProfile />} />

      {/* ================= Store Pending ================= */}

      <Route path="/store/pending" element={<StorePending />} />

      {/* ================= Store ================= */}

      <Route path="/store" element={<StoreLayout />}>
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

      <Route path="/admin" element={<AdminLayout />}>
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
