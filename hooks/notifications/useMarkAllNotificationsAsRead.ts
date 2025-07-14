import api from "@/lib/api";
import { MarkAllNotificationsAsReadResponse } from "@/types/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["notifications", "markAllRead"],
        mutationFn: async (): Promise<MarkAllNotificationsAsReadResponse> => {
            const response = await api.patch("/notifications/mark-all-read");
            return response.data;
        },

        onSuccess: (data) => {
            // Invalidate and refetch notifications data
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },

        onError: (error: any) => {
            console.error("Error marking all notifications as read:", error);
            return (
                error?.response?.data?.message ||
                "Failed to mark notifications as read"
            );
        },
    });
};

export default useMarkAllNotificationsAsRead;
