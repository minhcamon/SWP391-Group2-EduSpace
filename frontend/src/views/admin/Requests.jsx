import { useState, useEffect } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import { ClipboardList, History, Inbox } from "lucide-react";
import RequestTable from "@/modules/course-lifecycle/components/RequestTable";
import { toast } from "sonner";
import creatorService from "@/services/creatorService";
import ReloadButton from "@/components/ui/ReloadButton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const Requests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    useEffect(() => {
        fetchPendingRequests();
        fetchAllRequests();
    }, []);

    const handleReload = () => {
        fetchPendingRequests();
        fetchAllRequests();
    };

    const fetchPendingRequests = async () => {
        try {
            const data = await creatorService.getPendingCreatorRequests();
            setPendingRequests(data);
        } catch (error) {
            console.error(
                "Lỗi khi lấy pending creator request tại Requests",
                error,
            );
            toast.error("Lỗi khi lấy đơn duyệt");
        }
    };

    const fetchAllRequests = async () => {
        try {
            const res = await creatorService.getCreatorRequests();
            const data = res.filter((request) => request.status !== "PENDING");
            setAllRequests(data);
        } catch (error) {
            console.error(
                "Lỗi khi lấy data creator request tại Requests",
                error,
            );
            toast.error("Lỗi khi lấy đơn duyệt");
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await creatorService.approveCreatorRequest(requestId);

            setPendingRequests((prevPendingRequests) =>
                prevPendingRequests.filter(
                    (request) => request.requestId !== requestId,
                ),
            );

            toast.success(`Duyệt đơn #${requestId} thành công`);
            handleReload();
        } catch (error) {
            console.error("Lỗi khi duyệt đơn ở Requests: ", error);
            toast.error("Lỗi khi duyệt đơn");
        }
    };

    const handleRejectClick = (courseId) => {
        setSelectedRequestId(courseId);
        setRejectReason("");
        setIsRejectDialogOpen(true);
    };

    const handleConfirmReject = async () => {
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

            handleReload();
        } catch (error) {
            console.error("Lỗi khi từ chối đơn ở Requests: ", error);
            toast.error("Lỗi khi từ chối đơn");
        } finally {
            setIsSubmittingReject(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-secondary tracking-tight">
                        Kiểm duyệt đơn
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Quản lý duyệt đơn và Lịch sử duyệt đơn
                    </p>
                </div>

                <div className="flex justify-end">
                    <ReloadButton action={handleReload} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <ClipboardList size={20} className="text-primary" />
                        <h2 className="text-lg font-bold">
                            Danh sách đơn chờ xử lý
                        </h2>
                    </div>
                    {pendingRequests.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                            <Inbox
                                size={32}
                                className="text-gray-300 mx-auto mb-2"
                            />
                            <p className="text-gray-500 text-sm font-medium">
                                Hàng chờ trống. Không có đơn nào cần xử lý.
                            </p>
                        </div>
                    ) : (
                        <RequestTable
                            requests={pendingRequests}
                            isHistory={false}
                            onApprovedClick={handleApprove}
                            onRejectClick={handleRejectClick}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 px-1">
                        <History size={20} className="text-tertiary" />
                        <h2 className="text-lg font-bold">
                            Lịch sử đơn đã xử lý
                        </h2>
                    </div>
                    {allRequests.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                            <Inbox
                                size={32}
                                className="text-gray-300 mx-auto mb-2"
                            />
                            <p className="text-gray-500 text-sm font-medium">
                                Lịch sử duyệt trống. Không có đơn nào cần xử lý.
                            </p>
                        </div>
                    ) : (
                        <RequestTable requests={allRequests} isHistory={true} />
                    )}
                </div>

                <Dialog
                    open={isRejectDialogOpen}
                    onOpenChange={setIsRejectDialogOpen}
                >
                    <DialogContent className="sm:max-w-120 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                Lý do từ chối đơn
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm leading-relaxed">
                                Vui lòng nhập lý do cụ thể từ chối phê duyệt đơn
                                ứng tuyển này.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <Textarea
                                value={rejectReason}
                                onChange={(e) =>
                                    setRejectReason(e.target.value)
                                }
                                placeholder="Ví dụ: Hồ sơ còn quá sơ sài, thiếu chứng chỉ ..."
                                className="min-h-30 rounded-xl border border-gray-200 focus-visible:ring-indigo-500 text-sm p-3 leading-relaxed"
                                disabled={isSubmittingReject}
                            />
                        </div>

                        <div className="flex gap-3 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsRejectDialogOpen(false)}
                                disabled={isSubmittingReject}
                                className="rounded-xl font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                            >
                                Hủy bỏ
                            </Button>

                            <Button
                                type="button"
                                onClick={handleConfirmReject}
                                disabled={isSubmittingReject}
                                className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/10 cursor-pointer"
                            >
                                {isSubmittingReject
                                    ? "Đang xử lý..."
                                    : "Xác nhận từ chối"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default Requests;
