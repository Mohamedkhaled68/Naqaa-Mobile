import api from "@/lib/api";
import { MarkNotificationAsReadResponse } from "@/types/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMarkNotificationAsReadById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["notifications", "markAsRead"],
        mutationFn: async (
            notificationId: string
        ): Promise<MarkNotificationAsReadResponse> => {
            const response = await api.patch(
                `/notifications/${notificationId}/read`
            );
            return response.data;
        },

        onSuccess: (data, notificationId) => {
            // Invalidate and refetch notifications data
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            // Optionally update the specific notification in cache
            queryClient.setQueryData(
                ["notifications", "my"],
                (oldData: any) => {
                    if (!oldData) return oldData;
                    return oldData.map((notification: any) =>
                        notification._id === notificationId
                            ? {
                                  ...notification,
                                  isRead: true,
                                  readAt: new Date().toISOString(),
                              }
                            : notification
                    );
                }
            );
        },

        onError: (error: any) => {
            console.error("Error marking notification as read:", error);
            return (
                error?.response?.data?.message ||
                "Failed to mark notification as read"
            );
        },
    });
};

export default useMarkNotificationAsReadById;
