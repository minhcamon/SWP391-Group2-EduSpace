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

  getAllPublishedCourses: async () => {
    try {
      const response = await api.get('/course/all');
      return response.data.data;
    } catch (error) {
      console.error('Get All Published Courses error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy các khóa học đã xuất bản!';
      throw new Error(errorMsg);
    }
  }
};

export default courseService;