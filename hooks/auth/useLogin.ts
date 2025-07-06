import { LoginCredentials } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useLogin = () => {
    const baseUrl = "https://srv830738.hstgr.cloud/api";

    return useMutation({
        mutationKey: ["auth", "login"],
        mutationFn: async (credentials: LoginCredentials) => {
            // Determine endpoint based on role
            const endpoint =
                credentials.role === "driver"
                    ? "/auth/login"
                    : "/auth/receiver/login";

            const response = await axios.post(
                `${baseUrl}${endpoint}`,
                {
                    phoneNumber: credentials.phoneNumber,
                    password: credentials.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        },

        onError: (error: any) => {
            return error?.response?.data?.message;
        },
    });
};

export default useLogin;
