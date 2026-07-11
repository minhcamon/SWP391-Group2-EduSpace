import { useState, useEffect } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const usePairDetail = (pairId) => {
  const [pairDetail, setPairDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [msgContent, setMsgContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchPairDetail = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getPairById(pairId);
        setPairDetail(data);
      });
    } catch (err) {
      toast.error(err.message || "Không tìm thấy thông tin cặp đôi học tập!");
    }
  };

  useEffect(() => {
    if (pairId) {
      fetchPairDetail();
    }
  }, [pairId]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!msgContent.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      toast.success("Đã gửi tin nhắn nhắc nhở/cảnh báo tới cả hai học viên!");
      setMsgContent("");
      setIsSending(false);
    }, 500);
  };

  return {
    pairDetail,
    isLoading,
    msgContent,
    setMsgContent,
    isSending,
    handleSendMessage,
    refreshPair: fetchPairDetail
  };
};

export default usePairDetail;
