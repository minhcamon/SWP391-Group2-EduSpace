import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import mentorService from '@/services/mentorService';

export const WithdrawRequestModal = ({ isOpen, onClose, classId, className, onSubmitted }) => {
    const [reason, setReason] = useState('');
    const [expectedLeaveDate, setExpectedLeaveDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error('Vui lòng nhập lý do rút lui!');
            return;
        }
        if (!expectedLeaveDate) {
            toast.error('Vui lòng chọn ngày dự kiến rời lớp!');
            return;
        }

        try {
            setIsSubmitting(true);
            await mentorService.submitWithdrawRequest(classId, {
                reason: reason.trim(),
                expectedLeaveDate: expectedLeaveDate
            });
            toast.success('Gửi đơn xin rút lui thành công!');
            if (onSubmitted) onSubmitted();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Gửi đơn rút lui thất bại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get tomorrow's date string for input min attribute
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateStr = tomorrow.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-border-light/35 animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 px-6 py-5 border-b border-border-light/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-neutral-dark text-base leading-tight">
                                Yêu cầu rút lui khỏi lớp
                            </h2>
                            <p className="text-xs text-neutral-medium font-semibold mt-0.5">
                                Lớp: {className}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-neutral-medium hover:text-neutral-dark hover:bg-neutral-lightest p-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Scenario Warnings Description */}
                    <div className="bg-neutral-lightest/70 border border-border-light/25 rounded-2xl p-4 text-xs text-neutral-medium space-y-2 leading-relaxed">
                        <p className="font-bold text-neutral-dark flex items-center gap-1">
                            <AlertTriangle size={13} className="text-amber-500" />
                            <span>Quy trình xử lý của hệ thống:</span>
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>
                                <strong>Lớp học có ≥ 2 mentor:</strong> Bạn có thể được rời lớp ngay sau khi Creator chấp thuận đơn.
                            </li>
                            <li>
                                <strong>Lớp học chỉ có 1 mentor (bạn):</strong> Hệ thống sẽ giữ bạn ở trạng thái <em>Chờ bàn giao</em>. Bạn cần tiếp tục hỗ trợ lớp cho đến khi Creator chỉ định mentor thay thế (bàn giao) hoặc tự mình tiếp quản.
                            </li>
                        </ul>
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-medium mb-1.5">
                            Ngày dự kiến rời lớp *
                        </label>
                        <div className="relative">
                            <input 
                                type="date"
                                min={minDateStr}
                                value={expectedLeaveDate}
                                onChange={(e) => setExpectedLeaveDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-neutral-lightest rounded-xl border border-border-light/35 text-sm font-semibold text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                required
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-medium pointer-events-none">
                                <Calendar size={15} />
                            </div>
                        </div>
                    </div>

                    {/* Reason input */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-medium mb-1.5">
                            Lý do rút lui *
                        </label>
                        <div className="relative">
                            <textarea 
                                rows={4}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Hãy viết rõ lý do bạn cần dừng hỗ trợ lớp học này (ví dụ: bận việc cá nhân, thay đổi lịch trình...)"
                                className="w-full pl-10 pr-4 py-2.5 bg-neutral-lightest rounded-xl border border-border-light/35 text-sm font-semibold text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                required
                            />
                            <div className="absolute left-3.5 top-3.5 text-neutral-medium pointer-events-none">
                                <FileText size={15} />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-light/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-border-light/40 text-neutral-medium hover:text-neutral-dark hover:bg-neutral-lightest text-xs font-bold transition-all cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send size={13} />
                            )}
                            <span>Gửi yêu cầu</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawRequestModal;
