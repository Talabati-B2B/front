import { Routes, Route } from "react-router-dom";
import SupplierDashboard from "./pages/supplier-dashboard/SupplierDashboard";
import "./pages/supplier-dashboard/DashboardHome";
import SupplierPendingDashboard from "./pages/supplierpendingdashboard/SupplierPendingDashboard";
import Order from "./pages/orderPage/Order";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin-dashboard/AdminDashboard";
import AdminOrders from "./pages/admin-orders/AdminOrders";
import AdminInvoices from "./pages/admin-invoices/AdminInvoices";
import AdminRegions from "./pages/admin-regions/AdminRegions";
import AdminAccountReview from "./pages/admin-account-review/AdminAccountReview";
import AdminActivity from "./pages/admin-activity/AdminActivity";
import AdminUsers from "./pages/admin-users/AdminUsers";
import AdminNotifications from "./pages/admin-notifications/AdminNotifications";
import AdminProducts from "./pages/admin-products/AdminProducts";
import AdminReports from "./pages/admin-reports/AdminReports";
import AdminSettings from "./pages/admin-settings/AdminSettings";

export default function App() {
  return (
    <Routes>
      {/* Dashboard Layout */}
      <Route path="/" element={<SupplierDashboard />} />

      <Route
        path="/supplierpendingdashboard"
        element={<SupplierPendingDashboard />}
      />

      <Route path="/orders" element={<Order />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="regions" element={<AdminRegions />} />
        <Route path="account-review" element={<AdminAccountReview />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}