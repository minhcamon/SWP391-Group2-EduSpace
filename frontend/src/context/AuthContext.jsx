import React, { createContext } from 'react'
import { setTokens, clearTokens } from '../lib/utils';

// Luu thong tin nguoi dung vao context de cac component con co the truy cap duoc
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    // useEffect(() => {
    //     const checkAuth = 
    // })

    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await AuthService.login(username, password);
            const { token, user } = response.data;

            setTokens(token);
            setUser(user);

            return { success: true };

        } catch (error) {
            console.error('Login error at AuthContext:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        clearTokens();
        setUser(null);
    }

    const contextValue = {
        user,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}



export default AuthContext