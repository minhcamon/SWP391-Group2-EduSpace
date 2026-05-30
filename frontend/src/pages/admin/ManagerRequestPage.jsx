import { useState, useEffect } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import {
    Check,
    X,
    ClipboardList,
    History,
    User,
    Mail,
    ShieldAlert,
    Inbox,
    Search,
    Clock,
} from "lucide-react";

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
            "Đăng ký làm nội dung khóa học ReactJS, điểm số đạt 7.5 (Chưa đạt định mức tối thiểu >= 8.0 để lên cấp).",
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
        const confirmCheck = window.confirm(
            `Xác nhận xử lý đơn số #${requestId} với trạng thái: ${actionType}?`,
        );
        if (!confirmCheck) return;

        setAllRequests((prev) =>
            prev.map((req) =>
                req.id === requestId ? { ...req, status: actionType } : req,
            ),
        );
    };

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <main className="grow p-8 min-w-0 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">
                                Hệ thống kiểm duyệt đơn
                            </h1>
                            <p className="text-gray-500 text-sm mt-0.5">
                                Quản lý duyệt đơn và Lịch sử duyệt đơn
                            </p>
                        </div>
                    </div>
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
                                Hàng chờ trống. Hiện tại không có đơn nào cần xử
                                lý.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            <th className="py-4 px-6 w-24">
                                                ID Đơn
                                            </th>
                                            <th className="py-4 px-6 w-72">
                                                Ứng viên
                                            </th>
                                            <th className="py-4 px-6">
                                                Đơn trình bày / Minh chứng
                                            </th>
                                            <th className="py-4 px-6 w-32 text-center">
                                                Trạng thái
                                            </th>
                                            <th className="py-4 px-6 w-52 text-center">
                                                Tác vụ
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
                                        {pendingRequests.map((req) => (
                                            <tr
                                                key={req.id}
                                                className="hover:bg-gray-50/40 transition-colors"
                                            >
                                                <td className="py-5 px-6 font-bold text-gray-900">
                                                    #{req.id}
                                                </td>
                                                <td className="py-5 px-6 space-y-1">
                                                    <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                                                        <User
                                                            size={14}
                                                            className="text-gray-400"
                                                        />{" "}
                                                        {req.full_name}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Mail
                                                            size={14}
                                                            className="text-gray-400"
                                                        />{" "}
                                                        {req.email}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                                                        UID: {req.user_id}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed max-w-2xl text-sm">
                                                        {req.document_urls}
                                                    </p>
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/50 animate-pulse">
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleProcessRequest(
                                                                    req.id,
                                                                    "APPROVED",
                                                                )
                                                            }
                                                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-2 rounded-xl text-xs transition-colors shadow-sm shadow-emerald-600/10 cursor-pointer"
                                                        >
                                                            <Check size={14} />{" "}
                                                            Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleProcessRequest(
                                                                    req.id,
                                                                    "REJECTED",
                                                                )
                                                            }
                                                            className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 font-semibold py-2 px-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                                                        >
                                                            <X size={14} /> Từ
                                                            chối
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            <th className="py-4 px-6 w-24">
                                                ID Đơn
                                            </th>
                                            <th className="py-4 px-6 w-72">
                                                Ứng viên
                                            </th>
                                            <th className="py-4 px-6">
                                                Đơn trình bày / Minh chứng
                                            </th>
                                            <th className="py-4 px-6 w-32 text-center">
                                                Kết quả
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
                                        {historyRequests.map((req) => {
                                            const isApproved =
                                                req.status === "APPROVED";
                                            return (
                                                <tr
                                                    key={req.id}
                                                    className={`transition-colors ${
                                                        isApproved
                                                            ? "bg-emerald-50/20 hover:bg-emerald-50/40"
                                                            : "bg-red-50/10 hover:bg-red-50/20"
                                                    }`}
                                                >
                                                    <td className="py-5 px-6 font-bold text-gray-900">
                                                        #{req.id}
                                                    </td>
                                                    <td className="py-5 px-6 space-y-1">
                                                        <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                                                            <User
                                                                size={14}
                                                                className="text-gray-400"
                                                            />{" "}
                                                            {req.full_name}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <Mail
                                                                size={14}
                                                                className="text-gray-400"
                                                            />{" "}
                                                            {req.email}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
                                                            UID: {req.user_id}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 text-gray-600 leading-relaxed max-w-2xl text-sm">
                                                        {req.document_urls}
                                                    </td>
                                                    <td className="py-5 px-6 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                                isApproved
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                    : "bg-red-50 text-red-700 border-red-200"
                                                            }`}
                                                        >
                                                            {req.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageRequestPage;
