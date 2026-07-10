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
    }
}

export default creatorService