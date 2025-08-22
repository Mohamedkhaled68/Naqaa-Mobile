import { LoginCredentials, User } from "@/types/auth";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const baseUrl = "https://srv830738.hstgr.cloud/api";

type AuthState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    isDriver: () => boolean;
    isReceiver: () => boolean;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,

    initialize: async () => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const userString = await SecureStore.getItemAsync(USER_KEY);

            if (token && userString) {
                const user = JSON.parse(userString);
                set({ user, token, isInitialized: true });
            } else {
                set({ isInitialized: true });
            }
        } catch (error) {
            console.error("Failed to initialize auth:", error);
            set({ isInitialized: true });
        }
    },

    signIn: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
            // Determine the endpoint based on role
            const endpoint =
                credentials.role === "driver"
                    ? "/auth/login"
                    : "/receiver/login";

            const response = await axios.post(`${baseUrl}${endpoint}`, {
                phoneNumber: credentials.phoneNumber,
                password: credentials.password,
            });

            const { user, token } = response.data.data || response.data;

            // Store in secure storage
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

            set({
                user,
                token,
                isLoading: false,
            });
        } catch (error) {
            console.error("Sign in failed:", error);
            set({ isLoading: false });
            throw error;
        }
    },

    signOut: async () => {
        try {
            // Remove from secure storage
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);

            set({ user: null, token: null });

            // Navigate to role selection page after logout
            router.replace("/(auth)/role-selection");
        } catch (error) {
            console.error("Sign out failed:", error);
            // Still clear the state even if storage fails
            set({ user: null, token: null });

            // Navigate to role selection even if storage cleanup fails
            router.replace("/(auth)/role-selection");
        }
    },

    setToken: (token: string) => {
        set({ token });
    },

    setUser: (user: User) => {
        set({ user });
    },

    isDriver: () => {
        const { user } = get();
        return user?.role === "driver";
    },

    isReceiver: () => {
        const { user } = get();
        return user?.role === "receiver";
    },

    deleteAccount: async () => {
        try {
            // Clear from secure storage
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);

            set({ user: null, token: null });

            // Navigate to role selection page after account deletion
            router.replace("/(auth)/role-selection");
        } catch (error) {
            console.error("Account deletion cleanup failed:", error);
            // Still clear the state even if storage fails
            set({ user: null, token: null });

            // Navigate to role selection even if storage cleanup fails
            router.replace("/(auth)/role-selection");
        }
    },
}));
