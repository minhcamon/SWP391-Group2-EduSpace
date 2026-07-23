import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import creatorService from '@/services/creatorService';

export const useWithdrawRequests = () => {
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

    const setSelectedMentorForRequest = (requestId, mentorId) => {
        setSelectedMentorMap(prev => ({ ...prev, [requestId]: mentorId }));
    };

    return {
        requests,
        isLoading,
        activeFilter,
        setActiveFilter,
        loadingMentorsMap,
        availableMentorsMap,
        selectedMentorMap,
        isActioningMap,
        filteredRequests,
        fetchRequests,
        handleReject,
        handleApproveDirect,
        handleLoadAvailableMentors,
        handleInitiateHandover,
        handleApproveHandover,
        handleTakeOver,
        setSelectedMentorForRequest
    };
};

export default useWithdrawRequests;
