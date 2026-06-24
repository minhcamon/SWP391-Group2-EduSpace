import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { mockClasses } from "@/lib/mockData";
import { toast } from "sonner";
import waitlistService from "@/services/waitlistService";

export const useClassDetails = (classId) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setIsLoading(true);
        const rawClass = mockClasses[classId] || mockClasses["1"];
        if (rawClass) {
          const urlStatus = searchParams.get("status");
          const finalStatus = urlStatus ? urlStatus.toUpperCase() : rawClass.status;
          const updatedClassData = {
            ...rawClass,
            status: finalStatus,
          };

          if (finalStatus === "WAITING") {
            try {
              const members = await waitlistService.getMembersInWaitlist(rawClass.courseId);
              if (members) {
                updatedClassData.currentStudents = members.length;
                updatedClassData.membersWaiting = members;
              }
            } catch (waitlistErr) {
              console.warn("Failed to fetch waitlist members for class details:", waitlistErr);
            }
          }

          setClassData(updatedClassData);
        } else {
          setError("Không tìm thấy thông tin lớp học.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải thông tin lớp học.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId, searchParams]);

  const addReaction = (feedId, emoji) => {
    setClassData((prev) => {
      if (!prev) return prev;
      const updatedFeed = prev.activeFeed.map((item) => {
        if (item.id === feedId) {
          const updatedReactions = item.reactions.map((r) => {
            if (r.emoji === emoji) {
              return {
                ...r,
                count: r.userReacted ? r.count - 1 : r.count + 1,
                userReacted: !r.userReacted,
              };
            }
            return r;
          });
          return { ...item, reactions: updatedReactions };
        }
        return item;
      });
      return { ...prev, activeFeed: updatedFeed };
    });
  };

  const cancelSearch = async () => {
    try {
      if (!classData || !classData.courseId) {
        toast.error("Không tìm thấy thông tin khóa học để hủy hàng chờ.");
        return;
      }
      await waitlistService.leaveWaitlist(classData.courseId);
      toast.success("Hủy tìm kiếm và rời hàng chờ thành công!");
      navigate(`/courses/${classData.courseId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Hủy hàng chờ thất bại. Vui lòng thử lại!");
    }
  };

  const findStudyBuddy = () => {
    toast.success("Hệ thống đang chạy thuật toán ghép cặp ngẫu nhiên...");
  };

  return {
    classData,
    isLoading,
    error,
    addReaction,
    cancelSearch,
    findStudyBuddy,
  };
};

export default useClassDetails;
