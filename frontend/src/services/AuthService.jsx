import api from '../lib/axios';

const AuthService = {
    login: async(username, password) => {
        try {
            const response = await api.post('/login', { username, password });
            console.log('Login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login error at AuthService:', error);
            throw error;
        }
    },

    register: async(username, password, email, phone, fullname) => {
        try {
            const response = await api.post('/register', { username, password, email, phone, fullname });
            console.log('Register response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error at AuthService:', error);
            throw error;
        }
    }
}

export default AuthService;
