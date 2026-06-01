import { useState, useEffect } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, History, Inbox, Clock } from "lucide-react";
import { statusMapping } from "@/lib/data";
import RequestTable from "@/components/admin/RequestTable";
import { toast } from "sonner";

const MOCK_CREATOR_REQUESTS_DB = [
    {
        id: 1,
        user_id: 201,
        full_name: "Nguyễn Văn Minh",
        email: "minhnn@fe.edu.vn",
        document_urls:
            "Em đã hoàn thành khóa Java Web với điểm số 9.0. Có 6 tháng kinh nghiệm làm trợ giảng thực tế, mong muốn được nâng quyền làm Creator để đóng góp lộ trình khóa học mới.",
        status: "PENDING",
        created_at: "2026-05-30T10:00:00Z",
    },
    {
        id: 2,
        user_id: 205,
        full_name: "Trần Thu Hà",
        email: "hatt@fe.edu.vn",
        document_urls:
            "Điểm tổng kết môn Kiểm thử tự động đạt 8.5. Đủ quỹ thời gian rảnh rỗi vào buổi tối để hỗ trợ, trực tuyến giải đáp bài tập và cứu trợ 1-1 cho các học viên khóa sau.",
        status: "PENDING",
        created_at: "2026-05-30T11:15:00Z",
    },
    {
        id: 3,
        user_id: 209,
        full_name: "Lê Hoàng Long",
        email: "longlh@fe.edu.vn",
        document_urls:
            "Ứng tuyển Mentor môn Microservices. Điểm kết thúc môn đạt 9.5.",
        status: "APPROVED",
        created_at: "2026-05-29T08:00:00Z",
    },
    {
        id: 4,
        user_id: 212,
        full_name: "Phạm Thúy Vi",
        email: "vipt@fe.edu.vn",
        document_urls:
            "Đăng ký làm nội dung khóa học ReactJS, điểm số đạt 7.5.",
        status: "REJECTED",
        created_at: "2026-05-29T09:30:00Z",
    },
];

const ManageRequestPage = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAllRequests(MOCK_CREATOR_REQUESTS_DB);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const pendingRequests = allRequests.filter(
        (req) => req.status === "PENDING",
    );
    const historyRequests = allRequests.filter(
        (req) => req.status === "APPROVED" || req.status === "REJECTED",
    );

    const handleProcessRequest = (requestId, actionType) => {
        const targetStatusLabel = statusMapping[actionType] || actionType;
        const confirmCheck = window.confirm(
            `Xác nhận xử lý đơn số #${requestId} với trạng thái: ${targetStatusLabel}?`,
        );
        if (!confirmCheck) return;

        setAllRequests((prev) =>
            prev.map((req) =>
                req.id === requestId ? { ...req, status: actionType } : req,
            ),
        );
        toast.success(`Cập nhật đơn #${requestId} thành công!`);
    };

    if (loading)
        return (
            <div className="p-8 font-mono">
                Đang tải cấu trúc đơn hệ thống...
            </div>
        );

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-secondary tracking-tight">
                        Hệ thống kiểm duyệt đơn
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Quản lý duyệt đơn và Lịch sử duyệt đơn
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <ClipboardList size={20} className="text-amber-500" />
                        <h2 className="text-lg font-bold">
                            1. Danh sách đơn chờ xử lý
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
                            data={pendingRequests}
                            isHistory={false}
                            onAction={handleProcessRequest}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <History size={20} className="text-indigo-600" />
                        <h2 className="text-lg font-bold">
                            2. Nhật ký duyệt đơn
                        </h2>
                    </div>
                    {historyRequests.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                            <Clock
                                size={32}
                                className="text-gray-300 mx-auto mb-2"
                            />
                            <p className="text-gray-500 text-sm font-medium">
                                Nhật ký lịch sử trống.
                            </p>
                        </div>
                    ) : (
                        <RequestTable data={historyRequests} isHistory={true} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageRequestPage;
