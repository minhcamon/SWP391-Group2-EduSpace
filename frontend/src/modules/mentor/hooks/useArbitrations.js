import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useArbitrations = () => {
  const [arbitrations, setArbitrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchArbitrations = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getArbitrations();
        setArbitrations(data || []);
      });
    } catch (err) {
      toast.error("Không thể tải danh sách khiếu nại chấm điểm!");
    }
  };

  useEffect(() => {
    fetchArbitrations();
  }, []);

  const filtered = arbitrations
    .filter((a) => activeTab === "ALL" || a.status === activeTab)
    .filter(
      (a) =>
        a?.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        a?.submissionTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a?.reporterName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return {
    arbitrations,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filtered,
    refreshArbitrations: fetchArbitrations
  };
};

export default useArbitrations;
