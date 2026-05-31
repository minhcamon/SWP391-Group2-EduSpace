import api from '@/lib/axios';

const AuthService = {
    login: async (email, password) => {
        try {
            const payload = { usernameOrEmail: email, password };

            const response = await api.post('/auth/login', payload);
            return response.data.data;
        } catch (error) {
            console.error('Login error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },

    register: async (userData) => {
        
        // const { username, email, password, fullname, phone } = userData;
        // const fullName = fullname;

        const payload = ({ username, email, password, fullName, phone }) => {
            return { userData: { username, email, password, fullName, phone } };
        };
        try {
            const response = await api.post('/auth/register', payload(userData));
            return response.data.message || 'Đăng ký thành công!';
        } catch (error) {
            console.error('Registration error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },

    getUserProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data.data;
        } catch (error) {
            console.error('Get profile error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể lấy thông tin người dùng!';
            throw new Error(errorMsg);
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/user/profile', profileData);
            return response.data.data;
        } catch (error) {
            console.error('Update profile error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/user/change-password', passwordData);
            return response.data.message || 'Đổi mật khẩu thành công!';
        } catch (error) {
            console.error('Change password error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },

    registerCreator: async (creatorData) => {
        try {
            const response = await api.post('/user/creator-register', creatorData);
            return response.data.message || 'Đăng ký làm Creator thành công!';
        } catch (error) {
            console.error('Register creator error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Đăng ký làm Creator thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },

    getGoogleAuthUrl: () => {
        try {
            const apiUrl =  api.defaults.baseURL;
            const rootUrl = apiUrl.replace(/\/api$/, '');
            return `${rootUrl}/oauth2/authorization/google`;
        } catch (error) {
            console.error('Get Google auth URL error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể lấy URL đăng nhập Google!';
            throw new Error(errorMsg);
        }
    }

};

export default AuthService;
