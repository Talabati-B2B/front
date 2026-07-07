import { Routes, Route } from "react-router-dom";

import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";
import LandingPage from "./pages/landing-page/LandingPage";

import SupplierDashboard from "./pages/supplier-dashboard/SupplierDashboard";
import DashboardHome from "./pages/supplier-dashboard/DashboardHome"; // تم الاستيراد هنا


export default function App() {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard Layout */}
      <Route path="/dashboard" element={<SupplierDashboard />}>

        {/* Nested Routes: هذه الصفحات ستظهر مكان الـ Outlet في SupplierDashboard */}
        <Route index element={<DashboardHome />} />

      </Route>

    </Routes>
  );
}