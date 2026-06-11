import Sidebar from "@/components/layouts/Sidebar";
import DashboardPage from "@/modules/admin/pages/DashboardPage";

const Dashboard = () => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <DashboardPage />
            </main>
        </div>
    );
};

export default Dashboard;
