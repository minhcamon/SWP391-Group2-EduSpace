import api from '@/lib/axios';

const AuthService = {
    login: async (email, password) => {
        try {
            const payload = { 
                usernameOrEmail: email, 
                password 
            };

            const response = await api.post('/auth/login', payload);
            return response.data.data;
        } catch (error) {
            console.error('Login error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },

    register: async (userData) => {
        
        console.log('Registering user with data:', userData);
        const payload = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            fullName: userData.fullname,
            phone: userData.phone
        };
        console.log('Payload for registration:', payload);
        try {
            const response = await api.post('/auth/register', payload);
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
            const payload = {
                reason: creatorData.portfolioUrl
            };
            console.log('Payload for creator registration:', payload);            
            const response = await api.post('/creator-requests/send', payload);
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
    },

    getLearnersCount: async () => {
        try {
            const response = await api.get('/user/count/active');
            return response.data.data;
        } catch (error) {
            console.error('Get active users count error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể lấy tổng số người dùng đang hoạt động!';
            throw new Error(errorMsg, { cause: error });
        }
    },

    verifyEmail: async (token) => {
        try {
            const response = await api.get(`/auth/verify-email?token=${token}`);
            return response.data.message || 'Xác thực email thành công!';
        } catch (error) {
            console.error('Verify email error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Xác thực email thất bại. Token không hợp lệ hoặc đã hết hạn!';
            throw new Error(errorMsg);
        }
    },

    resendVerificationEmail: async (email) => {
        try {
            const response = await api.post('/auth/resend-verification', { email });
            return response.data.message || 'Email xác thực mới đã được gửi!';
        } catch (error) {
            console.error('Resend verification email error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Không thể gửi email xác thực. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    }

};

export default AuthService;
