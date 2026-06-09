import { useState, useEffect } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, History, Inbox } from "lucide-react";
import RequestTable from "@/modules/course-lifecycle/components/RequestTable";
import { toast } from "sonner";
import creatorService from "@/services/creatorService";
import ReloadButton from "@/components/ui/ReloadButton";

const Requests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);

    useEffect(() => {
        fetchPendingRequests();
        fetchAllRequests();
    }, []);

    const handleReload = () => {
        fetchPendingRequests();
        fetchAllRequests();
        console.log(pendingRequests);
        console.log(allRequests);
    };

    const fetchPendingRequests = async () => {
        try {
            const data = await creatorService.getPendingCreatorRequests();
            setPendingRequests(data);
        } catch (error) {
            console.error(
                "Lỗi khi lấy pending creator request tại Requests",
                error,
            );
            toast.error("Lỗi khi lấy đơn duyệt");
        }
    };

    const fetchAllRequests = async () => {
        try {
            const res = await creatorService.getCreatorRequests();
            const data = res.filter((request) => request.status !== "PENDING");
            setAllRequests(data);
        } catch (error) {
            console.error(
                "Lỗi khi lấy data creator request tại Requests",
                error,
            );
            toast.error("Lỗi khi lấy đơn duyệt");
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await creatorService.approveCreatorRequest(requestId);

            setPendingRequests((prevPendingRequests) =>
                prevPendingRequests.filter(
                    (request) => request.requestId !== requestId,
                ),
            );

            toast.success(`Duyệt đơn #${requestId} thành công`);
            handleReload();
        } catch (error) {
            console.error("Lỗi khi duyệt đơn ở Requests: ", error);
            toast.error("Lỗi khi duyệt đơn");
        }
    };

    const handleReject = async (requestId) => {
        try {
            await creatorService.rejectCreatorRequest(requestId);

            setPendingRequests((prevPendingRequests) =>
                prevPendingRequests.filter(
                    (request) => request.requestId !== requestId,
                ),
            );

            toast.success(`Từ chối đơn #${requestId} thành công`);
        } catch (error) {
            console.error("Lỗi khi từ chối đơn ở Requests: ", error);
            toast.error("Lỗi khi từ chối đơn");
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-secondary tracking-tight">
                        Kiểm duyệt đơn
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Quản lý duyệt đơn và Lịch sử duyệt đơn
                    </p>
                </div>

                <div className="flex justify-end">
                    <ReloadButton action={handleReload} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <ClipboardList size={20} className="text-primary" />
                        <h2 className="text-lg font-bold">
                            Danh sách đơn chờ xử lý
                        </h2>
                    </div>
                    {pendingRequests.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                            <Inbox
                                size={32}
                                className="text-gray-300 mx-auto mb-2"
                            />
                            <p className="text-gray-500 text-sm font-medium">
                                Hàng chờ trống. Không có đơn nào cần xử lý.
                            </p>
                        </div>
                    ) : (
                        <RequestTable
                            requests={pendingRequests}
                            isHistory={false}
                            onApprovedClick={handleApprove}
                            onRejectClick={handleReject}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <History size={20} className="text-tertiary" />
                        <h2 className="text-lg font-bold">
                            Lịch sử đơn đã xử lý
                        </h2>
                    </div>
                    {allRequests.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                            <Inbox
                                size={32}
                                className="text-gray-300 mx-auto mb-2"
                            />
                            <p className="text-gray-500 text-sm font-medium">
                                Lịch sử duyệt trống. Không có đơn nào cần xử lý.
                            </p>
                        </div>
                    ) : (
                        <RequestTable requests={allRequests} isHistory={true} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Requests;
