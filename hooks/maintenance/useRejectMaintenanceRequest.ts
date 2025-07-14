import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RejectMaintenanceRequestData {
    requestId: string;
    rejectionMessage: string;
}

const useRejectMaintenanceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["maintenance", "reject"],
        mutationFn: async ({
            requestId,
            rejectionMessage,
        }: RejectMaintenanceRequestData) => {
            const response = await api.patch(
                `/receivers/requests/${requestId}/reject`,
                {
                    rejectionMessage,
                }
            );
            return response.data.data;
        },
        onSuccess: (data, { requestId }) => {
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

            console.log("Request rejected successfully:", data);
        },
        onError: (error) => {
            console.error("Failed to reject request:", error);
        },
    });
};

export default useRejectMaintenanceRequest;
