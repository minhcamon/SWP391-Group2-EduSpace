import { useState, useEffect } from "react";
import courseService from "@/services/courseService";
import waitlistService from "@/services/waitlistService";
import { useAuth } from "@/contexts/AuthContext";
import { mockCourses } from "@/lib/mockData";
import { toast } from "sonner";

export const useCourseEnrollment = (courseId) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [waitlistMembers, setWaitlistMembers] = useState([]);
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

        // Fetch waitlist members
        try {
          const members = await waitlistService.getMembersInWaitlist(courseId);
          const membersList = members || [];
          setWaitlistMembers(membersList);
          
          if (user && membersList.length > 0 && user.id) {
            const enrolled = membersList.some(m => m.id.toString() === user.id.toString());
            setIsEnrolled(enrolled);
          } else {
            setIsEnrolled(true); // Nếu API trả về thành công nghĩa là user hiện tại đã có trong waitlist
          }
        } catch (waitlistErr) {
          console.warn("Failed to fetch waitlist members:", waitlistErr);
          setWaitlistMembers([]);
          setIsEnrolled(false);
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
          // Set fallback waitlist members
          setWaitlistMembers([
            { id: 101, fullName: "Nguyễn Văn A", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" },
            { id: 102, fullName: "Trần Thị B", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" }
          ]);
          setIsEnrolled(false);
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
  }, [courseId, user]);

  const joinCourse = async () => {
    try {
      await waitlistService.enrollWaitlist(courseId);
      toast.success("Đăng ký tham gia hàng chờ thành công!");
      setIsEnrolled(true);
      
      // Refresh waitlist members
      try {
        const members = await waitlistService.getMembersInWaitlist(courseId);
        setWaitlistMembers(members || []);
      } catch (err) {
        console.error("Failed to refresh waitlist members:", err);
      }
    } catch (err) {
      toast.error(err.message || "Đăng ký hàng chờ thất bại. Vui lòng thử lại!");
    }
  };

  const leaveCourse = async () => {
    try {
      await waitlistService.leaveWaitlist(courseId);
      toast.success("Rời hàng chờ thành công!");
      setIsEnrolled(false);
      
      // Refresh waitlist members
      try {
        const members = await waitlistService.getMembersInWaitlist(courseId);
        setWaitlistMembers(members || []);
      } catch (err) {
        console.error("Failed to refresh waitlist members:", err);
      }
    } catch (err) {
      toast.error(err.message || "Rời hàng chờ thất bại. Vui lòng thử lại!");
    }
  };

  return {
    course,
    waitlistMembers,
    isLoading,
    error,
    isEnrolled,
    joinCourse,
    leaveCourse,
  };
};

export default useCourseEnrollment;
