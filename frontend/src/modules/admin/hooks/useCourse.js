import courseService from "@/services/courseService";
import { runWithLoading } from "@/utils/utils";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useCourse = (usingPage, adminId) => {
    const [pendingCourses, setPendingCourses] = useState([]);
    const [publisedCourses, setPublisedCourses] = useState([]);
    const [courseRequestsHistory, setCourseRequestsHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    const fetchPendingCourses = useCallback(async () => {
        await runWithLoading(setIsLoading, async () => {
            try {
                const data = await courseService.getPendingCourses();
                setPendingCourses(data);
            } catch (error) {
                console.error(
                    `Lỗi khi lấy khóa học Pending tại ${usingPage}: `,
                    error,
                );
                toast.error("Lỗi khi tải khóa học");
            }
        });
    }, [usingPage])

    const fetchPublisedCourses = useCallback(async () => {
        await runWithLoading(setIsLoading, async () => {
            try {
                const data = await courseService.getPublishedCourses();
                setPublisedCourses(data);
            } catch (error) {
                console.error(
                    `Lỗi khi lấy khóa học công khai tại ${usingPage}: `,
                    error,
                );
                toast.error("Lỗi khi lấy khóa học");
            }
        })
    }, [usingPage])

    const fetchCourseRequestsHistory = useCallback(async () => {
        await runWithLoading(setIsLoading, async () => {
            try {
                const data = await courseService.getCourseRequestsHistory();
                setCourseRequestsHistory(data);
            } catch (error) {
                console.error(
                    `Lỗi khi lấy lịch sử duyệt khóa học tại ${usingPage}: `,
                    error,
                );
                toast.error("Lỗi khi tải lịch sử duyệt khóa học");
            }
        });
    }, [usingPage])

    const handleApprove = useCallback(async (courseId) => {
        try {
            await courseService.approveCourse(courseId);

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== courseId),
            );
            
            fetchPublisedCourses()
            fetchCourseRequestsHistory()

            toast.success("Duyệt khóa học thành công");
        } catch (error) {
            console.error(
                `Lỗi khi duyệt khóa học tại ${usingPage}: `,
                error,
            );
            toast.error("Lỗi khi duyệt khóa học");
        }
    }, [usingPage, fetchCourseRequestsHistory])

    const handleRejectClick = useCallback((courseId) => {
        setSelectedCourseId(courseId);
        setRejectReason("");
        setIsRejectDialogOpen(true);
    }, [])

    const handleConfirmReject = useCallback(async () => {
        if (!rejectReason.trim()) {
            toast.warning("Vui lòng nhập lý do từ chối khóa học!");
            return;
        }

        try {
            setIsSubmittingReject(true);
            const payload = {
                reason: rejectReason.trim(),
                adminId: adminId,
            };

            await courseService.rejectCourse(selectedCourseId, payload);

            toast.success("Từ chối khóa học thành công");

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== selectedCourseId),
            );

            fetchCourseRequestsHistory()

            setIsRejectDialogOpen(false);
            setSelectedCourseId(null);
            setRejectReason("");

        } catch (error) {
            console.error(`Lỗi khi từ chối khóa học tại ${usingPage}: `, error);
            toast.error("Lỗi khi từ chối khóa học");
        } finally {
            setIsSubmittingReject(false);
        }
    }, [adminId, rejectReason, selectedCourseId, fetchCourseRequestsHistory, usingPage])

    return {
        pendingCourses,
        publisedCourses,
        courseRequestsHistory,
        rejectReason,
        isRejectDialogOpen,
        isSubmittingReject,
        isLoading,
        setIsRejectDialogOpen,
        setRejectReason,
        fetchPendingCourses,
        fetchPublisedCourses,
        fetchCourseRequestsHistory,
        handleApprove,
        handleConfirmReject,
        handleRejectClick
    }
}

export default useCourse