import CourseRejectDialog from "@/modules/admin/components/course/CourseRejectDialog";
import ReloadButton from "@/components/ui/ReloadButton";
import useCourse from "@/modules/admin/hooks/useCourse";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import PendingCourseList from "@/modules/admin/components/course/PendingCourseList";
import CourseRequestsHistory from "@/modules/admin/components/course/CourseRequestsHistory";

const CoursesPage = () => {
    const { user } = useAuth();

    const {
        pendingCourses,
        courseRequestsHistory,
        rejectReason,
        isRejectDialogOpen,
        isSubmittingReject,
        isLoading,
        setIsRejectDialogOpen,
        setRejectReason,
        fetchPendingCourses,
        fetchCourseRequestsHistory,
        handleApprove,
        handleConfirmReject,
        handleRejectClick,
    } = useCourse("Admin Courses", user.id);

    useEffect(() => {
        fetchPendingCourses();
        fetchCourseRequestsHistory();
    }, [fetchPendingCourses, fetchCourseRequestsHistory]);

    const handleReload = () => {
        fetchPendingCourses();
        fetchCourseRequestsHistory();
    };

    return (
        <div>
            <Card className="p-6 bg-white border border-gray-200 shadow-sm ">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-secondary">
                        Kiểm duyệt khóa học
                    </CardTitle>
                    <CardDescription>
                        Quản lý khóa học và Lịch sử duyệt khóa học
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex justify-end mt-8">
                <ReloadButton action={handleReload} isLoading={isLoading} />
            </div>

            <div className="space-y-4 mt-8">
                <PendingCourseList
                    pendingCourses={pendingCourses}
                    handleApprove={handleApprove}
                    handleRejectClick={handleRejectClick}
                />
            </div>

            <div className="space-y-4 mt-8">
                <CourseRequestsHistory
                    courseRequestsHistory={courseRequestsHistory}
                />
            </div>

            <CourseRejectDialog
                isRejectDialogOpen={isRejectDialogOpen}
                isSubmittingReject={isSubmittingReject}
                rejectReason={rejectReason}
                setIsRejectDialogOpen={setIsRejectDialogOpen}
                setRejectReason={setRejectReason}
                handleConfirmReject={handleConfirmReject}
            />
        </div>
    );
};

export default CoursesPage;
