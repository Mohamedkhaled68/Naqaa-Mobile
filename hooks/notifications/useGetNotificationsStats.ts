import api from "@/lib/api";
import { NotificationStats } from "@/types/notification";
import { useQuery } from "@tanstack/react-query";

const useGetNotificationsStats = () => {
    return useQuery({
        queryKey: ["notifications", "stats"],
        queryFn: async (): Promise<NotificationStats> => {
            const response = await api.get("/notifications/stats");
            console.log(response);
            
            return response.data.data;
        },

        // Stats can be cached a bit longer
        staleTime: 2 * 60 * 1000, // 2 minutes

        // Retry configuration
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Error handling
        throwOnError: false,

        // Refetch on window focus to keep stats current
        refetchOnWindowFocus: true,
    });
};

export default useGetNotificationsStats;
