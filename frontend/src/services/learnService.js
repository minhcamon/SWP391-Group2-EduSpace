import api from "@/lib/axios";

const learnService = {
    getProgressDashboard: async (classId) => {
        try {
            const response = await api.get(`/course/enroll/${classId}/dashboard`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi lấy thông tin Dashboard tại learnService:", error);
            throw new Error(
                error.response?.data?.message || "Không thể tải thông tin bảng tiến độ",
                { cause: error }
            );
        }
    },

    getProgressSidebarLearningSpace: async (classId, moduleId) => {
        try {
            const response = await api.get(`/course/enroll/${classId}/learning/${moduleId}`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi lấy thông tin học tập module tại learnService:", error);
            throw new Error(
                error.response?.data?.message || "Không thể tải tiến trình học tập của module này",
                { cause: error }
            );
        }
    },

    getGroupMessages: async (studyGroupId, classId) => {
        try {
            const response = await api.get(`/group/messages/${studyGroupId}/${classId}`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi lấy tin nhắn nhóm tại learnService:", error);
            throw new Error(
                error.response?.data?.message || "Không thể tải tin nhắn thảo luận nhóm",
                { cause: error }
            );
        }
    },

    sendGroupMessage: async (studyGroupId, classId, content, messageType = "TEXT") => {
        try {
            const response = await api.post(`/group/send-message/${studyGroupId}/${classId}`, {
                content,
                messageType,
            });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi gửi tin nhắn nhóm tại learnService:", error);
            throw new Error(
                error.response?.data?.message || "Không thể gửi tin nhắn thảo luận nhóm",
                { cause: error }
            );
        }
    },

    getMyLearningCourses: async () => {
        try {
            const res = await api.get("/course/my-learning/in-progress");
            return res.data.data;
        } catch (error) {
            console.error("Lỗi lấy các khóa học đang học tại learnService:", error);
            throw new Error(
                error.response?.data?.message ||
                "Đã xảy ra lỗi khi lấy các khóa học đang học!",
                { cause: error }
            );
        }
    },

    completeLesson: async (lessonId, classId) => {
        try {
            const response = await api.post(`/course/lessons/${lessonId}/complete`, classId, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi hoàn thành bài học tại learnService:", error);
            throw new Error(
                error.response?.data?.message || "Không thể hoàn thành bài học này",
                { cause: error }
            );
        }
    },

    getAssignmentDetails: async (assignmentId) => {
        // Simulated API call with 200ms delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: assignmentId,
                    title: "IELTS Writing Task 2",
                    prompt: "Some people think that in the modern world we are more dependent on each other, while others think that people have become more independent. Discuss both views and give your own opinion.",
                    timeRemaining: 45,
                });
            }, 200);
        });
    },

    submitAssignmentDraft: async (assignmentId, essay) => {
        // Simulated draft submission API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    isSuccess: true,
                    message: "Nộp bài nháp thành công!",
                    data: {
                        id: assignmentId,
                        essayLength: essay.length,
                        submittedAt: new Date().toISOString(),
                    }
                });
            }, 200);
        });
    },

    addPeerFeedback: async (assignmentId, feedback) => {
        // Simulated feedback creation API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    isSuccess: true,
                    message: "Đã thêm nhận xét đánh giá thành công!",
                    data: {
                        id: Date.now(),
                        ...feedback,
                    }
                });
            }, 200);
        });
    },
};

export default learnService;
