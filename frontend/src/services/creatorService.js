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

    initiateHandover: async (requestId, newMentorId) => {
        try {
            const res = await api.post(`/creator/handover/${requestId}`, { newMentorId });
            return res.data.message || 'Thiết lập bàn giao thành công!';
        } catch (error) {
            console.error('initiateHandover error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể bắt đầu bàn giao!';
            throw new Error(errorMsg);
        }
    },

    approveHandover: async (requestId) => {
        try {
            const res = await api.post(`/creator/handover/${requestId}/approve`);
            return res.data.message || 'Phê duyệt bàn giao thành công!';
        } catch (error) {
            console.error('approveHandover error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể phê duyệt bàn giao!';
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

    getClassesTimeline: async (courseId) => {
        try {
            const res = await api.get(`/creator/courses/${courseId}/classes-timeline`);
            return res.data.data;
        } catch (error) {
            console.error('getClassesTimeline error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải dòng thời gian lớp học!';
            throw new Error(errorMsg);
        }
    },

    rematchGroup: async (classId, moduleId) => {
        try {
            const res = await api.post(`/system/rematch-group/${classId}`, null, {
                params: { moduleId }
            });
            return res.data.message || 'Khởi chạy module thành công!';
        } catch (error) {
            console.error('rematchGroup error at creatorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể khởi chạy module!';
            throw new Error(errorMsg);
        }
    }
}

export default creatorService