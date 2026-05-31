import React, { useState } from "react";
import AuthService from "@/services/authService";
import { toast } from "sonner";

const CreatorRegisterModal = ({ isOpen, onClose, onSuccess }) => {
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!portfolioUrl.trim()) {
            return toast.error("Vui lòng cung cấp link tài liệu đăng ký!");
        }

        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-border-light/30 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-primary to-[#6366f1] text-white p-6 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold cursor-pointer"
                        type="button"
                    >
                        &times;
                    </button>
                    <h3 className="text-lg font-bold">Đăng ký làm Content Creator</h3>
                    <p className="text-xs text-white/80 mt-1">Cùng EduSpace chia sẻ kiến thức tới hàng ngàn học viên</p>
                </div>

                {/* Modal Body / Form */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    {/* Portfolio / CV Link */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="modal_portfolioUrl">
                            Đường dẫn tài liệu đăng ký (CV / Chứng chỉ) *
                        </label>
                        <input
                            id="modal_portfolioUrl"
                            type="url"
                            placeholder="https://example.com/tai-lieu-cua-ban"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            className="w-full bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-light"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-border-light text-neutral-dark rounded-xl text-sm font-semibold hover:bg-bg-card transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-secondary hover:opacity-95 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-orange-500/20"
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi hồ sơ đăng ký"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatorRegisterModal;
