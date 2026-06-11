import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import ReloadButton from "@/components/ui/ReloadButton";
import Stat from "@/modules/admin/components/dashboard/Stat";
import useCourse from "../hooks/useCourse";
import PendingCourseList from "../components/course/PendingCourseList";
import CourseRejectDialog from "../components/course/CourseRejectDialog";
import { useAuth } from "@/contexts/AuthContext";
import RequestRejectDialog from "../components/request/RequestRejectDialog";
import PendingRequestList from "../components/request/PendingRequestList";
import useRequest from "../hooks/useRequest";
import { useEffect } from "react";

const MOCK_RECENT_COURSES = [
    {
        id: 101,
        title: "Xây dựng Kiến trúc Cloud Native với AWS & Kubernetes",
        creatorFullName: "Hoàng Long Vũ",
        createdAt: "2026-06-10T08:30:00Z",
        status: "PENDING",
    },
    {
        id: 102,
        title: "Làm chủ Docker & CI/CD Pipeline cho Lập trình viên",
        creatorFullName: "Phạm Thành Nam",
        createdAt: "2026-06-09T14:20:00Z",
        status: "PENDING",
    },
    {
        id: 103,
        title: "Phát triển Ứng dụng Di động với Flutter",
        creatorFullName: "Đỗ Thùy Linh",
        createdAt: "2026-06-08T09:15:00Z",
        status: "PENDING",
    },
];

const MOCK_CREATOR_REQUESTS = [
    {
        id: 1,
        user_id: 201,
        full_name: "Nguyễn Văn Minh",
        email: "minhnn@fe.edu.vn",
        document_urls:
            "Em đã hoàn thành khóa Java Web với điểm số 9.0. Có 6 tháng kinh nghiệm làm trợ giảng thực tế...",
        status: "PENDING",
        created_at: "2026-06-10T10:00:00Z",
    },
    {
        id: 2,
        user_id: 205,
        full_name: "Trần Thu Hà",
        email: "hatt@fe.edu.vn",
        document_urls:
            "Điểm tổng kết môn Kiểm thử tự động đạt 8.5. Đủ quỹ thời gian rảnh rỗi vào buổi tối để hỗ trợ học viên...",
        status: "PENDING",
        created_at: "2026-06-10T11:15:00Z",
    },
];

const DashboardPage = () => {
    const { user } = useAuth();
    const {
        publisedCourses,
        pendingCourses,
        isRejectDialogOpen: isCourseRejectOpen,
        isSubmittingReject: isSubmittingCourseReject,
        rejectReason: courseRejectReason,
        setIsRejectDialogOpen: setIsCourseRejectOpen,
        setRejectReason: setCourseRejectReason,
        fetchPublisedCourses,
        fetchPendingCourses,
        handleApprove: handleApproveCourse,
        handleConfirmReject: handleConfirmCourseReject,
        handleRejectClick: handleCourseRejectClick,
    } = useCourse("Admin Dashboard", user.id);

    const {
        pendingRequests,
        isRejectDialogOpen: isRequestRejectOpen,
        isSubmittingReject: isSubmittingRequestReject,
        rejectReason: requestRejectReason,
        setIsRejectDialogOpen: setIsRequestRejectOpen,
        setRejectReason: setRequestRejectReason,
        fetchPendingRequests,
        handleApprove: handleApproveRequest,
        handleConfirmReject: handleConfirmRequestReject,
        handleRejectClick: handleRequestRejectClick,
    } = useRequest("Admin Dashboard");

    const stats = {
        publisedCoursesLength: publisedCourses.length,
        pendingCoursesLength: pendingCourses.length,
        pendingRequestsLength: pendingRequests.length,
    };

    useEffect(() => {
        fetchPublisedCourses();
        fetchPendingCourses();
        fetchPendingRequests();
    }, [fetchPendingCourses, fetchPublisedCourses, fetchPendingRequests]);

    const handleReload = () => {
        fetchPublisedCourses()
        fetchPendingCourses();
        fetchPendingRequests();
    };

    return (
        <>
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-secondary">
                        Trang quản trị viên
                    </CardTitle>
                    <CardDescription>
                        Chào mừng đến với hệ thống quản trị EduSpace
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat pendingCourses={pendingCourses} stats={stats} />
            </div>

            <div className="flex justify-end">
                <ReloadButton action={handleReload} />
            </div>

            <div className="flex flex-col gap-8">
                <PendingCourseList
                    pendingCourses={pendingCourses}
                    handleApprove={handleApproveCourse}
                    handleRejectClick={handleCourseRejectClick}
                />
            </div>

            <div className="flex flex-col gap-8">
                <PendingRequestList
                    pendingRequests={pendingRequests}
                    handleApprove={handleApproveRequest}
                    handleRejectClick={handleRequestRejectClick}
                />
            </div>

            <CourseRejectDialog
                isRejectDialogOpen={isCourseRejectOpen}
                isSubmittingReject={isSubmittingCourseReject}
                rejectReason={courseRejectReason}
                setIsRejectDialogOpen={setIsCourseRejectOpen}
                setRejectReason={setCourseRejectReason}
                handleConfirmReject={handleConfirmCourseReject}
            />

            <RequestRejectDialog
                isRejectDialogOpen={isRequestRejectOpen}
                isSubmittingReject={isSubmittingRequestReject}
                setIsRejectDialogOpen={setIsRequestRejectOpen}
                setRejectReason={setRequestRejectReason}
                rejectReason={requestRejectReason}
                handleConfirmReject={handleConfirmRequestReject}
            />
        </>
    );
};

export default DashboardPage;
