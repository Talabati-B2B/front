import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import StatsCards from "../../components/StatsCards";
import OrdersTable from "../../components/OrdersTable";
import RecentActivities from "../../components/RecentActivities";
import TopStores from "../../components/TopStores";

export default function OrdersPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]" dir="rtl">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-5 py-6 sm:px-6 lg:px-8">
            <header>
              <h1 className="text-[28px] font-bold leading-tight text-[#00163B] sm:text-[32px]">
                الطلبات الواردة
              </h1>
              <p className="mt-2 text-[13px] leading-6 text-[#44474F] sm:text-[14px]">
                إدارة وتتبع جميع الطلبات المرسلة من المتاجر المتعاقد معها
              </p>
            </header>

            <StatsCards />

            <OrdersTable />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <RecentActivities />
              <TopStores />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
