import EmptyState from "@/components/ui/EmptyState";
import { ClipboardList, Inbox } from "lucide-react";
import CourseTable from "@/modules/admin/components/course/CourseTable";

const PendingCourseList = ({
    pendingCourses,
    handleApprove,
    handleRejectClick,
}) => {
    return (
        <>
            <div className="flex items-center gap-2 text-gray-900 px-1">
                <ClipboardList size={20} className="text-primary" />
                <h2 className="text-lg font-bold">Khóa học chờ duyệt</h2>
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
                    onRejectClick={handleRejectClick}
                />
            )}
        </>
    );
};

export default PendingCourseList;
