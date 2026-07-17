import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    Users,
    Calendar,
    TrendingUp,
    AlertCircle,
    Clock,
    Play,
    XCircle,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import waitlistService from '@/services/waitlistService';
import { toast } from 'sonner';

const WaitlistManagement = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        fetchWaitlistStats();

        // Refresh every 30 seconds
        const interval = setInterval(fetchWaitlistStats, 30000);
        return () => clearInterval(interval);
    }, [courseId]);

    const fetchWaitlistStats = async () => {
        try {
            const data = await waitlistService.getWaitlistStats(courseId);
            setStats(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartClass = async () => {
        if (!stats?.waitlistId) return;

        if (!window.confirm(
            `Bạn có chắc chắn muốn khởi động lớp học với ${stats.currentCount} học viên?`
        )) {
            return;
        }

        setActionLoading(true);
        try {
            const classId = await waitlistService.manualStartClass(stats.waitlistId);
            toast.success('Lớp học đã được khởi động thành công!');

            // Navigate to class detail
            setTimeout(() => {
                navigate(`/creator/classes/${classId}`);
            }, 1500);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelWaitlist = async () => {
        if (!cancelReason.trim()) {
            toast.error('Vui lòng nhập lý do hủy!');
            return;
        }

        setActionLoading(true);
        try {
            await waitlistService.cancelWaitlist(stats.waitlistId, cancelReason);
            toast.success('Waitlist đã được hủy thành công!');
            setShowCancelModal(false);

            // Refresh stats
            setTimeout(() => {
                fetchWaitlistStats();
            }, 1000);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-bg-base text-neutral-dark min-h-screen">
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const progressPercentage = stats?.currentCount
        ? (stats.currentCount / stats.maxCapacity) * 100
        : 0;

    const getStatusColor = () => {
        if (stats?.status === 'NO_WAITLIST') return 'bg-gray-100 text-gray-600';
        if (stats?.currentCount >= stats?.maxCapacity) return 'bg-green-100 text-green-600';
        if (stats?.currentCount >= stats?.minRequired) return 'bg-blue-100 text-blue-600';
        return 'bg-yellow-100 text-yellow-600';
    };

    const getStatusText = () => {
        if (stats?.status === 'NO_WAITLIST') return 'Không có waitlist';
        if (stats?.currentCount >= stats?.maxCapacity) return 'Đã đủ số lượng';
        if (stats?.currentCount >= stats?.minRequired) return 'Có thể khởi động';
        return 'Chưa đủ số lượng tối thiểu';
    };

    return (
        <div className="bg-bg-base text-neutral-dark min-h-screen">
            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Quay lại
                        </button>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Quản lý Waitlist
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {stats?.courseTitle || 'Course'}
                        </p>
                    </div>

                    {stats?.status === 'NO_WAITLIST' ? (
                        // No Waitlist State
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Chưa có waitlist
                            </h3>
                            <p className="text-gray-600">
                                Hiện tại khóa học chưa có học viên nào trong danh sách chờ.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                {/* Current Count */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Học viên hiện tại</p>
                                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                                {stats?.currentCount || 0}
                                            </p>
                                        </div>
                                        <Users className="w-12 h-12 text-blue-400" />
                                    </div>
                                    <div className={`mt-4 px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor()}`}>
                                        {getStatusText()}
                                    </div>
                                </div>

                                {/* Min Required */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Tối thiểu</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                                {stats?.minRequired || 6}
                                            </p>
                                        </div>
                                        <TrendingUp className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4">
                                        Số học viên tối thiểu để start
                                    </p>
                                </div>

                                {/* Days Elapsed */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Số ngày</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                                {stats?.daysElapsed || 0}
                                            </p>
                                        </div>
                                        <Calendar className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4">
                                        Auto-start sau {stats?.autoStartAfterDays} ngày
                                    </p>
                                </div>

                                {/* Grace Period */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Grace Period</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                                {stats?.gracePeriodHours || 12}h
                                            </p>
                                        </div>
                                        <Clock className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4">
                                        Thời gian xem xét trước auto-action
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-white rounded-lg shadow p-6 mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Tiến độ đăng ký
                                    </h3>
                                    <span className="text-sm text-gray-600">
                                        {stats?.currentCount}/{stats?.maxCapacity} học viên
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>

                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>0</span>
                                    <span className="font-medium text-blue-600">
                                        Min: {stats?.minRequired}
                                    </span>
                                    <span>Max: {stats?.maxCapacity}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {stats?.status === 'OPENING' && (
                                <div className="bg-white rounded-lg shadow p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Hành động
                                    </h3>

                                    <div className="flex gap-4">
                                        {/* Start Class Button */}
                                        <button
                                            onClick={handleStartClass}
                                            disabled={!stats?.canStart || actionLoading}
                                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${stats?.canStart && !actionLoading
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <Play className="w-5 h-5" />
                                            {actionLoading ? 'Đang xử lý...' : 'Khởi động lớp học'}
                                        </button>

                                        {/* Cancel Button */}
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            disabled={!stats?.canCancel || actionLoading}
                                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${stats?.canCancel && !actionLoading
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Hủy waitlist
                                        </button>
                                    </div>

                                    {!stats?.canStart && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium text-yellow-900">
                                                    Chưa đủ điều kiện khởi động
                                                </p>
                                                <p className="text-yellow-700 mt-1">
                                                    Cần ít nhất {stats?.minRequired} học viên để có thể khởi động lớp học.
                                                    Hiện tại có {stats?.currentCount} học viên.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Students List */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Danh sách học viên ({stats?.members?.length || 0})
                                    </h3>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {stats?.members && stats.members.length > 0 ? (
                                        stats.members.map((member, index) => (
                                            <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {member.fullName}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {member.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <TrendingUp className="w-4 h-4" />
                                                            {member.totalExp || 0} EXP
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center text-gray-500">
                                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p>Chưa có học viên nào trong waitlist</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Cancel Modal */}
                    {showCancelModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Xác nhận hủy waitlist
                                </h3>

                                <p className="text-gray-600 mb-4">
                                    Tất cả {stats?.currentCount} học viên trong waitlist sẽ nhận được thông báo về việc hủy.
                                </p>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lý do hủy <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Ví dụ: Không đủ học viên đăng ký. Khóa học sẽ mở lại vào tháng sau."
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowCancelModal(false)}
                                        disabled={actionLoading}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        onClick={handleCancelWaitlist}
                                        disabled={actionLoading}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-300"
                                    >
                                        {actionLoading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default WaitlistManagement;
