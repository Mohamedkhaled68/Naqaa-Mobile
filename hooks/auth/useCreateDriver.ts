import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Driver = {
    name: string;
    phoneNumber: string;
    nationalId: string;
    password: string;
    licenseNumber: string;
    address?: string;
};

const useCreateDriver = () => {
    const baseUrl = "https://api.modev.me/api";

    return useMutation({
        mutationKey: ["auth", "register"],
        mutationFn: async (data: Driver) => {
            const response = await axios.post(
                `${baseUrl}/auth/register`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.data;
        },

        onError: (error: any) => {
            return error?.response?.data?.message;
        },
    });
};

export default useCreateDriver;
