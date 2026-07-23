import { useState, useCallback, useEffect } from "react";
import mentorService from "@/services/mentorService";
import learnService from "@/services/learnService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

const useMyIncidents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Detail Modal state
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchMyIncidents = useCallback(async () => {
    await runWithLoading(setIsLoading, async () => {
      try {
        const data = await learnService.getMyIncidents();
        setIncidents(data || []);
      } catch (error) {
        toast.error(error.message || "Không thể tải danh sách khiếu nại của bạn!");
      }
    });
  }, []);

  // Fetch incident detail when selectedIncidentId changes
  useEffect(() => {
    if (selectedIncidentId) {
      const getDetail = async () => {
        try {
          setDetailLoading(true);
          const data = await mentorService.getIncidentById(selectedIncidentId);
          setDetailData(data);
        } catch (error) {
          toast.error(error.message || "Không thể tải chi tiết khiếu nại!");
          setSelectedIncidentId(null);
        } finally {
          setDetailLoading(false);
        }
      };
      getDetail();
    } else {
      setDetailData(null);
    }
  }, [selectedIncidentId]);

  const getFilteredIncidents = () => {
    return incidents.filter((incident) => {
      const matchesTab = activeTab === "ALL" || incident.status === activeTab;
      
      const typeLabel = (() => {
        switch (incident.incidentType) {
          case "ASSIGNMENT_DISPUTE":
            return "tranh chấp bài tập";
          case "INACTIVE_PARTNER":
            return "bạn học không hoạt động";
          case "MEMBER_CONFLICT":
            return "xung đột thành viên";
          case "RESCUE_SUPPORT_REQUEST":
            return "yêu cầu cứu trợ";
          default:
            return (incident.incidentType || "").toLowerCase();
        }
      })();
      
      const reasonText = (incident.reason || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return matchesTab && (typeLabel.includes(query) || reasonText.includes(query));
    });
  };

  return {
    isLoading,
    incidents,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIncidentId,
    setSelectedIncidentId,
    detailData,
    detailLoading,
    filteredIncidents: getFilteredIncidents(),
    fetchMyIncidents,
  };
};

export default useMyIncidents;
