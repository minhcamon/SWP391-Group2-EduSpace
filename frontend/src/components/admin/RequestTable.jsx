import { User, Mail, Check, X } from "lucide-react";
import { statusMapping } from "@/lib/data";

const RequestTable = ({
    requests,
    isHistory = false,
    onApprovedClick,
    onRejectClick,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6 w-24">ID Đơn</th>
                            <th className="py-4 px-6 w-72">Ứng viên</th>
                            <th className="py-4 px-6">
                                Đơn trình bày / Minh chứng
                            </th>
                            <th className="py-4 px-5 w-32 text-center">
                                Trạng thái
                            </th>
                            {!isHistory && (
                                <th className="py-4 px-6 w-52 text-right">
                                    Tác vụ
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
                        {requests.map((request) => {
                            const isApproved = request.status === "APPROVED";
                            return (
                                <tr
                                    key={request.requestId}
                                    className={`transition-colors ${
                                        isHistory
                                            ? isApproved
                                                ? "bg-emerald-50/20 hover:bg-emerald-50/40"
                                                : "bg-red-50/10 hover:bg-red-50/20"
                                            : "hover:bg-gray-50/40"
                                    }`}
                                >
                                    <td className="py-5 px-6 font-bold text-gray-900">
                                        #{request.requestId}
                                    </td>
                                    <td className="py-5 px-6 space-y-1">
                                        <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                                            <User
                                                size={14}
                                                className="text-gray-400"
                                            />{" "}
                                            {request.learnerName}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Mail
                                                size={14}
                                                className="text-gray-400"
                                            />{" "}
                                            {request.learnerEmail}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed max-w-2xl text-sm">
                                            {request.documentUrl}
                                        </p>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                isHistory
                                                    ? isApproved
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                    : "bg-amber-50 text-amber-600 border-amber-200/50"
                                            }`}
                                        >
                                            {statusMapping[request.status] ||
                                                request.status}
                                        </span>
                                    </td>
                                    {!isHistory && (
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        onApprovedClick(
                                                            request.requestId,
                                                        )
                                                    }
                                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                                                >
                                                    <Check size={14} /> Duyệt
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onRejectClick(
                                                            request.requestId,
                                                        )
                                                    }
                                                    className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 font-semibold py-2 px-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                                                >
                                                    <X size={14} /> Từ chối
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequestTable;
