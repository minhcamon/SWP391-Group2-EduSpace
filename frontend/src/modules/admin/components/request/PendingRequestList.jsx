import EmptyState from "@/components/ui/EmptyState";
import { ClipboardList, Inbox } from "lucide-react";
import RequestTable from "@/modules/admin/components/request/RequestTable";

const PendingRequestList = ({
    pendingRequests,
    handleApprove,
    handleRejectClick,
}) => {
    const pendingRequestsLength = pendingRequests.length;

    return (
        <>
            <div className="flex items-center gap-2 text-gray-900 px-1">
                <ClipboardList size={20} className="text-primary" />
                <h2 className="text-lg font-bold">Danh sách đơn chờ xử lý</h2>
            </div>
            {pendingRequestsLength === 0 ? (
                <EmptyState
                    icon={Inbox}
                    description="Hàng chờ trống. Không có đơn nào cần xử lý."
                />
            ) : (
                <RequestTable
                    requests={pendingRequests}
                    isHistory={false}
                    onApprovedClick={handleApprove}
                    onRejectClick={handleRejectClick}
                />
            )}
        </>
    );
};

export default PendingRequestList;
