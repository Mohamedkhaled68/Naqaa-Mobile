import api from "@/lib/api";
import { DeleteNotificationResponse } from "@/types/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteNotificationById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["notifications", "delete"],
        mutationFn: async (
            notificationId: string
        ): Promise<DeleteNotificationResponse> => {
            const response = await api.delete(
                `/notifications/${notificationId}`
            );
            return response.data;
        },

        onSuccess: (data, notificationId) => {
            // Invalidate and refetch notifications data
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            // Optionally remove the notification from cache immediately
            queryClient.setQueryData(
                ["notifications", "my"],
                (oldData: any) => {
                    if (!oldData) return oldData;
                    return oldData.filter(
                        (notification: any) =>
                            notification._id !== notificationId
                    );
                }
            );
        },

        onError: (error: any) => {
            console.error("Error deleting notification:", error);
            return (
                error?.response?.data?.message ||
                "Failed to delete notification"
            );
        },
    });
};

export default useDeleteNotificationById;
