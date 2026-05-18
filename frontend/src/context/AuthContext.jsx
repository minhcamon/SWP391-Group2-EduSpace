import React, { createContext } from 'react'
import { setTokens, clearTokens } from '../lib/utils';
import AuthService from '../services/AuthService';

// Luu thong tin nguoi dung vao context de cac component con co the truy cap duoc
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    // useEffect(() => {
    //     const checkAuth = 
    // })

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // AuthService đã tự chuẩn hóa data và ném Error nếu có lỗi
            const { token, user } = await AuthService.login(email, password);
            
            setTokens(token);
            setUser(user);
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