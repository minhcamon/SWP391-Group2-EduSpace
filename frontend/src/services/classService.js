import axiosClient from "@/lib/axios";

const classService = {
  getClasses: async () => {
    const response = await axiosClient.get("/api/classes");
    return response.data;
  },

  getCommunity: async (classId) => {
    const response = await axiosClient.get(`/class/community/${classId}`);
    return response.data;
  },
};

export default classService;
