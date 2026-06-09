import React, { useState } from "react";
import AuthService from "@/services/authService";
import { toast } from "sonner";
import { runWithLoading } from "@/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

const CreatorRegisterModal = ({ isOpen, onClose, onSuccess }) => {
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!portfolioUrl.trim()) {
            return toast.error("Vui lòng cung cấp link tài liệu đăng ký!");
        }

        await runWithLoading(setIsSubmitting, async () => {
            try {
                // Only send portfolioUrl since database structure only needs this link
                await AuthService.registerCreator({ portfolioUrl: portfolioUrl.trim() });
                toast.success("Hồ sơ đăng ký của bạn đã được gửi thành công!");
                setPortfolioUrl("");
                if (onSuccess) onSuccess();
                onClose();
            } catch (error) {
                console.error("Register creator error:", error);
                toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg w-full p-0 overflow-hidden gap-0 border border-border-light/35 flex flex-col max-h-[90vh]" showCloseButton={false}>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-primary to-[#6366f1] text-white p-6 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold cursor-pointer"
                        type="button"
                    >
                        &times;
                    </button>
                    <DialogTitle className="text-lg font-bold text-white">Đăng ký làm Content Creator</DialogTitle>
                    <DialogDescription className="text-xs text-white/80 mt-1">Cùng EduSpace chia sẻ kiến thức tới hàng ngàn học viên</DialogDescription>
                </div>

                {/* Modal Body / Form */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    {/* Portfolio / CV Link */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="modal_portfolioUrl">
                            Đường dẫn tài liệu đăng ký (CV / Chứng chỉ) *
                        </Label>
                        <Input
                            id="modal_portfolioUrl"
                            type="url"
                            placeholder="https://example.com/tai-lieu-cua-ban"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            className="px-4 py-3 h-auto bg-bg-card border-border-light/40 rounded-xl"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0 -mx-0 -mb-0 rounded-t-none sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-5 py-2.5 h-auto border border-border-light text-neutral-dark rounded-xl text-sm font-semibold hover:bg-bg-card transition-colors cursor-pointer"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="px-5 py-2.5 h-auto bg-secondary hover:opacity-95 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-orange-500/20"
                        >
                            Gửi hồ sơ đăng ký
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatorRegisterModal;
