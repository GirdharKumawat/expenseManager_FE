import axios from "axios";
import {API_ENDPOINT} from "./key";

const axiosAPI = axios.create({
    baseURL: API_ENDPOINT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Simple flag to prevent multiple refresh attempts
let isRefreshing = false;

// Response interceptor for automatic token refresh
axiosAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors with automatic token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for auth endpoints to prevent loops
            if (
                originalRequest.url?.includes("token/refresh") ||
                originalRequest.url?.includes("login") ||
                originalRequest.url?.includes("register")
            ) {
                return Promise.reject(error);
            }

            // Prevent multiple simultaneous refresh attempts
            if (isRefreshing) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt token refresh
                await axiosAPI.post("api/auth/token/refresh/");

                // Retry the original request
                return axiosAPI(originalRequest);
            } catch (refreshError) {
                if (typeof window !== "undefined") {
                 window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosAPI;
