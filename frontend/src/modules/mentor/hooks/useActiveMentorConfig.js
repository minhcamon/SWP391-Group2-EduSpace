import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useActiveMentorConfig = () => {
    const [activeCourses, setActiveCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submittingCourseId, setSubmittingCourseId] = useState(null);
    const [updatingCourseId, setUpdatingCourseId] = useState(null);

    const fetchActiveCourses = async () => {
        try {
            await runWithLoading(setIsLoading, async () => {
                const data = await mentorService.getActiveCourses();
                setActiveCourses(data || []);
            });
        } catch (err) {
            toast.error(err.message || "Không thể tải cấu hình giảng dạy!");
        }
    };

    const handleRegisterActiveCourse = async (courseId) => {
        if (submittingCourseId) return;
        setSubmittingCourseId(courseId);
        try {
            await mentorService.registerActiveCourse(courseId);
            toast.success("Đăng ký nhận lớp giảng dạy thành công!");
            await fetchActiveCourses();
        } catch (err) {
            toast.error(err.message || "Đăng ký nhận lớp thất bại!");
        } finally {
            setSubmittingCourseId(null);
        }
    };

    const handleUpdateActiveCourseStatus = async (courseId, status) => {
        if (updatingCourseId) return;
        setUpdatingCourseId(courseId);
        try {
            await mentorService.updateActiveCourseStatus(courseId, status);
            toast.success("Cập nhật trạng thái hoạt động thành công!");
            await fetchActiveCourses();
        } catch (err) {
            toast.error(err.message || "Cập nhật trạng thái thất bại!");
        } finally {
            setUpdatingCourseId(null);
        }
    };

    useEffect(() => {
        fetchActiveCourses();
    }, []);

    return {
        activeCourses,
        isLoading,
        submittingCourseId,
        updatingCourseId,
        handleRegisterActiveCourse,
        handleUpdateActiveCourseStatus,
        refresh: fetchActiveCourses
    };
};

export default useActiveMentorConfig;
