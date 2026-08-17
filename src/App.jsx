import { Routes, Route } from "react-router-dom";
import SupplierDashboard from "./pages/supplier-dashboard/SupplierDashboard";
import "./pages/supplier-dashboard/DashboardHome";
import SupplierPendingDashboard from "./pages/supplierpendingdashboard/SupplierPendingDashboard";
import Order from "./pages/orderPage/Order";

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
    </Routes>
  );
}
