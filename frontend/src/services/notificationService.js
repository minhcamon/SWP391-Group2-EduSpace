import api from "@/lib/axios";

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error(error.response?.data?.message || "Không thể lấy danh sách thông báo", { cause: error });
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error(error.response?.data?.message || "Không thể đánh dấu đã đọc thông báo", { cause: error });
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put("/notifications/read-all");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw new Error(error.response?.data?.message || "Không thể đánh dấu đọc tất cả thông báo", { cause: error });
    }
  }
};

export default notificationService;
