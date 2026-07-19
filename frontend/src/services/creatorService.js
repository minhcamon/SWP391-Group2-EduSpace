import api from "@/lib/axios"

const creatorService = {
    getCreatorRequests: async () => {
        try {
            const res = await api.get("/creator-requests/history");
            return res.data.data
        } catch (error) {
            console.error('Get Creator Requests error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách các đơn chờ duyệt!';
            throw new Error(errorMsg);
        }
    },

    getPendingCreatorRequests: async () => {
        try {
            const res = await api.get("/creator-requests/pending");
            return res.data.data
        } catch (error) {
            console.error('Get Creator Pending Requests error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy các đơn chờ duyệt Creator!';
            throw new Error(errorMsg);
        }
    },

    approveCreatorRequest: async (requestId) => {
        try {
            const res = await api.put(`/creator-requests/${requestId}/approved`);
            return res.data.data
        } catch (error) {
            console.error('Approve Creator Requests error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi duyệt đơn Creator!';
            throw new Error(errorMsg);
        }
    },

    rejectCreatorRequest: async (requestId, payload) => {
        try {
            const res = await api.put(`/creator-requests/${requestId}/rejected`, payload);
            return res.data.data
        } catch (error) {
            console.error('Reject Creator Requests error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi từ chối đơn Creator!';
            throw new Error(errorMsg);
        }
    },

    getClassMentors: async (classId) => {
        try {
            const res = await api.get(`/creator/classes/${classId}/mentors`);
            return res.data.data;
        } catch (error) {
            console.error('getClassMentors error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách mentor!';
            throw new Error(errorMsg);
        }
    },

    addMentorToClass: async (classId, mentorId) => {
        try {
            const res = await api.post(`/creator/classes/${classId}/mentors`, { mentorId });
            return res.data.message || 'Gán mentor thành công!';
        } catch (error) {
            console.error('addMentorToClass error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể gán mentor vào lớp học!';
            throw new Error(errorMsg);
        }
    },

    removeMentorFromClass: async (classId, mentorId) => {
        try {
            const res = await api.delete(`/creator/classes/${classId}/mentors/${mentorId}`);
            return res.data.message || 'Xóa mentor khỏi lớp học!';
        } catch (error) {
            console.error('removeMentorFromClass error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể xóa mentor khỏi lớp học!';
            throw new Error(errorMsg);
        }
    },

    getWithdrawRequests: async () => {
        try {
            const res = await api.get("/creator/withdraw-requests");
            return res.data.data;
        } catch (error) {
            console.error('getWithdrawRequests error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách đơn xin rút lui!';
            throw new Error(errorMsg);
        }
    },

    getActiveMentorsForClass: async (classId) => {
        try {
            const res = await api.get(`/creator/classes/${classId}/active-mentors`);
            return res.data.data;
        } catch (error) {
            console.error('getActiveMentorsForClass error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách mentor khả dụng!';
            throw new Error(errorMsg);
        }
    },

    rejectWithdrawRequest: async (requestId) => {
        try {
            const res = await api.post(`/creator/withdraw-requests/${requestId}/reject`);
            return res.data.message || 'Từ chối đơn rút lui thành công!';
        } catch (error) {
            console.error('rejectWithdrawRequest error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể từ chối đơn rút lui!';
            throw new Error(errorMsg);
        }
    },

    initiateHandover: async (requestId, newMentorUserId) => {
        try {
            const res = await api.post(`/creator/withdraw-requests/${requestId}/initiate-handover`, { newMentorUserId });
            return res.data.message || 'Thiết lập bàn giao thành công!';
        } catch (error) {
            console.error('initiateHandover error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể bắt đầu bàn giao!';
            throw new Error(errorMsg);
        }
    },

    approveHandover: async (requestId) => {
        try {
            const res = await api.post(`/creator/withdraw-requests/${requestId}/approve-handover`);
            return res.data.message || 'Phê duyệt bàn giao thành công!';
        } catch (error) {
            console.error('approveHandover error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể phê duyệt bàn giao!';
            throw new Error(errorMsg);
        }
    },

    creatorTakeOver: async (requestId) => {
        try {
            const res = await api.post(`/creator/withdraw-requests/${requestId}/take-over`);
            return res.data.message || 'Creator tiếp quản lớp học thành công!';
        } catch (error) {
            console.error('creatorTakeOver error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tự tiếp quản lớp học!';
            throw new Error(errorMsg);
        }
    },

    getAnalytics: async (courseId, timeRange) => {
        try {
            const params = {};
            if (courseId) params.courseId = courseId;
            if (timeRange) params.timeRange = timeRange;
            const res = await api.get("/creator/analytics", { params });
            return res.data.data;
        } catch (error) {
            console.error('getAnalytics error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải dữ liệu thống kê!';
            throw new Error(errorMsg, { cause: error });
        }
    },

    getMentorApplications: async () => {
        try {
            const res = await api.get("/creator/mentor-applications");
            return res.data.data;
        } catch (error) {
            console.error('getMentorApplications error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách đơn xin làm mentor!';
            throw new Error(errorMsg, { cause: error });
        }
    },

    getMentorApplicationDetails: async (applicationId) => {
        try {
            const res = await api.get(`/creator/mentor-applications/${applicationId}`);
            return res.data.data;
        } catch (error) {
            console.error('getMentorApplicationDetails error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải chi tiết đơn xin làm mentor!';
            throw new Error(errorMsg, { cause: error });
        }
    },

    approveMentorApplication: async (applicationId) => {
        try {
            const res = await api.put(`/creator/mentor-applications/${applicationId}/approve`);
            return res.data.message || 'Phê duyệt đơn thành công!';
        } catch (error) {
            console.error('approveMentorApplication error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể phê duyệt đơn!';
            throw new Error(errorMsg, { cause: error });
        }
    },

    rejectMentorApplication: async (applicationId, rejectedReason) => {
        try {
            const res = await api.put(`/creator/mentor-applications/${applicationId}/reject`, { rejectedReason });
            return res.data.message || 'Từ chối đơn thành công!';
        } catch (error) {
            console.error('rejectMentorApplication error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể từ chối đơn!';
            throw new Error(errorMsg, { cause: error });
        }
    },

    getWaitlists: async () => {
        try {
            const response = await api.get('/waitlist/creator');
            return response.data.data;
        } catch (error) {
            console.error('getWaitlists error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách hàng chờ!';
            throw new Error(errorMsg);
        }
    },

    startClassFromWaitlist: async (waitlistId) => {
        try {
            const response = await api.post(`/waitlist/start-class/${waitlistId}`);
            return response.data.data;
        } catch (error) {
            console.error('startClassFromWaitlist error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi khởi tạo lớp học từ hàng chờ!';
            throw new Error(errorMsg);
        }
    }
}

export default creatorService