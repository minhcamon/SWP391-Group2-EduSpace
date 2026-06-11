import creatorService from "@/services/creatorService";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useRequest = (usingPage) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    const fetchPendingRequests = useCallback(async () => {
        try {
            const data = await creatorService.getPendingCreatorRequests();
            setPendingRequests(data);
        } catch (error) {
            console.error(
                `Lỗi khi lấy pending creator request tại ${usingPage}`,
                error,
            );
            toast.error("Lỗi khi lấy đơn duyệt");
        }
    }, [usingPage])

    const fetchAllRequests = useCallback(async () => {
        try {
            const res = await creatorService.getCreatorRequests();
            const data = res.filter((request) => request.status !== "PENDING");
            setAllRequests(data);
        } catch (error) {
            console.error(
                `Lỗi khi lấy data creator request tại ${usingPage}`,
                error,
            );
            toast.error("Lỗi khi lấy đơn duyệt");
        }
    }, [usingPage])

    const handleApprove = useCallback(async (requestId) => {
        try {
            await creatorService.approveCreatorRequest(requestId);

            setPendingRequests((prevPendingRequests) =>
                prevPendingRequests.filter(
                    (request) => request.requestId !== requestId,
                ),
            );

            toast.success(`Duyệt đơn #${requestId} thành công`);
        } catch (error) {
            console.error(`Lỗi khi duyệt đơn ở ${usingPage}: `, error);
            toast.error("Lỗi khi duyệt đơn");
        }
    }, [usingPage])

    const handleRejectClick = useCallback((courseId) => {
        setSelectedRequestId(courseId);
        setRejectReason("");
        setIsRejectDialogOpen(true);
    }, [])

    const handleConfirmReject = useCallback(async () => {
        if (!rejectReason.trim()) {
            toast.warning("Vui lòng nhập lý do từ chối đơn!");
            return;
        }

        try {
            setIsSubmittingReject(true);
            const payload = {
                reason: rejectReason.trim(),
            };

            await creatorService.rejectCreatorRequest(
                selectedRequestId,
                payload,
            );

            toast.success(`Từ chối đơn #${selectedRequestId} thành công`);

            setPendingRequests((prevPendingRequests) =>
                prevPendingRequests.filter(
                    (request) => request.requestId !== selectedRequestId,
                ),
            );

            setIsRejectDialogOpen(false);
            setSelectedRequestId(null);
            setRejectReason("");

        } catch (error) {
            console.error(`Lỗi khi từ chối đơn ở ${usingPage}: `, error);
            toast.error("Lỗi khi từ chối đơn");
        } finally {
            setIsSubmittingReject(false);
        }
    }, [rejectReason, selectedRequestId, usingPage])

    return {
        isRejectDialogOpen,
        isSubmittingReject,
        allRequests,
        pendingRequests,
        selectedRequestId,
        rejectReason,
        setPendingRequests,
        setAllRequests,
        setIsRejectDialogOpen,
        setSelectedRequestId,
        setRejectReason,
        setIsSubmittingReject,
        fetchPendingRequests,
        fetchAllRequests,
        handleApprove,
        handleConfirmReject,
        handleRejectClick
    }
}

export default useRequest