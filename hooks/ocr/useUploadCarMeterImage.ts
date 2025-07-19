import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const useUploadCarMeterImage = () => {
    return useMutation({
        mutationKey: ["ocr"],
        mutationFn: async (imageFile: any) => {
            const formData = new FormData();

            // Change the field name from "image" to "meterImage" to match the API expectation
            formData.append("meterImage", imageFile);

            const response = await api.post("/car-meter/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                },
            });
            console.log("ddd", response.data.data.meterReading);

            return response.data.data;
        },
        onError: (error) => {
            console.error("Mutation failed:", error);
        },
    });
};

export default useUploadCarMeterImage;
