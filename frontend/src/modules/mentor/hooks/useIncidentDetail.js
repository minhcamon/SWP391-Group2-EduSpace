import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useIncidentDetail = (incidentId) => {
  const [incident, setIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resolutionText, setResolutionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIncidentDetail = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getIncidentById(incidentId);
        setIncident(data);
        if (data && data.status === "RESOLVED") {
          setResolutionText(data.resolutionNote || "");
        }
      });
    } catch (err) {
      toast.error(err.message || "Không thể tải thông tin sự cố!");
    }
  };

  useEffect(() => {
    if (incidentId) {
      fetchIncidentDetail();
    }
  }, [incidentId]);

  const handleClaim = async () => {
    try {
      await runWithLoading(setIsSubmitting, async () => {
        await mentorService.claimIncident(incidentId);
        toast.success("Đã tiếp nhận xử lý sự cố!");
        fetchIncidentDetail();
      });
    } catch (err) {
      toast.error(err.message || "Lỗi tiếp nhận!");
    }
  };

  const handleResolve = async (e) => {
    if (e) e.preventDefault();
    if (!resolutionText.trim()) {
      toast.error("Vui lòng nhập phương án giải quyết!");
      return;
    }

    try {
      await runWithLoading(setIsSubmitting, async () => {
        await mentorService.resolveIncident(incidentId, resolutionText);
        toast.success("Đã đóng sự cố thành công!");
        fetchIncidentDetail();
      });
    } catch (err) {
      toast.error(err.message || "Lỗi đóng sự cố!");
    }
  };

  return {
    incident,
    isLoading,
    resolutionText,
    setResolutionText,
    isSubmitting,
    handleClaim,
    handleResolve,
    refreshIncident: fetchIncidentDetail
  };
};

export default useIncidentDetail;
