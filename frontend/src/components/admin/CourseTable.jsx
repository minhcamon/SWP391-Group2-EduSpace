import { Check, X, BookOpen } from "lucide-react";
import { statusMapping } from "@/lib/data";

const CourseTable = ({ data, isHistory = false, onAction }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6 w-24">ID Khóa</th>
                            <th className="py-4 px-6 w-96">
                                Cấu trúc Khóa học
                            </th>
                            <th className="py-4 px-6 w-48">Ngày gửi yêu cầu</th>
                            <th className="py-4 px-6 w-32 text-center">
                                Trạng thái
                            </th>
                            {!isHistory && (
                                <th className="py-4 px-6 w-52 text-center">
                                    Tác vụ
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
                        {data.map((course) => {
                            const isPublished = course.status === "PUBLISHED";
                            return (
                                <tr
                                    key={course.id}
                                    className={`transition-colors ${
                                        isHistory
                                            ? isPublished
                                                ? "bg-emerald-50/20 hover:bg-emerald-50/40"
                                                : "bg-red-50/10 hover:bg-red-50/20"
                                            : "hover:bg-gray-50/40"
                                    }`}
                                >
                                    <td className="py-5 px-6 font-bold text-gray-900">
                                        #{course.id}
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2">
                                            <BookOpen
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {course.title}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Mã Giảng viên:{" "}
                                                    {course.creator_id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-gray-500">
                                        {new Date(
                                            course.created_at,
                                        ).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                isHistory
                                                    ? isPublished
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                    : "bg-amber-50 text-amber-600 border-amber-200/50"
                                            }`}
                                        >
                                            {statusMapping[course.status] ||
                                                course.status}
                                        </span>
                                    </td>
                                    {!isHistory && (
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        onAction(
                                                            course.id,
                                                            "APPROVED",
                                                        )
                                                    }
                                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                                                >
                                                    <Check size={14} /> Duyệt
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onAction(
                                                            course.id,
                                                            "REJECTED",
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

export default CourseTable;
