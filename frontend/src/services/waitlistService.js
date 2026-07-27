import api from '@/lib/axios';

const waitlistService = {
    getMembersInWaitlist: async (courseId) => {
        try {
            const response = await api.get(`/waitlist/members/${courseId}`);
            return response.data.data;
        } catch (error) {
            console.error('Get waitlist members error:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách học viên hàng chờ!';
            throw new Error(errorMsg);
        }
    },

    enrollWaitlist: async (courseId) => {
        try {
            const response = await api.post(`/waitlist/enroll/${courseId}`);
            return response.data.data;
        } catch (error) {
            console.error('Enroll waitlist error:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tham gia hàng chờ!';
            throw new Error(errorMsg);
        }
    },

    leaveWaitlist: async (courseId) => {
        try {
            const response = await api.delete(`/waitlist/leave/${courseId}`);
            return response.data.data;
        } catch (error) {
            console.error('Leave waitlist error:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi rời hàng chờ!';
            throw new Error(errorMsg);
        }
    },

    // ============= CREATOR APIs =============

    getWaitlistStats: async (courseId) => {
        try {
            const response = await api.get(`/waitlist/creator/stats/${courseId}`);
            return response.data.data;
        } catch (error) {
            console.error('Get waitlist stats error:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thống kê waitlist!';
            throw new Error(errorMsg);
        }
    },

    manualStartClass: async (waitlistId) => {
        try {
            const response = await api.post(`/waitlist/creator/${waitlistId}/start`);
            return response.data.data;
        } catch (error) {
            console.error('Manual start class error:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi khởi động lớp học!';
            throw new Error(errorMsg);
        }
    },

    cancelWaitlist: async (waitlistId, reason) => {
        try {
            const response = await api.post(`/waitlist/creator/${waitlistId}/cancel`, {
                reason
            });
            return response.data;
        } catch (error) {
            console.error('Cancel waitlist error:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi hủy waitlist!';
            throw new Error(errorMsg);
        }
    }
};

export default waitlistService;
