import { useEffect, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, Inbox } from "lucide-react";
import CourseTable from "@/modules/course-lifecycle/components/CourseTable";
import { toast } from "sonner";
import courseService from "@/services/courseService";
import ReloadButton from "@/components/ui/ReloadButton";
import CardInformation from "@/components/ui/CardInformation";

const Courses = () => {
    const [pendingCourses, setPendingCourses] = useState([]);

    useEffect(() => {
        fetchPendingCourses();
    }, []);

    const fetchPendingCourses = async () => {
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
            console.error(
                "Lỗi lấy khóa học từ chối tại Courses: ",
                error,
            );
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
                    <ReloadButton action={fetchPendingCourses} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <ClipboardList size={20} className="text-primary" />
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
