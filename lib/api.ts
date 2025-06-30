import axios, { InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = "https://srv830738.hstgr.cloud/api";
const TOKEN_KEY = "auth_token";

// Create axios instance
const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error getting token from secure store:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                // Clear stored token on 401
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                await SecureStore.deleteItemAsync("auth_user");

                // You could also redirect to login here if needed
                // But it's better to handle this in the component
            } catch (clearError) {
                console.error("Error clearing auth data:", clearError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
