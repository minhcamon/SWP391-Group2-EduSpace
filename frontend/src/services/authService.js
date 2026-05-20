import api from '@/lib/axios';


const AuthService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            // Trả về trực tiếp object chứa { token, user }
            return response.data.data; 
        } catch (error) {
            console.error('Login error at AuthService:', error);
            // Chuẩn hóa lỗi Axios thành JS Error
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            // Trả về chuỗi message thành công
            return response.data.message || 'Đăng ký thành công!';
        } catch (error) {
            console.error('Registration error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    }
};

export default AuthService;
