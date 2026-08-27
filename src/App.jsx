import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

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

function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== role) {
    if (user.role === "store") {
      return <Navigate to="/store" replace />;
    }

    if (user.role === "supplier") {
      return <Navigate to="/supplier-dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

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

      <Route path="/supplier-dashboard" element={<ProtectedRoute role="supplier"><SupplierDashboard /></ProtectedRoute>} />

      <Route
        path="/supplierpendingdashboard"
        element={<SupplierPendingDashboard />}
      />

      <Route path="/orders" element={<ProtectedRoute role="supplier"><Order /></ProtectedRoute>} />

      <Route path="/products" element={<ProtectedRoute role="supplier"><SupplierProducts /></ProtectedRoute>} />

      <Route path="/products/add" element={<ProtectedRoute role="supplier"><AddProduct /></ProtectedRoute>} />

      <Route path="/reports" element={<ProtectedRoute role="supplier"><SupplierReports /></ProtectedRoute>} />

      <Route path="/settings" element={<ProtectedRoute role="supplier"><SupplierSettings /></ProtectedRoute>} />

      <Route path="/profile" element={<ProtectedRoute role="supplier"><SupplierProfile /></ProtectedRoute>} />

      {/* ================= Store Pending ================= */}

      <Route path="/store/pending" element={<StorePending />} />

      {/* ================= Store ================= */}

      <Route path="/store" element={<ProtectedRoute role="store"><StoreLayout /></ProtectedRoute>}>
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
