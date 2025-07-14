import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetAllRequests = () => {
    return useQuery({
        queryKey: ["requests", "allRequests"],
        queryFn: async () => {
            const response = await api.get("/maintenance-requests");
            return response.data.data;
        },

        // Optional: configure stale time, cache time, etc.
        staleTime: 2 * 60 * 1000, // 2 minutes - requests data might change frequently

        // Retry configuration
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Error handling
        throwOnError: false,
    });
};

export default useGetAllRequests;
