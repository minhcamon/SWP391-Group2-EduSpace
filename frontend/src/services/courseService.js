import api from '@/lib/axios';

const createCourse = async (courseData) => {
  const response = await api.post('/courses/create', courseData);
  return response.data;
};
