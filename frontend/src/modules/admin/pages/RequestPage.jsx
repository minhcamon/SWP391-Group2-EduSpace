import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import ReloadButton from "@/components/ui/ReloadButton";
import useRequest from "@/modules/admin/hooks/useRequest";
import { useEffect } from "react";
import PendingRequestList from "@/modules/admin/components/request/PendingRequestList";
import RequestHistory from "@/modules/admin/components/request/RequestHistory";
import RequestRejectDialog from "@/modules/admin/components/request/RequestRejectDialog";

const RequestPage = () => {
    const {
        isRejectDialogOpen,
        isSubmittingReject,
        allRequests,
        pendingRequests,
        rejectReason,
        setIsRejectDialogOpen,
        setRejectReason,
        fetchPendingRequests,
        fetchAllRequests,
        handleApprove,
        handleConfirmReject,
        handleRejectClick,
    } = useRequest("Admin Creator Request");

    useEffect(() => {
        fetchPendingRequests();
        fetchAllRequests();
    }, [fetchPendingRequests, fetchAllRequests]);

    const handleReload = () => {
        fetchPendingRequests();
        fetchAllRequests();
    };
    return (
        <>
            <Card className="p-6 bg-white border border-gray-200 shadow-sm ">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-secondary">
                        Kiểm duyệt đơn
                    </CardTitle>
                    <CardDescription>
                        Quản lý duyệt đơn và Lịch sử duyệt đơn
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex justify-end mt-8">
                <ReloadButton action={handleReload} />
            </div>

            <div className="space-y-4 mt-8">
                <PendingRequestList
                    pendingRequests={pendingRequests}
                    handleApprove={handleApprove}
                    handleRejectClick={handleRejectClick}
                />
            </div>

            <div className="space-y-4 mt-8">
                <RequestHistory allRequests={allRequests} />
            </div>

            <RequestRejectDialog
                isRejectDialogOpen={isRejectDialogOpen}
                isSubmittingReject={isSubmittingReject}
                setIsRejectDialogOpen={setIsRejectDialogOpen}
                setRejectReason={setRejectReason}
                rejectReason={rejectReason}
                handleConfirmReject={handleConfirmReject}
            />
        </>
    );
};

export default RequestPage;
