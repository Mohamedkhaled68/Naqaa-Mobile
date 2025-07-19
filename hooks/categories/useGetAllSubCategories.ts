import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetAllSubCategories = () => {
    return useQuery({
        queryKey: ["subCategories", "all"],
        queryFn: async () => {
            const response = await api.get("/subcategories");
            console.log("All subcategories:", response.data.data);
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useGetAllSubCategories;
