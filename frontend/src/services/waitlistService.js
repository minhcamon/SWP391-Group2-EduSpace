import api from '@/lib/axios';

const waitlistService = {
  getMembersInWaitlist: async (courseId) => {
    try {
      const response = await api.get(`/waitlist/members/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get waitlist members error:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách học viên hàng chờ!';
      throw new Error(errorMsg);
    }
  },

  enrollWaitlist: async (courseId) => {
    try {
      const response = await api.post(`/waitlist/enroll/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Enroll waitlist error:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tham gia hàng chờ!';
      throw new Error(errorMsg);
    }
  },

  leaveWaitlist: async (courseId) => {
    try {
      const response = await api.delete(`/waitlist/leave/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Leave waitlist error:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi rời hàng chờ!';
      throw new Error(errorMsg);
    }
  }
};

export default waitlistService;
