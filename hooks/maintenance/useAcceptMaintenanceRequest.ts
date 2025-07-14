import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAcceptMaintenanceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["maintenance", "accept"],
        mutationFn: async (requestId: string) => {
            const response = await api.patch(
                `/receivers/requests/${requestId}/accept`
            );
            return response.data.data;
        },
        onSuccess: (data, requestId) => {
            // Invalidate and refetch related queries
            queryClient.invalidateQueries({
                queryKey: ["receivers", "pendingRequests"],
            });
            queryClient.invalidateQueries({
                queryKey: ["receivers", "acceptedRequests"],
            });
            queryClient.invalidateQueries({
                queryKey: ["maintenanceRequest", requestId],
            });

            console.log("Request accepted successfully:", data);
        },
        onError: (error) => {
            console.error("Failed to accept request:", error);
        },
    });
};

export default useAcceptMaintenanceRequest;
