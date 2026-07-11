import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useArbitrationDetail = (arbitrationId) => {
  const [arbitration, setArbitration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [finalScore, setFinalScore] = useState("");
  const [mentorComment, setMentorComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArbitrationDetail = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getArbitrationById(arbitrationId);
        setArbitration(data);
        if (data && data.status === "RESOLVED") {
          setMentorComment(data.resolutionNote || "");
        }
      });
    } catch (err) {
      toast.error(err.message || "Không thể tải thông tin khiếu nại chấm điểm!");
    }
  };

  useEffect(() => {
    if (arbitrationId) {
      fetchArbitrationDetail();
    }
  }, [arbitrationId]);

  const handleSubmitGrade = async (e) => {
    if (e) e.preventDefault();
    const scoreVal = parseFloat(finalScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
      toast.error("Vui lòng nhập điểm số hợp lệ từ 0 đến 10!");
      return;
    }
    if (!mentorComment.trim()) {
      toast.error("Vui lòng nhập nhận xét/đánh giá chi tiết của Mentor!");
      return;
    }

    try {
      await runWithLoading(setIsSubmitting, async () => {
        await mentorService.submitArbitrationGrade(arbitrationId, scoreVal, mentorComment);
        toast.success("Đã hoàn tất phân xử điểm thành công!");
        fetchArbitrationDetail();
      });
    } catch (err) {
      toast.error(err.message || "Lỗi khi nộp kết quả phân xử!");
    }
  };

  return {
    arbitration,
    isLoading,
    finalScore,
    setFinalScore,
    mentorComment,
    setMentorComment,
    isSubmitting,
    handleSubmitGrade,
    refreshArbitration: fetchArbitrationDetail
  };
};

export default useArbitrationDetail;
