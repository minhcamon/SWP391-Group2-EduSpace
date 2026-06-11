import Sidebar from "@/components/layouts/Sidebar";
import RequestPage from "@/modules/admin/pages/RequestPage";

const Requests = () => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <RequestPage />
            </main>
        </div>
    );
};

export default Requests;
