import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, Inbox, Clock } from "lucide-react";
import CourseTable from "@/components/admin/CourseTable";
import { toast } from "sonner";

const MOCK_COURSES_DB = [
    {
        id: 1,
        title: "Lập trình Java Web với Spring Boot nâng cao",
        creator_id: 101,
        status: "PENDING",
        created_at: "2026-05-30T10:00:00Z",
    },
    {
        id: 2,
        title: "Cấu trúc dữ liệu & Giải thuật ứng dụng",
        creator_id: 102,
        status: "PENDING",
        created_at: "2026-05-30T11:15:00Z",
    },
    {
        id: 3,
        title: "Thiết kiến trúc hệ thống Microservices",
        creator_id: 101,
        status: "PUBLISHED",
        created_at: "2026-05-29T08:00:00Z",
    },
];

const CourseManagementPage = () => {
    const [courses, setCourses] = useState(MOCK_COURSES_DB);

    const handleProcessCourse = (courseId, actionType) => {
        const finalStatus =
            actionType === "APPROVED" ? "PUBLISHED" : "REJECTED";
        const confirmCheck = window.confirm(
            `Xác nhận xử lý khóa học #${courseId} với trạng thái: ${finalStatus}?`,
        );
        if (!confirmCheck) return;

        setCourses((prev) =>
            prev.map((c) =>
                c.id === courseId ? { ...c, status: finalStatus } : c,
            ),
        );
        toast.success(`Cập nhật trạng thái Course #${courseId} thành công!`);
    };

    const pendingCourses = courses.filter((c) => c.status === "PENDING");
    const historyCourses = courses.filter(
        (c) => c.status === "PUBLISHED" || c.status === "REJECTED",
    );

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-secondary tracking-tight">
                        Hệ thống kiểm duyệt khóa học
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Quản lý khóa học và Lịch sử duyệt khóa học
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <ClipboardList size={20} className="text-amber-500" />
                        <h2 className="text-lg font-bold">
                            Khóa học chờ duyệt
                        </h2>
                    </div>
                    {pendingCourses.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                            <Inbox
                                size={32}
                                className="text-gray-300 mx-auto mb-2"
                            />
                            <p className="text-gray-500 text-sm font-medium">
                                Hàng chờ trống. Không có khóa học nào cần xử lý.
                            </p>
                        </div>
                    ) : (
                        <CourseTable
                            data={pendingCourses}
                            isHistory={false}
                            onAction={handleProcessCourse}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <ClipboardList size={20} className="text-indigo-600" />
                        <h2 className="text-lg font-bold">
                            Nhật ký quyết định
                        </h2>
                    </div>
                    {historyCourses.length === 0 ? (
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
                        <CourseTable data={historyCourses} isHistory={true} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default CourseManagementPage;
