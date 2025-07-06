import api from "@/lib/api";
import { CurrentDriverResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useGetCurrentDriver = () => {
    return useQuery({
        queryKey: ["drivers", "me"],
        queryFn: async (): Promise<CurrentDriverResponse> => {
            const response = await api.get("/drivers/me");
            return response.data.data;
        },

        // Optional: configure stale time, cache time, etc.
        staleTime: 2 * 60 * 1000, // 2 minutes - profile data doesn't change frequently

        // Retry configuration
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Error handling
        throwOnError: false,
    });
};

export default useGetCurrentDriver;
