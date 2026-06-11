import courseService from "@/services/courseService";
import { runWithLoading } from "@/utils/utils";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const usePendingCourse = (usingPage) => {
    const [pendingCourses, setPendingCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleApprove = useCallback(async (courseId) => {
        try {
            await courseService.approveCourse(courseId);

            toast.success("Duyệt khóa học thành công");

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== courseId),
            );
        } catch (error) {
            console.error(
                `Lỗi khi duyệt khóa học tại ${usingPage}: `,
                error,
            );
            toast.error("Lỗi khi duyệt khóa học");
        }
    }, [usingPage])

    const handleReject = useCallback(async (courseId) => {
        try {
            const payload = {
                reason: "Alo Vu a Vu",
                adminId: 4,
            };

            await courseService.rejectCourse(courseId, payload);

            toast.success("Đã từ chối khóa học");

            setPendingCourses((prevCourse) =>
                prevCourse.filter((course) => course.id !== courseId),
            );
        } catch (error) {
            console.error(`Lỗi từ chối khóa học tại ${usingPage}: `, error);
            toast.error("Lỗi khi từ chối khóa học");
        }
    }, [usingPage])

    return {
        pendingCourses,
        isLoading,
        fetchPendingCourses,
        handleApprove,
        handleReject
    }
}

export default usePendingCourse