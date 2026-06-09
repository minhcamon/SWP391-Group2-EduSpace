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
import { useAuth } from "@/contexts/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const Courses = () => {
    const { user } = useAuth();
    const [pendingCourses, setPendingCourses] = useState([]);
    const [courseRequestsHistory, setCourseRequestsHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    useEffect(() => {
        fetchPendingCourses();
        fetchCourseRequestsHistory();
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

    const fetchCourseRequestsHistory = async () => {
        await runWithLoading(setIsLoading, async () => {
            try {
                const data = await courseService.getCourseRequestsHistory();
                setCourseRequestsHistory(data);
            } catch (error) {
                console.error(
                    "Lỗi khi lấy lịch sử duyệt khóa học tại Courses: ",
                    error,
                );
                toast.error("Lỗi khi tải lịch sử duyệt khóa học");
            }
        });
    };

    const handleReload = () => {
        fetchPendingCourses();
        fetchCourseRequestsHistory();
    };

    const handleApprove = async (courseId) => {
        try {
            await courseService.approveCourse(courseId);

            toast.success("Duyệt khóa học thành công");

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== courseId),
            );

            handleReload();
        } catch (error) {
            console.error(
                "Lỗi khi duyệt khóa học thành công tại Courses: ",
                error,
            );
            toast.error("Lỗi khi duyệt khóa học");
        }
    };

    const handleRejectClick = (courseId) => {
        setSelectedCourseId(courseId);
        setRejectReason("");
        setIsRejectDialogOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectReason.trim()) {
            toast.warning("Vui lòng nhập lý do từ chối khóa học!");
            return;
        }

        try {
            setIsSubmittingReject(true);
            const payload = {
                reason: rejectReason.trim(),
                adminId: user.id,
            };

            await courseService.rejectCourse(selectedCourseId, payload);

            toast.success("Từ chối khóa học thành công");

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== selectedCourseId),
            );

            setIsRejectDialogOpen(false);
            setSelectedCourseId(null);
            setRejectReason("");

            handleReload();
        } catch (error) {
            console.error("Lỗi lấy khóa học từ chối tại Courses: ", error);
            toast.error("Lỗi khi từ chối khóa học");
        } finally {
            setIsSubmittingReject(false);
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
                    <ReloadButton action={handleReload} isLoading={isLoading} />
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
                            onRejectClick={handleRejectClick}
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
                    {courseRequestsHistory.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            description="Lịch sử trống. Không có lịch sử duyệt khóa học nào."
                        />
                    ) : (
                        <CourseTable
                            courses={courseRequestsHistory}
                            isHistory={true}
                        />
                    )}
                </div>

                <Dialog
                    open={isRejectDialogOpen}
                    onOpenChange={setIsRejectDialogOpen}
                >
                    <DialogContent className="sm:max-w-120 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                Lý do từ chối khóa học
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm leading-relaxed">
                                Vui lòng nhập lý do cụ thể từ chối phê duyệt
                                khóa học này.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <Textarea
                                value={rejectReason}
                                onChange={(e) =>
                                    setRejectReason(e.target.value)
                                }
                                placeholder="Ví dụ: Khóa học còn quá sơ sài, thiếu bài tập thực hành chương 3..."
                                className="min-h-30 rounded-xl border border-gray-200 focus-visible:ring-indigo-500 text-sm p-3 leading-relaxed"
                                disabled={isSubmittingReject}
                            />
                        </div>

                        <div className="flex gap-3 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsRejectDialogOpen(false)}
                                disabled={isSubmittingReject}
                                className="rounded-xl font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                            >
                                Hủy bỏ
                            </Button>

                            <Button
                                type="button"
                                onClick={handleConfirmReject}
                                disabled={isSubmittingReject}
                                className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/10 cursor-pointer"
                            >
                                {isSubmittingReject
                                    ? "Đang xử lý..."
                                    : "Xác nhận từ chối"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default Courses;
