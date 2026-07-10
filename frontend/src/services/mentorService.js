import api from "@/lib/axios";
import { mockArbitrations } from "@/modules/mentor/utils/mockData";
export const mentorService = {
    /**
     * Fetches the classes mentored by the current mentor.
     */
    getMentorClasses: async () => {
        try {
            const response = await api.get('/mentor/classes');
            return response.data.data;
        } catch (error) {
            console.error('getMentorClasses error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách lớp học!';
            throw new Error(errorMsg);
        }
    },

    getMentorClassesPair: async (classId) => {
        try {
            const response = await api.get(`/mentor/classes/${classId}/pairs`);
            return response.data.data;
        } catch (error) {
            console.error('getMentorClassesPair error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách cặp lớp học!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches class detail by ID.
     */
    getClassById: async (id) => {
        try {
            const response = await api.get(`/mentor/classes/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('getClassById error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải chi tiết lớp học!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches class pairs/groups by class ID.
     */
    getClassPairs: async (classId) => {
        try {
            const response = await api.get(`/mentor/classes/${classId}/pairs`);
            return response.data.data;
        } catch (error) {
            console.error('getClassPairs error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách nhóm học tập!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Submits a withdraw request.
     */
    submitWithdrawRequest: async (data) => {
        try {
            const response = await api.post('/mentor/withdraw-request', data);
            return response.data.message || 'Gửi yêu cầu rút lui thành công!';
        } catch (error) {
            console.error('submitWithdrawRequest error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể gửi yêu cầu rút lui!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches details of a withdraw request.
     */
    getWithdrawRequest: async (id) => {
        try {
            const response = await api.get(`/mentor/withdraw-request/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('getWithdrawRequest error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải chi tiết yêu cầu rút lui!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches all incidents.
     */
    getIncidents: async () => {
        try {
            const response = await api.get('/incidents');
            return response.data.data;
        } catch (error) {
            console.error('getIncidents error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách sự cố!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches incident by ID.
     */
    getIncidentById: async (id) => {
        try {
            const response = await api.get(`/incidents/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('getIncidentById error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải chi tiết sự cố!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Claims an incident.
     */
    claimIncident: async (id) => {
        try {
            const response = await api.put(`/incidents/${id}/accept`);
            return response.data.message;
        } catch (error) {
            console.error('claimIncident error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể nhận xử lý sự cố!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Resolves an incident.
     */
    resolveIncident: async (id, resolutionNote) => {
        try {
            const response = await api.put(`/incidents/${id}/resolve`, resolutionNote);
            return response.data.message;
        } catch (error) {
            console.error('resolveIncident error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể giải quyết sự cố!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches all arbitrations.
     */
    getArbitrations: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockArbitrations);
            }, 200);
        });
    },

    /**
     * Fetches arbitration by ID.
     */
    getArbitrationById: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const found = mockArbitrations.find((a) => a.id === id);
                if (found) {
                    resolve(found);
                } else {
                    reject(new Error("Không tìm thấy đơn phân xử!"));
                }
            }, 200);
        });
    },

    /**
     * Submits final score for arbitration.
     */
    submitArbitrationGrade: async (id, finalScore, comment) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const found = mockArbitrations.find((a) => a.id === id);
                if (found) {
                    found.status = "RESOLVED";
                    found.finalScore = finalScore;
                    found.comment = comment;
                }
                resolve({ isSuccess: true, message: "Đã chấm điểm phân xử thành công!" });
            }, 200);
        });
    },

    /**
     * Fetches pair details by ID.
     */
    getPairById: async (id) => {
        try {
            const response = await api.get(`/mentor/pairs/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('getPairById error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải chi tiết nhóm học tập!';
            throw new Error(errorMsg);
        }
    }
};

export default mentorService;
