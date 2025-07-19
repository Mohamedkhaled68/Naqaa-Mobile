import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const useUpdateCarMeterReading = () => {
    return useMutation({
        mutationKey: ["ocr", "updateCarMeterReading"],
        mutationFn: async (meterReading: any) => {
            const body = { meterReading };
            const response = await api.post(
                "/car-meter/update-driver-reading",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.data;
        },
        onError: (error) => {
            console.error("Mutation failed:", error);
        },
    });
};

export default useUpdateCarMeterReading;
