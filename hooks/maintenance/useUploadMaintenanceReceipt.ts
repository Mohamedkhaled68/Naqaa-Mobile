import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface UploadReceiptData {
    requestId: string;
    receiptFile: {
        uri: string;
        type: string;
        name: string;
    };
}

const useUploadMaintenanceReceipt = () => {
    return useMutation({
        mutationKey: ["maintenance", "uploadReceipt"],
        mutationFn: async ({ requestId, receiptFile }: UploadReceiptData) => {
            const formData = new FormData();

            // For React Native, FormData.append with file object
            formData.append("receiptImage", receiptFile as any, receiptFile.name);

            const response = await api.patch(
                `/maintenance-requests/${requestId}/upload-receipt`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                }
            );

            console.log("Receipt upload response:", response.data);
            return response.data.data;
        },
        onError: (error) => {
            console.error("Receipt upload failed:", error);
        },
    });
};

export default useUploadMaintenanceReceipt;
