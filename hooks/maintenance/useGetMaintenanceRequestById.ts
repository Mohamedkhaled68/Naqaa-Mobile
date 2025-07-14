import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetMaintenanceRequestById = (id: string) => {
    return useQuery({
        queryKey: ["maintenanceRequest", id],
        queryFn: async () => {
            const response = await api.get(`/maintenance-requests/${id}`);
            return response.data.data;
        },
        enabled: !!id, // Only run the query if id is provided

        // Optional: configure stale time, cache time, etc.
        staleTime: 5 * 60 * 1000, // 5 minutes - request details don't change frequently

        // Retry configuration
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Error handling
        throwOnError: false,
    });
};

export default useGetMaintenanceRequestById;
