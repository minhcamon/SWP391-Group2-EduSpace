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
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (e.g. max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error("Kích thước file không được vượt quá 10MB!");
            return;
        }

        // Validate file type (docs, pdf, image)
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/webp'
        ];
        
        // Basic type validation or extension check
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            toast.error("Chỉ chấp nhận tài liệu định dạng PDF, Word (DOC/DOCX) hoặc Ảnh (JPG/PNG/WEBP)!");
            return;
        }

        setSelectedFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            return toast.error("Vui lòng tải lên tài liệu minh chứng!");
        }

        await runWithLoading(setIsSubmitting, async () => {
            try {
                await AuthService.registerCreator(selectedFile);
                toast.success("Hồ sơ đăng ký của bạn đã được gửi thành công!");
                setSelectedFile(null);
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
                    {/* Upload File tài liệu */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="modal_documentFile">
                            Tài liệu minh chứng (CV / Bằng cấp / Chứng chỉ) *
                        </Label>
                        <div className="border-2 border-dashed border-border-light/60 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors relative bg-bg-card flex flex-col items-center justify-center min-h-[140px]">
                            <input
                                id="modal_documentFile"
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {selectedFile ? (
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-primary break-all px-4">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-neutral-medium">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-neutral-medium text-3xl">📁</div>
                                    <p className="text-sm font-semibold text-neutral-dark">
                                        Nhấp để chọn hoặc kéo thả tài liệu vào đây
                                    </p>
                                    <p className="text-xs text-neutral-medium">
                                        Chấp nhận PDF, Word, hoặc Ảnh (tối đa 10MB)
                                    </p>
                                </div>
                            )}
                        </div>
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
