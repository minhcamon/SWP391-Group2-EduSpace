import api from '@/lib/axios';

const courseService = {
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses/create', courseData);
      return response.data.data;
    } catch (error) {
      console.error('Create course error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tạo khóa học!';
      throw new Error(errorMsg);
    }
  },

  saveDraft: async (courseData) => {
    try {
      const response = await api.post('/courses/draft', courseData);
      return response.data.data;
    } catch (error) {
      console.error('Save draft error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lưu bản nháp!';
      throw new Error(errorMsg);
    }
  },

  getPublishedCourses: async () => {
    try {
      const response = await api.get('/course/all');
      return response.data.data;
    } catch (error) {
      console.error('Get Published Courses error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy các khóa học đã xuất bản!';
      throw new Error(errorMsg);
    }
  },

  getPendingCourses: async () => {
    try {
      const response = await api.get('/course/pending');
      return response.data.data;
    } catch (error) {
      console.error('Get Pending Courses error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy các khóa học chờ duyệt!';
      throw new Error(errorMsg);
    }
  },

  approveCourse: async (courseId) => {
    try {
      const response = await api.put(`/course/${courseId}/approve`);
      return response.data.data;
    } catch (error) {
      console.error('Approve Courses error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi thay đổi trạng thái khóa học thành thành công!';
      throw new Error(errorMsg);
    }
  },

  rejectCourse: async (courseId) => {
    try {
      const response = await api.put(`/course/${courseId}/reject`);
      return response.data.data;
    } catch (error) {
      console.error('Reject Courses error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi thay đổi trạng thái khóa học thành từ chối!';
      throw new Error(errorMsg);
    }
  }
};

export default courseService;