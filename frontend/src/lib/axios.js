import axios from "axios";
import { getTokens } from "@/utils/utils.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api"
});

// Interceptors
api.interceptors.request.use(
    (config) => {
        const token = getTokens();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default api;
