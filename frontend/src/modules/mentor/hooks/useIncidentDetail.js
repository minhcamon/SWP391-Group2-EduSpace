import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useIncidentDetail = (incidentId) => {
  const [incident, setIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIncidentDetail = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getIncidentById(incidentId);
        setIncident(data);
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

  const handleResolve = async (payload) => {
    try {
      await runWithLoading(setIsSubmitting, async () => {
        await mentorService.resolveIncident(incidentId, payload);
        toast.success("Đã giải quyết sự cố thành công!");
        fetchIncidentDetail();
      });
    } catch (err) {
      toast.error(err.message || "Lỗi giải quyết sự cố!");
    }
  };

  const handleReject = async (payload) => {
    try {
      await runWithLoading(setIsSubmitting, async () => {
        await mentorService.rejectIncident(incidentId, payload);
        toast.success("Đã từ chối xử lý sự cố!");
        fetchIncidentDetail();
      });
    } catch (err) {
      toast.error(err.message || "Lỗi từ chối sự cố!");
    }
  };

  const handleWarn = async (payload) => {
    try {
      await runWithLoading(setIsSubmitting, async () => {
        await mentorService.warnIncident(incidentId, payload);
        toast.success("Đã gửi nhắc nhở thành công!");
        fetchIncidentDetail();
      });
    } catch (err) {
      toast.error(err.message || "Lỗi gửi nhắc nhở!");
    }
  };

  return {
    incident,
    isLoading,
    isSubmitting,
    handleClaim,
    handleResolve,
    handleReject,
    handleWarn,
    refreshIncident: fetchIncidentDetail
  };
};

export default useIncidentDetail;
