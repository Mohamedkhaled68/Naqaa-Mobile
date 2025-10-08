import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetAcceptedRequests = () => {
    return useQuery({
        queryKey: ["receivers", "acceptedRequests"],
        queryFn: async () => {
            const response = await api.get("/receivers/accepted-requests");
            return response.data.data;
        },

        // Retry configuration
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Error handling
        throwOnError: false,
    });
};

export default useGetAcceptedRequests;
