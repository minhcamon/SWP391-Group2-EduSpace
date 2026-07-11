import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchIncidents = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getIncidents();
        setIncidents(data || []);
      });
    } catch (err) {
      toast.error("Không thể tải danh sách sự cố!");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleClaim = async (id, e) => {
    if (e) e.preventDefault();
    try {
      await mentorService.claimIncident(id);
      toast.success("Nhận xử lý sự cố thành công!");
      fetchIncidents();
    } catch (err) {
      toast.error(err.message || "Lỗi khi nhận xử lý sự cố!");
    }
  };

  const filtered = incidents
    .filter((inc) => activeTab === "ALL" || inc.status === activeTab)
    .filter(
      (inc) =>
        inc.id.toString().includes(searchQuery) ||
        (inc.incidentType && inc.incidentType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inc.reporterName && inc.reporterName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inc.reason && inc.reason.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return {
    incidents,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filtered,
    handleClaim,
    refreshIncidents: fetchIncidents
  };
};

export default useIncidents;
