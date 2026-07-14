import Button from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import Textarea from "@/components/ui/Textarea";

const CourseRejectDialog = ({
    isRejectDialogOpen,
    isSubmittingReject,
    rejectReason,
    setIsRejectDialogOpen,
    setRejectReason,
    handleConfirmReject,
}) => {
    return (
        <>
            <Dialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
            >
                <DialogContent className="sm:max-w-120 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Lý do từ chối khóa học
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm leading-relaxed">
                            Vui lòng nhập lý do cụ thể từ chối phê duyệt khóa
                            học này.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Ví dụ: Khóa học còn quá sơ sài, thiếu bài tập thực hành chương 3..."
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
        </>
    );
};

export default CourseRejectDialog;
