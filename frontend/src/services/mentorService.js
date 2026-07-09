import api from "@/lib/axios";
import { mockMentorClasses } from "@/modules/mentor/utils/mockData";

export const mentorService = {
  /**
   * Fetches the classes mentored by the current mentor.
   * Currently uses mock data with a simulated network delay.
   */
  getMentorClasses: async () => {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMentorClasses);
      }, 200);
    });

    // Future API integration:
    // const response = await api.get("/mentor/classes");
    // return response.data.data;
  },

  /**
   * Simulates starting a new class/cohort.
   */
  startNewClass: async (classData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ isSuccess: true, message: "Đã tạo lớp học mới thành công!" });
      }, 300);
    });

    // Future API integration:
    // const response = await api.post("/mentor/classes", classData);
    // return response.data.message;
  }
};

export default mentorService;
