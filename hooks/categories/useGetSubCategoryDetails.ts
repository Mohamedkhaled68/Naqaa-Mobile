import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetSubCategoryDetails = (id: string) => {
    return useQuery({
        queryKey: ["subCategory", "details", id],
        queryFn: async () => {
            const response = await api.get(`/subcategories/${id}`);
            console.log("Subcategory details:", response.data.data);
            return response.data.data;
        },
        enabled: !!id, // Only run the query if id is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useGetSubCategoryDetails;
