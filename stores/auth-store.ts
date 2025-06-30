import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const baseUrl = "https://srv830738.hstgr.cloud/api";

type User = {
    id: string;
    email: string;
    name?: string;
};

type DriverInfo = {
    name: string;
    phoneNumber: number;
    nationalId: string;
    licenseNumber: string;
    address: string;
    car?: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
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

    signIn: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${baseUrl}/auth/login`, {
                email,
                password,
            });

            const { user, token } = response.data.data;

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

    signUp: async (email, password, name) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${baseUrl}/auth/register`, {
                email,
                password,
                name,
            });

            const { user, token } = response.data.data;

            // Store in secure storage
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

            set({
                user,
                token,
                isLoading: false,
            });
        } catch (error) {
            console.error("Sign up failed:", error);
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
        } catch (error) {
            console.error("Sign out failed:", error);
            // Still clear the state even if storage fails
            set({ user: null, token: null });
        }
    },

    setToken: (token: string) => {
        set({ token });
    },

    setUser: (user: User) => {
        set({ user });
    },
}));
