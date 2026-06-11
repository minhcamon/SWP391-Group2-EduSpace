import CourseTable from "@/modules/admin/components/course/CourseTable";
import EmptyState from "@/components/ui/EmptyState";
import { History, Inbox } from "lucide-react";

const CourseRequestsHistory = ({ courseRequestsHistory }) => {
    return (
        <>
            <div className="flex items-center gap-2 text-gray-900 px-1">
                <History size={20} className="text-tertiary" />
                <h2 className="text-lg font-bold">Lịch sử duyệt khóa học</h2>
            </div>
            {courseRequestsHistory.length === 0 ? (
                <EmptyState
                    icon={Inbox}
                    description="Lịch sử trống. Không có lịch sử duyệt khóa học nào."
                />
            ) : (
                <CourseTable courses={courseRequestsHistory} isHistory={true} />
            )}
        </>
    );
};

export default CourseRequestsHistory;
