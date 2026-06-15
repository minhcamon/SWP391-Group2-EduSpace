import api from "@/lib/axios";
import {
    initialMessages,
    initialNotes,
    materialsList,
    partnerData,
    courseProgress,
    roadmapNodes,
    courseTitle,
    studyGroup,
    lessonDetails,
    sidebarSections,
    modulesData,
    myLearningActiveCourses,
    myLearningAvailableCourses
} from "@/modules/learning/utils/mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const learnService = {
    getLearningAreaDetails: async (courseId) => {
        try {
            // Simulate network delay
            await delay(200);
            // In the future, this will be swapped with:
            // const response = await api.get(`/courses/${courseId}/learn`);
            // return response.data.data;
            return {
                courseTitle,
                studyGroup,
                lesson: lessonDetails,
                sidebarSections,
                messages: initialMessages,
                notes: initialNotes,
                materials: materialsList
            };
        } catch (error) {
            console.error("Lỗi lấy thông tin Learning Area tại learnService:", error);
            throw new Error(error.response?.data?.message || "Không thể tải thông tin bài học");
        }
    },

    getProgressDashboard: async (courseId) => {
        try {
            // Simulate network delay
            await delay(200);
            // In the future, this will be swapped with:
            // const response = await api.get(`/courses/${courseId}/dashboard`);
            // return response.data.data;
            return {
                partner: partnerData,
                progress: courseProgress,
                roadmap: roadmapNodes,
                modules: modulesData
            };
        } catch (error) {
            console.error("Lỗi lấy thông tin Dashboard tại learnService:", error);
            throw new Error(error.response?.data?.message || "Không thể tải thông tin bảng tiến độ");
        }
    },

    getMyLearning: async () => {
        try {
            await delay(200);
            return {
                activeCourses: myLearningActiveCourses,
                availableCourses: myLearningAvailableCourses
            };
        } catch (error) {
            console.error("Lỗi lấy thông tin học tập tại learnService:", error);
            throw new Error(error.response?.data?.message || "Không thể tải thông tin học tập của bạn");
        }
    }
};

export default learnService;
