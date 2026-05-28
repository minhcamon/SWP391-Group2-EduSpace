export const setTokens = (accessToken) => {
    localStorage.setItem("access_token", accessToken);
}

export const getTokens = () => localStorage.getItem("access_token")

export const clearTokens = () => {
    localStorage.removeItem("access_token")
}