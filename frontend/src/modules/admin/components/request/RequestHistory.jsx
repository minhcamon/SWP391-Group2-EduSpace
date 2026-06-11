import EmptyState from "@/components/ui/EmptyState";
import { History, Inbox } from "lucide-react";
import RequestTable from "@/modules/admin/components/request/RequestTable";

const RequestHistory = ({ allRequests }) => {
    const allRequestsLength = allRequests.length;
    return (
        <>
            <div className="flex items-center gap-2 text-gray-900 px-1">
                <History size={20} className="text-tertiary" />
                <h2 className="text-lg font-bold">Lịch sử đơn đã xử lý</h2>
            </div>
            {allRequestsLength === 0 ? (
                <EmptyState
                    icon={Inbox}
                    description="Lịch sử duyệt đơn trống. Không có lịch sử nào."
                />
            ) : (
                <RequestTable requests={allRequests} isHistory={true} />
            )}
        </>
    );
};

export default RequestHistory;
