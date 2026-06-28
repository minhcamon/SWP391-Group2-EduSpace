import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import learnService from "@/services/learnService";
import { runWithLoading } from "@/utils/utils";

const useMyLearning = (usingPage) => {
  const navigate = useNavigate();

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [activeCourses, setActiveCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [myLearningCourses, setMyLearningCourses] = useState([]);

  const fetchMyLearningCourses = useCallback(async () => {
    await runWithLoading(setIsLoading, async () => {
      try {
        const data = await learnService.getMyLearningCourses();
        setMyLearningCourses(data);
      } catch (error) {
        toast.error(
          error.message || `Không thể lấy thông tin khóa học tại ${usingPage}.`,
        );
      }
    });
  }, [usingPage]);

  // Action handlers
  const handleContinueLearning = (courseId) => {
    navigate(`/courses/${courseId}/learn`);
  };

  const handleJoinCohort = (courseId, courseTitle) => {
    toast.success(`Đăng ký thành công!`, {
      description: `Bạn đã tham gia vào Cohort của khóa học "${courseTitle}".`,
    });
  };

  return {
    isLoading,
    activeCourses,
    availableCourses,
    myLearningCourses,
    handleContinueLearning,
    handleJoinCohort,
    fetchMyLearningCourses,
  };
};

export default useMyLearning;
