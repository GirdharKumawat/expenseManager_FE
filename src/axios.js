import axios from "axios";
import { API_ENDPOINT } from "./key";

// Create axios instance with basic configuration
const axiosAPI = axios.create({
    baseURL: API_ENDPOINT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});
 
let isRefreshing = false;
let refreshPromise = null;

axiosAPI.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // If we get 401 (unauthorized) and haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Prevent refresh attempts for the refresh endpoint itself
            if (originalRequest.url?.includes("token/refresh")) {
                window.location.href = "/login";
                return Promise.reject(error);
            }

            // Mark this request as retried
            originalRequest._retry = true;

            // If we're already refreshing, wait for that refresh to complete
            if (isRefreshing && refreshPromise) {
                try {
                    await refreshPromise;
                    return axiosAPI(originalRequest);
                } catch (refreshError) {
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }

            // Start the refresh process
            isRefreshing = true;
            refreshPromise = refreshToken();

            try {
                await refreshPromise;
                return axiosAPI(originalRequest);
            } catch (refreshError) {
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
                refreshPromise = null;
            }
        }
        
        return Promise.reject(error);
    }
);

// Separate refresh function for better error handling
async function refreshToken() {
    try {
        const response = await axiosAPI.post("api/auth/token/refresh/");
        return response;
    } catch (error) {
        throw error;
    }
}

export default axiosAPI;