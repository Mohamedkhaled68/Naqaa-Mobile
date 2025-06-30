import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Driver = {
    phoneNumber: string;
    password: string;
};

const useLogin = () => {
    const baseUrl = "https://srv830738.hstgr.cloud/api";

    return useMutation({
        mutationKey: ["auth", "login"],
        mutationFn: async (data: Driver) => {
            const response = await axios.post(`${baseUrl}/auth/login`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            return response.data;
        },

        onError: (error: any) => {
            return error?.response?.data?.message;
        },
    });
};

export default useLogin;
