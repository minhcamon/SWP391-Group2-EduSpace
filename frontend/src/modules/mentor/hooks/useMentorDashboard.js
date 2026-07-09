import { useState, useEffect, useCallback } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useMentorDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getMentorClasses();
        const filtered = data.filter((c) => 
          user?.role === "CREATOR" || 
          user?.role === "ADMIN" ||
          (c.id === "L04" && user?.username === "mentor1") ||
          (c.id === "L05" && user?.username === "mentor2")
        );
        setClasses(filtered);
      });
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách lớp học!");
    }
  }, [user]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleStartClass = async () => {
    try {
      await runWithLoading(setIsSubmitting, async () => {
        const response = await mentorService.startNewClass();
        toast.success(response.message || "Bắt đầu lớp học mới thành công!");
        // Refresh list
        await fetchClasses();
      });
    } catch (error) {
      toast.error(error.message || "Lỗi khi bắt đầu lớp học mới!");
    }
  };

  return {
    classes,
    isLoading,
    isSubmitting,
    handleStartClass,
    refreshClasses: fetchClasses
  };
};

export default useMentorDashboard;
