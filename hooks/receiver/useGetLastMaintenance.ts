import api from "@/lib/api";
import { MaintenanceHistoryRecord } from "@/types/maintenance-history";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface UseGetLastMaintenanceParams {
    driverName?: string;
    plateNumber?: string;
    subCategoryName?: string;
    date?: string;
    enabled?: boolean;
}

interface MaintenanceAPIResponse {
    data: {
        maintenanceRecords: {
            data: MaintenanceHistoryRecord[];
            total?: number;
            page?: number;
        };
    };
}

/**
 * Custom hook to fetch completed maintenance history records
 * @param params - Filter parameters for maintenance records
 * @param options - Additional react-query options
 */
const useGetLastMaintenance = (
    params: UseGetLastMaintenanceParams = {},
    options?: Omit<
        UseQueryOptions<MaintenanceHistoryRecord[], Error>,
        "queryKey" | "queryFn"
    >
) => {
    const {
        driverName = "",
        plateNumber = "",
        subCategoryName = "",
        date = "",
        enabled = true,
    } = params;

    // Build query parameters object
    const queryParams = new URLSearchParams({
        status: "complete",
        ...(driverName && { driverName }),
        ...(plateNumber && { plateNumber }),
        ...(subCategoryName && { subCategoryName }),
        ...(date && { date }),
    });

    return useQuery<MaintenanceHistoryRecord[], Error>({
        // Include parameters in queryKey for proper cache invalidation
        queryKey: [
            "maintenance",
            "lastMaintenance",
            { driverName, plateNumber, subCategoryName },
        ],

        queryFn: async (): Promise<MaintenanceHistoryRecord[]> => {
            try {
                const response = await api.get<MaintenanceAPIResponse>(
                    `/receivers/maintenance-history?status=completed&${queryParams.toString()}`
                );

                const records = response.data?.data?.maintenanceRecords?.data;

                if (!Array.isArray(records)) {
                    console.warn(
                        "Unexpected API response format:",
                        response.data
                    );
                    return [];
                }

                console.log(`Fetched ${records.length} maintenance records`);
                return records;
            } catch (error) {
                console.error("Error fetching maintenance records:", error);
                throw error;
            }
        },

        // Cache configuration
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)

        // Retry configuration with exponential backoff
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Enable/disable query based on params
        enabled,

        // Refetch configuration
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,

        // Error handling
        throwOnError: false,

        // Merge with custom options
        ...options,
    });
};

export default useGetLastMaintenance;

// Export types for consumers
export type { MaintenanceAPIResponse, UseGetLastMaintenanceParams };
