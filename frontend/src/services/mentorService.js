import api from "@/lib/axios";
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
    submitWithdrawRequest: async (classId, data) => {
        try {
            const response = await api.post(`/mentor/classes/${classId}/withdraw-requests`, data);
            return response.data.data;
        } catch (error) {
            console.error('submitWithdrawRequest error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể gửi yêu cầu rút lui!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Cancels a pending withdraw request for a class.
     */
    cancelWithdrawRequest: async (classId) => {
        try {
            const response = await api.post(`/mentor/classes/${classId}/withdraw-requests/cancel`);
            return response.data.message;
        } catch (error) {
            console.error('cancelWithdrawRequest error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể hủy yêu cầu rút khỏi lớp!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches all withdraw requests of current mentor.
     */
    getMyWithdrawRequests: async () => {
        try {
            const response = await api.get('/mentor/withdraw-requests');
            return response.data.data;
        } catch (error) {
            console.error('getMyWithdrawRequests error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải lịch sử đơn xin rút lui!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches details of a withdraw request.
     */
    getWithdrawRequest: async (id) => {
        try {
            const response = await api.get(`/mentor/withdraw-requests/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('getWithdrawRequest error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải chi tiết yêu cầu rút lui!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches teaching configuration (active courses) of mentor.
     */
    getActiveCourses: async () => {
        try {
            const response = await api.get('/mentor/active-courses');
            return response.data.data;
        } catch (error) {
            console.error('getActiveCourses error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải cấu hình giảng dạy!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Registers teaching for a course (ActiveMentor pool).
     */
    registerActiveCourse: async (courseId) => {
        try {
            const response = await api.post('/mentor/active-courses', { courseId });
            return response.data.message;
        } catch (error) {
            console.error('registerActiveCourse error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể đăng ký giảng dạy khóa học!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Updates status for registered active course.
     */
    updateActiveCourseStatus: async (courseId, status) => {
        try {
            const response = await api.put(`/mentor/active-courses/${courseId}/status`, { status });
            return response.data.message;
        } catch (error) {
            console.error('updateActiveCourseStatus error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể cập nhật trạng thái giảng dạy!';
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
    resolveIncident: async (id, payload) => {
        try {
            const response = await api.put(`/incidents/${id}/resolve`, payload);
            return response.data.message;
        } catch (error) {
            console.error('resolveIncident error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể giải quyết sự cố!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Rejects an incident.
     */
    rejectIncident: async (id, payload) => {
        try {
            const response = await api.put(`/incidents/${id}/reject`, payload);
            return response.data.message;
        } catch (error) {
            console.error('rejectIncident error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể từ chối sự cố!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Warns learner in incident.
     */
    warnIncident: async (id, payload) => {
        try {
            const response = await api.put(`/incidents/${id}/warn`, payload);
            return response.data.message;
        } catch (error) {
            console.error('warnIncident error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể cảnh cáo học viên!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches all arbitrations.
     */
    getArbitrations: async () => {
        try {
            const response = await api.get(`/mentor/arbitrations`);
            return response.data.data;
        } catch (error) {
            console.error('getArbitrations error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải danh sách đơn phân xử!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Fetches arbitration by ID.
     */
    getArbitrationById: async (id) => {
        try {
            const response = await api.get(`/mentor/arbitrations/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('getArbitrationById error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải chi tiết đơn phân xử!';
            throw new Error(errorMsg);
        }
    },

    /**
     * Submits final score for arbitration.
     */
    submitArbitrationGrade: async (id, finalScore, comment) => {
        try {
            const normalizedScore = Number(finalScore);
            const response = await api.post(`/mentor/arbitrations/${id}/grade`, {
                finalScore: normalizedScore,
                comments: comment,
                criteriaScores: [
                    {
                        criterionName: 'Mentor final review',
                        description: 'Final score submitted by mentor after arbitration review',
                        maxPoint: 10,
                        score: normalizedScore
                    }
                ]
            });
            return response.data.message;
        } catch (error) {
            console.error('submitArbitrationGrade error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể chấm điểm phân xử!';
            throw new Error(errorMsg);
        }
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
    },

    getPairChat: async (pairId) => {
        try {
            const response = await api.get(`/mentor/pairs/${pairId}/chat`);
            return response.data.data;
        } catch (error) {
            console.error('getPairChat error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể tải lịch sử trò chuyện!';
            throw new Error(errorMsg, { cause: error });
        }
    },

    applyToBecomeMentor: async (classId) => {
        try {
            const response = await api.post(`/mentor-applications/apply/${classId}`);
            return response.data.message;
        } catch (error) {
            console.error('applyToBecomeMentor error at mentorService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể gửi đơn đăng ký làm Mentor!';
            throw new Error(errorMsg, { cause: error });
        }
    }
};

export default mentorService;
