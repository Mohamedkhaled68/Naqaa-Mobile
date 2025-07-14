import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Receiver = {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
};

const useReceiverRegister = () => {
    const baseUrl = "https://srv830738.hstgr.cloud/api";

    return useMutation({
        mutationKey: ["auth", "receiver", "register"],
        mutationFn: async (data: Receiver) => {
            const response = await axios.post(
                `${baseUrl}/receivers`,
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

export default useReceiverRegister;
