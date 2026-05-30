import { createContext, useContext, useState, useEffect } from "react";
import { setTokens, clearTokens, getTokens } from "@/utils/utils";
import AuthService from "@/services/authService";

// Luu thong tin nguoi dung vao context de cac component con co the truy cap duoc
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // default to true while checking auth

    const checkAuth = async () => {
        const token = getTokens();
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const userData = await AuthService.getUserProfile();
            setUser(userData);
        } catch (error) {
            console.error("Auto login failed:", error);
            clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const { token, user } = await AuthService.login(email, password);

            setTokens(token);
            setUser(user);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        clearTokens();
        setUser(null);
    };

    const contextValue = {
        user,
        isLoading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
