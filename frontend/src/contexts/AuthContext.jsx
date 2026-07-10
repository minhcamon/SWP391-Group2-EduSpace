import { createContext, useContext, useState, useEffect } from "react";
import { setTokens, clearTokens, getTokens, decodeToken } from "@/utils/utils";
import authService from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                console.error("Failed to parse saved user:", e);
            }
        }
        const token = getTokens();
        return token ? decodeToken(token) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const token = getTokens();
        if (!token) {
            setUser(null);
            localStorage.removeItem("user");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const userData = await authService.getUserProfile();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Auto login failed:", error);
            clearTokens();
            setUser(null);
            localStorage.removeItem("user");
        } finally {
            setIsLoading(false);
        }
    };

    const [currentMode, setCurrentMode] = useState(() => {
        return localStorage.getItem("currentMode") || "LEARNER";
    });

    const setMode = (mode) => {
        setCurrentMode(mode);
        localStorage.setItem("currentMode", mode);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username, password) => {
        const { token, user: userData } = await authService.login(username, password);
        console.log(token, userData);
        setTokens(token);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        // Reset to Learner mode upon new login
        setMode("LEARNER");
    };

    const logout = () => {
        clearTokens();
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("currentMode");
        setCurrentMode("LEARNER");
    };


    const contextValue = {
        user,
        isLoading,
        login,
        logout,
        checkAuth,
        currentMode,
        setMode
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
