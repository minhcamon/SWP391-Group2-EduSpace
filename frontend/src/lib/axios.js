import axios from "axios";
import { getTokens } from "@/utils/utils.js";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

// Interceptor
// use() can 2 bien: onFullfilled va onRejected
// api.interceptors.request.use(
//     (config) => {
//         const token = getTokens();
//         if (token) {
//             config.headers.Authorization = `Bearer` + token;
//         }
//         return config;
//     },
// (error) => Promise.reject(error)
// );


export default api;
