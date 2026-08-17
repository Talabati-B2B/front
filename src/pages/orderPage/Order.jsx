import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import StatsCards from "../../components/StatsCards";
import OrdersTable from "../../components/OrdersTable";
import RecentActivities from "../../components/RecentActivities";
import TopStores from "../../components/TopStores";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-page flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="px-8 my-3">
          <h1 className="text-[#00163B] mt-4 font-bold text-[32px] leading-5 mb-4">الطلبات الواردة</h1>
          <span className="text-[#44474F] text-[14px]">إدارة وتتبع جميع الطلبات المرسلة من المتاجر المتعاقد معها</span>
        </div>

        <main className="flex flex-col gap-6 p-8">
          <StatsCards /> {/* الصف الأول: عرض كامل */}
          <OrdersTable /> {/* الصف الثاني: عرض كامل */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RecentActivities /> {/* الصف الثالث: نص العرض */}
            <TopStores /> {/* الصف الثالث: نص العرض التاني */}
          </div>
        </main>
      </div>
    </div>
  );
}
