import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface SubmitMaintenanceFormData {
    subCategoryId: string;
    formData: { [key: string]: string };
}

const useSubmitMaintenanceForm = () => {
    return useMutation({
        mutationKey: ["maintenance", "submitForm"],
        mutationFn: async (data: SubmitMaintenanceFormData) => {
            const response = await api.post("/maintenance/submit", data);
            console.log("Form submission response:", response.data);
            return response.data.data;
        },
        onError: (error) => {
            console.error("Form submission failed:", error);
        },
    });
};

export default useSubmitMaintenanceForm;
