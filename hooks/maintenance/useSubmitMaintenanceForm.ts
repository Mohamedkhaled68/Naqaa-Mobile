import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";



interface SubmitMaintenanceFormData {
    subCategories: string[];
    customFieldData: {
        fieldName: string;
        fieldValue: string;
        subcategoryId: string;
    }[];
    description: string;
    cost: number;
    mechanicCost: number;
}


const useSubmitMaintenanceForm = () => {
    return useMutation({
        mutationKey: ["maintenance", "submitForm"],
        mutationFn: async (data: SubmitMaintenanceFormData) => {
            const response = await api.post("/maintenance-requests", data);
            console.log("Form submission response:", response.data);
            return response.data.data;
        },
        onError: (error) => {
            console.error("Form submission failed:", error);
        },
    });
};

export default useSubmitMaintenanceForm;
