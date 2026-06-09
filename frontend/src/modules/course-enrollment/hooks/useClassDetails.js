import { useState, useEffect } from "react";
import { useSearchParams } from "react-router"; // react-router-dom v6/7 usually uses useSearchParams
import { mockClasses } from "@/lib/mockData";
import { toast } from "sonner";

export const useClassDetails = (classId) => {
  const [searchParams] = useSearchParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    // Fetch mock class data
    const rawClass = mockClasses[classId] || mockClasses["1"];
    if (rawClass) {
      // Allow URL override for testing: ?status=active or ?status=waiting
      const urlStatus = searchParams.get("status");
      const finalStatus = urlStatus ? urlStatus.toUpperCase() : rawClass.status;
      
      setClassData({
        ...rawClass,
        status: finalStatus,
      });
    } else {
      setError("Không tìm thấy thông tin lớp học.");
    }
    setIsLoading(false);
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

  const cancelSearch = () => {
    toast.info("Đã hủy tìm kiếm lớp học ghép cặp.");
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
