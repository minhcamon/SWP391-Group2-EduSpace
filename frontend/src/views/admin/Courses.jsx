import { useEffect } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, Inbox, History } from "lucide-react";
import CourseTable from "@/modules/course-lifecycle/components/CourseTable";
import ReloadButton from "@/components/ui/ReloadButton";
import CardInformation from "@/components/ui/CardInformation";
import EmptyState from "@/components/ui/EmptyState";
import useCourse from "@/modules/admin/hooks/useCourse";

const Courses = () => {
    const {
        pendingCourses,
        isLoading,
        fetchPendingCourses,
        handleApprove,
        handleReject,
    } = useCourse("Admin Courses");

    useEffect(() => {
        fetchPendingCourses();
    }, [fetchPendingCourses]);

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <CardInformation description="Quản lý khóa học và Lịch sử duyệt khóa học">
                    <h1 className="text-secondary">Kiểm duyệt khóa học</h1>
                </CardInformation>

                <div className="flex justify-end">
                    <ReloadButton
                        action={fetchPendingCourses}
                        isLoading={isLoading}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <ClipboardList size={20} className="text-primary" />
                        <h2 className="text-lg font-bold">
                            Khóa học chờ duyệt
                        </h2>
                    </div>
                    {pendingCourses.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            description="Hàng chờ trống. Không có khóa học nào cần xử lý."
                        />
                    ) : (
                        <CourseTable
                            courses={pendingCourses}
                            isHistory={false}
                            onApproveClick={handleApprove}
                            onRejectClick={handleReject}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <History size={20} className="text-tertiary" />
                        <h2 className="text-lg font-bold">
                            Lịch sử duyệt khóa học
                        </h2>
                    </div>
                    {pendingCourses.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            description="Lịch sử trống. Không có lịch sử duyệt khóa học nào."
                        />
                    ) : (
                        <CourseTable
                            courses={pendingCourses}
                            isHistory={false}
                            onApproveClick={handleApprove}
                            onRejectClick={handleReject}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Courses;
