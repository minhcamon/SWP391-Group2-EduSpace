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
    }
}

export default creatorService