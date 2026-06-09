import { useEffect, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, Inbox, History } from "lucide-react";
import CourseTable from "@/modules/course-lifecycle/components/CourseTable";
import { toast } from "sonner";
import courseService from "@/services/courseService";
import ReloadButton from "@/components/ui/ReloadButton";
import CardInformation from "@/components/ui/CardInformation";
import EmptyState from "@/components/ui/EmptyState";
import { runWithLoading } from "@/utils/utils";

const Courses = () => {
    const [pendingCourses, setPendingCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPendingCourses();
    }, []);

    const fetchPendingCourses = async () => {
        await runWithLoading(setIsLoading, async () => {
            try {
                const data = await courseService.getPendingCourses();
                setPendingCourses(data);
            } catch (error) {
                console.error(
                    "Lỗi khi lấy khóa học Pending tại Courses: ",
                    error,
                );
                toast.error("Lỗi khi tải khóa học");
            }
        });
    };

    const handleApprove = async (courseId) => {
        try {
            await courseService.approveCourse(courseId);

            toast.success("Duyệt khóa học thành công");

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== courseId),
            );
        } catch (error) {
            console.error(
                "Lỗi khi duyệt khóa học thành công tại Courses: ",
                error,
            );
            toast.error("Lỗi khi duyệt khóa học");
        }
    };

    const handleReject = async (courseId) => {
        try {
            const payload = {
                reason: "Alo Vu a Vu",
                adminId: 4,
            };

            await courseService.rejectCourse(courseId, payload);

            toast.success("Từ chối khóa học thành công");

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== courseId),
            );
        } catch (error) {
            console.error("Lỗi lấy khóa học từ chối tại Courses: ", error);
            toast.error("Lỗi khi từ chối khóa học");
        }
    };

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
