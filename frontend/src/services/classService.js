import axiosClient from "@/lib/axios";

const classService = {
    // Sẵn sàng kết nối với ClassController.java sắp tới
    getClasses: async () => {
        const response = await axiosClient.get("/api/classes");
        return response.data;
    },
};

export default classService;
