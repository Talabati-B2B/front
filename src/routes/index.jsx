import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../pages/auth/register/Register";
// import Login from "../pages/auth/login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/register" replace />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // عندما تنشئ صفحة تسجيل الدخول:
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
]);