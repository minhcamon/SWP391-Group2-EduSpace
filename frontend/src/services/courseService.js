import api from '@/lib/axios';

const courseService = {
  uploadMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data; // secure_url
    } catch (error) {
      console.error('Upload media error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tải file lên!';
      throw new Error(errorMsg);
    }
  },

  createCourse: async (courseData) => {
    try {
      const response = await api.post('/course/create-course', courseData);
      return response.data.data;
    } catch (error) {
      console.error('Create course error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tạo khóa học!';
      throw new Error(errorMsg);
    }
  },

  getCourseByCreator: async () => {
    try {
      const response = await api.get('/course/my-courses');
      return response.data.data;
    } catch (error) {
      console.error('Get Course by Creator ID error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy khóa học theo người tạo!';
      throw new Error(errorMsg);
    }

  },

  getPublishedCourses: async (page = 0, size = 6) => {
    try {
      const response = await api.get('/course/all', {
        params: { page, size }
      });
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

  rejectCourse: async (courseId, payload) => {
    try {
      const response = await api.put(`/course/${courseId}/reject`, payload);
      return response.data.data;
    } catch (error) {
      console.error('Reject Courses error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi thay đổi trạng thái khóa học thành từ chối!';
      throw new Error(errorMsg);
    }
  },

  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/course/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get Course details error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tải chi tiết khóa học!';
      throw new Error(errorMsg);
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/course/${courseId}/update`, courseData);
      return response.data.data;
    } catch (error) {
      console.error('Update Course error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật khóa học!';
      throw new Error(errorMsg);
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/course/${courseId}/delete`);
      return response.data.data;
    } catch (error) {
      console.error('Delete Course error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi xóa khóa học!';
      throw new Error(errorMsg);
    }
  },

  getCourseRequestsHistory: async () => {
    try {
      const response = await api.get("/course-requests/history");
      return response.data.data;
    } catch (error) {
      console.error('Get Course Requersts History error at CourseService:', error);
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tải lịch sử duyệt khóa học!';
      throw new Error(errorMsg);
    }
  },
};

export default courseService;