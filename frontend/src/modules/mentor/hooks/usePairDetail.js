import { useState, useEffect, useCallback } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";
import useStudyGroupWebSocket from "@/modules/learning/hooks/useStudyGroupWebSocket";

export const usePairDetail = (pairId) => {
  const [pairDetail, setPairDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [msgContent, setMsgContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchPairDetail = useCallback(async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getPairById(pairId);
        setPairDetail(data);

        setIsChatLoading(true);
        try {
          const chatData = await mentorService.getPairChat(pairId);
          setChatMessages(chatData || []);
        } catch (chatErr) {
          console.error("Failed to load chat history", chatErr);
        } finally {
          setIsChatLoading(false);
        }
      });
    } catch (err) {
      toast.error(err.message || "Không tìm thấy thông tin cặp đôi học tập!");
    }
  }, [pairId]);

  useEffect(() => {
    if (pairId) {
      fetchPairDetail();
    }
  }, [pairId, fetchPairDetail]);

  // Handle incoming websocket messages
  const handleIncomingMessage = useCallback((msg) => {
    setChatMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  // Listen to study group messages via WebSocket
  useStudyGroupWebSocket(pairId, handleIncomingMessage);

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
    chatMessages,
    isChatLoading,
    msgContent,
    setMsgContent,
    isSending,
    handleSendMessage,
    refreshPair: fetchPairDetail
  };
};

export default usePairDetail;
