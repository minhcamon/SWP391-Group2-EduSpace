import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Users, ArrowRight, UserPlus, AlertCircle, UserCheck, Calendar, FileText, Check, Ban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const WithdrawRequestCard = ({
    req,
    onReject,
    onApproveDirect,
    onLoadMentors,
    onInitiateHandover,
    onApproveHandover,
    onTakeOver,
    isLoadingMentors,
    availableMentors = [],
    selectedMentorId,
    onSelectMentor,
    isActioning
}) => {
    const isPending = req.status === 'PENDING';
    const isHandoverPending = req.status === 'HANDOVER_PENDING';
    const isSoft = req.scenario === 'SCENARIO_A_SOFT';
    const isUrgent = req.scenario === 'SCENARIO_B_URGENT';

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Chờ duyệt</Badge>;
            case 'HANDOVER_PENDING':
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Đang bàn giao</Badge>;
            case 'COMPLETED':
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Hoàn thành</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-50 text-red-700 border-red-200">Đã từ chối</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <Card className="overflow-hidden border border-border-light/45 shadow-xs bg-white rounded-2xl flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 space-y-4">
                
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-extrabold text-neutral-dark text-base">
                            Lớp: {req.className}
                        </h3>
                        <span className="text-[10px] text-neutral-medium font-bold block mt-0.5">
                            Gửi ngày: {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        {getStatusBadge(req.status)}
                        {isSoft && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Rút lui mềm (Scenario A)
                            </span>
                        )}
                        {isUrgent && (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                Cần bàn giao gấp (Scenario B)
                            </span>
                        )}
                    </div>
                </div>

                {/* Mentor Profile */}
                <div className="bg-neutral-lightest/40 border border-border-light/20 p-4 rounded-xl flex items-center gap-3">
                    <img 
                        src={req.mentor.avatarUrl || '/default-avatar.png'} 
                        alt={req.mentor.fullName}
                        className="w-10 h-10 rounded-full border border-border-light bg-neutral-lightest"
                    />
                    <div>
                        <h4 className="font-bold text-neutral-dark text-sm leading-tight">
                            {req.mentor.fullName}
                        </h4>
                        <span className="text-xs text-neutral-medium leading-none">
                            {req.mentor.email} (Mentor hiện tại)
                        </span>
                    </div>
                </div>

                {/* Leave details */}
                <div className="space-y-2 text-xs text-neutral-medium">
                    <p className="flex items-center gap-2">
                        <Calendar size={14} className="text-neutral-light shrink-0" />
                        <span>Ngày dự kiến rời lớp: <strong className="text-neutral-dark">{new Date(req.expectedLeaveDate).toLocaleDateString('vi-VN')}</strong></span>
                    </p>
                    <div className="flex items-start gap-2 bg-neutral-lightest/50 p-3 rounded-xl border border-border-light/20">
                        <FileText size={14} className="text-neutral-light shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            Lý do: <span className="text-neutral-dark italic">"{req.reason}"</span>
                        </p>
                    </div>
                </div>

                {/* If Handover Pending -> Show target replacement mentor */}
                {req.newMentor && (
                    <div className="bg-blue-50/40 border border-blue-100 p-4 rounded-2xl flex flex-col gap-2.5">
                        <span className="text-[10px] text-blue-700 font-extrabold uppercase tracking-wider">
                            Mentor bàn giao thay thế:
                        </span>
                        <div className="flex items-center gap-3">
                            <img 
                                src={req.newMentor.avatarUrl || '/default-avatar.png'} 
                                alt={req.newMentor.fullName}
                                className="w-9 h-9 rounded-full border border-blue-200"
                            />
                            <div>
                                <h4 className="font-bold text-neutral-dark text-xs">
                                    {req.newMentor.fullName}
                                </h4>
                                <span className="text-[10px] text-neutral-medium">
                                    {req.newMentor.email}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action buttons section */}
                {isPending && (
                    <div className="pt-3 border-t border-border-light/10 flex flex-col gap-3">
                        {/* Soft withdraw direct approval button */}
                        {isSoft && (
                            <button
                                onClick={() => onApproveDirect(req.id)}
                                disabled={isActioning}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                            >
                                <UserCheck size={14} />
                                <span>Duyệt trực tiếp (Không thay thế)</span>
                            </button>
                        )}

                        {/* Handover setup area */}
                        <div className="space-y-3">
                            {availableMentors.length === 0 && !isLoadingMentors && (
                                <button
                                    onClick={() => onLoadMentors(req.id, req.classId)}
                                    disabled={isLoadingMentors}
                                    className="w-full bg-linear-to-r from-secondary to-secondary/80 hover:from-secondary/95 hover:to-secondary/85 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
                                >
                                    <UserPlus size={14} />
                                    <span>Chỉ định mentor bàn giao</span>
                                </button>
                            )}

                            {isLoadingMentors && (
                                <div className="w-full bg-neutral-lightest p-3 rounded-xl border border-border-light/20 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                            {availableMentors.length > 0 && !isLoadingMentors && (
                                <div className="bg-neutral-lightest p-3 rounded-xl border border-border-light/20 space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-medium">
                                        Chọn mentor thay thế từ pool đăng ký:
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedMentorId || ''}
                                            onChange={(e) => onSelectMentor(req.id, e.target.value)}
                                            className="flex-1 bg-white border border-border-light/35 rounded-lg px-2.5 py-1.5 text-xs text-neutral-dark font-semibold focus:outline-none"
                                        >
                                            {availableMentors.map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.fullName} ({m.email})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => onInitiateHandover(req.id)}
                                            disabled={isActioning}
                                            className="bg-secondary hover:bg-secondary/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-98 cursor-pointer"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Take Over for scenario B */}
                        {isUrgent && (
                            <button
                                onClick={() => onTakeOver(req.id)}
                                disabled={isActioning}
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                            >
                                <ShieldAlert size={14} />
                                <span>Tự tiếp quản lớp học (Làm mentor)</span>
                            </button>
                        )}

                        {/* Reject Button */}
                        <button
                            onClick={() => onReject(req.id)}
                            disabled={isActioning}
                            className="w-full border border-border-light/45 hover:bg-neutral-lightest text-neutral-medium hover:text-neutral-dark text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                        >
                            <Ban size={13} />
                            <span>Từ chối rút lui</span>
                        </button>
                    </div>
                )}

                {/* Actions for handover pending status */}
                {isHandoverPending && (
                    <div className="pt-3 border-t border-border-light/10 flex items-center gap-3">
                        <button
                            onClick={() => onReject(req.id)}
                            disabled={isActioning}
                            className="flex-1 border border-border-light/45 hover:bg-neutral-lightest text-neutral-medium hover:text-neutral-dark text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                        >
                            <XCircle size={14} />
                            <span>Hủy bàn giao</span>
                        </button>
                        
                        <button
                            onClick={() => onApproveHandover(req.id)}
                            disabled={isActioning}
                            className="flex-1 bg-secondary hover:bg-secondary/90 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
                        >
                            <CheckCircle2 size={14} />
                            <span>Duyệt bàn giao</span>
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default WithdrawRequestCard;
