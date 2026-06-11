import { useEffect } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, Inbox, History } from "lucide-react";
import CourseTable from "@/modules/admin/components/course/CourseTable";
import ReloadButton from "@/components/ui/ReloadButton";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import useCourse from "@/modules/admin/hooks/useCourse";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import CourseRejectDialog from "@/modules/admin/components/course/CourseRejectDialog";
import CoursesPage from "@/modules/admin/pages/CoursesPage";

const Courses = () => {
    // const { user } = useAuth();

    // const {
    //     pendingCourses,
    //     courseRequestsHistory,
    //     rejectReason,
    //     isRejectDialogOpen,
    //     isSubmittingReject,
    //     isLoading,
    //     setIsRejectDialogOpen,
    //     setRejectReason,
    //     fetchPendingCourses,
    //     fetchCourseRequestsHistory,
    //     handleApprove,
    //     handleConfirmReject,
    //     handleRejectClick,
    // } = useCourse("Admin Courses", user.id);

    // useEffect(() => {
    //     fetchPendingCourses();
    //     fetchCourseRequestsHistory();
    // }, [fetchPendingCourses, fetchCourseRequestsHistory]);

    // const handleReload = () => {
    //     fetchPendingCourses();
    //     fetchCourseRequestsHistory();
    // };

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <CoursesPage />
            </main>
        </div>
    );
};

export default Courses;
