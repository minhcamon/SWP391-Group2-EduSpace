import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import learnService from "@/services/learnService";
import { runWithLoading } from "@/utils/utils";

const useProgressDashboard = () => {
    const { courseId } = useParams();

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [modules, setModules] = useState([]);
    const [focusModuleId, setFocusModuleId] = useState(null);

    // Fetch Details on Mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            await runWithLoading(setIsLoading, async () => {
                try {
                    // 1. Get in-progress courses to find the classId for this courseId
                    const inProgressCourses = await learnService.getMyLearningCourses();
                    const currentCourse = inProgressCourses.find(
                        (c) => c.courseId.toString() === courseId.toString()
                    );
                    
                    if (!currentCourse) {
                        throw new Error("Bạn chưa tham gia lớp học nào cho khóa học này.");
                    }
                    
                    const classId = currentCourse.classId;

                    // 2. Fetch the real dashboard data using classId
                    const data = await learnService.getProgressDashboard(classId);
                    setModules(data.modules || []);
                    setFocusModuleId(data.focusModuleId);
                } catch (error) {
                    toast.error(error.message || "Không thể tải thông tin tiến độ nhóm.");
                }
            });
        };

        if (courseId) {
            fetchDashboardData();
        }
    }, [courseId]);

    // Tìm Module đang học (bằng focusModuleId của backend, hoặc IN_PROGRESS, hoặc module đầu tiên)
    const currentModule = modules.find((m) => m.id === focusModuleId) || modules.find((m) => m.status === "IN_PROGRESS") || modules[0];

    // Đối tác đồng hành nằm ở trong module tiêu điểm hiện tại
    const partner = currentModule?.partner || null;

    const handleSayHi = () => {
        toast.success(`Đã gửi lời chào đến ${partner?.name || "bạn đồng hành"}!`, {
            description: `${partner?.name || "Bạn đồng hành"} sẽ nhận được thông báo chào hỏi của bạn.`
        });
    };

    return {
        isLoading,
        partner,
        modules,
        currentModule,
        handleSayHi,
        courseId
    };
};

export default useProgressDashboard;
