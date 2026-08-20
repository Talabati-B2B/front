import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminTopbar from "../admin/AdminTopbar";

export default function AdminLayout() {
  return (
    <div dir="rtl" className="flex h-screen min-h-screen bg-[#F7F8FA]">
      <AdminSidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar />

        <main className="min-h-0 flex-1 overflow-y-auto bg-[#F7F8FA]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
