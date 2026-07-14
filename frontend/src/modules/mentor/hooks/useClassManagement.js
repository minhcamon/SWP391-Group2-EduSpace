import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getMentorClasses();
        setClasses(data || []);
      });
    } catch (err) {
      toast.error("Không thể tải danh sách lớp học!");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((c) =>
    (c.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.courseTitle ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    classes,
    searchQuery,
    setSearchQuery,
    isLoading,
    filteredClasses,
    refreshClasses: fetchClasses
  };
};

export default useClassManagement;
