import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import learnService from "@/services/learnService";
import { runWithLoading } from "@/utils/utils";

const useMyLearning = () => {
    const navigate = useNavigate();

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [activeCourses, setActiveCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);

    // Fetch learning data on mount
    useEffect(() => {
        const fetchLearningData = async () => {
            await runWithLoading(setIsLoading, async () => {
                try {
                    const data = await learnService.getMyLearning();
                    setActiveCourses(data.activeCourses || []);
                    setAvailableCourses(data.availableCourses || []);
                } catch (error) {
                    toast.error(error.message || "Không thể tải thông tin khóa học.");
                }
            });
        };

        fetchLearningData();
    }, []);

    // Action handlers
    const handleContinueLearning = (courseId) => {
        navigate(`/courses/${courseId}/learn`);
    };

    const handleJoinCohort = (courseId, courseTitle) => {
        toast.success(`Đăng ký thành công!`, {
            description: `Bạn đã tham gia vào Cohort của khóa học "${courseTitle}".`
        });
    };

    return {
        isLoading,
        activeCourses,
        availableCourses,
        handleContinueLearning,
        handleJoinCohort
    };
};

export default useMyLearning;
