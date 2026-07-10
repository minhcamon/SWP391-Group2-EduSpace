export const setTokens = (accessToken) => {
    localStorage.setItem("access_token", accessToken);
}

export const getTokens = () => localStorage.getItem("access_token")

export const clearTokens = () => {
    localStorage.removeItem("access_token")
}

export const decodeToken = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        const claims = JSON.parse(jsonPayload);
        return {
            id: claims.userId,
            username: claims.sub,
            fullName: claims.name,
            email: claims.email,
            avatarUrl: claims.avatar || null,
            role: claims.role,
            isMentor: claims.isMentor || false,
        };
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const runWithLoading = async (setLoading, asyncFn) => {
    if (typeof setLoading !== "function") return asyncFn();
    setLoading(true);
    try {
        return await asyncFn();
    } finally {
        setLoading(false);
    }
};
