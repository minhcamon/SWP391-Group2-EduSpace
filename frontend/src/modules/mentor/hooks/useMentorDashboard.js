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
        setClasses(data);
      });
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách lớp học!");
    }
  }, [user]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    isLoading,
    isSubmitting,
    refreshClasses: fetchClasses
  };
};

export default useMentorDashboard;
