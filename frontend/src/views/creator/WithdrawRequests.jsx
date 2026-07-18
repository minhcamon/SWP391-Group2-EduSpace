import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Users, ArrowRight, UserPlus, AlertCircle, RefreshCw, UserCheck, Calendar, FileText, Check, Ban } from 'lucide-react';
import { toast } from 'sonner';
import creatorService from '@/services/creatorService';
import Sidebar from '@/components/layouts/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const CreatorWithdrawRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, PENDING, HANDOVER_PENDING, COMPLETED, REJECTED
    
    // For handling replacement dropdown
    const [loadingMentorsMap, setLoadingMentorsMap] = useState({}); // { requestId: boolean }
    const [availableMentorsMap, setAvailableMentorsMap] = useState({}); // { requestId: list }
    const [selectedMentorMap, setSelectedMentorMap] = useState({}); // { requestId: userId }
    const [isActioningMap, setIsActioningMap] = useState({}); // { requestId: boolean }

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const data = await creatorService.getWithdrawRequests();
            setRequests(data || []);
        } catch (error) {
            toast.error(error.message || 'Không thể tải danh sách đơn rút lui!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleReject = async (requestId) => {
        if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu rút lui này? (Mentor sẽ quay lại trạng thái ACTIVE)')) return;
        try {
            setIsActioningMap(prev => ({ ...prev, [requestId]: true }));
            await creatorService.rejectWithdrawRequest(requestId);
            toast.success('Đã từ chối đơn rút lui!');
            fetchRequests();
        } catch (error) {
            toast.error(error.message || 'Từ chối đơn thất bại!');
        } finally {
            setIsActioningMap(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const handleApproveDirect = async (requestId) => {
        if (!window.confirm('Duyệt đơn rút lui này? Mentor sẽ chính thức rời khỏi lớp học.')) return;
        try {
            setIsActioningMap(prev => ({ ...prev, [requestId]: true }));
            await creatorService.approveHandover(requestId);
            toast.success('Đã phê duyệt cho mentor rút lui!');
            fetchRequests();
        } catch (error) {
            toast.error(error.message || 'Phê duyệt thất bại!');
        } finally {
            setIsActioningMap(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const handleLoadAvailableMentors = async (requestId, classId) => {
        try {
            setLoadingMentorsMap(prev => ({ ...prev, [requestId]: true }));
            const mentors = await creatorService.getActiveMentorsForClass(classId);
            setAvailableMentorsMap(prev => ({ ...prev, [requestId]: mentors || [] }));
            if (mentors && mentors.length > 0) {
                setSelectedMentorMap(prev => ({ ...prev, [requestId]: mentors[0].id }));
            }
        } catch (error) {
            toast.error('Không thể tải danh sách mentor khả dụng!');
        } finally {
            setLoadingMentorsMap(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const handleInitiateHandover = async (requestId) => {
        const mentorId = selectedMentorMap[requestId];
        if (!mentorId) {
            toast.error('Vui lòng chọn mentor thay thế!');
            return;
        }

        try {
            setIsActioningMap(prev => ({ ...prev, [requestId]: true }));
            await creatorService.initiateHandover(requestId, mentorId);
            toast.success('Đã chỉ định bàn giao lớp học! Đang chờ hoàn tất bàn giao.');
            fetchRequests();
        } catch (error) {
            toast.error(error.message || 'Chỉ định bàn giao thất bại!');
        } finally {
            setIsActioningMap(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const handleApproveHandover = async (requestId) => {
        if (!window.confirm('Xác nhận hoàn tất bàn giao? Mentor cũ sẽ rời lớp và Mentor mới sẽ chính thức nhận lớp.')) return;
        try {
            setIsActioningMap(prev => ({ ...prev, [requestId]: true }));
            await creatorService.approveHandover(requestId);
            toast.success('Bàn giao lớp học thành công!');
            fetchRequests();
        } catch (error) {
            toast.error(error.message || 'Phê duyệt bàn giao thất bại!');
        } finally {
            setIsActioningMap(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const handleTakeOver = async (requestId) => {
        if (!window.confirm('Bạn có chắc muốn tự mình tiếp quản làm mentor cho lớp học này?')) return;
        try {
            setIsActioningMap(prev => ({ ...prev, [requestId]: true }));
            await creatorService.creatorTakeOver(requestId);
            toast.success('Bạn đã tiếp quản lớp học thành công!');
            fetchRequests();
        } catch (error) {
            toast.error(error.message || 'Tiếp quản thất bại!');
        } finally {
            setIsActioningMap(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const filteredRequests = requests.filter(req => {
        if (activeFilter === 'ALL') return true;
        return req.status === activeFilter;
    });

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
        <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar />
                <main className="flex-1 p-4 md:p-8 bg-bg-base overflow-y-auto">
                    
                    {/* Title Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-primary/20 mb-8">
                        <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-10">
                            <Users size={240} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    Yêu cầu ngừng giảng dạy (Withdrawal)
                                </h1>
                                <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">
                                    Nơi quản lý và phê duyệt các đơn xin rút lui giảng dạy của Mentors. Đảm bảo quy trình bàn giao lớp học diễn ra an toàn, không làm gián đoạn học tập của học viên.
                                </p>
                            </div>
                            <button
                                onClick={fetchRequests}
                                className="self-start md:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                            >
                                <RefreshCw size={14} />
                                <span>Tải lại danh sách</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-border-light/40 shadow-xs max-w-max">
                        {[
                            { key: 'ALL', label: 'Tất cả đơn' },
                            { key: 'PENDING', label: 'Chờ duyệt' },
                            { key: 'HANDOVER_PENDING', label: 'Đang bàn giao' },
                            { key: 'COMPLETED', label: 'Đã hoàn thành' },
                            { key: 'REJECTED', label: 'Đã từ chối' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    activeFilter === tab.key
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-neutral-medium hover:text-neutral-dark hover:bg-neutral-lightest'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Requests Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[300px]">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="bg-white border border-border-light/40 rounded-3xl p-12 text-center shadow-xs">
                            <div className="w-14 h-14 bg-neutral-lightest rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={28} className="text-neutral-light" />
                            </div>
                            <h3 className="text-base font-bold text-neutral-dark mb-1">
                                Không tìm thấy yêu cầu nào
                            </h3>
                            <p className="text-xs text-neutral-medium max-w-sm mx-auto">
                                Hiện không có yêu cầu ngừng giảng dạy nào trùng khớp với bộ lọc đã chọn.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredRequests.map(req => {
                                const isPending = req.status === 'PENDING';
                                const isHandoverPending = req.status === 'HANDOVER_PENDING';
                                const isSoft = req.scenario === 'SCENARIO_A_SOFT';
                                const isUrgent = req.scenario === 'SCENARIO_B_URGENT';
                                const isActioning = isActioningMap[req.id] || false;

                                const mentors = availableMentorsMap[req.id] || [];
                                const isLoadingMentors = loadingMentorsMap[req.id] || false;
                                const hasMentorsLoaded = availableMentorsMap[req.id] !== undefined;

                                return (
                                    <Card key={req.id} className="overflow-hidden border border-border-light/45 shadow-xs bg-white rounded-2xl flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
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
                                                            onClick={() => handleApproveDirect(req.id)}
                                                            disabled={isActioning}
                                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                                                        >
                                                            <UserCheck size={14} />
                                                            <span>Duyệt trực tiếp (Không thay thế)</span>
                                                        </button>
                                                    )}

                                                    {/* Handover setup area */}
                                                    <div className="space-y-3">
                                                        {!hasMentorsLoaded ? (
                                                            <button
                                                                onClick={() => handleLoadAvailableMentors(req.id, req.classId)}
                                                                disabled={isLoadingMentors}
                                                                className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/95 hover:to-primary-light/95 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
                                                            >
                                                                {isLoadingMentors ? (
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <UserPlus size={14} />
                                                                )}
                                                                <span>Chỉ định mentor bàn giao</span>
                                                            </button>
                                                        ) : (
                                                            <div className="bg-neutral-lightest p-3 rounded-xl border border-border-light/20 space-y-2">
                                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-medium">
                                                                    Chọn mentor thay thế từ pool đăng ký:
                                                                </label>
                                                                {mentors.length === 0 ? (
                                                                    <p className="text-xs text-red-600 font-semibold italic text-center">
                                                                        Không có mentor nào khả dụng!
                                                                    </p>
                                                                ) : (
                                                                    <div className="flex gap-2">
                                                                        <select
                                                                            value={selectedMentorMap[req.id] || ''}
                                                                            onChange={(e) => setSelectedMentorMap(prev => ({ ...prev, [req.id]: e.target.value }))}
                                                                            className="flex-1 bg-white border border-border-light/35 rounded-lg px-2.5 py-1.5 text-xs text-neutral-dark font-semibold focus:outline-none"
                                                                        >
                                                                            {mentors.map(m => (
                                                                                <option key={m.id} value={m.id}>
                                                                                    {m.fullName} ({m.email})
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <button
                                                                            onClick={() => handleInitiateHandover(req.id)}
                                                                            disabled={isActioning}
                                                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-98 cursor-pointer"
                                                                        >
                                                                            Gửi
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Take Over for scenario B */}
                                                    {isUrgent && (
                                                        <button
                                                            onClick={() => handleTakeOver(req.id)}
                                                            disabled={isActioning}
                                                            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                                                        >
                                                            <ShieldAlert size={14} />
                                                            <span>Tự tiếp quản lớp học (Làm mentor)</span>
                                                        </button>
                                                    )}

                                                    {/* Reject Button */}
                                                    <button
                                                        onClick={() => handleReject(req.id)}
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
                                                        onClick={() => handleReject(req.id)}
                                                        disabled={isActioning}
                                                        className="flex-1 border border-border-light/45 hover:bg-neutral-lightest text-neutral-medium hover:text-neutral-dark text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                                                    >
                                                        <XCircle size={14} />
                                                        <span>Hủy bàn giao</span>
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleApproveHandover(req.id)}
                                                        disabled={isActioning}
                                                        className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                        <span>Duyệt bàn giao</span>
                                                    </button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CreatorWithdrawRequests;
