import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const useDeleteAccount = () => {
    return useMutation({
        mutationKey: ["auth", "delete-account"],
        mutationFn: async () => {
            const response = await api.delete("/auth/delete-account");
            return response.data;
        },
        onError: (error: any) => {
            console.error("Account deletion error:", error);
            return error?.response?.data?.message || "Failed to delete account";
        },
    });
};

export default useDeleteAccount;
