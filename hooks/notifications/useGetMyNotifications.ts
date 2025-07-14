import api from "@/lib/api";
import { Notification } from "@/types/notification";
import { useQuery } from "@tanstack/react-query";

const useGetMyNotifications = () => {
    return useQuery({
        queryKey: ["notifications", "my"],
        queryFn: async (): Promise<Notification[]> => {
            const response = await api.get("/notifications/my");
            return response.data.data || [];
        },

        // Configure stale time - notifications should be relatively fresh
        staleTime: 1 * 60 * 1000, // 1 minute

        // Retry configuration
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Error handling
        throwOnError: false,

        // Sort notifications by creation date (newest first)
        select: (data) => {
            return data.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
        },
    });
};

export default useGetMyNotifications;
