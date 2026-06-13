import { useState, useEffect } from "react";
import courseService from "@/services/courseService";
import { mockCourses } from "@/lib/mockData";
import { toast } from "sonner";

export const useCourseEnrollment = (courseId) => {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Try to fetch from backend service
        const data = await courseService.getCourseById(courseId);
        if (data) {
          setCourse(data);
        } else {
          throw new Error("No course found in backend response");
        }
      } catch (err) {
        console.warn(
          `useCourseEnrollment: Fallback to mock data for courseId ${courseId} due to:`,
          err.message
        );
        // Fallback to mock data
        const fallbackCourse = mockCourses.find(
          (c) => c.id === parseInt(courseId)
        ) || mockCourses[0];

        if (fallbackCourse) {
          setCourse(fallbackCourse);
        } else {
          setError("Không tìm thấy thông tin khóa học.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const joinCourse = async () => {
    try {
      // Toggle enrollment local state as a mockup workflow
      setIsEnrolled(true);
      toast.success("Đăng ký tham gia khóa học thành công!");
    } catch (err) {
      toast.error("Đăng ký khóa học thất bại. Vui lòng thử lại!");
    }
  };

  return {
    course,
    isLoading,
    error,
    isEnrolled,
    joinCourse,
  };
};

export default useCourseEnrollment;
